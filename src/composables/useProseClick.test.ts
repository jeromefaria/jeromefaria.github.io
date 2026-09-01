import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';

import { useProseClick } from './useProseClick';

const openCommandPalette = vi.fn();
const routeProseLink = vi.fn();

vi.mock('@/composables/useOverlays', () => ({
  openCommandPalette: () => openCommandPalette(),
}));

vi.mock('@/composables/useProseLinks', () => ({
  useProseLinks: () => routeProseLink,
}));

const mountHandler = (): ((event: MouseEvent) => void) => {
  let handle: ((event: MouseEvent) => void) | null = null;
  mount(defineComponent({
    setup() {
      handle = useProseClick();
      return () => null;
    },
  }));

  if (!handle) throw new Error('useProseClick did not initialise');
  return handle;
};

const clickOn = (target: HTMLElement): MouseEvent => {
  const event = new MouseEvent('click', { cancelable: true, button: 0 });
  Object.defineProperty(event, 'target', { value: target });
  return event;
};

describe('useProseClick', () => {
  beforeEach(() => {
    openCommandPalette.mockClear();
    routeProseLink.mockClear();
  });

  it('opens the command palette when a palette cue is clicked', () => {
    const cue = document.createElement('button');
    cue.className = 'palette-cue';

    mountHandler()(clickOn(cue));

    expect(openCommandPalette).toHaveBeenCalledOnce();
    expect(routeProseLink).not.toHaveBeenCalled();
  });

  it('resolves a cue clicked through a nested child element', () => {
    const cue = document.createElement('button');
    cue.className = 'palette-cue';
    const icon = document.createElement('span');
    cue.appendChild(icon);

    mountHandler()(clickOn(icon));

    expect(openCommandPalette).toHaveBeenCalledOnce();
  });

  it('routes internal links for every other click', () => {
    const event = clickOn(document.createElement('p'));

    mountHandler()(event);

    expect(routeProseLink).toHaveBeenCalledWith(event);
    expect(openCommandPalette).not.toHaveBeenCalled();
  });
});
