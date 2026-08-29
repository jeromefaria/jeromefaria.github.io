import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type Component, defineComponent } from 'vue';

import { useSwipeDismiss } from './useSwipeDismiss';

function createTestComponent(onDismiss: () => void, isAtTop: () => boolean): Component {
  return defineComponent({
    setup() {
      return { ...useSwipeDismiss(onDismiss, isAtTop) };
    },
    template: '<div></div>',
  });
}

function createTouchEvent(type: 'touchstart' | 'touchend', clientX: number, clientY: number): TouchEvent {
  const touch = { clientX, clientY, identifier: 0 };
  const touchList = [touch as Touch];

  const event = new Event(type) as TouchEvent;
  Object.defineProperty(event, type === 'touchstart' ? 'touches' : 'changedTouches', {
    value: touchList,
    writable: false,
  });

  return event;
}

describe('useSwipeDismiss', () => {
  let onDismiss: ReturnType<typeof vi.fn>;
  let dateNowSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    onDismiss = vi.fn();
    dateNowSpy = vi.spyOn(Date, 'now');
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
  });

  const swipe = (
    isAtTop: () => boolean,
    from: [number, number],
    to: [number, number],
    elapsed = 200,
  ): void => {
    const wrapper = mount(createTestComponent(onDismiss, isAtTop));

    dateNowSpy.mockReturnValueOnce(1000);
    wrapper.vm.handleTouchStart(createTouchEvent('touchstart', from[0], from[1]));

    dateNowSpy.mockReturnValueOnce(1000 + elapsed);
    wrapper.vm.handleTouchEnd(createTouchEvent('touchend', to[0], to[1]));
  };

  it('dismisses on a fast downward swipe that starts at the top', () => {
    swipe(() => true, [200, 100], [200, 200]);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('ignores the swipe when the sheet is not scrolled to the top', () => {
    swipe(() => false, [200, 100], [200, 200]);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('ignores upward swipes', () => {
    swipe(() => true, [200, 200], [200, 100]);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('ignores horizontal-dominant swipes', () => {
    swipe(() => true, [100, 100], [220, 190]);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('ignores swipes shorter than the dismiss threshold', () => {
    swipe(() => true, [200, 100], [200, 170]);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('ignores a swipe exactly at the threshold (not greater)', () => {
    swipe(() => true, [200, 100], [200, 180]);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('ignores slow swipes', () => {
    swipe(() => true, [200, 100], [200, 200], 350);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not throw when a touch is missing', () => {
    const wrapper = mount(createTestComponent(onDismiss, () => true));

    const start = new Event('touchstart') as TouchEvent;
    Object.defineProperty(start, 'touches', { value: [], writable: false });
    const end = new Event('touchend') as TouchEvent;
    Object.defineProperty(end, 'changedTouches', { value: [], writable: false });

    expect(() => wrapper.vm.handleTouchStart(start)).not.toThrow();
    expect(() => wrapper.vm.handleTouchEnd(end)).not.toThrow();
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
