import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';

import { useOverlay } from './useOverlay';

const mountOverlay = (): { isOpen: ReturnType<typeof ref<boolean>>; target: HTMLElement; wrapper: VueWrapper } => {
  const isOpen = ref(false);
  const target = document.createElement('input');
  document.body.appendChild(target);

  const wrapper = mount(defineComponent({
    setup() {
      useOverlay(isOpen, ref(target));
      return () => null;
    },
  }));

  return { isOpen, target, wrapper };
};

describe('useOverlay', () => {
  let active: VueWrapper | null = null;
  let cleanup: HTMLElement[] = [];

  afterEach(() => {
    active?.unmount();
    active = null;
    cleanup.forEach(element => element.remove());
    cleanup = [];
    document.body.style.overflow = '';
  });

  it('locks scroll and focuses the target on open', async () => {
    const { isOpen, target, wrapper } = mountOverlay();
    active = wrapper;
    cleanup.push(target);

    isOpen.value = true;
    await nextTick();
    await nextTick();

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(target);
  });

  it('unlocks scroll and restores focus to the trigger on close', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const { isOpen, target, wrapper } = mountOverlay();
    active = wrapper;
    cleanup.push(target, trigger);

    isOpen.value = true;
    await nextTick();
    await nextTick();

    isOpen.value = false;
    await nextTick();

    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(trigger);
  });
});
