import { expect, test } from '@playwright/test';

import { waitForHydration } from './helpers';

test.describe('Trailing-slash normalization', () => {
  for (const [slashed, canonical] of [['/works/', '/works'], ['/pt/', '/pt']] as const) {
    test(`${slashed} resolves to ${canonical}`, async ({ page }) => {
      await page.goto(slashed);
      await waitForHydration(page);

      await expect(page).toHaveURL(new RegExp(`:4173${canonical}$`));
    });
  }
});
