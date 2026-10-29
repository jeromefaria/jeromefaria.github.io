import { join } from 'node:path';

import { loadSrc, root } from '../lib/data-loader.mjs';
import { textCardHtml } from '../lib/og-card.mjs';
import { renderCard, runAsMain } from '../lib/playwright-render.mjs';

const { essays } = await loadSrc('data/writing.ts');

export const render = async browser => {
  for (const essay of essays) {
    await renderCard(browser, {
      html: textCardHtml({
        eyebrow: 'Writing',
        title: essay.title,
        subtitle: essay.tagline,
        description: essay.description,
        footerLeft: 'Jerome Faria',
        footerUrl: `jeromefaria.com/writing/${essay.slug}`,
      }),
      path: join(root, `public/og-writing-${essay.slug}.png`),
    });
  }

  console.log(`Writing social cards → public/og-writing-*.png (${essays.length})`);
};

await runAsMain(import.meta, render);
