import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import PressQuote from './PressQuote.vue';

const mountQuote = async (props: { quote: { en: string; pt: string }; source: string; url?: string }) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
  });
  await router.push('/');
  await router.isReady();

  return mount(PressQuote, { props, global: { plugins: [router] } });
};

describe('PressQuote', () => {
  it('renders the localized quote body as HTML', async () => {
    const wrapper = await mountQuote({ quote: { en: '<em>Luminous</em>', pt: 'Luminoso' }, source: 'The Wire' });

    expect(wrapper.get('blockquote p').html()).toContain('<em>Luminous</em>');
  });

  it('links the source through a new-tab external link when a url is given', async () => {
    const wrapper = await mountQuote({ quote: { en: 'q', pt: 'q' }, source: 'The Wire', url: 'https://thewire.co.uk' });

    const link = wrapper.get('a');
    expect(link.attributes('href')).toBe('https://thewire.co.uk');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.text()).toContain('The Wire');
  });

  it('renders the source as plain text when no url is given', async () => {
    const wrapper = await mountQuote({ quote: { en: 'q', pt: 'q' }, source: 'Blow Up' });

    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.get('strong').text()).toBe('Blow Up');
  });
});
