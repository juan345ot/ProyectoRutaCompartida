const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['new_booking', 'booking_approved', 'booking_rejected', 'new_message', 'system'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
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
