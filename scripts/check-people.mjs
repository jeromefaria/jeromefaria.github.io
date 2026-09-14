import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = 'src/data';
const REGISTRY = 'src/data/people.ts';
const ORG_REGISTRY = 'src/data/orgs.ts';

const dataFiles = [];
const walk = dir => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (full.endsWith('.ts') && !/\.(test|golden)\.|__fixtures__/.test(full)) dataFiles.push(full);
  }
};
walk(DATA_DIR);

const resolvable = new Set();
for (const registry of [REGISTRY, ORG_REGISTRY]) {
  for (const match of readFileSync(registry, 'utf8').matchAll(/name:\s*'([^']+)'/g)) resolvable.add(match[1]);
}
for (const file of dataFiles) {
  for (const match of readFileSync(file, 'utf8').matchAll(/\{\s*name:\s*'([^']+)',\s*url:\s*'[^']+'\s*\}/g)) resolvable.add(match[1]);
}

const unresolved = [];
for (const file of dataFiles) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    for (const match of line.matchAll(/\[\[([^\]]+)\]\]/g)) {
      if (!resolvable.has(match[1])) unresolved.push(`${file}:${index + 1}  [[${match[1]}]]`);
    }
  });
}

if (unresolved.length > 0) {
  console.error(`\n❌ ${unresolved.length} credit marker(s) resolve to no person or organization (they would render unlinked):`);
  unresolved.forEach(entry => console.error(`  - ${entry}`));
  console.error('\nAdd the person to src/data/people.ts, the organization to src/data/orgs.ts, or a co-located contributor override.\n');
  process.exit(1);
}

console.log(`✓ Credits: every [[marker]] resolves (${resolvable.size} known people and organizations).`);
