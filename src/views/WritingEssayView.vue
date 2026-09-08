<script setup lang="ts">
import { marked } from 'marked';
import { useRoute } from 'vue-router';

import StaticPage from '@/components/StaticPage.vue';
import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { siteConfig } from '@/data/navigation';
import { draftSlugs, essayBodyBySlug, essayMetaBySlug } from '@/data/writingContent';
import { releaseForEssay } from '@/utils/essayLinks';
import { externalizeLinks } from '@/utils/externalizeLinks';
import { canPlayRelease, playReleaseAt, releasePath } from '@/utils/releasePermalink';

marked.setOptions({ gfm: true, breaks: true });

const route = useRoute();
const slug = String(route.params['slug']);
const essay = essayMetaBySlug(slug);
const markdown = essayBodyBySlug(slug);
const isDraft = draftSlugs.has(slug);
const release = releaseForEssay(slug);
const listenPath = release ? releasePath(release.id) : undefined;
const playable = release && audioPlayerEnabled.value && canPlayRelease(release.id) ? release : null;

const onListen = (event: MouseEvent): void => {
  if (!playable || event.metaKey || event.ctrlKey) return;

  event.preventDefault();
  playReleaseAt(playable);
};

const canonical = essay ? `${siteConfig.url}/writing/${essay.slug}` : `${siteConfig.url}/writing`;

const head = essay && markdown
  ? {
    title: { en: `${essay.title} — ${siteConfig.author.name}`, pt: `${essay.title} — ${siteConfig.author.name}` },
    description: { en: essay.description, pt: essay.description },
    ogType: 'article',
    image: `/og-writing-${essay.slug}.png`,
    ...(isDraft ? { noIndex: true } : {}),
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

const headingClose = essayHtml.indexOf('</h1>');
const titleHtml = headingClose === -1 ? '' : essayHtml.slice(0, headingClose + '</h1>'.length);
const bodyHtml = headingClose === -1 ? essayHtml : essayHtml.slice(headingClose + '</h1>'.length);
</script>

<template>
  <StaticPage
    :head="head"
    data-page="writing"
  >
    <article
      v-if="essayHtml"
      class="writing prose"
    >
      <div v-html="titleHtml" />
      <a
        v-if="listenPath"
        class="link-discrete writing-listen"
        :href="listenPath"
        @click="onListen"
      >
        Listen <span aria-hidden="true">→</span>
      </a>
      <div v-html="bodyHtml" />
    </article>
    <RouterLink
      v-if="essayHtml"
      class="link-discrete writing-back"
      to="/writing"
    >
      <span aria-hidden="true">←</span> Writing
    </RouterLink>
    <p v-else>
      This piece could not be found. <RouterLink to="/writing">
        Back to writing
      </RouterLink>.
    </p>
  </StaticPage>
</template>
