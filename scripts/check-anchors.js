#!/usr/bin/env node

import { loadSrc } from './data-loader.mjs';

const [{ worksData, worksSections }, { sortedLiveData, liveYears }, { pressQuotes }, { aboutSections }] =
  await Promise.all([
    loadSrc('data/works.ts'),
    loadSrc('data/live.ts'),
    loadSrc('data/press.ts'),
    loadSrc('data/about.ts'),
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

const MARKER_PATTERN = /\[\[([^\]]+)\]\]/g;
const unresolvedMarkers = [];

for (const section of Object.values(worksData)) {
  for (const item of section.items ?? []) {
    if (typeof item.credits !== 'string') continue;

    const linked = new Set((item.contributors ?? []).filter(contributor => contributor.url).map(contributor => contributor.name));
    for (const match of item.credits.matchAll(MARKER_PATTERN)) {
      if (!linked.has(match[1])) unresolvedMarkers.push({ id: item.id, name: match[1] });
    }
  }
}

console.log('\n🔗 Content Integrity Check:');
console.log('━'.repeat(50));
console.log(`Scanned ${anchors.length} internal anchor link(s) and credit markers across ${Object.keys(sources).length} data files.`);
console.log('━'.repeat(50));

let failed = false;

if (broken.length > 0) {
  failed = true;
  console.error(`\n❌ ${broken.length} unresolved anchor link(s):`);
  broken.forEach(anchor => console.error(`  - ${anchor.link} (in ${anchor.source}) — no matching target on /${anchor.page}`));
}

if (unresolvedMarkers.length > 0) {
  failed = true;
  console.error(`\n❌ ${unresolvedMarkers.length} unresolved credit marker(s) — no url-bearing contributor:`);
  unresolvedMarkers.forEach(marker => console.error(`  - [[${marker.name}]] in works.ts release '${marker.id}'`));
}

if (failed) {
  console.error('');
  process.exit(1);
}

console.log('\n✅ All anchor links and credit markers resolve!\n');
process.exit(0);
