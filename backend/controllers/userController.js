const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get current user's posts
// @route   GET /api/users/me/posts
// @access  Private
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate('interestRequests.user', 'name phone profileImage')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Viajes completados separados: como conductor (ofreciste / manejaste) o como pasajero (buscaste / ibas de copilotaje)
 */
const getMyHistory = async (req, res) => {
  try {
    const uid = req.user.id.toString();

    const posts = await Post.find({
      status: 'completed',
      $or: [
        { author: req.user.id },
        { interestRequests: { $elemMatch: { user: req.user.id, status: 'approved' } } },
      ],
    })
      .populate('author', 'name profileImage averageRating phone')
      .populate('interestRequests.user', 'name profileImage averageRating phone')
      .sort({ departureDate: -1 });

    const offered = []; // conductor en offer o quien llevaba en request
    const joined = []; // pasajero en offer o quien pedía en request

    for (const p of posts) {
      const plain = p.toObject();
      const authorId = plain.author._id ? plain.author._id.toString() : plain.author.toString();
      const iApproved = (plain.interestRequests || []).some(
        (r) => r.user && r.user._id?.toString() === uid && r.status === 'approved'
      );

      if (plain.type === 'offer') {
        if (authorId === uid) offered.push(plain);
        else if (iApproved) joined.push(plain);
      } else {
        // request: autor busca lugar = pasajero
        if (authorId === uid) joined.push(plain);
        else if (iApproved) offered.push(plain);
      }
    }

    res.status(200).json({ offered, joined, all: posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Solicitudes pendientes para publicaciones donde soy autor (aviso al conductor)
 */
const getMyPendingTripRequests = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user.id,
      status: 'active',
      interestRequests: { $elemMatch: { status: 'pending' } },
    })
      .populate('interestRequests.user', 'name profileImage')
      .select('origin destination departureDate type category interestRequests');

    const items = [];
    for (const p of posts) {
      for (const ir of p.interestRequests || []) {
        if (ir.status === 'pending' && ir.user) {
          items.push({
            postId: p._id,
            origin: p.origin,
            destination: p.destination,
            departureDate: p.departureDate,
            type: p.type,
            request: ir,
          });
        }
      }
    }

    res.status(200).json({ pending: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin statistics
// @route   GET /api/users/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    const userRole = req.user.role; // Asegúrate de que este rol esté en req.user
    if (userRole !== 'admin') {
      // Para desarrollo/pruebas si el email sigue siendo juanignacio295@gmail.com lo dejamos temporalmente,
      // pero preferiblemente rechazar si req.user.role !== 'admin'.
      if (req.user.email !== 'juanignacio295@gmail.com') {
         return res.status(403).json({ message: 'No autorizado. Se requiere rol de administrador.' });
      }
    }

    const totalUsers = await User.countDocuments();
    const activePosts = await Post.countDocuments({ status: 'active' });
    const completedPosts = await Post.countDocuments({ status: 'completed' });
    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      totalUsers,
      activePosts,
      completedPosts,
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.phone = phone !== undefined ? phone : user.phone;
    if (profileImage !== undefined && String(profileImage).length < 950000) {
      user.profileImage = profileImage;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      profileImage: updatedUser.profileImage,
      averageRating: updatedUser.averageRating,
      totalReviews: updatedUser.totalReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyPosts,
  getMyHistory,
  getMyPendingTripRequests,
  updateProfile,
  getAdminStats,
};
