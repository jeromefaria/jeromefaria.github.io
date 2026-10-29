#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { walkFiles } from '../lib/walk.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = join(__dirname, '../../src');
const SCANNED_EXTENSIONS = new Set(['.scss', '.vue', '.css']);

export const DEFINITION_PATTERN = /--([a-z0-9-]+)\s*:/g;
export const REFERENCE_PATTERN = /var\(\s*--([a-z0-9-]+)/g;

export const extractNames = (content, pattern) => [...content.matchAll(pattern)].map(match => match[1]);

export const danglingReferences = (defined, references) => [...references].filter(([name]) => !defined.has(name));

const main = () => {
  const files = [...walkFiles(SOURCE_ROOT)].filter(file => SCANNED_EXTENSIONS.has(extname(file)));
  const defined = new Set();
  const references = new Map();

  for (const file of files) {
    const content = readFileSync(file, 'utf8');

    for (const name of extractNames(content, DEFINITION_PATTERN)) defined.add(name);

    for (const name of extractNames(content, REFERENCE_PATTERN)) {
      if (!references.has(name)) references.set(name, file);
    }
  }

  const dangling = danglingReferences(defined, references);

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
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
