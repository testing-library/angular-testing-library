const baseConfig = require('../jest.base.config');

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/projects'],
  setupFilesAfterEnv: ['<rootDir>/projects/setupJest.ts'],
  displayName: {
    name: 'LIB',
    color: 'magenta',
  },
};
