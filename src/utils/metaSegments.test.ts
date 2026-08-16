import { describe, expect, it } from 'vitest';

import type { ReleaseMeta } from '@/types/works';

import { buildMetaSegments } from './metaSegments';

// Flatten segments to their plain-text form so the tests read as the display
// line; links contribute their text, em wraps its link's text.
const asText = (meta: ReleaseMeta) =>
  buildMetaSegments(meta)
    .map(segment => (segment.kind === 'text' ? segment.text : segment.link.text))
    .join('');

describe('buildMetaSegments', () => {
  it('joins mediums with a slash and separates editions with a slash', () => {
    expect(asText({
      kind: 'music',
      mediums: ['CD', 'MP3'],
      editions: [{ label: { text: 'A' }, catalog: 'A1' }, { label: { text: 'B' } }],
      year: 2020,
    })).toBe('CD/MP3 — A, A1 / B, 2020');
  });

  it('renders a compilation, leading with the collaborators when present', () => {
    expect(asText({
      kind: 'compilation',
      compilation: { text: 'Comp', url: 'https://c' },
      collaborators: ['Structura'],
      mediums: ['MP3'],
      editions: [{ label: { text: 'Label' }, catalog: 'L1' }],
      year: 2007,
    })).toBe('with Structura in Comp — MP3, Label, L1, 2007');
  });

  it('renders a compilation without collaborators', () => {
    expect(asText({
      kind: 'compilation',
      compilation: { text: 'Comp' },
      mediums: ['CD'],
      editions: [{ label: { text: 'Label' } }],
      year: 2008,
    })).toBe('in Comp — CD, Label, 2008');
  });

  it('renders each commission shape', () => {
    expect(asText({ kind: 'commission', work: 'Film', director: { text: 'Dir' }, year: 2016 }))
      .toBe('Film — dir. Dir, 2016');
    expect(asText({ kind: 'commission', work: 'Theatre', venue: { text: 'Venue' }, year: 2021 }))
      .toBe('Theatre — Venue, 2021');
    expect(asText({ kind: 'commission', work: 'DVD', publisher: { label: { text: 'Pub' }, catalog: 'P1' }, year: 2008 }))
      .toBe('DVD — Pub, P1, 2008');
    expect(asText({ kind: 'commission', work: 'DVD', publisher: { label: { text: 'Pub' } }, year: 2008 }))
      .toBe('DVD — Pub, 2008');
    expect(asText({ kind: 'commission', work: 'Live Score', year: 2013 }))
      .toBe('Live Score — 2013');
  });

  it('renders a publication with and without an ISBN', () => {
    expect(asText({ kind: 'publication', publisher: { text: 'Pub' }, isbn: { value: '123' }, year: 2009 }))
      .toBe('Book — Pub, 2009 — ISBN 123');
    expect(asText({ kind: 'publication', publisher: { text: 'Pub' }, year: 2009 }))
      .toBe('Book — Pub, 2009');
  });

  it('renders a mastering credit leading with the artist', () => {
    expect(asText({
      kind: 'mastering',
      artist: { text: 'Artist' },
      editions: [{ label: { text: 'Label' }, catalog: 'L1' }],
      year: 2025,
    })).toBe('Artist — Label, L1, 2025');
  });
});
