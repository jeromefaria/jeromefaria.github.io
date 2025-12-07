<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { siteConfig } from '@/data/navigation'
import { worksData, worksSections } from '@/data/works'
import AccordionSection from '@/components/AccordionSection.vue'
import ReleaseItem from '@/components/ReleaseItem.vue'

useHead({
  title: `Works - ${siteConfig.title}`,
  meta: [
    { name: 'description', content: 'Discography, film scores, and works by Jerome Faria including solo releases, collaborations, and curatorial projects.' },
    { property: 'og:title', content: `Works - ${siteConfig.title}` },
    { property: 'og:description', content: 'Discography, film scores, and works by Jerome Faria including solo releases, collaborations, and curatorial projects.' }
  ]
})

const route = useRoute()

// Track which section is open (only one at a time)
const openSection = ref('solo')

function handleSectionToggle(sectionId, isOpen) {
  if (isOpen) {
    openSection.value = sectionId
  } else if (openSection.value === sectionId) {
    openSection.value = null
  }
}

// Handle hash navigation
watch(() => route.hash, (hash) => {
  if (hash) {
    const sectionId = hash.replace('#section-', '').replace('#', '')
    // Check if it's a section
    if (worksSections.includes(sectionId)) {
      openSection.value = sectionId
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="container-wide">
    <article class="page" data-page="works">
      <AccordionSection
        v-for="sectionKey in worksSections"
        :key="sectionKey"
        :id="sectionKey"
        :title="worksData[sectionKey].title"
        :model-value="openSection === sectionKey"
        @update:model-value="handleSectionToggle(sectionKey, $event)"
      >
        <ReleaseItem
          v-for="release in worksData[sectionKey].releases"
          :key="release.id"
          :release="release"
          :text-only="!release.coverImage"
        />
      </AccordionSection>
    </article>
  </div>
</template>
