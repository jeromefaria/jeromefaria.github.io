import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadSrc, root } from './data-loader.mjs';
import { interFontFaces } from './pdf-fonts.mjs';
import { CARD_HEIGHT, CARD_WIDTH, renderCard, withBrowser } from './playwright-render.mjs';

const LOCALES = ['en', 'pt'];
const EYEBROW = { en: 'Live', pt: 'Ao vivo' };

const { liveEvents } = await loadSrc('data/live.ts');
const { localize } = await loadSrc('i18n/localized.ts');
const { localizePlace } = await loadSrc('i18n/exonyms.ts');
const { formatEventDateRange } = await loadSrc('utils/formatters.ts');
const fontFaces = await interFontFaces(root);

const heroOf = event => {
  const images = event.images ?? [];
  if (images.length) return { hero: images.find(image => image.cover) ?? images[0], isPoster: false };

  const posters = event.posters ?? [];
  if (posters.length) return { hero: posters.find(poster => poster.cover) ?? posters[0], isPoster: true };

  return null;
};

const cardFraming = (hero, isPoster) => hero.cardThumb ?? (isPoster ? { position: 'center top' } : hero.thumb);

const heroDataUri = src => {
  const extension = src.split('.').pop().toLowerCase();
  const mime = extension === 'png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${readFileSync(join(root, 'public', src)).toString('base64')}`;
};

const heroStyle = thumb => {
  if (!thumb) return '';

  const declarations = [];
  if (thumb.position) declarations.push(`object-position:${thumb.position}`);

  const transforms = [];
  if (thumb.scale) transforms.push(`scale(${thumb.scale})`);
  if (thumb.rotate) transforms.push(`rotate(${thumb.rotate}deg)`);
  if (thumb.translateX) transforms.push(`translateX(${thumb.translateX})`);
  if (transforms.length) declarations.push(`transform:${transforms.join(' ')}`);

  return declarations.join(';');
};

const escapeHtml = value => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const eventMeta = (event, locale) => {
  const place = [event.venue.city, event.venue.country]
    .filter(Boolean)
    .map(part => localizePlace(part, locale))
    .join(', ');
  const location = [event.venue.name, place].filter(Boolean).join(', ');

  return `${location} · ${formatEventDateRange(event.date, event.endDate, locale)}`;
};

const cardHtml = (event, hero, isPoster, locale) => `<!doctype html><html><head><meta charset="utf-8"><style>
  ${fontFaces}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .card { position: relative; width: ${CARD_WIDTH}px; height: ${CARD_HEIGHT}px; overflow: hidden; background: #000; font-family: 'Inter', sans-serif; }
  .hero { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; ${heroStyle(cardFraming(hero, isPoster))} }
  .scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgb(0 0 0 / 90%) 0%, rgb(0 0 0 / 55%) 30%, rgb(0 0 0 / 0%) 58%); }
  .wordmark { position: absolute; top: 52px; left: 76px; font-size: 24px; font-weight: 600; letter-spacing: -0.01em; color: #fff; text-shadow: 0 1px 12px rgb(0 0 0 / 60%); }
  .content { position: absolute; left: 0; right: 0; bottom: 0; padding: 60px 76px; color: #fff; }
  .eyebrow { text-transform: uppercase; letter-spacing: 0.28em; font-size: 20px; font-weight: 600; color: #e5e5e5; }
  .title { font-size: 60px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.04; margin-top: 16px; max-width: 18ch; text-wrap: balance; }
  .meta { font-size: 29px; font-weight: 500; color: #d4d4d4; margin-top: 18px; }
</style></head><body>
  <div class="card">
    <img class="hero" src="${heroDataUri(hero.src)}" alt="">
    <div class="scrim"></div>
    <p class="wordmark">jeromefaria.com</p>
    <div class="content">
      <p class="eyebrow">${EYEBROW[locale]}</p>
      <h1 class="title">${escapeHtml(localize(event.title, locale))}</h1>
      <p class="meta">${escapeHtml(eventMeta(event, locale))}</p>
    </div>
  </div>
</body></html>`;

let count = 0;

await withBrowser(async browser => {
  for (const event of liveEvents) {
    const selection = heroOf(event);
    if (!selection) continue;

    const { hero, isPoster } = selection;
    for (const locale of LOCALES) {
      await renderCard(browser, {
        html: cardHtml(event, hero, isPoster, locale),
        path: join(root, `public/og-live-${event.id}-${locale}.jpg`),
        type: 'jpeg',
        quality: 82,
      });
      count += 1;
    }
  }
});

console.log(`Live event social cards → public/og-live-*.jpg (${count})`);
