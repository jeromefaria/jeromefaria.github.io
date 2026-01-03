import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Component, defineComponent } from 'vue';

import { useSwipeNavigation } from './useSwipeNavigation';

// Swipe threshold constants documented here for reference
// MIN_SWIPE_DISTANCE = 50, MAX_SWIPE_DURATION_MS = 300

/**
 * Create a test component that uses the useSwipeNavigation composable
 */
function createTestComponent(onSwipeLeft: () => void, onSwipeRight: () => void): Component {
  return defineComponent({
    setup() {
      const swipe = useSwipeNavigation(onSwipeLeft, onSwipeRight);
      return { ...swipe };
    },
    template: '<div></div>',
  });
}

/**
 * Create a mock TouchEvent for testing swipe gestures
 */
function createTouchEvent(type: 'touchstart' | 'touchend', clientX: number, clientY: number): TouchEvent {
  const touch = {
    clientX,
    clientY,
    identifier: 0,
    pageX: clientX,
    pageY: clientY,
    screenX: clientX,
    screenY: clientY,
    target: document.body,
    radiusX: 0,
    radiusY: 0,
    rotationAngle: 0,
    force: 1,
  };

  const touchList: Touch[] = [touch as Touch];
  Object.defineProperty(touchList, 'item', {
    value: (index: number) => touchList[index] || null,
  });

  const event = new Event(type) as TouchEvent;
  if (type === 'touchstart') {
    Object.defineProperty(event, 'touches', {
      value: touchList,
      writable: false,
    });
  } else {
    Object.defineProperty(event, 'changedTouches', {
      value: touchList,
      writable: false,
    });
  }

  return event;
}

