import manifestData from '@/data/responsiveImages.json';

interface ResponsiveImage {
  widths: number[];
  width: number;
  height: number;
}

const manifest: Record<string, ResponsiveImage> = manifestData;

const RESPONSIVE_DIR = '/images/responsive';

const baseName = (imagePath: string): string =>
  imagePath.replace(/^.*\//, '').replace(/\.[a-z]+$/i, '');

export const toWebp = (imagePath: string): string => imagePath.replace(/\.jpg$/, '.webp');

export const responsiveSrcset = (imagePath: string): string | null => {
  const name = baseName(imagePath);
  const entry = manifest[name];
  if (!entry || entry.widths.length === 0) return null;

  return entry.widths.map(width => `${RESPONSIVE_DIR}/${name}-${width}w.webp ${width}w`).join(', ');
};

export const imageDimensions = (imagePath: string): { width: number; height: number } | null => {
  const entry = manifest[baseName(imagePath)];
  return entry ? { width: entry.width, height: entry.height } : null;
};
