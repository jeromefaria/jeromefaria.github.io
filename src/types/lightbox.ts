// Lightbox types: the discriminated items rendered in the lightbox.

import type { Credit, Video } from './media';

// A credit whose role names how it's attributed in the lightbox, so the overlay
// reads the role instead of inferring it from which field is populated.
export interface LightboxCredit extends Credit {
  role: 'photo' | 'poster';
}

export interface LightboxImage {
  type: 'image';
  src: string;
  alt: string;
  credit?: LightboxCredit;
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
