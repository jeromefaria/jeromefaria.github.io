import { useHead } from '@unhead/vue'; // Provided by vite-ssg
import { useRoute } from 'vue-router';

import { siteConfig } from '@/data/navigation';

interface UsePageHeadOptions {
  title: string;
  description: string;
  ogType?: string;
  schema?: Record<string, unknown> | null;
  includeImage?: boolean;
  noIndex?: boolean;
}

/**
 * Composable for setting page head meta tags with consistent patterns
 * @param options - Page head options
 * @param options.title - Page title (will be appended with site title)
 * @param options.description - Page meta description
 * @param options.ogType - Open Graph type (default: 'website')
 * @param options.schema - JSON-LD structured data schema
 * @param options.includeImage - Include og:image and twitter:image meta tags
 * @param options.noIndex - Add robots noindex meta tag
 */
export const usePageHead = ({
  title,
  description,
  ogType = 'website',
  schema = null,
  includeImage = false,
  noIndex = false,
}: UsePageHeadOptions): void => {
  const route = useRoute();
  const fullTitle = title.includes(siteConfig.title)
    ? title
    : `${title} - ${siteConfig.title}`;

  const canonicalUrl = `${siteConfig.url}${route.path}`;

  const meta = [
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:site_name', content: siteConfig.title },
    { name: 'twitter:card', content: includeImage ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
  ];

  if (includeImage) {
    const imageUrl = `${siteConfig.url}${siteConfig.image}`;
    meta.push(
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:image', content: imageUrl },
    );
  }

  if (noIndex) {
    meta.push({ name: 'robots', content: 'noindex' });
  }

  const link = [
    { rel: 'canonical', href: canonicalUrl },
  ];

  const headConfig: Record<string, unknown> = { title: fullTitle, meta, link };

  if (schema) {
    headConfig['script'] = [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      },
    ];
  }

  useHead(headConfig);
};
