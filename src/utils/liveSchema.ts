import { liveYears, sortedLiveData } from '@/data/live';
import { siteConfig } from '@/data/navigation';
import { localize } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import { createTranslate } from '@/i18n/useT';
import type { LiveEvent } from '@/types';
import type { SchemaBreadcrumbList, SchemaItemList, SchemaMusicEvent } from '@/types/schema';

import { createBreadcrumbSchema } from './pageSchemas';
import { createItemListSchema, createMusicEventSchema } from './schemaHelpers';

type SchemaLiveEvent = SchemaMusicEvent & { '@context': string; mainEntityOfPage: string };

export const createLiveEventSchema = (
  event: LiveEvent,
  locale: Locale,
  canonicalUrl: string,
): SchemaLiveEvent => ({
  '@context': 'https://schema.org',
  ...createMusicEventSchema(event, siteConfig.author.name, event.date, locale, siteConfig.url),
  mainEntityOfPage: canonicalUrl,
});

export const createLiveEventBreadcrumbSchema = (
  event: LiveEvent,
  locale: Locale,
  canonicalUrl: string,
): SchemaBreadcrumbList =>
  createBreadcrumbSchema([
    { name: createTranslate(locale)('nav.live'), url: `${siteConfig.url}/live` },
    { name: localize(event.title, locale), url: canonicalUrl },
  ]);

export const createLiveEventsSchema = (locale: Locale = DEFAULT_LOCALE): SchemaItemList => {
  const events = liveYears.flatMap(year => {
    const yearData = sortedLiveData[year];
    return (yearData?.items ?? []).map(event =>
      createMusicEventSchema(event, siteConfig.author.name, `${year}-01-01`, locale, siteConfig.url));
  });

  const listText = {
    en: {
      name: `${siteConfig.author.name} Live Performances`,
      description: 'Live performance history from 2005 to present',
    },
    pt: {
      name: `Actuações de ${siteConfig.author.name}`,
      description: 'Histórico de actuações de 2005 até ao presente',
    },
  };

  return createItemListSchema(events, listText[locale].name, listText[locale].description);
};
