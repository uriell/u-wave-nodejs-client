/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['lcov'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', 'src/index.ts'],
  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,
  preset: 'ts-jest',
  testMatch: ['**/*.spec.ts'],
};
