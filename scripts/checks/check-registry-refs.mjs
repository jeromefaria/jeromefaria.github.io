#!/usr/bin/env node

import { loadSrc } from '../lib/data-loader.mjs';

const { orgs } = await loadSrc('data/orgs.ts');
const { venues } = await loadSrc('data/venues.ts');
const { allReleases } = await loadSrc('data/works.ts');
const { recentEvents } = await loadSrc('data/live/recent.ts');
const { midEvents } = await loadSrc('data/live/mid.ts');
const { earlyEvents } = await loadSrc('data/live/early.ts');

const orgKeys = new Set(Object.keys(orgs));
const venueKeys = new Set(Object.keys(venues));

const editionsOf = meta => {
  if ('editions' in meta) return meta.editions;
  if (meta.kind === 'commission' && meta.work === 'DVD') return [meta.publisher];
  return [];
};

const unresolved = [];
let orgRefCount = 0;
let venueRefCount = 0;

for (const release of allReleases) {
  for (const edition of editionsOf(release.meta)) {
    if (typeof edition.label !== 'string') continue;

    orgRefCount += 1;
    if (!orgKeys.has(edition.label)) unresolved.push(`${release.id}  edition label '${edition.label}' (org)`);
  }
}

for (const event of [...recentEvents, ...midEvents, ...earlyEvents]) {
  const { venue } = event;
  if (!venue || typeof venue !== 'object' || !('ref' in venue)) continue;

  venueRefCount += 1;
  if (!venueKeys.has(venue.ref)) unresolved.push(`${event.id}  venue ref '${venue.ref}'`);
}

if (unresolved.length > 0) {
  console.error(`\n❌ ${unresolved.length} registry ref(s) resolve to no entry:`);
  unresolved.forEach(entry => console.error(`  - ${entry}`));
  console.error('\nAdd the entry to src/data/orgs.ts or src/data/venues.ts, or use an inline literal for a one-off.\n');
  process.exit(1);
}

console.log(`✓ Registry refs: ${orgRefCount} org + ${venueRefCount} venue ref(s) all resolve (${orgKeys.size} orgs, ${venueKeys.size} venues).`);
