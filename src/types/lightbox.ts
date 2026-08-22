import type { Credit, Video } from './media';

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
