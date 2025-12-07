<script setup>
import { usePageHead } from '@/composables/usePageHead'
import { useAccordion } from '@/composables/useAccordion'
import { siteConfig } from '@/data/navigation'
import { liveData, liveYears } from '@/data/live'
import AccordionSection from '@/components/AccordionSection.vue'

// Strip HTML tags from string
function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '') || ''
}

// Extract location from venue string (e.g., "Venue, City, Country" -> { name, city, country })
function parseVenue(venue) {
  const text = stripHtml(venue)
  const parts = text.split(',').map(s => s.trim())
  return {
    name: parts[0] || '',
    addressLocality: parts[1] || '',
    addressCountry: parts[2] || 'Portugal'
  }
}

// Build Event schema items from recent performances (last 3 years with events)
const recentYears = liveYears.slice(0, 5)
const eventSchemas = recentYears.flatMap(year =>
  (liveData[year]?.events || []).map(event => {
    const venue = parseVenue(event.venue)
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
          addressCountry: venue.addressCountry
        }
      },
      performer: {
        '@type': 'Person',
        name: siteConfig.author.name
      }
    }
  })
)

// ItemList schema for event history
const eventsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `${siteConfig.author.name} Live Performances`,
  description: 'Live performance history from 2005 to present',
  numberOfItems: eventSchemas.length,
  itemListElement: eventSchemas.map((event, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: event
  }))
}

usePageHead({
  title: 'Live',
  description: 'Live performance history of Jerome Faria from 2005 to present, including festivals, concerts, and collaborations.',
  schema: eventsSchema
})

// Find which year contains a given event ID
function findYearForEvent(eventId) {
  for (const year of liveYears) {
    const events = liveData[year]?.events || []
    if (events.some(e => e.id === eventId)) {
      return year
    }
  }
  return null
}

const { openSection, handleToggle } = useAccordion('2025', liveYears, findYearForEvent)
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
        @update:model-value="handleToggle(year, $event)"
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
