/**
 * Modelo Mongoose de usuario (registro, login, perfil, roles).
 * Consumido por: controladores de auth, users, posts, bookings, reviews, middleware de auth.
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Nombre visible en publicaciones y reseñas
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    // Identificador único de cuenta; usado en login
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    // Hash bcrypt; no se devuelve por defecto (select: false)
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    // Identificador de Google OAuth (login social)
    googleId: {
      type: String, // For Google OAuth
    },
    // Teléfono; visible solo a participantes aprobados del viaje
    phone: {
      type: String,
    },
    // URL o data URL de avatar
    profileImage: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    // Promedio de calificaciones recibidas (actualizado al crear Review)
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    // Rol de plataforma: usuario normal o administrador
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
