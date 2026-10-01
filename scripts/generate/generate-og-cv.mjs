import { join } from 'node:path';

import { root } from '../lib/data-loader.mjs';
import { textCardHtml } from '../lib/og-card.mjs';
import { renderCard, withBrowser } from '../lib/playwright-render.mjs';

const html = textCardHtml({
  eyebrow: 'Curriculum Vitae',
  title: 'Jerome Faria',
  subtitle: 'Senior Frontend Engineer',
  footerLeft: 'Vue &middot; TypeScript &middot; 15+ years',
  footerUrl: 'jeromefaria.com/cv',
});

await withBrowser(browser => renderCard(browser, { html, path: join(root, 'public/og-cv.png') }));

console.log('CV social card → public/og-cv.png');
