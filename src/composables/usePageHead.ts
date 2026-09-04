import { useHead } from '@unhead/vue';
import { useRoute } from 'vue-router';

import { siteConfig } from '@/data/navigation';
import { i18nEnabled } from '@/i18n/flag';
import { localize, type Localized } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale, localeFromMeta, localePath, stripLocale, SUPPORTED_LOCALES } from '@/i18n/messages';

const OG_LOCALE: Record<(typeof SUPPORTED_LOCALES)[number], string> = { en: 'en_GB', pt: 'pt_PT' };

const DEFAULT_IMAGE_META = { width: '2560', height: '1703', type: 'image/jpeg' };

interface UsePageHeadOptions {
  title: string | Localized<string>;
  description: string | Localized<string>;
  ogType?: string;
  schema?: object | null;
  noIndex?: boolean;
  preloadImage?: string;
  preloadImageSrcset?: string;
  image?: string;
}

interface ResolvedHead {
  locale: Locale;
  path: string;
  fullTitle: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string;
  ogType: string;
  noIndex: boolean;
  imageIsDefault: boolean;
  preloadImage: string | undefined;
  preloadImageSrcset: string | undefined;
}

type MetaTag = { name?: string; property?: string; content: string };

const preloadImageLink = (href: string, srcset?: string): Record<string, string> => ({
  rel: 'preload',
  as: 'image',
  type: 'image/webp',
  href,
  ...(srcset ? { imagesrcset: srcset, imagesizes: '100vw' } : {}),
  fetchpriority: 'high',
});

const buildMeta = (head: ResolvedHead): MetaTag[] => {
  const meta: MetaTag[] = [
    { name: 'description', content: head.description },
    { property: 'og:title', content: head.fullTitle },
    { property: 'og:description', content: head.description },
    { property: 'og:type', content: head.ogType },
    { property: 'og:url', content: head.canonicalUrl },
    { property: 'og:site_name', content: siteConfig.title },
    { property: 'og:locale', content: OG_LOCALE[head.locale] },
    { property: 'og:image', content: head.imageUrl },
    { property: 'og:image:alt', content: head.fullTitle },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: head.fullTitle },
    { name: 'twitter:description', content: head.description },
    { name: 'twitter:image', content: head.imageUrl },
    { name: 'twitter:image:alt', content: head.fullTitle },
  ];

  if (head.imageIsDefault) {
    meta.push(
      { property: 'og:image:width', content: DEFAULT_IMAGE_META.width },
      { property: 'og:image:height', content: DEFAULT_IMAGE_META.height },
      { property: 'og:image:type', content: DEFAULT_IMAGE_META.type },
    );
  }

  if (head.noIndex) {
    meta.push({ name: 'robots', content: 'noindex' });
  }

  if (i18nEnabled && !head.noIndex) {
    for (const alternate of SUPPORTED_LOCALES) {
      if (alternate !== head.locale) {
        meta.push({ property: 'og:locale:alternate', content: OG_LOCALE[alternate] });
      }
    }
  }

  return meta;
};

const buildLinks = (head: ResolvedHead): Record<string, string>[] => {
  const link: Record<string, string>[] = [{ rel: 'canonical', href: head.canonicalUrl }];

  if (i18nEnabled && !head.noIndex) {
    const basePath = stripLocale(head.path);
    const hrefFor = (alternate: Locale): string => `${siteConfig.url}${localePath(basePath, alternate)}`;

    for (const alternate of SUPPORTED_LOCALES) {
      link.push({ rel: 'alternate', hreflang: alternate, href: hrefFor(alternate) });
    }

    link.push({ rel: 'alternate', hreflang: 'x-default', href: hrefFor('en') });
  }

  if (head.preloadImage) {
    link.push(preloadImageLink(head.preloadImage, head.preloadImageSrcset));
  }

  return link;
};

export const usePageHead = (options: UsePageHeadOptions): void => {
  const route = useRoute();

  // eslint-disable-next-line local/no-comments -- irreducible locale-switch footgun
  // Must stay a getter, not a resolved object: EN/PT routes reuse the same view component so setup() never re-runs; reading route.meta/path inside the getter is what re-syncs the head on locale switch.
  useHead(() => {
    const locale = route.meta ? localeFromMeta(route.meta) : DEFAULT_LOCALE;
    const resolvedTitle = localize(options.title, locale);
    const description = localize(options.description, locale);
    const fullTitle = resolvedTitle.includes(siteConfig.title)
      ? resolvedTitle
      : `${resolvedTitle} - ${siteConfig.title}`;

    const head: ResolvedHead = {
      locale,
      path: route.path,
      fullTitle,
      description,
      canonicalUrl: `${siteConfig.url}${route.path}`,
      imageUrl: `${siteConfig.url}${options.image ?? siteConfig.image}`,
      ogType: options.ogType ?? 'website',
      noIndex: options.noIndex ?? false,
      imageIsDefault: !options.image,
      preloadImage: options.preloadImage,
      preloadImageSrcset: options.preloadImageSrcset,
    };

    return {
      htmlAttrs: { lang: locale },
      title: fullTitle,
      meta: buildMeta(head),
      link: buildLinks(head),
      ...(options.schema && {
        // eslint-disable-next-line local/no-comments -- security constraint
        // The `<` escape stops a value breaking out of the <script> block; do not remove.
        script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(options.schema).replace(/</g, '\\u003c') }],
      }),
    };
  });
};
