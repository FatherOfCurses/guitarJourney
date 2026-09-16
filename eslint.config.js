// Flat config (ESLint 9). Replaces .eslintrc.json, which ESLint 9 no longer reads.
// Rule selection is a direct port of that file; see the note on `prettier/prettier` at the bottom.
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettierConfig = require('eslint-config-prettier');

const NODE_GLOBALS = {
  require: 'readonly',
  module: 'writable',
  exports: 'writable',
  process: 'readonly',
  console: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  Buffer: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
};

const JEST_GLOBALS = {
  jest: 'readonly',
  describe: 'readonly',
  it: 'readonly',
  test: 'readonly',
  expect: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
};

module.exports = [
  {
    // Ported from .eslintignore + the old ignorePatterns.
    ignores: [
      'dist/**',
      'node_modules/**',
      '.angular/**',
      'coverage/**',
      'docs/**',
      'projects/**',
      'package.json',
      'package-lock.json',
    ],
  },

  js.configs.recommended,

  {
    // Rules the old .eslintrc.json switched off, kept at the same global scope it used.
    rules: {
      'no-use-before-define': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'off',
      'no-console': 'off',
      'no-empty': 'off',
    },
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,

      // Carried over verbatim from .eslintrc.json.
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',

      // TypeScript already reports unknown identifiers, and no-undef cannot see
      // ambient DOM/Angular types. Disabling it for .ts is the typescript-eslint
      // recommendation and matches the old config's per-file override.
      'no-undef': 'off',
    },
  },

  {
    // Jest globals. The old config named the `jest` plugin, which was never installed —
    // that dangling reference is what made `eslint` hard-fail. Declaring the globals
    // covers the same need without the dependency.
    files: ['**/*.spec.ts', 'src/__mocks__/**/*.ts', 'setup-jest.ts'],
    languageOptions: { globals: JEST_GLOBALS },
  },

  {
    // Node-side scripts: build tooling, Firestore seeders.
    files: ['**/*.js', '**/*.cjs', 'tools/**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: NODE_GLOBALS },
  },

  // Turns off stylistic rules that would fight Prettier. The old config also enabled
  // `prettier/prettier: error`, which is deliberately NOT restored: with no .prettierrc,
  // Prettier defaults to double quotes and a `--fix` would rewrite ~359 single-quote
  // imports across src/. Add a .prettierrc first, then opt in.
  prettierConfig,
];
