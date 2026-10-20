import { expect, test } from '@playwright/test';

import { gotoHydrated } from './helpers';

test.describe('Language switch (EN <-> PT)', () => {
  test('switches to Portuguese, persists across navigation, and switches back', async ({ page }) => {
    await gotoHydrated(page, '/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Works', exact: true }).first()).toBeVisible();

    const toPortuguese = page.getByRole('link', { name: 'PT — Switch to Portuguese' });
    await expect(toPortuguese).toBeVisible();
    await toPortuguese.click();

    await expect(page).toHaveURL(/:4173\/pt$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
    await expect(page.getByRole('link', { name: 'Obras', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'EN — Mudar para inglês' })).toBeVisible();

    await page.getByRole('link', { name: 'Obras', exact: true }).first().click();
    await expect(page).toHaveURL(/:4173\/pt\/works$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');

    await page.getByRole('link', { name: 'EN — Mudar para inglês' }).click();
    await expect(page).toHaveURL(/:4173\/works$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Works', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'PT — Switch to Portuguese' })).toBeVisible();
  });
});
