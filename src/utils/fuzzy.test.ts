import { describe, expect, it } from 'vitest';

import { fuzzyRank, type MatchSegment, matchSegments } from './fuzzy';

const item = (title: string, keywords?: string[]) => ({ title, keywords });

describe('fuzzyRank', () => {
  it('returns the items unchanged for an empty query', () => {
    const items = [item('Works'), item('Live')];
    expect(fuzzyRank('  ', items)).toEqual(items);
  });

  it('keeps only subsequence matches', () => {
    const results = fuzzyRank('wk', [item('Works'), item('Live'), item('Press')]);
    expect(results.map(result => result.title)).toEqual(['Works']);
  });

  it('ranks a word-start, contiguous match above a scattered one', () => {
    const results = fuzzyRank('so', [item('Discography of Solos'), item('Solo Works')]);
    expect(results[0].title).toBe('Solo Works');
  });

  it('rewards contiguous runs over gaps', () => {
    const results = fuzzyRank('cont', [item('Contact'), item('Co-operative not tonight')]);
    expect(results[0].title).toBe('Contact');
  });

  it('matches on keywords but ranks them below a title hit', () => {
    const results = fuzzyRank('email', [
      item('Contact', ['email', 'message', 'reach']),
      item('Email digest'),
    ]);
    expect(results.map(result => result.title)).toEqual(['Email digest', 'Contact']);
  });

  it('drops items that match neither title nor keywords', () => {
    const results = fuzzyRank('xyz', [item('Works', ['discography']), item('Live', ['shows'])]);
    expect(results).toHaveLength(0);
  });

  it('is case-insensitive', () => {
    expect(fuzzyRank('WORKS', [item('works')])).toHaveLength(1);
  });

  it('ignores diacritics', () => {
    expect(fuzzyRank('saude', [item('saúde')])).toHaveLength(1);
    expect(fuzzyRank('vitor', [item('Vítor')])).toHaveLength(1);
  });

  it('ranks entity (keyword) matches above prose (text) matches', () => {
    const entity = { title: 'Alpha', keywords: ['zephyr'] };
    const prose = { title: 'Beta', text: ['a zephyr drifts through'] };

    expect(fuzzyRank('zephyr', [prose, entity])[0]).toBe(entity);
  });

  it('still surfaces prose-only text matches', () => {
    expect(fuzzyRank('zephyr', [{ title: 'Beta', text: ['a zephyr drifts through'] }])).toHaveLength(1);
  });

  it('narrows as tokens are added — every word must match', () => {
    const items = [
      item('MADEIRADIG', ['2009']),
      item('MADEIRADIG', ['2011']),
      item('Störung', ['2008']),
    ];

    expect(fuzzyRank('madeiradig', items)).toHaveLength(2);

    const narrowed = fuzzyRank('madeiradig 2009', items);
    expect(narrowed).toHaveLength(1);
    expect(narrowed[0].keywords).toEqual(['2009']);
  });
});

describe('matchSegments', () => {
  const joined = (segments: MatchSegment[]): string => segments.map(segment => segment.text).join('');
  const highlighted = (segments: MatchSegment[]): string =>
    segments.filter(segment => segment.match).map(segment => segment.text).join('');

  it('returns a single unmatched segment for an empty query', () => {
    expect(matchSegments('', 'Works')).toEqual([{ text: 'Works', match: false }]);
    expect(matchSegments('   ', 'Works')).toEqual([{ text: 'Works', match: false }]);
  });

  it('marks a prefix match while preserving the whole title', () => {
    const segments = matchSegments('priv', 'Privacy');
    expect(joined(segments)).toBe('Privacy');
    expect(highlighted(segments)).toBe('Priv');
  });

  it('marks scattered matched characters and leaves the rest plain', () => {
    const segments = matchSegments('wk', 'Works');
    expect(joined(segments)).toBe('Works');
    expect(highlighted(segments)).toBe('Wk');
  });

  it('maps matches back through diacritics onto the original characters', () => {
    const segments = matchSegments('saude', 'saúde');
    expect(joined(segments)).toBe('saúde');
    expect(highlighted(segments)).toBe('saúde');
  });

  it('leaves the title untouched when nothing matches', () => {
    expect(matchSegments('xyz', 'Works')).toEqual([{ text: 'Works', match: false }]);
  });

  it('highlights every token of a multi-word query', () => {
    const segments = matchSegments('play 2504', "Play '2504'");
    expect(joined(segments)).toBe("Play '2504'");
    expect(highlighted(segments)).toContain('Play');
    expect(highlighted(segments)).toContain('2504');
  });
});
