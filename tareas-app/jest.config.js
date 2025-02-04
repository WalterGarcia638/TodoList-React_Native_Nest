module.exports = {
    preset: 'jest-expo',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleDirectories: ['node_modules', 'src'], // Permite importar desde src/
    moduleNameMapper: {
      '^@services/(.*)$': '<rootDir>/src/services/$1', // Alias para los servicios
    },
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|expo|@expo|react-navigation|@react-native|expo-modules-core)/)',
    ],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  };
  