describe('useSwipeNavigation', () => {
  let onSwipeLeft: ReturnType<typeof vi.fn>;
  let onSwipeRight: ReturnType<typeof vi.fn>;
  let dateNowSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    onSwipeLeft = vi.fn();
    onSwipeRight = vi.fn();
    dateNowSpy = vi.spyOn(Date, 'now');
    vi.clearAllMocks();
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
  });

  describe('right swipe detection', () => {
    it('should detect right swipe (distance > 50px, time < 300ms, horizontal)', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      // Start touch at x=100
      dateNowSpy.mockReturnValueOnce(1000);
      const startEvent = createTouchEvent('touchstart', 100, 200);
      wrapper.vm.handleTouchStart(startEvent);

      // End touch at x=200 (100px to the right), after 200ms
      dateNowSpy.mockReturnValueOnce(1200);
      const endEvent = createTouchEvent('touchend', 200, 200);
      wrapper.vm.handleTouchEnd(endEvent);

      expect(onSwipeRight).toHaveBeenCalledOnce();
      expect(onSwipeLeft).not.toHaveBeenCalled();
    });

    it('should detect right swipe with minimum valid distance (51px)', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      dateNowSpy.mockReturnValueOnce(1000);
      wrapper.vm.handleTouchStart(createTouchEvent('touchstart', 100, 200));

      dateNowSpy.mockReturnValueOnce(1200);
      wrapper.vm.handleTouchEnd(createTouchEvent('touchend', 151, 200));

      expect(onSwipeRight).toHaveBeenCalledOnce();
    });
  });

  describe('left swipe detection', () => {
    it('should detect left swipe (distance > 50px, time < 300ms, horizontal)', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      // Start touch at x=200
      dateNowSpy.mockReturnValueOnce(1000);
      wrapper.vm.handleTouchStart(createTouchEvent('touchstart', 200, 200));

      // End touch at x=100 (100px to the left), after 200ms
      dateNowSpy.mockReturnValueOnce(1200);
      wrapper.vm.handleTouchEnd(createTouchEvent('touchend', 100, 200));

      expect(onSwipeLeft).toHaveBeenCalledOnce();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should detect left swipe with minimum valid distance (51px)', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      dateNowSpy.mockReturnValueOnce(1000);
      wrapper.vm.handleTouchStart(createTouchEvent('touchstart', 200, 200));

      dateNowSpy.mockReturnValueOnce(1200);
      wrapper.vm.handleTouchEnd(createTouchEvent('touchend', 149, 200));

      expect(onSwipeLeft).toHaveBeenCalledOnce();
    });
  });

  describe('vertical swipe rejection', () => {
    it('should ignore vertical swipes (abs(deltaY) > abs(deltaX))', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      // Start touch
      dateNowSpy.mockReturnValueOnce(1000);
      wrapper.vm.handleTouchStart(createTouchEvent('touchstart', 200, 100));

      // End touch with more vertical than horizontal movement
      dateNowSpy.mockReturnValueOnce(1200);
      wrapper.vm.handleTouchEnd(createTouchEvent('touchend', 220, 200)); // 20px horizontal, 100px vertical

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should ignore purely vertical swipes', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      dateNowSpy.mockReturnValueOnce(1000);
      wrapper.vm.handleTouchStart(createTouchEvent('touchstart', 200, 100));

      dateNowSpy.mockReturnValueOnce(1200);
      wrapper.vm.handleTouchEnd(createTouchEvent('touchend', 200, 250)); // No horizontal movement

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });
  });

  describe('distance validation', () => {
    it('should ignore short swipes (distance < 50px)', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      dateNowSpy.mockReturnValueOnce(1000);
      wrapper.vm.handleTouchStart(createTouchEvent('touchstart', 100, 200));

      // Only 30px horizontal movement
      dateNowSpy.mockReturnValueOnce(1200);
      wrapper.vm.handleTouchEnd(createTouchEvent('touchend', 130, 200));

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should ignore swipes exactly at 50px (not greater)', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      dateNowSpy.mockReturnValueOnce(1000);
      wrapper.vm.handleTouchStart(createTouchEvent('touchstart', 100, 200));

      // Exactly 50px movement (needs > 50, not >= 50)
      dateNowSpy.mockReturnValueOnce(1200);
      wrapper.vm.handleTouchEnd(createTouchEvent('touchend', 150, 200));

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });
  });

  describe('speed validation', () => {
    it('should ignore slow swipes (time > 300ms)', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      dateNowSpy.mockReturnValueOnce(1000);
      wrapper.vm.handleTouchStart(createTouchEvent('touchstart', 100, 200));

      // 100px movement but 350ms duration (too slow)
      dateNowSpy.mockReturnValueOnce(1350);
      wrapper.vm.handleTouchEnd(createTouchEvent('touchend', 200, 200));

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should accept swipes exactly at 299ms', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      dateNowSpy.mockReturnValueOnce(1000);
      wrapper.vm.handleTouchStart(createTouchEvent('touchstart', 100, 200));

      // Exactly 299ms (< 300)
      dateNowSpy.mockReturnValueOnce(1299);
      wrapper.vm.handleTouchEnd(createTouchEvent('touchend', 200, 200));

      expect(onSwipeRight).toHaveBeenCalledOnce();
    });
  });

  describe('combined validation', () => {
    it('should require all three conditions (horizontal, distance, speed)', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      // Horizontal + good speed, but short distance
      dateNowSpy.mockReturnValueOnce(1000);
      wrapper.vm.handleTouchStart(createTouchEvent('touchstart', 100, 200));

      dateNowSpy.mockReturnValueOnce(1200);
      wrapper.vm.handleTouchEnd(createTouchEvent('touchend', 130, 200));

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should accept swipe with all valid conditions', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      dateNowSpy.mockReturnValueOnce(1000);
      wrapper.vm.handleTouchStart(createTouchEvent('touchstart', 100, 200));

      // Horizontal (210 - 100 = 110px horizontal, 0px vertical)
      // Distance > 50 (110px)
      // Speed < 300ms (250ms)
      dateNowSpy.mockReturnValueOnce(1250);
      wrapper.vm.handleTouchEnd(createTouchEvent('touchend', 210, 200));

      expect(onSwipeRight).toHaveBeenCalledOnce();
    });
  });

  describe('edge cases', () => {
    it('should handle missing touch in touchstart', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      const event = new Event('touchstart') as TouchEvent;
      Object.defineProperty(event, 'touches', {
        value: [],
        writable: false,
      });

      expect(() => wrapper.vm.handleTouchStart(event)).not.toThrow();
    });

    it('should handle missing touch in touchend', () => {
      const wrapper = mount(createTestComponent(onSwipeLeft, onSwipeRight));

      const event = new Event('touchend') as TouchEvent;
      Object.defineProperty(event, 'changedTouches', {
        value: [],
        writable: false,
      });

      expect(() => wrapper.vm.handleTouchEnd(event)).not.toThrow();
    });
  });
});
