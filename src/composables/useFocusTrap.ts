import type { Ref } from 'vue';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

// Keeps Tab focus within `containerRef` (WCAG 2.4.3) so keyboard users can't
// reach the inert background behind a modal dialog. Returns the keydown handler
// to bind on the dialog element; initial focus and restore stay with the caller,
// which differ per overlay. Shared by the lightbox and the expanded player.
export const useFocusTrap = (containerRef: Ref<HTMLElement | null>): { onKeydown: (event: KeyboardEvent) => void } => {
  const getFocusable = (): HTMLElement[] =>
    containerRef.value ? Array.from(containerRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    const focusable = getFocusable();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) {
      event.preventDefault();
      containerRef.value?.focus();
      return;
    }

    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === containerRef.value)) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return { onKeydown };
};
