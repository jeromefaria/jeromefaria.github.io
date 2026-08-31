import { useHead } from '@unhead/vue';
import { useRoute } from 'vue-router';

import { siteConfig } from '@/data/navigation';
import { localize, type Localized } from '@/i18n/localized';
import { DEFAULT_LOCALE, localeFromMeta, localePath, stripLocale, SUPPORTED_LOCALES } from '@/i18n/messages';

interface UsePageHeadOptions {
  title: string | Localized<string>;
  description: string | Localized<string>;
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
  const locale = route.meta ? localeFromMeta(route.meta) : DEFAULT_LOCALE;
  const resolvedTitle = localize(title, locale);
  const resolvedDescription = localize(description, locale);
  const fullTitle = resolvedTitle.includes(siteConfig.title)
    ? resolvedTitle
    : `${resolvedTitle} - ${siteConfig.title}`;

  const canonicalUrl = `${siteConfig.url}${route.path}`;
  const imageUrl = `${siteConfig.url}${image ?? siteConfig.image}`;

  const meta = [
    { name: 'description', content: resolvedDescription },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: resolvedDescription },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:site_name', content: siteConfig.title },
    { property: 'og:image', content: imageUrl },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: resolvedDescription },
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
    const hrefFor = (alternate: (typeof SUPPORTED_LOCALES)[number]) => `${siteConfig.url}${localePath(basePath, alternate)}`;

    for (const alternate of SUPPORTED_LOCALES) {
      link.push({ rel: 'alternate', hreflang: alternate, href: hrefFor(alternate) });
    }

    link.push({ rel: 'alternate', hreflang: 'x-default', href: hrefFor('en') });
  }

  if (preloadImage) {
    link.push({ rel: 'preload', as: 'image', type: 'image/webp', href: preloadImage, fetchpriority: 'high' });
  }

  useHead({
    htmlAttrs: { lang: locale },
    title: fullTitle,
    meta,
    link,
    ...(schema && {
      script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(schema) }],
    }),
  });
};
