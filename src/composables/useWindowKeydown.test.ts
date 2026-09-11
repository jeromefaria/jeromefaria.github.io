import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';

import { useWindowKeydown } from './useWindowKeydown';

const mountWith = (handler: (event: KeyboardEvent) => void) =>
  mount(defineComponent({
    setup() {
      useWindowKeydown(handler);
      return () => null;
    },
  }));

describe('useWindowKeydown', () => {
  it('invokes the handler on window keydown while mounted, and detaches on unmount', () => {
    const handler = vi.fn();
    const wrapper = mountWith(handler);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(handler).toHaveBeenCalledTimes(1);

    wrapper.unmount();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
