import { join } from 'node:path';

import { root } from './data-loader.mjs';
import { textCardHtml } from './og-card.mjs';
import { renderCard, withBrowser } from './playwright-render.mjs';

const html = textCardHtml({
  eyebrow: 'Curriculum Vitae',
  title: 'Jerome Faria',
  subtitle: 'Senior Frontend Engineer',
  footerLeft: 'Vue &middot; TypeScript &middot; 15+ years',
  footerUrl: 'jeromefaria.com/cv',
});

await withBrowser(browser => renderCard(browser, { html, path: join(root, 'public/og-cv.png') }));

console.log('CV social card → public/og-cv.png');
