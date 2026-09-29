import { ref } from 'vue';

import { readStorage, writeStorage } from '@/utils/storage';

const STORAGE_KEY = 'flag:audioPlayer';

export const audioPlayerEnabled = ref(true);

export const initFeatureFlags = (): void => {
  const override = new URLSearchParams(window.location.search).get('audioPlayer');
  if (override !== null) writeStorage(STORAGE_KEY, override === '0' ? '0' : '1');
  audioPlayerEnabled.value = readStorage(STORAGE_KEY, '1') !== '0';
};
