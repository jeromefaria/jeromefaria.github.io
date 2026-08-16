import { afterEach, describe, expect, it, vi } from 'vitest';

import { TIMING } from '@/utils/constants';

import { afterAccordionAnimation, prefersReducedMotion, scrollToElement } from './scroll';

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('prefersReducedMotion', () => {
  it('reflects the reduce media query', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    expect(prefersReducedMotion()).toBe(true);

    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('scrollToElement', () => {
  const elementAtTop = (top: number): HTMLElement => {
    const element = document.createElement('div');
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect);
    return element;
  };

  it('scrolls to the element top minus the given offset', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    scrollToElement(elementAtTop(250), { offset: 40, behavior: 'instant' });

    expect(scrollTo).toHaveBeenCalledWith({ top: 210, behavior: 'instant' });
  });

  it('defaults to no offset and smooth behavior', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    scrollToElement(elementAtTop(500));

    expect(scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'smooth' });
  });
});

describe('afterAccordionAnimation', () => {
  it('defers the callback rather than running it synchronously', () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    afterAccordionAnimation(callback);

    expect(callback).not.toHaveBeenCalled();
  });

  it('runs the callback after the accordion timing settles', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    afterAccordionAnimation(callback);
    await vi.advanceTimersByTimeAsync(TIMING.ACCORDION_ANIMATION);

    expect(callback).toHaveBeenCalledOnce();
  });
});
