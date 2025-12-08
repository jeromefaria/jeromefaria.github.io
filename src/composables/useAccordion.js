import { ref, watch, nextTick, onMounted } from 'vue'
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
  let isInitialLoad = true

  function handleToggle(sectionId, isOpen) {
    if (isOpen) {
      openSection.value = sectionId
    } else if (openSection.value === sectionId) {
      openSection.value = null
    }
  }

  // Scroll to element after accordion animation completes
  function scrollToElement(id) {
    nextTick(() => {
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 320) // Match accordion animation duration
    })
  }

  // Process hash and optionally scroll
  function processHash(hash, shouldScroll) {
    if (!hash) return

    const id = hash.replace('#section-', '').replace('#', '')

    // Check if it's a direct section match
    if (validSections.includes(id)) {
      openSection.value = id
      if (shouldScroll) {
        scrollToElement(`trigger-${id}`)
      }
    } else if (findSectionForId) {
      // Try to find parent section for nested IDs (e.g., event ID -> year)
      const parentSection = findSectionForId(id)
      if (parentSection) {
        openSection.value = parentSection
        if (shouldScroll) {
          scrollToElement(id)
        }
      }
    }
  }

  // Handle initial hash on mount (open section but don't scroll - let browser handle it)
  onMounted(() => {
    processHash(route.hash, false)
    // Allow scrolling for subsequent hash changes
    nextTick(() => {
      isInitialLoad = false
    })
  })

  // Handle hash navigation changes (scroll smoothly)
  watch(() => route.hash, (hash) => {
    if (!isInitialLoad) {
      processHash(hash, true)
    }
  })

  return {
    openSection,
    handleToggle
  }
}
