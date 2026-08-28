import { expect, test } from '@playwright/test';

import { checkA11y, gotoHydrated } from './helpers';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const PALETTE = '.command-palette';
const INPUT = '.command-palette__input';
const OPTION = '[role="option"]';

test.describe('Command palette (⌘K)', () => {
  test('opens on Ctrl/Cmd+K, filters, and navigates', async ({ page }) => {
    await gotoHydrated(page, '/');

    await page.keyboard.press('Control+k');
    await expect(page.locator(INPUT)).toBeFocused();

    await page.locator(INPUT).fill('privacy');
    await expect(page.locator(OPTION).first()).toContainText('Privacy');

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/privacy/);
    await expect(page.locator(PALETTE)).toHaveCount(0);
  });

  test('navigates the results with the keyboard', async ({ page }) => {
    await gotoHydrated(page, '/');

    await page.keyboard.press('Control+k');
    await expect(page.locator(INPUT)).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(page.locator(INPUT)).toHaveAttribute('aria-activedescendant', 'command-palette-option-1');
  });

  test('closes on Escape', async ({ page }) => {
    await gotoHydrated(page, '/');

    await page.keyboard.press('Control+k');
    await expect(page.locator(PALETTE)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator(PALETTE)).toHaveCount(0);
  });

  test('has no accessibility violations while open', async ({ page }) => {
    await gotoHydrated(page, '/');

    await page.keyboard.press('Control+k');
    await expect(page.locator(INPUT)).toBeFocused();

    await checkA11y(page, { tags: WCAG_TAGS });
  });

  test('toggles the theme from dark to light', async ({ page }) => {
    await gotoHydrated(page, '/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.keyboard.press('Control+k');
    await page.locator(INPUT).fill('toggle theme');
    await expect(page.locator(OPTION).first()).toContainText('Toggle theme');

    await page.keyboard.press('Enter');
    await expect(html).not.toHaveAttribute('data-theme', 'dark');
  });

  test('plays a release from search, then exposes transport controls', async ({ page }) => {
    await gotoHydrated(page, '/');

    await page.keyboard.press('Control+k');
    await page.locator(INPUT).fill('play 2504');
    await expect(page.locator(OPTION).first()).toContainText("Play '2504'");

    await page.keyboard.press('Enter');
    await expect(page.locator(PALETTE)).toHaveCount(0);
    await expect(page.locator('.player-bar')).toBeVisible();

    await page.keyboard.press('Control+k');
    await expect(page.locator('.command-palette__group').first()).toContainText('Now Playing');
    await expect(page.locator(OPTION).first()).toContainText(/^(Pause|Play)/);
  });

  test('matches its snapshot @visual', async ({ page }) => {
    await gotoHydrated(page, '/');

    await page.keyboard.press('Control+k');
    await expect(page.locator(INPUT)).toBeFocused();

    await expect(page).toHaveScreenshot('command-palette.png');
  });
});

test.describe('Keyboard help (?)', () => {
  const HELP = '.keyboard-help';

  test('opens on "?" and closes on Escape', async ({ page }) => {
    await gotoHydrated(page, '/');

    await page.keyboard.press('Shift+Slash');
    await expect(page.locator(HELP)).toBeVisible();
    await expect(page.locator(HELP)).toContainText('Open the command palette');

    await page.keyboard.press('Escape');
    await expect(page.locator(HELP)).toHaveCount(0);
  });

  test('has no accessibility violations while open', async ({ page }) => {
    await gotoHydrated(page, '/');

    await page.keyboard.press('Shift+Slash');
    await expect(page.locator(`${HELP}__panel`)).toBeVisible();

    await checkA11y(page, { tags: WCAG_TAGS });
  });

  test('matches its snapshot @visual', async ({ page }) => {
    await gotoHydrated(page, '/');

    await page.keyboard.press('Shift+Slash');
    await expect(page.locator(`${HELP}__panel`)).toBeVisible();

    await expect(page).toHaveScreenshot('keyboard-help.png');
  });
});
