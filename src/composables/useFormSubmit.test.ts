import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';

import { useFormSubmit } from './useFormSubmit';

const ACTION = 'https://contact.example.dev/send';

type SubmitVm = {
  botField: string;
  isSubmitting: boolean;
  showSuccess: boolean;
  errorMessage: string;
  handleInput: () => void;
  submit: (buildBody: (token: string) => unknown, onSuccess: () => void) => Promise<void>;
};

const mountSubmit = (name: string, requestToken: () => Promise<string>): SubmitVm =>
  mount(
    defineComponent({
      setup: () => ({ ...useFormSubmit({ action: ACTION, requestToken, name }) }),
      template: '<div></div>',
    }),
  ).vm as unknown as SubmitVm;

const response = (ok: boolean, status = 200): Response => ({ ok, status }) as Response;

describe('useFormSubmit', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch');
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('posts the token-built body, flags success, and runs the reset callback', async () => {
    fetchSpy.mockResolvedValue(response(true));
    const vm = mountSubmit('Contact', () => Promise.resolve('tok-123'));
    const onSuccess = vi.fn();

    await vm.submit(token => ({ token, payload: 'x' }), onSuccess);
    await flushPromises();

    const sent = JSON.parse((fetchSpy.mock.calls[0] as [string, RequestInit])[1].body as string);
    expect(fetchSpy).toHaveBeenCalledWith(ACTION, expect.objectContaining({ method: 'POST' }));
    expect(sent).toEqual({ token: 'tok-123', payload: 'x' });
    expect(vm.showSuccess).toBe(true);
    expect(onSuccess).toHaveBeenCalledOnce();
    expect(vm.isSubmitting).toBe(false);
  });

  it('shows a distinct verify error on 403 versus a generic error otherwise', async () => {
    fetchSpy.mockResolvedValue(response(false, 403));
    const verifyVm = mountSubmit('Contact', () => Promise.resolve('t'));
    await verifyVm.submit(() => ({}), vi.fn());
    await flushPromises();
    const verifyMessage = verifyVm.errorMessage;

    fetchSpy.mockResolvedValue(response(false, 500));
    const genericVm = mountSubmit('Contact', () => Promise.resolve('t'));
    await genericVm.submit(() => ({}), vi.fn());
    await flushPromises();

    expect(verifyMessage).not.toBe('');
    expect(genericVm.errorMessage).not.toBe('');
    expect(verifyMessage).not.toBe(genericVm.errorMessage);
    expect(verifyVm.showSuccess).toBe(false);
  });

  it('logs with the name-derived label on throw', async () => {
    const boom = new Error('network down');
    fetchSpy.mockRejectedValue(boom);

    const vm = mountSubmit('Newsletter', () => Promise.resolve('t'));
    await vm.submit(() => ({}), vi.fn());
    await flushPromises();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Newsletter submission error:', boom);
    expect(vm.errorMessage).not.toBe('');
    expect(vm.isSubmitting).toBe(false);
  });

  it('clears success and error state on input', async () => {
    fetchSpy.mockResolvedValue(response(false, 500));
    const vm = mountSubmit('Contact', () => Promise.resolve('t'));
    await vm.submit(() => ({}), vi.fn());
    await flushPromises();
    expect(vm.errorMessage).not.toBe('');

    vm.handleInput();
    expect(vm.errorMessage).toBe('');
    expect(vm.showSuccess).toBe(false);
  });
});
