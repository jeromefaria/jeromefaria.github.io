import { expect, test } from '@playwright/test';

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
] as const;

// Absolute budget, not a ratio: a ratio scaled with page density, so a full
// redesign of a mostly-dark page slipped under 2%. 500px absorbs cross-run
// anti-aliasing jitter while still catching any real layout or style shift.
const SNAPSHOT_OPTIONS = { animations: 'disabled', maxDiffPixels: 500 } as const;

test.describe('Visual regression', () => {
  for (const [path, name] of PAGES) {
    test(`${name} matches its snapshot`, { tag: '@visual' }, async ({ page }) => {
      await gotoHydrated(page, path);

      await expect(page).toHaveScreenshot(`${name}.png`, SNAPSHOT_OPTIONS);
    });
  }
});

// The site defaults to dark; the light theme is only reachable via the palette,
// so it needs its own baselines to stay guarded against drift.
test.describe('Visual regression — light theme', () => {
  for (const [path, name] of PAGES) {
    test(`${name} matches its light snapshot`, { tag: '@visual' }, async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('theme', 'light'));
      await gotoHydrated(page, path);

      await expect(page).toHaveScreenshot(`${name}-light.png`, SNAPSHOT_OPTIONS);
    });
  }
});
