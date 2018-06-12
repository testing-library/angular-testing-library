module.exports = {
  preset: 'jest-preset-angular',
  setupTestFrameworkScriptFile: '<rootDir>/test.ts',
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.spec.json',
    },
    __TRANSFORM_HTML__: true,
  },
};
