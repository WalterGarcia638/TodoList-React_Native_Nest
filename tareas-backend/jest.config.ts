export default {
    preset: 'ts-jest',
    testMatch: ['**/*.spec.ts'], 
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1", 
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], 
  };