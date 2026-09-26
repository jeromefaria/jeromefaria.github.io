import { createHead } from '@unhead/vue/client';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import type { NewsletterIssue } from '@/data/newsletter/types';

import NewsletterIssueView from './NewsletterIssueView.vue';

const FULL: NewsletterIssue = {
  id: 'full',
  date: '2026-05-12',
  subject: 'Full issue',
  blocks: [
    { type: 'prose', markdown: '# Hello\n\nSome **text**.' },
    { type: 'image', src: '/images/performance.jpg', alt: 'Linked photo', label: 'Look', caption: 'A caption', href: 'https://example.com' },
    { type: 'image', src: '/images/performance.jpg', alt: 'Plain photo' },
    { type: 'video', poster: '/images/performance.jpg', href: 'https://youtube.com/watch', embedUrl: 'https://www.youtube-nocookie.com/embed/abc', label: 'Watch', alt: 'Embeddable video', caption: 'watch it' },
    { type: 'video', poster: '/images/performance.jpg', href: 'https://youtube.com/watch', embedUrl: 'https://evil.example/x', alt: 'Blocked embed' },
    { type: 'video', poster: '/images/performance.jpg', href: 'https://youtube.com/watch', alt: 'No embed' },
    { type: 'listen', ref: 'contraplacado', note: 'A listen note' },
    { type: 'live', ref: 'jejum-45' },
    { type: 'writing', ref: 'orchestration' },
    { type: 'listen', ref: 'does-not-exist' },
    { type: 'live', ref: 'does-not-exist' },
    { type: 'writing', ref: 'does-not-exist' },
  ],
};

const ISSUES: Record<string, NewsletterIssue> = { full: FULL };

vi.mock('@/data/newsletter/issues', () => ({
  issueById: (id: string) => ISSUES[id],
}));

const stub = { template: '<div />' };

const mountAt = async (path: string) => {
  const head = createHead();
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/newsletter/:issue', component: NewsletterIssueView },
      { path: '/works/:releaseId', component: stub },
      { path: '/live/:eventId', component: stub },
      { path: '/writing/:slug', component: stub },
      { path: '/:pathMatch(.*)*', component: stub },
    ],
  });
  await router.push(path);
  await router.isReady();
  return mount(NewsletterIssueView, { global: { plugins: [router, head] } });
};

describe('NewsletterIssueView', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('renders the issue eyebrow and prose', async () => {
    const wrapper = await mountAt('/newsletter/full');

    expect(wrapper.get('.newsletter-issue__eyebrow').text()).toContain('Newsletter');
    expect(wrapper.get('.newsletter-issue__prose').html()).toContain('<h1>Hello</h1>');
  });

  it('renders image blocks with and without a link, plus captions', async () => {
    const wrapper = await mountAt('/newsletter/full');
    const figures = wrapper.findAll('.newsletter-issue__figure');

    expect(figures.length).toBe(5);
    expect(wrapper.find('.newsletter-issue__figure a[href="https://example.com"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('A caption');
    expect(figures[0].find('.newsletter-issue__label').text()).toBe('Look');
  });

  it('resolves only existing refs into features (unresolved refs are dropped)', async () => {
    const wrapper = await mountAt('/newsletter/full');
    const features = wrapper.findAll('.newsletter-issue__feature');

    expect(features.length).toBe(3);
    const labels = features.map(feature => feature.get('.newsletter-issue__label').text());
    expect(labels).toEqual(['Listen', 'Live', 'Writing']);
    expect(wrapper.text()).toContain('A listen note');
    expect(wrapper.text()).toContain('BRQN009');
  });

  it('plays an embeddable video inline on click and links out for the rest', async () => {
    const wrapper = await mountAt('/newsletter/full');

    const play = wrapper.get('button.newsletter-issue__play');
    expect(wrapper.findAll('button.newsletter-issue__play')).toHaveLength(1);
    expect(wrapper.findAll('a.newsletter-issue__play[href="https://youtube.com/watch"]')).toHaveLength(2);

    await play.trigger('click');

    expect(wrapper.get('.newsletter-issue__embed iframe').attributes('src')).toBe('https://www.youtube-nocookie.com/embed/abc');
  });

  it('renders NotFound for an unknown issue id', async () => {
    const wrapper = await mountAt('/newsletter/missing');

    expect(wrapper.find('.newsletter-issue').exists()).toBe(false);
    expect(wrapper.html()).not.toContain('newsletter-issue__eyebrow');
  });
});
