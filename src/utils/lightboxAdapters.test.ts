import { describe, expect, it } from 'vitest';

import { toLightboxImage, toLightboxVideo } from './lightboxAdapters';

describe('toLightboxImage', () => {
  it('maps required fields and omits absent optionals', () => {
    expect(toLightboxImage({ src: '/a.jpg', alt: 'A' })).toEqual({ type: 'image', src: '/a.jpg', alt: 'A' });
  });

  it('copies the photographer credit when present', () => {
    const photographer = { name: 'Jane', url: 'https://example.com/jane' };

    expect(
      toLightboxImage({ src: '/a.jpg', alt: 'A', photographer }),
    ).toEqual({ type: 'image', src: '/a.jpg', alt: 'A', photographer });
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
