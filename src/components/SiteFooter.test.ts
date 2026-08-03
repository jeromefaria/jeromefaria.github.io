import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import { navigation, siteConfig, social } from '@/data/navigation';

import SiteFooter from './SiteFooter.vue';

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
    expect(navLinks.map(link => link.text())).toEqual(navigation.map(item => item.title));
  });

  it('renders social links as external, safely-relled anchors', async () => {
    const wrapper = await mountFooter();
    const links = wrapper.findAll('.social-links a');

    expect(links).toHaveLength(social.length);
    social.forEach((item, index) => {
      const link = links[index];
      expect(link?.attributes('href')).toBe(item.url);
      expect(link?.attributes('target')).toBe('_blank');
      expect(link?.attributes('rel')).toBe('noopener noreferrer');
      expect(link?.attributes('aria-label')).toBe(`${siteConfig.author.name} on ${item.name} (opens in a new tab)`);
    });
  });

  it('shows the current year and author in the copyright', async () => {
    const wrapper = await mountFooter();
    const copyright = wrapper.get('.footer__copyright');
    expect(copyright.text()).toContain(String(new Date().getFullYear()));
    expect(copyright.text()).toContain(siteConfig.author.name);
  });
});
