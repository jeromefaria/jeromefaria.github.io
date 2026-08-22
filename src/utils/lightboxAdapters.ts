import type { LightboxImage, LightboxVideo } from '@/types/lightbox';
import type { Credit, Video } from '@/types/media';

interface LightboxImageSource {
  src: string;
  alt: string;
  photographer?: Credit;
  artist?: Credit;
}

export const toLightboxImage = (image: LightboxImageSource): LightboxImage => {
  const item: LightboxImage = { type: 'image', src: image.src, alt: image.alt };
  if (image.photographer) item.credit = { role: 'photo', ...image.photographer };
  else if (image.artist) item.credit = { role: 'poster', ...image.artist };
  return item;
};

export const toLightboxVideo = (video: Video): LightboxVideo => ({ type: 'video', ...video });
