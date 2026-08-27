import { expect, test } from '@playwright/test';

import { gotoHydrated } from './helpers';

const MAX_GAP = 3;

const heroFooterGap = (page: import('@playwright/test').Page): Promise<number> =>
  page.evaluate(() => {
    const hero = document.querySelector('.home .hero');
    const footer = document.querySelector('footer');
    if (!hero || !footer) return Number.NaN;
    return Math.round(footer.getBoundingClientRect().top - hero.getBoundingClientRect().bottom);
  });

test.describe('Home hero fills the viewport to the footer', () => {
  for (const { width, height, label } of [
    { width: 390, height: 844, label: 'mobile' },
    { width: 1280, height: 800, label: 'desktop' },
  ]) {
    test(`hero meets the footer with no gap on ${label}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await gotoHydrated(page, '/');

      const gap = await heroFooterGap(page);
      expect(
        Math.abs(gap),
        `hero is sized calc(100vh − header − footer); gap ${gap}px means a measured height constant drifted`,
      ).toBeLessThanOrEqual(MAX_GAP);
    });
  }
});
