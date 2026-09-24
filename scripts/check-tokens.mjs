import { readFileSync } from 'node:fs';

import { loadSrc } from './data-loader.mjs';

const { color } = await loadSrc('design/tokens.ts');
const scss = readFileSync('src/styles/_base.scss', 'utf8');

const PROP_TO_KEY = {
  '--color-bg': 'bg',
  '--color-text': 'text',
  '--color-text-secondary': 'secondary',
  '--color-text-muted': 'muted',
  '--color-border': 'border',
  '--color-border-subtle': 'borderSubtle',
  '--color-link': 'link',
  '--color-link-hover': 'linkHover',
  '--color-error': 'error',
};

const blockOf = selector => {
  const start = scss.indexOf(`${selector} {`);
  if (start === -1) return '';
  return scss.slice(start, scss.indexOf('}', start));
};

const scssColors = (selector, block) => {
  const found = {};
  for (const [prop, key] of Object.entries(PROP_TO_KEY)) {
    const match = block.match(new RegExp(`${prop}:\\s*(#[0-9a-fA-F]{3,6})`));
    found[key] = match ? match[1] : null;
  }
  return found;
};

const compare = (theme, selector, tokens) => {
  const actual = scssColors(selector, blockOf(selector));
  const issues = [];
  for (const [key, tokenValue] of Object.entries(tokens)) {
    if (actual[key] === null) issues.push(`  ${theme}.${key}: missing from _base.scss (${selector})`);
    else if (actual[key] !== tokenValue) issues.push(`  ${theme}.${key}: tokens.ts=${tokenValue}, _base.scss=${actual[key]}`);
  }
  return issues;
};

const issues = [
  ...compare('light', ':root', color.light),
  ...compare('dark', '[data-theme="dark"]', color.dark),
];

if (issues.length > 0) {
  console.error('\n❌ tokens.ts colours have drifted from src/styles/_base.scss:');
  issues.forEach(issue => console.error(issue));
  console.error('\nReconcile src/design/tokens.ts and src/styles/_base.scss so they match.\n');
  process.exit(1);
}

console.log(`✓ Tokens: colour palette matches _base.scss (${Object.keys(color.light).length} light + ${Object.keys(color.dark).length} dark).`);
