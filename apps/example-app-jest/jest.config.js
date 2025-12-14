module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/apps/example-app-jest/src/test-setup.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/apps/example-app-jest/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  coverageDirectory: 'coverage/apps/example-app-jest',
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '@testing-library/angular/jest-utils': '<rootDir>/projects/testing-library/jest-utils/index.ts',
    '@testing-library/angular': '<rootDir>/projects/testing-library',
  },
};
