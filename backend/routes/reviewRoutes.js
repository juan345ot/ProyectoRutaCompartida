/**
 * Rutas de calificaciones entre participantes de viajes.
 * Monta en server.js bajo /api/reviews.
 *
 * Endpoints:
 *   POST /              — crear reseña (protegido)
 *   GET  /me            — mis reseñas recibidas y emitidas
 *   GET  /user/:userId  — reseñas públicas de un usuario
 */
const express = require('express');
const router = express.Router();
const {
  createReview,
  getUserReviews,
  getMyReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/me', protect, getMyReviews);
router.get('/user/:userId', getUserReviews);

module.exports = router;
