import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

const COMMENT_DIRECTIVE = /^(eslint-|@ts-|@vue-|global\b|globals\b|exported\b|istanbul\b|c8\b|v8\b|prettier-|stylelint-|@generated|@preserve|@license|\/\s?<(reference|amd))/;

const localPlugin = {
  rules: {
    'no-comments': {
      meta: {
        type: 'problem',
        docs: { description: 'Code must be self-documenting; comments are disallowed except a justified, directive-suppressed exception.' },
        schema: [],
      },
      create(context) {
        const source = context.sourceCode ?? context.getSourceCode();
        const report = comments => {
          for (const comment of comments ?? []) {
            if (comment.type === 'Shebang') continue;
            if (COMMENT_DIRECTIVE.test(comment.value.trim())) continue;
            context.report({
              loc: comment.loc,
              message: 'No comments: code must be self-documenting. If a comment is genuinely irreducible, keep it with `// eslint-disable-next-line local/no-comments -- <reason>`.',
            });
          }
        };
        return {
          Program() {
            report(source.getAllComments());
            report(source.ast.templateBody?.comments);
          },
        };
      },
    },
  },
};

const sharedPlugins = {
  '@typescript-eslint': tseslint,
  'simple-import-sort': simpleImportSort,
  local: localPlugin,
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

  'local/no-comments': 'error',

  complexity: ['error', 15],
  'max-depth': ['error', 4],
};

const vueRules = {
  'vue/multi-word-component-names': 'off',
  'vue/no-v-html': 'off',
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

const typeAwareRules = {
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/prefer-includes': 'error',
  '@typescript-eslint/no-floating-promises': 'error',
};

export default [
  {
    ignores: [
      'dist/**',
      '**/coverage/**',
      'node_modules/**',
      'worker/node_modules/**',
      'playwright-report/**',
      'test-results/**',
      '**/*-snapshots/**',
    ],
  },
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
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'vue/one-component-per-file': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      complexity: 'off',
    },
  },
  {
    files: ['**/*.mjs', '**/*.js'],
    plugins: { local: localPlugin },
    rules: { 'local/no-comments': 'error' },
  },
];
