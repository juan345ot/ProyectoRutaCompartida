/**
 * Rutas de perfil, publicaciones propias e historial del usuario.
 * Monta en server.js bajo /api/users.
 *
 * Endpoints:
 *   GET  /me/posts         — mis publicaciones activas
 *   GET  /me/history       — viajes completados (ofrecidos / unidos)
 *   GET  /me/trip-requests — solicitudes pendientes en mis viajes
 *   PUT  /me               — actualizar perfil
 *   GET  /admin/stats      — estadísticas (admin)
 */
const express = require('express');
const router = express.Router();
const {
  getMyPosts,
  getMyHistory,
  getMyPendingTripRequests,
  updateProfile,
  getAdminStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me/posts', protect, getMyPosts);
router.get('/me/history', protect, getMyHistory);
router.get('/me/trip-requests', protect, getMyPendingTripRequests);
router.put('/me', protect, updateProfile);
router.get('/admin/stats', protect, getAdminStats);

module.exports = router;
