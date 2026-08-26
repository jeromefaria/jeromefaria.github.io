import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, ref } from 'vue';

import { useTurnstile } from './useTurnstile';

interface TurnstileOptions {
  sitekey: string;
  callback: (token: string) => void;
  'error-callback': () => void;
  'expired-callback': () => void;
}

type TestWindow = typeof window & {
  onloadTurnstileCallback?: () => void;
};

const makeApi = (mode: 'ok' | 'error' | 'expired' = 'ok') => {
  const state: { options?: TurnstileOptions } = {};

  return {
    render: vi.fn((_element: HTMLElement, options: TurnstileOptions) => {
      state.options = options;
      return 'widget-1';
    }),
    execute: vi.fn(() => {
      const { options } = state;
      if (!options) return;
      if (mode === 'error') options['error-callback']();
      else if (mode === 'expired') options['expired-callback']();
      else options.callback('tok-123');
    }),
    reset: vi.fn(),
    remove: vi.fn(),
  };
};

const installApi = (api: ReturnType<typeof makeApi>): void => {
  window.turnstile = api as unknown as typeof window.turnstile;
};

const mountWith = () =>
  mount(
    defineComponent({
      setup() {
        const container = ref<HTMLElement | null>(null);
        const { execute } = useTurnstile('site-key', container);

        return { container, execute };
      },
      template: '<div ref="container"></div>',
    }),
  );

describe('useTurnstile', () => {
  let appendedScript: HTMLScriptElement | null = null;

  beforeEach(() => {
    appendedScript = null;
    vi.spyOn(document.head, 'appendChild').mockImplementation(node => {
      appendedScript = node as HTMLScriptElement;
      return node;
    });
  });

  afterEach(() => {
    window.turnstile = undefined;
    (window as TestWindow).onloadTurnstileCallback = undefined;
    vi.restoreAllMocks();
  });

  it('renders the widget on mount and resolves a token from execute', async () => {
    const api = makeApi();
    installApi(api);

    const wrapper = mountWith();
    await flushPromises();

    expect(api.render).toHaveBeenCalledOnce();

    const token = await wrapper.vm.execute();

    expect(api.reset).toHaveBeenCalledWith('widget-1');
    expect(api.execute).toHaveBeenCalledWith('widget-1');
    expect(token).toBe('tok-123');
  });

  it('rejects when the widget reports an error', async () => {
    installApi(makeApi('error'));

    const wrapper = mountWith();
    await flushPromises();

    await expect(wrapper.vm.execute()).rejects.toThrow('verification failed');
  });

  it('rejects when the token has expired', async () => {
    installApi(makeApi('expired'));

    const wrapper = mountWith();
    await flushPromises();

    await expect(wrapper.vm.execute()).rejects.toThrow('expired');
  });

  it('rejects execute when the widget is not ready', async () => {
    const wrapper = mountWith();

    await expect(wrapper.vm.execute()).rejects.toThrow('not ready');
  });

  it('injects the script once and resolves after Turnstile loads', async () => {
    const wrapper = mountWith();
    await flushPromises();

    expect(appendedScript?.src).toContain('turnstile');

    const api = makeApi();
    installApi(api);
    (window as TestWindow).onloadTurnstileCallback?.();
    await flushPromises();

    expect(api.render).toHaveBeenCalled();
    expect(await wrapper.vm.execute()).toBe('tok-123');
  });

  it('degrades gracefully when the script fails to load', async () => {
    const wrapper = mountWith();
    await flushPromises();

    appendedScript?.onerror?.(new Event('error'));
    await flushPromises();

    await expect(wrapper.vm.execute()).rejects.toThrow('not ready');
  });

  it('removes the widget on unmount', async () => {
    const api = makeApi();
    installApi(api);

    const wrapper = mountWith();
    await flushPromises();
    wrapper.unmount();

    expect(api.remove).toHaveBeenCalledWith('widget-1');
  });
});
