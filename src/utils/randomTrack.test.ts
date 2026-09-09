import { afterEach, describe, expect, it, vi } from 'vitest';

import { pickRandomTrack } from './randomTrack';

describe('pickRandomTrack', () => {
  afterEach(() => vi.restoreAllMocks());

  it('returns a valid (releaseId, trackIndex) from the playable catalogue', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const pick = pickRandomTrack();

    expect(pick).not.toBeNull();
    expect(typeof pick?.releaseId).toBe('string');
    expect(pick?.trackIndex).toBeGreaterThanOrEqual(0);
  });

  it('spans the whole pool, not just the first entry', () => {
    const first = (vi.spyOn(Math, 'random').mockReturnValue(0), pickRandomTrack());
    const last = (vi.spyOn(Math, 'random').mockReturnValue(0.999999), pickRandomTrack());

    expect(isSame(first, last)).toBe(false);
  });

  it('avoids returning the excluded track when alternatives exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const first = pickRandomTrack();

    const next = pickRandomTrack(first ?? undefined);

    expect(first && next && isSame(first, next)).toBe(false);
  });
});

const isSame = (a: { releaseId: string; trackIndex: number } | null, b: { releaseId: string; trackIndex: number } | null): boolean =>
  Boolean(a && b && a.releaseId === b.releaseId && a.trackIndex === b.trackIndex);
