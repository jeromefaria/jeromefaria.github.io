import manifestData from '@/data/responsiveImages.json';

const manifest: Record<string, number[]> = manifestData;

const RESPONSIVE_DIR = '/images/responsive';

const baseName = (imagePath: string): string =>
  imagePath.replace(/^.*\//, '').replace(/\.[a-z]+$/i, '');

export const toWebp = (imagePath: string): string => imagePath.replace(/\.jpg$/, '.webp');

export const responsiveSrcset = (imagePath: string): string | null => {
  const name = baseName(imagePath);
  const widths = manifest[name];
  if (!widths || widths.length === 0) return null;

  return widths.map(width => `${RESPONSIVE_DIR}/${name}-${width}w.webp ${width}w`).join(', ');
};
