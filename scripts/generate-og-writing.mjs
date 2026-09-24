import { join } from 'node:path';

import { loadSrc, root } from './data-loader.mjs';
import { interFontFaces } from './pdf-fonts.mjs';
import { CARD_HEIGHT, CARD_WIDTH, renderCard, withBrowser } from './playwright-render.mjs';

const { essays } = await loadSrc('data/writing.ts');
const { cardColor: C, tracking: T, weight: W } = await loadSrc('design/tokens.ts');
const fontFaces = await interFontFaces(root);

const cardHtml = essay => `<!doctype html><html><head><meta charset="utf-8"><style>
  ${fontFaces}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${CARD_WIDTH}px;
    height: ${CARD_HEIGHT}px;
    background: ${C.bg};
    color: ${C.text};
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 76px 88px;
  }
  .eyebrow { text-transform: uppercase; letter-spacing: ${T.display}; font-size: 20px; font-weight: ${W.semibold}; color: ${C.muted}; }
  .title { font-size: 92px; font-weight: ${W.semibold}; letter-spacing: ${T.tighter}; line-height: 1; margin-top: 26px; }
  .subtitle { font-size: 40px; font-weight: ${W.medium}; color: ${C.muted}; margin-top: 22px; }
  .footer { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid ${C.divider}; padding-top: 26px; }
  .footer span { font-size: 24px; color: ${C.muted}; }
  .footer .url { color: ${C.text}; font-weight: ${W.medium}; }
</style></head><body>
  <div>
    <p class="eyebrow">Essay</p>
    <h1 class="title">${essay.title}</h1>
    <p class="subtitle">${essay.tagline}</p>
  </div>
  <div class="footer">
    <span>Jerome Faria</span>
    <span class="url">jeromefaria.com/writing/${essay.slug}</span>
  </div>
</body></html>`;

await withBrowser(async browser => {
  for (const essay of essays) {
    await renderCard(browser, { html: cardHtml(essay), path: join(root, `public/og-writing-${essay.slug}.png`) });
  }
});

console.log(`Writing social cards → public/og-writing-*.png (${essays.length})`);
