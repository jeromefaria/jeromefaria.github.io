<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

import ResponsivePicture from '@/components/ResponsivePicture.vue';
import type { RenderBlock } from '@/utils/newsletterBlocks';

defineProps<{ block: RenderBlock }>();

const playing = ref(false);
</script>

<template>
  <div
    v-if="block.kind === 'prose'"
    class="newsletter-issue__prose prose"
    v-html="block.html"
  />

  <figure
    v-else-if="block.kind === 'image'"
    class="newsletter-issue__figure"
  >
    <p
      v-if="block.label"
      class="newsletter-issue__label"
    >
      {{ block.label }}
    </p>
    <component
      :is="block.href ? 'a' : 'div'"
      v-bind="block.href ? { href: block.href, target: '_blank', rel: 'noopener noreferrer' } : {}"
    >
      <ResponsivePicture
        :src="block.src"
        :alt="block.alt"
      />
    </component>
    <figcaption v-if="block.caption">
      {{ block.caption }}
    </figcaption>
  </figure>

  <figure
    v-else-if="block.kind === 'video'"
    class="newsletter-issue__figure newsletter-issue__video"
  >
    <p
      v-if="block.label"
      class="newsletter-issue__label"
    >
      {{ block.label }}
    </p>

    <div
      v-if="block.embedUrl && playing"
      class="newsletter-issue__embed"
    >
      <iframe
        :src="block.embedUrl"
        :title="block.alt"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        loading="lazy"
      />
    </div>
    <button
      v-else-if="block.embedUrl"
      type="button"
      class="newsletter-issue__play"
      :aria-label="`Play ${block.alt}`"
      @click="playing = true"
    >
      <ResponsivePicture
        :src="block.poster"
        :alt="block.alt"
      />
      <span
        class="newsletter-issue__play-icon"
        aria-hidden="true"
      />
    </button>
    <a
      v-else
      :href="block.href"
      class="newsletter-issue__play"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Watch ${block.alt}`"
    >
      <ResponsivePicture
        :src="block.poster"
        :alt="block.alt"
      />
      <span
        class="newsletter-issue__play-icon"
        aria-hidden="true"
      />
    </a>
    <figcaption v-if="block.caption">
      {{ block.caption }}
    </figcaption>
  </figure>

  <section
    v-else
    class="newsletter-issue__feature"
  >
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
