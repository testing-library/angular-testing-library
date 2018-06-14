const baseConfig = require('./jest.base.config');

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    'ngx-testing-library': '<rootDir>/dist/ngx-testing-library',
  },
};
