/**
 * Rutas de autenticación y sesión.
 * Monta en server.js bajo /api/auth.
 *
 * Endpoints:
 *   POST /register  — registro con validación
 *   POST /login     — inicio de sesión
 *   POST /google    — login/registro con Google
 *   GET  /me        — usuario actual (protegido)
 */
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {
  registerUser,
  loginUser,
  getMe,
  googleAuth
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const validateRegister = [
  check('name', 'El nombre es obligatorio').not().isEmpty().trim(),
  check('email', 'Incluye un email válido').isEmail().normalizeEmail(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  check('email', 'Incluye un email válido').isEmail().normalizeEmail(),
  check('password', 'La contraseña es obligatoria').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
  }
];

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);

module.exports = router;
