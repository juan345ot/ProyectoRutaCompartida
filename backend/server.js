require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');

// Connect to database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Trust proxy for production environments (like Render, Heroku, etc.)
app.set('trust proxy', 1);

// Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '2mb' }));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://ruta-compartida-web.vercel.app' // Optional: actual production URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Limitadores de peticiones
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 150, // Límite por IP
  message: { message: 'Demasiadas peticiones desde esta IP, por favor intenta en 15 minutos.' }
});

app.use('/api/', apiLimiter);
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Import route definitions
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`${err.message}`, { 
    url: req.originalUrl, 
    method: req.method, 
    stack: err.stack 
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
