module.exports = {
  testEnvironment: 'node',
  verbose: true,
  silent: false,
  testTimeout: 10000,
  setupFilesAfterEnv: ['./tests/setup.js'],
  clearMocks: true,
};
