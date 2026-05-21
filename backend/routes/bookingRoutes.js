/**
 * Rutas de reservas / solicitudes "Me interesa".
 * Monta en server.js bajo /api/bookings.
 *
 * Endpoints:
 *   POST   /              — crear solicitud
 *   GET    /my-requests   — solicitudes enviadas por el usuario
 *   GET    /my-offers     — solicitudes recibidas en mis viajes
 *   PUT|PATCH /:id        — aprobar o rechazar (solo autor del viaje)
 */
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyRequests,
  getMyOffers,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking);
router.route('/my-requests').get(protect, getMyRequests);
router.route('/my-offers').get(protect, getMyOffers);
router.route('/:id').put(protect, updateBookingStatus).patch(protect, updateBookingStatus);

module.exports = router;
