module.exports = {
  preset: 'jest-preset-angular',
  rootDir: '../',
  transformIgnorePatterns: ['node_modules/(?!@ngrx)'],

  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
