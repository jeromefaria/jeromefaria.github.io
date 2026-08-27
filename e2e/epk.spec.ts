import { expect, test } from '@playwright/test';

import { checkA11y, gotoHydrated } from './helpers';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('Press kit (EPK)', () => {
  test('is reachable by direct URL and renders its sections', async ({ page }) => {
    await page.goto('/epk');

    await expect(page).toHaveTitle(/Press Kit/);
    await expect(page.locator('[data-page="epk"]')).toBeVisible();

    for (const heading of ['Short bio', 'Download', 'Biography', 'Photography', 'Selected performances', 'Selected works', 'Press']) {
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    }
  });

  test('is excluded from indexing', async ({ page }) => {
    await page.goto('/epk');

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test('opens external links (credits, sources) in a new tab', async ({ page }) => {
    await page.goto('/epk');

    await expect(page.locator('[data-page="epk"] a[target="_blank"]').first()).toBeVisible();
  });

  test('serves every download the page links to', async ({ page }) => {
    await page.goto('/epk');

    const hrefs = await page
      .locator('[data-page="epk"] a[download]')
      .evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href') ?? ''));

    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      const response = await page.request.head(href);

      expect(response.status(), href).toBe(200);
      expect(response.headers()['content-type'] ?? '', href).toMatch(/zip|pdf|jpeg/);
    }
  });

  test('has no detectable accessibility violations', async ({ page }) => {
    await gotoHydrated(page, '/epk');

    await checkA11y(page, { tags: WCAG_TAGS });
  });
});
