<script setup>
import { usePageHead } from '@/composables/usePageHead';
import { aboutContent } from '@/data/about';

usePageHead({
  title: 'About',
  description: 'Biography and background of Jerome Faria, Portuguese sound artist and electronic music composer.',
  ogType: 'profile'
});
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="about"
    >
      <div
        class="prose"
        v-html="aboutContent"
      />
    </article>
  </div>
</template>
