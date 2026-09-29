import { join } from 'node:path';

import { root } from './data-loader.mjs';
import { textCardHtml } from './og-card.mjs';
import { renderCard, withBrowser } from './playwright-render.mjs';

const html = textCardHtml({
  eyebrow: 'Newsletter',
  title: 'Keep in touch',
  subtitle: 'New releases now and then, the odd live date, some writing. Not often &mdash; but direct.',
  footerLeft: 'Jerome Faria',
  footerUrl: 'jeromefaria.com/newsletter',
});

await withBrowser(browser => renderCard(browser, { html, path: join(root, 'public/og-newsletter.png') }));

console.log('Newsletter social card → public/og-newsletter.png');
