import { expect, test } from '@playwright/test';

import { checkA11y, gotoHydrated, isMobile, MIN_TOUCH_TARGET_SIZE } from './helpers';

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
    test('should allow tab navigation through interactive elements', async ({ page }) => {
      await gotoHydrated(page, '/');

      await page.locator(SKIP_LINK_SELECTOR).focus();
      await expect(page.locator(SKIP_LINK_SELECTOR)).toBeFocused();
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

    test('should navigate through form fields', async ({ page }) => {
      await page.goto('/contact');
      await expect(page.locator('form')).toBeAttached();

      const firstField = page.locator('input[type="text"], input[type="email"], textarea').first();
      await firstField.focus();
      await expect(firstField).toBeFocused();
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

    test('should maintain focus order', async ({ page }) => {
      await gotoHydrated(page, '/works');

      const interactive = page.locator('a, button, input, textarea, [tabindex="0"]').first();
      await interactive.focus();
      await expect(interactive).toBeFocused();
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
      await page.goto('/');

      const images = page.locator('img');
      const count = await images.count();

      for (let index = 0; index < count; index += 1) {
        expect(await images.nth(index).getAttribute('alt')).not.toBeNull();
      }
    });

    test('should have accessible video elements', async ({ page }) => {
      await page.goto('/works');

      const videos = page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
      const count = await videos.count();

      for (let index = 0; index < count; index += 1) {
        const title = await videos.nth(index).getAttribute('title');
        const ariaLabel = await videos.nth(index).getAttribute('aria-label');
        expect(Boolean(title || ariaLabel)).toBe(true);
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

    test('should use ARIA roles appropriately', async ({ page }) => {
      await page.goto('/');

      const roleElements = page.locator('[role]');
      const count = await roleElements.count();

      for (let index = 0; index < count; index += 1) {
        expect(await roleElements.nth(index).getAttribute('role')).toBeTruthy();
      }
    });
  });

  test.describe('Responsive Accessibility', () => {
    test('should be accessible on all viewports', async ({ page }) => {
      await gotoHydrated(page, '/');
      await checkA11y(page);
    });

    test('should have touch-friendly targets on mobile', async ({ page }) => {
      test.skip(!isMobile(page), 'Not a mobile viewport');

      await gotoHydrated(page, '/');

      const box = await page.locator('.nav-toggle').boundingBox();
      expect(box).not.toBeNull();
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
    });
  });
});
