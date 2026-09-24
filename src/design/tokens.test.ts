import { describe, expect, it } from 'vitest';

import { cardColor, color, font, tracking, typeScale, weight } from './tokens';

describe('design tokens', () => {
  it('defines the same palette keys for light and dark', () => {
    const keys = ['bg', 'text', 'secondary', 'muted', 'border', 'borderSubtle', 'link', 'linkHover', 'error'];
    expect(Object.keys(color.light)).toEqual(keys);
    expect(Object.keys(color.dark)).toEqual(keys);
  });

  it('derives the solid-black card colours from the dark theme', () => {
    expect(cardColor.bg).toBe(color.dark.bg);
    expect(cardColor.text).toBe(color.dark.text);
    expect(cardColor.muted).toBe(color.dark.muted);
  });

  it('keeps the over-image greys brighter than dark-muted for legibility', () => {
    expect(cardColor.mutedOnImage).not.toBe(color.dark.muted);
    expect(cardColor.secondaryOnImage).not.toBe(color.dark.muted);
  });

  it('exposes the shared type, tracking, weight, and font scales', () => {
    expect(typeScale.base).toBe('0.875rem');
    expect(tracking.wider).toBe('0.12em');
    expect(weight.semibold).toBe(600);
    expect(font.sans).toContain('Inter');
    expect(font.mono).toContain('monospace');
  });
});
