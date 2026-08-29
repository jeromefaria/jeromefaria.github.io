export interface UseFocusReturn {
  capture: () => void;
  restore: () => void;
}

export const useFocusReturn = (): UseFocusReturn => {
  let previouslyFocused: HTMLElement | null = null;

  const capture = (): void => {
    previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  };

  const restore = (): void => {
    previouslyFocused?.focus();
    previouslyFocused = null;
  };

  return { capture, restore };
};
