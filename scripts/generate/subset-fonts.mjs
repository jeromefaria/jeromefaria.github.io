import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { create } from 'fontkit';
import subsetFont from 'subset-font';

import { INTER_WEIGHTS } from '../lib/inter-weights.mjs';
import { walkFiles } from '../lib/walk.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FONT_DIR = join(root, 'node_modules/@fontsource/inter/files');
const OUT_DIR = join(root, 'public/fonts');
const WEIGHTS = Object.fromEntries(INTER_WEIGHTS.map(weight => [weight, `inter-latin-${weight}-normal.woff2`]));

const collectChars = () => {
  const chars = new Set();

  for (const file of walkFiles(join(root, 'src'))) {
    if (/\.(ts|vue)$/.test(file) && !/\.test\.ts$/.test(file)) {
      for (const character of readFileSync(file, 'utf8')) chars.add(character);
    }
  }

  for (const character of readFileSync(join(root, 'index.html'), 'utf8')) chars.add(character);

  for (let codePoint = 0x20; codePoint <= 0x7e; codePoint += 1) chars.add(String.fromCodePoint(codePoint));
  for (let codePoint = 0xa0; codePoint <= 0xff; codePoint += 1) chars.add(String.fromCodePoint(codePoint));
  return chars;
};

const chars = collectChars();
const text = [...chars].join('');

const source = create(readFileSync(join(FONT_DIR, WEIGHTS[400])));
const missing = [...chars].filter(character => {
  const codePoint = character.codePointAt(0);
  return codePoint > 0x20 && !source.hasGlyphForCodePoint(codePoint);
});
if (missing.length) {
  const list = missing.map(character => `${character} U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`).join('  ');
  console.warn(`⚠️  ${missing.length} used character(s) not in the source font (will fall back):\n   ${list}`);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const [weight, file] of Object.entries(WEIGHTS)) {
  const buffer = readFileSync(join(FONT_DIR, file));
  const subset = await subsetFont(buffer, text, { targetFormat: 'woff2' });
  writeFileSync(join(OUT_DIR, `inter-${weight}.woff2`), subset);
  console.log(`  ${weight}: ${(buffer.length / 1024).toFixed(0)}KB → ${(subset.length / 1024).toFixed(1)}KB`);
}
console.log('✅ Subsetted fonts written to public/fonts/');
