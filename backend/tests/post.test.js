const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Post API Integration Tests', () => {
  let token;

  beforeEach(async () => {
    // Instead of User.create which skips hashing, we use the register endpoint
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Voyager',
        email: 'test@voyager.com',
        password: 'password123',
        phone: '1122334455'
      });
    
    token = registerRes.body.token;
  });

  describe('GET /api/posts', () => {
    it('should return 200 and an empty array initially', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(0);
    });
  });

  describe('POST /api/posts', () => {
    it('should fail with 401 if missing auth token', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ type: 'offer', category: 'passenger', origin: 'A', destination: 'B', capacity: 1 });
      
      expect(res.statusCode).toBe(401);
    });

    it('should fail with 400 validation error if missing fields', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'offer', capacity: 1 });
      
      expect(res.statusCode).toBe(400);
      // Because we added express-validator!
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 201 when payload is valid', async () => {
      const validPayload = {
        type: 'offer',
        category: 'passenger',
        origin: 'Mar del Plata',
        destination: 'Buenos Aires',
        departureDate: new Date().toISOString(),
        capacity: 3,
        description: 'Viajo tranquilo, mate a bordo.'
      };

      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(validPayload);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.origin).toBe('Mar del Plata');
      expect(res.body.destination).toBe('Buenos Aires');
      expect(res.body.author).toBeDefined();
    });
  });
});
