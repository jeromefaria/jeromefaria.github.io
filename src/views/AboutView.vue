<script setup>
import { usePageHead } from '@/composables/usePageHead';
import { useImageLoader } from '@/composables/useImageLoader';
import { aboutSections } from '@/data/about';

usePageHead({
  title: 'About',
  description: 'Biography and background of Jerome Faria, Portuguese sound artist and electronic music composer.',
  ogType: 'profile',
});
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="about"
    >
      <template
        v-for="section in aboutSections"
        :key="section.id"
      >
        <!-- Text section -->
        <div
          v-if="!section.type"
          class="prose"
          v-html="section.content"
        />

        <!-- Image divider -->
        <figure
          v-else-if="section.type === 'image'"
          class="about-image"
        >
          <picture>
            <source
              :srcset="section.src.replace('.jpg', '.webp')"
              type="image/webp"
            >
            <img
              :src="section.src"
              :alt="section.alt"
              loading="lazy"
              decoding="async"
            >
          </picture>
        </figure>
      </template>
    </article>
  </div>
</template>
