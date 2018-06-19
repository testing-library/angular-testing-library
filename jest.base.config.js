module.exports = {
  preset: 'jest-preset-angular',
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/test.ts',
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.spec.json',
    },
    __TRANSFORM_HTML__: true,
  },
};
