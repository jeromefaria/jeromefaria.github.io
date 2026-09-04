import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const ORIGIN = 'https://jeromefaria.com';

const EXCLUDE = new Set(['/404', '/epk']);

const htmlFiles = [];
const walk = dir => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (entry.endsWith('.html')) {
      htmlFiles.push(full);
    }
  }
};

const toRoute = file =>
  `/${relative(DIST, file).replace(/\\/g, '/')}`
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '');

const stripLocale = route => (route === '/pt' || route.startsWith('/pt/') ? route.slice(3) || '/' : route);
const ptRoute = base => (base === '/' ? '/pt' : `/pt${base}`);

const priority = base => {
  if (base === '/') return '1.0';
  if (base === '/works') return '0.9';
  if (base.startsWith('/works/')) return '0.6';
  return '0.7';
};

walk(DIST);

const routes = [...new Set(htmlFiles.map(toRoute))]
  .filter(route => !EXCLUDE.has(stripLocale(route)))
  .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));

const routeSet = new Set(routes);

const alternates = base => {
  if (!routeSet.has(ptRoute(base))) return '';

  const en = `${ORIGIN}${base}`;
  const pt = `${ORIGIN}${ptRoute(base)}`;

  return [
    `    <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
    `    <xhtml:link rel="alternate" hreflang="pt" href="${pt}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />`,
  ].join('\n') + '\n';
};

const lastmod = new Date().toISOString().slice(0, 10);

const urls = routes
  .map(route => {
    const base = stripLocale(route);

    return `  <url>\n    <loc>${ORIGIN}${route}</loc>\n${alternates(base)}    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority(base)}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;

writeFileSync(join(DIST, 'sitemap.xml'), xml);
console.log(`✓ Generated sitemap.xml with ${routes.length} URLs`);
