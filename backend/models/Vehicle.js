/**
 * Modelo de vehículo registrado por un usuario (ofertas de viaje).
 * Consumido por: vehicleController, postController (al crear/editar ofertas).
 */
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    // Dueño del vehículo
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    brand: {
      type: String,
      required: [true, 'La marca del vehículo es requerida.'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'El modelo del vehículo es requerido.'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'El año del vehículo es requerido.'],
      trim: true,
    },
    color: {
      type: String,
      required: [true, 'El color del vehículo es requerido.'],
      trim: true,
    },
    // Imagen en base64 (obligatoria para ofertas)
    photoDataUrl: {
      type: String,
      required: [true, 'La foto del vehículo es requerida.'],
    },
    licensePlate: {
      type: String,
      required: [true, 'La patente del vehículo es requerida.'],
      trim: true,
    },
    vtvExpiry: {
      type: Date,
    },
    insuranceVerified: {
      type: Boolean,
      default: false,
    },
    extraNotes: {
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

// Búsqueda rápida de vehículos por usuario
vehicleSchema.index({ owner: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
