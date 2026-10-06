#!/usr/bin/env node

import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { loadSrc, root } from '../lib/data-loader.mjs';

const DIST = join(root, 'dist');

const toRoute = file =>
  `/${relative(DIST, file).replace(/\\/g, '/')}`.replace(/\/index\.html$/, '/').replace(/\.html$/, '');

const emittedRoutes = () => {
  const routes = new Set();
  const walk = dir => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith('.html')) routes.add(toRoute(full));
    }
  };
  walk(DIST);
  return routes;
};

const { routes: routeTable } = await loadSrc('router/index.ts');
const { worksData } = await loadSrc('data/works.ts');
const { liveEvents } = await loadSrc('data/live.ts');
const { essays } = await loadSrc('data/writing.ts');
const { newsletterIssues } = await loadSrc('data/newsletter/issues.ts');

const englishOnlyByPrefix = new Map();
for (const route of routeTable) {
  const match = route.path.match(/^(\/[^/]+)\/:/);
  if (match) englishOnlyByPrefix.set(match[1], Boolean(route.meta?.englishOnly));
}

const releaseIds = Object.values(worksData).flatMap(section =>
  section.items.filter(item => item.meta.kind !== 'engineering').map(item => item.id));

const sources = [
  ['/works', releaseIds],
  ['/live', liveEvents.map(event => event.id)],
  ['/writing', essays.map(essay => essay.slug)],
  ['/newsletter', newsletterIssues.map(issue => issue.id)],
];

const sourcePrefixes = new Set(sources.map(([prefix]) => prefix));
const uncovered = [...englishOnlyByPrefix.keys()].filter(prefix => !sourcePrefixes.has(prefix));
const stale = [...sourcePrefixes].filter(prefix => !englishOnlyByPrefix.has(prefix));
if (uncovered.length > 0 || stale.length > 0) {
  console.error('✖ Dynamic detail-route types are out of sync between src/router and this check:');
  for (const prefix of uncovered) console.error(`  ${prefix} — a dynamic route in src/router this check does not cover (add it to sources)`);
  for (const prefix of stale) console.error(`  ${prefix} — listed here but no longer a dynamic route in src/router (stale or renamed)`);
  console.error('\nThis check must cover exactly the router\'s dynamic detail routes; reconcile its sources with src/router.');
  process.exit(1);
}

const expectedCount = sources.reduce((total, [, ids]) => total + ids.length, 0);
if (expectedCount === 0) {
  console.error('✖ Loaded zero detail routes from the data — a loader regression? Refusing to pass vacuously.');
  process.exit(1);
}

const emitted = emittedRoutes();
const i18nEnabled = existsSync(join(DIST, 'pt'));

const missing = [];
const orphanedPt = [];

for (const [prefix, ids] of sources) {
  const englishOnly = englishOnlyByPrefix.get(prefix) ?? false;

  for (const id of ids) {
    const base = `${prefix}/${id}`;
    if (!emitted.has(base)) missing.push(base);
    if (i18nEnabled && !englishOnly && !emitted.has(`/pt${base}`)) missing.push(`/pt${base}`);
  }

  if (englishOnly) {
    for (const route of emitted) {
      if (route.startsWith(`/pt${prefix}/`)) orphanedPt.push(route);
    }
  }
}

if (missing.length === 0 && orphanedPt.length === 0) {
  console.log(`✓ Prerendered routes: ${expectedCount} detail route(s) across ${sources.length} types all present, no englishOnly /pt orphans.`);
  process.exit(0);
}

if (missing.length > 0) {
  console.error('✖ Expected detail route(s) missing from dist (a page failed to prerender, or a /pt mirror is absent):');
  for (const route of missing) console.error(`  ${route}`);
}
if (orphanedPt.length > 0) {
  console.error('✖ /pt page(s) prerendered for an englishOnly route (router englishOnly meta and vite.config includedRoutes disagree):');
  for (const route of orphanedPt) console.error(`  ${route}`);
}
console.error('\nEvery works/live/writing/newsletter detail page the data defines must prerender, and englishOnly types must get no /pt mirror. Reconcile src/router englishOnly meta with vite.config includedRoutes.');
process.exit(1);
