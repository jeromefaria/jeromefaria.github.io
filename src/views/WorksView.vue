<script setup>
import AccordionSection from '@/components/AccordionSection.vue';
import LightboxOverlay from '@/components/LightboxOverlay.vue';
import ReleaseItem from '@/components/ReleaseItem.vue';
import { useAccordion } from '@/composables/useAccordion';
import { useLightbox } from '@/composables/useLightbox';
import { usePageHead } from '@/composables/usePageHead';
import { useSwipeNavigation } from '@/composables/useSwipeNavigation';
import { siteConfig } from '@/data/navigation';
import { worksData, worksSections } from '@/data/works';
import { extractYear } from '@/utils/formatters';

const albumSchemas = worksData.solo.items
  .filter(r => r.bandcampId || r.bandcampUrl)
  .map(release => ({
    '@type': 'MusicAlbum',
    name: release.title,
    url: release.bandcampUrl,
    image: release.coverImage ? `${siteConfig.url}${release.coverImage}` : undefined,
    datePublished: extractYear(release.meta),
    numTracks: release.tracklist?.length,
    byArtist: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
  }));

const bookSchema = {
  '@type': 'Book',
  name: 'Glitch: Designing Imperfection',
  image: `${siteConfig.url}/images/glitch.jpg`,
  url: 'https://www.amazon.com/Glitch-Designing-Imperfection-Iman-Moradi/dp/0979966663',
  datePublished: '2009',
  isbn: '978-0-9799666-6-8',
  publisher: {
    '@type': 'Organization',
    name: 'Mark Batty Publisher',
  },
  editor: [
    { '@type': 'Person', name: 'Iman Moradi' },
    { '@type': 'Person', name: 'Ant Scott' },
    { '@type': 'Person', name: 'Joe Gilmore' },
    { '@type': 'Person', name: 'Christopher Murphy' },
  ],
  contributor: {
    '@type': 'Person',
    name: siteConfig.author.name,
  },
};

const creativeWorkSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MusicGroup',
      name: siteConfig.author.name,
      url: siteConfig.url,
      genre: ['Electronic', 'Experimental', 'Ambient'],
      album: albumSchemas,
    },
    bookSchema,
  ],
};

usePageHead({
  title: 'Works',
  description: 'Discography, film scores, and works by Jerome Faria including solo releases, collaborations, and curatorial projects.',
  schema: creativeWorkSchema,
});

const findSectionForRelease = releaseId =>
  worksSections.find(section =>
    worksData[section]?.items?.some(r => r.id === releaseId),
  ) ?? null;

const { openSection, handleToggle } = useAccordion('solo', worksSections, findSectionForRelease);
const { isOpen, currentImage, currentIndex, images, openLightbox, closeLightbox, goToNext, goToPrev } = useLightbox();
const { handleTouchStart, handleTouchEnd } = useSwipeNavigation(goToNext, goToPrev);

// Update URL hash when release is clicked
const updateHash = id => {
  window.history.replaceState(null, '', `#${id}`);
};
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="works"
    >
      <AccordionSection
        v-for="sectionKey in worksSections"
        :id="sectionKey"
        :key="sectionKey"
        :title="worksData[sectionKey].title"
        :model-value="openSection === sectionKey"
        @update:model-value="handleToggle(sectionKey, $event)"
      >
        <ReleaseItem
          v-for="release in worksData[sectionKey].items"
          :key="release.id"
          :release="release"
          :text-only="!release.coverImage"
          @update-hash="updateHash"
          @open-lightbox="openLightbox"
        />
      </AccordionSection>
    </article>

    <!-- Lightbox overlay -->
    <LightboxOverlay
      :is-open="isOpen"
      :current-image="currentImage"
      :current-index="currentIndex"
      :total-images="images.length"
      variant="compact"
      @close="closeLightbox"
      @prev="goToPrev"
      @next="goToNext"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    />
  </div>
</template>
