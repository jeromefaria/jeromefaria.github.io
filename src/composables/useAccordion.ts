import type { Ref } from 'vue';
import { nextTick, ref } from 'vue';

import { ID_PREFIX, TIMING } from '@/utils/constants';

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

  const scrollToElement = (id: string): void => {
    nextTick(() => {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const scrollMargin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
          const targetY = element.getBoundingClientRect().top + window.scrollY - scrollMargin;
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: targetY, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
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

  // Open (and scroll to) the hash target on load and on hash changes.
  const { isInitialLoad } = useHashScroll(hash => processHash(hash, true), { immediate: true });

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

  return {
    openSection,
    handleToggle,
  };
};
