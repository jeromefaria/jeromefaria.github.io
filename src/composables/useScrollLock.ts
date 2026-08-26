import { onUnmounted } from 'vue';

interface UseScrollLockReturn {
  lock: () => void;
  unlock: () => void;
}

export const useScrollLock = (): UseScrollLockReturn => {
  const lock = (): void => {
    document.body.style.overflow = 'hidden';
  };

  const unlock = (): void => {
    document.body.style.overflow = '';
  };

  onUnmounted(unlock);

  return { lock, unlock };
};
