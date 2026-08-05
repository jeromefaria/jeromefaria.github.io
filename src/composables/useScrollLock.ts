import type { Ref } from 'vue';
import { onUnmounted, ref } from 'vue';

interface UseScrollLockReturn {
  isLocked: Ref<boolean>;
  lock: () => void;
  unlock: () => void;
}

/**
 * Locks and restores body scroll — the scroll-management concern for modal
 * overlays such as the lightbox. Always releases the lock on unmount, so a
 * component torn down while still open can never leave the page unscrollable.
 */
export const useScrollLock = (): UseScrollLockReturn => {
  const isLocked = ref(false);

  const lock = (): void => {
    document.body.style.overflow = 'hidden';
    isLocked.value = true;
  };

  const unlock = (): void => {
    document.body.style.overflow = '';
    isLocked.value = false;
  };

  onUnmounted(unlock);

  return { isLocked, lock, unlock };
};
