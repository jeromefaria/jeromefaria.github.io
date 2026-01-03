import type { Ref } from 'vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { ID_PREFIX, TIMING } from '@/utils/constants';

interface UseAccordionReturn {
  openSection: Ref<string | null>;
  handleToggle: (sectionId: string, isOpen: boolean) => void;
}

/**
 * Composable for managing accordion state with URL hash navigation
 * @param initialSection - The section to open by default
 * @param validSections - Array of valid section IDs
 * @param findSectionForId - Optional function to find parent section for a given ID
 * @returns Accordion state and handlers
 */
export const useAccordion = (
  initialSection: string,
  validSections: string[],
  findSectionForId: ((id: string) => string | null) | null = null,
): UseAccordionReturn => {
  const route = useRoute();
  const openSection = ref<string | null>(initialSection);
  const isInitialLoad = ref(true);

  const handleToggle = (sectionId: string, isOpen: boolean): void => {
    if (isOpen) {
      openSection.value = sectionId;
      // Update URL hash when opening a section
      if (!isInitialLoad.value) {
        window.history.replaceState(null, '', `#${ID_PREFIX.SECTION}${sectionId}`);
      }
      return;
    }
    if (openSection.value === sectionId) {
      openSection.value = null;
      // Clear hash when closing
      if (!isInitialLoad.value) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  };

  const scrollToElement = (id: string): void => {
    nextTick(() => {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const scrollMargin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
          const targetY = element.getBoundingClientRect().top + window.scrollY - scrollMargin;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }, TIMING.ACCORDION_ANIMATION);
    });
  };

  const processHash = (hash: string, shouldScroll: boolean): void => {
    if (!hash) return;

    const id = hash.replace(`#${ID_PREFIX.SECTION}`, '').replace('#', '');

    if (validSections.includes(id)) {
      openSection.value = id;
      if (shouldScroll) scrollToElement(`${ID_PREFIX.TRIGGER}${id}`);
      return;
    }

    if (!findSectionForId) return;

    const parentSection = findSectionForId(id);
    if (!parentSection) return;

    openSection.value = parentSection;
    if (shouldScroll) scrollToElement(id);
  };

  onMounted(() => {
    // Scroll to hash on initial load if present
    processHash(route.hash, !!route.hash);
    nextTick(() => {
      isInitialLoad.value = false;
    });
  });

  watch(() => route.hash, hash => {
    if (!isInitialLoad.value) processHash(hash, true);
  });

  return {
    openSection,
    handleToggle,
  };
};
