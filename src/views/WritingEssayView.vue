<script setup lang="ts">
import { marked } from 'marked';
import { useRoute } from 'vue-router';

import StaticPage from '@/components/StaticPage.vue';
import { siteConfig } from '@/data/navigation';
import { essayBySlug } from '@/data/writing';
import { externalizeLinks } from '@/utils/externalizeLinks';

import orchestration from '../../content/writing/orchestration.md?raw';

marked.setOptions({ gfm: true, breaks: true });

const essayContent: Record<string, string> = { orchestration };

const route = useRoute();
const slug = String(route.params['slug']);
const essay = essayBySlug(slug);
const markdown = essayContent[slug];

const canonical = essay ? `${siteConfig.url}/writing/${essay.slug}` : `${siteConfig.url}/writing`;

const head = essay && markdown
  ? {
    title: { en: `${essay.title} — ${siteConfig.author.name}`, pt: `${essay.title} — ${siteConfig.author.name}` },
    description: { en: essay.description, pt: essay.description },
    ogType: 'article',
    image: `/og-writing-${essay.slug}.png`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: essay.title,
      description: essay.description,
      datePublished: essay.date,
      dateModified: essay.date,
      inLanguage: 'en',
      url: canonical,
      mainEntityOfPage: canonical,
      author: { '@type': 'Person', name: siteConfig.author.name, url: siteConfig.url },
      publisher: { '@type': 'Person', name: siteConfig.author.name, url: siteConfig.url },
    },
  }
  : {
    title: { en: `Writing — ${siteConfig.author.name}`, pt: `Writing — ${siteConfig.author.name}` },
    description: { en: 'Essays by Jerome Faria.', pt: 'Essays by Jerome Faria.' },
    noIndex: true,
  };

const essayHtml = markdown ? externalizeLinks(marked.parse(markdown, { async: false })) : '';
</script>

<template>
  <StaticPage
    :head="head"
    data-page="writing"
  >
    <article
      v-if="essayHtml"
      class="writing prose"
      v-html="essayHtml"
    />
    <p v-else>
      This piece could not be found. <RouterLink to="/writing">
        Back to writing
      </RouterLink>.
    </p>
  </StaticPage>
</template>
