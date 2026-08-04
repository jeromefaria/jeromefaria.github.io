import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import AccordionSection from '@/components/AccordionSection.vue';
import ReleaseItem from '@/components/ReleaseItem.vue';
import { worksData, worksSections } from '@/data/works';
import { mountView } from '@/test-support/viewHarness';

import WorksView from './WorksView.vue';

const expandedSections = (wrapper: Awaited<ReturnType<typeof mountView>>): string[] =>
  worksSections.filter(section => wrapper.get(`#trigger-${section}`).attributes('aria-expanded') === 'true');

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

  it('has a page heading and wraps each accordion trigger in a heading', async () => {
    const wrapper = await mountView(WorksView, '/works');
    expect(wrapper.get('h1.visually-hidden').text()).toBe('Works');
    expect(wrapper.findAll('h2.accordion-heading .accordion-trigger')).toHaveLength(worksSections.length);
  });

  it('opens the solo section by default', async () => {
    const wrapper = await mountView(WorksView, '/works');
    expect(expandedSections(wrapper)).toEqual(['solo']);
  });

  it('opens the section that owns a deep-linked release id from the URL hash', async () => {
    // `overlapse-xiii` lives under collaborations, not the default solo section.
    const wrapper = await mountView(WorksView, '/works#overlapse-xiii');
    await nextTick();
    expect(expandedSections(wrapper)).toEqual(['collaborations']);
  });

  it('switches the open section when another category trigger is activated', async () => {
    const wrapper = await mountView(WorksView, '/works');

    await wrapper.get('#trigger-film').trigger('click');
    await nextTick();

    expect(expandedSections(wrapper)).toEqual(['film']);
  });
});
