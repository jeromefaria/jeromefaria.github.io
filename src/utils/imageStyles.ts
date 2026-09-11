import type { CSSProperties } from 'vue';

export interface ImageWithTransforms {
  position?: string;
  scale?: number;
  rotate?: number;
  translateX?: string;
}

export const getImageStyles = (image?: ImageWithTransforms): CSSProperties => {
  if (!image) return {};

  const styles: CSSProperties = {};

  if (image.position) {
    styles.objectPosition = image.position;
  }

  if (image.scale || image.rotate || image.translateX) {
    const transforms: string[] = [];
    if (image.scale) transforms.push(`scale(${image.scale})`);
    if (image.rotate) transforms.push(`rotate(${image.rotate}deg)`);
    if (image.translateX) transforms.push(`translateX(${image.translateX})`);
    styles.transform = transforms.join(' ');
  }

  return styles;
};
