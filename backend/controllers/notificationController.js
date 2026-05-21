/**
 * Controlador de notificaciones in-app.
 * Consumido por: routes/notificationRoutes.js, bookingController (helper createNotification).
 */
const Notification = require('../models/Notification');

/**
 * @descripcion Lista las últimas notificaciones del usuario autenticado
 * @ruta GET /api/notifications
 * @acceso Privado
 */
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort('-createdAt')
      .limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

/**
 * @descripcion Marca todas las notificaciones del usuario como leídas
 * @ruta PATCH /api/notifications/read-all
 * @acceso Privado
 */
exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking notifications' });
  }
};

/**
 * @descripcion Marca una notificación específica como leída
 * @ruta PATCH /api/notifications/:id/read
 * @acceso Privado
 */
exports.markOneAsRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { read: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};

/**
 * Helper interno: crea notificación sin pasar por HTTP.
 * No es handler de ruta; lo invocan otros controladores.
 */
exports.createNotification = async (data) => {
  try {
    await Notification.create(data);
  } catch (err) {
    console.error('Error creating notification helper:', err);
  }
};
