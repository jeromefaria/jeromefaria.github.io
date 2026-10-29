import { describe, expect, it } from 'vitest';

import { editionsOf, resolveRefs } from './check-registry-refs.mjs';

describe('editionsOf', () => {
  it('returns the editions array when the release has one', () => {
    expect(editionsOf({ editions: [{ label: 'thisco' }] })).toEqual([{ label: 'thisco' }]);
  });

  it('treats a DVD commission publisher as a single edition', () => {
    expect(editionsOf({ kind: 'commission', work: 'DVD', publisher: { label: 'cca' } })).toEqual([{ label: 'cca' }]);
  });

  it('returns nothing for a release with neither', () => {
    expect(editionsOf({ kind: 'commission', work: 'score' })).toEqual([]);
  });
});

describe('resolveRefs', () => {
  const orgKeys = new Set(['thisco', 'cca']);
  const venueKeys = new Set(['musicbox']);

  it('counts resolvable refs and flags the ones with no registry entry', () => {
    const result = resolveRefs({
      orgKeys,
      venueKeys,
      releases: [
        { id: 'rel-a', meta: { editions: [{ label: 'thisco' }, { label: 'ghost-label' }] } },
        { id: 'rel-b', meta: { editions: [{ label: 'cca' }] } },
      ],
      events: [
        { id: 'evt-a', venue: { ref: 'musicbox' } },
        { id: 'evt-b', venue: { ref: 'ghost-venue' } },
      ],
    });

    expect(result.orgRefCount).toBe(3);
    expect(result.venueRefCount).toBe(2);
    expect(result.unresolved).toEqual(["rel-a  edition label 'ghost-label' (org)", "evt-b  venue ref 'ghost-venue'"]);
  });

  it('skips non-string edition labels and venues without a ref', () => {
    const result = resolveRefs({
      orgKeys,
      venueKeys,
      releases: [{ id: 'rel-c', meta: { editions: [{ label: { text: 'Cities and Memory', url: 'https://x.test' } }] } }],
      events: [{ id: 'evt-c', venue: { name: 'Inline Venue' } }, { id: 'evt-d', venue: null }],
    });

    expect(result).toEqual({ unresolved: [], orgRefCount: 0, venueRefCount: 0 });
  });
});
