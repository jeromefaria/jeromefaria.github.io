import { join } from 'node:path';

import { loadSrc, root } from './data-loader.mjs';

const { epkManifest } = await loadSrc('data/epk.ts');
const { resolveEpkContent, photoDownloadFilename, epkKitFile, epkRiderFile, localeSuffix } = await loadSrc('utils/epk.ts');
const { techRider } = await loadSrc('data/techRider.ts');
const { localize } = await loadSrc('i18n/localized.ts');
const { SUPPORTED_LOCALES, localePath, messages } = await loadSrc('i18n/messages.ts');
const { siteConfig, social } = await loadSrc('data/navigation.ts');

const bandcamp = social.find(item => item.name === 'bandcamp');

export { epkKitFile, epkRiderFile, localePath, localeSuffix, localize, photoDownloadFilename, root, siteConfig, techRider };

export const locales = SUPPORTED_LOCALES;
export const contentFor = locale => resolveEpkContent(epkManifest, locale);
export const photos = epkManifest.photos;
export const outDir = join(root, 'public/epk');
export const photosDir = join(outDir, 'photos');
export const mastersDir = join(root, 'assets-source/press');
export const siteUrl = siteConfig.url.replace(/\/$/, '');
export const contact = {
  email: siteConfig.author.email,
  website: siteConfig.url,
  bandcamp: bandcamp?.url,
};

const pdfOnlyChrome = {
  en: {
    riderLabel: 'Technical Rider',
    updated: 'Updated',
    inputHeaders: ['Input', 'Format', 'Notes'],
    riderFooter: 'Technical questions ahead of a booking',
    creditsTitle: 'Jerome Faria — press kit',
    creditsCopyright: name => `Site content © ${name}. Photographs remain the property of their authors.`,
  },
  pt: {
    riderLabel: 'Rider técnico',
    updated: 'Actualizado em',
    inputHeaders: ['Canal', 'Formato', 'Notas'],
    riderFooter: 'Questões técnicas antes de uma marcação',
    creditsTitle: 'Jerome Faria — dossier de imprensa',
    creditsCopyright: name => `Conteúdo do site © ${name}. As fotografias permanecem propriedade dos respectivos autores.`,
  },
};

export const pdfChrome = Object.fromEntries(
  locales.map(locale => [locale, {
    selectedPerformances: messages[locale].epk.selectedPerformances,
    selectedWorks: messages[locale].epk.selectedWorks,
    press: messages[locale].epk.press,
    creditsPhotography: `${messages[locale].epk.photography}:`,
    ...pdfOnlyChrome[locale],
  }]),
);
