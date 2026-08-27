import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, nextTick } from 'vue';

import { openKeyboardHelp, useKeyboardHelp } from './useKeyboardHelp';

type Api = ReturnType<typeof useKeyboardHelp>;

let current: Api | null = null;

const mountHelp = (): { api: Api; wrapper: VueWrapper } => {
  let api: Api | null = null;
  const wrapper = mount(defineComponent({
    setup() {
      api = useKeyboardHelp();
      return () => null;
    },
  }));

  if (!api) throw new Error('useKeyboardHelp did not initialise');
  current = api;
  return { api, wrapper };
};

const dispatch = (key: string): void => {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }));
};

describe('useKeyboardHelp', () => {
  let active: VueWrapper | null = null;

  afterEach(() => {
    current?.close();
    current = null;
    active?.unmount();
    active = null;
    document.body.style.overflow = '';
  });

  it('opens on "?" when focus is inert, and locks scroll', async () => {
    const { api, wrapper } = mountHelp();
    active = wrapper;

    dispatch('?');
    expect(api.isOpen.value).toBe(true);

    await nextTick();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('does not open when "?" is typed inside a field', () => {
    const { api, wrapper } = mountHelp();
    active = wrapper;

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    dispatch('?');
    expect(api.isOpen.value).toBe(false);
    input.remove();
  });

  it('toggles closed on a second "?", and closes on Escape', async () => {
    const { api, wrapper } = mountHelp();
    active = wrapper;

    dispatch('?');
    dispatch('?');
    expect(api.isOpen.value).toBe(false);

    dispatch('?');
    dispatch('Escape');
    expect(api.isOpen.value).toBe(false);

    await nextTick();
    expect(document.body.style.overflow).toBe('');
  });

  it('opens via the module-level opener the palette action uses', () => {
    const { api, wrapper } = mountHelp();
    active = wrapper;

    openKeyboardHelp();
    expect(api.isOpen.value).toBe(true);
  });
});
