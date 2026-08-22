import { useHead } from '@unhead/vue'; // Provided by vite-ssg
import { useRoute } from 'vue-router';

import { siteConfig } from '@/data/navigation';

interface UsePageHeadOptions {
  title: string;
  description: string;
  ogType?: string;
  schema?: object | null;
  noIndex?: boolean;
  /** WebP image to preload with high priority (e.g. an above-the-fold hero). */
  preloadImage?: string;
}

/**
 * Composable for setting page head meta tags with consistent patterns
 * @param options - Page head options
 * @param options.title - Page title (will be appended with site title)
 * @param options.description - Page meta description
 * @param options.ogType - Open Graph type (default: 'website')
 * @param options.schema - JSON-LD structured data schema
 * @param options.noIndex - Add robots noindex meta tag
 */
export const usePageHead = ({
  title,
  description,
  ogType = 'website',
  schema = null,
  noIndex = false,
  preloadImage,
}: UsePageHeadOptions): void => {
  const route = useRoute();
  const fullTitle = title.includes(siteConfig.title)
    ? title
    : `${title} - ${siteConfig.title}`;

  const canonicalUrl = `${siteConfig.url}${route.path}`;
  const imageUrl = `${siteConfig.url}${siteConfig.image}`;

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

  if (preloadImage) {
    link.push({ rel: 'preload', as: 'image', type: 'image/webp', href: preloadImage, fetchpriority: 'high' });
  }

  useHead({
    title: fullTitle,
    meta,
    link,
    ...(schema && {
      script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(schema) }],
    }),
  });
};
