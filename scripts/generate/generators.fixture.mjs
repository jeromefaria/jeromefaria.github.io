export const FAKE_ROOT = '/fake-root';

export const localize = (value, locale) =>
  value && typeof value === 'object' && !Array.isArray(value) && locale in value ? value[locale] : value;

const suffix = locale => (locale === 'pt' ? '-pt' : '');

const epkContextBase = {
  'data/epk.ts': { epkManifest: { photos: [] } },
  'utils/epk.ts': {
    resolveEpkContent: () => ({
      longBio: '<p>Bio</p>',
      quotes: [],
      liveHighlights: [],
      workHighlights: [],
      photos: [],
      sharedStages: [{ name: 'William Basinski', url: 'https://williambasinski.com' }, { name: 'Taylor Deupree' }],
    }),
    epkKitFile: locale => `jerome-faria-press-kit${suffix(locale)}`,
    epkRiderFile: locale => `jerome-faria-tech-rider${suffix(locale)}`,
    epkDossierFile: locale => `jerome-faria-biography-timeline${suffix(locale)}`,
    localeSuffix: suffix,
    photoDownloadFilename: () => '',
  },
  'data/techRider.ts': { techRider: {} },
  'i18n/localized.ts': { localize },
  'i18n/messages.ts': {
    SUPPORTED_LOCALES: ['en', 'pt'],
    localePath: (path, locale) => (locale === 'en' ? path : `/${locale}${path}`),
    messages: {
      en: { epk: { selectedPerformances: 'Selected performances', selectedWorks: 'Selected works', sharedStages: 'Shared stages with', press: 'Selected press', photography: 'Photography' } },
      pt: { epk: { selectedPerformances: 'Actuações seleccionadas', selectedWorks: 'Obras seleccionadas', sharedStages: 'Partilhou palco com', press: 'Imprensa seleccionada', photography: 'Fotografia' } },
    },
  },
  'data/navigation.ts': {
    siteConfig: { tagline: { en: 'Sound Artist & Composer', pt: 'Artista Sonoro e Compositor' }, url: 'https://jeromefaria.com/', author: { name: 'Jerome Faria' } },
  },
};

export const makeLoadSrc = (overrides = {}) => async path => overrides[path] ?? epkContextBase[path] ?? {};
