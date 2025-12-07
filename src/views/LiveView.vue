<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { siteConfig } from '@/data/navigation'
import { liveData, liveYears } from '@/data/live'
import AccordionSection from '@/components/AccordionSection.vue'

onMounted(() => {
  document.title = `Live - ${siteConfig.title}`
})

const route = useRoute()

// Track which section is open (only one at a time)
const openSection = ref('2025')

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
    const id = hash.replace('#section-', '').replace('#', '')
    // Check if it's a year
    if (liveYears.includes(id)) {
      openSection.value = id
    } else {
      // It might be an event ID, find which year it belongs to
      for (const year of liveYears) {
        const events = liveData[year]?.events || []
        if (events.some(e => e.id === id)) {
          openSection.value = year
          break
        }
      }
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="container-wide">
    <article class="page" data-page="live">
      <AccordionSection
        v-for="year in liveYears"
        :key="year"
        :id="year"
        :title="liveData[year].title"
        :model-value="openSection === year"
        @update:model-value="handleSectionToggle(year, $event)"
      >
        <div
          v-for="event in liveData[year].events"
          :key="event.id"
          :id="event.id"
          class="release release--text-only"
        >
          <div class="release-details">
            <p><strong v-html="event.title" /></p>
            <p class="release-meta" v-html="event.venue" />
            <p v-if="event.description" class="release-description" v-html="event.description" />
          </div>
        </div>
      </AccordionSection>
    </article>
  </div>
</template>
