<script setup lang="ts">
import { RouterLink } from 'vue-router';

import ResponsivePicture from '@/components/ResponsivePicture.vue';
import type { FeatureBlock } from '@/utils/newsletterBlocks';

defineProps<{ block: FeatureBlock }>();
</script>

<template>
  <section class="newsletter-issue__feature">
    <p class="newsletter-issue__label">
      {{ block.label }}
    </p>
    <h2 class="newsletter-issue__title">
      <RouterLink :to="block.url">
        {{ block.title }}
      </RouterLink>
    </h2>

    <RouterLink
      v-if="block.image"
      :to="block.url"
      class="newsletter-issue__cover"
    >
      <ResponsivePicture
        :src="block.image"
        :alt="block.title"
      />
    </RouterLink>

    <dl
      v-if="block.meta.length"
      class="newsletter-issue__meta"
    >
      <div
        v-for="field in block.meta"
        :key="field.label"
      >
        <dt>{{ field.label }}</dt>
        <dd>{{ field.value }}</dd>
      </div>
    </dl>

    <p
      v-if="block.note"
      class="newsletter-issue__note"
    >
      {{ block.note }}
    </p>

    <RouterLink
      :to="block.url"
      class="newsletter-issue__cta"
    >
      {{ block.cta }}
    </RouterLink>
  </section>
</template>
