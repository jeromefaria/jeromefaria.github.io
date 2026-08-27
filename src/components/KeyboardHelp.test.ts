import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import { helpOpen } from '@/composables/useOverlays';

import KeyboardHelp from './KeyboardHelp.vue';

const help = (): Element | null => document.querySelector('.keyboard-help');

const openHelp = async (): Promise<void> => {
  helpOpen.value = true;
  await nextTick();
  await nextTick();
};

describe('KeyboardHelp', () => {
  let active: VueWrapper | null = null;

  afterEach(() => {
    helpOpen.value = false;
    active?.unmount();
    active = null;
    document.body.style.overflow = '';
  });

  it('is hidden until it is opened', () => {
    active = mount(KeyboardHelp, { attachTo: document.body });
    expect(help()).toBeNull();
  });

  it('opens as a labelled dialog listing the shortcuts', async () => {
    active = mount(KeyboardHelp, { attachTo: document.body });
    await openHelp();

    const panel = document.querySelector('.keyboard-help__panel');
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-label')).toBe('Keyboard shortcuts');
    expect(document.querySelectorAll('.keyboard-help__row').length).toBeGreaterThan(4);
    expect(document.body.textContent).toContain('Open the command palette');
  });

  it('closes on an outside click', async () => {
    active = mount(KeyboardHelp, { attachTo: document.body });
    await openHelp();

    help()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(help()).toBeNull();
  });
});
