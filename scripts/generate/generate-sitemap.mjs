import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { extractPageImages } from '../lib/images.mjs';
import { distRoute, walkFiles } from '../lib/walk.mjs';

const DIST = 'dist';
const ORIGIN = 'https://jeromefaria.com';

const EXCLUDE = new Set(['/404', '/epk', '/cv']);
const EXCLUDE_PREFIXES = ['/archive'];

const xmlEscape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const stripLocale = route => (route === '/pt' || route.startsWith('/pt/') ? route.slice(3) || '/' : route);
const ptRoute = base => (base === '/' ? '/pt' : `/pt${base}`);

const priority = base => {
  if (base === '/') return '1.0';
  if (base === '/works') return '0.9';
  if (base.startsWith('/works/')) return '0.6';
  return '0.7';
};

const htmlFiles = [...walkFiles(DIST)].filter(file => file.endsWith('.html'));

const routeToFile = new Map();
for (const file of htmlFiles) {
  const route = distRoute(file, DIST);
  if (!routeToFile.has(route)) routeToFile.set(route, file);
}

const routes = [...routeToFile.keys()]
  .filter(route => {
    const base = stripLocale(route);
    return !EXCLUDE.has(base) && !EXCLUDE_PREFIXES.some(prefix => base === prefix || base.startsWith(`${prefix}/`));
  })
  .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));

const routeSet = new Set(routes);

const images = route => {
  const file = routeToFile.get(route);
  if (!file) return '';

  return extractPageImages(readFileSync(file, 'utf8'))
    .map(src => `    <image:image>\n      <image:loc>${xmlEscape(`${ORIGIN}${src}`)}</image:loc>\n    </image:image>\n`)
    .join('');
};

const alternates = base => {
  if (!routeSet.has(ptRoute(base))) return '';

  const en = `${ORIGIN}${base}`;
  const pt = `${ORIGIN}${ptRoute(base)}`;

  return `${[
    `    <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
    `    <xhtml:link rel="alternate" hreflang="pt" href="${pt}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />`,
  ].join('\n')  }\n`;
};

const lastmod = new Date().toISOString().slice(0, 10);

const urls = routes
  .map(route => {
    const base = stripLocale(route);

    return `  <url>\n    <loc>${xmlEscape(`${ORIGIN}${route}`)}</loc>\n${alternates(base)}${images(route)}    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority(base)}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`;

writeFileSync(join(DIST, 'sitemap.xml'), xml);
console.log(`✓ Generated sitemap.xml with ${routes.length} URLs`);
