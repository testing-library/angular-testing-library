const nxPreset = require('@nrwl/jest/preset');
module.exports = {
  ...nxPreset,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
};
