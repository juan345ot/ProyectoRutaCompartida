/**
 * Configuración de Jest para tests del frontend (Next.js + Testing Library).
 * Mapea alias @/ hacia src/ y usa jsdom como entorno.
 */
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

// Opciones propias además del preset de next/jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // matchers de jest-dom
  testEnvironment: 'jest-environment-jsdom', // simula navegador
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // mismo alias que en next.config
  },
};

module.exports = createJestConfig(customJestConfig);
