module.exports = {
  preset: 'jest-preset-angular',
  rootDir: '../',
  setupFilesAfterEnv: ['<rootDir>/test.ts'],
  testURL: 'http://localhost',
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: [require.resolve('jest-preset-angular/InlineHtmlStripStylesTransformer')],
    },
  },
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!@ngrx)'],
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
