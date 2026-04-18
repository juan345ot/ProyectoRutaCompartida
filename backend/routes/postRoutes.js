const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  expressInterest,
  respondToInterest,
  markPostComplete,
  updatePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { optionalAuth } = require('../middleware/optionalAuth');

const validatePost = [
  check('type', 'El tipo es requerido y debe ser offer o request').isIn(['offer', 'request']),
  check('category', 'La categoría es requerida').isIn(['passenger', 'package']),
  check('origin', 'El origen es requerido').not().isEmpty().trim(),
  check('destination', 'El destino es requerido').not().isEmpty().trim(),
  check('departureDate', 'Fecha de salida inválida').isISO8601(),
  check('capacity', 'Indicá capacidad (texto o número)').not().isEmpty().trim().isLength({ max: 80 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array(),
      });
    }
    next();
  },
];

router.route('/').get(getPosts).post(protect, validatePost, createPost);
router.route('/:id').get(optionalAuth, getPost).patch(protect, validatePost, updatePost).delete(protect, deletePost);
router.post('/:id/interest', protect, expressInterest);
router.patch('/:id/interest/:userId', protect, respondToInterest);
router.patch('/:id/complete', protect, markPostComplete);

module.exports = router;
