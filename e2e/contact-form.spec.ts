import { expect, type Page, test } from '@playwright/test';

const FORM = '.contact-form';
const INQUIRY = '#inquiry';
const NAME = '#name';
const EMAIL = '#email';
const MESSAGE = '#message';
const SUBMIT = '.contact-form__submit';
const WORKER_URL = /workers\.dev/;
const INVALID_INPUT = /contact-form__input--invalid/;
const INVALID_TEXTAREA = /contact-form__textarea--invalid/;
const VALID_SUBMIT = /contact-form__submit--valid/;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const stubTurnstile = (page: Page): Promise<void> =>
  page.addInitScript(() => {
    let onToken: ((token: string) => void) | undefined;
    (window as unknown as { turnstile: unknown }).turnstile = {
      render: (_element: HTMLElement, options: { callback: (token: string) => void }) => {
        onToken = options.callback;
        return 'test-widget';
      },
      execute: () => onToken?.('test-token'),
      reset: () => {},
      remove: () => {},
    };
  });

const mockWorker = (page: Page, status: number): Promise<void> =>
  page.route(WORKER_URL, route => {
    if (route.request().method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: CORS });
    }

    return route.fulfill({
      status,
      headers: CORS,
      contentType: 'application/json',
      body: JSON.stringify({ ok: status === 200 }),
    });
  });

const fillValid = async (page: Page): Promise<void> => {
  await page.locator(INQUIRY).selectOption('booking');
  await page.locator(NAME).fill('Test User');
  await page.locator(EMAIL).fill('test@example.com');
  await page.locator(MESSAGE).fill('This is a test message with enough content.');
};

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await stubTurnstile(page);
    await page.goto('/contact');
    await expect(page.locator(FORM)).toBeVisible();
  });

  test.describe('Rendering', () => {
    test('shows the inquiry selector and base fields', async ({ page }) => {
      await expect(page.locator(INQUIRY)).toBeVisible();
      await expect(page.locator(NAME)).toBeVisible();
      await expect(page.locator(EMAIL)).toBeVisible();
      await expect(page.locator(MESSAGE)).toBeVisible();
    });

    test('reveals adaptive fields once an inquiry type is chosen', async ({ page }) => {
      await expect(page.locator('#eventVenue')).toHaveCount(0);
      await page.locator(INQUIRY).selectOption('booking');
      await expect(page.locator('#eventVenue')).toBeVisible();
      await expect(page.locator('.contact-form__blurb')).toBeVisible();
    });

    test('has required indicators on required fields', async ({ page }) => {
      for (const id of ['inquiry', 'name', 'email', 'message']) {
        await expect(page.locator(`label[for="${id}"] abbr`)).toHaveCount(1);
      }
    });

    test('shows the privacy notice linking to the privacy page', async ({ page }) => {
      const notice = page.locator('.contact-form__notice');
      await expect(notice).toContainText('Cloudflare Turnstile');
      await expect(notice.locator('a')).toHaveAttribute('href', '/privacy');
    });

    test('does not show success message initially', async ({ page }) => {
      await expect(page.locator('.contact-success')).toHaveCount(0);
    });
  });

  test.describe('Validation', () => {
    test('marks name invalid after blur when empty', async ({ page }) => {
      await page.locator(NAME).focus();
      await page.locator(NAME).blur();
      await expect(page.locator(NAME)).toHaveClass(INVALID_INPUT);
    });

    test('marks message invalid after blur when empty', async ({ page }) => {
      await page.locator(MESSAGE).focus();
      await page.locator(MESSAGE).blur();
      await expect(page.locator(MESSAGE)).toHaveClass(INVALID_TEXTAREA);
    });

    test('submit is not valid until a type and required fields are filled', async ({ page }) => {
      await expect(page.locator(SUBMIT)).not.toHaveClass(VALID_SUBMIT);

      await page.locator(NAME).fill('Test User');
      await page.locator(EMAIL).fill('test@example.com');
      await page.locator(MESSAGE).fill('A message.');
      await expect(page.locator(SUBMIT)).not.toHaveClass(VALID_SUBMIT);

      await page.locator(INQUIRY).selectOption('booking');
      await expect(page.locator(SUBMIT)).toHaveClass(VALID_SUBMIT);
    });

    test('requires a type-specific field before validating', async ({ page }) => {
      await page.locator(INQUIRY).selectOption('licensing');
      await page.locator(NAME).fill('Test User');
      await page.locator(EMAIL).fill('test@example.com');
      await page.locator(MESSAGE).fill('A message.');
      await expect(page.locator(SUBMIT)).not.toHaveClass(VALID_SUBMIT);

      await page.locator('#track').fill('Overlapse');
      await expect(page.locator(SUBMIT)).toHaveClass(VALID_SUBMIT);
    });
  });

  test.describe('Submission', () => {
    test('shows the success message after a verified submit', async ({ page }) => {
      await mockWorker(page, 200);
      await fillValid(page);
      await page.locator(SUBMIT).click();

      await expect(page.locator('.contact-success')).toBeVisible();
      await expect(page.locator(FORM)).toBeHidden();
    });

    test('shows the verification error on a 403', async ({ page }) => {
      await mockWorker(page, 403);
      await fillValid(page);
      await page.locator(SUBMIT).click();

      await expect(page.locator('.contact-form__submit-error')).toContainText('verify');
    });

    test('shows the generic error on a server failure', async ({ page }) => {
      await mockWorker(page, 502);
      await fillValid(page);
      await page.locator(SUBMIT).click();

      await expect(page.locator('.contact-form__submit-error')).toContainText('went wrong');
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
    test('all visible fields have associated labels', async ({ page }) => {
      await page.locator(INQUIRY).selectOption('booking');
      const fields = page.locator('input:not([type="hidden"]):not([tabindex="-1"]), textarea, select');
      const count = await fields.count();

      for (let index = 0; index < count; index += 1) {
        const id = await fields.nth(index).getAttribute('id');
        if (!id) continue;
        await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
      }
    });
  });
});
