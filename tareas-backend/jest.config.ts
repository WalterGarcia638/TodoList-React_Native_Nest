// jest.config.ts
export default {
    preset: 'ts-jest', // Si usas TypeScript
    testMatch: ['**/*.spec.ts'], // Busca tests en cualquier subdirectorio
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1", // Mapeo para importaciones absolutas
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], 
  };