const mongoose = require('mongoose');

const interestRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    respondedAt: {
      type: Date,
    },
  },
  { _id: false }
);

const vehicleSchema = new mongoose.Schema(
  {
    photoDataUrl: { type: String }, // base64 image; only for offers
    licensePlate: { type: String, trim: true },
    vtvExpiry: { type: Date },
    insuranceVerified: { type: Boolean, default: false },
    extraNotes: { type: String, maxlength: 300 },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['offer', 'request'],
      required: true,
    },
    category: {
      type: String,
      enum: ['passenger', 'package'],
      required: true,
    },
    origin: {
      type: String,
      required: [true, 'Please add an origin'],
    },
    destination: {
      type: String,
      required: [true, 'Please add a destination'],
    },
    departureDate: {
      type: Date,
      required: [true, 'Please add a departure date'],
    },
    /** Hora o texto de llegada estimada (ej. "20:30" o "según tráfico") */
    arrivalApprox: {
      type: String,
      maxlength: 120,
    },
    capacity: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    vehicle: vehicleSchema,
    interestRequests: {
      type: [interestRequestSchema],
      default: [],
    },
    /** @deprecated migrar a interestRequests; se mantiene por compatibilidad con datos viejos */
    interestedUsers: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        contactedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

postSchema.index({ origin: 'text', destination: 'text', description: 'text' });
postSchema.index({ author: 1, status: 1 });

module.exports = mongoose.model('Post', postSchema);
