import { loadSrc, root } from './data-loader.mjs';
import { interFontFaces } from './pdf-fonts.mjs';
import { CARD_HEIGHT, CARD_WIDTH } from './playwright-render.mjs';

const { cardColor: C, tracking: T, weight: W } = await loadSrc('design/tokens.ts');
const fontFaces = await interFontFaces(root);

export const textCardHtml = ({ eyebrow, title, subtitle, description, footerLeft, footerUrl }) => `<!doctype html><html><head><meta charset="utf-8"><style>
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
  .description { max-width: 88%; margin-top: 40px; font-size: 32px; font-weight: ${W.normal}; line-height: 1.45; color: ${C.muted}; text-wrap: pretty; }
  .footer { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid ${C.divider}; padding-top: 26px; }
  .footer span { font-size: 24px; color: ${C.muted}; }
  .footer .url { color: ${C.text}; font-weight: ${W.medium}; }
</style></head><body>
  <div>
    <p class="eyebrow">${eyebrow}</p>
    <h1 class="title">${title}</h1>
    <p class="subtitle">${subtitle}</p>
    ${description ? `<p class="description">${description}</p>` : ''}
  </div>
  <div class="footer">
    <span>${footerLeft}</span>
    <span class="url">${footerUrl}</span>
  </div>
</body></html>`;
