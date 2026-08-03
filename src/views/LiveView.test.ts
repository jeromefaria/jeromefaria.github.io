import { describe, expect, it } from 'vitest';

import AccordionSection from '@/components/AccordionSection.vue';
import EventItem from '@/components/EventItem.vue';
import { liveData, liveYears } from '@/data/live';
import { mountView } from '@/test-support/viewHarness';

import LiveView from './LiveView.vue';

describe('LiveView', () => {
  it('renders an accordion section for every year', async () => {
    const wrapper = await mountView(LiveView, '/live');
    expect(wrapper.findAllComponents(AccordionSection)).toHaveLength(liveYears.length);
  });

  it('renders an event item for every performance', async () => {
    const wrapper = await mountView(LiveView, '/live');
    const totalEvents = Object.values(liveData).reduce((sum, year) => sum + year.items.length, 0);
    expect(wrapper.findAllComponents(EventItem)).toHaveLength(totalEvents);
  });
});
