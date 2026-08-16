import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import type { LightboxItem } from '@/types';

import LightboxHost from './LightboxHost.vue';

const images: LightboxItem[] = [
  { type: 'image', src: '/one.jpg', alt: 'One' },
  { type: 'image', src: '/two.jpg', alt: 'Two' },
];

describe('LightboxHost', () => {
  it('renders no overlay until the lightbox is opened', () => {
    const wrapper = mount(LightboxHost);

    expect(wrapper.find('.lightbox').exists()).toBe(false);

    wrapper.unmount();
  });

  it('opens the overlay at the requested item via the exposed openLightbox', async () => {
    const wrapper = mount(LightboxHost, { attachTo: document.body });

    wrapper.vm.openLightbox(images, 1);
    await nextTick();

    expect(wrapper.get('.lightbox').attributes('aria-label')).toBe('Image 2 of 2');

    wrapper.unmount();
  });

  it('tears the overlay down when it emits close', async () => {
    const wrapper = mount(LightboxHost, { attachTo: document.body });

    wrapper.vm.openLightbox(images, 0);
    await nextTick();
    expect(wrapper.find('.lightbox').exists()).toBe(true);

    await wrapper.get('.lightbox__hint--close').trigger('click');

    expect(wrapper.find('.lightbox').exists()).toBe(false);

    wrapper.unmount();
  });
});
