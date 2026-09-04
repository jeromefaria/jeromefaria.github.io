import { expect, type Page, test } from '@playwright/test';

import { gotoHydrated } from './helpers';

// eslint-disable-next-line local/no-comments -- baselines are Linux/CI-generated
// Regenerate snapshots on CI (`playwright test --grep @visual --update-snapshots`), never locally, or they fail on the platform mismatch.
const PAGES = [
  ['/', 'home'],
  ['/works', 'works'],
  ['/live', 'live'],
  ['/press', 'press'],
  ['/about', 'about'],
  ['/contact', 'contact'],
  ['/epk', 'epk'],
  ['/privacy', 'privacy'],
  ['/colophon', 'colophon'],
] as const;

const SNAPSHOT_OPTIONS = { animations: 'disabled', maxDiffPixels: 500 } as const;

test.describe('Visual regression', () => {
  for (const [path, name] of PAGES) {
    test(`${name} matches its snapshot`, { tag: ['@visual', '@mobile'] }, async ({ page }) => {
      await gotoHydrated(page, path);

      await expect(page).toHaveScreenshot(`${name}.png`, SNAPSHOT_OPTIONS);
    });
  }
});

test.describe('Visual regression — light theme', () => {
  for (const [path, name] of PAGES) {
    test(`${name} matches its light snapshot`, { tag: ['@visual', '@mobile'] }, async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('theme', 'light'));
      await gotoHydrated(page, path);

      await expect(page).toHaveScreenshot(`${name}-light.png`, SNAPSHOT_OPTIONS);
    });
  }
});

const LIGHTBOX_DEEP_LINK = '/live#showcase-casa-amarela/photo/1';

const openLightbox = async (page: Page): Promise<void> => {
  await gotoHydrated(page, LIGHTBOX_DEEP_LINK);

  const image = page.locator('.lightbox__image');
  await expect(image).toBeVisible({ timeout: 10000 });
  await image.evaluate((element: HTMLImageElement) =>
    element.complete ? undefined : new Promise(resolve => { element.onload = resolve; }));
};

test.describe('Visual regression — overlays', () => {
  test('open lightbox matches its snapshot', { tag: '@visual' }, async ({ page }) => {
    await openLightbox(page);

    await expect(page).toHaveScreenshot('lightbox.png', SNAPSHOT_OPTIONS);
  });

  test('open lightbox matches its light snapshot', { tag: '@visual' }, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'light'));
    await openLightbox(page);

    await expect(page).toHaveScreenshot('lightbox-light.png', SNAPSHOT_OPTIONS);
  });
});
