import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import AccordionSection from '@/components/AccordionSection.vue';
import EventItem from '@/components/EventItem.vue';
import LightboxOverlay from '@/components/LightboxOverlay.vue';
import { liveEvents, liveYears } from '@/data/live';
import { mountView } from '@/test-support/viewHarness';

import LiveView from './LiveView.vue';

const expandedYears = (wrapper: Awaited<ReturnType<typeof mountView>>): string[] =>
  liveYears.filter(year => wrapper.get(`#trigger-${year}`).attributes('aria-expanded') === 'true');

describe('LiveView', () => {
  afterEach(() => {
    window.history.replaceState(null, '', window.location.pathname);
  });

  it('forwards an event open-lightbox event to the lightbox host', async () => {
    const wrapper = await mountView(LiveView, '/live');
    expect(wrapper.findComponent(LightboxOverlay).exists()).toBe(false);

    wrapper.findComponent(EventItem).vm.$emit('open-lightbox', [{ type: 'image', src: '/x.jpg', alt: 'x' }], 0);
    await nextTick();

    expect(wrapper.findComponent(LightboxOverlay).exists()).toBe(true);
  });

  it('updates the URL hash when an event requests it', async () => {
    const wrapper = await mountView(LiveView, '/live');

    wrapper.findComponent(EventItem).vm.$emit('update-hash', 'showcase-casa-amarela');

    expect(window.location.hash).toBe('#showcase-casa-amarela');
  });

  it('renders an accordion section for every year', async () => {
    const wrapper = await mountView(LiveView, '/live');
    expect(wrapper.findAllComponents(AccordionSection)).toHaveLength(liveYears.length);
  });

  it('renders an event item for every performance', async () => {
    const wrapper = await mountView(LiveView, '/live');
    const totalEvents = liveEvents.length;
    expect(wrapper.findAllComponents(EventItem)).toHaveLength(totalEvents);
  });

  it('opens only the most recent year by default', async () => {
    const wrapper = await mountView(LiveView, '/live');
    expect(expandedYears(wrapper)).toEqual([liveYears[0]]);
  });

  it('opens the year that owns a deep-linked event id from the URL hash', async () => {
    const wrapper = await mountView(LiveView, '/live#showcase-casa-amarela');
    await nextTick();
    expect(expandedYears(wrapper)).toEqual(['2025']);
  });

  it('switches the open year when another year trigger is activated', async () => {
    const wrapper = await mountView(LiveView, '/live');
    const secondYear = liveYears[1];

    await wrapper.get(`#trigger-${secondYear}`).trigger('click');
    await nextTick();

    expect(expandedYears(wrapper)).toEqual([secondYear]);
  });
});
