import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AccordionSection from './AccordionSection.vue';

const mountSection = (modelValue = false) =>
  mount(AccordionSection, {
    props: { id: 'solo', title: 'Solo', modelValue },
    slots: { default: '<p class="inner">content</p>' },
    attachTo: document.body,
  });

describe('AccordionSection', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('wires the trigger and region ids and aria state', () => {
    const wrapper = mountSection(false);
    const trigger = wrapper.get('.accordion-trigger');
    expect(trigger.attributes('id')).toBe('trigger-solo');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(trigger.attributes('aria-controls')).toBe('content-solo');

    const region = wrapper.get('.accordion-content');
    expect(region.attributes('aria-hidden')).toBe('true');
    expect(region.attributes('aria-labelledby')).toBe('trigger-solo');
  });

  it('reflects the expanded state from modelValue', () => {
    const wrapper = mountSection(true);
    expect(wrapper.get('.accordion-trigger').attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('.accordion-content').attributes('aria-hidden')).toBe('false');
  });

  it('emits update:modelValue(true) when opened', async () => {
    const wrapper = mountSection(false);
    await wrapper.get('.accordion-trigger').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });

  it('emits update:modelValue(false) when collapsed', async () => {
    const wrapper = mountSection(true);
    await wrapper.get('.accordion-trigger').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('scrolls the section into view after opening', async () => {
    vi.useFakeTimers();
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const wrapper = mountSection(false);

    await wrapper.get('.accordion-trigger').trigger('click');
    await vi.runAllTimersAsync();

    expect(scrollSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
