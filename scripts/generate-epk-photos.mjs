// Local-only: reads the gitignored masters in assets-source/press/, so CI can't run it. Commit the output.
import { mkdir, rm } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { exiftool } from 'exiftool-vendored';
import sharp from 'sharp';

import { content, mastersDir, photoDownloadFilename, photosDir } from './epk-context.mjs';

await rm(photosDir, { recursive: true, force: true });
await mkdir(photosDir, { recursive: true });

for (const [index, photo] of content.photos.entries()) {
  const outPath = join(photosDir, photoDownloadFilename(photo, index));

  await sharp(join(mastersDir, basename(photo.src)))
    .rotate()
    .resize({ width: 3000, height: 3000, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toFile(outPath);

  if (photo.photographer) {
    const name = photo.photographer.name;
    await exiftool.write(outPath, {
      'EXIF:Artist': name,
      'XMP:Creator': name,
      'IPTC:By-line': name,
      'IPTC:Credit': name,
      'EXIF:Copyright': `© ${name}`,
      'XMP:Rights': `© ${name}`,
      'IPTC:CopyrightNotice': `© ${name}`,
    }, { writeArgs: ['-overwrite_original'] });
  }
}

await exiftool.end();
console.log(`EPK photos: ${content.photos.length} → public/epk/photos/`);
