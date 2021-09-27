const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'jest-preset-angular',
  testMatch: ['<rootDir>/**/+(*.)+(spec).+(ts)'],
  testPathIgnorePatterns: ['/node-modules'],
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  collectCoverage: true,
  coverageReporters: ['text'],
  coverageDirectory: 'coverage/my-app',
  verbose: true,
  moduleFileExtensions: [
      "js",
     "jsx",
     "ts"
   ],
   moduleDirectories: [
     "node_modules"
   ]
};
