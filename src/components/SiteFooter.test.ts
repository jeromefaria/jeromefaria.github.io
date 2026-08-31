import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import { navigation, siteConfig } from '@/data/navigation';
import { messages } from '@/i18n/messages';

import SiteFooter from './SiteFooter.vue';

const enNavLabel = (labelKey: string): string =>
  messages.en.nav[labelKey.slice(4) as keyof typeof messages.en.nav];

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
});

const mountFooter = async () => {
  const wrapper = mount(SiteFooter, { global: { plugins: [router] } });
  await router.isReady();
  return wrapper;
};

describe('SiteFooter', () => {
  it('renders a link for every nav item', async () => {
    const wrapper = await mountFooter();
    const navLinks = wrapper.findAll('.footer__nav a');
    expect(navLinks).toHaveLength(navigation.length);
    expect(navLinks.map(link => link.text())).toEqual(navigation.map(item => enNavLabel(item.labelKey)));
  });

  it('no longer renders the social links block', async () => {
    const wrapper = await mountFooter();
    expect(wrapper.find('.social-links').exists()).toBe(false);
  });

  it('shows the current year and author in the copyright', async () => {
    const wrapper = await mountFooter();
    const copyright = wrapper.get('.footer__copyright');
    expect(copyright.text()).toContain(String(new Date().getFullYear()));
    expect(copyright.text()).toContain(siteConfig.author.name);
  });
});
