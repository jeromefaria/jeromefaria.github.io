<script setup lang="ts">
import AccordionSection from '@/components/AccordionSection.vue';
import LightboxOverlay from '@/components/LightboxOverlay.vue';
import ReleaseItem from '@/components/ReleaseItem.vue';
import { useAccordion } from '@/composables/useAccordion';
import { useLightboxWithSwipe } from '@/composables/useLightboxWithSwipe';
import { usePageHead } from '@/composables/usePageHead';
import { pageMeta } from '@/data/pageMeta';
import { worksData, worksSections } from '@/data/works';
import { updateHash } from '@/utils/navigation';
import { createWorksPageSchema } from '@/utils/pageSchemas';

usePageHead({
  ...pageMeta.works,
  schema: createWorksPageSchema(),
});

const findSectionForRelease = (releaseId: string): string | null =>
  worksSections.find(section => {
    const sectionData = worksData[section];
    return sectionData?.items?.some(r => r.id === releaseId);
  }) ?? null;

const { openSection, handleToggle } = useAccordion('solo', worksSections, findSectionForRelease);
const { isOpen, currentItem, currentIndex, items, openLightbox, closeLightbox, goToNext, goToPrev, handleTouchStart, handleTouchEnd } = useLightboxWithSwipe();
</script>

<template>
  <div class="container-wide">
    <article
      class="page"
      data-page="works"
    >
      <h1 class="visually-hidden">
        Works
      </h1>
      <AccordionSection
        v-for="sectionKey in worksSections"
        :id="sectionKey"
        :key="sectionKey"
        :title="worksData[sectionKey]?.title || sectionKey"
        :model-value="openSection === sectionKey"
        @update:model-value="handleToggle(sectionKey, $event)"
      >
        <ReleaseItem
          v-for="release in worksData[sectionKey]?.items || []"
          :key="release.id"
          :release="release"
          :text-only="!('coverImage' in release && release.coverImage)"
          @update-hash="updateHash"
          @open-lightbox="openLightbox"
        />
      </AccordionSection>
    </article>

    <!-- Lightbox overlay -->
    <LightboxOverlay
      v-if="currentItem"
      :is-open="isOpen"
      :current-item="currentItem"
      :current-index="currentIndex"
      :total-items="items.length"
      @close="closeLightbox"
      @prev="goToPrev"
      @next="goToNext"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    />
  </div>
</template>
