export interface ImageWithTransforms {
  position?: string;
  scale?: number;
  rotate?: number;
}

export interface ImageStyleObject {
  objectPosition?: string;
  transform?: string;
}

/**
 * Calculates CSS style object for image transformations
 * @param image - Image object with optional position, scale, rotate properties
 * @returns CSS style object
 */
export const getImageStyles = (image?: ImageWithTransforms): ImageStyleObject => {
  if (!image) return {};

  const styles: ImageStyleObject = {};

  // Object position (e.g., "center top", "50% 25%")
  if (image.position) {
    styles.objectPosition = image.position;
  }

  // CSS transforms (scale and/or rotate)
  if (image.scale || image.rotate) {
    const transforms: string[] = [];
    if (image.scale) transforms.push(`scale(${image.scale})`);
    if (image.rotate) transforms.push(`rotate(${image.rotate}deg)`);
    styles.transform = transforms.join(' ');
  }

  return styles;
};
