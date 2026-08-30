import { onUnmounted } from 'vue';

interface UseScrollLockReturn {
  lock: () => void;
  unlock: () => void;
}

let lockCount = 0;
let savedScrollY = 0;

const applyLock = (): void => {
  savedScrollY = window.scrollY;

  const { style } = document.body;
  // position: fixed (not overflow: hidden alone) so iOS Safari actually holds still.
  style.position = 'fixed';
  style.top = `-${savedScrollY}px`;
  style.left = '0';
  style.right = '0';
  style.overflow = 'hidden';
};

const releaseLock = (): void => {
  const { style } = document.body;
  style.position = '';
  style.top = '';
  style.left = '';
  style.right = '';
  style.overflow = '';

  window.scrollTo(0, savedScrollY);
};

export const useScrollLock = (): UseScrollLockReturn => {
  let isLocked = false;

  const lock = (): void => {
    if (isLocked) return;

    isLocked = true;
    if (lockCount === 0) applyLock();
    lockCount += 1;
  };

  const unlock = (): void => {
    if (!isLocked) return;

    isLocked = false;
    lockCount -= 1;
    if (lockCount === 0) releaseLock();
  };

  onUnmounted(unlock);

  return { lock, unlock };
};
