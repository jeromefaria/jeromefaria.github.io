import type { Photographer } from './media';

export interface AboutImage {
  src: string;
  alt: string;
  position?: string;
  scale?: number;
  rotate?: number;
  photographer?: Photographer;
}

export interface AboutTextSection {
  id: string;
  type?: 'short-bio';
  content: string;
}

export interface AboutImageSection {
  id: string;
  type: 'image-group';
  images: AboutImage[];
}

export type AboutSection = AboutTextSection | AboutImageSection;

export function isImageSection(section: AboutSection): section is AboutImageSection {
  return section.type === 'image-group';
}
