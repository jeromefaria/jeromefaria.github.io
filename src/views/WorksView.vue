<script setup>
import { usePageHead } from '@/composables/usePageHead'
import { useAccordion } from '@/composables/useAccordion'
import { siteConfig } from '@/data/navigation'
import { worksData, worksSections } from '@/data/works'
import AccordionSection from '@/components/AccordionSection.vue'
import ReleaseItem from '@/components/ReleaseItem.vue'

// Extract year from meta string (e.g., "Digital — BRØQN, 2024" -> "2024")
function extractYear(meta) {
  const match = meta?.match(/\b(19|20)\d{2}\b/)
  return match ? match[0] : null
}

// Build MusicAlbum schema items from solo releases
const albumSchemas = worksData.solo.releases
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
      name: siteConfig.author.name
    }
  }))

// MusicGroup schema with discography
const musicSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: siteConfig.author.name,
  url: siteConfig.url,
  genre: ['Electronic', 'Experimental', 'Ambient'],
  album: albumSchemas
}

usePageHead({
  title: 'Works',
  description: 'Discography, film scores, and works by Jerome Faria including solo releases, collaborations, and curatorial projects.',
  schema: musicSchema
})

const { openSection, handleToggle } = useAccordion('solo', worksSections)
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
        @update:model-value="handleToggle(sectionKey, $event)"
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
