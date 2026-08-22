import { nextTick } from 'vue';

import { TIMING } from '@/utils/constants';

interface ScrollOptions {
  offset?: number;
  behavior?: ScrollBehavior;
}

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const scrollToElement = (
  element: HTMLElement,
  { offset = 0, behavior = 'smooth' }: ScrollOptions = {},
): void => {
  const targetY = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: targetY, behavior });
};

export const afterAccordionAnimation = (callback: () => void): void => {
  void nextTick(() => setTimeout(callback, TIMING.ACCORDION_ANIMATION));
};
