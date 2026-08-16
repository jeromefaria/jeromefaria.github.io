import manifestData from '@/data/responsiveImages.json';

// Map of image base-name → the responsive widths generated for it at build time
// (see scripts/generate-responsive-images.mjs).
const manifest: Record<string, number[]> = manifestData;

const RESPONSIVE_DIR = '/images/responsive';

const baseName = (imagePath: string): string =>
  imagePath.replace(/^.*\//, '').replace(/\.[a-z]+$/i, '');

/** Swap a `.jpg` source for its `.webp` sibling, anchored to the extension. */
export const toWebp = (imagePath: string): string => imagePath.replace(/\.jpg$/, '.webp');

/**
 * Builds a WebP `srcset` from an image's pre-generated responsive widths, or
 * null when it has none — in which case callers fall back to the full-resolution
 * source. Pair with a component-specific `sizes` attribute.
 */
export const responsiveSrcset = (imagePath: string): string | null => {
  const name = baseName(imagePath);
  const widths = manifest[name];
  if (!widths || widths.length === 0) return null;

  return widths.map(width => `${RESPONSIVE_DIR}/${name}-${width}w.webp ${width}w`).join(', ');
};
