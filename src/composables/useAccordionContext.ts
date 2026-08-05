import type { InjectionKey, Ref } from 'vue';
import { inject, provide, ref, watch } from 'vue';

const ACCORDION_EXPANDED: InjectionKey<Ref<boolean>> = Symbol('accordionExpanded');

/** Called by an accordion section to share its expanded state with its content. */
export const provideAccordionExpanded = (isExpanded: Ref<boolean>): void => {
  provide(ACCORDION_EXPANDED, isExpanded);
};

/**
 * Returns a ref that becomes — and stays — true once the containing accordion
 * section has first been expanded. Content can use it to defer loading heavy
 * resources (e.g. cover images) while its section is collapsed, since the
 * accordion collapses to zero height near the viewport, which defeats the
 * browser's native lazy-loading. Defaults to true outside an accordion.
 */
export const useAccordionVisibility = (): Ref<boolean> => {
  const isExpanded = inject(ACCORDION_EXPANDED, null);
  if (!isExpanded) return ref(true);

  const hasBeenVisible = ref(isExpanded.value);
  watch(isExpanded, value => {
    if (value) hasBeenVisible.value = true;
  });
  return hasBeenVisible;
};
