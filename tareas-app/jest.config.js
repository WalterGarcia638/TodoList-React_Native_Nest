module.exports = {
    preset: 'jest-expo',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
      '^@services/(.*)$': '<rootDir>/src/services/$1', 
    },
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|expo|@expo|react-navigation|@react-native|expo-modules-core)/)',
    ],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  };
  