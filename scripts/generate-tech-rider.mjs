import { join } from 'node:path';

import { chromium } from '@playwright/test';

import { epkRiderFile, locales, localize, outDir, pdfChrome, root, siteConfig, techRider } from './epk-context.mjs';
import { baseStyles } from './pdf-styles.mjs';

const styles = await baseStyles(root);

const bullet = item =>
  typeof item === 'string'
    ? `<div class="item">${item}</div>`
    : `<div class="item"><span class="lbl">${item.label}</span> — ${item.text}</div>`;

const inputTable = (rows, [inputHead, formatHead, notesHead]) => `<table class="io">
  <thead><tr><th>${inputHead}</th><th>${formatHead}</th><th>${notesHead}</th></tr></thead>
  <tbody>${rows.map(([input, format, notes]) => `<tr><td>${input}</td><td>${format}</td><td>${notes}</td></tr>`).join('')}</tbody>
</table>`;

const timingTable = rows => `<table class="timing"><tbody>${rows
  .map(([stage, duration]) => `<tr><td>${stage}</td><td>${duration}</td></tr>`)
  .join('')}</tbody></table>`;

const renderTable = (table, locale, chrome) => {
  const rows = localize(table.rows, locale);
  return table.kind === 'input' ? inputTable(rows, chrome.inputHeaders) : timingTable(rows);
};

const section = (s, locale, chrome) => `<section>
  <h2>${localize(s.title, locale)}</h2>
  ${s.body ? `<p class="body">${localize(s.body, locale)}</p>` : ''}
  ${s.bullets ? localize(s.bullets, locale).map(bullet).join('') : ''}
  ${s.table ? renderTable(s.table, locale, chrome) : ''}
  ${s.footnote ? `<p class="footnote">${localize(s.footnote, locale)}</p>` : ''}
</section>`;

const riderHtml = locale => {
  const chrome = pdfChrome[locale];

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${styles}
  body { line-height: 1.45; }
  header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #ddd; padding-bottom: 12px; margin-bottom: 16px; }
  .tagline { margin-top: 5px; }
  .updated { text-transform: uppercase; letter-spacing: 0.1em; font-size: 7.5pt; color: #999; text-align: right; white-space: nowrap; }
  .overview { margin: 0 0 10px; }
  .summary { margin: 0 0 22px; padding: 12px 16px; background: #f6f6f6; }
  section { margin-bottom: 22px; break-inside: avoid; }
  h2 { margin: 0 0 9px; }
  .body { margin: 0 0 8px; }
  .item { position: relative; padding-left: 15px; margin-bottom: 6px; }
  .item::before { content: '•'; position: absolute; left: 2px; color: #bbb; }
  .item:last-child { margin-bottom: 0; }
  .lbl { font-weight: 500; }
  .footnote { font-size: 9pt; color: #666; margin: 8px 0 0; }
  table.io { width: 100%; border-collapse: collapse; margin-top: 6px; border: 1px solid #ddd; }
  table.io th { text-align: left; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em; color: #666; font-weight: 500; padding: 6px 10px; background: #f6f6f6; border-bottom: 1px solid #ddd; }
  table.io td { padding: 8px 10px; border-bottom: 1px solid #eee; vertical-align: top; }
  table.io td:first-child { font-weight: 500; white-space: nowrap; }
  table.io tr:last-child td { border-bottom: none; }
  table.timing { border-collapse: collapse; margin-top: 4px; }
  table.timing td { padding: 4px 14px 4px 0; vertical-align: top; }
  table.timing td:first-child { color: #555; font-weight: 500; white-space: nowrap; }
  .footer { margin-top: 20px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 9pt; color: #444; }
  .footer a { color: #1a1a1a; text-decoration: none; }
</style></head><body>
  <header>
    <div>
      <h1>Jerome Faria</h1>
      <div class="tagline">${localize(siteConfig.tagline, locale)} — ${chrome.riderLabel}</div>
    </div>
    <div class="updated">${chrome.updated} ${localize(techRider.updated, locale)}</div>
  </header>
  <p class="overview">${localize(techRider.overview, locale)}</p>
  <div class="summary">${localize(techRider.summary, locale).map(item => `<div class="item">${item}</div>`).join('')}</div>
  ${techRider.sections.map(s => section(s, locale, chrome)).join('')}
  <div class="footer">${chrome.riderFooter} — <a href="mailto:${techRider.contact}">${techRider.contact}</a></div>
</body></html>`;
};

const browser = await chromium.launch();

for (const locale of locales) {
  const page = await browser.newPage();
  await page.setContent(riderHtml(locale), { waitUntil: 'networkidle' });
  const filename = `${epkRiderFile(locale)}.pdf`;
  await page.pdf({ path: join(outDir, filename), format: 'A4', printBackground: true, margin: { top: '13mm', bottom: '13mm', left: '16mm', right: '16mm' } });
  await page.close();
  console.log(`Tech rider → public/epk/${filename}`);
}

await browser.close();
