import type { Ref } from 'vue';
import { onUnmounted, watch } from 'vue';

import { helpOpen } from './useOverlays';
import { useScrollLock } from './useScrollLock';

interface UseKeyboardHelpReturn {
  isOpen: Ref<boolean>;
  close: () => void;
}

// Visibility and the `?` hotkey live in the always-loaded overlay layer; this
// only owns the scroll lock while the (lazy-loaded) help modal is open.
export const useKeyboardHelp = (): UseKeyboardHelpReturn => {
  const { lock, unlock } = useScrollLock();

  const close = (): void => {
    helpOpen.value = false;
  };

  watch(helpOpen, open => {
    if (open) {
      lock();
    } else {
      unlock();
    }
  }, { immediate: true });

  onUnmounted(unlock);

  return { isOpen: helpOpen, close };
};
