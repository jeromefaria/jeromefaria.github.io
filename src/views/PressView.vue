<script setup lang="ts">
import PageShell from '@/components/PageShell.vue';
import { useHashScroll } from '@/composables/useHashScroll';
import { usePageHead } from '@/composables/usePageHead';
import { pageMeta } from '@/data/pageMeta';
import { pressQuotes } from '@/data/press';

usePageHead(pageMeta.press);

const scrollToHash = (hash: string) => {
  const element = document.getElementById(hash.replace('#', ''));
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

useHashScroll(scrollToHash);
</script>

<template>
  <div class="container-wide">
    <PageShell
      data-page="press"
      title="Press"
    >
      <blockquote
        v-for="item in pressQuotes"
        :id="item.id"
        :key="item.id"
      >
        <p v-html="item.quote" />
        <strong>
          <a
            v-if="item.url"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
          >{{ item.source }}<span class="visually-hidden"> (opens in a new tab)</span></a>
          <template v-else>{{ item.source }}</template>
        </strong>
      </blockquote>
    </PageShell>
  </div>
</template>
