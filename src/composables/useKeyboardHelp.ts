import type { Ref } from 'vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { useScrollLock } from './useScrollLock';

// Module-level so the command palette (and anything else) can open the help
// without a component reference.
const isOpen = ref(false);

export const openKeyboardHelp = (): void => {
  isOpen.value = true;
};

// `?` should type normally inside a field — only summon help when focus is
// somewhere inert.
const isEditable = (element: EventTarget | null): boolean => {
  if (!(element instanceof HTMLElement)) return false;

  const tag = element.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable;
};

interface UseKeyboardHelpReturn {
  isOpen: Ref<boolean>;
  close: () => void;
}

export const useKeyboardHelp = (): UseKeyboardHelpReturn => {
  const { lock, unlock } = useScrollLock();

  const close = (): void => {
    isOpen.value = false;
  };

  watch(isOpen, open => {
    if (open) {
      lock();
    } else {
      unlock();
    }
  });

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && isOpen.value) {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey && !isEditable(document.activeElement)) {
      event.preventDefault();
      isOpen.value = !isOpen.value;
    }
  };

  onMounted(() => window.addEventListener('keydown', onKeydown));
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown);
    unlock();
  });

  return { isOpen, close };
};
