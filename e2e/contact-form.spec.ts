import { expect, test } from '@playwright/test';

const FORM_SELECTOR = '.contact-form';
const INQUIRY_SELECT = '#inquiry';
const NAME_INPUT = '#name';
const EMAIL_INPUT = '#email';
const MESSAGE_INPUT = '#message';
const SUBMIT_BUTTON = '.contact-form__submit';
const INVALID_INPUT_CLASS = /contact-form__input--invalid/;
const INVALID_TEXTAREA_CLASS = /contact-form__textarea--invalid/;
const VALID_SUBMIT_CLASS = /contact-form__submit--valid/;
const FORMSUBMIT_URL = /formsubmit\.co/;

const VALID_FORM = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'This is a test message with enough content.',
};

const fillValidForm = async (page: import('@playwright/test').Page): Promise<void> => {
  await page.locator(INQUIRY_SELECT).selectOption('booking');
  await page.locator(NAME_INPUT).fill(VALID_FORM.name);
  await page.locator(EMAIL_INPUT).fill(VALID_FORM.email);
  await page.locator(MESSAGE_INPUT).fill(VALID_FORM.message);
};

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator(FORM_SELECTOR)).toBeVisible();
  });

  test.describe('Rendering', () => {
    test('shows the inquiry selector and base fields', async ({ page }) => {
      await expect(page.locator(INQUIRY_SELECT)).toBeVisible();
      await expect(page.locator(NAME_INPUT)).toBeVisible();
      await expect(page.locator(EMAIL_INPUT)).toBeVisible();
      await expect(page.locator(MESSAGE_INPUT)).toBeVisible();
    });

    test('reveals adaptive fields once an inquiry type is chosen', async ({ page }) => {
      await expect(page.locator('#eventVenue')).toHaveCount(0);
      await page.locator(INQUIRY_SELECT).selectOption('booking');
      await expect(page.locator('#eventVenue')).toBeVisible();
      await expect(page.locator('.contact-form__blurb')).toBeVisible();
    });

    test('shows the submit button', async ({ page }) => {
      await expect(page.locator(SUBMIT_BUTTON)).toBeVisible();
    });

    test('has required indicators on required fields', async ({ page }) => {
      await expect(page.locator('label[for="inquiry"] abbr')).toHaveCount(1);
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
  });

  test.describe('Submit button state', () => {
    test('does not have the valid class when form is empty', async ({ page }) => {
      await expect(page.locator(SUBMIT_BUTTON)).not.toHaveClass(VALID_SUBMIT_CLASS);
    });

    test('does not have the valid class when no inquiry type is selected', async ({ page }) => {
      await page.locator(NAME_INPUT).fill(VALID_FORM.name);
      await page.locator(EMAIL_INPUT).fill(VALID_FORM.email);
      await page.locator(MESSAGE_INPUT).fill(VALID_FORM.message);
      await expect(page.locator(SUBMIT_BUTTON)).not.toHaveClass(VALID_SUBMIT_CLASS);
    });

    test('gets the valid class when a type and all required fields are filled', async ({ page }) => {
      await fillValidForm(page);
      await expect(page.locator(SUBMIT_BUTTON)).toHaveClass(VALID_SUBMIT_CLASS);
    });

    test('requires a type-specific field before validating', async ({ page }) => {
      await page.locator(INQUIRY_SELECT).selectOption('licensing');
      await page.locator(NAME_INPUT).fill(VALID_FORM.name);
      await page.locator(EMAIL_INPUT).fill(VALID_FORM.email);
      await page.locator(MESSAGE_INPUT).fill(VALID_FORM.message);
      await expect(page.locator(SUBMIT_BUTTON)).not.toHaveClass(VALID_SUBMIT_CLASS);

      await page.locator('#track').fill('Overlapse');
      await expect(page.locator(SUBMIT_BUTTON)).toHaveClass(VALID_SUBMIT_CLASS);
    });
  });

  test.describe('Successful submission', () => {
    test('shows success message after successful submission', async ({ page }) => {
      await page.route(FORMSUBMIT_URL, route =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }));

      await fillValidForm(page);
      await page.locator(SUBMIT_BUTTON).click();

      await expect(page.locator('.contact-success')).toBeVisible();
      await expect(page.locator(FORM_SELECTOR)).toBeHidden();
    });

    test('success message contains a title', async ({ page }) => {
      await page.route(FORMSUBMIT_URL, route =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }));

      await fillValidForm(page);
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

      await fillValidForm(page);
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
    test('all visible fields have associated labels', async ({ page }) => {
      await page.locator(INQUIRY_SELECT).selectOption('booking');
      const fields = page.locator('input:not([type="hidden"]):not([tabindex="-1"]), textarea, select');
      const count = await fields.count();

      for (let index = 0; index < count; index += 1) {
        const id = await fields.nth(index).getAttribute('id');
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
