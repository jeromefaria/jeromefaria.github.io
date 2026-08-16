import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ReleaseCover from './ReleaseCover.vue';

const mountCover = (props: Record<string, unknown> = {}) =>
  mount(ReleaseCover, { props: { src: '/images/cover.jpg', alt: 'Album cover', ...props } });

describe('ReleaseCover', () => {
  it('renders a static div cover when no href is given', () => {
    const wrapper = mountCover();

    expect(wrapper.find('div.release-cover--static').exists()).toBe(true);
    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.get('img').attributes('src')).toBe('/images/cover.jpg');
  });

  it('renders an external-link cover when given an href', () => {
    const link = mountCover({ href: 'https://example.bandcamp.com/album/x', bandcamp: true }).get('a.release-cover');

    expect(link.attributes('href')).toBe('https://example.bandcamp.com/album/x');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.classes()).toContain('release-cover--bandcamp');
  });

  it('emits error when the cover image fails to load', async () => {
    const wrapper = mountCover();

    await wrapper.get('img').trigger('error');

    expect(wrapper.emitted('error')).toHaveLength(1);
  });
});
