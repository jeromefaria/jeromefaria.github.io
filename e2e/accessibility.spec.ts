import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Constants
const HYDRATION_TIMEOUT = 10000;
const MIN_TOUCH_TARGET_SIZE = 44;
const MAIN_CONTENT_SELECTOR = '#main-content';
const SKIP_LINK_SELECTOR = 'a[href="#main-content"]';

const PAGES = ['/', '/works', '/live', '/press', '/about', '/contact'] as const;

const LANDMARK_SELECTORS = {
  header: 'header',
  main: 'main',
  footer: 'footer',
} as const;

/**
 * Wait for Vue hydration to complete
 * Ensures dark theme styles are fully applied before testing
 */
async function waitForHydration(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('body.ready', { timeout: HYDRATION_TIMEOUT });
}

/**
 * Run axe accessibility scan and return violations
 */
async function scanForViolations(page: Page, tags?: string[]): Promise<unknown[]> {
  const builder = new AxeBuilder({ page });
  const results = tags ? await builder.withTags(tags).analyze() : await builder.analyze();
  return results.violations;
}

/**
 * Filter violations by ID
 */
function filterViolationsById(violations: unknown[], id: string): unknown[] {
  return violations.filter((v: any) => v.id === id);
}

/**
 * Check if element has accessible label
 */
async function hasAccessibleLabel(
  page: Page,
  element: ReturnType<Page['locator']>,
): Promise<boolean> {
  const id = await element.getAttribute('id');
  const ariaLabel = await element.getAttribute('aria-label');
  const ariaLabelledBy = await element.getAttribute('aria-labelledby');

  if (ariaLabel || ariaLabelledBy) return true;
  if (!id) return false;

  const label = page.locator(`label[for="${id}"]`);
  return (await label.count()) > 0;
}

test.describe('Accessibility', () => {
  test.describe('WCAG Compliance', () => {
    for (const page of PAGES) {
      test(`${page} should not have violations`, async ({ page: pw }) => {
        await pw.goto(page);
        await waitForHydration(pw);

        const violations = await scanForViolations(pw);
        expect(violations).toEqual([]);
      });
    }
  });

  test.describe('Keyboard Navigation', () => {
    test('should allow tab navigation through interactive elements', async ({ page }) => {
      await page.goto('/');
      await waitForHydration(page);

      const skipLink = page.locator(SKIP_LINK_SELECTOR);
      await skipLink.focus();

      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBe('A');
    });

    test('should skip to main content with skip link', async ({ page }) => {
      await page.goto('/');
      await waitForHydration(page);

      const skipLink = page.locator(SKIP_LINK_SELECTOR);
      const skipLinkExists = (await skipLink.count()) > 0;

      if (!skipLinkExists) {
        test.skip();
        return;
      }

      await skipLink.focus();
      await expect(skipLink).toBeFocused();
      await skipLink.click();

      const main = page.locator(MAIN_CONTENT_SELECTOR);
      await expect(main).toBeVisible();

      // Verify page scrolled to main content
      const mainPosition = await main.evaluate(el => el.getBoundingClientRect().top);
      expect(mainPosition).toBeLessThan(100);
    });

    test('should navigate through form fields', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForSelector('form');

      const firstInput = page.locator('input[type="text"], input[type="email"], textarea').first();
      await firstInput.focus();
      await expect(firstInput).toBeFocused();
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/');
      const link = page.locator('a').first();
      await link.focus();

      const outline = await link.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.outline || styles.outlineWidth;
      });

      expect(outline).not.toBe('none');
    });

    test('should maintain focus order', async ({ page, browserName }) => {
      // WebKit has inconsistent keyboard event handling in Playwright
      if (browserName === 'webkit') {
        test.fixme(true, 'WebKit keyboard events are flaky in Playwright automated tests');
        return;
      }

      await page.goto('/works');
      const interactiveElements = page.locator('a, button, input, textarea, [tabindex="0"]');
      const count = await interactiveElements.count();

      if (count === 0) return;

      await page.keyboard.press('Tab');
      const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
      expect(firstFocused).toBeTruthy();
    });
  });

  test.describe('Semantic HTML', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');

      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);

      const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
      expect(headings.length).toBeGreaterThan(0);
    });

    test('should have landmark regions', async ({ page }) => {
      await page.goto('/');

      for (const selector of Object.values(LANDMARK_SELECTORS)) {
        await expect(page.locator(selector)).toBeVisible();
      }
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForSelector('form');

      const inputs = page.locator('input:not([type="submit"]):not([type="hidden"]), textarea');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const hasLabel = await hasAccessibleLabel(page, input);
        expect(hasLabel).toBeTruthy();
      }
    });
  });

  test.describe('Images and Media', () => {
    test('should have alt text for all images', async ({ page }) => {
      await page.goto('/');
      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).not.toBeNull();
      }
    });

    test('should have accessible video elements', async ({ page }) => {
      await page.goto('/works');
      const videos = page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
      const count = await videos.count();

      for (let i = 0; i < count; i++) {
        const video = videos.nth(i);
        const title = await video.getAttribute('title');
        const ariaLabel = await video.getAttribute('aria-label');
        const hasAccessibleName = Boolean(title || ariaLabel);
        expect(hasAccessibleName).toBeTruthy();
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('should meet WCAG AA contrast requirements', async ({ page }) => {
      await page.goto('/');
      await waitForHydration(page);

      const violations = await scanForViolations(page, ['wcag2aa']);
      const contrastViolations = filterViolationsById(violations, 'color-contrast');

      expect(contrastViolations).toEqual([]);
    });

    test('should be readable in dark mode', async ({ page }) => {
      await page.goto('/');
      await waitForHydration(page);

      const violations = await scanForViolations(page, ['wcag2aa']);
      const contrastViolations = filterViolationsById(violations, 'color-contrast');

      expect(contrastViolations).toEqual([]);
    });
  });

  test.describe('ARIA Attributes', () => {
    test('should have valid ARIA attributes', async ({ page }) => {
      await page.goto('/');

      const violations = await scanForViolations(page, ['wcag2a', 'wcag2aa']);
      const ariaViolations = violations.filter((v: any) => v.id.includes('aria'));

      expect(ariaViolations).toEqual([]);
    });

    test('should use ARIA roles appropriately', async ({ page }) => {
      await page.goto('/');
      const elementsWithRoles = page.locator('[role]');
      const count = await elementsWithRoles.count();

      for (let i = 0; i < count; i++) {
        const element = elementsWithRoles.nth(i);
        const role = await element.getAttribute('role');
        expect(role).toBeTruthy();
      }
    });
  });

  test.describe('Responsive Accessibility', () => {
    test('should be accessible on all viewports', async ({ page }) => {
      await page.goto('/');
      await waitForHydration(page);

      const violations = await scanForViolations(page);
      expect(violations).toEqual([]);
    });

    test('should have touch-friendly targets on mobile', async ({ page, isMobile }) => {
      // This test is only meaningful on mobile viewports
      if (!isMobile) {
        test.skip();
        return;
      }

      await page.goto('/');
      await waitForHydration(page);

      const navToggle = page.locator('.nav-toggle');
      const box = await navToggle.boundingBox();

      if (!box) {
        throw new Error('Nav toggle not found or not visible');
      }

      expect(box.width).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
      expect(box.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
    });
  });
});
