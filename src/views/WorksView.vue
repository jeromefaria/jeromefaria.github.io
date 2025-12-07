<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { siteConfig } from '@/data/navigation'
import { worksData, worksSections } from '@/data/works'
import AccordionSection from '@/components/AccordionSection.vue'
import ReleaseItem from '@/components/ReleaseItem.vue'

onMounted(() => {
  document.title = `Works - ${siteConfig.title}`
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
        <!-- Regular releases with cover images -->
        <template v-if="worksData[sectionKey].releases">
          <ReleaseItem
            v-for="release in worksData[sectionKey].releases"
            :key="release.id"
            :release="release"
          />
        </template>

        <!-- Text-only content (compilations, mastering) -->
        <template v-if="worksData[sectionKey].textContent">
          <div v-html="worksData[sectionKey].textContent" />
        </template>
      </AccordionSection>
    </article>
  </div>
</template>
