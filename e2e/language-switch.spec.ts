import { expect, test } from '@playwright/test';

import { gotoHydrated } from './helpers';

// Locale is URL-driven (the /pt prefix). This guards the full round trip: switching
// to PT changes the prefix, the <html lang> attribute and the visible copy (including
// the switch control's own label); the locale persists across in-app navigation; and
// switching back lands on the EN equivalent page.
//
// The <html lang> assertions are the regression lock for the reactive-head fix — the
// attribute previously went stale on a client-side switch because usePageHead read the
// locale once at setup and EN/PT share view components.
test.describe('Language switch (EN <-> PT)', () => {
  test('switches to Portuguese, persists across navigation, and switches back', async ({ page }) => {
    await gotoHydrated(page, '/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Works', exact: true }).first()).toBeVisible();

    const toPortuguese = page.getByRole('link', { name: 'Switch to Portuguese (PT)' });
    await expect(toPortuguese).toBeVisible();
    await toPortuguese.click();

    await expect(page).toHaveURL(/:4173\/pt$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
    await expect(page.getByRole('link', { name: 'Obras', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Mudar para inglês (EN)' })).toBeVisible();

    // Locale persists across navigation: an in-app link keeps the /pt prefix.
    await page.getByRole('link', { name: 'Obras', exact: true }).first().click();
    await expect(page).toHaveURL(/:4173\/pt\/works$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');

    // Switching back from /pt/works lands on the EN equivalent, not the PT home.
    await page.getByRole('link', { name: 'Mudar para inglês (EN)' }).click();
    await expect(page).toHaveURL(/:4173\/works$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Works', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Switch to Portuguese (PT)' })).toBeVisible();
  });
});
