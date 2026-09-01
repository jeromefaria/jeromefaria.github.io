import { describe, expect, it } from 'vitest';

import { toLightboxImage, toLightboxVideo } from './lightboxAdapters';

describe('toLightboxImage', () => {
  it('maps required fields and omits absent optionals', () => {
    expect(toLightboxImage({ src: '/a.jpg', alt: 'A' })).toEqual({ type: 'image', src: '/a.jpg', alt: 'A' });
  });

  it('tags a photographer as a photo-role credit', () => {
    const photographer = { name: 'Jane', url: 'https://example.com/jane' };

    expect(
      toLightboxImage({ src: '/a.jpg', alt: 'A', photographer }),
    ).toEqual({ type: 'image', src: '/a.jpg', alt: 'A', credit: { role: 'photo', ...photographer } });
  });

  it('tags an artist as a poster-role credit', () => {
    const artist = { name: 'André Lemos', url: 'https://example.com/andre' };

    expect(
      toLightboxImage({ src: '/poster.jpg', alt: 'Poster', artist }),
    ).toEqual({ type: 'image', src: '/poster.jpg', alt: 'Poster', credit: { role: 'poster', ...artist } });
  });

  it('resolves a Localized alt to the requested locale', () => {
    const image = { src: '/a.jpg', alt: { en: 'Performing at X', pt: 'A actuar em X' } };

    expect(toLightboxImage(image, 'en').alt).toBe('Performing at X');
    expect(toLightboxImage(image, 'pt').alt).toBe('A actuar em X');
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

  it('resolves a Localized title to the requested locale', () => {
    const video = { url: 'https://v', title: { en: 'Live at X', pt: 'Ao vivo em X' }, platform: 'youtube' as const };

    expect(toLightboxVideo(video, 'en').title).toBe('Live at X');
    expect(toLightboxVideo(video, 'pt').title).toBe('Ao vivo em X');
  });
});
