/**
 * Controlador CRUD de vehículos del usuario autenticado.
 * Consumido por: routes/vehicleRoutes.js.
 */
const Vehicle = require('../models/Vehicle');
const Post = require('../models/Post');

/**
 * @descripcion Lista todos los vehículos registrados por el usuario
 * @ruta GET /api/vehicles
 * @acceso Privado
 */
const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @descripcion Registra un vehículo nuevo en la cuenta del usuario
 * @ruta POST /api/vehicles
 * @acceso Privado
 */
const createVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      color,
      photoDataUrl,
      licensePlate,
      vtvExpiry,
      extraNotes,
    } = req.body;

    if (!brand || !model || !year || !color || !photoDataUrl || !licensePlate) {
      return res.status(400).json({ message: 'Todos los campos requeridos deben ser provistos.' });
    }

    const vehicle = await Vehicle.create({
      owner: req.user.id,
      brand,
      model,
      year,
      color,
      photoDataUrl,
      licensePlate,
      vtvExpiry: vtvExpiry || undefined,
      extraNotes,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @descripcion Actualiza datos de un vehículo propio
 * @ruta PATCH /api/vehicles/:id
 * @acceso Privado (solo dueño)
 */
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehículo no encontrado.' });
    }

    // Verificar que el usuario autenticado sea el dueño del vehículo
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permisos para modificar este vehículo.' });
    }

    const {
      brand,
      model,
      year,
      color,
      photoDataUrl,
      licensePlate,
      vtvExpiry,
      extraNotes,
    } = req.body;

    if (brand !== undefined) vehicle.brand = brand;
    if (model !== undefined) vehicle.model = model;
    if (year !== undefined) vehicle.year = year;
    if (color !== undefined) vehicle.color = color;
    if (photoDataUrl !== undefined) vehicle.photoDataUrl = photoDataUrl;
    if (licensePlate !== undefined) vehicle.licensePlate = licensePlate;
    if (vtvExpiry !== undefined) vehicle.vtvExpiry = vtvExpiry || undefined;
    if (extraNotes !== undefined) vehicle.extraNotes = extraNotes;

    await vehicle.save();

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @descripcion Elimina un vehículo si no está ligado a viajes activos
 * @ruta DELETE /api/vehicles/:id
 * @acceso Privado (solo dueño)
 */
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehículo no encontrado.' });
    }

    // Verificar propiedad
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este vehículo.' });
    }

    // Opcional: ¿tiene publicaciones activas?
    // Verificamos si hay publicaciones activas ofreciendo viajes con este vehículo
    const activePosts = await Post.find({
      vehicle: vehicle._id,
      status: 'active',
    });

    if (activePosts.length > 0) {
      return res.status(400).json({
        message: 'No puedes eliminar un vehículo que está asociado a viajes activos. Finaliza o elimina esos viajes antes.',
        posts: activePosts.map(p => p._id),
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
