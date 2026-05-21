/**
 * Controlador de autenticación: registro, login, sesión y Google OAuth.
 * Consumido por: routes/authRoutes.js.
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/** Genera JWT de sesión con expiración de 30 días. */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @descripcion Registra un usuario nuevo con contraseña hasheada
 * @ruta POST /api/auth/register
 * @acceso Público
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'El usuario ya existe' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @descripcion Inicia sesión con email y contraseña
 * @ruta POST /api/auth/login
 * @acceso Público
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @descripcion Devuelve el usuario autenticado actual
 * @ruta GET /api/auth/me
 * @acceso Privado (Bearer token)
 */
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

/**
 * @descripcion Login o registro con credenciales de Google (crea usuario si no existe)
 * @ruta POST /api/auth/google
 * @acceso Público
 */
const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, profileImage } = req.body;
    
    let user = await User.findOne({ email });
    
    if (!user) {
        user = await User.create({
            name,
            email,
            googleId,
            profileImage
        });
    } else if (!user.googleId) {
        user.googleId = googleId;
        if(profileImage) user.profileImage = profileImage;
        await user.save();
    }
    
    res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
        },
        token: generateToken(user._id),
      });

  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  googleAuth
};
