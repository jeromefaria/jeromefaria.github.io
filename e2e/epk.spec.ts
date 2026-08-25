import { expect, test } from '@playwright/test';

import { checkA11y, waitForHydration } from './helpers';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('Press kit (EPK)', () => {
  test('is reachable by direct URL and renders its sections', async ({ page }) => {
    await page.goto('/epk');

    await expect(page).toHaveTitle(/Press Kit/);
    await expect(page.locator('[data-page="epk"]')).toBeVisible();

    for (const heading of ['Short bio', 'Biography', 'Selected performances', 'Selected works', 'Press', 'Photography']) {
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

  test('has no detectable accessibility violations', async ({ page }) => {
    await page.goto('/epk');
    await waitForHydration(page);

    await checkA11y(page, { tags: WCAG_TAGS });
  });
});
