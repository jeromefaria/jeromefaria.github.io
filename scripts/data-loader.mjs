import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createJiti } from 'jiti';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const srcDir = join(root, 'src');

const jiti = createJiti(import.meta.url, { alias: { '@': srcDir } });

export const loadData = relativePath => jiti.import(join(root, relativePath));
export const loadSrc = relativePath => jiti.import(join(srcDir, relativePath));
