import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';

import { useScrollLock } from './useScrollLock';

const mountWithScrollLock = () => {
  let api: ReturnType<typeof useScrollLock> | null = null;

  const wrapper = mount(defineComponent({
    setup() {
      api = useScrollLock();
      return () => null;
    },
  }));

  if (!api) throw new Error('useScrollLock did not initialise');
  return { wrapper, api };
};

describe('useScrollLock', () => {
  afterEach(() => {
    const { style } = document.body;
    style.position = '';
    style.top = '';
    style.left = '';
    style.right = '';
    style.overflow = '';
  });

  it('starts with body scroll unlocked', () => {
    mountWithScrollLock();
    expect(document.body.style.position).toBe('');
    expect(document.body.style.overflow).toBe('');
  });

  it('locks with a fixed body and releases it on unlock', () => {
    const { api } = mountWithScrollLock();

    api.lock();
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.overflow).toBe('hidden');

    api.unlock();
    expect(document.body.style.position).toBe('');
    expect(document.body.style.overflow).toBe('');
  });

  it('is idempotent — a second unlock without a lock is a no-op', () => {
    const { api } = mountWithScrollLock();

    expect(() => api.unlock()).not.toThrow();
    expect(document.body.style.position).toBe('');
  });

  it('refcounts across consumers — stays locked until the last releases', () => {
    const first = mountWithScrollLock();
    const second = mountWithScrollLock();

    first.api.lock();
    second.api.lock();
    expect(document.body.style.position).toBe('fixed');

    first.api.unlock();
    expect(document.body.style.position).toBe('fixed');

    second.api.unlock();
    expect(document.body.style.position).toBe('');
  });

  it('preserves and restores the scroll position', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 240 });
    const { api } = mountWithScrollLock();

    api.lock();
    expect(document.body.style.top).toBe('-240px');

    api.unlock();
    expect(scrollTo).toHaveBeenCalledWith(0, 240);

    scrollTo.mockRestore();
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  });

  it('releases the lock automatically on unmount', () => {
    const { wrapper, api } = mountWithScrollLock();

    api.lock();
    expect(document.body.style.position).toBe('fixed');

    wrapper.unmount();
    expect(document.body.style.position).toBe('');
  });
});
