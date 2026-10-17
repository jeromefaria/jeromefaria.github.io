import { describe, expect, it } from 'vitest';

import { lineOf } from './text.mjs';

describe('lineOf', () => {
  it('is line 1 for an index at the start', () => {
    expect(lineOf('abc\ndef', 0)).toBe(1);
  });

  it('counts the line the index falls on', () => {
    const text = 'a\nb\nc';
    expect(lineOf(text, 0)).toBe(1);
    expect(lineOf(text, 2)).toBe(2);
    expect(lineOf(text, 4)).toBe(3);
  });

  it('attributes an index on a newline to the line it closes', () => {
    expect(lineOf('a\nb', 1)).toBe(1);
  });
});
