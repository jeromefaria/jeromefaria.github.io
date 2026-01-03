import { expect, test, type Page } from '@playwright/test';

// Constants
const NAV_TOGGLE_SELECTOR = '.nav-toggle';
const NAV_OPEN_SELECTOR = '.nav--open';
const NAV_LINK_SELECTOR = '.nav__link';
const NAV_SELECTOR = '.nav';
const MASTHEAD_TITLE_SELECTOR = '.masthead-title';
const HERO_SELECTOR = '.hero';
const ACCORDION_SECTION_SELECTOR = '.accordion-section';
const NOT_FOUND_SELECTOR = '.not-found';
const MOBILE_MENU_TIMEOUT = 5000;

const PAGES = {
  HOME: '/',
  WORKS: '/works',
  LIVE: '/live',
  PRESS: '/press',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

/**
 * Open mobile navigation menu if on mobile viewport and menu is not already open
 */
async function openMobileMenuIfNeeded(page: Page, isMobile: boolean): Promise<void> {
  if (!isMobile) return;

  const navToggle = page.locator(NAV_TOGGLE_SELECTOR);
  const isMenuOpen = await page.locator(NAV_OPEN_SELECTOR).isVisible().catch(() => false);

  if (isMenuOpen) return;

  await navToggle.click();
  await page.waitForSelector(NAV_OPEN_SELECTOR, { timeout: MOBILE_MENU_TIMEOUT });
}

test.describe('Navigation', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto(PAGES.HOME);
    await expect(page).toHaveTitle(/Jerome Faria/);
    await expect(page.locator(MASTHEAD_TITLE_SELECTOR)).toBeVisible();
    await expect(page.locator(HERO_SELECTOR)).toBeVisible();
  });

  test('should navigate to Works page', async ({ page, isMobile }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page, isMobile);
    await page.click(`nav a[href="${PAGES.WORKS}"]`);
    await expect(page).toHaveURL(/\/works/);
    await expect(page).toHaveTitle(/Works/);
    await page.waitForSelector('[data-page="works"]', { timeout: MOBILE_MENU_TIMEOUT });
    const count = await page.locator(ACCORDION_SECTION_SELECTOR).count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to Live page', async ({ page, isMobile }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page, isMobile);
    await page.click(`nav a[href="${PAGES.LIVE}"]`);
    await expect(page).toHaveURL(/\/live/);
    await expect(page).toHaveTitle(/Live/);
    await page.waitForSelector('[data-page="live"]', { timeout: MOBILE_MENU_TIMEOUT });
    const count = await page.locator(ACCORDION_SECTION_SELECTOR).count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to Press page', async ({ page, isMobile }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page, isMobile);
    await page.click(`nav a[href="${PAGES.PRESS}"]`);
    await expect(page).toHaveURL(/\/press/);
    await expect(page).toHaveTitle(/Press/);
    await expect(page.locator('[data-page="press"]')).toBeVisible();
  });

  test('should navigate to About page', async ({ page, isMobile }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page, isMobile);
    await page.click(`nav a[href="${PAGES.ABOUT}"]`);
    await expect(page).toHaveURL(/\/about/);
    await expect(page).toHaveTitle(/About/);
    await expect(page.locator('[data-page="about"]')).toBeVisible();
  });

  test('should navigate to Contact page', async ({ page, isMobile }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page, isMobile);
    await page.click(`nav a[href="${PAGES.CONTACT}"]`);
    await expect(page).toHaveURL(/\/contact/);
    await expect(page).toHaveTitle(/Contact/);
    await expect(page.locator('form')).toBeVisible();
  });

  test('should have working header navigation', async ({ page }) => {
    await page.goto(PAGES.WORKS);
    const homeLink = page.locator(`header a[href="${PAGES.HOME}"]`);
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL(PAGES.HOME);
    await expect(page.locator(HERO_SELECTOR)).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto(PAGES.HOME);
    const footerNav = page.locator('footer nav');
    await expect(footerNav).toBeVisible();

    const footerLinks = footerNav.locator('a');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page).toHaveTitle(/Not Found/);
    const notFoundSection = page.locator(NOT_FOUND_SELECTOR);
    await expect(notFoundSection).toBeVisible();
    await expect(notFoundSection.locator('h1')).toContainText('Page Not Found');
  });

  test('should maintain navigation state across pages', async ({ page, isMobile }) => {
    await page.goto(PAGES.HOME);
    await openMobileMenuIfNeeded(page, isMobile);
    await page.click(`nav a[href="${PAGES.WORKS}"]`);
    await expect(page).toHaveURL(/\/works/);

    await openMobileMenuIfNeeded(page, isMobile);
    await page.click(`nav a[href="${PAGES.LIVE}"]`);
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

  test('should have appropriate navigation UI for viewport', async ({ page, isMobile }) => {
    await page.goto(PAGES.HOME);

    if (isMobile) {
      // Mobile: should have toggle button and collapsible menu
      const navToggle = page.locator(NAV_TOGGLE_SELECTOR);
      await expect(navToggle).toBeVisible();

      await navToggle.click();
      const nav = page.locator(NAV_OPEN_SELECTOR);
      await expect(nav).toBeVisible();
      return;
    }

    // Desktop: navigation should be visible without toggle
    const nav = page.locator(NAV_SELECTOR);
    await expect(nav).toBeVisible();

    const navLinks = page.locator(NAV_LINK_SELECTOR);
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
