import { expect, test } from '@playwright/test';

const FORM_SELECTOR = '.contact-form';
const NAME_INPUT = '#name';
const EMAIL_INPUT = '#email';
const SUBJECT_INPUT = '#subject';
const MESSAGE_INPUT = '#message';
const SUBMIT_BUTTON = '.contact-form__submit';
const INVALID_INPUT_CLASS = /contact-form__input--invalid/;
const INVALID_TEXTAREA_CLASS = /contact-form__textarea--invalid/;
const FORMSUBMIT_URL = /formsubmit\.co/;

const VALID_FORM = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Subject',
  message: 'This is a test message with enough content.',
};

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator(FORM_SELECTOR)).toBeVisible();
  });

  test.describe('Rendering', () => {
    test('shows all form fields', async ({ page }) => {
      await expect(page.locator(NAME_INPUT)).toBeVisible();
      await expect(page.locator(EMAIL_INPUT)).toBeVisible();
      await expect(page.locator(SUBJECT_INPUT)).toBeVisible();
      await expect(page.locator(MESSAGE_INPUT)).toBeVisible();
    });

    test('shows the submit button', async ({ page }) => {
      await expect(page.locator(SUBMIT_BUTTON)).toBeVisible();
    });

    test('has required indicators on required fields', async ({ page }) => {
      await expect(page.locator('label[for="name"] abbr')).toHaveCount(1);
      await expect(page.locator('label[for="email"] abbr')).toHaveCount(1);
      await expect(page.locator('label[for="message"] abbr')).toHaveCount(1);
    });

    test('does not show success message initially', async ({ page }) => {
      await expect(page.locator('.contact-success')).toHaveCount(0);
    });
  });

  test.describe('Validation — required fields', () => {
    test('marks name as invalid after blur when empty', async ({ page }) => {
      await page.locator(NAME_INPUT).focus();
      await page.locator(NAME_INPUT).blur();
      await expect(page.locator(NAME_INPUT)).toHaveClass(INVALID_INPUT_CLASS);
    });

    test('marks email as invalid after blur when empty', async ({ page }) => {
      await page.locator(EMAIL_INPUT).focus();
      await page.locator(EMAIL_INPUT).blur();
      await expect(page.locator(EMAIL_INPUT)).toHaveClass(INVALID_INPUT_CLASS);
    });

    test('marks message as invalid after blur when empty', async ({ page }) => {
      await page.locator(MESSAGE_INPUT).focus();
      await page.locator(MESSAGE_INPUT).blur();
      await expect(page.locator(MESSAGE_INPUT)).toHaveClass(INVALID_TEXTAREA_CLASS);
    });

    test('clears invalid state when valid value is entered', async ({ page }) => {
      await page.locator(NAME_INPUT).focus();
      await page.locator(NAME_INPUT).blur();
      await expect(page.locator(NAME_INPUT)).toHaveClass(INVALID_INPUT_CLASS);
      await page.locator(NAME_INPUT).fill('Jane');
      await expect(page.locator(NAME_INPUT)).not.toHaveClass(INVALID_INPUT_CLASS);
    });
  });

  test.describe('Validation — email format', () => {
    test('does not mark email as invalid when non-empty (format not validated on blur)', async ({ page }) => {
      await page.locator(EMAIL_INPUT).fill('notanemail');
      await expect(page.locator(EMAIL_INPUT)).toHaveValue('notanemail');
      await page.locator(EMAIL_INPUT).blur();
      await expect(page.locator(EMAIL_INPUT)).not.toHaveClass(INVALID_INPUT_CLASS);
    });

    test('marks email as invalid after blur when empty', async ({ page }) => {
      await page.locator(EMAIL_INPUT).focus();
      await page.locator(EMAIL_INPUT).blur();
      await expect(page.locator(EMAIL_INPUT)).toHaveClass(INVALID_INPUT_CLASS);
    });
  });

  test.describe('Submit button state', () => {
    test('does not have the valid class when form is empty', async ({ page }) => {
      await expect(page.locator(SUBMIT_BUTTON)).not.toHaveClass(/contact-form__submit--valid/);
    });

    test('does not have the valid class when only some required fields are filled', async ({ page }) => {
      await page.locator(NAME_INPUT).fill(VALID_FORM.name);
      await page.locator(EMAIL_INPUT).fill(VALID_FORM.email);
      await expect(page.locator(SUBMIT_BUTTON)).not.toHaveClass(/contact-form__submit--valid/);
    });

    test('gets the valid class when all required fields are filled', async ({ page }) => {
      await page.locator(NAME_INPUT).fill(VALID_FORM.name);
      await page.locator(EMAIL_INPUT).fill(VALID_FORM.email);
      await page.locator(MESSAGE_INPUT).fill(VALID_FORM.message);
      await expect(page.locator(SUBMIT_BUTTON)).toHaveClass(/contact-form__submit--valid/);
    });
  });

  test.describe('Successful submission', () => {
    test('shows success message after successful submission', async ({ page }) => {
      await page.route(FORMSUBMIT_URL, route =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }));

      await page.locator(NAME_INPUT).fill(VALID_FORM.name);
      await page.locator(EMAIL_INPUT).fill(VALID_FORM.email);
      await page.locator(SUBJECT_INPUT).fill(VALID_FORM.subject);
      await page.locator(MESSAGE_INPUT).fill(VALID_FORM.message);
      await page.locator(SUBMIT_BUTTON).click();

      await expect(page.locator('.contact-success')).toBeVisible();
      await expect(page.locator(FORM_SELECTOR)).toBeHidden();
    });

    test('success message contains a title', async ({ page }) => {
      await page.route(FORMSUBMIT_URL, route =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }));

      await page.locator(NAME_INPUT).fill(VALID_FORM.name);
      await page.locator(EMAIL_INPUT).fill(VALID_FORM.email);
      await page.locator(MESSAGE_INPUT).fill(VALID_FORM.message);
      await page.locator(SUBMIT_BUTTON).click();

      await expect(page.locator('.contact-success h2')).toBeVisible();
    });
  });

  test.describe('Failed submission — fallback', () => {
    test('falls back to native form submit on network error', async ({ page }) => {
      await page.route(FORMSUBMIT_URL, route => route.abort());

      const nativeSubmitCalled = page.evaluate(() => new Promise<boolean>(resolve => {
        const form = document.querySelector<HTMLFormElement>('.contact-form');
        if (!form) {
          resolve(false);
          return;
        }
        form.submit = () => resolve(true);
      }));

      await page.locator(NAME_INPUT).fill(VALID_FORM.name);
      await page.locator(EMAIL_INPUT).fill(VALID_FORM.email);
      await page.locator(MESSAGE_INPUT).fill(VALID_FORM.message);
      await page.locator(SUBMIT_BUTTON).click();

      expect(await nativeSubmitCalled).toBe(true);
    });
  });

  test.describe('Spam protection', () => {
    test('honeypot field is hidden from users', async ({ page }) => {
      const honeypot = page.locator('input[tabindex="-1"]');
      // Playwright treats off-screen / zero-opacity nodes as present, so assert the
      // hiding mechanism (opacity + off-screen x) rather than a visibility flag.
      await expect(honeypot).toHaveCSS('opacity', '0');

      const box = await honeypot.boundingBox();
      expect(box === null || box.x < 0).toBe(true);
    });
  });

  test.describe('Accessibility', () => {
    test('all visible inputs have associated labels', async ({ page }) => {
      const inputs = page.locator('input:not([type="hidden"]):not([tabindex="-1"]), textarea');
      const count = await inputs.count();

      for (let index = 0; index < count; index += 1) {
        const id = await inputs.nth(index).getAttribute('id');
        if (!id) continue;
        await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
      }
    });

    test('submit button has descriptive text', async ({ page }) => {
      const text = await page.locator(SUBMIT_BUTTON).innerText();
      expect(text.trim()).not.toBe('');
    });
  });
});
