/**
 * Calculates CSS style object for image transformations
 * @param {Object} image - Image object with optional position, scale, rotate properties
 * @returns {Object} CSS style object
 */
export const getImageStyles = (image) => {
  if (!image) return {};

  const styles = {};

  // Object position (e.g., "center top", "50% 25%")
  if (image.position) {
    styles.objectPosition = image.position;
  }

  // CSS transforms (scale and/or rotate)
  if (image.scale || image.rotate) {
    const transforms = [];
    if (image.scale) transforms.push(`scale(${image.scale})`);
    if (image.rotate) transforms.push(`rotate(${image.rotate}deg)`);
    styles.transform = transforms.join(' ');
  }

  return styles;
};
