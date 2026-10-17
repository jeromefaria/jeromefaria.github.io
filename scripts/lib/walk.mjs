import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

export function* walkFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* walkFiles(full);
    } else {
      yield full;
    }
  }
}

export const distRoute = (file, distDir) =>
  `/${relative(distDir, file).replace(/\\/g, '/')}`
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '');
