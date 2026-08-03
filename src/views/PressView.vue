<script setup lang="ts">
import { useHashScroll } from '@/composables/useHashScroll';
import { usePageHead } from '@/composables/usePageHead';
import { pressQuotes } from '@/data/press';

usePageHead({
  title: 'Press',
  description: 'Press coverage and reviews of Jerome Faria\'s work from The Quietus, Bodyspace, Indie Rock Mag, and more.',
});

const scrollToHash = (hash: string) => {
  const element = document.getElementById(hash.replace('#', ''));
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

useHashScroll(scrollToHash);
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="press"
    >
      <h1 class="visually-hidden">Press</h1>
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
    </article>
  </div>
</template>
