/**
 * Middleware de autenticación JWT (rutas protegidas).
 * Verifica Bearer token y adjunta req.user sin contraseña.
 * Consumido por: todas las routes que usan protect.
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Exige Authorization: Bearer <token> válido.
 * En test no loguea warnings de token inválido para no ensuciar la salida.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      next();
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        const logger = require('./logger');
        logger.warn('Auth middleware:', error.message);
      }
      const message = error.name === 'TokenExpiredError' 
        ? 'Sesión expirada, por favor inicia sesión de nuevo' 
        : 'No autorizado, token inválido';
      res.status(401).json({ message });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token de acceso' });
  }
};

module.exports = { protect };
