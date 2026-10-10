import { readFileSync } from 'node:fs';

import { contrastRatio } from '../lib/contrast.mjs';
import { loadSrc } from '../lib/data-loader.mjs';

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

const driftIssues = [
  ...compare('light', ':root', color.light),
  ...compare('dark', '[data-theme="dark"]', color.dark),
];

if (driftIssues.length > 0) {
  console.error('\n❌ tokens.ts colours have drifted from src/styles/_base.scss:');
  driftIssues.forEach(issue => console.error(issue));
  console.error('\nReconcile src/design/tokens.ts and src/styles/_base.scss so they match.\n');
  process.exit(1);
}

const TEXT_KEYS = ['text', 'secondary', 'muted', 'link', 'linkHover', 'error'];
const AA_NORMAL_RATIO = 4.5;

const contrastIssues = (theme, tokens) => {
  const failures = [];
  for (const key of TEXT_KEYS) {
    const ratio = contrastRatio(tokens[key], tokens.bg);
    if (ratio < AA_NORMAL_RATIO) {
      failures.push(`  ${theme}.${key} (${tokens[key]} on ${tokens.bg}): ${ratio.toFixed(2)}:1 — needs ≥ ${AA_NORMAL_RATIO}:1`);
    }
  }
  return failures;
};

const contrastFailures = [
  ...contrastIssues('light', color.light),
  ...contrastIssues('dark', color.dark),
];

if (contrastFailures.length > 0) {
  console.error('\n❌ text colour tokens fall below WCAG AA contrast against their background:');
  contrastFailures.forEach(failure => console.error(failure));
  console.error('\nAdjust the offending colour in src/design/tokens.ts (and src/styles/_base.scss) to meet 4.5:1.\n');
  process.exit(1);
}

console.log(`✓ Tokens: palette matches _base.scss (${Object.keys(color.light).length} light + ${Object.keys(color.dark).length} dark); all ${TEXT_KEYS.length} text colours meet AA contrast (≥ ${AA_NORMAL_RATIO}:1) in both themes.`);
