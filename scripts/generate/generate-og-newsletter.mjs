import { join } from 'node:path';

import { root } from '../lib/data-loader.mjs';
import { textCardHtml } from '../lib/og-card.mjs';
import { renderCard, runAsMain } from '../lib/playwright-render.mjs';

const html = textCardHtml({
  eyebrow: 'Newsletter',
  title: 'Keep in touch',
  subtitle: 'New releases now and then, the odd live date, some writing. Not often &mdash; but direct.',
  footerLeft: 'Jerome Faria',
  footerUrl: 'jeromefaria.com/newsletter',
});

export const render = async browser => {
  await renderCard(browser, { html, path: join(root, 'public/og-newsletter.png') });
  console.log('Newsletter social card → public/og-newsletter.png');
};

await runAsMain(import.meta, render);
