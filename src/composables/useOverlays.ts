import { onMounted, onUnmounted, ref } from 'vue';

import { isEditable } from '@/utils/keyboardTarget';

export const paletteOpen = ref(false);
export const helpOpen = ref(false);

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

const isBareKey = (event: KeyboardEvent): boolean =>
  !event.ctrlKey && !event.metaKey && !event.altKey && !isEditable(document.activeElement);

const togglePalette = (): void => {
  if (paletteOpen.value) paletteOpen.value = false;
  else openCommandPalette();
};

const toggleHelp = (): void => {
  if (helpOpen.value) helpOpen.value = false;
  else openKeyboardHelp();
};

export const useOverlayHotkeys = (): void => {
  const onKeydown = (event: KeyboardEvent): void => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      togglePalette();
      return;
    }
    if (event.key === ':' && isBareKey(event)) {
      event.preventDefault();
      togglePalette();
      return;
    }
    if (event.key === '?' && isBareKey(event)) {
      event.preventDefault();
      toggleHelp();
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
