import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Component, defineComponent, nextTick, reactive } from 'vue';

import { useAccordion } from './useAccordion';

// Constants
const TEST_PATH = '/test';
const ACCORDION_ANIMATION_TIMING = 350; // 320ms animation + buffer
const SCROLL_MARGIN_TOP = '20px';
const ELEMENT_TOP_POSITION = 100;
const VALID_SECTIONS = ['solo', 'collab'];
const INITIAL_SECTION = 'solo';

// Mock vue-router with reactive route object
const mockRoute = reactive({
  hash: '',
  path: TEST_PATH,
});

const mockRouter = {
  push: vi.fn(),
};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}));

/**
 * Create a test component that uses the useAccordion composable
 */
function createTestComponent(
  initialSection: string = INITIAL_SECTION,
  validSections: string[] = VALID_SECTIONS,
  findSectionForId: ((id: string) => string | null) | null = null,
): Component {
  return defineComponent({
    setup() {
      const accordion = useAccordion(initialSection, validSections, findSectionForId);
      return { ...accordion };
    },
    template: '<div></div>',
  });
}

/**
 * Create a mock HTMLElement for testing scroll behavior
 */
function createMockElement(): HTMLElement {
  return {
    getBoundingClientRect: () => ({
      top: ELEMENT_TOP_POSITION,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }),
    scrollMarginTop: SCROLL_MARGIN_TOP,
  } as unknown as HTMLElement;
}

