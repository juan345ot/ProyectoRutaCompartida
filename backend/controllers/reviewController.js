const Review = require('../models/Review');
const User = require('../models/User');
const Post = require('../models/Post');
const { isApprovedParticipant } = require('./postController');

function uid(userId) {
  return userId?.toString ? userId.toString() : String(userId);
}

/** Para offer: autor = conductor. Para request: autor = pasajero; aprobados = conductores */
function getDriverIds(post) {
  const author = post.author._id ? post.author._id : post.author;
  const auid = uid(author);
  if (post.type === 'offer') return new Set([auid]);
  return new Set(
    (post.interestRequests || [])
      .filter((r) => r.status === 'approved')
      .map((r) => uid(r.user))
  );
}

function getPassengerIds(post) {
  const author = post.author._id ? post.author._id : post.author;
  const auid = uid(author);
  if (post.type === 'request') return new Set([auid]);
  return new Set(
    (post.interestRequests || [])
      .filter((r) => r.status === 'approved')
      .map((r) => uid(r.user))
  );
}

function areTripCounterparts(post, a, b) {
  const drivers = getDriverIds(post);
  const passengers = getPassengerIds(post);
  const au = uid(a);
  const bu = uid(b);
  const aDriver = drivers.has(au);
  const aPass = passengers.has(au);
  const bDriver = drivers.has(bu);
  const bPass = passengers.has(bu);
  return (aDriver && bPass) || (aPass && bDriver);
}

// @desc    Create new review (solo viajes completados, conductor ↔ pasajero)
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { rating, comment, recipientId, postId } = req.body;
    const authorId = req.user._id ? req.user._id.toString() : req.user.id;

    if (!rating || !comment || !recipientId || !postId) {
      return res.status(400).json({ message: 'Completá todos los campos' });
    }

    if (authorId === recipientId) {
      return res.status(400).json({ message: 'No podés calificarte a vos mismo' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Viaje no encontrado' });
    }

    if (post.status !== 'completed') {
      return res.status(400).json({ message: 'Solo podés calificar viajes marcados como completados' });
    }

    if (!isApprovedParticipant(post, authorId) || !isApprovedParticipant(post, recipientId)) {
      return res.status(403).json({ message: 'Solo participantes del viaje pueden dejar calificaciones' });
    }

    if (!areTripCounterparts(post, authorId, recipientId)) {
      return res.status(400).json({
        message: 'La calificación debe ser entre conductor y pasajero del mismo viaje',
      });
    }

    const drivers = getDriverIds(post);
    const reviewerRole = drivers.has(authorId) ? 'driver' : 'passenger';
    const recipientRole = drivers.has(recipientId) ? 'driver' : 'passenger';

    const review = await Review.create({
      rating,
      comment,
      author: authorId,
      recipient: recipientId,
      post: postId,
      reviewerRole,
      recipientRole,
    });

    const allReviews = await Review.find({ recipient: recipientId });
    const totalReviews = allReviews.length;
    const sumRatings = allReviews.reduce((acc, item) => acc + item.rating, 0);
    const averageRating = sumRatings / totalReviews;

    await User.findByIdAndUpdate(recipientId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya calificaste a este usuario en este viaje' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reviews recibidas y emitidas del usuario logueado
// @route   GET /api/reviews/me
// @access  Private
const getMyReviews = async (req, res) => {
  try {
    const me = req.user._id || req.user.id;
    const [received, given] = await Promise.all([
      Review.find({ recipient: me })
        .populate('author', 'name profileImage')
        .populate('post', 'origin destination type')
        .sort({ createdAt: -1 }),
      Review.find({ author: me })
        .populate('recipient', 'name profileImage')
        .populate('post', 'origin destination type')
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({ received, given });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a specific user (público)
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ recipient: req.params.userId })
      .populate('author', 'name profileImage')
      .populate('post', 'origin destination type')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getUserReviews,
  getMyReviews,
};
