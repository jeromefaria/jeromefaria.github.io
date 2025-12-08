import { ref, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { TIMING, ID_PREFIX } from '@/utils/constants'

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

  function scrollToElement(id) {
    nextTick(() => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, TIMING.ACCORDION_ANIMATION)
    })
  }

  function processHash(hash, shouldScroll) {
    if (!hash) return

    const id = hash.replace(`#${ID_PREFIX.SECTION}`, '').replace('#', '')

    if (validSections.includes(id)) {
      openSection.value = id
      if (shouldScroll) {
        scrollToElement(`${ID_PREFIX.TRIGGER}${id}`)
      }
    } else if (findSectionForId) {
      const parentSection = findSectionForId(id)
      if (parentSection) {
        openSection.value = parentSection
        if (shouldScroll) {
          scrollToElement(id)
        }
      }
    }
  }

  onMounted(() => {
    processHash(route.hash, false)
    nextTick(() => {
      isInitialLoad = false
    })
  })

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
