import { join } from 'node:path';
import { argv } from 'node:process';
import { pathToFileURL } from 'node:url';

import { root } from '../lib/data-loader.mjs';
import { textCardHtml } from '../lib/og-card.mjs';
import { renderCard, withBrowser } from '../lib/playwright-render.mjs';

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

if (pathToFileURL(argv[1]).href === import.meta.url) await withBrowser(render);
