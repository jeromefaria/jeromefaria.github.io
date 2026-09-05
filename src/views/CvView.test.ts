import { describe, expect, it } from 'vitest';

import { mountView } from '@/test-support/viewHarness';

import CvView from './CvView.vue';

describe('CvView', () => {
  it('renders the résumé content from the markdown source', async () => {
    const wrapper = await mountView(CvView, '/cv');
    const html = wrapper.html();

    expect(html).toContain('Jerome Faria');
    expect(html).toContain('Senior Frontend Developer');
    expect(html).toContain('Selected Work');
  });

  it('offers a downloadable PDF link', async () => {
    const wrapper = await mountView(CvView, '/cv');
    const link = wrapper.find('a[href="/jerome-faria-cv.pdf"]');

    expect(link.exists()).toBe(true);
    expect(link.attributes('download')).toBeDefined();
  });
});
