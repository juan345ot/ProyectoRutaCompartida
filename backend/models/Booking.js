/**
 * Modelo de reserva / solicitud "Me interesa" sobre un viaje (Post).
 * Consumido por: bookingController, cronJobs, postController (sincronización).
 */
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Viaje al que se aplica la solicitud
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: true,
    },
    // Usuario que solicita lugar o envío de paquete
    requester: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    // Estado de la solicitud por parte del autor del viaje
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    // Alineado con post.category: passenger | package
    type: {
      type: String, // 'passenger' or 'package'  to match post
      required: true,
    },
    // --- Campos para pasajeros ---
    seatsRequested: {
      type: Number,
    },
    luggageSize: {
      type: String, // 'small', 'medium', 'large', 'none'
    },
    pets: {
      type: Boolean,
      default: false,
    },
    smoker: {
      type: Boolean,
      default: false,
    },
    // --- Campos para paquetes ---
    weightRequested: {
      type: Number,
    },
    packageCategory: {
      type: String, // 'fragile', 'electronic', 'documents', 'clothing', 'other'
    },
    fragile: {
      type: Boolean,
      default: false,
    },
    dimensionsRequested: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    // Mensaje opcional al conductor
    message: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Booking', bookingSchema);
