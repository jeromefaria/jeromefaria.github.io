import { expect, test } from '@playwright/test';

import { waitForHydration } from './helpers';

// The site is pre-rendered as flat files, so GitHub Pages hard-404s trailing-slash
// URLs; the 404.html fallback restores the slashed path and the router guard
// (normalizeTrailingSlash) redirects it to the canonical extension-less form rather
// than dropping it on the not-found page.
test.describe('Trailing-slash normalization', () => {
  for (const [slashed, canonical] of [['/works/', '/works'], ['/pt/', '/pt']] as const) {
    test(`${slashed} resolves to ${canonical}`, async ({ page }) => {
      await page.goto(slashed);
      await waitForHydration(page);

      // If the guard hadn't fired, /works/ would fall to the catch-all with the URL
      // unchanged; landing on the canonical /works (no slash) proves the redirect.
      await expect(page).toHaveURL(new RegExp(`:4173${canonical}$`));
    });
  }
});
