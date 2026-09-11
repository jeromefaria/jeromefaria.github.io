import { siteConfig, social } from '@/data/navigation';
import { pressQuotes } from '@/data/press';
import { localize } from '@/i18n/localized';
import { BCP47_LOCALE, DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { SchemaBlogPosting, SchemaContactPage, SchemaProfilePerson, SchemaReviewList } from '@/types/schema';
import type { Essay } from '@/types/writing';

import { stripHtml } from './stripHtml';

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

export const createBlogPostingSchema = (essay: Essay, canonicalUrl: string): SchemaBlogPosting => {
  const person = { '@type': 'Person' as const, name: siteConfig.author.name, url: siteConfig.url };

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: essay.title,
    description: essay.description,
    datePublished: essay.date,
    dateModified: essay.date,
    inLanguage: 'en',
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    author: person,
    publisher: person,
  };
};

export const createPressPageSchema = (locale: Locale = DEFAULT_LOCALE): SchemaReviewList => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Press — ${siteConfig.author.name}`,
  numberOfItems: pressQuotes.length,
  itemListElement: pressQuotes.map((quote, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Review',
      reviewBody: stripHtml(localize(quote.quote, locale)),
      author: { '@type': 'Organization', name: quote.source },
      itemReviewed: { '@type': 'Person', name: siteConfig.author.name },
      ...(quote.url ? { url: quote.url } : {}),
    },
  })),
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
