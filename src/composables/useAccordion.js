import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Composable for managing accordion section state with hash navigation
 * @param {string} initialSection - The section ID to open initially
 * @param {string[]} validSections - Array of valid section IDs
 * @param {Function} [findSectionForId] - Optional function to find parent section for a nested ID
 * @returns {Object} Accordion state and handlers
 */
export function useAccordion(initialSection, validSections, findSectionForId = null) {
  const route = useRoute()
  const openSection = ref(initialSection)

  function handleToggle(sectionId, isOpen) {
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

      // Check if it's a direct section match
      if (validSections.includes(id)) {
        openSection.value = id
      } else if (findSectionForId) {
        // Try to find parent section for nested IDs (e.g., event ID -> year)
        const parentSection = findSectionForId(id)
        if (parentSection) {
          openSection.value = parentSection
        }
      }
    }
  }, { immediate: true })

  return {
    openSection,
    handleToggle
  }
}
