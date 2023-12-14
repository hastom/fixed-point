/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  errorOnDeprecated: true,
  moduleFileExtensions: ['js', 'json', 'ts', 'node'],
  resetMocks: false,
  testLocationInResults: true,
};
