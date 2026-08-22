import AxeBuilder from '@axe-core/playwright';
import { expect, type Locator, type Page } from '@playwright/test';

// Mirror of LAYOUT.BREAKPOINT_MD (src/utils/constants.ts) / $breakpoint-md
// (src/styles/_variables.scss). e2e can't import from src, so keep in sync.
export const MOBILE_BREAKPOINT = 768;
export const MIN_TOUCH_TARGET_SIZE = 44;

// document.fonts.ready is awaited on top of hydration so web-font FOUT doesn't flake axe colour-contrast checks.
export const waitForHydration = async (page: Page): Promise<void> => {
  await expect(page.locator('body.ready')).toBeAttached();
  await page.evaluate(() => document.fonts.ready);
};

export const isMobile = (page: Page): boolean => {
  const viewport = page.viewportSize();
  return viewport !== null && viewport.width < MOBILE_BREAKPOINT;
};

export const openMobileMenuIfNeeded = async (page: Page): Promise<void> => {
  if (!isMobile(page)) return;

  const openNav = page.locator('.nav--open');
  if (await openNav.isVisible()) return;

  await page.locator('.nav-toggle').click();
  await expect(openNav).toBeVisible();
};

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

export const checkA11y = async (page: Page, options: CheckA11yOptions = {}): Promise<void> => {
  const { tags } = options;

  let builder = new AxeBuilder({ page });
  if (tags) builder = builder.withTags(tags);

  const { violations } = await builder.analyze();

  const summary = violations.map(violation => `${violation.id} (${violation.nodes.length})`).join(', ');
  expect(violations, `Accessibility violations: ${summary}`).toEqual([]);
};
