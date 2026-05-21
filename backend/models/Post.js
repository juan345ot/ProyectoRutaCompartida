/**
 * Modelo de publicación de viaje (oferta u búsqueda, pasajero o paquete).
 * Incluye sub-esquemas embebidos para solicitudes de interés y datos de vehículo.
 * Consumido por: postController, bookingController, userController, cronJobs, reviewController.
 */
const mongoose = require('mongoose');

/** Solicitud de interés en un viaje (legacy + sincronización con Booking) */
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

/** Datos de vehículo embebidos en la oferta (alternativa a ref Vehicle) */
const vehicleSchema = new mongoose.Schema(
  {
    brand: { type: String, trim: true },       // Marca: Ford, Toyota...
    model: { type: String, trim: true },       // Modelo: Fiesta, Corolla...
    year: { type: String, trim: true },        // Año
    color: { type: String, trim: true },       // Color: Rojo, Blanco...
    photoDataUrl: { type: String },            // base64 image; only for offers
    licensePlate: { type: String, trim: true },
    vtvExpiry: { type: Date },
    insuranceVerified: { type: Boolean, default: false },
    extraNotes: { type: String, maxlength: 300 },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    // offer = ofrezco lugar | request = busco lugar
    type: {
      type: String,
      enum: ['offer', 'request'],
      required: true,
    },
    // passenger = personas | package = envíos
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
    // Texto legible de capacidad (ej. "3 lugares", "50 kg")
    capacity: {
      type: String,
      required: true,
    },
    seats: {
      type: Number, // Asientos disponibles (para pasajeros)
    },
    weight: {
      type: Number, // Peso máximo en kg (para paquetes)
    },
    dimensions: {
      length: { type: Number }, // cm
      width: { type: Number },
      height: { type: Number },
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
    // ObjectId de Vehicle o subdocumento embebido (Mixed)
    vehicle: mongoose.Schema.Types.Mixed,
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

// Búsqueda por texto en listados
postSchema.index({ origin: 'text', destination: 'text', description: 'text' });
postSchema.index({ author: 1, status: 1 });

module.exports = mongoose.model('Post', postSchema);
