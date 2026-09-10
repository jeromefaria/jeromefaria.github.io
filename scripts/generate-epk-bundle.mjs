import { createWriteStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { chromium } from '@playwright/test';

import { contentFor, epkKitFile, localePath, localeSuffix, locales, localize, outDir, pdfChrome, photoDownloadFilename, photosDir, root, siteConfig, siteUrl } from './epk-context.mjs';
import { baseStyles } from './pdf-styles.mjs';

const archiver = createRequire(import.meta.url)('archiver');

const styles = await baseStyles(root);

const rows = items => items.map(item => `<div class="year">${item.year}</div><div>${item.body}</div>`).join('');

const bundleHtml = (locale, content) => {
  const chrome = pdfChrome[locale];
  const link = path => `${siteUrl}${localePath(path, locale)}`;

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${styles}
  body { font-size: 9.5pt; line-height: 1.44; }
  header { border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 16px; }
  .masthead-row { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; margin-top: 4px; }
  .contact { font-size: 9pt; color: #666; }
  .contact a { color: #1a1a1a; text-decoration: none; white-space: nowrap; }
  h2 { margin: 0 0 7px; }
  .prose p { margin: 0 0 13px; }
  .prose p:last-child { margin-bottom: 0; }
  .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; margin-top: 18px; }
  .grid { display: grid; grid-template-columns: 2rem 1fr; gap: 4px 8px; font-size: 9pt; }
  .grid a { color: #1a1a1a; text-decoration: underline; text-decoration-color: #ccc; text-underline-offset: 2px; }
  .year { color: #999; font-variant-numeric: tabular-nums; }
  .quotes { margin-top: 13px; }
  blockquote { margin: 0 0 12px; break-inside: avoid; }
  blockquote cite { display: block; font-style: normal; font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 3px; }
  .roster { margin-top: 18px; }
  .roster p { margin: 7px 0 0; line-height: 1.6; }
  .roster a { color: #1a1a1a; text-decoration: underline; text-decoration-color: #ccc; text-underline-offset: 2px; }
  .roster .sep { color: #999; margin: 0 5px; }
  .press { margin-top: 18px; }
</style></head><body>
  <header>
    <h1>Jerome Faria</h1>
    <div class="masthead-row">
      <div class="tagline">${localize(siteConfig.tagline, locale)}</div>
      <div class="contact"><a href="${siteUrl}">${siteUrl.replace(/^https?:\/\//, '')}</a></div>
    </div>
  </header>
  <div class="prose">${content.longBio}</div>
  <div class="press">
    <h2>${chrome.press}</h2>
    <div class="quotes">${content.quotes.map(q => `<blockquote>${localize(q.quote, locale)}<cite>${q.source}</cite></blockquote>`).join('')}</div>
  </div>
  <div class="columns">
    <div><h2>${chrome.selectedPerformances}</h2><div class="grid">${rows(content.liveHighlights.map(h => ({ year: h.year, body: `<a href="${link(`/live#${h.id}`)}">${h.title}</a> — ${h.location}` })))}</div></div>
    <div><h2>${chrome.selectedWorks}</h2><div class="grid">${rows(content.workHighlights.map(w => ({ year: w.year, body: `<a href="${link(`/works#${w.id}`)}">${w.title}</a>` })))}</div></div>
  </div>
  <div class="roster">
    <h2>${chrome.sharedStages}</h2>
    <p>${content.sharedStages.map(act => (act.url ? `<a href="${act.url}">${act.name}</a>` : act.name)).join('<span class="sep">·</span>')}</p>
  </div>
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
