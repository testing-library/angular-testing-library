const baseConfig = require('../jest.base.config');

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/dist'],
};
