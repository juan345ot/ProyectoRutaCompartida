/**
 * Sincronización entre Booking e interestRequests del Post.
 * Mantiene una sola fuente de verdad para permisos de contacto e historial.
 * Consumido por: bookingController, postController.
 */
const Post = require('../models/Post');

/**
 * Mantiene interestRequests alineado con el modelo Booking (fuente de verdad en itinerario).
 * Permite que historial, reseñas y permisos de contacto sigan funcionando sin duplicar lógica en el cliente.
 * @param {import('mongoose').Types.ObjectId|string} postId
 * @param {import('mongoose').Types.ObjectId|string} userId
 * @param {'pending'|'approved'|'rejected'} status
 */
async function syncInterestFromBooking(postId, userId, status) {
  const post = await Post.findById(postId);
  if (!post) return;

  const uid = userId.toString();
  const list = post.interestRequests || [];
  const entry = list.find((r) => (r.user?._id || r.user).toString() === uid);

  if (entry) {
    entry.status = status;
    if (status !== 'pending') entry.respondedAt = new Date();
  } else {
    // Primera vez: crea entrada en interestRequests
    post.interestRequests.push({
      user: userId,
      status,
      createdAt: new Date(),
      ...(status !== 'pending' ? { respondedAt: new Date() } : {}),
    });
  }
  await post.save();
}

module.exports = { syncInterestFromBooking };
