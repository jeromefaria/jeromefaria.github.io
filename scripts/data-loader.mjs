import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createJiti } from 'jiti';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const jiti = createJiti(import.meta.url, { alias: { '@': join(root, 'src') } });

export const loadData = relativePath => jiti.import(join(root, relativePath));
