import { describe, expect, it } from 'vitest';

import { paletteOpen } from '@/composables/useOverlays';
import { privacyContent } from '@/data/privacy';
import { mountView } from '@/test-support/viewHarness';

import PrivacyView from './PrivacyView.vue';

describe('PrivacyView', () => {
  it('renders the intro and every section heading', async () => {
    const wrapper = await mountView(PrivacyView);

    expect(wrapper.get('.privacy__intro').text()).toBe(privacyContent.intro);
    const headings = wrapper.findAll('.privacy__heading').map(heading => heading.text());
    expect(headings).toEqual(privacyContent.sections.map(section => section.heading));
  });

  it('references the Turnstile Privacy Addendum', async () => {
    const wrapper = await mountView(PrivacyView);
    const links = wrapper.findAll('.privacy__body a').map(anchor => anchor.attributes('href'));
    expect(links).toContain('https://www.cloudflare.com/turnstile-privacy-policy/');
  });

  it('shows the last-updated date', async () => {
    const wrapper = await mountView(PrivacyView);
    expect(wrapper.get('.privacy__updated').text()).toContain(privacyContent.updated);
  });

  it('opens the hidden command palette from the cue in the notice', async () => {
    paletteOpen.value = false;
    const wrapper = await mountView(PrivacyView);

    await wrapper.get('.palette-cue').trigger('click');

    expect(paletteOpen.value).toBe(true);
    paletteOpen.value = false;
  });
});
