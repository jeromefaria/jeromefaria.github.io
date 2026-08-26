import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createJiti } from 'jiti';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');

const jiti = createJiti(import.meta.url, { alias: { '@': src } });
const { epkManifest } = await jiti.import(join(src, 'data/epk.ts'));
const { resolveEpkContent, photoDownloadFilename, epkKitBasename } = await jiti.import(join(src, 'utils/epk.ts'));
const { siteConfig, social } = await jiti.import(join(src, 'data/navigation.ts'));

const bandcamp = social.find(item => item.name === 'bandcamp');

export { photoDownloadFilename, siteConfig };
export const content = resolveEpkContent(epkManifest);
export const kitName = epkKitBasename;
export const outDir = join(root, 'public/epk');
export const photosDir = join(outDir, 'photos');
export const mastersDir = join(root, 'assets-source/press');
export const siteUrl = siteConfig.url.replace(/\/$/, '');
export const contact = {
  email: siteConfig.author.email,
  website: siteConfig.url,
  bandcamp: bandcamp?.url,
};
