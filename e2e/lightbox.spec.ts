import { expect, type Page, test } from '@playwright/test';

import { waitForHydration } from './helpers';

const LIGHTBOX_SELECTOR = '.lightbox';
const LIGHTBOX_CLOSE_SELECTOR = '.lightbox__hint--close';
const LIGHTBOX_NEXT_SELECTOR = '.lightbox__hint--next';
const LIGHTBOX_IMAGE_SELECTOR = '.lightbox__image';
const LIGHTBOX_CREDIT_SELECTOR = '.lightbox__credit';
const ACCORDION_SECTION_SELECTOR = '.accordion-section';
const ACCORDION_TRIGGER_SELECTOR = '.accordion-trigger';
// Works entries share `.link-discrete` between the "Gallery" (images) and
// "Video" controls; scope to the gallery so the lightbox opens photos.
const GALLERY_BUTTON_SELECTOR = '.link-discrete:has-text("Gallery")';
// A gallery button is only actionable while its own accordion section is open —
// collapsed sections are `inert`. Scope every interaction to a visible one.
const VISIBLE_GALLERY_BUTTON = `${GALLERY_BUTTON_SELECTOR}:visible`;

/**
 * Open the accordion section that contains the first gallery button and wait for
 * that button to become actionable, so callers can click a real, visible,
 * non-inert control (no forced clicks, no fixed animation waits).
 */
const openFirstGallery = async (page: Page): Promise<void> => {
  await page.goto('/works');
  await waitForHydration(page);

  // The accordion keeps a single section open at a time, so find the section
  // owning the first gallery button and open it if it isn't already.
  const owningSection = page.locator(ACCORDION_SECTION_SELECTOR)
    .filter({ has: page.locator(GALLERY_BUTTON_SELECTOR) })
    .first();
  const trigger = owningSection.locator(ACCORDION_TRIGGER_SELECTOR);

  if (await trigger.getAttribute('aria-expanded') !== 'true') {
    await trigger.click();
  }

  await expect(page.locator(VISIBLE_GALLERY_BUTTON).first()).toBeVisible();
};

/** Open the lightbox from the first visible gallery button and wait for it. */
const openLightboxFromFirstGallery = async (page: Page): Promise<void> => {
  await openFirstGallery(page);
  await page.locator(VISIBLE_GALLERY_BUTTON).first().click();
  await expect(page.locator(LIGHTBOX_SELECTOR)).toBeVisible();
};

// Live events label their gallery control "Photo(s)"; substring-match both.
const LIVE_GALLERY_BUTTON = '.link-discrete:has-text("Photo")';

/** Open the lightbox from a Live event gallery and wait for it. */
const openLiveLightbox = async (page: Page): Promise<void> => {
  await page.goto('/live');
  await waitForHydration(page);

  const owningSection = page.locator(ACCORDION_SECTION_SELECTOR)
    .filter({ has: page.locator(LIVE_GALLERY_BUTTON) })
    .first();
  const trigger = owningSection.locator(ACCORDION_TRIGGER_SELECTOR);

  if (await trigger.getAttribute('aria-expanded') !== 'true') {
    await trigger.click();
  }

  await page.locator(`${LIVE_GALLERY_BUTTON}:visible`).first().click();
  await expect(page.locator(LIGHTBOX_SELECTOR)).toBeVisible();
};

test.describe('Lightbox', () => {
  test.describe('Opening', () => {
    test('opens lightbox when clicking a Gallery button', async ({ page }) => {
      await openLightboxFromFirstGallery(page);
      await expect(page.locator(LIGHTBOX_SELECTOR)).toBeVisible();
    });

    test('displays an image in the lightbox', async ({ page }) => {
      await openLightboxFromFirstGallery(page);
      await expect(page.locator(LIGHTBOX_IMAGE_SELECTOR)).toBeVisible();
    });

    test('sets body overflow to hidden when open', async ({ page }) => {
      await openLightboxFromFirstGallery(page);
      await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    });
  });

  test.describe('Closing', () => {
    test.beforeEach(async ({ page }) => {
      await openLightboxFromFirstGallery(page);
    });

    test('closes lightbox when clicking the close button', async ({ page }) => {
      await page.locator(LIGHTBOX_CLOSE_SELECTOR).click();
      await expect(page.locator(LIGHTBOX_SELECTOR)).toHaveCount(0);
    });

    test('closes lightbox when pressing Escape', async ({ page }) => {
      await page.keyboard.press('Escape');
      await expect(page.locator(LIGHTBOX_SELECTOR)).toHaveCount(0);
    });

    test('restores body overflow after closing', async ({ page }) => {
      await page.locator(LIGHTBOX_CLOSE_SELECTOR).click();
      await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
    });
  });

  test.describe('Navigation', () => {
    // Open a guaranteed multi-image gallery (the live showcase carries many
    // photos) so next/prev are always exercised rather than skipped on a lone
    // image.
    test.beforeEach(async ({ page }) => {
      await openLiveLightbox(page);
    });

    test('shows next image when clicking the next button', async ({ page }) => {
      const firstSrc = await page.locator(LIGHTBOX_IMAGE_SELECTOR).getAttribute('src');
      await page.locator(LIGHTBOX_NEXT_SELECTOR).click();
      await expect(page.locator(LIGHTBOX_IMAGE_SELECTOR)).not.toHaveAttribute('src', firstSrc ?? '');
    });

    test('navigates to next image with ArrowRight key', async ({ page }) => {
      const firstSrc = await page.locator(LIGHTBOX_IMAGE_SELECTOR).getAttribute('src');
      await page.keyboard.press('ArrowRight');
      await expect(page.locator(LIGHTBOX_IMAGE_SELECTOR)).not.toHaveAttribute('src', firstSrc ?? '');
    });

    test('navigates to previous image with ArrowLeft key', async ({ page }) => {
      await page.locator(LIGHTBOX_NEXT_SELECTOR).click();
      const secondSrc = await page.locator(LIGHTBOX_IMAGE_SELECTOR).getAttribute('src');
      await page.keyboard.press('ArrowLeft');
      await expect(page.locator(LIGHTBOX_IMAGE_SELECTOR)).not.toHaveAttribute('src', secondSrc ?? '');
    });
  });

  test.describe('Photographer credit', () => {
    test('shows photographer credit when present', async ({ page }) => {
      await openLightboxFromFirstGallery(page);
      const credit = page.locator(LIGHTBOX_CREDIT_SELECTOR);

      if (await credit.count() > 0) {
        await expect(credit).toBeVisible();
      }
    });
  });

  test.describe('Live page', () => {
    test('opens and closes the lightbox from a live event gallery', async ({ page }) => {
      await openLiveLightbox(page);
      await expect(page.locator(LIGHTBOX_IMAGE_SELECTOR)).toBeVisible();

      await page.locator(LIGHTBOX_CLOSE_SELECTOR).click();
      await expect(page.locator(LIGHTBOX_SELECTOR)).toHaveCount(0);
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await openLightboxFromFirstGallery(page);
    });

    test('close button is focusable', async ({ page }) => {
      const closeButton = page.locator(LIGHTBOX_CLOSE_SELECTOR);
      await closeButton.focus();
      await expect(closeButton).toBeFocused();
    });

    test('lightbox contains focusable elements', async ({ page }) => {
      expect(await page.locator(`${LIGHTBOX_SELECTOR} button`).count()).toBeGreaterThan(0);
    });
  });
});
