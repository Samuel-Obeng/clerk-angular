import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFiles: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@clerk/shared/(.*)$': '<rootDir>/../../node_modules/@clerk/shared/dist/runtime/$1.js',
    '^@clerk/types$': '<rootDir>/../../node_modules/@clerk/types',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@clerk/shared|@clerk/types|@angular))',
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'html', 'mjs'],
};

export default config;
