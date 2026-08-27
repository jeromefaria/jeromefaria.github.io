import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import KeyboardHelp from './KeyboardHelp.vue';

const dispatch = (key: string): void => {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }));
};

const help = (): Element | null => document.querySelector('.keyboard-help');

describe('KeyboardHelp', () => {
  let active: VueWrapper | null = null;

  afterEach(() => {
    dispatch('Escape');
    active?.unmount();
    active = null;
    document.body.style.overflow = '';
  });

  it('is hidden until "?" is pressed', () => {
    active = mount(KeyboardHelp, { attachTo: document.body });
    expect(help()).toBeNull();
  });

  it('opens as a labelled dialog listing the shortcuts', async () => {
    active = mount(KeyboardHelp, { attachTo: document.body });

    dispatch('?');
    await nextTick();
    await nextTick();

    const panel = document.querySelector('.keyboard-help__panel');
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-label')).toBe('Keyboard shortcuts');
    expect(document.querySelectorAll('.keyboard-help__row').length).toBeGreaterThan(4);
    expect(document.body.textContent).toContain('Open the command palette');
  });

  it('closes on an outside click', async () => {
    active = mount(KeyboardHelp, { attachTo: document.body });

    dispatch('?');
    await nextTick();
    await nextTick();

    help()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(help()).toBeNull();
  });
});
