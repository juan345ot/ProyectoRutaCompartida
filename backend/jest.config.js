/**
 * Configuración de Jest para pruebas del backend.
 * Consumido por: npm test / jest al ejecutar tests en backend/.
 */
module.exports = {
  testEnvironment: 'node', // Entorno Node (sin DOM)
  verbose: true,
  silent: false,
  testTimeout: 10000, // 10 s por test (supertest + Mongo en memoria)
  setupFilesAfterEnv: ['./tests/setup.js'], // MongoMemoryServer y limpieza entre tests
  clearMocks: true,
};
