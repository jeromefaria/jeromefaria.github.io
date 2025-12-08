import { ref, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { TIMING, ID_PREFIX } from '@/utils/constants'

/**
 * Composable for managing accordion state with URL hash navigation
 * @param {string} initialSection - The section to open by default
 * @param {string[]} validSections - Array of valid section IDs
 * @param {Function|null} [findSectionForId=null] - Optional function to find parent section for a given ID
 * @returns {Object} Accordion state and handlers
 */
export const useAccordion = (initialSection, validSections, findSectionForId = null) => {
  const route = useRoute()
  const openSection = ref(initialSection)
  let isInitialLoad = true

  const handleToggle = (sectionId, isOpen) => {
    if (isOpen) {
      openSection.value = sectionId
      return
    }
    if (openSection.value === sectionId) {
      openSection.value = null
    }
  }

  const scrollToElement = (id) => {
    nextTick(() => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, TIMING.ACCORDION_ANIMATION)
    })
  }

  const processHash = (hash, shouldScroll) => {
    if (!hash) return

    const id = hash.replace(`#${ID_PREFIX.SECTION}`, '').replace('#', '')

    if (validSections.includes(id)) {
      openSection.value = id
      if (shouldScroll) scrollToElement(`${ID_PREFIX.TRIGGER}${id}`)
      return
    }

    if (!findSectionForId) return

    const parentSection = findSectionForId(id)
    if (!parentSection) return

    openSection.value = parentSection
    if (shouldScroll) scrollToElement(id)
  }

  onMounted(() => {
    processHash(route.hash, false)
    nextTick(() => {
      isInitialLoad = false
    })
  })

  watch(() => route.hash, (hash) => {
    if (!isInitialLoad) processHash(hash, true)
  })

  return {
    openSection,
    handleToggle
  }
}
