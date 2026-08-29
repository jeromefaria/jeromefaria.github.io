import type { Ref } from 'vue';
import { nextTick, onUnmounted, watch } from 'vue';

import { useScrollLock } from './useScrollLock';

export const useOverlay = (isOpen: Ref<boolean>, focusTarget: Ref<HTMLElement | null>): void => {
  const { lock, unlock } = useScrollLock();

  let previouslyFocused: HTMLElement | null = null;

  watch(isOpen, async open => {
    if (open) {
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      lock();
      await nextTick();
      focusTarget.value?.focus();
      return;
    }

    unlock();
    previouslyFocused?.focus();
    previouslyFocused = null;
    // Immediate so a lazily-mounted overlay that is already open still initialises.
  }, { immediate: true });

  onUnmounted(unlock);
};
