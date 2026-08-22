import AxeBuilder from '@axe-core/playwright';
import { expect, type Locator, type Page } from '@playwright/test';

// Mirror of LAYOUT.BREAKPOINT_MD (src/utils/constants.ts) / $breakpoint-md
// (src/styles/_variables.scss). e2e can't import from src, so keep in sync.
export const MOBILE_BREAKPOINT = 768;
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Wait for Vue hydration to complete. `body.ready` is added in App's onMounted,
 * i.e. after the app has mounted and hydrated (event handlers attached). Waiting
 * for web fonts to finish loading on top of that removes a FOUT-driven flake
 * class from axe colour-contrast checks.
 */
export const waitForHydration = async (page: Page): Promise<void> => {
  await expect(page.locator('body.ready')).toBeAttached();
  await page.evaluate(() => document.fonts.ready);
};

/** Whether the current viewport is treated as mobile (< 768px wide). */
export const isMobile = (page: Page): boolean => {
  const viewport = page.viewportSize();
  return viewport !== null && viewport.width < MOBILE_BREAKPOINT;
};

/** Open the mobile navigation menu when the viewport is mobile and it is closed. */
export const openMobileMenuIfNeeded = async (page: Page): Promise<void> => {
  if (!isMobile(page)) return;

  const openNav = page.locator('.nav--open');
  if (await openNav.isVisible()) return;

  await page.locator('.nav-toggle').click();
  await expect(openNav).toBeVisible();
};

/** Assert a trigger's aria-expanded state, click it, and assert the flipped state. */
export const toggleAndVerifyAccordion = async (
  trigger: Locator,
  initialState: 'true' | 'false',
): Promise<void> => {
  const expectedState = initialState === 'true' ? 'false' : 'true';

  await expect(trigger).toHaveAttribute('aria-expanded', initialState);
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', expectedState);
};

interface CheckA11yOptions {
  tags?: string[];
}

/** Run axe-core against the current page and fail on any violation. */
export const checkA11y = async (page: Page, options: CheckA11yOptions = {}): Promise<void> => {
  const { tags } = options;

  let builder = new AxeBuilder({ page });
  if (tags) builder = builder.withTags(tags);

  const { violations } = await builder.analyze();

  const summary = violations.map(violation => `${violation.id} (${violation.nodes.length})`).join(', ');
  expect(violations, `Accessibility violations: ${summary}`).toEqual([]);
};
