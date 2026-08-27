import { describe, expect, it } from 'vitest';

import { audioUrl, getReleaseAudio, hasPlayableAudio } from './audio';

describe('audio helpers', () => {
  it('resolves a key against the base url', () => {
    expect(audioUrl('BRQN001/01-8-58.m4a')).toMatch(/\/BRQN001\/01-8-58\.m4a$/);
  });

  it("returns a release's ordered audio tracks", () => {
    const tracks = getReleaseAudio('1714');

    expect(tracks).toHaveLength(3);
    expect(tracks[0]?.title).toBe('8:58');
    expect(tracks[0]?.duration).toBeGreaterThan(0);
  });

  it('models 2504 as a single playable piece despite its five movements', () => {
    expect(getReleaseAudio('2504')).toHaveLength(1);
  });

  it('returns an empty list for a release with no audio', () => {
    expect(getReleaseAudio('does-not-exist')).toEqual([]);
  });

  it('reports playability by release id', () => {
    expect(hasPlayableAudio('1714')).toBe(true);
    expect(hasPlayableAudio('does-not-exist')).toBe(false);
  });
});
