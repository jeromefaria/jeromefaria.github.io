import type { Ref } from 'vue';
import { ref } from 'vue';

import { ID_PREFIX } from '@/utils/constants';
import { clearHash, updateHash } from '@/utils/navigation';
import { afterAccordionAnimation, prefersReducedMotion, scrollToElement } from '@/utils/scroll';

import { useHashScroll } from './useHashScroll';

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
  const openSection = ref<string | null>(initialSection);

  const scrollToHashTarget = (id: string): void => {
    afterAccordionAnimation(() => {
      const element = document.getElementById(id);
      if (!element) return;

      const offset = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
      scrollToElement(element, { offset, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  };

  const processHash = (hash: string, shouldScroll: boolean): void => {
    if (!hash) return;

    const id = hash.replace(`#${ID_PREFIX.SECTION}`, '').replace('#', '');

    if (validSections.includes(id)) {
      openSection.value = id;
      if (shouldScroll) scrollToHashTarget(`${ID_PREFIX.TRIGGER}${id}`);
      return;
    }

    if (!findSectionForId) return;

    const parentSection = findSectionForId(id);
    if (!parentSection) return;

    openSection.value = parentSection;
    if (shouldScroll) scrollToHashTarget(id);
  };

  // Open (and scroll to) the hash target on load and on hash changes.
  const { isInitialLoad } = useHashScroll(hash => processHash(hash, true), { immediate: true });

  const handleToggle = (sectionId: string, isOpen: boolean): void => {
    if (isOpen) {
      openSection.value = sectionId;
      if (!isInitialLoad.value) {
        updateHash(`${ID_PREFIX.SECTION}${sectionId}`);
      }
      return;
    }
    if (openSection.value === sectionId) {
      openSection.value = null;
      if (!isInitialLoad.value) {
        clearHash();
      }
    }
  };

  return {
    openSection,
    handleToggle,
  };
};
