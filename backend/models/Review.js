/**
 * Modelo de calificaciones entre participantes de un viaje completado.
 * Consumido por: reviewController (creación y listados).
 */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // Puntuación 1–5
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      maxlength: 500,
    },
    // Quien escribe la reseña
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    // Usuario calificado
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    // Viaje asociado (debe estar completed)
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: true,
    },
    /** Quién califica: conductor o pasajero (según el tipo de publicación) */
    reviewerRole: {
      type: String,
      enum: ['driver', 'passenger'],
    },
    recipientRole: {
      type: String,
      enum: ['driver', 'passenger'],
    },
  },
  {
    timestamps: true,
  }
);

// Una reseña por trío autor–destinatario–viaje
reviewSchema.index({ post: 1, author: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
