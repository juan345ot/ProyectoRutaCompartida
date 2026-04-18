const Post = require('../models/Post');
const Booking = require('../models/Booking');
const logger = require('../middleware/logger');

const archiveExpiredPosts = async () => {
  try {
    const now = new Date();
    // Encuentra todos los viajes activos cuya fecha de partida ya pasó
    const expiredPosts = await Post.find({
      status: 'active',
      departureDate: { $lt: now }
    });

    if (expiredPosts.length === 0) return;

    let archivedCount = 0;

    for (const post of expiredPosts) {
      // Verificamos si tiene reservas aprobadas en el modelo Booking
      const hasApprovedBookings = await Booking.exists({
        post: post._id,
        status: 'approved'
      });

      // Si no tiene a nadie aprobado, el viaje pasó y se finaliza automáticamente.
      // Si SÍ tiene a alguien, se "guarda" (queda en 'active') hasta que el autor lo confirme manualmente.
      if (!hasApprovedBookings) {
        post.status = 'completed';
        await post.save();
        archivedCount++;
      }
    }

    if (archivedCount > 0) {
      logger.info(`Cron Job: Archivados automáticamente ${archivedCount} viajes expirados sin pasajeros confirmados.`);
    }

  } catch (error) {
    logger.error(`Error en cron job archiveExpiredPosts: ${error.message}`);
  }
};

const startCronJobs = () => {
  // Ejecutar inmediatamente al iniciar y luego cada 15 minutos (900,000 ms)
  setTimeout(archiveExpiredPosts, 5000); // 5 seg delay inicial
  setInterval(archiveExpiredPosts, 15 * 60 * 1000);
  logger.info('Cron Jobs iniciados correctamente.');
};

module.exports = { startCronJobs, archiveExpiredPosts };
