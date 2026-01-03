import { expect, test, type Page } from '@playwright/test';

// Constants
const HYDRATION_TIMEOUT = 10000;
const HANDLER_ATTACH_DELAY = 100;
const ACCORDION_SECTION_SELECTOR = '.accordion-section';
const ACCORDION_TRIGGER_SELECTOR = '.accordion-trigger';
const SOLO_TRIGGER_ID = '#trigger-solo';
const SOLO_SECTION_ID = '#section-solo';
const WORKS_PAGE = '/works';
const LIVE_PAGE = '/live';

/**
 * Wait for Vue hydration to complete
 * Ensures accordion event handlers are fully attached before testing
 */
async function waitForHydration(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('body.ready', { timeout: HYDRATION_TIMEOUT });
  await page.waitForTimeout(HANDLER_ATTACH_DELAY);
}

/**
 * Toggle accordion trigger and verify aria-expanded state changes
 */
async function toggleAndVerifyAccordion(
  trigger: ReturnType<Page['locator']>,
  initialState: 'true' | 'false',
): Promise<void> {
  const expectedState = initialState === 'true' ? 'false' : 'true';

  await expect(trigger).toHaveAttribute('aria-expanded', initialState);
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', expectedState);
}

test.describe('Accordion Functionality', () => {
  test.describe('Works Page Accordion', () => {
    test('should have accordion sections', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      const accordions = page.locator(ACCORDION_SECTION_SELECTOR);
      const count = await accordions.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should toggle accordion sections on click', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);
      const firstTrigger = page.locator(ACCORDION_TRIGGER_SELECTOR).first();

      // First accordion ('solo') starts OPEN by default
      await toggleAndVerifyAccordion(firstTrigger, 'true');

      // Click to open again
      await toggleAndVerifyAccordion(firstTrigger, 'false');
    });

    test('should open accordion section from URL hash', async ({ page }) => {
      await page.goto(`${WORKS_PAGE}#section-solo`);
      const soloTrigger = page.locator(SOLO_TRIGGER_ID);
      await expect(soloTrigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('should update URL hash when accordion opens', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);

      const secondTrigger = page.locator(ACCORDION_TRIGGER_SELECTOR).nth(1);
      const secondSection = page.locator(ACCORDION_SECTION_SELECTOR).nth(1);
      const sectionId = await secondSection.getAttribute('id');

      if (!sectionId) {
        throw new Error('Second section ID not found');
      }

      await secondTrigger.click();
      await expect(page).toHaveURL(new RegExp(`#${sectionId}`));
    });

    test('should scroll to accordion section when opened via hash', async ({ page }) => {
      await page.goto(`${WORKS_PAGE}#section-solo`);
      const soloSection = page.locator(SOLO_SECTION_ID);
      await expect(soloSection).toBeInViewport();
    });

    test('should handle multiple accordion sections', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);
      const triggers = page.locator(ACCORDION_TRIGGER_SELECTOR);
      const count = await triggers.count();

      expect(count).toBeGreaterThan(1);

      const firstTrigger = triggers.nth(0);
      const secondTrigger = triggers.nth(1);

      // First accordion ('solo') starts open, close it
      await toggleAndVerifyAccordion(firstTrigger, 'true');

      // Open second section
      await toggleAndVerifyAccordion(secondTrigger, 'false');
    });

    test('should maintain accordion state on page reload', async ({ page }) => {
      await page.goto(`${WORKS_PAGE}#section-solo`);
      await page.reload();
      const soloTrigger = page.locator(SOLO_TRIGGER_ID);
      await expect(soloTrigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test.describe('Live Page Accordion', () => {
    test('should have year-based accordion sections', async ({ page }) => {
      await page.goto(LIVE_PAGE);
      const accordions = page.locator(ACCORDION_SECTION_SELECTOR);
      const count = await accordions.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should toggle year sections', async ({ page }) => {
      await page.goto(LIVE_PAGE);
      await waitForHydration(page);
      const firstTrigger = page.locator(ACCORDION_TRIGGER_SELECTOR).first();

      // First year section starts OPEN by default
      await toggleAndVerifyAccordion(firstTrigger, 'true');
    });

    test('should open specific year from URL hash', async ({ page }) => {
      await page.goto(LIVE_PAGE);
      const sections = page.locator(ACCORDION_SECTION_SELECTOR);
      const count = await sections.count();

      if (count === 0) {
        throw new Error('No accordion sections found');
      }

      const firstSectionId = await sections.first().getAttribute('id');

      if (!firstSectionId) {
        throw new Error('First section ID not found');
      }

      const year = firstSectionId.replace('section-', '');
      await page.goto(`${LIVE_PAGE}#section-${year}`);
      const yearTrigger = page.locator(`#trigger-${year}`);
      await expect(yearTrigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('should handle invalid hash gracefully', async ({ page }) => {
      await page.goto(`${LIVE_PAGE}#section-invalid`);
      const triggers = page.locator(ACCORDION_TRIGGER_SELECTOR);
      const count = await triggers.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Accordion Keyboard Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);
      const firstTrigger = page.locator(ACCORDION_TRIGGER_SELECTOR).first();

      await firstTrigger.focus();
      await expect(firstTrigger).toBeFocused();

      // First accordion starts open, pressing Enter closes it
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Enter');
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('should support Space key activation', async ({ page }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);
      const firstTrigger = page.locator(ACCORDION_TRIGGER_SELECTOR).first();

      await firstTrigger.focus();

      // First accordion starts open, pressing Space closes it
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Space');
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test.describe('Accordion Mobile Behavior', () => {
    test('should toggle accordion with pointer events', async ({ page, isMobile }) => {
      await page.goto(WORKS_PAGE);
      await waitForHydration(page);
      const firstTrigger = page.locator(ACCORDION_TRIGGER_SELECTOR).first();

      // First accordion starts open
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');

      // Use tap on mobile, click on desktop
      const interaction = isMobile ? () => firstTrigger.tap() : () => firstTrigger.click();

      await interaction();
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');

      await interaction();
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('should handle hash navigation on all devices', async ({ page }) => {
      await page.goto(`${WORKS_PAGE}#section-solo`);
      await waitForHydration(page);
      const soloSection = page.locator(SOLO_SECTION_ID);
      await expect(soloSection).toBeVisible();

      const soloTrigger = page.locator(SOLO_TRIGGER_ID);
      await expect(soloTrigger).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
