<script setup lang="ts">
import StaticPage from '@/components/StaticPage.vue';
import { useProse } from '@/composables/useProse';
import { useProseClick } from '@/composables/useProseClick';
import { copyrightContent } from '@/data/copyright';
import { pageMeta } from '@/data/pageMeta';
import type { Localized } from '@/i18n/localized';

const renderProse = useProse();
const onProseClick = useProseClick();
const currentYear = new Date().getFullYear();

const renderParagraph = (paragraph: Localized<string>): string =>
  renderProse(paragraph).replace('{year}', String(currentYear));
</script>

<template>
  <StaticPage
    :head="pageMeta.copyright"
    data-page="copyright"
  >
    <div
      class="copyright"
      @click="onProseClick"
    >
      <p
        v-for="(paragraph, index) in copyrightContent.paragraphs"
        :key="index"
        class="copyright__body"
        v-html="renderParagraph(paragraph)"
      />
    </div>
  </StaticPage>
</template>
