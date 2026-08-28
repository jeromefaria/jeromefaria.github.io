import { beforeEach, describe, expect, it, vi } from 'vitest';

import { audioPlayerEnabled, initFeatureFlags } from './useFeatureFlags';

describe('useFeatureFlags', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/');
    audioPlayerEnabled.value = true;
  });

  it('is on by default', () => {
    initFeatureFlags();
    expect(audioPlayerEnabled.value).toBe(true);
  });

  it('turns off via ?audioPlayer=0 and persists it', () => {
    window.history.replaceState(null, '', '/?audioPlayer=0');
    initFeatureFlags();

    expect(audioPlayerEnabled.value).toBe(false);
    expect(localStorage.getItem('flag:audioPlayer')).toBe('0');
  });

  it('re-enables via ?audioPlayer=1', () => {
    localStorage.setItem('flag:audioPlayer', '0');
    window.history.replaceState(null, '', '/?audioPlayer=1');
    initFeatureFlags();

    expect(audioPlayerEnabled.value).toBe(true);
  });

  it('reads a persisted opt-out when no param is present', () => {
    localStorage.setItem('flag:audioPlayer', '0');
    initFeatureFlags();

    expect(audioPlayerEnabled.value).toBe(false);
  });

  it('falls back to on when storage throws', () => {
    audioPlayerEnabled.value = false;
    const spy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('unavailable');
    });

    initFeatureFlags();
    expect(audioPlayerEnabled.value).toBe(true);

    spy.mockRestore();
  });
});
