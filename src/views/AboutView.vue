<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import LightboxHost from '@/components/LightboxHost.vue';
import PageShell from '@/components/PageShell.vue';
import ResponsivePicture from '@/components/ResponsivePicture.vue';
import { usePageHead } from '@/composables/usePageHead';
import { useProse } from '@/composables/useProse';
import { useProseLinks } from '@/composables/useProseLinks';
import { aboutSections } from '@/data/about';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { isImageSection } from '@/types';
import { getImageStyles } from '@/utils/imageStyles';
import { toLightboxImage } from '@/utils/lightboxAdapters';

usePageHead(pageMeta.about);

const localize = useLocalized();
const renderProse = useProse();
const routeProseLink = useProseLinks();

const lightbox = useTemplateRef<InstanceType<typeof LightboxHost>>('lightbox');

const allImages = computed(() =>
  aboutSections
    .filter(isImageSection)
    .flatMap(section => section.images.map(toLightboxImage)));

const sectionStartIndices = computed(() => {
  let currentIndex = 0;
  return aboutSections.map(section => {
    const startIndex = currentIndex;
    if (isImageSection(section)) {
      currentIndex += section.images.length;
    }
    return startIndex;
  });
});

const getGlobalIndex = (sectionIndex: number, imageIndex: number): number =>
  (sectionStartIndices.value[sectionIndex] ?? 0) + imageIndex;
</script>

<template>
  <div class="container-wide">
    <PageShell
      data-page="about"
      :title="localize(pageMeta.about.title)"
    >
      <template
        v-for="(section, sectionIndex) in aboutSections"
        :key="section.id"
      >
        <div
          v-if="section.type === 'short-bio'"
          class="short-bio"
          @click="routeProseLink"
          v-html="renderProse(section.content)"
        />

        <div
          v-else-if="!section.type"
          class="prose"
          @click="routeProseLink"
          v-html="renderProse(section.content)"
        />

        <div
          v-else-if="section.type === 'image-group'"
          class="about-image-group"
        >
          <figure
            v-for="(image, imageIndex) in section.images"
            :key="imageIndex"
            class="about-image-group__image"
            @click="lightbox?.openLightbox(allImages, getGlobalIndex(sectionIndex, imageIndex))"
          >
            <ResponsivePicture
              :src="image.src"
              :alt="image.alt"
              sizes="(min-width: 768px) 45vw, 48vw"
              :image-style="getImageStyles(image)"
            />
          </figure>
        </div>
      </template>
    </PageShell>

    <LightboxHost ref="lightbox" />
  </div>
</template>
