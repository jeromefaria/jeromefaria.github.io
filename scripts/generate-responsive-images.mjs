import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(root, 'public');
const OUT = join(PUBLIC, 'images/responsive');

const extract = (file, key) => {
  const text = readFileSync(join(root, 'src/data', file), 'utf8');
  const imagePattern = new RegExp(`${key}:\\s*'(/images/[a-z0-9-]+\\.jpg)'`, 'g');
  return [...text.matchAll(imagePattern)].map(match => match[1]);
};

const covers = [...new Set(extract('works.ts', 'coverImage'))].map(src => ({ src, widths: [320, 640, 960] }));
const aboutImages = [...new Set(extract('about.ts', 'src'))].map(src => ({ src, widths: [480, 960, 1440] }));
const targets = [...covers, ...aboutImages];

mkdirSync(OUT, { recursive: true });

let generated = 0;
let savedKb = 0;
const manifest = {};
for (const { src, widths } of targets) {
  const input = join(PUBLIC, src);
  const name = basename(src, '.jpg');
  const meta = await sharp(input).metadata();

  const produced = [];
  for (const width of widths) {
    if (meta.width && width > meta.width) continue;
    const out = join(OUT, `${name}-${width}w.webp`);
    produced.push(width);

    if (existsSync(out) && statSync(out).mtimeMs >= statSync(input).mtimeMs) continue;

    const info = await sharp(input).resize({ width }).webp({ quality: 78 }).toFile(out);
    generated += 1;
    savedKb += info.size / 1024;
  }
  manifest[name] = produced;
}

// Committed manifest of the widths actually generated per image, so the runtime
// srcset only ever lists variants that exist.
writeFileSync(
  join(root, 'src/data/responsiveImages.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Responsive images: ${generated} generated${generated ? ` (${(savedKb / 1024).toFixed(1)}MB)` : ' (all cached)'}, manifest covers ${Object.keys(manifest).length} images.`);
