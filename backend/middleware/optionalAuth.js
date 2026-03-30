const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Si hay Bearer válido, setea req.user; si no, sigue sin error.
 */
const optionalAuth = async (req, res, next) => {
  req.user = null;
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer')) {
    return next();
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user) req.user = user;
  } catch {
    // token inválido: tratamos como anónimo
  }
  next();
};

module.exports = { optionalAuth };
