/**
 * Modelo de notificaciones in-app (reservas, sistema).
 * Consumido por: notificationController, bookingController (createNotification).
 */
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // Usuario que recibe la notificación
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    // Usuario que dispara el evento (opcional)
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    // Tipo de evento para iconos y filtros en el front
    type: {
      type: String,
      enum: ['new_booking', 'booking_approved', 'booking_rejected', 'new_message', 'system'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // Ruta relativa del front al hacer clic
    link: {
      type: String, // Where to redirect user when clicked
    },
    bookingId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Booking',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
