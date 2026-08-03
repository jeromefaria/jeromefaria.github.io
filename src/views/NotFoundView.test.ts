import { describe, expect, it } from 'vitest';

import { navigation } from '@/data/navigation';
import { mountView } from '@/test-support/viewHarness';

import NotFoundView from './NotFoundView.vue';

describe('NotFoundView', () => {
  it('renders the not-found heading', async () => {
    const wrapper = await mountView(NotFoundView, '/nope');
    expect(wrapper.get('h1').text()).toBe('Page Not Found');
  });

  it('offers a Home link plus every nav destination', async () => {
    const wrapper = await mountView(NotFoundView, '/nope');
    const linkTexts = wrapper.findAll('.not-found-nav a').map(link => link.text());
    expect(linkTexts).toContain('Home');
    navigation.forEach(item => expect(linkTexts).toContain(item.title));
  });
});
