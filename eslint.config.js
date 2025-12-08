import pluginVue from 'eslint-plugin-vue';

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
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

      // General formatting
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',

      // Vue-specific rules
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
    },
  },
];
