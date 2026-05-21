/**
 * Rutas de notificaciones in-app del usuario.
 * Monta en server.js bajo /api/notifications (todas protegidas).
 *
 * Endpoints:
 *   GET   /           — últimas notificaciones
 *   PATCH /read-all   — marcar todas como leídas
 *   PATCH /:id/read   — marcar una como leída
 */
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', notificationController.getNotifications);
router.patch('/read-all', notificationController.markAsRead);
router.patch('/:id/read', notificationController.markOneAsRead);

module.exports = router;
