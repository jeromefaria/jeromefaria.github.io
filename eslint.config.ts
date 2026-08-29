import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

const sharedPlugins = {
  '@typescript-eslint': tseslint,
  'simple-import-sort': simpleImportSort,
};

const baseRules = {
  'semi': ['error', 'always'],
  'quotes': ['error', 'single', { avoidEscape: true }],
  'indent': ['error', 2, { SwitchCase: 1 }],
  'comma-dangle': ['error', 'always-multiline'],

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
  'arrow-spacing': ['error', { before: true, after: true }],
  'arrow-parens': ['error', 'as-needed'],

  'prefer-const': 'error',
  'no-var': 'error',
  'prefer-destructuring': ['error', {
    array: false,
    object: true,
  }],
  'prefer-template': 'error',
  'object-shorthand': ['error', 'always'],
  'eqeqeq': ['error', 'always'],
  'prefer-object-spread': 'error',
  'no-array-constructor': 'error',
  'prefer-spread': 'error',
  'prefer-rest-params': 'error',

  'no-else-return': ['error', { allowElseIf: false }],
  'no-lonely-if': 'error',

  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
  'eol-last': ['error', 'always'],
  'no-trailing-spaces': 'error',

  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',

  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': ['error', {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
  }],
  '@typescript-eslint/no-non-null-assertion': 'error',
  '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
  '@typescript-eslint/ban-ts-comment': 'error',

  // Ceilings sit just above the current source peak so only new growth trips them.
  complexity: ['error', 15],
  'max-depth': ['error', 4],
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
  'vue/max-lines-per-block': ['error', {
    script: 120,
    template: 160,
    style: 200,
  }],
};

// Scoped to src — co-located tests aren't in tsconfig.json, so type-aware rules would error there.
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
    // Relaxed for tests: throwaway components, non-null assertions on known fixtures, arrange-heavy setup.
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'vue/one-component-per-file': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      complexity: 'off',
    },
  },
];
