import type { Ref } from 'vue';
import { onUnmounted, ref } from 'vue';

interface UseScrollLockReturn {
  isLocked: Ref<boolean>;
  lock: () => void;
  unlock: () => void;
}

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
