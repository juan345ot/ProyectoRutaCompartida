/**
 * Rutas CRUD de vehículos del usuario autenticado.
 * Monta en server.js bajo /api/vehicles.
 *
 * Endpoints:
 *   GET    /      — listar mis vehículos
 *   POST   /      — registrar vehículo
 *   PATCH  /:id   — actualizar vehículo propio
 *   DELETE /:id   — eliminar (si no hay viajes activos asociados)
 */
const express = require('express');
const router = express.Router();
const {
  getMyVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMyVehicles)
  .post(protect, createVehicle);

router.route('/:id')
  .patch(protect, updateVehicle)
  .delete(protect, deleteVehicle);

module.exports = router;
