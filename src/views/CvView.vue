<script setup lang="ts">
import { marked } from 'marked';

import StaticPage from '@/components/StaticPage.vue';
import { pageMeta } from '@/data/pageMeta';
import { externalizeLinks } from '@/utils/externalizeLinks';

import resumeMarkdown from '../../content/resume.md?raw';

marked.setOptions({ gfm: true, breaks: true });

const head = { ...pageMeta.cv, noIndex: true };
const resumeHtml = externalizeLinks(marked.parse(resumeMarkdown, { async: false }));
</script>

<template>
  <StaticPage
    :head="head"
    data-page="cv"
  >
    <p class="cv__download">
      <a
        class="link-discrete"
        href="/jerome-faria-cv.pdf"
        download
      >Download PDF</a>
    </p>
    <div
      class="cv prose"
      v-html="resumeHtml"
    />
  </StaticPage>
</template>
