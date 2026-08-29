<script setup lang="ts">
import { computed } from 'vue';

import type { LightboxItem, LiveEvent } from '@/types';
import { externalizeLinks } from '@/utils/externalizeLinks';
import { formatEventDateRange } from '@/utils/formatters';
import { toLightboxImage, toLightboxVideo } from '@/utils/lightboxAdapters';
import { buildEventDescription } from '@/utils/liveDescription';
import { pluralize } from '@/utils/pluralize';

import ExternalLink from './ExternalLink.vue';
import IconArrow from './IconArrow.vue';
import MediaLinks from './MediaLinks.vue';

const props = defineProps<{
  event: LiveEvent;
}>();

const emit = defineEmits<{
  'update-hash': [id: string];
  'open-lightbox': [items: LightboxItem[], index: number];
}>();

const formattedDate = computed(() => formatEventDateRange(props.event.date, props.event.endDate));

const titleHref = computed(() => props.event.titleUrl ?? null);

const titleHrefIsExternal = computed(() => /^https?:/i.test(titleHref.value ?? ''));

const venueLocation = computed(() =>
  [props.event.venue.city, props.event.venue.country].filter(Boolean).join(', '));

const venueSeparator = computed(() => (props.event.venue.name && venueLocation.value ? ', ' : ''));

const imageLightboxItems = computed<LightboxItem[]>(() =>
  props.event.images?.map(image =>
    toLightboxImage({ ...image, alt: props.event.imageAlt ?? '' })) ?? []);
const posterLightboxItems = computed<LightboxItem[]>(() => props.event.posters?.map(toLightboxImage) ?? []);
const videoLightboxItems = computed<LightboxItem[]>(() => props.event.videos?.map(toLightboxVideo) ?? []);
const imageLabel = computed(() => pluralize(imageLightboxItems.value.length, 'Photo'));
</script>

<template>
  <article
    :id="event.id"
    class="event event--text-only"
  >
    <div class="event-details">
      <p>
        <strong>
          <a
            class="event-title-link"
            :href="`#${event.id}`"
            @click.prevent="emit('update-hash', event.id)"
          >{{ event.title }}</a>
          <ExternalLink
            v-if="titleHref && titleHrefIsExternal"
            class="event-title-ref"
            :href="titleHref"
            :aria-label="`${event.title} website (opens in a new tab)`"
          ><IconArrow direction="up-right" /></ExternalLink>
          <RouterLink
            v-else-if="titleHref"
            class="event-title-ref"
            :to="titleHref"
            :aria-label="`View ${event.title}`"
          ><IconArrow direction="up-right" /></RouterLink>
        </strong>
      </p>
      <p class="event-meta">
        <span
          v-if="event.date"
          class="event-date"
        >{{ formattedDate }} · </span>
        <span class="event-venue"><a
          v-if="event.venue.name && event.venue.url"
          :href="event.venue.url"
        >{{ event.venue.name }}</a><template v-else-if="event.venue.name">{{ event.venue.name }}</template>{{ venueSeparator }}{{ venueLocation }}</span>
      </p>
      <p
        class="event-description"
        v-html="externalizeLinks(buildEventDescription(event))"
      />
      <MediaLinks
        :images="imageLightboxItems"
        :posters="posterLightboxItems"
        :videos="videoLightboxItems"
        :image-label="imageLabel"
        @open-lightbox="(items, index) => emit('open-lightbox', items, index)"
      />
    </div>
  </article>
</template>
