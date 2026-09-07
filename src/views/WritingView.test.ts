import { describe, expect, it } from 'vitest';

import { essays } from '@/data/writing';
import { mountView } from '@/test-support/viewHarness';

import WritingView from './WritingView.vue';

describe('WritingView', () => {
  it('lists every essay with its title, formatted date, and link', async () => {
    const wrapper = await mountView(WritingView, '/writing');
    const html = wrapper.html();

    for (const essay of essays) {
      expect(html).toContain(essay.title);
      expect(html).toContain(essay.tagline);
      expect(html).toContain(`/writing/${essay.slug}`);
    }

    expect(html).toContain('7 September 2026');
  });
});
