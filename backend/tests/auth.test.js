/**
 * Tests de integración del flujo de autenticación.
 * Cubre registro, login duplicado, login exitoso y protección de /me.
 */
const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  it('registra un usuario nuevo', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Usuario Auth',
        email: 'auth-flow@test.com',
        password: 'password123',
        phone: '1199887766',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('auth-flow@test.com');
  });

  it('rechaza registro duplicado', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Dup',
        email: 'dup@test.com',
        password: 'password123',
        phone: '1111111111',
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Dup 2',
        email: 'dup@test.com',
        password: 'password123',
        phone: '2222222222',
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it('login con credenciales válidas devuelve token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login User',
        email: 'login@test.com',
        password: 'password123',
        phone: '1133445566',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('GET /auth/me requiere token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
