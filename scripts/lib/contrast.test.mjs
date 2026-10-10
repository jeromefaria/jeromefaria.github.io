import { describe, expect, it } from 'vitest';

import { contrastRatio, relativeLuminance } from './contrast.mjs';

describe('relativeLuminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(relativeLuminance('#000')).toBeCloseTo(0, 10);
    expect(relativeLuminance('#fff')).toBeCloseTo(1, 10);
  });

  it('expands shorthand hex to the same value as its longhand', () => {
    expect(relativeLuminance('#abc')).toBeCloseTo(relativeLuminance('#aabbcc'), 10);
  });
});

describe('contrastRatio', () => {
  it('returns the maximal 21:1 for black on white', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 5);
  });

  it('returns 1:1 for identical colours', () => {
    expect(contrastRatio('#767676', '#767676')).toBeCloseTo(1, 10);
  });

  it('is symmetric regardless of argument order', () => {
    expect(contrastRatio('#767676', '#fff')).toBeCloseTo(contrastRatio('#fff', '#767676'), 10);
  });

  it.each([
    ['muted grey on white', '#767676', '#fff', 4.54],
    ['link-hover on white', '#595959', '#fff', 7.0],
    ['muted grey on black', '#a3a3a3', '#000', 8.33],
  ])('matches the WCAG ratio for %s', (_label, foreground, background, expected) => {
    expect(contrastRatio(foreground, background)).toBeCloseTo(expected, 1);
  });
});
