module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '^test-helpers$': '<rootDir>/test/test-helpers.ts',
  },
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.exs$': 'jest-raw-loader',
  },
  verbose: true,
}
