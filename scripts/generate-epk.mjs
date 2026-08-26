// Local-only: reads the gitignored masters in assets-source/press/, so CI can't run it.
import { chromium } from '@playwright/test';
import { exiftool } from 'exiftool-vendored';
import { createWriteStream } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';
import sharp from 'sharp';

const archiver = createRequire(import.meta.url)('archiver');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const mastersDir = join(root, 'assets-source/press');
const outDir = join(root, 'public/epk');
const photosDir = join(outDir, 'photos');

const jiti = createJiti(import.meta.url, { alias: { '@': src } });
const { epkManifest } = await jiti.import(join(src, 'data/epk.ts'));
const { resolveEpkContent, photoDownloadFilename, epkKitBasename: kitName } = await jiti.import(join(src, 'utils/epk.ts'));
const { siteConfig, social } = await jiti.import(join(src, 'data/navigation.ts'));

const content = resolveEpkContent(epkManifest);
const siteUrl = siteConfig.url.replace(/\/$/, '');
const bandcamp = social.find(item => item.name === 'bandcamp');
const contact = {
  email: siteConfig.author.email,
  website: siteConfig.url,
  bandcamp: bandcamp?.url,
};

await rm(outDir, { recursive: true, force: true });
await mkdir(photosDir, { recursive: true });

const photoFiles = [];
for (const [index, photo] of content.photos.entries()) {
  const filename = photoDownloadFilename(photo, index);
  const outPath = join(photosDir, filename);

  await sharp(join(mastersDir, basename(photo.src)))
    .rotate()
    .resize({ width: 3000, height: 3000, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toFile(outPath);

  if (photo.photographer) {
    const name = photo.photographer.name;
    await exiftool.write(outPath, {
      'EXIF:Artist': name,
      'XMP:Creator': name,
      'IPTC:By-line': name,
      'IPTC:Credit': name,
      'EXIF:Copyright': `© ${name}`,
      'XMP:Rights': `© ${name}`,
      'IPTC:CopyrightNotice': `© ${name}`,
    }, { writeArgs: ['-overwrite_original'] });
  }

  photoFiles.push({ path: outPath, filename, credit: photo.photographer?.name ?? 'Jerome Faria' });
}

const rows = items => items.map(item => `<div class="year">${item.year}</div><div>${item.body}</div>`).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; font-size: 10pt; line-height: 1.48; margin: 0; }
  header { border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 16px; }
  h1 { font-size: 20pt; margin: 0; letter-spacing: -0.01em; }
  .tagline { text-transform: uppercase; letter-spacing: 0.12em; font-size: 8pt; color: #666; margin-top: 4px; }
  h2 { font-size: 8pt; text-transform: uppercase; letter-spacing: 0.12em; color: #666; border-bottom: 1px solid #eee; padding-bottom: 4px; margin: 0 0 7px; }
  .prose p { margin: 0 0 7px; }
  .prose p:last-child { margin-bottom: 0; }
  .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 30px; margin-top: 16px; }
  .grid { display: grid; grid-template-columns: 2.8rem 1fr; gap: 4px 12px; }
  .grid a { color: #1a1a1a; text-decoration: underline; text-decoration-color: #ccc; text-underline-offset: 2px; }
  .year { color: #999; font-variant-numeric: tabular-nums; }
  .quotes { column-count: 2; column-gap: 30px; margin-top: 7px; }
  blockquote { margin: 0 0 10px; font-style: italic; break-inside: avoid; }
  blockquote cite { display: block; font-style: normal; font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 3px; }
  .press { margin-top: 16px; }
  .contact { margin-top: 16px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 9.5pt; }
  .contact a { color: #1a1a1a; text-decoration: none; }
  em { font-style: italic; }
</style></head><body>
  <header>
    <h1>Jerome Faria</h1><div class="tagline">Sound Artist &amp; Composer</div>
  </header>
  <div class="prose">${content.longBio}</div>
  <div class="columns">
    <div><h2>Selected performances</h2><div class="grid">${rows(content.liveHighlights.map(h => ({ year: h.year, body: `<a href="${siteUrl}/live#${h.id}">${h.title}</a> — ${h.location}` })))}</div></div>
    <div><h2>Selected works</h2><div class="grid">${rows(content.workHighlights.map(w => ({ year: w.year, body: `<a href="${siteUrl}/works#${w.id}">${w.title}</a>` })))}</div></div>
  </div>
  <div class="press">
    <h2>Press</h2>
    <div class="quotes">${content.quotes.map(q => `<blockquote>${q.quote}<cite>${q.source}</cite></blockquote>`).join('')}</div>
  </div>
  <div class="contact"><a href="mailto:${contact.email}">${contact.email}</a> &nbsp;·&nbsp; <a href="${contact.website}">${contact.website.replace(/^https?:\/\//, '')}</a> &nbsp;·&nbsp; <a href="${contact.bandcamp}">${contact.bandcamp.replace(/^https?:\/\//, '')}</a></div>
</body></html>`;

const pdfPath = join(outDir, `${kitName}.pdf`);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, margin: { top: '12mm', bottom: '12mm', left: '14mm', right: '14mm' } });
await browser.close();

const creditsText = `Jerome Faria — press kit\n\nPhotography:\n${photoFiles.map(p => `  ${p.filename} — ${p.credit}`).join('\n')}\n\nSite content © ${siteConfig.author.name}. Photographs remain the property of their authors.\n`;
const creditsPath = join(outDir, 'CREDITS.txt');
await writeFile(creditsPath, creditsText);

const zipPath = join(outDir, `${kitName}.zip`);
await new Promise((resolvePromise, reject) => {
  const output = createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', resolvePromise);
  archive.on('error', reject);
  archive.pipe(output);
  archive.file(pdfPath, { name: `${kitName}/${kitName}.pdf` });
  archive.file(creditsPath, { name: `${kitName}/CREDITS.txt` });
  for (const photo of photoFiles) {
    archive.file(photo.path, { name: `${kitName}/photos/${photo.filename}` });
  }
  archive.finalize();
});

await exiftool.end();
console.log(`EPK kit: ${photoFiles.length} photos + PDF + zip → public/epk/`);
