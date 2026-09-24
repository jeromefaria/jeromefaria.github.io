import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Component, defineComponent } from 'vue';

import { useNewsletterForm } from './useNewsletterForm';

const TEST_URL = 'https://contact.example.dev/newsletter/subscribe';

const requestToken = vi.fn<() => Promise<string>>();

function createTestComponent(): Component {
  return defineComponent({
    setup() {
      const form = useNewsletterForm(TEST_URL, requestToken);
      return { ...form };
    },
    template: '<div></div>',
  });
}

type FormVm = Record<string, unknown> & {
  email: string;
  botField: string;
  isSubmitting: boolean;
  showSuccess: boolean;
  errorMessage: string;
  touched: boolean;
  invalid: boolean;
  error: string;
  handleBlur: () => void;
  handleInput: () => void;
  handleSubmit: (event: Event) => Promise<boolean>;
};

const submitEvent = (): Event => ({ preventDefault: vi.fn() }) as unknown as Event;

const okResponse = (ok: boolean, status = 200): Response => ({ ok, status }) as Response;

const sentBody = (fetchSpy: ReturnType<typeof vi.spyOn>): Record<string, string> =>
  JSON.parse((fetchSpy.mock.calls[0] as [string, RequestInit])[1].body as string);

describe('useNewsletterForm', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const mountForm = (): FormVm => mount(createTestComponent()).vm as unknown as FormVm;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch');
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    requestToken.mockReset();
    requestToken.mockResolvedValue('turnstile-token');
    vi.clearAllMocks();
  });

  it('starts empty and untouched', () => {
    const vm = mountForm();
    expect(vm.email).toBe('');
    expect(vm.isSubmitting).toBe(false);
    expect(vm.showSuccess).toBe(false);
    expect(vm.invalid).toBe(false);
    expect(vm.error).toBe('');
  });

  it('flags a required error only after blur on an empty field', () => {
    const vm = mountForm();

    expect(vm.invalid).toBe(false);
    vm.handleBlur();

    expect(vm.invalid).toBe(true);
    expect(vm.error).toBe('Email is required');
  });

  it('clears a prior success and error on input', () => {
    const vm = mountForm();
    vm.showSuccess = true;
    vm.errorMessage = 'stale';

    vm.handleInput();

    expect(vm.showSuccess).toBe(false);
    expect(vm.errorMessage).toBe('');
  });

  it('blocks submission of an empty email and marks it touched', async () => {
    const vm = mountForm();

    const submitted = await vm.handleSubmit(submitEvent());

    expect(submitted).toBe(false);
    expect(vm.touched).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('posts a trimmed email with the token and honeypot, then shows success', async () => {
    fetchSpy.mockResolvedValue(okResponse(true));
    const vm = mountForm();
    vm.email = '  Reader@Example.com  ';
    vm.botField = '';

    const submitted = await vm.handleSubmit(submitEvent());
    await flushPromises();

    expect(submitted).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith(TEST_URL, expect.objectContaining({ method: 'POST' }));
    const body = sentBody(fetchSpy);
    expect(body).toEqual({ token: 'turnstile-token', email: 'Reader@Example.com', botField: '' });
    expect(vm.showSuccess).toBe(true);
    expect(vm.email).toBe('');
    expect(vm.touched).toBe(false);
  });

  it('surfaces the verification error on a 403', async () => {
    fetchSpy.mockResolvedValue(okResponse(false, 403));
    const vm = mountForm();
    vm.email = 'reader@example.com';

    await vm.handleSubmit(submitEvent());

    expect(vm.showSuccess).toBe(false);
    expect(vm.errorMessage).toBe('Could not verify you are human. Please try again.');
  });

  it('surfaces a generic error on any other failure status', async () => {
    fetchSpy.mockResolvedValue(okResponse(false, 500));
    const vm = mountForm();
    vm.email = 'reader@example.com';

    await vm.handleSubmit(submitEvent());

    expect(vm.errorMessage).toBe('Something went wrong. Please try again.');
  });

  it('surfaces a generic error and logs when the request throws', async () => {
    fetchSpy.mockRejectedValue(new Error('network'));
    const vm = mountForm();
    vm.email = 'reader@example.com';

    await vm.handleSubmit(submitEvent());

    expect(vm.errorMessage).toBe('Something went wrong. Please try again.');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('ignores a submit while one is already in flight', async () => {
    const vm = mountForm();
    vm.email = 'reader@example.com';
    vm.isSubmitting = true;

    const submitted = await vm.handleSubmit(submitEvent());

    expect(submitted).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
