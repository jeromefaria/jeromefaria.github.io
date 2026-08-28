import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import AccordionSection from '@/components/AccordionSection.vue';
import EngineeringCreditItem from '@/components/EngineeringCreditItem.vue';
import LightboxOverlay from '@/components/LightboxOverlay.vue';
import ReleaseItem from '@/components/ReleaseItem.vue';
import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { stop, usePlayer } from '@/composables/usePlayer';
import { worksData, worksSections } from '@/data/works';
import { mountView } from '@/test-support/viewHarness';

import WorksView from './WorksView.vue';

const expandedSections = (wrapper: Awaited<ReturnType<typeof mountView>>): string[] =>
  worksSections.filter(section => wrapper.get(`#trigger-${section}`).attributes('aria-expanded') === 'true');

describe('WorksView', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    audioPlayerEnabled.value = true;
    stop();
  });

  afterEach(() => {
    window.history.replaceState(null, '', window.location.pathname);
  });

  it('forwards a release open-lightbox event to the lightbox host', async () => {
    const wrapper = await mountView(WorksView, '/works');
    expect(wrapper.findComponent(LightboxOverlay).exists()).toBe(false);

    wrapper.findComponent(ReleaseItem).vm.$emit('open-lightbox', [{ type: 'image', src: '/x.jpg', alt: 'x' }], 0);
    await nextTick();

    expect(wrapper.findComponent(LightboxOverlay).exists()).toBe(true);
  });

  it('updates the URL hash when a release requests it', async () => {
    const wrapper = await mountView(WorksView, '/works');

    wrapper.findComponent(ReleaseItem).vm.$emit('update-hash', 'contraplacado');

    expect(window.location.hash).toBe('#contraplacado');
  });

  it('renders an accordion section for every works category', async () => {
    const wrapper = await mountView(WorksView, '/works');
    expect(wrapper.findAllComponents(AccordionSection)).toHaveLength(worksSections.length);
  });

  it('renders a release item for every non-credit release, and a credit for each engineering entry', async () => {
    const wrapper = await mountView(WorksView, '/works');
    const items = Object.values(worksData).flatMap(section => section.items);
    const releases = items.filter(item => item.meta.kind !== 'engineering');
    const credits = items.filter(item => item.meta.kind === 'engineering');

    expect(wrapper.findAllComponents(ReleaseItem)).toHaveLength(releases.length);
    expect(wrapper.findAllComponents(EngineeringCreditItem)).toHaveLength(credits.length);
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

  it('opens the owning section for a /works/:id release permalink', async () => {
    const wrapper = await mountView(WorksView, '/works/overlapse-xiii');
    await nextTick();
    expect(expandedSections(wrapper)).toEqual(['collaborations']);
  });

  it('plays an audio-backed release opened via its permalink', async () => {
    await mountView(WorksView, '/works/overlapse');
    await flushPromises();
    expect(usePlayer().currentTrack.value?.key).toContain('BRQN002');
  });

  it('starts at the track named by ?track=', async () => {
    await mountView(WorksView, '/works/overlapse?track=2');
    await flushPromises();
    expect(usePlayer().currentTrack.value?.title).toBe('Sustain I');
  });

  it('cues a chaptered single file at the ?t= offset', async () => {
    await mountView(WorksView, '/works/2504?t=572');
    await flushPromises();
    expect(usePlayer().currentTrack.value?.key).toContain('BRQN006');
  });

  it('does not play for an unknown release id', async () => {
    await mountView(WorksView, '/works/does-not-exist');
    await flushPromises();
    expect(usePlayer().currentTrack.value).toBeNull();
  });

  it('does not play when the audio player is disabled', async () => {
    audioPlayerEnabled.value = false;
    await mountView(WorksView, '/works/overlapse');
    await flushPromises();
    expect(usePlayer().currentTrack.value).toBeNull();
  });

  it('switches the open section when another category trigger is activated', async () => {
    const wrapper = await mountView(WorksView, '/works');

    await wrapper.get('#trigger-film').trigger('click');
    await nextTick();

    expect(expandedSections(wrapper)).toEqual(['film']);
  });
});
