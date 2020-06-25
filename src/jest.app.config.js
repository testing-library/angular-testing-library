const baseConfig = require('../jest.base.config');

module.exports = {
  ...baseConfig,

  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/dist'],
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  displayName: {
    name: 'EXAMPLE',
    color: 'blue',
  },
};
