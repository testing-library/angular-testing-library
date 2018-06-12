const baseConfig = require('./jest.base.config');

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src'],
  modulePathIgnorePatterns: ['<rootDir>/projects'],
  moduleNameMapper: {
    'ngx-testing-library': '<rootDir>/dist/ngx-testing-library',
  },
};
