import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import { navigation, siteConfig } from '@/data/navigation';
import { messages } from '@/i18n/messages';

import SiteFooter from './SiteFooter.vue';

vi.mock('@/i18n/flag', () => ({ i18nEnabled: true }));

const enNavLabel = (labelKey: string): string =>
  messages.en.nav[labelKey.slice(4) as keyof typeof messages.en.nav];

const switchLabel = messages.en.common.switchLanguageLabel;

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/cv', meta: { englishOnly: true }, component: { template: '<div />' } },
    { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
  ],
});

const mountFooter = async (path = '/') => {
  await router.push(path);
  await router.isReady();
  return mount(SiteFooter, { global: { plugins: [router] } });
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

  it('offers the language switch on a route that has an alternate', async () => {
    const wrapper = await mountFooter('/');
    expect(wrapper.find(`a[aria-label="${switchLabel}"]`).exists()).toBe(true);
  });

  it('hides the language switch on an English-only route', async () => {
    const wrapper = await mountFooter('/cv');
    expect(wrapper.find(`a[aria-label="${switchLabel}"]`).exists()).toBe(false);
  });
});
