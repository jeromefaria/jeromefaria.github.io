<script setup lang="ts">
import { computed } from 'vue';

import type { LightboxItem, LiveEvent } from '@/types';
import { externalizeLinks } from '@/utils/externalizeLinks';
import { formatEventDate, stripHtml } from '@/utils/formatters';
import { toLightboxImage, toLightboxVideo } from '@/utils/lightboxAdapters';

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

const formattedDate = computed(() => formatEventDate(props.event.date));

// Some event titles embed a link (festival site or an internal /works ref).
// Render the title as plain text (the deep-link permalink) and surface the
// embedded link separately as a trailing icon, avoiding invalid nested anchors.
const titleText = computed(() => stripHtml(props.event.title));

const titleHref = computed(() => {
  const match = props.event.title.match(/href="([^"]+)"/);
  return match ? match[1] : null;
});

const titleHrefIsExternal = computed(() => /^https?:/i.test(titleHref.value ?? ''));

// City + country suffix for the venue line (either may be absent for a TBC venue).
const venueLocation = computed(() =>
  [props.event.venue.city, props.event.venue.country].filter(Boolean).join(', '));

const imageLightboxItems = computed<LightboxItem[]>(() =>
  props.event.images?.map(image =>
    toLightboxImage({ ...image, alt: image.alt ?? props.event.imageAlt ?? '' })) ?? []);
const posterLightboxItems = computed<LightboxItem[]>(() => props.event.posters?.map(toLightboxImage) ?? []);
const videoLightboxItems = computed<LightboxItem[]>(() => props.event.videos?.map(toLightboxVideo) ?? []);
const imageLabel = computed(() => (imageLightboxItems.value.length === 1 ? 'Photo' : 'Photos'));
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
          >{{ titleText }}</a>
          <ExternalLink
            v-if="titleHref && titleHrefIsExternal"
            class="event-title-ref"
            :href="titleHref"
            :aria-label="`${titleText} website (opens in a new tab)`"
          ><IconArrow direction="up-right" /></ExternalLink>
          <RouterLink
            v-else-if="titleHref"
            class="event-title-ref"
            :to="titleHref"
            :aria-label="`View ${titleText}`"
          ><IconArrow direction="up-right" /></RouterLink>
        </strong>
      </p>
      <p class="event-meta">
        <span
          v-if="event.date"
          class="event-date"
        >{{ formattedDate }} · </span>
        <span class="event-venue"><template v-if="event.venue.name"><a
          v-if="event.venue.url"
          :href="event.venue.url"
        >{{ event.venue.name }}</a><template v-else>{{ event.venue.name }}</template><template v-if="venueLocation">, </template></template>{{ venueLocation }}</span>
      </p>
      <p
        v-if="event.description"
        class="event-description"
        v-html="externalizeLinks(event.description)"
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
