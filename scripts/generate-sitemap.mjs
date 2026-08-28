// Generates dist/sitemap.xml from the routes actually pre-rendered by vite-ssg,
// so it can never drift from what exists (the previous hand-maintained file
// omitted /contact, /privacy, and every /works/:id permalink). Runs at the end
// of the build, after the HTML is on disk.
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const ORIGIN = 'https://jeromefaria.com';

// Kept out of the sitemap: the error page and the noindex press kit (robots.txt
// also disallows /epk).
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

const priority = route => {
  if (route === '/') return '1.0';
  if (route === '/works') return '0.9';
  if (route.startsWith('/works/')) return '0.6';
  return '0.7';
};

walk(DIST);

const routes = [...new Set(htmlFiles.map(toRoute))]
  .filter(route => !EXCLUDE.has(route))
  .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));

const urls = routes
  .map(route =>
    `  <url>\n    <loc>${ORIGIN}${route}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority(route)}</priority>\n  </url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(join(DIST, 'sitemap.xml'), xml);
console.log(`✓ Generated sitemap.xml with ${routes.length} URLs`);
