import { onMounted, onUnmounted, ref } from 'vue';

export const paletteOpen = ref(false);
export const helpOpen = ref(false);

// Latches true on first use so the async component stays mounted (instant re-open).
export const paletteMounted = ref(false);
export const helpMounted = ref(false);

export const openCommandPalette = (): void => {
  helpOpen.value = false;
  paletteMounted.value = true;
  paletteOpen.value = true;
};

export const openKeyboardHelp = (): void => {
  helpMounted.value = true;
  helpOpen.value = true;
};

const isEditable = (element: EventTarget | null): boolean => {
  if (!(element instanceof HTMLElement)) return false;

  const tag = element.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable;
};

export const useOverlayHotkeys = (): void => {
  const onKeydown = (event: KeyboardEvent): void => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (paletteOpen.value) {
        paletteOpen.value = false;
      } else {
        openCommandPalette();
      }
      return;
    }
    if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey && !isEditable(document.activeElement)) {
      event.preventDefault();
      if (helpOpen.value) {
        helpOpen.value = false;
      } else {
        openKeyboardHelp();
      }
      return;
    }
    if (event.key === 'Escape') {
      paletteOpen.value = false;
      helpOpen.value = false;
    }
  };

  onMounted(() => window.addEventListener('keydown', onKeydown));
  onUnmounted(() => window.removeEventListener('keydown', onKeydown));
};
