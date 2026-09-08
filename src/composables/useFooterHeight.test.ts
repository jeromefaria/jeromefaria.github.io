import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defineComponent, h, type Ref, ref } from 'vue';

import { useFooterHeight } from './useFooterHeight';

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];

  disconnected = false;

  constructor(private readonly callback: ResizeObserverCallback) {
    MockResizeObserver.instances.push(this);
  }

  observe(): void {}

  disconnect(): void {
    this.disconnected = true;
  }

  trigger(): void {
    this.callback([], this as unknown as ResizeObserver);
  }
}

const originalResizeObserver = globalThis.ResizeObserver;

const mountWithFooter = (render: (element: Ref<HTMLElement | undefined>) => unknown) =>
  mount(defineComponent({
    setup() {
      const element = ref<HTMLElement>();
      useFooterHeight(element);
      return () => render(element);
    },
  }));

describe('useFooterHeight', () => {
  beforeEach(() => {
    MockResizeObserver.instances = [];
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
    document.documentElement.style.removeProperty('--footer-height');
  });

  it('publishes the measured footer height to the document root', () => {
    const wrapper = mountWithFooter(element => h('footer', { ref: element }));

    const footer = wrapper.find('footer').element as HTMLElement;
    footer.getBoundingClientRect = () => ({ height: 128 } as DOMRect);

    MockResizeObserver.instances[0].trigger();

    expect(document.documentElement.style.getPropertyValue('--footer-height')).toBe('128px');
  });

  it('disconnects the observer on unmount', () => {
    const wrapper = mountWithFooter(element => h('footer', { ref: element }));

    wrapper.unmount();

    expect(MockResizeObserver.instances[0].disconnected).toBe(true);
  });

  it('does nothing when the element ref never binds', () => {
    mountWithFooter(() => null);

    expect(MockResizeObserver.instances).toHaveLength(0);
  });

  it('is inert when ResizeObserver is unavailable', () => {
    globalThis.ResizeObserver = undefined as unknown as typeof ResizeObserver;

    const wrapper = mountWithFooter(element => h('footer', { ref: element }));

    expect(document.documentElement.style.getPropertyValue('--footer-height')).toBe('');
    expect(() => wrapper.unmount()).not.toThrow();
  });
});
