import type { Ref } from 'vue';
import { onMounted, ref } from 'vue';

import { ID_PREFIX } from '@/utils/constants';
import { baseFragment } from '@/utils/lightboxPermalink';
import { clearHash, updateHash } from '@/utils/navigation';
import { afterAccordionAnimation, prefersReducedMotion, scrollToElement } from '@/utils/scroll';

import { useHashScroll } from './useHashScroll';

interface UseAccordionReturn {
  openSection: Ref<string | null>;
  handleToggle: (sectionId: string, isOpen: boolean) => void;
}

export const useAccordion = (
  initialSection: string,
  validSections: string[],
  findSectionForId: ((id: string) => string | null) | null = null,
  focusId: string | null = null,
): UseAccordionReturn => {
  const resolveFocusSection = (): string | null => {
    if (!focusId) return null;
    if (validSections.includes(focusId)) return focusId;
    return findSectionForId?.(focusId) ?? null;
  };

  const openSection = ref<string | null>(resolveFocusSection() ?? initialSection);

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

    const id = baseFragment(hash.replace(`#${ID_PREFIX.SECTION}`, '').replace('#', ''));

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

  const { isInitialLoad } = useHashScroll(hash => processHash(hash, true), { immediate: true });

  onMounted(() => {
    if (focusId) processHash(focusId, true);
  });

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
