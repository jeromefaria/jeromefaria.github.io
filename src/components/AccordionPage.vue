<script setup lang="ts" generic="T extends { id: string }">
import { useTemplateRef } from 'vue';

import { useAccordion } from '@/composables/useAccordion';
import { usePageHead } from '@/composables/usePageHead';
import type { LightboxItem } from '@/types';
import type { LightboxSource } from '@/utils/lightboxPermalink';
import { findSectionContainingId, updateHash } from '@/utils/navigation';

import AccordionSection from './AccordionSection.vue';
import LightboxHost from './LightboxHost.vue';
import PageShell from './PageShell.vue';

interface Section {
  title: string;
  id: string;
  items: T[];
}

const props = defineProps<{
  dataPage: string;
  title: string;
  sections: string[];
  sectionData: Record<string, Section>;
  initialSection: string;
  head: Parameters<typeof usePageHead>[0];
  focusId?: string;
}>();

defineSlots<{
  item(props: {
    item: T;
    openLightbox: (items: LightboxItem[], index: number, source?: LightboxSource) => void;
    updateHash: (id: string) => void;
  }): unknown;
}>();

usePageHead(props.head);

const findSectionForId = (id: string): string | null =>
  findSectionContainingId(props.sections, props.sectionData, id);

const { openSection, handleToggle } = useAccordion(
  props.initialSection,
  props.sections,
  findSectionForId,
  props.focusId ?? null,
);
const lightbox = useTemplateRef<InstanceType<typeof LightboxHost>>('lightbox');

const openLightbox = (items: LightboxItem[], index: number, source?: LightboxSource): void => {
  lightbox.value?.openLightbox(items, index, source);
};
</script>

<template>
  <div class="container-wide">
    <PageShell
      :data-page="dataPage"
      :title="title"
    >
      <AccordionSection
        v-for="sectionKey in sections"
        :id="sectionKey"
        :key="sectionKey"
        :title="sectionData[sectionKey]?.title || sectionKey"
        :model-value="openSection === sectionKey"
        @update:model-value="handleToggle(sectionKey, $event)"
      >
        <template
          v-for="item in sectionData[sectionKey]?.items || []"
          :key="item.id"
        >
          <slot
            name="item"
            :item="item"
            :open-lightbox="openLightbox"
            :update-hash="updateHash"
          />
        </template>
      </AccordionSection>
    </PageShell>

    <LightboxHost ref="lightbox" />
  </div>
</template>
