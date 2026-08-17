import type { LightboxImage, LightboxVideo, Photographer } from '@/types/lightbox';

// Superset of the fields the app's image/video data carry (About/Live/Works),
// so a single adapter serves every call site.
interface LightboxImageSource {
  src: string;
  alt: string;
  photographer?: Photographer;
}

interface LightboxVideoSource {
  url: string;
  title: string;
  platform: 'youtube' | 'vimeo';
  author?: Photographer;
}

/** Map a domain image to a lightbox image item, copying the credit when present. */
export const toLightboxImage = (image: LightboxImageSource): LightboxImage => {
  const item: LightboxImage = { type: 'image', src: image.src, alt: image.alt };
  if (image.photographer) item.photographer = image.photographer;
  return item;
};

export const toLightboxVideo = (video: LightboxVideoSource): LightboxVideo => {
  const item: LightboxVideo = { type: 'video', url: video.url, title: video.title, platform: video.platform };
  if (video.author) item.author = video.author;
  return item;
};
