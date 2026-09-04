import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import sharp from 'sharp';

import { loadData, root } from './data-loader.mjs';

const PUBLIC = join(root, 'public');
const OUT = join(PUBLIC, 'images/responsive');

const RESPONSIVE_IMAGE = /^\/images\/[a-z0-9-]+\.jpg$/;

const DEFAULT_QUALITY = 78;
const QUALITY_OVERRIDES = { hyphema: 85 };

const { worksData } = await loadData('src/data/works.ts');
const { aboutSections } = await loadData('src/data/about.ts');

const coverSrcs = Object.values(worksData)
  .flatMap(section => section.items)
  .map(item => item.coverImage)
  .filter(src => src && RESPONSIVE_IMAGE.test(src));

const aboutSrcs = aboutSections
  .flatMap(section => section.images ?? [])
  .map(image => image.src)
  .filter(src => RESPONSIVE_IMAGE.test(src));

const covers = [...new Set(coverSrcs)].map(src => ({ src, widths: [320, 640, 960] }));
const aboutImages = [...new Set(aboutSrcs)].map(src => ({ src, widths: [480, 960, 1440] }));
const heroImages = [{ src: '/images/performance.jpg', widths: [1280] }];
const targets = [...covers, ...aboutImages, ...heroImages];

mkdirSync(OUT, { recursive: true });

let generated = 0;
let savedKb = 0;
const manifest = {};
for (const { src, widths } of targets) {
  const input = join(PUBLIC, src);
  const name = basename(src, '.jpg');
  const quality = QUALITY_OVERRIDES[name] ?? DEFAULT_QUALITY;
  const meta = await sharp(input).metadata();

  const produced = [];
  for (const width of widths) {
    if (meta.width && width > meta.width) continue;
    const out = join(OUT, `${name}-${width}w.webp`);
    produced.push(width);

    if (existsSync(out) && statSync(out).mtimeMs >= statSync(input).mtimeMs) continue;

    const info = await sharp(input).resize({ width }).webp({ quality }).toFile(out);
    generated += 1;
    savedKb += info.size / 1024;
  }
  manifest[name] = { widths: produced, width: meta.width, height: meta.height };
}

writeFileSync(
  join(root, 'src/data/responsiveImages.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Responsive images: ${generated} generated${generated ? ` (${(savedKb / 1024).toFixed(1)}MB)` : ' (all cached)'}, manifest covers ${Object.keys(manifest).length} images.`);
