const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyRequests,
  getMyOffers,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking);
router.route('/my-requests').get(protect, getMyRequests);
router.route('/my-offers').get(protect, getMyOffers);
router.route('/:id').put(protect, updateBookingStatus);

module.exports = router;
