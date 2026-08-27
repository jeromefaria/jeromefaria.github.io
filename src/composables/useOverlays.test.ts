import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';

import { helpMounted, helpOpen, openKeyboardHelp, paletteMounted, paletteOpen, useOverlayHotkeys } from './useOverlays';

const mountHotkeys = (): VueWrapper =>
  mount(defineComponent({
    setup() {
      useOverlayHotkeys();
      return () => null;
    },
  }));

const dispatch = (key: string, modifiers: Partial<KeyboardEvent> = {}): void => {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true, ...modifiers }));
};

describe('useOverlayHotkeys', () => {
  let active: VueWrapper | null = null;

  afterEach(() => {
    active?.unmount();
    active = null;
    paletteOpen.value = false;
    helpOpen.value = false;
  });

  it('toggles the palette on Cmd/Ctrl+K and latches it mounted', () => {
    active = mountHotkeys();

    dispatch('k', { metaKey: true });
    expect(paletteOpen.value).toBe(true);
    expect(paletteMounted.value).toBe(true);

    dispatch('k', { metaKey: true });
    expect(paletteOpen.value).toBe(false);
  });

  it('toggles help on "?" when focus is inert', () => {
    active = mountHotkeys();

    dispatch('?');
    expect(helpOpen.value).toBe(true);
    expect(helpMounted.value).toBe(true);

    dispatch('?');
    expect(helpOpen.value).toBe(false);
  });

  it('does not open help when "?" is typed in a field', () => {
    active = mountHotkeys();

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    dispatch('?');
    expect(helpOpen.value).toBe(false);
    input.remove();
  });

  it('closes both overlays on Escape', () => {
    active = mountHotkeys();
    paletteOpen.value = true;
    helpOpen.value = true;

    dispatch('Escape');
    expect(paletteOpen.value).toBe(false);
    expect(helpOpen.value).toBe(false);
  });

  it('opening the palette dismisses the help', () => {
    active = mountHotkeys();
    openKeyboardHelp();

    dispatch('k', { metaKey: true });
    expect(paletteOpen.value).toBe(true);
    expect(helpOpen.value).toBe(false);
  });

  it('openKeyboardHelp opens the help (the palette action path)', () => {
    active = mountHotkeys();

    openKeyboardHelp();
    expect(helpOpen.value).toBe(true);
  });
});
