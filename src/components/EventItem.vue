<script setup lang="ts">
import { computed } from 'vue';

import { useLightboxDeepLink } from '@/composables/useLightboxDeepLink';
import { localizePlace } from '@/i18n/exonyms';
import { localize } from '@/i18n/localized';
import { useLocale } from '@/i18n/useLocale';
import { useT } from '@/i18n/useT';
import type { LightboxItem, LiveEvent } from '@/types';
import { externalizeLinks } from '@/utils/externalizeLinks';
import { formatEventDateRange } from '@/utils/formatters';
import { toLightboxImage, toLightboxVideo } from '@/utils/lightboxAdapters';
import type { LightboxSource } from '@/utils/lightboxPermalink';
import { buildEventDescription } from '@/utils/liveDescription';

import ExternalLink from './ExternalLink.vue';
import IconArrow from './IconArrow.vue';
import MediaLinks from './MediaLinks.vue';

const props = defineProps<{
  event: LiveEvent;
}>();

const emit = defineEmits<{
  'update-hash': [id: string];
  'open-lightbox': [items: LightboxItem[], index: number, source: LightboxSource];
}>();

const { current, toLocalePath } = useLocale();

const formattedDate = computed(() => formatEventDateRange(props.event.date, props.event.endDate, current.value));

const title = computed(() => localize(props.event.title, current.value));

const titleHref = computed(() => props.event.titleUrl ?? '');

const titleHrefIsExternal = computed(() => /^https?:/i.test(titleHref.value));

const venueLocation = computed(() =>
  [props.event.venue.city, props.event.venue.country]
    .filter((place): place is string => Boolean(place))
    .map(place => localizePlace(place, current.value))
    .join(', '));

const venueSeparator = computed(() => (props.event.venue.name && venueLocation.value ? ', ' : ''));

const imageLightboxItems = computed<LightboxItem[]>(() =>
  props.event.images?.map(image =>
    toLightboxImage({ ...image, alt: props.event.imageAlt ?? '' }, current.value)) ?? []);
const posterLightboxItems = computed<LightboxItem[]>(() =>
  props.event.posters?.map(poster => toLightboxImage(poster, current.value)) ?? []);
const videoLightboxItems = computed<LightboxItem[]>(() =>
  props.event.videos?.map(video => toLightboxVideo(video, current.value)) ?? []);
const t = useT();
const imageLabel = computed(() => t(imageLightboxItems.value.length === 1 ? 'media.photo' : 'media.photos'));

useLightboxDeepLink(
  props.event.id,
  { photo: imageLightboxItems, poster: posterLightboxItems, video: videoLightboxItems },
  (items, index, source) => emit('open-lightbox', items, index, source),
);
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
          >{{ title }}</a>
          <ExternalLink
            v-if="titleHref && titleHrefIsExternal"
            class="event-title-ref"
            :href="titleHref"
            :aria-label="t('common.externalSiteAria', { name: title })"
          ><IconArrow direction="up-right" /></ExternalLink>
          <RouterLink
            v-else-if="titleHref"
            class="event-title-ref"
            :to="toLocalePath(titleHref)"
            :aria-label="`View ${title}`"
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
        v-html="externalizeLinks(buildEventDescription(event, current))"
      />
      <MediaLinks
        :images="imageLightboxItems"
        :posters="posterLightboxItems"
        :videos="videoLightboxItems"
        :image-label="imageLabel"
        :source-id="event.id"
        @open-lightbox="(items, index, source) => emit('open-lightbox', items, index, source)"
      />
    </div>
  </article>
</template>
