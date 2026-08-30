import { describe, expect, it } from 'vitest';

import { paletteOpen } from '@/composables/useOverlays';
import { colophonContent } from '@/data/colophon';
import { mountView } from '@/test-support/viewHarness';

import ColophonView from './ColophonView.vue';

describe('ColophonView', () => {
  it('renders the intro and every section heading', async () => {
    const wrapper = await mountView(ColophonView);

    expect(wrapper.get('.colophon__intro').text()).toBe(colophonContent.intro);
    const headings = wrapper.findAll('.colophon__heading').map(heading => heading.text());
    expect(headings).toEqual(colophonContent.sections.map(section => section.heading));
  });

  it('links to the source repository', async () => {
    const wrapper = await mountView(ColophonView);
    const links = wrapper.findAll('.colophon__body a').map(anchor => anchor.attributes('href'));
    expect(links).toContain('https://github.com/jeromefaria/jeromefaria.github.io');
  });

  it('opens the hidden command palette from the ⌘K cue', async () => {
    paletteOpen.value = false;
    const wrapper = await mountView(ColophonView);

    await wrapper.get('.palette-cue').trigger('click');

    expect(paletteOpen.value).toBe(true);
    paletteOpen.value = false;
  });

  it('routes the internal privacy link through the router instead of reloading', async () => {
    const wrapper = await mountView(ColophonView);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    wrapper.get('a[href="/privacy"]').element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
