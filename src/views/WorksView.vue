<script setup lang="ts">
import { useTemplateRef } from 'vue';

import AccordionSection from '@/components/AccordionSection.vue';
import LightboxHost from '@/components/LightboxHost.vue';
import PageShell from '@/components/PageShell.vue';
import ReleaseItem from '@/components/ReleaseItem.vue';
import { useAccordion } from '@/composables/useAccordion';
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
const lightbox = useTemplateRef<InstanceType<typeof LightboxHost>>('lightbox');
</script>

<template>
  <div class="container-wide">
    <PageShell
      data-page="works"
      title="Works"
    >
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
          @open-lightbox="lightbox?.openLightbox"
        />
      </AccordionSection>
    </PageShell>

    <LightboxHost ref="lightbox" />
  </div>
</template>
