import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import TrackListItem from './TrackListItem.vue';

describe('TrackListItem', () => {
  it('renders a plain title with no artist', () => {
    const wrapper = mount(TrackListItem, { props: { track: { title: 'Attack (Prelude)' } } });

    expect(wrapper.text()).toBe('Attack (Prelude)');
    expect(wrapper.find('a').exists()).toBe(false);
  });

  it('links a credited artist and separates it from the title', () => {
    const wrapper = mount(TrackListItem, {
      props: { track: { title: 'Attack (Prelude)', artist: { name: 'CAVERNANCIA', url: 'https://cavernancia.bandcamp.com/' } } },
    });
    const link = wrapper.get('a');

    expect(link.text()).toBe('CAVERNANCIA');
    expect(link.attributes('href')).toBe('https://cavernancia.bandcamp.com/');
    // textContent (not .text(), which trims at node boundaries) preserves the separator spacing.
    expect(wrapper.element.textContent).toBe('CAVERNANCIA — Attack (Prelude)');
  });

  it('inlines an unlinked artist as text', () => {
    const wrapper = mount(TrackListItem, {
      props: { track: { title: 'Costa Norte', artist: { name: 'sol' } } },
    });

    expect(wrapper.find('a').exists()).toBe(false);
    // textContent (not .text(), which trims at node boundaries) preserves the separator spacing.
    expect(wrapper.element.textContent).toBe('sol — Costa Norte');
  });
});
