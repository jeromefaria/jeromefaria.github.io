// About page types

export interface AboutImage {
  src: string;
  alt: string;
  position?: string;
  scale?: number;
  rotate?: number;
  photographer?: {
    name: string;
    url?: string;
  };
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

export interface AboutLegacyImageSection {
  id: string;
  type: 'image';
  src: string;
  alt: string;
}

export type AboutSection = AboutTextSection | AboutImageSection | AboutLegacyImageSection;

// Type guard
export function isImageSection(section: AboutSection): section is AboutImageSection {
  return section.type === 'image-group';
}
