const IMG_TAG = /<img\b[^>]*>/gi;

const srcOf = tag => tag.match(/\bsrc\s*=\s*"([^"]*)"/i)?.[1] ?? '';
const altOf = tag => tag.match(/\balt\s*=\s*"([^"]*)"/i)?.[1] ?? '';

export const extractPageImages = html => {
  const seen = new Set();
  const images = [];

  for (const [tag] of String(html).matchAll(IMG_TAG)) {
    const src = srcOf(tag).trim();
    const alt = altOf(tag).trim();

    if (!src || !alt) continue;
    if (!src.startsWith('/') || src.startsWith('//')) continue;
    if (seen.has(src)) continue;

    seen.add(src);
    images.push(src);
  }

  return images;
};
