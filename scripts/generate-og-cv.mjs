import { join } from 'node:path';

import { chromium } from '@playwright/test';

import { root } from './data-loader.mjs';
import { interFontFaces } from './pdf-fonts.mjs';

const WIDTH = 1200;
const HEIGHT = 630;

const fontFaces = await interFontFaces(root);

const cardHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  ${fontFaces}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background: #000;
    color: #fff;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 76px 88px;
  }
  .eyebrow { text-transform: uppercase; letter-spacing: 0.28em; font-size: 20px; font-weight: 600; color: #a3a3a3; }
  .name { font-size: 92px; font-weight: 600; letter-spacing: -0.02em; line-height: 1; margin-top: 26px; }
  .role { font-size: 40px; font-weight: 500; color: #fff; margin-top: 22px; }
  .footer { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid #2a2a2a; padding-top: 26px; }
  .footer span { font-size: 24px; color: #a3a3a3; }
  .footer .url { color: #fff; font-weight: 500; }
</style></head><body>
  <div>
    <p class="eyebrow">Curriculum Vitae</p>
    <h1 class="name">Jerome Faria</h1>
    <p class="role">Senior Frontend Engineer</p>
  </div>
  <div class="footer">
    <span>Vue &middot; TypeScript &middot; 15+ years</span>
    <span class="url">jeromefaria.com/cv</span>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 2 });
await page.setContent(cardHtml, { waitUntil: 'networkidle' });
await page.screenshot({ path: join(root, 'public/og-cv.png'), clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
await page.close();
await browser.close();

console.log('CV social card → public/og-cv.png');
