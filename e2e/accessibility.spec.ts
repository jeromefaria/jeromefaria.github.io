import { expect, test } from '@playwright/test';

import { checkA11y, gotoHydrated, MIN_TOUCH_TARGET_SIZE } from './helpers';

const MAIN_CONTENT_SELECTOR = '#main-content';
const SKIP_LINK_SELECTOR = 'a[href="#main-content"]';
const PAGES = ['/', '/works', '/live', '/press', '/about', '/contact', '/privacy'] as const;
const LANDMARK_SELECTORS = ['header', 'main', 'footer'] as const;

test.describe('Accessibility', () => {
  test.describe('WCAG Compliance', () => {
    for (const path of PAGES) {
      test(`${path} should not have violations`, async ({ page }) => {
        await gotoHydrated(page, path);
        await checkA11y(page);
      });
    }
  });

  test.describe('Keyboard Navigation', () => {
    test('advances focus through interactive elements on Tab', async ({ page }) => {
      await gotoHydrated(page, '/');

      const focused: string[] = [];
      for (let press = 0; press < 4; press += 1) {
        await page.keyboard.press('Tab');
        focused.push(await page.evaluate(() => {
          const element = document.activeElement;
          return !element || element === document.body ? '' : element.outerHTML;
        }));
      }

      expect(focused.every(entry => entry !== '')).toBe(true);
      expect(new Set(focused).size).toBeGreaterThan(1);
    });

    test('should skip to main content with skip link', async ({ page }) => {
      await gotoHydrated(page, '/');

      const skipLink = page.locator(SKIP_LINK_SELECTOR);
      test.skip(await skipLink.count() === 0, 'No skip link found');

      await skipLink.focus();
      await expect(skipLink).toBeFocused();
      await skipLink.click();

      await expect(page.locator(MAIN_CONTENT_SELECTOR)).toBeVisible();

      const top = await page.locator(MAIN_CONTENT_SELECTOR).evaluate(el => el.getBoundingClientRect().top);
      expect(top).toBeLessThan(110);
    });

    test('moves focus from the inquiry select to the next field on Tab', async ({ page }) => {
      await gotoHydrated(page, '/contact');

      await page.locator('#inquiry').focus();
      await expect(page.locator('#inquiry')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.locator('#name')).toBeFocused();
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await gotoHydrated(page, '/');

      const firstLink = page.locator('a').first();
      await firstLink.focus();

      const outline = await firstLink.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.outline || styles.outlineWidth;
      });
      expect(outline).not.toBe('none');
    });

    test('moves focus to a new element on Tab', async ({ page }) => {
      await gotoHydrated(page, '/works');

      const first = page.locator('a, button').first();
      await first.focus();
      const before = await page.evaluate(() => document.activeElement?.outerHTML ?? '');

      await page.keyboard.press('Tab');
      const after = await page.evaluate(() => document.activeElement?.outerHTML ?? '');

      expect(after).not.toBe(before);
    });
  });

  test.describe('Semantic HTML', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.locator('h1, h2, h3, h4, h5, h6').count()).toBeGreaterThan(0);
    });

    test('should have landmark regions', async ({ page }) => {
      await page.goto('/');

      for (const selector of LANDMARK_SELECTORS) {
        await expect(page.locator(selector)).toBeVisible();
      }
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/contact');
      await expect(page.locator('form')).toBeAttached();

      const inputs = page.locator('input:not([type="submit"]):not([type="hidden"]):not([aria-hidden="true"]), textarea');
      const count = await inputs.count();
      expect(count).toBeGreaterThan(0);

      for (let index = 0; index < count; index += 1) {
        const hasAccessibleLabel = await inputs.nth(index).evaluate(node => {
          const id = node.getAttribute('id');
          const ariaLabel = node.getAttribute('aria-label');
          const ariaLabelledBy = node.getAttribute('aria-labelledby');

          if (ariaLabel || ariaLabelledBy) return true;
          if (!id) return false;

          return document.querySelector(`label[for="${id}"]`) !== null;
        });
        expect(hasAccessibleLabel).toBe(true);
      }
    });
  });

  test.describe('Images and Media', () => {
    test('should have alt text for all images', async ({ page }) => {
      await gotoHydrated(page, '/about');

      const images = page.locator('img');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);

      for (let index = 0; index < count; index += 1) {
        expect(await images.nth(index).getAttribute('alt')).not.toBeNull();
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('should meet WCAG AA contrast requirements', async ({ page }) => {
      await gotoHydrated(page, '/');
      await checkA11y(page, { tags: ['wcag2aa'] });
    });

    test('should be readable in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await gotoHydrated(page, '/');
      await checkA11y(page, { tags: ['wcag2aa'] });
    });
  });

  test.describe('ARIA Attributes', () => {
    test('should have valid ARIA attributes', async ({ page }) => {
      await gotoHydrated(page, '/');
      await checkA11y(page, { tags: ['wcag2a', 'wcag2aa'] });
    });

  });

  test.describe('Responsive Accessibility', () => {
    test('should be accessible across mobile, tablet, and desktop viewports', async ({ page }) => {
      for (const size of [{ width: 375, height: 667 }, { width: 768, height: 1024 }, { width: 1280, height: 800 }]) {
        await page.setViewportSize(size);
        await gotoHydrated(page, '/');
        await checkA11y(page);
      }
    });

    test('should have touch-friendly targets on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await gotoHydrated(page, '/');

      const box = await page.locator('.nav-toggle').boundingBox();
      expect(box).not.toBeNull();
      // eslint-disable-next-line local/no-comments -- engine-specific sub-pixel jitter
      // Firefox reports the 44px target as 43.999998 from a rem→px calc, so round before comparing.
      expect(Math.round(box?.width ?? 0)).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
      expect(Math.round(box?.height ?? 0)).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
    });
  });
});
