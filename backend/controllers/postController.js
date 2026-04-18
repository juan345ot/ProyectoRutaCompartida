const Post = require('../models/Post');
const User = require('../models/User');

const PLACEHOLDER_SUBSTRINGS = ['via.placeholder', 'ui-avatars.com', 'placeholder'];

function hasRealProfilePhoto(user) {
  if (!user?.profileImage) return false;
  const u = String(user.profileImage).toLowerCase();
  return !PLACEHOLDER_SUBSTRINGS.some((p) => u.includes(p));
}

function stripAuthorContact(author) {
  if (!author) return author;
  const o = typeof author.toObject === 'function' ? author.toObject() : { ...author };
  delete o.phone;
  delete o.email;
  return o;
}

function viewerIdString(viewer) {
  if (!viewer) return null;
  return viewer._id ? viewer._id.toString() : String(viewer);
}

function isApprovedParticipant(post, userId) {
  if (!userId) return false;
  const uid = userId.toString();
  const authorId = post.author?._id ? post.author._id.toString() : post.author?.toString();
  if (authorId === uid) return true;
  const requests = post.interestRequests || [];
  return requests.some(
    (r) => (r.user?._id || r.user)?.toString() === uid && r.status === 'approved'
  );
}

function sanitizePostForViewer(postDoc, viewerUser) {
  const post = postDoc.toObject ? postDoc.toObject({ virtuals: true }) : { ...postDoc };
  const vid = viewerIdString(viewerUser);
  if (post.author && !isApprovedParticipant(postDoc, vid)) {
    post.author = stripAuthorContact(post.author);
  }
  return post;
}

