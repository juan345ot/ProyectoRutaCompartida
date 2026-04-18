const express = require('express');
const router = express.Router();
const {
  getMyPosts,
  getMyHistory,
  getMyPendingTripRequests,
  updateProfile,
  getAdminStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me/posts', protect, getMyPosts);
router.get('/me/history', protect, getMyHistory);
router.get('/me/trip-requests', protect, getMyPendingTripRequests);
router.put('/me', protect, updateProfile);
router.get('/admin/stats', protect, getAdminStats);

module.exports = router;
