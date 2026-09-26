import { expect, test } from '@playwright/test';

import { mockWorker, stubTurnstile } from './helpers';

const FORM = '.contact-form';
const EMAIL = '#newsletter-email';
const SUBMIT = '.contact-form__submit';
const ERROR = '.contact-form__error';
const SUCCESS = '.contact-success';
const INVALID_INPUT = /contact-form__input--invalid/;
const VALID_SUBMIT = /contact-form__submit--valid/;

test.describe('Newsletter Signup', () => {
  test.beforeEach(async ({ page }) => {
    await stubTurnstile(page);
    await page.goto('/newsletter');
    await expect(page.locator(FORM)).toBeVisible();
  });

  test.describe('Rendering', () => {
    test('shows the email field and subscribe button', async ({ page }) => {
      await expect(page.locator(EMAIL)).toBeVisible();
      await expect(page.locator(SUBMIT)).toContainText('Subscribe');
    });

    test('shows the intro blurb', async ({ page }) => {
      await expect(page.locator('.newsletter__intro')).toContainText('New releases, live dates');
    });

    test('marks the email field required', async ({ page }) => {
      await expect(page.locator('label[for="newsletter-email"] abbr')).toHaveCount(1);
    });

    test('shows the privacy notice linking to the privacy page', async ({ page }) => {
      const notice = page.locator('.contact-form__notice');
      await expect(notice).toContainText('Cloudflare Turnstile');
      await expect(notice.locator('a')).toHaveAttribute('href', '/privacy');
    });

    test('does not show the confirmation message initially', async ({ page }) => {
      await expect(page.locator(SUCCESS)).toHaveCount(0);
    });
  });

  test.describe('Validation', () => {
    test('marks email invalid with a message after blur when empty', async ({ page }) => {
      await page.locator(EMAIL).focus();
      await page.locator(EMAIL).blur();

      await expect(page.locator(EMAIL)).toHaveClass(INVALID_INPUT);
      await expect(page.locator(ERROR)).toContainText('Email is required');
    });

    test('submit is not valid until the email is filled', async ({ page }) => {
      await expect(page.locator(SUBMIT)).not.toHaveClass(VALID_SUBMIT);

      await page.locator(EMAIL).fill('test@example.com');
      await expect(page.locator(SUBMIT)).toHaveClass(VALID_SUBMIT);
    });
  });

  test.describe('Submission', () => {
    test('shows the confirmation message after a verified submit', async ({ page }) => {
      await mockWorker(page, 200);
      await page.locator(EMAIL).fill('test@example.com');
      await page.locator(SUBMIT).click();

      await expect(page.locator(SUCCESS)).toContainText('confirm your subscription');
      await expect(page.locator(FORM)).toBeHidden();
    });

    test('shows the verification error on a 403', async ({ page }) => {
      await mockWorker(page, 403);
      await page.locator(EMAIL).fill('test@example.com');
      await page.locator(SUBMIT).click();

      await expect(page.locator(ERROR)).toContainText('verify you are human');
    });

    test('shows the generic error on a server failure', async ({ page }) => {
      await mockWorker(page, 502);
      await page.locator(EMAIL).fill('test@example.com');
      await page.locator(SUBMIT).click();

      await expect(page.locator(ERROR)).toContainText('went wrong');
    });
  });

  test.describe('Spam protection', () => {
    test('honeypot field is hidden from users', async ({ page }) => {
      const honeypot = page.locator('.contact-form__honeypot');
      await expect(honeypot).toHaveCSS('opacity', '0');

      const box = await honeypot.boundingBox();
      expect(box === null || box.x < 0).toBe(true);
    });
  });

  test.describe('Accessibility', () => {
    test('the email field has an associated label', async ({ page }) => {
      await expect(page.locator('label[for="newsletter-email"]')).toHaveCount(1);
    });
  });
});