function publicListAuthor(author) {
  return stripAuthorContact(author);
}

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public (sin teléfono ni email del autor en listado)
const getPosts = async (req, res) => {
  try {
    const { origin, destination, category, type, date, limit } = req.query;

    let query = { status: 'active' };

    if (origin) query.origin = { $regex: origin, $options: 'i' };
    if (destination) query.destination = { $regex: destination, $options: 'i' };
    if (category) query.category = category;
    if (type) query.type = type;

    // Ocultar viajes antiguos: solo devolver los que parten en el futuro (dando 30 mins de gracia por retrasos lógicos)
    const timeLimit = new Date(Date.now() - 30 * 60 * 1000);
    query.departureDate = { $gte: timeLimit };

    if (date) {
      const requestedDate = new Date(date);
      // Solo restringir a la fecha solicitada si es mayor que nuestro límite de tiempo actual
      if (requestedDate > timeLimit) {
        query.departureDate = { $gte: requestedDate };
      }
    }

    const posts = await Post.find(query)
      .populate('author', 'name profileImage')
      .sort({ departureDate: 1 })
      .limit(limit ? parseInt(limit, 10) : 50);

    const safe = posts.map((p) => {
      const o = p.toObject();
      o.author = publicListAuthor(p.author);
      return o;
    });

    res.status(200).json(safe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post (contacto solo si soy autor o participante aprobado)
// @route   GET /api/posts/:id
// @access  Public + optionalAuth
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profileImage phone email')
      .populate('interestRequests.user', 'name profileImage');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const viewer = req.user || null;
    const payload = sanitizePostForViewer(post, viewer);
    payload._canViewContact = isApprovedParticipant(post, viewerIdString(viewer));
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const {
      type,
      category,
      origin,
      destination,
      departureDate,
      arrivalApprox,
      capacity,
      seats,
      weight,
      dimensions,
      description,
      vehicle,
    } = req.body;

    const authorDoc = await User.findById(req.user.id);

    if (departureDate) {
      const date = new Date(departureDate);
      
      // Validar que la fecha no sea en el pasado (con un pequeño margen de 10 minutos por demoras de submit)
      if (date.getTime() < Date.now() - 10 * 60 * 1000) {
        return res.status(400).json({ message: 'La fecha y hora del viaje no puede ser en el pasado.' });
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const existing = await Post.findOne({
        author: req.user.id,
        status: 'active',
        origin: { $regex: new RegExp(`^${String(origin).trim()}$`, 'i') },
        destination: { $regex: new RegExp(`^${String(destination).trim()}$`, 'i') },
        departureDate: { $gte: startOfDay, $lte: endOfDay },
      });

      if (existing) {
        return res.status(400).json({
          message:
            'Ya tenés una publicación activa para esta ruta y fecha. Eliminá la anterior antes de crear una nueva.',
        });
      }
    }

    if (type === 'offer') {
      if (!hasRealProfilePhoto(authorDoc)) {
        return res.status(403).json({
          message:
            'Para ofrecer un viaje necesitás subir una foto de perfil real en Mis Datos. Podés publicar búsquedas sin foto.',
        });
      }
      if (!vehicle?.photoDataUrl || String(vehicle.photoDataUrl).length < 50) {
        return res.status(400).json({ message: 'Para ofrecer lugar es obligatoria una foto del vehículo.' });
      }
      if (String(vehicle.photoDataUrl).length > 900000) {
        return res.status(400).json({ message: 'La imagen del vehículo es demasiado grande.' });
      }
      if (!vehicle.licensePlate || !String(vehicle.licensePlate).trim()) {
        return res.status(400).json({ message: 'Indicá la patente del vehículo.' });
      }
    }

    const postData = {
      type,
      category,
      origin,
      destination,
      departureDate,
      arrivalApprox: arrivalApprox || undefined,
      capacity: capacity ? String(capacity) : (category === 'passenger' ? `${seats} lugares` : `${weight} kg`),
      seats,
      weight,
      dimensions,
      description,
      author: req.user.id,
    };

    if (type === 'offer' && vehicle) {
      postData.vehicle = {
        brand: vehicle.brand ? String(vehicle.brand).trim() : undefined,
        model: vehicle.model ? String(vehicle.model).trim() : undefined,
        color: vehicle.color ? String(vehicle.color).trim() : undefined,
        photoDataUrl: vehicle.photoDataUrl,
        licensePlate: String(vehicle.licensePlate).trim(),
        extraNotes: vehicle.extraNotes ? String(vehicle.extraNotes).slice(0, 300) : undefined,
      };
    }

    const createdPost = await Post.create(postData);
    const populated = await Post.findById(createdPost._id).populate('author', 'name profileImage phone email');

    res.status(201).json(sanitizePostForViewer(populated, req.user));
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Solicitar unirse al viaje
// @route   POST /api/posts/:id/interest
// @access  Private
const expressInterest = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.status !== 'active') {
      return res.status(404).json({ message: 'Publicación no disponible' });
    }
    if (post.author.toString() === req.user.id) {
      return res.status(400).json({ message: 'No podés solicitar tu propia publicación' });
    }

    const uid = req.user.id;
    const existing = (post.interestRequests || []).find(
      (r) => r.user.toString() === uid && (r.status === 'pending' || r.status === 'approved')
    );
    if (existing) {
      return res.status(400).json({ message: 'Ya registramos tu interés en este viaje' });
    }

    post.interestRequests.push({
      user: uid,
      status: 'pending',
      createdAt: new Date(),
    });
    await post.save();

    const populated = await Post.findById(post._id).populate('author', 'name profileImage phone email');
    res.status(200).json(sanitizePostForViewer(populated, req.user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Aprobar o rechazar interés
// @route   PATCH /api/posts/:id/interest/:userId
// @access  Private (solo autor)
const respondToInterest = async (req, res) => {
  try {
    const { action } = req.body;
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Acción inválida' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Solo el autor puede gestionar solicitudes' });
    }

    const targetUserId = req.params.userId;
    const entry = (post.interestRequests || []).find(
      (r) => r.user.toString() === targetUserId && r.status === 'pending'
    );
    if (!entry) {
      return res.status(404).json({ message: 'No hay solicitud pendiente de ese usuario' });
    }

    entry.status = action === 'approve' ? 'approved' : 'rejected';
    entry.respondedAt = new Date();
    await post.save();

    const populated = await Post.findById(post._id).populate('author', 'name profileImage phone email');
    res.status(200).json(sanitizePostForViewer(populated, req.user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Marcar viaje completado (para historial y calificaciones)
// @route   PATCH /api/posts/:id/complete
// @access  Private — autor o participante aprobado
const markPostComplete = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!isApprovedParticipant(post, req.user.id)) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    post.status = 'completed';
    await post.save();
    res.status(200).json({ message: 'Viaje marcado como completado', id: post._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this post' });
    }

    await post.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update post
// @route   PATCH /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado para editar esta publicación' });
    }

    const {
      type,
      category,
      origin,
      destination,
      departureDate,
      arrivalApprox,
      capacity,
      seats,
      weight,
      dimensions,
      description,
      vehicle,
    } = req.body;

    // Actualizar campos básicos
    if (type) post.type = type;
    if (category) post.category = category;
    if (origin) post.origin = origin;
    if (destination) post.destination = destination;
    if (departureDate) post.departureDate = departureDate;
    if (arrivalApprox !== undefined) post.arrivalApprox = arrivalApprox;
    
    // Capacidad: si se envía capacity explícito se usa; si no se calcula
    if (capacity) {
        post.capacity = String(capacity);
    } else if (seats !== undefined || weight !== undefined) {
        post.capacity = category === 'passenger' ? `${seats || 0} lugares` : `${weight || 0} kg`;
    }
    
    if (seats !== undefined) post.seats = seats;
    if (weight !== undefined) post.weight = weight;
    if (dimensions) post.dimensions = dimensions;
    if (description !== undefined) post.description = description;

    // Vehículo (solo si es oferta)
    if (post.type === 'offer' && vehicle) {
      post.vehicle = {
        ...post.vehicle,
        photoDataUrl: vehicle.photoDataUrl || post.vehicle?.photoDataUrl,
        licensePlate: (vehicle.licensePlate || post.vehicle?.licensePlate || '').trim(),
        vtvExpiry: vehicle.vtvExpiry ? new Date(vehicle.vtvExpiry) : post.vehicle?.vtvExpiry,
        insuranceVerified: vehicle.insuranceVerified !== undefined ? !!vehicle.insuranceVerified : !!post.vehicle?.insuranceVerified,
        extraNotes: vehicle.extraNotes !== undefined ? String(vehicle.extraNotes).slice(0, 300) : post.vehicle?.extraNotes,
      };
    }

    await post.save();
    const updated = await Post.findById(post._id).populate('author', 'name profileImage phone email');
    res.status(200).json(sanitizePostForViewer(updated, req.user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  expressInterest,
  respondToInterest,
  markPostComplete,
  isApprovedParticipant,
};
