import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { INTER_WEIGHTS } from './inter-weights.mjs';

export const interFontFaces = async root => {
  const face = async weight => {
    const data = (await readFile(join(root, `public/fonts/inter-${weight}.woff2`))).toString('base64');
    return `@font-face{font-family:'Inter';font-style:normal;font-weight:${weight};src:url(data:font/woff2;base64,${data}) format('woff2')}`;
  };

  return (await Promise.all(INTER_WEIGHTS.map(face))).join('');
};
