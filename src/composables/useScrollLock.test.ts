import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
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
    document.body.style.overflow = '';
  });

  it('starts unlocked', () => {
    const { api } = mountWithScrollLock();
    expect(api.isLocked.value).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('locks and unlocks body scroll', () => {
    const { api } = mountWithScrollLock();

    api.lock();
    expect(api.isLocked.value).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');

    api.unlock();
    expect(api.isLocked.value).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('releases the lock automatically on unmount', () => {
    const { wrapper, api } = mountWithScrollLock();

    api.lock();
    expect(document.body.style.overflow).toBe('hidden');

    wrapper.unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
