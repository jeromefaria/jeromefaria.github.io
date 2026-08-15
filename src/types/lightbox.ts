// Lightbox types with discriminated unions for Image and Video

// A credited contributor (name + optional link). Shared by photo credits
// (photographer) and video credits (author).
export interface Photographer {
  name: string;
  url?: string;
}

export interface LightboxImage {
  type: 'image';
  src: string;
  alt: string;
  position?: string;
  scale?: number;
  rotate?: number;
  photographer?: Photographer;
}

export interface LightboxVideo {
  type: 'video';
  url: string;
  title: string;
  platform: 'youtube' | 'vimeo';
  author?: Photographer;
}

export type LightboxItem = LightboxImage | LightboxVideo;

// Type guards for discriminated unions
export function isLightboxImage(item: LightboxItem): item is LightboxImage {
  return item.type === 'image';
}

export function isLightboxVideo(item: LightboxItem): item is LightboxVideo {
  return item.type === 'video';
}
