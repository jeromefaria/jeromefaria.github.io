import type { Localizable, Localized } from '@/i18n/localized';

import type { CreditRef } from './media';

export interface AboutImage {
  src: string;
  alt: Localizable<string>;
  position?: string;
  scale?: number;
  rotate?: number;
  photographer?: CreditRef;
}

export interface AboutTextSection {
  id: string;
  type?: 'short-bio';
  content: Localized<string>;
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
