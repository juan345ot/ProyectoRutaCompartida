const Booking = require('../models/Booking');
const Post = require('../models/Post');
const { createNotification } = require('./notificationController');

// @desc    Crear una nueva solicitud de rserva (Me interesa)
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { post: postId, type, seatsRequested, weightRequested, dimensionsRequested, message } = req.body;

    // Verificar si el post existe
    const postObj = await Post.findById(postId);
    if (!postObj) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // No permitir autorreservas
    if (postObj.author.toString() === req.user.id) {
       return res.status(400).json({ message: 'No puedes enviarte una solicitud a ti mismo' });
    }

    // Verificar si ya hay una solicitud
    const existing = await Booking.findOne({ post: postId, requester: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'Ya enviaste una solicitud para este viaje' });
    }

    const booking = await Booking.create({
      post: postId,
      requester: req.user.id,
      type,
      seatsRequested,
      weightRequested,
      dimensionsRequested,
      message
    });

    // Notify post owner
    await createNotification({
      recipient: postObj.author,
      sender: req.user.id,
      type: 'new_booking',
      message: `Nueva solicitud de ${type === 'passenger' ? 'pasajero' : 'paquete'} para tu viaje ${postObj.origin} → ${postObj.destination}`,
      link: `/travel/${postId}`,
      bookingId: booking._id
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener solicitudes hechas POR el usuario logueado (Mis Solicitudes)
// @route   GET /api/bookings/my-requests
// @access  Private
const getMyRequests = async (req, res) => {
  try {
    const bookings = await Booking.find({ requester: req.user.id })
      .sort({ createdAt: -1 })
      .populate({ path: 'requester', select: 'name profileImage phone email' })
      .populate({ path: 'post', select: 'origin destination departureDate category type author seats weight', strictPopulate: false });

    // Filtrar bookings cuyo post fue eliminado para no enviar datos inconsistentes
    const safe = bookings.filter(b => b.post != null);
    res.status(200).json(safe);
  } catch (error) {
    console.error('Error in getMyRequests:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener solicitudes hechas PARA los posts del usuario logueado (Mis Pasajeros/Paquetes)
// @route   GET /api/bookings/my-offers
// @access  Private
const getMyOffers = async (req, res) => {
  try {
    const userPosts = await Post.find({ author: req.user.id }).select('_id').lean();

    if (!userPosts || userPosts.length === 0) {
      return res.status(200).json([]);
    }

    const postIds = userPosts.map(p => p._id);

    const bookings = await Booking.find({ post: { $in: postIds } })
      .sort({ createdAt: -1 })
      .populate({ path: 'requester', select: 'name profileImage phone email', strictPopulate: false })
      .populate({ path: 'post', select: 'origin destination departureDate category type author seats weight', strictPopulate: false });

    // Descartar bookings cuyo post fue eliminado
    const safe = bookings.filter(b => b.post != null);
    res.status(200).json(safe);
  } catch (error) {
    console.error('Error in getMyOffers:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar estado de reserva (Aceptar/Rechazar)
// @route   PUT /api/bookings/:id
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' o 'rejected'
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // El post debe existir para verificar permisos
    const postObj = await Post.findById(booking.post._id || booking.post);
    if (!postObj) {
      return res.status(404).json({ message: 'Post relacionado no encontrado' });
    }

    // Verificar que el que aprueba es el dueño del viaje (creador del post)
    if (postObj.author.toString() !== req.user.id) {
       return res.status(401).json({ message: 'No tienes permiso para responder esta solicitud' });
    }

    // Lógica para restar capacidad si se aprueba
    if (status === 'approved' && booking.status !== 'approved') {
       if (booking.type === 'passenger' && booking.seatsRequested && postObj.seats !== undefined) {
          if (postObj.seats < booking.seatsRequested) {
             return res.status(400).json({ message: 'No hay suficientes asientos disponibles' });
          }
          postObj.seats -= booking.seatsRequested;
       } else if (booking.type === 'package' && booking.weightRequested && postObj.weight !== undefined) {
          if (postObj.weight < booking.weightRequested) {
             return res.status(400).json({ message: 'No hay suficiente capacidad de peso' });
          }
          postObj.weight -= booking.weightRequested;
       }
       await postObj.save();
    } else if (status !== 'approved' && booking.status === 'approved') {
       // Si se rechaza/cancela después de haber sido aprobada, restaurar la capacidad
        if (booking.type === 'passenger' && booking.seatsRequested && postObj.seats !== undefined) {
          postObj.seats += booking.seatsRequested;
       } else if (booking.type === 'package' && booking.weightRequested && postObj.weight !== undefined) {
          postObj.weight += booking.weightRequested;
       }
       await postObj.save();
    }

    booking.status = status;
    await booking.save();
    
    // Notify requester
    await createNotification({
      recipient: booking.requester._id || booking.requester,
      sender: req.user.id,
      type: status === 'approved' ? 'booking_approved' : 'booking_rejected',
      message: `Tu solicitud para el viaje ${postObj.origin} → ${postObj.destination} ha sido ${status === 'approved' ? 'APROBADA' : 'RECHAZADA'}.`,
      link: '/my-bookings',
      bookingId: booking._id
    });
    
    // Obtener un booking populado para devolverlo
    const updatedBooking = await Booking.findById(req.params.id)
      .populate({ path: 'requester', select: 'name profileImage phone email', strictPopulate: false })
      .populate({ path: 'post', select: 'origin destination departureDate category type author seats weight', strictPopulate: false });
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyRequests,
  getMyOffers,
  updateBookingStatus
};
