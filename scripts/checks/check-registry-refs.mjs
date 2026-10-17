#!/usr/bin/env node

import { loadSrc } from '../lib/data-loader.mjs';

const { orgs } = await loadSrc('data/orgs.ts');
const { allReleases } = await loadSrc('data/works.ts');

const orgKeys = new Set(Object.keys(orgs));

const editionsOf = meta => {
  if ('editions' in meta) return meta.editions;
  if (meta.kind === 'commission' && meta.work === 'DVD') return [meta.publisher];
  return [];
};

const unresolved = [];
let refCount = 0;

for (const release of allReleases) {
  for (const edition of editionsOf(release.meta)) {
    if (typeof edition.label !== 'string') continue;

    refCount += 1;
    if (!orgKeys.has(edition.label)) unresolved.push(`${release.id}  label: '${edition.label}'`);
  }
}

if (unresolved.length > 0) {
  console.error(`\n❌ ${unresolved.length} edition label(s) reference an organization key that is not in src/data/orgs.ts:`);
  unresolved.forEach(entry => console.error(`  - ${entry}`));
  console.error('\nAdd the organization to src/data/orgs.ts, or use an inline { text, url? } label for a one-off.\n');
  process.exit(1);
}

console.log(`✓ Registry refs: every edition label key resolves (${refCount} org ref(s) across ${orgKeys.size} known organizations).`);
