import { ref } from 'vue';

// `?audioPlayer=1` turns the player on and persists it, `=0` off. Default off — it ships dark.
const STORAGE_KEY = 'flag:audioPlayer';

export const audioPlayerEnabled = ref(false);

export const initFeatureFlags = (): void => {
  try {
    const override = new URLSearchParams(window.location.search).get('audioPlayer');
    if (override !== null) localStorage.setItem(STORAGE_KEY, override === '0' ? '0' : '1');
    audioPlayerEnabled.value = localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    audioPlayerEnabled.value = false;
  }
};
