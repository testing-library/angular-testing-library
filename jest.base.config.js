module.exports = {
  preset: 'jest-preset-angular',
  rootDir: '../',
  setupTestFrameworkScriptFile: '<rootDir>/test.ts',
  testURL: 'http://localhost',
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.spec.json',
    },
    __TRANSFORM_HTML__: true,
  },
};
