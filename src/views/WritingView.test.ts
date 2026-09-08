import { describe, expect, it } from 'vitest';

import { essays } from '@/data/writing';
import { mountView } from '@/test-support/viewHarness';

import WritingView from './WritingView.vue';

describe('WritingView', () => {
  it('lists every essay with its title, formatted date, and link', async () => {
    const wrapper = await mountView(WritingView, '/writing');
    const html = wrapper.html();
    const text = wrapper.text();

    for (const essay of essays) {
      expect(text).toContain(essay.title);
      expect(text).toContain(essay.tagline);
      expect(html).toContain(`/writing/${essay.slug}`);
    }

    expect(text).toContain('7 September 2026');
  });
});
