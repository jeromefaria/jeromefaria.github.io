#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadSrc, root } from '../lib/data-loader.mjs';
import { distRoute, walkFiles } from '../lib/walk.mjs';

const DIST = join(root, 'dist');

export const routePrefixes = routeTable => {
  const byPrefix = new Map();
  for (const route of routeTable) {
    const match = route.path.match(/^(\/[^/]+)\/:/);
    if (match) byPrefix.set(match[1], Boolean(route.meta?.englishOnly));
  }
  return byPrefix;
};

export const prefixDrift = (englishOnlyByPrefix, sourcePrefixes) => ({
  uncovered: [...englishOnlyByPrefix.keys()].filter(prefix => !sourcePrefixes.has(prefix)),
  stale: [...sourcePrefixes].filter(prefix => !englishOnlyByPrefix.has(prefix)),
});

export const routeGaps = ({ sources, englishOnlyByPrefix, emitted, i18nEnabled }) => {
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

  return { missing, orphanedPt };
};

const emittedRoutes = () => {
  const routes = new Set();
  for (const file of walkFiles(DIST)) {
    if (file.endsWith('.html')) routes.add(distRoute(file, DIST));
  }
  return routes;
};

const main = async () => {
  const { routes: routeTable } = await loadSrc('router/index.ts');
  const { worksData } = await loadSrc('data/works.ts');
  const { liveEvents } = await loadSrc('data/live.ts');
  const { essays } = await loadSrc('data/writing.ts');
  const { newsletterIssues } = await loadSrc('data/newsletter/issues.ts');

  const englishOnlyByPrefix = routePrefixes(routeTable);

  const releaseIds = Object.values(worksData).flatMap(section =>
    section.items.filter(item => item.meta.kind !== 'engineering').map(item => item.id));

  const sources = [
    ['/works', releaseIds],
    ['/live', liveEvents.map(event => event.id)],
    ['/writing', essays.map(essay => essay.slug)],
    ['/newsletter', newsletterIssues.map(issue => issue.id)],
  ];

  const sourcePrefixes = new Set(sources.map(([prefix]) => prefix));
  const { uncovered, stale } = prefixDrift(englishOnlyByPrefix, sourcePrefixes);
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

  const { missing, orphanedPt } = routeGaps({ sources, englishOnlyByPrefix, emitted, i18nEnabled });

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
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
