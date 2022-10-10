module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '^test-helpers$': '<rootDir>/src/test-helpers.ts',
  },
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
}
