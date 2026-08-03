import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Component, defineComponent, reactive } from 'vue';

import { useHashScroll } from './useHashScroll';

const mockRoute = reactive({ hash: '', path: '/press' });

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
}));

const createComponent = (onHash: (hash: string) => void, options?: { immediate?: boolean }): Component =>
  defineComponent({
    setup() {
      useHashScroll(onHash, options);
      return {};
    },
    template: '<div />',
  });

describe('useHashScroll', () => {
  beforeEach(() => {
    mockRoute.hash = '';
    vi.clearAllMocks();
  });

  it('does not run the handler on mount when there is no hash', () => {
    const onHash = vi.fn();
    mount(createComponent(onHash, { immediate: true }));
    expect(onHash).not.toHaveBeenCalled();
  });

  it('runs the handler on mount when immediate and a hash is present', () => {
    mockRoute.hash = '#target';
    const onHash = vi.fn();
    mount(createComponent(onHash, { immediate: true }));
    expect(onHash).toHaveBeenCalledWith('#target');
  });

  it('does not run on mount when a hash is present but immediate is false', () => {
    mockRoute.hash = '#target';
    const onHash = vi.fn();
    mount(createComponent(onHash));
    expect(onHash).not.toHaveBeenCalled();
  });

  it('runs the handler when the hash changes after the initial render', async () => {
    const onHash = vi.fn();
    const wrapper = mount(createComponent(onHash));
    await wrapper.vm.$nextTick();

    mockRoute.hash = '#next';
    await wrapper.vm.$nextTick();

    expect(onHash).toHaveBeenCalledWith('#next');
  });

  it('ignores a cleared (empty) hash', async () => {
    mockRoute.hash = '#a';
    const onHash = vi.fn();
    const wrapper = mount(createComponent(onHash));
    await wrapper.vm.$nextTick();
    onHash.mockClear();

    mockRoute.hash = '';
    await wrapper.vm.$nextTick();

    expect(onHash).not.toHaveBeenCalled();
  });
});
