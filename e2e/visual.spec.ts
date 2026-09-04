import { expect, type Page, test } from '@playwright/test';

import { gotoHydrated } from './helpers';

// Baselines are platform-specific (generated on CI/Linux) — regenerate with
// `playwright test --grep @visual --update-snapshots` on CI, not locally.
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

// Absolute budget, not a ratio: a ratio scaled with page density, so a full
// redesign of a mostly-dark page slipped under 2%. 500px absorbs cross-run
// anti-aliasing jitter while still catching any real layout or style shift.
const SNAPSHOT_OPTIONS = { animations: 'disabled', maxDiffPixels: 500 } as const;

// The page snapshots also carry @mobile, so the mobile-safari project (grep:/@mobile/)
// captures them at an iPhone viewport — guarding the Safari-facing mobile layout.
// Overlays (lightbox, palette, keyboard-help) stay desktop-only: they're keyboard/hover
// affordances, so a mobile screenshot would bless a broken or irrelevant render.
test.describe('Visual regression', () => {
  for (const [path, name] of PAGES) {
    test(`${name} matches its snapshot`, { tag: ['@visual', '@mobile'] }, async ({ page }) => {
      await gotoHydrated(page, path);

      await expect(page).toHaveScreenshot(`${name}.png`, SNAPSHOT_OPTIONS);
    });
  }
});

// The site defaults to dark; the light theme is only reachable via the palette,
// so it needs its own baselines to stay guarded against drift.
test.describe('Visual regression — light theme', () => {
  for (const [path, name] of PAGES) {
    test(`${name} matches its light snapshot`, { tag: ['@visual', '@mobile'] }, async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('theme', 'light'));
      await gotoHydrated(page, path);

      await expect(page).toHaveScreenshot(`${name}-light.png`, SNAPSHOT_OPTIONS);
    });
  }
});

// The open lightbox renders its controls directly on the scrim rather than in a
// theme-flipping panel — the one place a theme-dependent colour turned invisible.
// A deep link opens the same photo every run, so the overlay stays deterministic.
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
