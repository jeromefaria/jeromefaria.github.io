import { describe, expect, it } from 'vitest';

import { extractPageImages } from './images.mjs';

describe('extractPageImages', () => {
  it('collects site-rooted image sources that carry alt text', () => {
    const html = '<img src="/images/a.jpg" alt="A performance"><img src="/images/b.webp" alt="Another">';
    expect(extractPageImages(html)).toEqual(['/images/a.jpg', '/images/b.webp']);
  });

  it('skips decorative images with an empty alt', () => {
    const html = '<img src="/images/art.jpg" alt=""><img src="/images/real.jpg" alt="Real">';
    expect(extractPageImages(html)).toEqual(['/images/real.jpg']);
  });

  it('ignores external, protocol-relative, and data sources', () => {
    const html = [
      '<img src="https://cdn.example.com/x.jpg" alt="External">',
      '<img src="//cdn.example.com/y.jpg" alt="Protocol relative">',
      '<img src="data:image/png;base64,AAAA" alt="Inline">',
      '<img src="/images/keep.jpg" alt="Local">',
    ].join('');
    expect(extractPageImages(html)).toEqual(['/images/keep.jpg']);
  });

  it('deduplicates repeated sources, preserving first order', () => {
    const html = '<img src="/images/a.jpg" alt="First"><img src="/images/a.jpg" alt="Repeat">';
    expect(extractPageImages(html)).toEqual(['/images/a.jpg']);
  });

  it('reads src and alt regardless of attribute order', () => {
    const html = '<img alt="Alt first" loading="lazy" src="/images/c.jpg">';
    expect(extractPageImages(html)).toEqual(['/images/c.jpg']);
  });

  it('returns an empty array when there are no qualifying images', () => {
    expect(extractPageImages('<p>no images</p>')).toEqual([]);
    expect(extractPageImages()).toEqual([]);
  });
});
