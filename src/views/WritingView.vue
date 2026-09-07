<script setup lang="ts">
import StaticPage from '@/components/StaticPage.vue';
import { pageMeta } from '@/data/pageMeta';
import { draftSlugs, listedEssays } from '@/data/writingContent';

const head = pageMeta.writing;

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
</script>

<template>
  <StaticPage
    :head="head"
    data-page="writing"
  >
    <ul class="writing-index">
      <li
        v-for="essay in listedEssays"
        :key="essay.slug"
        class="writing-index__item"
      >
        <RouterLink
          :to="`/writing/${essay.slug}`"
          class="writing-index__link"
        >
          <h2 class="writing-index__title">
            <span class="writing-index__title-text">{{ essay.title }}</span>
            <span
              v-if="draftSlugs.has(essay.slug)"
              class="writing-index__draft"
            >Draft</span>
          </h2>
          <p class="writing-index__tagline">
            {{ essay.tagline }}
          </p>
          <time
            v-if="essay.date"
            class="writing-index__date"
            :datetime="essay.date"
          >{{ formatDate(essay.date) }}</time>
        </RouterLink>
      </li>
    </ul>
  </StaticPage>
</template>
