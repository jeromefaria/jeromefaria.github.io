import { describe, expect, it } from 'vitest';

import { fuzzyRank } from './fuzzy';

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
