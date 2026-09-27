<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

import MaybeLink from '@/components/MaybeLink.vue';
import NewsletterFeature from '@/components/NewsletterFeature.vue';
import ResponsivePicture from '@/components/ResponsivePicture.vue';
import type { RenderBlock } from '@/utils/newsletterBlocks';

defineProps<{ block: RenderBlock }>();

const playing = ref(false);

const ctaAttrs = (href: string) =>
  href.startsWith('/') ? { to: href } : { href, target: '_blank', rel: 'noopener noreferrer' };
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

  <blockquote
    v-else-if="block.kind === 'quote'"
    class="newsletter-issue__quote"
  >
    <p v-html="block.quote" />
    <strong>
      <MaybeLink :href="block.url ?? undefined">{{ block.source }}</MaybeLink>
    </strong>
  </blockquote>

  <div
    v-else-if="block.kind === 'cta'"
    class="newsletter-issue__cta-block"
  >
    <component
      :is="block.href.startsWith('/') ? RouterLink : 'a'"
      v-bind="ctaAttrs(block.href)"
      class="newsletter-issue__cta"
    >
      {{ block.label }}
    </component>
  </div>

  <NewsletterFeature
    v-else
    :block="block"
  />
</template>
