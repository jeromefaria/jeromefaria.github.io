import { describe, expect, it } from 'vitest';

import { toLightboxImage, toLightboxVideo } from './lightboxAdapters';

describe('toLightboxImage', () => {
  it('maps required fields and omits absent optionals', () => {
    expect(toLightboxImage({ src: '/a.jpg', alt: 'A' })).toEqual({ type: 'image', src: '/a.jpg', alt: 'A' });
  });

  it('copies optional layout and credit fields when present', () => {
    const photographer = { name: 'Jane', url: 'https://example.com/jane' };

    expect(
      toLightboxImage({ src: '/a.jpg', alt: 'A', position: 'top', scale: 1.2, rotate: 3, photographer }),
    ).toEqual({ type: 'image', src: '/a.jpg', alt: 'A', position: 'top', scale: 1.2, rotate: 3, photographer });
  });
});

describe('toLightboxVideo', () => {
  it('maps required fields and omits an absent author', () => {
    expect(toLightboxVideo({ url: 'https://v', title: 'V', platform: 'youtube' })).toEqual({
      type: 'video',
      url: 'https://v',
      title: 'V',
      platform: 'youtube',
    });
  });

  it('copies the author credit when present', () => {
    const author = { name: 'Studio', url: 'https://example.com/studio' };

    expect(toLightboxVideo({ url: 'https://v', title: 'V', platform: 'vimeo', author })).toEqual({
      type: 'video',
      url: 'https://v',
      title: 'V',
      platform: 'vimeo',
      author,
    });
  });
});
