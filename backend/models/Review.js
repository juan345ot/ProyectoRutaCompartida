const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
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
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
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

reviewSchema.index({ post: 1, author: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