describe('useAccordion', () => {
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;
  let getElementByIdSpy: ReturnType<typeof vi.spyOn<Document, 'getElementById'>>;

  beforeEach(() => {
    mockRoute.hash = '';

    replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    getElementByIdSpy = vi.spyOn(document, 'getElementById');
    getElementByIdSpy.mockReturnValue(createMockElement());

    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      scrollMarginTop: SCROLL_MARGIN_TOP,
    } as CSSStyleDeclaration);

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });

    vi.clearAllMocks();
  });

  it('should initialize with the initial section', () => {
    const wrapper = mount(createTestComponent());

    expect(wrapper.vm.openSection).toBe(INITIAL_SECTION);
  });

  it('should open section when handleToggle called with true', () => {
    const wrapper = mount(createTestComponent());

    wrapper.vm.handleToggle(VALID_SECTIONS[1], true);

    expect(wrapper.vm.openSection).toBe(VALID_SECTIONS[1]);
  });

  it('should close section when handleToggle called with false', () => {
    const wrapper = mount(createTestComponent());

    wrapper.vm.handleToggle(INITIAL_SECTION, false);

    expect(wrapper.vm.openSection).toBeNull();
  });

  it('should update URL hash when section opens (after initial load)', async () => {
    const wrapper = mount(createTestComponent());

    await nextTick();
    await nextTick();

    wrapper.vm.handleToggle(VALID_SECTIONS[1], true);

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `#section-${VALID_SECTIONS[1]}`,
    );
  });

  it('should clear URL hash when section closes (after initial load)', async () => {
    const wrapper = mount(createTestComponent());

    await nextTick();
    await nextTick();

    wrapper.vm.handleToggle(INITIAL_SECTION, false);

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      window.location.pathname,
    );
  });

  it('should not update URL hash during initial load', () => {
    const wrapper = mount(createTestComponent());

    wrapper.vm.handleToggle(VALID_SECTIONS[1], true);

    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it('should parse hash correctly and open matching section', async () => {
    mockRoute.hash = `#section-${VALID_SECTIONS[1]}`;

    const wrapper = mount(createTestComponent());
    await nextTick();

    expect(wrapper.vm.openSection).toBe(VALID_SECTIONS[1]);
  });

  it('should parse hash without section prefix', async () => {
    mockRoute.hash = `#${VALID_SECTIONS[1]}`;

    const wrapper = mount(createTestComponent());
    await nextTick();

    expect(wrapper.vm.openSection).toBe(VALID_SECTIONS[1]);
  });

  it('should not open section if hash does not match valid sections', async () => {
    mockRoute.hash = '#invalid-section';

    const wrapper = mount(createTestComponent());
    await nextTick();

    expect(wrapper.vm.openSection).toBe(INITIAL_SECTION);
  });

  it('should find parent section for nested item when hash matches', async () => {
    const itemId = 'item-123';
    const findSectionForId = (id: string): string | null => {
      if (id === itemId) return VALID_SECTIONS[1];
      return null;
    };

    mockRoute.hash = `#${itemId}`;

    const wrapper = mount(createTestComponent(INITIAL_SECTION, VALID_SECTIONS, findSectionForId));
    await nextTick();

    expect(wrapper.vm.openSection).toBe(VALID_SECTIONS[1]);
  });

  it('should scroll to element with correct timing', async () => {
    vi.useFakeTimers();
    mockRoute.hash = `#section-${VALID_SECTIONS[1]}`;

    mount(createTestComponent());
    await nextTick();

    await vi.advanceTimersByTimeAsync(ACCORDION_ANIMATION_TIMING);

    expect(getElementByIdSpy).toHaveBeenCalledWith(`trigger-${VALID_SECTIONS[1]}`);

    vi.useRealTimers();
  });

  it('should handle empty hash', async () => {
    mockRoute.hash = '';

    const wrapper = mount(createTestComponent());
    await nextTick();

    expect(wrapper.vm.openSection).toBe(INITIAL_SECTION);
  });

  it('should not crash when element is not found for scrolling', async () => {
    getElementByIdSpy.mockReturnValue(null);
    mockRoute.hash = `#section-${VALID_SECTIONS[1]}`;

    expect(() => {
      mount(createTestComponent());
    }).not.toThrow();

    await nextTick();
  });

  it('should not close other sections when opening a new one', () => {
    const wrapper = mount(createTestComponent());

    expect(wrapper.vm.openSection).toBe(INITIAL_SECTION);

    wrapper.vm.handleToggle(VALID_SECTIONS[1], true);

    expect(wrapper.vm.openSection).toBe(VALID_SECTIONS[1]);
  });

  it('should only close the currently open section', () => {
    const wrapper = mount(createTestComponent());

    wrapper.vm.handleToggle(VALID_SECTIONS[1], true);
    expect(wrapper.vm.openSection).toBe(VALID_SECTIONS[1]);

    wrapper.vm.handleToggle(INITIAL_SECTION, false);

    expect(wrapper.vm.openSection).toBe(VALID_SECTIONS[1]);
  });

  it('should respond to hash changes after initial load', async () => {
    mockRoute.hash = '';
    const wrapper = mount(createTestComponent());

    await nextTick();
    await nextTick();
    expect(wrapper.vm.openSection).toBe(INITIAL_SECTION);

    mockRoute.hash = `#section-${VALID_SECTIONS[1]}`;
    await nextTick();

    expect(wrapper.vm.openSection).toBe(VALID_SECTIONS[1]);
  });

  it('should handle findSectionForId when provided', async () => {
    const itemId = 'item-collab-1';
    const findSectionForId = (id: string) => {
      if (id === itemId) return VALID_SECTIONS[1];
      return null;
    };

    mockRoute.hash = `#${itemId}`;
    const wrapper = mount(createTestComponent(INITIAL_SECTION, VALID_SECTIONS, findSectionForId));
    await nextTick();

    expect(wrapper.vm.openSection).toBe(VALID_SECTIONS[1]);
  });

  it('should return early when findSectionForId returns null', async () => {
    const findSectionForId = () => null;

    mockRoute.hash = '#unknown-item';
    const wrapper = mount(createTestComponent(INITIAL_SECTION, VALID_SECTIONS, findSectionForId));
    await nextTick();

    expect(wrapper.vm.openSection).toBe(INITIAL_SECTION);
  });
});
