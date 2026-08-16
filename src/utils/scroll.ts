import { nextTick } from 'vue';

import { TIMING } from '@/utils/constants';

interface ScrollOptions {
  /** Pixels to subtract from the target (e.g. a sticky header height). */
  offset?: number;
  behavior?: ScrollBehavior;
}

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scroll so `element` sits at the top of the viewport, minus `offset`. */
export const scrollToElement = (
  element: HTMLElement,
  { offset = 0, behavior = 'smooth' }: ScrollOptions = {},
): void => {
  const targetY = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: targetY, behavior });
};

/** Run a callback once an accordion's open animation has settled. */
export const afterAccordionAnimation = (callback: () => void): void => {
  void nextTick(() => setTimeout(callback, TIMING.ACCORDION_ANIMATION));
};
