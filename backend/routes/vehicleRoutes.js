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
