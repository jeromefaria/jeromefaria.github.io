import { describe, expect, it } from 'vitest';

import AccordionSection from '@/components/AccordionSection.vue';
import ReleaseItem from '@/components/ReleaseItem.vue';
import { worksData, worksSections } from '@/data/works';
import { mountView } from '@/test-support/viewHarness';

import WorksView from './WorksView.vue';

describe('WorksView', () => {
  it('renders an accordion section for every works category', async () => {
    const wrapper = await mountView(WorksView, '/works');
    expect(wrapper.findAllComponents(AccordionSection)).toHaveLength(worksSections.length);
  });

  it('renders a release item for every release across all sections', async () => {
    const wrapper = await mountView(WorksView, '/works');
    const totalReleases = Object.values(worksData).reduce((sum, section) => sum + section.items.length, 0);
    expect(wrapper.findAllComponents(ReleaseItem)).toHaveLength(totalReleases);
  });
});
