export interface UseFocusReturn {
  capture: () => void;
  restore: () => void;
}

const isKeyboardFocused = (element: HTMLElement): boolean => {
  try {
    return element.matches(':focus-visible');
  } catch {
    return false;
  }
};

const suppressFocusRing = (element: HTMLElement): void => {
  const previousOutline = element.style.outline;
  element.style.outline = 'none';

  const restoreOutline = (): void => {
    element.style.outline = previousOutline;
    element.removeEventListener('blur', restoreOutline);
    window.removeEventListener('keydown', restoreOutline, true);
  };

  element.addEventListener('blur', restoreOutline, { once: true });
  window.addEventListener('keydown', restoreOutline, { capture: true, once: true });
};

export const useFocusReturn = (): UseFocusReturn => {
  let previouslyFocused: HTMLElement | null = null;
  let openedByKeyboard = false;

  const capture = (): void => {
    previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    openedByKeyboard = previouslyFocused ? isKeyboardFocused(previouslyFocused) : false;
  };

  const restore = (): void => {
    const target = previouslyFocused;
    previouslyFocused = null;
    if (!target) return;

    if (!openedByKeyboard) suppressFocusRing(target);

    target.focus();
  };

  return { capture, restore };
};
