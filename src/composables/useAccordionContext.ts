import type { InjectionKey, Ref } from 'vue';
import { inject, provide, ref, watch } from 'vue';

const ACCORDION_EXPANDED: InjectionKey<Ref<boolean>> = Symbol('accordionExpanded');

export const provideAccordionExpanded = (isExpanded: Ref<boolean>): void => {
  provide(ACCORDION_EXPANDED, isExpanded);
};

// A collapsed accordion is zero-height near the viewport, defeating native lazy-loading; this stays true once first expanded so content can defer heavy resources. Defaults to true outside an accordion.
export const useAccordionVisibility = (): Ref<boolean> => {
  const isExpanded = inject(ACCORDION_EXPANDED, null);
  if (!isExpanded) return ref(true);

  const hasBeenVisible = ref(isExpanded.value);
  watch(isExpanded, value => {
    if (value) hasBeenVisible.value = true;
  });
  return hasBeenVisible;
};
