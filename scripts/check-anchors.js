#!/usr/bin/env node

// Mirrors useAccordion resolution: a fragment resolves to a section/year key or an item id.
// Keep in sync with that composable, or valid in-copy anchors will fail the build.

import { createJiti } from 'jiti';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcDir = resolve(__dirname, '../src');

const jiti = createJiti(import.meta.url, { alias: { '@': srcDir } });

const load = relativePath => jiti.import(resolve(srcDir, relativePath));

const [{ worksData, worksSections }, { sortedLiveData, liveYears }, { pressQuotes }, { aboutSections }] =
  await Promise.all([
    load('data/works.ts'),
    load('data/live.ts'),
    load('data/press.ts'),
    load('data/about.ts'),
  ]);

const itemIds = groups => Object.values(groups).flatMap(group => (group.items ?? []).map(item => item.id));

const validTargets = {
  works: new Set([...worksSections, ...itemIds(worksData)]),
  live: new Set([...liveYears, ...itemIds(sortedLiveData)]),
  press: new Set(pressQuotes.map(quote => quote.id)),
};

const sources = {
  'data/about.ts': aboutSections,
  'data/works.ts': worksData,
  'data/live.ts': sortedLiveData,
  'data/press.ts': pressQuotes,
};

const ANCHOR_PATTERN = /\/(works|live|press)#([\w-]+)/g;

const anchors = [];

for (const [source, data] of Object.entries(sources)) {
  const serialized = JSON.stringify(data);
  for (const match of serialized.matchAll(ANCHOR_PATTERN)) {
    anchors.push({ source, page: match[1], fragment: match[2], link: `/${match[1]}#${match[2]}` });
  }
}

const broken = anchors.filter(anchor => !validTargets[anchor.page].has(anchor.fragment));

console.log('\n🔗 Internal Anchor Check:');
console.log('━'.repeat(50));
console.log(`Scanned ${anchors.length} internal anchor links across ${Object.keys(sources).length} data files.`);
console.log('━'.repeat(50));

if (broken.length > 0) {
  console.error(`\n❌ ${broken.length} unresolved anchor link(s):`);
  broken.forEach(anchor => console.error(`  - ${anchor.link} (in ${anchor.source}) — no matching target on /${anchor.page}`));
  console.error('');
  process.exit(1);
}

console.log('\n✅ All internal anchor links resolve!\n');
process.exit(0);
