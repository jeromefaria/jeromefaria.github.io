import { createWriteStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { chromium } from '@playwright/test';

import { contact, contentFor, epkKitFile, localePath, localeSuffix, locales, localize, outDir, pdfChrome, photoDownloadFilename, photosDir, root, siteConfig, siteUrl } from './epk-context.mjs';
import { baseStyles } from './pdf-styles.mjs';

const archiver = createRequire(import.meta.url)('archiver');

const styles = await baseStyles(root);

const rows = items => items.map(item => `<div class="year">${item.year}</div><div>${item.body}</div>`).join('');

const bundleHtml = (locale, content) => {
  const chrome = pdfChrome[locale];
  const link = path => `${siteUrl}${localePath(path, locale)}`;

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${styles}
  body { line-height: 1.48; }
  header { border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 16px; }
  .tagline { margin-top: 4px; }
  h2 { margin: 0 0 7px; }
  .prose p { margin: 0 0 7px; }
  .prose p:last-child { margin-bottom: 0; }
  .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 30px; margin-top: 16px; }
  .grid { display: grid; grid-template-columns: 2.8rem 1fr; gap: 4px 12px; }
  .grid a { color: #1a1a1a; text-decoration: underline; text-decoration-color: #ccc; text-underline-offset: 2px; }
  .year { color: #999; font-variant-numeric: tabular-nums; }
  .quotes { column-count: 2; column-gap: 30px; margin-top: 7px; }
  blockquote { margin: 0 0 10px; break-inside: avoid; }
  blockquote cite { display: block; font-style: normal; font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 3px; }
  .press { margin-top: 16px; }
  .contact { margin-top: 16px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 9.5pt; }
  .contact a { color: #1a1a1a; text-decoration: none; }
</style></head><body>
  <header>
    <h1>Jerome Faria</h1><div class="tagline">${localize(siteConfig.tagline, locale)}</div>
  </header>
  <div class="prose">${content.longBio}</div>
  <div class="columns">
    <div><h2>${chrome.selectedPerformances}</h2><div class="grid">${rows(content.liveHighlights.map(h => ({ year: h.year, body: `<a href="${link(`/live#${h.id}`)}">${h.title}</a> — ${h.location}` })))}</div></div>
    <div><h2>${chrome.selectedWorks}</h2><div class="grid">${rows(content.workHighlights.map(w => ({ year: w.year, body: `<a href="${link(`/works#${w.id}`)}">${w.title}</a>` })))}</div></div>
  </div>
  <div class="press">
    <h2>${chrome.press}</h2>
    <div class="quotes">${content.quotes.map(q => `<blockquote>${localize(q.quote, locale)}<cite>${q.source}</cite></blockquote>`).join('')}</div>
  </div>
  <div class="contact"><a href="mailto:${contact.email}">${contact.email}</a> &nbsp;·&nbsp; <a href="${contact.website}">${contact.website.replace(/^https?:\/\//, '')}</a> &nbsp;·&nbsp; <a href="${contact.bandcamp}">${contact.bandcamp.replace(/^https?:\/\//, '')}</a></div>
</body></html>`;
};

const browser = await chromium.launch();

for (const locale of locales) {
  const content = contentFor(locale);
  const chrome = pdfChrome[locale];
  const kitName = epkKitFile(locale);

  const photoFiles = content.photos.map((photo, index) => {
    const filename = photoDownloadFilename(photo, index);
    return { path: join(photosDir, filename), filename, credit: photo.photographer?.name ?? 'Jerome Faria' };
  });

  const pdfPath = join(outDir, `${kitName}.pdf`);
  const page = await browser.newPage();
  await page.setContent(bundleHtml(locale, content), { waitUntil: 'networkidle' });
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, margin: { top: '12mm', bottom: '12mm', left: '14mm', right: '14mm' } });
  await page.close();

  const creditsText = `${chrome.creditsTitle}\n\n${chrome.creditsPhotography}\n${photoFiles.map(p => `  ${p.filename} — ${p.credit}`).join('\n')}\n\n${chrome.creditsCopyright(siteConfig.author.name)}\n`;
  const creditsPath = join(outDir, `CREDITS${localeSuffix(locale)}.txt`);
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

  console.log(`EPK bundle (${locale}): PDF + zip → public/epk/`);
}

await browser.close();
