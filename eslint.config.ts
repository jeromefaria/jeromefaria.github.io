import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import pluginVue from 'eslint-plugin-vue';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import vueParser from 'vue-eslint-parser';

// Shared across the TypeScript and Vue configs so the rule set lives in one place.
const sharedPlugins = {
  '@typescript-eslint': tseslint,
  'simple-import-sort': simpleImportSort,
};

const baseRules = {
  // Semicolons
  'semi': ['error', 'always'],

  // Quotes
  'quotes': ['error', 'single', { avoidEscape: true }],

  // Indentation
  'indent': ['error', 2, { SwitchCase: 1 }],

  // Trailing commas in multiline
  'comma-dangle': ['error', 'always-multiline'],

  // Spacing
  'object-curly-spacing': ['error', 'always'],
  'array-bracket-spacing': ['error', 'never'],
  'comma-spacing': ['error', { before: false, after: true }],
  'key-spacing': ['error', { beforeColon: false, afterColon: true }],
  'space-before-function-paren': ['error', {
    anonymous: 'always',
    named: 'never',
    asyncArrow: 'always',
  }],
  'space-infix-ops': 'error',
  'keyword-spacing': ['error', { before: true, after: true }],
  'space-before-blocks': 'error',

  // Arrow functions
  'arrow-spacing': ['error', { before: true, after: true }],
  'arrow-parens': ['error', 'as-needed'],

  // Variable declarations
  'prefer-const': 'error',
  'no-var': 'error',
  'prefer-destructuring': ['error', {
    array: false,
    object: true,
  }],

  // Template literals
  'prefer-template': 'error',

  // Object shorthand
  'object-shorthand': ['error', 'always'],

  // Modern JavaScript over legacy patterns
  'eqeqeq': ['error', 'always'],
  'prefer-object-spread': 'error',
  'no-array-constructor': 'error',
  'prefer-spread': 'error',
  'prefer-rest-params': 'error',

  // Early returns
  'no-else-return': ['error', { allowElseIf: false }],
  'no-lonely-if': 'error',

  // General formatting
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
  'eol-last': ['error', 'always'],
  'no-trailing-spaces': 'error',

  // Import sorting
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',

  // TypeScript-specific rules (only rules that don't require type information)
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': ['error', {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
  }],
};

const vueRules = {
  'vue/multi-word-component-names': 'off',
  'vue/no-v-html': 'off', // Content is author-controlled, not user input
  'vue/html-indent': ['error', 2],
  'vue/max-attributes-per-line': ['error', {
    singleline: 3,
    multiline: 1,
  }],
  'vue/first-attribute-linebreak': ['error', {
    singleline: 'ignore',
    multiline: 'below',
  }],
  'vue/html-closing-bracket-newline': ['error', {
    singleline: 'never',
    multiline: 'always',
  }],
};

// Rules that need type information. Scoped to the app source (src, excluding
// tests), which is covered by tsconfig.json.
const typeAwareRules = {
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/prefer-includes': 'error',
  '@typescript-eslint/no-floating-promises': 'error',
};

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsparser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: sharedPlugins,
    rules: { ...baseRules, ...vueRules },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: sharedPlugins,
    rules: baseRules,
  },
  {
    // Type-aware rules for the app source (excludes co-located tests + helpers,
    // which tsconfig.json does not include).
    files: ['src/**/*.ts'],
    ignores: ['src/**/*.test.ts', 'src/test-support/**', 'src/test-setup.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        projectService: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: sharedPlugins,
    rules: typeAwareRules,
  },
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsparser,
        projectService: true,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: sharedPlugins,
    rules: typeAwareRules,
  },
  {
    // vue/one-component-per-file (from flat/recommended, which also lints .ts)
    // guards source SFCs. Tests legitimately define several throwaway
    // components to exercise composables, so scope it off for them.
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'vue/one-component-per-file': 'off',
    },
  },
];
