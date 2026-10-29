import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { walkFiles } from '../lib/walk.mjs';

const DATA_DIR = 'src/data';
const REGISTRY = 'src/data/people.ts';
const ORG_REGISTRY = 'src/data/orgs.ts';

export const REGISTRY_NAME = /name:\s*'([^']+)'/g;
export const LINKED_NAME = /\{\s*name:\s*'([^']+)',\s*url:\s*'[^']+'\s*\}/g;
const MARKER = /\[\[([^\]]+)\]\]/g;

export const extractNames = (content, pattern) => [...content.matchAll(pattern)].map(match => match[1]);

export const unresolvedMarkers = (text, resolvable) => {
  const unresolved = [];
  text.split('\n').forEach((line, index) => {
    for (const match of line.matchAll(MARKER)) {
      if (!resolvable.has(match[1])) unresolved.push({ line: index + 1, name: match[1] });
    }
  });
  return unresolved;
};

const main = () => {
  const dataFiles = [...walkFiles(DATA_DIR)].filter(
    file => file.endsWith('.ts') && !/\.(test|golden)\.|__fixtures__/.test(file),
  );

  const resolvable = new Set();
  for (const registry of [REGISTRY, ORG_REGISTRY]) {
    for (const name of extractNames(readFileSync(registry, 'utf8'), REGISTRY_NAME)) resolvable.add(name);
  }
  for (const file of dataFiles) {
    for (const name of extractNames(readFileSync(file, 'utf8'), LINKED_NAME)) resolvable.add(name);
  }

  const unresolved = [];
  for (const file of dataFiles) {
    for (const { line, name } of unresolvedMarkers(readFileSync(file, 'utf8'), resolvable)) {
      unresolved.push(`${file}:${line}  [[${name}]]`);
    }
  }

  if (unresolved.length > 0) {
    console.error(`\n❌ ${unresolved.length} credit marker(s) resolve to no person or organization (they would render unlinked):`);
    unresolved.forEach(entry => console.error(`  - ${entry}`));
    console.error('\nAdd the person to src/data/people.ts, the organization to src/data/orgs.ts, or a co-located contributor override.\n');
    process.exit(1);
  }

  console.log(`✓ Credits: every [[marker]] resolves (${resolvable.size} known people and organizations).`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
