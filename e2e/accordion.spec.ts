import { expect, test } from '@playwright/test';

import { toggleAndVerifyAccordion, waitForHydration } from './helpers';

const ACCORDION_SECTION_SELECTOR = '.accordion-section';
const ACCORDION_TRIGGER_SELECTOR = '.accordion-trigger';
const SOLO_TRIGGER_ID = '#trigger-solo';
const SOLO_SECTION_ID = '#section-solo';
const WORKS_PAGE = '/works';
const LIVE_PAGE = '/live';

test.describe('Accordion Functionality', () => {
  test.describe('Works Page Accordion', () => {
    test('should have accordion sections', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      expect(await page.locator(ACCORDION_SECTION_SELECTOR).count()).toBeGreaterThan(0);
    });

    test('should toggle accordion sections on click', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);

      const firstTrigger = page.locator(ACCORDION_TRIGGER_SELECTOR).first();
      // First accordion ('solo') starts OPEN by default.
      await toggleAndVerifyAccordion(firstTrigger, 'true');
      // Click to open again.
      await toggleAndVerifyAccordion(firstTrigger, 'false');
    });

    test('should open accordion section from URL hash', async ({ page }) => {
      await page.goto(`${WORKS_PAGE}#section-solo`);
      await expect(page.locator(SOLO_TRIGGER_ID)).toHaveAttribute('aria-expanded', 'true');
    });

    test('should update URL hash when accordion opens', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);

      const sectionId = await page.locator(ACCORDION_SECTION_SELECTOR).nth(1).getAttribute('id');
      expect(sectionId).toBeTruthy();

      await page.locator(ACCORDION_TRIGGER_SELECTOR).nth(1).click();
      await expect(page).toHaveURL(new RegExp(`#${sectionId}`));
    });

    test('should scroll to accordion section when opened via hash', async ({ page }) => {
      await page.goto(`${WORKS_PAGE}#section-solo`);
      await expect(page.locator(SOLO_SECTION_ID)).toBeVisible();
    });

    test('should handle multiple accordion sections', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);

      expect(await page.locator(ACCORDION_TRIGGER_SELECTOR).count()).toBeGreaterThan(1);

      // First accordion ('solo') starts open, close it.
      await toggleAndVerifyAccordion(page.locator(ACCORDION_TRIGGER_SELECTOR).nth(0), 'true');
      // Open second section.
      await toggleAndVerifyAccordion(page.locator(ACCORDION_TRIGGER_SELECTOR).nth(1), 'false');
    });

    test('should maintain accordion state on page reload', async ({ page }) => {
      await page.goto(`${WORKS_PAGE}#section-solo`);
      await page.reload();
      await expect(page.locator(SOLO_TRIGGER_ID)).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test.describe('Live Page Accordion', () => {
    test('should have year-based accordion sections', async ({ page }) => {
      await page.goto(LIVE_PAGE);
      expect(await page.locator(ACCORDION_SECTION_SELECTOR).count()).toBeGreaterThan(0);
    });

    test('should toggle year sections', async ({ page }) => {
      await page.goto(LIVE_PAGE);
      await waitForHydration(page);

      // First year section starts OPEN by default.
      await toggleAndVerifyAccordion(page.locator(ACCORDION_TRIGGER_SELECTOR).first(), 'true');
    });

    test('should open specific year from URL hash', async ({ page }) => {
      await page.goto(LIVE_PAGE);
      expect(await page.locator(ACCORDION_SECTION_SELECTOR).count()).toBeGreaterThan(0);

      const firstSectionId = await page.locator(ACCORDION_SECTION_SELECTOR).first().getAttribute('id');
      expect(firstSectionId).toBeTruthy();

      const year = (firstSectionId ?? '').replace('section-', '');
      await page.goto(`${LIVE_PAGE}#section-${year}`);
      await expect(page.locator(`#trigger-${year}`)).toHaveAttribute('aria-expanded', 'true');
    });

    test('should handle invalid hash gracefully', async ({ page }) => {
      await page.goto(`${LIVE_PAGE}#section-invalid`);
      expect(await page.locator(ACCORDION_TRIGGER_SELECTOR).count()).toBeGreaterThan(0);
    });
  });

  test.describe('Accordion Keyboard Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);

      const firstTrigger = page.locator(ACCORDION_TRIGGER_SELECTOR).first();
      await firstTrigger.focus();
      await expect(firstTrigger).toBeFocused();

      // First accordion starts open, pressing Enter closes it.
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
      await firstTrigger.press('Enter');
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('should support Space key activation', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);

      const firstTrigger = page.locator(ACCORDION_TRIGGER_SELECTOR).first();
      await firstTrigger.focus();

      // First accordion starts open, pressing Space closes it.
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
      await firstTrigger.press('Space');
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test.describe('Accordion Mobile Behavior', () => {
    test('should toggle accordion with pointer events', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);

      const firstTrigger = page.locator(ACCORDION_TRIGGER_SELECTOR).first();
      // First accordion starts open.
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
      await firstTrigger.click();
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
      await firstTrigger.click();
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('should handle hash navigation on all devices', async ({ page }) => {
      await page.goto(`${WORKS_PAGE}#section-solo`);
      await waitForHydration(page);
      await expect(page.locator(SOLO_SECTION_ID)).toBeVisible();
      await expect(page.locator(SOLO_TRIGGER_ID)).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
