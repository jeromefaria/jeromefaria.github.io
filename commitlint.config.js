export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'perf', 'refactor', 'test', 'build', 'ci', 'docs', 'style', 'chore', 'revert', 'content'],
    ],
  },
};
