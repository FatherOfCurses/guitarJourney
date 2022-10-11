/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest');
const { paths } = require('./tsconfig.json').compilerOptions;

globalThis.ngJest = {
  skipNgcc: true,
}

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  globalSetup: 'jest-preset-angular/global-setup',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>' }),
  testPathIgnorePatterns: ['/node_modules'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  verbose: true,
  globals: {
    ngJest: {
      processWithEsbuild: ['**/node_modules/lodash-es/*.js'],
    }
  }
};
