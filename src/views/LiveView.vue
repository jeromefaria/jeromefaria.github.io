<script setup>
import { ref, computed } from 'vue';
import AccordionSection from '@/components/AccordionSection.vue';
import { useAccordion } from '@/composables/useAccordion';
import { useLightbox } from '@/composables/useLightbox';
import { usePageHead } from '@/composables/usePageHead';
import { liveData, liveYears } from '@/data/live';
import { siteConfig } from '@/data/navigation';
import { parseVenue, stripHtml } from '@/utils/formatters';

const eventSchemas = liveYears.flatMap(year =>
  (liveData[year]?.events || []).map(event => {
    const venue = parseVenue(event.venue);
    return {
      '@type': 'MusicEvent',
      name: stripHtml(event.title),
      startDate: year,
      location: {
        '@type': 'Place',
        name: venue.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: venue.addressLocality,
          addressCountry: venue.addressCountry,
        },
      },
      performer: {
        '@type': 'Person',
        name: siteConfig.author.name,
      },
    };
  }),
);

const eventsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `${siteConfig.author.name} Live Performances`,
  description: 'Live performance history from 2005 to present',
  numberOfItems: eventSchemas.length,
  itemListElement: eventSchemas.map((event, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: event,
  })),
};

usePageHead({
  title: 'Live',
  description: 'Live performance history of Jerome Faria from 2005 to present, including festivals, concerts, and collaborations.',
  schema: eventsSchema,
});

const findYearForEvent = eventId =>
  liveYears.find(year =>
    liveData[year]?.events?.some(e => e.id === eventId),
  ) ?? null;

const { openSection, handleToggle } = useAccordion(liveYears[0], liveYears, findYearForEvent);
const { isOpen, currentImage, currentIndex, images, openLightbox, closeLightbox, goToNext, goToPrev } = useLightbox();

// Reactive photographer credit based on current image
const currentPhotographer = computed(() => currentImage.value?.photographer || null);

// Update URL hash when event is clicked
const updateHash = (id) => {
  window.history.replaceState(null, '', `#${id}`);
};

// Touch/swipe navigation for mobile
const touchStart = ref({ x: 0, y: 0, time: 0 });

const handleTouchStart = (e) => {
  const touch = e.touches[0];
  touchStart.value = {
    x: touch.clientX,
    y: touch.clientY,
    time: Date.now(),
  };
};

const handleTouchEnd = (e) => {
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStart.value.x;
  const deltaY = touch.clientY - touchStart.value.y;
  const deltaTime = Date.now() - touchStart.value.time;

  // Minimum swipe distance (50px) and speed (300ms max)
  const minSwipeDistance = 50;
  const maxSwipeTime = 300;

  // Check if it's a horizontal swipe (not vertical scroll)
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
    if (deltaX > 0) {
      // Swipe right -> previous image
      goToPrev();
    } else {
      // Swipe left -> next image
      goToNext();
    }
  }
};
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="live"
    >
      <AccordionSection
        v-for="year in liveYears"
        :id="year"
        :key="year"
        :title="liveData[year].title"
        :model-value="openSection === year"
        @update:model-value="handleToggle(year, $event)"
      >
        <div
          v-for="event in liveData[year].events"
          :id="event.id"
          :key="event.id"
          class="event event--text-only"
        >
          <div class="event-details">
            <p>
              <strong>
                <a
                  class="event-title-link"
                  :href="`#${event.id}`"
                  @click.prevent="updateHash(event.id)"
                  v-html="event.title"
                />
              </strong>
            </p>
            <p
              class="event-meta"
              v-html="event.venue"
            />
            <p
              v-if="event.description"
              class="event-description"
              v-html="event.description"
            />
            <p
              v-if="event.images?.length"
              class="event-photos-link"
            >
              <button
                class="link-discrete"
                @click="openLightbox(event.images, 0)"
              >
                View photos
              </button>
            </p>
          </div>
        </div>
      </AccordionSection>
    </article>

    <!-- Lightbox overlay -->
    <Transition name="lightbox">
      <div
        v-if="isOpen"
        class="lightbox"
        @click="closeLightbox"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <picture v-if="currentImage">
          <source
            :srcset="currentImage.src.replace('.jpg', '.webp')"
            type="image/webp"
          >
          <img
            :src="currentImage.src"
            :alt="currentImage.alt"
            class="lightbox__image"
          >
        </picture>

        <!-- Navigation hints -->
        <div class="lightbox__hints">
          <button
            class="lightbox__hint lightbox__hint--prev"
            :disabled="currentIndex === 0"
            @click.stop="goToPrev"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            class="lightbox__hint lightbox__hint--close"
            @click.stop="closeLightbox"
            aria-label="Close lightbox"
          >
            ×
          </button>
          <button
            class="lightbox__hint lightbox__hint--next"
            :disabled="currentIndex >= images.length - 1"
            @click.stop="goToNext"
            aria-label="Next image"
          >
            →
          </button>
        </div>

        <!-- Photographer credit -->
        <div
          v-if="currentPhotographer"
          class="lightbox__credit"
        >
          Photo by <a
            :href="currentPhotographer.url"
            target="_blank"
            rel="noopener noreferrer"
          >{{ currentPhotographer.name }}</a>
        </div>
      </div>
    </Transition>
  </div>
</template>
