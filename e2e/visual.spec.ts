import { expect, test } from '@playwright/test';

import { waitForHydration } from './helpers';

// Baselines are platform-specific (generated on CI/Linux) — regenerate with
// `playwright test --grep @visual --update-snapshots` on CI, not locally.
const PAGES = [
  ['/', 'home'],
  ['/works', 'works'],
  ['/live', 'live'],
  ['/press', 'press'],
  ['/about', 'about'],
  ['/contact', 'contact'],
] as const;

test.describe('Visual regression', () => {
  for (const [path, name] of PAGES) {
    test(`${name} matches its snapshot`, { tag: '@visual' }, async ({ page }) => {
      await page.goto(path);
      await waitForHydration(page);

      await expect(page).toHaveScreenshot(`${name}.png`, {
        animations: 'disabled',
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});
