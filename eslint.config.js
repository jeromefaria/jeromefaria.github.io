import pluginVue from 'eslint-plugin-vue';

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      'semi': ['error', 'always'],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off', // Content is author-controlled, not user input
    },
  },
];
