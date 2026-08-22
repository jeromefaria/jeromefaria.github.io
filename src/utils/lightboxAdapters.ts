import type { LightboxImage, LightboxVideo } from '@/types/lightbox';
import type { Credit, Video } from '@/types/media';

// The app's image data carries either a photographer (photos) or an artist
// (posters); this superset lets one adapter serve every call site.
interface LightboxImageSource {
  src: string;
  alt: string;
  photographer?: Credit;
  artist?: Credit;
}

/** Map a domain image to a lightbox item, tagging its credit with a role. */
export const toLightboxImage = (image: LightboxImageSource): LightboxImage => {
  const item: LightboxImage = { type: 'image', src: image.src, alt: image.alt };
  if (image.photographer) item.credit = { role: 'photo', ...image.photographer };
  else if (image.artist) item.credit = { role: 'poster', ...image.artist };
  return item;
};

export const toLightboxVideo = (video: Video): LightboxVideo => ({ type: 'video', ...video });
