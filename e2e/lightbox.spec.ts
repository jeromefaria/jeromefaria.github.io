import { expect, type Page, test } from '@playwright/test';

import { gotoHydrated, waitForHydration } from './helpers';

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

const openFirstGallery = async (page: Page): Promise<void> => {
  await gotoHydrated(page, '/works');

  const owningSection = page.locator(ACCORDION_SECTION_SELECTOR)
    .filter({ has: page.locator(GALLERY_BUTTON_SELECTOR) })
    .first();
  const trigger = owningSection.locator(ACCORDION_TRIGGER_SELECTOR);

  if (await trigger.getAttribute('aria-expanded') !== 'true') {
    await trigger.click();
    // Wait for the accordion to finish opening — on the slower Firefox runner
    // the section's content-visibility reveal lags the click, so a bare
    // visibility check races it. Confirm the state, then bring the button in.
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  }

  const button = owningSection.locator(GALLERY_BUTTON_SELECTOR).first();
  await button.scrollIntoViewIfNeeded();
  await expect(button).toBeVisible();
};

const openLightboxFromFirstGallery = async (page: Page): Promise<void> => {
  await openFirstGallery(page);
  await page.locator(VISIBLE_GALLERY_BUTTON).first().click();
  await expect(page.locator(LIGHTBOX_SELECTOR)).toBeVisible({ timeout: 10000 });
};

// Live events label their gallery control "Photo(s)"; substring-match both.
const LIVE_GALLERY_BUTTON = '.link-discrete:has-text("Photo")';

const openLiveLightbox = async (page: Page): Promise<void> => {
  await gotoHydrated(page, '/live');

  const owningSection = page.locator(ACCORDION_SECTION_SELECTOR)
    .filter({ has: page.locator(LIVE_GALLERY_BUTTON) })
    .first();
  const trigger = owningSection.locator(ACCORDION_TRIGGER_SELECTOR);

  if (await trigger.getAttribute('aria-expanded') !== 'true') {
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  }

  const button = owningSection.locator(LIVE_GALLERY_BUTTON).first();
  await button.scrollIntoViewIfNeeded();
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.locator(LIGHTBOX_SELECTOR)).toBeVisible({ timeout: 10000 });
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

  test.describe('Deep linking', () => {
    test('opening a photo writes a shareable URL that reopens it on a fresh visit', async ({ page }) => {
      await openLiveLightbox(page);

      // Opening reflects the photo in the URL.
      await expect(page).toHaveURL(/#.+\/photo\/1$/);
      const shareUrl = page.url();

      // Closing restores the plain event anchor (no media suffix).
      await page.locator(LIGHTBOX_CLOSE_SELECTOR).click();
      await expect(page.locator(LIGHTBOX_SELECTOR)).toHaveCount(0);
      await expect(page).not.toHaveURL(/\/photo\//);

      // A recipient opening the shared URL in a fresh tab lands on that photo.
      const fresh = await page.context().newPage();
      await fresh.goto(shareUrl);
      await waitForHydration(fresh);
      await expect(fresh.locator(LIGHTBOX_SELECTOR)).toBeVisible({ timeout: 10000 });
      await expect(fresh.locator(LIGHTBOX_IMAGE_SELECTOR)).toBeVisible();
      await fresh.close();
    });

    test('the browser Back button closes the lightbox instead of leaving the page', async ({ page }) => {
      await openLiveLightbox(page);
      await expect(page).toHaveURL(/#.+\/photo\/1$/);

      await page.goBack();
      await expect(page.locator(LIGHTBOX_SELECTOR)).toHaveCount(0);
      await expect(page).not.toHaveURL(/\/photo\//);
      await expect(page.locator(LIVE_GALLERY_BUTTON).first()).toBeVisible();

      // Forward navigates back into the open item.
      await page.goForward();
      await expect(page.locator(LIGHTBOX_SELECTOR)).toBeVisible({ timeout: 10000 });
      await expect(page).toHaveURL(/#.+\/photo\/1$/);
    });
  });
});
