#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = join(__dirname, '../src');
const SCANNED_EXTENSIONS = new Set(['.scss', '.vue', '.css']);
const DEFINITION_PATTERN = /--([a-z0-9-]+)\s*:/g;
const REFERENCE_PATTERN = /var\(\s*--([a-z0-9-]+)/g;

const collectSourceFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);
    return SCANNED_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
  });

const matchAll = (content, pattern) =>
  [...content.matchAll(pattern)].map(match => match[1]);

const files = collectSourceFiles(SOURCE_ROOT);
const defined = new Set();
const references = new Map();

for (const file of files) {
  const content = readFileSync(file, 'utf8');

  for (const name of matchAll(content, DEFINITION_PATTERN)) defined.add(name);

  for (const name of matchAll(content, REFERENCE_PATTERN)) {
    if (!references.has(name)) references.set(name, file);
  }
}

const dangling = [...references].filter(([name]) => !defined.has(name));

if (dangling.length === 0) {
  console.log(`✓ Custom properties: ${references.size} referenced, all defined.`);
  process.exit(0);
}

console.error('✖ Undefined custom properties (a var(--x) with no matching --x: definition):');
for (const [name, file] of dangling) {
  console.error(`  --${name}  (first referenced in ${file.replace(`${SOURCE_ROOT}/`, 'src/')})`);
}
console.error('\nAn undefined var() silently falls back to the inherited value, masking the bug until a refactor makes it resolve.');
process.exit(1);
