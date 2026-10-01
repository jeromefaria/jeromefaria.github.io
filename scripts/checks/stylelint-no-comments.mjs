import stylelint from 'stylelint';

const ruleName = 'local/no-comments';

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: 'No comments: SCSS should be self-documenting. Justify a genuine gotcha with `// stylelint-disable-next-line local/no-comments -- <reason>`.',
});

const ruleFunction = primary => (root, result) => {
  if (!primary) return;

  root.walkComments(comment => {
    const text = comment.text.trim();
    if (/^(stylelint-|!)/.test(text)) return;

    stylelint.utils.report({ message: messages.rejected, node: comment, result, ruleName });
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default stylelint.createPlugin(ruleName, ruleFunction);
