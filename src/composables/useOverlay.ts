import type { Ref } from 'vue';
import { nextTick, onUnmounted, watch } from 'vue';

import { useFocusReturn } from './useFocusReturn';
import { useScrollLock } from './useScrollLock';

export const useOverlay = (isOpen: Ref<boolean>, focusTarget: Ref<HTMLElement | null>): void => {
  const { lock, unlock } = useScrollLock();
  const { capture, restore } = useFocusReturn();

  watch(isOpen, async open => {
    if (open) {
      capture();
      lock();
      await nextTick();
      focusTarget.value?.focus();
      return;
    }

    unlock();
    restore();
    // Immediate so a lazily-mounted overlay that is already open still initialises.
  }, { immediate: true });

  onUnmounted(unlock);
};
