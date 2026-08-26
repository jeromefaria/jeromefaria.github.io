import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';
import { createJiti } from 'jiti';

import { baseStyles } from './pdf-styles.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const jiti = createJiti(import.meta.url, { alias: { '@': join(root, 'src') } });
const { techRider } = await jiti.import(join(root, 'src/data/techRider.ts'));
const { epkRiderBasename } = await jiti.import(join(root, 'src/utils/epk.ts'));

const styles = await baseStyles(root);

const bullet = item =>
  typeof item === 'string'
    ? `<div class="item">${item}</div>`
    : `<div class="item"><span class="lbl">${item.label}</span> — ${item.text}</div>`;

const inputTable = table => `<table class="io">
  <thead><tr><th>Input</th><th>Format</th><th>Notes</th></tr></thead>
  <tbody>${table.rows.map(([input, format, notes]) => `<tr><td>${input}</td><td>${format}</td><td>${notes}</td></tr>`).join('')}</tbody>
</table>`;

const timingTable = table => `<table class="timing"><tbody>${table.rows
  .map(([stage, duration]) => `<tr><td>${stage}</td><td>${duration}</td></tr>`)
  .join('')}</tbody></table>`;

const table = t => (t.kind === 'input' ? inputTable(t) : timingTable(t));

const section = s => `<section>
  <h2>${s.title}</h2>
  ${s.body ? `<p class="body">${s.body}</p>` : ''}
  ${s.bullets ? s.bullets.map(bullet).join('') : ''}
  ${s.table ? table(s.table) : ''}
  ${s.footnote ? `<p class="footnote">${s.footnote}</p>` : ''}
</section>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
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
      <div class="tagline">Sound Artist &amp; Composer — Technical Rider</div>
    </div>
    <div class="updated">Updated ${techRider.updated}</div>
  </header>
  <p class="overview">${techRider.overview}</p>
  <div class="summary">${techRider.summary.map(item => `<div class="item">${item}</div>`).join('')}</div>
  ${techRider.sections.map(section).join('')}
  <div class="footer">Technical questions ahead of a booking — <a href="mailto:${techRider.contact}">${techRider.contact}</a></div>
</body></html>`;

const outPath = join(root, 'public/epk', `${epkRiderBasename}.pdf`);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.pdf({ path: outPath, format: 'A4', printBackground: true, margin: { top: '13mm', bottom: '13mm', left: '16mm', right: '16mm' } });
await browser.close();

console.log(`Tech rider → public/epk/${epkRiderBasename}.pdf`);
