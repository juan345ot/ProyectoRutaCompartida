/**
 * Tests de integración de reservas y sincronización con interestRequests.
 * Verifica creación, aprobación y compatibilidad PUT/PATCH.
 */
const request = require('supertest');
const app = require('../server');
const Post = require('../models/Post');
const User = require('../models/User');

describe('Booking API', () => {
  let ownerToken;
  let guestToken;
  let guestId;
  let postId;

  beforeEach(async () => {
    const ownerReg = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Conductor Test',
        email: 'owner-booking@test.com',
        password: 'password123',
        phone: '1111111111',
      });
    ownerToken = ownerReg.body.token;

    const guestReg = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Pasajero Test',
        email: 'guest-booking@test.com',
        password: 'password123',
        phone: '2222222222',
      });
    guestToken = guestReg.body.token;
    guestId = guestReg.body.user.id;

    const owner = await User.findOne({ email: 'owner-booking@test.com' });
    const post = await Post.create({
      author: owner._id,
      type: 'offer',
      category: 'passenger',
      origin: 'Córdoba',
      destination: 'Buenos Aires',
      departureDate: new Date(Date.now() + 86400000),
      seats: 3,
      capacity: '3 lugares',
      status: 'active',
    });
    postId = post._id.toString();
  });

  it('crea booking y sincroniza interestRequests en pending', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${guestToken}`)
      .send({
        post: postId,
        type: 'passenger',
        seatsRequested: 1,
        message: 'Me sumo',
      });

    expect(res.statusCode).toBe(201);

    const post = await Post.findById(postId);
    const ir = (post.interestRequests || []).find((r) => r.user.toString() === guestId);
    expect(ir).toBeDefined();
    expect(ir.status).toBe('pending');
  });

  it('aprueba booking y sincroniza interestRequests en approved', async () => {
    const createRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${guestToken}`)
      .send({
        post: postId,
        type: 'passenger',
        seatsRequested: 1,
      });

    const approve = await request(app)
      .put(`/api/bookings/${createRes.body._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ status: 'approved' });

    expect(approve.statusCode).toBe(200);

    const post = await Post.findById(postId);
    const ir = (post.interestRequests || []).find((r) => r.user.toString() === guestId);
    expect(ir?.status).toBe('approved');
  });

  it('acepta PATCH además de PUT para actualizar estado', async () => {
    const createRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${guestToken}`)
      .send({ post: postId, type: 'passenger', seatsRequested: 1 });

    const patchRes = await request(app)
      .patch(`/api/bookings/${createRes.body._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ status: 'rejected' });

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.body.status).toBe('rejected');
  });
});
