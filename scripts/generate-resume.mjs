import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { chromium } from '@playwright/test';
import { marked } from 'marked';

import { root } from './data-loader.mjs';
import { baseStyles } from './pdf-styles.mjs';

marked.setOptions({ gfm: true, breaks: true });

const styles = await baseStyles(root);
const source = readFileSync(join(root, 'content/resume.md'), 'utf8');
const body = marked.parse(source);

const resumeHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  ${styles}
  body { line-height: 1.35; }
  h1 { margin: 0 0 1px; }
  h1 + p { font-size: 10.5pt; font-weight: 600; color: #333; margin: 0 0 8px; }
  h1 + p + p { font-size: 8.5pt; color: #555; line-height: 1.65; margin: 0; }
  h2 { margin: 11px 0 6px; }
  hr + h2 { border-bottom: none; margin-top: 3px; }
  p { margin: 0 0 4px; }
  ul { margin: 4px 0 5px; padding-left: 15px; }
  li { margin-bottom: 2px; padding-left: 2px; }
  li::marker { color: #bbb; }
  a { color: #1a1a1a; text-decoration: none; }
  hr { border: none; border-top: 1px solid #e6e6e6; margin: 9px 0; }
  p, li { break-inside: avoid; }
  h2 { break-after: avoid; }
</style></head><body>${body}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(resumeHtml, { waitUntil: 'networkidle' });
await page.pdf({
  path: join(root, 'public/jerome-faria-cv.pdf'),
  format: 'A4',
  printBackground: true,
  margin: { top: '14mm', bottom: '14mm', left: '16mm', right: '16mm' },
});
await page.close();
await browser.close();

console.log('Résumé → public/jerome-faria-cv.pdf');
