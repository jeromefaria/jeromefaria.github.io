<script setup lang="ts">
import StaticPage from '@/components/StaticPage.vue';
import { OG_CARD_DIMENSIONS } from '@/data/navigation';
import { pageMeta } from '@/data/pageMeta';
import { cvPdfHref } from '@/utils/cv';
import { renderMarkdown } from '@/utils/renderMarkdown';

import resumeMarkdown from '../../content/resume.md?raw';

const head = { ...pageMeta.cv, noIndex: true, image: '/og-cv.png', imageDimensions: OG_CARD_DIMENSIONS };
const resumeHtml = renderMarkdown(resumeMarkdown);
</script>

<template>
  <StaticPage
    :head="head"
    data-page="cv"
  >
    <p class="cv__download">
      <a
        class="link-discrete"
        :href="cvPdfHref"
        download
      >Download PDF</a>
    </p>
    <div
      class="cv prose"
      v-html="resumeHtml"
    />
  </StaticPage>
</template>
