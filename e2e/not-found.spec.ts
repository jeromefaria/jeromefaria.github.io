import { expect, test } from '@playwright/test';

import { gotoHydrated } from './helpers';

test.describe('Not-found page', () => {
  test('renders in English for a missing EN route', async ({ page }) => {
    await gotoHydrated(page, '/does-not-exist');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  });

  test('renders in Portuguese for a missing PT route', async ({ page }) => {
    await gotoHydrated(page, '/pt/nao-existe');

    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
  });
});
