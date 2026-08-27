import { beforeEach, describe, expect, it, vi } from 'vitest';

import { audioPlayerEnabled, initFeatureFlags } from './useFeatureFlags';

describe('useFeatureFlags', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/');
    audioPlayerEnabled.value = false;
  });

  it('is off by default', () => {
    initFeatureFlags();
    expect(audioPlayerEnabled.value).toBe(false);
  });

  it('turns on via ?audioPlayer=1 and persists it', () => {
    window.history.replaceState(null, '', '/?audioPlayer=1');
    initFeatureFlags();

    expect(audioPlayerEnabled.value).toBe(true);
    expect(localStorage.getItem('flag:audioPlayer')).toBe('1');
  });

  it('turns off via ?audioPlayer=0', () => {
    localStorage.setItem('flag:audioPlayer', '1');
    window.history.replaceState(null, '', '/?audioPlayer=0');
    initFeatureFlags();

    expect(audioPlayerEnabled.value).toBe(false);
  });

  it('reads a persisted flag when no param is present', () => {
    localStorage.setItem('flag:audioPlayer', '1');
    initFeatureFlags();

    expect(audioPlayerEnabled.value).toBe(true);
  });

  it('falls back to off when storage throws', () => {
    const spy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('unavailable');
    });

    initFeatureFlags();
    expect(audioPlayerEnabled.value).toBe(false);

    spy.mockRestore();
  });
});
