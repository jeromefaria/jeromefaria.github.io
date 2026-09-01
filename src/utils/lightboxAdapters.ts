import { localize, type Localized } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { LightboxImage, LightboxVideo } from '@/types/lightbox';
import type { Credit, Video } from '@/types/media';

interface LightboxImageSource {
  src: string;
  alt: string | Localized<string>;
  photographer?: Credit;
  artist?: Credit;
}

export const toLightboxImage = (image: LightboxImageSource, locale: Locale = DEFAULT_LOCALE): LightboxImage => {
  const item: LightboxImage = { type: 'image', src: image.src, alt: localize(image.alt, locale) };
  if (image.photographer) item.credit = { role: 'photo', ...image.photographer };
  else if (image.artist) item.credit = { role: 'poster', ...image.artist };
  return item;
};

export const toLightboxVideo = (video: Video, locale: Locale = DEFAULT_LOCALE): LightboxVideo =>
  ({ type: 'video', ...video, title: localize(video.title, locale) });
