import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../data-loader.mjs', () => ({
  root: '/fake-root',
  loadSrc: async path => {
    if (path === 'design/tokens.ts') {
      return { color: { light: { bg: '#faf9f7', text: '#1a1a1a', secondary: '#555555', muted: '#888888', border: '#e0e0e0' } } };
    }
    if (path === 'data/works.ts') {
      return {
        releaseById: new Map([
          ['contraplacado', {
            id: 'contraplacado',
            title: 'Contraplacado',
            coverImage: '/images/contraplacado.jpg',
            meta: { kind: 'music', released: '2026-01-01', mediums: ['LP'], editions: [{ label: { text: 'Test Label' }, catalog: 'TL001' }] },
          }],
        ]),
      };
    }
    if (path === 'data/live.ts') return { liveEvents: [] };
    if (path === 'data/writing.ts') return { essayBySlug: () => undefined };
    if (path === 'i18n/localized.ts') return { localize: value => (typeof value === 'string' ? value : value.en) };
    if (path === 'utils/formatters.ts') {
      return {
        formatEventDateRange: () => 'January 2026',
        formatMonthYear: value => new Date(value).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
        formatLongDate: value => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
      };
    }
    return {};
  },
}));

const { renderIssueEmail } = await import('./render.mjs');

const issue = {
  id: '2026-01-01',
  date: '2026-01-01',
  subject: 'Test Issue',
  blocks: [
    { type: 'prose', markdown: 'Hello **world**.' },
    { type: 'image', src: '/images/photo.jpg', alt: 'A photo', label: 'Look', caption: 'A caption' },
    { type: 'video', poster: '/images/poster.jpg', href: 'https://youtu.be/abc', alt: 'A video', label: 'Watch' },
    { type: 'listen', ref: 'contraplacado', note: 'Out now.' },
  ],
};

const opts = {
  origin: 'https://jeromefaria.com',
  embedImages: false,
  viewUrl: 'https://jeromefaria.com/newsletter/2026-01-01',
  unsubscribeUrl: 'https://contact.jeromefaria.workers.dev/newsletter/unsubscribe?token=TESTTOKEN',
};

describe('renderIssueEmail', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T00:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('renders a stable, email-safe HTML document', () => {
    const { subject, html } = renderIssueEmail(issue, opts);

    expect(subject).toBe('Test Issue');
    expect(html).toMatchSnapshot();
  });

  it('uses absolute image URLs, never data URIs, when not embedding', () => {
    const { html } = renderIssueEmail(issue, opts);

    expect(html).toContain('src="https://jeromefaria.com/images/photo.jpg"');
    expect(html).not.toContain('data:image');
  });

  it('wires the view-in-browser and unsubscribe URLs into the document', () => {
    const { html } = renderIssueEmail(issue, opts);

    expect(html).toContain(opts.viewUrl);
    expect(html).toContain(opts.unsubscribeUrl);
  });

  it('escapes HTML in the subject and renders the listen feature meta', () => {
    const { html } = renderIssueEmail({ ...issue, subject: 'A & B <tag>' }, opts);

    expect(html).toContain('A &amp; B &lt;tag&gt;');
    expect(html).toContain('Test Label');
    expect(html).toContain('TL001');
  });
});
