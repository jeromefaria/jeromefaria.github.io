import { useFocusReturn } from './useFocusReturn';
import { useScrollLock } from './useScrollLock';

export interface UseFocusScopeGuardReturn {
  enter: () => void;
  leave: () => void;
}

export const useFocusScopeGuard = (): UseFocusScopeGuardReturn => {
  const { lock, unlock } = useScrollLock();
  const { capture, restore } = useFocusReturn();

  const enter = (): void => {
    capture();
    lock();
  };

  const leave = (): void => {
    unlock();
    restore();
  };

  return { enter, leave };
};
