/**
 * Subsets the Inter weights down to the glyphs this site actually uses and
 * writes self-hosted woff2 files to public/fonts/. Re-run whenever the content
 * introduces characters outside Basic Latin + Latin-1 (the script reports any
 * used character that the source font can't provide).
 *
 * Usage: node scripts/subset-fonts.mjs
 */
import { create } from 'fontkit';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import subsetFont from 'subset-font';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONT_DIR = join(root, 'node_modules/@fontsource/inter/files');
const OUT_DIR = join(root, 'public/fonts');
const WEIGHTS = { 400: 'inter-latin-400-normal.woff2', 500: 'inter-latin-500-normal.woff2', 600: 'inter-latin-600-normal.woff2' };

// 1. Collect every character the shipped content and templates use.
const collectChars = () => {
  const chars = new Set();
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(path);
      } else if (/\.(ts|vue)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name)) {
        for (const ch of readFileSync(path, 'utf8')) chars.add(ch);
      }
    }
  };
  walk(join(root, 'src'));
  for (const ch of readFileSync(join(root, 'index.html'), 'utf8')) chars.add(ch);

  // Safety margin: all of Basic Latin + Latin-1 Supplement, so ordinary future
  // copy (English + Portuguese) never needs a re-subset.
  for (let cp = 0x20; cp <= 0x7e; cp += 1) chars.add(String.fromCodePoint(cp));
  for (let cp = 0xa0; cp <= 0xff; cp += 1) chars.add(String.fromCodePoint(cp));
  return chars;
};

const chars = collectChars();
const text = [...chars].join('');

// 2. Report any used character the source font cannot provide (would silently
//    fall back to a system font on the page).
const source = create(readFileSync(join(FONT_DIR, WEIGHTS[400])));
const missing = [...chars].filter(ch => {
  const cp = ch.codePointAt(0);
  return cp > 0x20 && !source.hasGlyphForCodePoint(cp);
});
if (missing.length) {
  const list = missing.map(ch => `${ch} U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`).join('  ');
  console.warn(`⚠️  ${missing.length} used character(s) not in the source font (will fall back):\n   ${list}`);
}

// 3. Subset each weight.
mkdirSync(OUT_DIR, { recursive: true });
for (const [weight, file] of Object.entries(WEIGHTS)) {
  const buffer = readFileSync(join(FONT_DIR, file));
  const subset = await subsetFont(buffer, text, { targetFormat: 'woff2' });
  writeFileSync(join(OUT_DIR, `inter-${weight}.woff2`), subset);
  console.log(`  ${weight}: ${(buffer.length / 1024).toFixed(0)}KB → ${(subset.length / 1024).toFixed(1)}KB`);
}
console.log('✅ Subsetted fonts written to public/fonts/');
