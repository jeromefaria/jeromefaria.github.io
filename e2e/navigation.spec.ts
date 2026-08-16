import { expect, test } from '@playwright/test';

import { isMobile, openMobileMenuIfNeeded, waitForHydration } from './helpers';

const NAV_TOGGLE_SELECTOR = '.nav-toggle';
const NAV_OPEN_SELECTOR = '.nav--open';
const NAV_LINK_SELECTOR = '.nav__link';
const NAV_SELECTOR = '.nav';
const MASTHEAD_TITLE_SELECTOR = '.masthead-title';
const HERO_SELECTOR = '.hero';
const ACCORDION_SECTION_SELECTOR = '.accordion-section';
const NOT_FOUND_SELECTOR = '.not-found';

const PAGES = {
  HOME: '/',
  WORKS: '/works',
  LIVE: '/live',
  PRESS: '/press',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

test.describe('Navigation', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto(PAGES.HOME);
    await expect(page).toHaveTitle(/Jerome Faria/);
    await expect(page.locator(MASTHEAD_TITLE_SELECTOR)).toBeVisible();
    await expect(page.locator(HERO_SELECTOR)).toBeVisible();
  });

  test('should navigate to Works page', async ({ page }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page);
    await page.locator(`nav a[href="${PAGES.WORKS}"]`).first().click();
    await expect(page).toHaveURL(/\/works/);
    await expect(page).toHaveTitle(/Works/);
    await expect(page.locator('[data-page="works"]')).toBeAttached({ timeout: 5000 });
    await expect(page.locator(ACCORDION_SECTION_SELECTOR).first()).toBeVisible();
  });

  test('should navigate to Live page', async ({ page }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page);
    await page.locator(`nav a[href="${PAGES.LIVE}"]`).first().click();
    await expect(page).toHaveURL(/\/live/);
    await expect(page).toHaveTitle(/Live/);
    await expect(page.locator('[data-page="live"]')).toBeAttached({ timeout: 5000 });
    await expect(page.locator(ACCORDION_SECTION_SELECTOR).first()).toBeVisible();
  });

  test('should navigate to Press page', async ({ page }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page);
    await page.locator(`nav a[href="${PAGES.PRESS}"]`).first().click();
    await expect(page).toHaveURL(/\/press/);
    await expect(page).toHaveTitle(/Press/);
    await expect(page.locator('[data-page="press"]')).toBeVisible();
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page);
    await page.locator(`nav a[href="${PAGES.ABOUT}"]`).first().click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page).toHaveTitle(/About/);
    await expect(page.locator('[data-page="about"]')).toBeVisible();
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page);
    await page.locator(`nav a[href="${PAGES.CONTACT}"]`).first().click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page).toHaveTitle(/Contact/);
    await expect(page.locator('form')).toBeVisible();
  });

  test('should have working header navigation', async ({ page }) => {
    await page.goto(PAGES.WORKS);
    const homeLink = page.locator(`header a[href="${PAGES.HOME}"]`);
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator(HERO_SELECTOR)).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto(PAGES.HOME);
    await expect(page.locator('footer nav')).toBeVisible();
    await expect(page.locator('footer nav a').first()).toBeVisible();
  });

  test('should show 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page).toHaveTitle(/Not Found/);
    await expect(page.locator(NOT_FOUND_SELECTOR)).toBeVisible();
    await expect(page.locator(`${NOT_FOUND_SELECTOR} h1`)).toContainText('Page Not Found');
  });

  test('should maintain navigation state across pages', async ({ page }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page);
    await page.locator(`nav a[href="${PAGES.WORKS}"]`).first().click();
    await expect(page).toHaveURL(/\/works/);

    await openMobileMenuIfNeeded(page);
    await page.locator(`nav a[href="${PAGES.LIVE}"]`).first().click();
    await expect(page).toHaveURL(/\/live/);

    await page.goBack();
    await expect(page).toHaveURL(/\/works/);

    await page.goForward();
    await expect(page).toHaveURL(/\/live/);
  });

  test('should support direct URL access', async ({ page }) => {
    await page.goto(PAGES.ABOUT);
    await expect(page).toHaveURL(/\/about/);
    await expect(page).toHaveTitle(/About/);
    await expect(page.locator('[data-page="about"]')).toBeVisible();
  });

  test('should have appropriate navigation UI for viewport', async ({ page }) => {
    await page.goto(PAGES.HOME);

    if (isMobile(page)) {
      await page.locator(NAV_TOGGLE_SELECTOR).click();
      await expect(page.locator(NAV_OPEN_SELECTOR)).toBeVisible();
      return;
    }

    await expect(page.locator(NAV_SELECTOR)).toBeVisible();
    await expect(page.locator(NAV_LINK_SELECTOR).first()).toBeVisible();
  });

  test('keeps the mobile menu open when opened on a scrolled page', async ({ page }) => {
    // Force a mobile viewport (the desktop projects never exercise the hamburger).
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGES.ABOUT);
    await waitForHydration(page);

    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    await page.locator(NAV_TOGGLE_SELECTOR).click();

    // Regression: focusing the sticky nav used to scroll to the top, which fired
    // the dismiss-on-scroll handler and closed the menu the instant it opened.
    await expect(page.locator(NAV_OPEN_SELECTOR)).toBeVisible();
  });
});
