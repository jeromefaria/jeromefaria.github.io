import { ref } from 'vue';

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
