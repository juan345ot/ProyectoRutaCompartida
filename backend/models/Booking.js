const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: true,
    },
    requester: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    type: {
      type: String, // 'passenger' or 'package'  to match post
      required: true,
    },
    // For passengers
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
    // For packages
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
