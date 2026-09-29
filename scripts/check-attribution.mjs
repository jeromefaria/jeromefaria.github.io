import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const PATTERNS = [
  /claude\.ai/i,
  /anthropic\.com/i,
  /\bclaude-session\b/i,
  /co-authored-by:\s*\[?(?:claude|copilot|codex|anthropic|openai|chatgpt)\b/i,
  /generated (?:with|by) \[?(?:claude|copilot|chatgpt|gpt-[45]|codex)\b/i,
  /🤖\s*generated/i,
];

const firstMatch = text => {
  for (const line of text.split('\n')) {
    if (PATTERNS.some(pattern => pattern.test(line))) return line.trim();
  }
  return null;
};

const argValue = flag => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? null : process.argv[index + 1];
};

const sources = [];

const messageFile = argValue('--message-file');
if (messageFile) {
  sources.push({ label: 'the commit message', text: readFileSync(messageFile, 'utf8') });
}

const range = argValue('--range');
if (range) {
  const hashes = execFileSync('git', ['rev-list', range], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  for (const hash of hashes) {
    sources.push({ label: `commit ${hash.slice(0, 8)}`, text: execFileSync('git', ['log', '-1', '--format=%B', hash], { encoding: 'utf8' }) });
  }
}

if (process.env.PR_BODY) {
  sources.push({ label: 'the PR description', text: process.env.PR_BODY });
}

const failures = sources.map(source => ({ ...source, hit: firstMatch(source.text) })).filter(source => source.hit);

if (failures.length > 0) {
  for (const { label, hit } of failures) {
    console.error(`✖ Attribution: tool/AI attribution found in ${label}:\n    ${hit}`);
  }
  console.error('\nAll contributions are attributed to the developer — remove the line above.');
  process.exit(1);
}

console.log('✓ Attribution: none found in commits or PR body.');
