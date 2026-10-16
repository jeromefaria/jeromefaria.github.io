import { describe, expect, it } from 'vitest';

import { releaseYear, releaseYearString } from './releaseDate';

describe('releaseYear', () => {
  it('parses the leading four digits as a number', () => {
    expect(releaseYear('2009')).toBe(2009);
    expect(releaseYear('2009-03')).toBe(2009);
    expect(releaseYear('2027-02-14')).toBe(2027);
  });
});

describe('releaseYearString', () => {
  it('returns the year as a string', () => {
    expect(releaseYearString('2009-03')).toBe('2009');
    expect(releaseYearString('2027')).toBe('2027');
  });
});
