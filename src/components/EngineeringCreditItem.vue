<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import { useLocale } from '@/i18n/useLocale';
import type { Release } from '@/types';
import { hasExternalUrl } from '@/types';
import { releasePath } from '@/utils/releasePermalink';

import ExternalLink from './ExternalLink.vue';
import ReleaseMeta from './ReleaseMeta.vue';

const props = defineProps<{ release: Release }>();

const artist = computed(() => (props.release.meta.kind === 'engineering' ? props.release.meta.artist : undefined));

const { toLocalePath } = useLocale();

const external = computed(() => hasExternalUrl(props.release));
const href = computed(() => props.release.externalUrl ?? toLocalePath(releasePath(props.release.worksRef ?? props.release.id)));
</script>

<template>
  <article class="release release--text-only release--credit">
    <div class="release-details">
      <p>
        <strong>
          <template v-if="artist?.url"><a
            :href="artist.url"
            target="_blank"
            rel="noopener noreferrer"
          >{{ artist.name }}</a> — </template>
          <template v-else-if="artist">{{ artist.name }} — </template>
          <ExternalLink
            v-if="external"
            class="release-title-link"
            :href="href"
          >{{ release.title }}</ExternalLink>
          <RouterLink
            v-else
            class="release-title-link"
            :to="href"
          >{{ release.title }}</RouterLink>
        </strong>
      </p>
      <p class="release-meta">
        <ReleaseMeta :meta="release.meta" />
      </p>
    </div>
  </article>
</template>
