import { describe, expect, it } from 'vitest';

import { imageDimensions, toWebp } from './responsiveImage';

describe('toWebp', () => {
  it('swaps a trailing .jpg for .webp', () => {
    expect(toWebp('/images/live/eme-2008-001.jpg')).toBe('/images/live/eme-2008-001.webp');
  });

  it('replaces only the extension, not a .jpg earlier in the path', () => {
    expect(toWebp('/images/.jpg-archive/photo.jpg')).toBe('/images/.jpg-archive/photo.webp');
  });

  it('leaves non-jpg sources unchanged', () => {
    expect(toWebp('/images/logo.png')).toBe('/images/logo.png');
    expect(toWebp('/images/hero.webp')).toBe('/images/hero.webp');
  });
});

describe('imageDimensions', () => {
  it('returns positive intrinsic dimensions for a manifest image', () => {
    const dimensions = imageDimensions('/images/1714.jpg');

    expect(dimensions?.width).toBeGreaterThan(0);
    expect(dimensions?.height).toBeGreaterThan(0);
  });

  it('returns null for an image absent from the manifest', () => {
    expect(imageDimensions('/images/not-a-real-image.jpg')).toBeNull();
  });
});
