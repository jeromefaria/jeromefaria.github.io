#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CONFIG = resolve(ROOT, 'vite.config.ts');

const CONFIG_DATA_ENTRY = /from '(\.\/src\/data\/[^']+)'/g;
const IMPORT_PATTERN = /^[ \t]*(?:import|export)\b(\s+type\b)?\s*(?:[^'";]*?\bfrom\b\s*)?['"]([^'"]+)['"]/gm;

export const scanImports = content =>
  [...content.matchAll(IMPORT_PATTERN)].map(match => ({
    isTypeOnly: Boolean(match[1]),
    specifier: match[2],
    line: content.slice(0, match.index).split('\n').length,
  }));

const resolveModule = (fromFile, specifier) => {
  const base = resolve(dirname(fromFile), specifier);
  return [base, `${base}.ts`, `${base}/index.ts`].find(candidate => existsSync(candidate)) ?? null;
};

export const findViolations = (configPath = CONFIG, root = ROOT) => {
  const entries = [...readFileSync(configPath, 'utf8').matchAll(CONFIG_DATA_ENTRY)].map(match => resolve(root, match[1]));
  if (entries.length === 0) throw new Error('found no data-module imports in vite.config.ts — the entry regex is stale, refusing to pass vacuously.');

  const visited = new Set();
  const queue = [...entries];
  const violations = [];

  while (queue.length > 0) {
    const file = queue.pop();
    if (visited.has(file) || !existsSync(file)) continue;
    visited.add(file);

    for (const { isTypeOnly, specifier, line } of scanImports(readFileSync(file, 'utf8'))) {
      if (isTypeOnly) continue;
      if (specifier.startsWith('@/')) {
        violations.push({ file, line, specifier });
        continue;
      }
      if (specifier.startsWith('.')) {
        const resolved = resolveModule(file, specifier);
        if (resolved) queue.push(resolved);
      }
    }
  }

  return { scanned: visited.size, violations };
};

const relative = file => file.replace(`${ROOT}/`, '');

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const { scanned, violations } = findViolations();
    if (violations.length === 0) {
      console.log(`✓ Data imports: ${scanned} config-eval module(s) scanned, no @-alias value imports.`);
      process.exit(0);
    }

    console.error('✖ @-alias value import reachable from a vite.config data entry:');
    for (const { file, line, specifier } of violations) console.error(`  ${relative(file)}:${line} → '${specifier}'`);
    console.error("\nvite.config imports these modules in Node at config-eval time, before Vite's @ alias exists, so an @-alias value import breaks `vite-ssg build`. Use a relative path, or `import type` when it is type-only.");
    process.exit(1);
  } catch (error) {
    console.error(`✖ check-data-imports: ${error.message}`);
    process.exit(1);
  }
}
