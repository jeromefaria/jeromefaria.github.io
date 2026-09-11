<script setup lang="ts">
import { computed } from 'vue';

import { useLightboxDeepLink } from '@/composables/useLightboxDeepLink';
import { type Localizable, localize } from '@/i18n/localized';
import { useLocale } from '@/i18n/useLocale';
import { useT } from '@/i18n/useT';
import type { LightboxItem, LiveEvent, LiveImage, Poster } from '@/types';
import type { LightboxImage } from '@/types/lightbox';
import { externalizeLinks } from '@/utils/externalizeLinks';
import { formatEventDateRange } from '@/utils/formatters';
import { getImageStyles } from '@/utils/imageStyles';
import { toLightboxImage, toLightboxVideo } from '@/utils/lightboxAdapters';
import type { LightboxSource } from '@/utils/lightboxPermalink';
import { buildEventDescription } from '@/utils/liveDescription';
import { liveEventPath } from '@/utils/liveEventPermalink';
import { venuePlace } from '@/utils/venueFormat';
import { venueUrl } from '@/utils/venues';

import ExternalLink from './ExternalLink.vue';
import IconArrow from './IconArrow.vue';
import MaybeLink from './MaybeLink.vue';
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

const venueLocation = computed(() => venuePlace(props.event.venue, current.value));

const venueSeparator = computed(() => (props.event.venue.name && venueLocation.value ? ', ' : ''));

const venueHref = computed(() => props.event.venue.url ?? (props.event.venue.name ? venueUrl(props.event.venue.name) : undefined));

const imageLightboxItems = computed<LightboxItem[]>(() =>
  props.event.images?.map(image =>
    toLightboxImage({ ...image, alt: props.event.imageAlt ?? '' }, current.value)) ?? []);
const posterLightboxItems = computed<LightboxItem[]>(() =>
  props.event.posters?.map(poster => toLightboxImage(poster, current.value)) ?? []);
const videoLightboxItems = computed<LightboxItem[]>(() =>
  props.event.videos?.map(video => toLightboxVideo(video, current.value)) ?? []);
const t = useT();
const imageLabel = computed(() => t(imageLightboxItems.value.length === 1 ? 'media.photo' : 'media.photos'));

const previewKind = computed<'photo' | 'poster'>(() => (imageLightboxItems.value.length ? 'photo' : 'poster'));

const previewImages = computed<LightboxImage[]>(() => {
  const set = imageLightboxItems.value.length ? imageLightboxItems.value : posterLightboxItems.value;
  return set.filter((item): item is LightboxImage => item.type === 'image');
});

const toHeroThumb = (source: LiveImage | Poster, alt: Localizable<string>) => ({
  src: source.src,
  alt: localize(alt, current.value),
  style: getImageStyles(source.thumb),
});

const heroThumb = computed(() => {
  const { images, posters, imageAlt } = props.event;

  const image = images?.find(item => item.cover) ?? images?.[0];
  if (image) return toHeroThumb(image, imageAlt ?? '');

  const poster = posters?.find(item => item.cover) ?? posters?.[0];
  if (poster) return toHeroThumb(poster, poster.alt);

  return undefined;
});

const showThumb = computed(() => Boolean(heroThumb.value));

const eventClass = computed(() => (showThumb.value ? 'event event--column' : 'event event--text-only'));

const openPreview = () =>
  emit('open-lightbox', previewImages.value, 0, { id: props.event.id, kind: previewKind.value });

const mediaLinksProps = computed(() => ({
  images: imageLightboxItems.value,
  posters: posterLightboxItems.value,
  videos: videoLightboxItems.value,
  imageLabel: imageLabel.value,
  sourceId: props.event.id,
}));

useLightboxDeepLink(
  props.event.id,
  { photo: imageLightboxItems, poster: posterLightboxItems, video: videoLightboxItems },
  (items, index, source) => emit('open-lightbox', items, index, source),
);
</script>

<template>
  <article
    :id="event.id"
    :class="eventClass"
  >
    <div class="event-details">
      <p>
        <strong>
          <a
            class="event-title-link"
            :href="toLocalePath(liveEventPath(event.id))"
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
            :aria-label="t('media.view', { label: title })"
          ><IconArrow direction="up-right" /></RouterLink>
        </strong>
      </p>
      <p class="event-meta">
        <span
          v-if="event.date"
          class="event-date"
        >{{ formattedDate }} · </span>
        <span class="event-venue"><MaybeLink
          v-if="event.venue.name"
          :href="venueHref"
        >{{ event.venue.name }}</MaybeLink>{{ venueSeparator }}{{ venueLocation }}</span>
      </p>
      <p
        class="event-description"
        v-html="externalizeLinks(buildEventDescription(event, current))"
      />
      <MediaLinks
        v-if="!showThumb"
        v-bind="mediaLinksProps"
        @open-lightbox="(items, index, source) => emit('open-lightbox', items, index, source)"
      />
    </div>
    <template v-if="showThumb">
      <figure
        class="event-thumb"
        @click="openPreview"
      >
        <img
          :src="heroThumb?.src"
          :alt="heroThumb?.alt"
          :style="heroThumb?.style"
          loading="lazy"
        >
        <span
          v-if="previewImages.length > 1"
          class="event-thumb-count"
          aria-hidden="true"
        >{{ previewImages.length }}</span>
      </figure>
      <MediaLinks
        v-bind="mediaLinksProps"
        @open-lightbox="(items, index, source) => emit('open-lightbox', items, index, source)"
      />
    </template>
  </article>
</template>
