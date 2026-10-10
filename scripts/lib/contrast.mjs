const srgbToLinear = channel => {
  const ratio = channel / 255;
  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
};

const expandHex = hex => {
  const normalized = hex.replace('#', '');
  return normalized.length === 3
    ? normalized.split('').map(character => character + character).join('')
    : normalized;
};

export const relativeLuminance = hex => {
  const full = expandHex(hex);
  const [red, green, blue] = [0, 2, 4].map(offset => parseInt(full.slice(offset, offset + 2), 16));
  return 0.2126 * srgbToLinear(red) + 0.7152 * srgbToLinear(green) + 0.0722 * srgbToLinear(blue);
};

export const contrastRatio = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};
