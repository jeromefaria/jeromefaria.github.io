// Lightbox types: the discriminated items rendered in the lightbox.

import type { Photographer, Video } from './media';

export interface LightboxImage {
  type: 'image';
  src: string;
  alt: string;
  photographer?: Photographer;
  artist?: Photographer;
}

export interface LightboxVideo extends Video {
  type: 'video';
}

export type LightboxItem = LightboxImage | LightboxVideo;

export function isLightboxImage(item: LightboxItem): item is LightboxImage {
  return item.type === 'image';
}

export function isLightboxVideo(item: LightboxItem): item is LightboxVideo {
  return item.type === 'video';
}
