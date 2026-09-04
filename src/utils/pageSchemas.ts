import { siteConfig, social } from '@/data/navigation';
import { localize } from '@/i18n/localized';
import { BCP47_LOCALE, DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { SchemaContactPage, SchemaProfilePerson } from '@/types/schema';

export const createPersonSchema = (locale: Locale = DEFAULT_LOCALE): SchemaProfilePerson => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.author.name,
  url: siteConfig.url,
  jobTitle: localize(siteConfig.tagline, locale),
  description: localize(siteConfig.description, locale),
  image: `${siteConfig.url}${siteConfig.image}`,
  sameAs: social.map(link => link.url),
});

export const createContactPageSchema = (locale: Locale = DEFAULT_LOCALE): SchemaContactPage => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  inLanguage: BCP47_LOCALE[locale],
  mainEntity: {
    '@type': 'Person',
    name: siteConfig.author.name,
    email: siteConfig.author.email,
    url: siteConfig.url,
  },
});
