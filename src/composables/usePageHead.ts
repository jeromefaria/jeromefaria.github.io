import { useHead } from '@unhead/vue';
import { useRoute } from 'vue-router';

import { siteConfig } from '@/data/navigation';
import { localePath, stripLocale, SUPPORTED_LOCALES } from '@/i18n/messages';

interface UsePageHeadOptions {
  title: string;
  description: string;
  ogType?: string;
  schema?: object | null;
  noIndex?: boolean;
  preloadImage?: string;
  image?: string;
}

export const usePageHead = ({
  title,
  description,
  ogType = 'website',
  schema = null,
  noIndex = false,
  preloadImage,
  image,
}: UsePageHeadOptions): void => {
  const route = useRoute();
  const lang = typeof route.meta?.['locale'] === 'string' ? route.meta['locale'] : 'en';
  const fullTitle = title.includes(siteConfig.title)
    ? title
    : `${title} - ${siteConfig.title}`;

  const canonicalUrl = `${siteConfig.url}${route.path}`;
  const imageUrl = `${siteConfig.url}${image ?? siteConfig.image}`;

  const meta = [
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:site_name', content: siteConfig.title },
    { property: 'og:image', content: imageUrl },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ];

  if (noIndex) {
    meta.push({ name: 'robots', content: 'noindex' });
  }

  const link: Record<string, string>[] = [
    { rel: 'canonical', href: canonicalUrl },
  ];

  const i18nEnabled = import.meta.env.VITE_I18N === 'true';

  if (i18nEnabled && !noIndex) {
    const basePath = stripLocale(route.path);
    const hrefFor = (locale: (typeof SUPPORTED_LOCALES)[number]) => `${siteConfig.url}${localePath(basePath, locale)}`;

    for (const locale of SUPPORTED_LOCALES) {
      link.push({ rel: 'alternate', hreflang: locale, href: hrefFor(locale) });
    }

    link.push({ rel: 'alternate', hreflang: 'x-default', href: hrefFor('en') });
  }

  if (preloadImage) {
    link.push({ rel: 'preload', as: 'image', type: 'image/webp', href: preloadImage, fetchpriority: 'high' });
  }

  useHead({
    htmlAttrs: { lang },
    title: fullTitle,
    meta,
    link,
    ...(schema && {
      script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(schema) }],
    }),
  });
};
