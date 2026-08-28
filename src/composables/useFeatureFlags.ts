import { ref } from 'vue';

// The player ships on. `?audioPlayer=0` opts out and persists it; `=1` re-enables.
const STORAGE_KEY = 'flag:audioPlayer';

export const audioPlayerEnabled = ref(true);

export const initFeatureFlags = (): void => {
  try {
    const override = new URLSearchParams(window.location.search).get('audioPlayer');
    if (override !== null) localStorage.setItem(STORAGE_KEY, override === '0' ? '0' : '1');
    audioPlayerEnabled.value = localStorage.getItem(STORAGE_KEY) !== '0';
  } catch {
    audioPlayerEnabled.value = true;
  }
};
