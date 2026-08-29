import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ResponsivePicture from './ResponsivePicture.vue';

const MANIFEST_SRC = '/images/contraplacado.jpg';

const mountPicture = (props: Record<string, unknown> = {}) =>
  mount(ResponsivePicture, { props: { src: MANIFEST_SRC, alt: 'Cover', ...props } });

describe('ResponsivePicture', () => {
  it('renders the image with its src and alt', () => {
    const img = mountPicture().get('img');

    expect(img.attributes('src')).toBe(MANIFEST_SRC);
    expect(img.attributes('alt')).toBe('Cover');
  });

  it('emits a responsive webp source with sizes, plus a plain webp fallback', () => {
    const sources = mountPicture({ sizes: '90vw' }).findAll('source');

    expect(sources).toHaveLength(2);
    expect(sources[0].attributes('srcset')).toContain('contraplacado-320w.webp');
    expect(sources[0].attributes('sizes')).toBe('90vw');
    expect(sources[1].attributes('srcset')).toBe('/images/contraplacado.webp');
  });

  it('omits the responsive source for an image not in the manifest', () => {
    const sources = mountPicture({ src: '/images/not-generated.jpg' }).findAll('source');

    expect(sources).toHaveLength(1);
    expect(sources[0].attributes('srcset')).toBe('/images/not-generated.webp');
  });

  it('applies an inline image style', () => {
    const img = mountPicture({ imageStyle: { transform: 'rotate(4deg)' } }).get('img');

    expect(img.attributes('style')).toContain('rotate(4deg)');
  });

  it('reveals the image only once it loads', async () => {
    const wrapper = mountPicture();
    expect(wrapper.get('img').classes()).not.toContain('is-loaded');

    await wrapper.get('img').trigger('load');
    expect(wrapper.get('img').classes()).toContain('is-loaded');
  });

  it('emits error when the image fails to load', async () => {
    const wrapper = mountPicture();

    await wrapper.get('img').trigger('error');

    expect(wrapper.emitted('error')).toHaveLength(1);
  });
});
