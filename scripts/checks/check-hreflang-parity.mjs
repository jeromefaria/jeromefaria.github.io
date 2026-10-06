#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const SITEMAP = join(DIST, 'sitemap.xml');

const altKey = (hreflang, href) => `${hreflang} ${href}`;
const joinKey = url => url.replace(/\/+$/, '') || url;
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? null;

const alternateLinks = html =>
  (html.match(/<link\b[^>]*>/g) ?? [])
    .filter(tag => /rel="alternate"/.test(tag))
    .map(tag => ({ hreflang: attr(tag, 'hreflang'), href: attr(tag, 'href') }))
    .filter(({ hreflang, href }) => hreflang && href);

const canonicalOf = html => {
  const tag = (html.match(/<link\b[^>]*>/g) ?? []).find(candidate => /rel="canonical"/.test(candidate));
  return tag ? attr(tag, 'href') : null;
};

const htmlFiles = [];
const walk = dir => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(DIST);

const pageAlternates = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const canonical = canonicalOf(html);
  if (canonical) pageAlternates.set(joinKey(canonical), new Set(alternateLinks(html).map(({ hreflang, href }) => altKey(hreflang, href))));
}

const sitemap = readFileSync(SITEMAP, 'utf8');
const sitemapAlternates = new Map();
for (const block of sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
  const loc = attr(block, 'loc') ?? block.match(/<loc>([^<]*)<\/loc>/)?.[1];
  if (!loc) continue;
  const alts = new Set(
    (block.match(/<xhtml:link\b[^>]*>/g) ?? []).map(tag => altKey(attr(tag, 'hreflang'), attr(tag, 'href'))),
  );
  sitemapAlternates.set(joinKey(loc), alts);
}

const violations = [];
let matched = 0;
for (const [loc, sitemapAlts] of sitemapAlternates) {
  const pageAlts = pageAlternates.get(loc);
  if (!pageAlts) continue;
  matched += 1;

  const onlyInPage = [...pageAlts].filter(alt => !sitemapAlts.has(alt));
  const onlyInSitemap = [...sitemapAlts].filter(alt => !pageAlts.has(alt));
  if (onlyInPage.length > 0 || onlyInSitemap.length > 0) violations.push({ loc, onlyInPage, onlyInSitemap });
}

if (matched === 0 && sitemapAlternates.size > 0) {
  console.error(`✖ hreflang parity: matched 0 of ${sitemapAlternates.size} sitemap URL(s) to a rendered page — the canonical↔loc join is broken (origin, trailing slash, or dirStyle drift). Refusing to pass vacuously.`);
  process.exit(1);
}

if (violations.length === 0) {
  console.log(`✓ hreflang parity: ${matched} page(s) checked against the sitemap, alternates agree.`);
  process.exit(0);
}

console.error('✖ hreflang alternates disagree between the rendered page and the sitemap:');
for (const { loc, onlyInPage, onlyInSitemap } of violations) {
  console.error(`  ${loc}`);
  for (const alt of onlyInPage) console.error(`    in page only:    ${alt}`);
  for (const alt of onlyInSitemap) console.error(`    in sitemap only: ${alt}`);
}
console.error('\nThe in-page <link rel="alternate" hreflang> and the sitemap xhtml:link alternates must match, or search engines get contradictory localization signals. Both derive from which /pt pages exist — reconcile usePageHead and generate-sitemap.');
process.exit(1);
