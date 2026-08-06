import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import { navigation, siteConfig } from '@/data/navigation';

import SiteHeader from './SiteHeader.vue';

const makeRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/about', component: { template: '<div />' } },
    ],
  });

const mountHeader = async () => {
  const router = makeRouter();
  router.push('/');
  await router.isReady();
  const wrapper = mount(SiteHeader, { global: { plugins: [router] }, attachTo: document.body });
  return { wrapper, router };
};

describe('SiteHeader', () => {
  it('renders the site title and tagline', async () => {
    const { wrapper } = await mountHeader();
    expect(wrapper.get('.masthead-title').text()).toContain(siteConfig.title);
    expect(wrapper.get('.masthead-tagline').text()).toBe(siteConfig.tagline);
  });

  it('renders a link for every nav item', async () => {
    const { wrapper } = await mountHeader();
    const links = wrapper.findAll('.nav__link');
    expect(links.map(link => link.text())).toEqual(navigation.map(item => item.title));
  });

  it('toggles the menu open and closed, reflecting aria-expanded', async () => {
    const { wrapper } = await mountHeader();
    const toggle = wrapper.get('.nav-toggle');

    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('.nav--open').exists()).toBe(false);

    await toggle.trigger('click');
    expect(toggle.attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('.nav--open').exists()).toBe(true);

    await toggle.trigger('click');
    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('.nav--open').exists()).toBe(false);
  });

  it('closes an open menu when the route changes', async () => {
    const { wrapper, router } = await mountHeader();

    await wrapper.get('.nav-toggle').trigger('click');
    expect(wrapper.find('.nav--open').exists()).toBe(true);

    await router.push('/about');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.nav--open').exists()).toBe(false);
  });

  it('associates the toggle with the nav via aria-controls', async () => {
    const { wrapper } = await mountHeader();
    expect(wrapper.get('.nav-toggle').attributes('aria-controls')).toBe('primary-nav');
    expect(wrapper.get('nav').attributes('id')).toBe('primary-nav');
  });

  it('moves focus to the menu container (not an interactive link) when opened', async () => {
    const { wrapper } = await mountHeader();
    await wrapper.get('.nav-toggle').trigger('click');
    await wrapper.vm.$nextTick();
    // Focusing the tabindex="-1" container lands keyboard/AT users in the nav
    // region without giving a link a focus ring on a touch-opened menu.
    const nav = wrapper.get('#primary-nav');
    expect(nav.attributes('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(nav.element);
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    const { wrapper } = await mountHeader();
    await wrapper.get('.nav-toggle').trigger('click');
    expect(wrapper.find('.nav--open').exists()).toBe(true);

    await wrapper.get('#primary-nav').trigger('keydown', { key: 'Escape' });

    expect(wrapper.find('.nav--open').exists()).toBe(false);
    expect(document.activeElement).toBe(wrapper.get('.nav-toggle').element);
  });

  it('renders the site title as branding, not a page heading', async () => {
    const { wrapper } = await mountHeader();
    expect(wrapper.get('.masthead-title').element.tagName).toBe('P');
    expect(wrapper.find('h1').exists()).toBe(false);
  });
});
