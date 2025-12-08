<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePageHead } from '@/composables/usePageHead';
import { pressQuotes } from '@/data/press';

usePageHead({
  title: 'Press',
  description: 'Press coverage and reviews of Jerome Faria\'s work from The Quietus, Bodyspace, Indie Rock Mag, and more.',
});

const route = useRoute();
let isInitialLoad = true;

const scrollToHash = hash => {
  if (!hash) return;
  const element = document.getElementById(hash.replace('#', ''));
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

onMounted(() => {
  isInitialLoad = false;
});

watch(() => route.hash, hash => {
  if (!isInitialLoad && hash) {
    scrollToHash(hash);
  }
});
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="press"
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
          >{{ item.source }}</a>
          <template v-else>{{ item.source }}</template>
        </strong>
      </blockquote>
    </article>
  </div>
</template>
