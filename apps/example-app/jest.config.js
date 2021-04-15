module.exports = {
  name: 'Example App',
  displayName: {
    name: 'Example',
    color: 'blue',
  },
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
};
