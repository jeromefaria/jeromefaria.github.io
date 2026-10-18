import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/data-loader.mjs', () => ({
  root: '/fake-root',
  loadSrc: async path => {
    if (path === 'design/tokens.ts') {
      return { color: { light: { bg: '#faf9f7', text: '#1a1a1a', secondary: '#555555', muted: '#888888', border: '#e0e0e0', borderSubtle: '#efefef' } } };
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
    if (path === 'data/live.ts') {
      return { liveEvents: [{ id: 'show', title: 'A Show', venue: { name: 'Venue', city: 'City' }, date: '2026-02-01' }] };
    }
    if (path === 'data/writing.ts') {
      return { essayBySlug: slug => (slug === 'my-essay' ? { slug: 'my-essay', title: 'My Essay', tagline: 'A tagline' } : undefined) };
    }
    if (path === 'utils/newsletterCredit.ts') {
      return {
        releasePhotoCredit: () => ({ prefix: 'Photo by', html: '<a href="https://example.com/p">A Photographer</a>' }),
        eventPhotoCredit: () => null,
      };
    }
    if (path === 'utils/newsletterUrl.ts') return import('../../src/utils/newsletterUrl.ts');
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

const { renderIssueEmail, renderIssueText } = await import('./render.mjs');

const issue = {
  id: '2026-01-01',
  date: '2026-01-01',
  subject: 'Test Issue',
  blocks: [
    { type: 'prose', markdown: 'Hello **world**.' },
    { type: 'image', src: '/images/photo.jpg', alt: 'A photo', label: 'Look', caption: 'A caption' },
    { type: 'video', poster: '/images/poster.jpg', href: 'https://youtu.be/abc', alt: 'A video', label: 'Watch' },
    { type: 'works', ref: 'contraplacado', note: 'Out now.' },
    { type: 'quote', quote: 'An almost <em>romantic</em> sound.', source: 'The Quietus', url: 'https://thequietus.com/' },
    { type: 'cta', label: 'Subscribe', href: 'https://jeromefaria.com/newsletter' },
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

  it('renders a standalone cta block as a filled button link', () => {
    const { html } = renderIssueEmail(issue, opts);
    expect(html).toContain('Subscribe');
    expect(html).toContain('href="https://jeromefaria.com/newsletter"');
  });

  it('renders a quote block, keeping inline markup and linking the source', () => {
    const { html } = renderIssueEmail(issue, opts);

    expect(html).toContain('An almost <em>romantic</em> sound.');
    expect(html).toContain('>The Quietus</a>');
  });

  it('renders a photo credit under the works cover', () => {
    const { html } = renderIssueEmail(issue, opts);

    expect(html).toContain('Photo by');
    expect(html).toContain('>A Photographer</a>');
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

  it('escapes HTML in the subject and renders the works feature meta', () => {
    const { html } = renderIssueEmail({ ...issue, subject: 'A & B <tag>' }, opts);

    expect(html).toContain('A &amp; B &lt;tag&gt;');
    expect(html).toContain('Test Label');
    expect(html).toContain('TL001');
  });
});

const textIssue = {
  id: '2026-01-01',
  date: '2026-01-01',
  subject: 'Test Issue',
  blocks: [
    { type: 'prose', markdown: 'Hello **world**, see [the site](https://jeromefaria.com/a_b).\n\nSecond paragraph.' },
    { type: 'image', src: '/images/photo.jpg', alt: 'A photo', label: 'Look', caption: 'A caption', href: 'https://jeromefaria.com/p' },
    { type: 'video', poster: '/images/poster.jpg', href: 'https://youtu.be/abc', alt: 'A video', label: 'Watch', caption: 'A clip' },
    { type: 'works', ref: 'contraplacado', note: 'Out **now**.' },
    { type: 'live', ref: 'show', note: 'Come along.' },
    { type: 'writing', ref: 'my-essay' },
    { type: 'quote', quote: 'An almost <em>romantic</em> sound.', source: 'The Quietus', url: 'https://thequietus.com/' },
    { type: 'cta', label: 'Subscribe', href: 'https://jeromefaria.com/newsletter' },
  ],
};

describe('renderIssueText', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T00:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('renders a stable plain-text alternative covering every block type', () => {
    expect(renderIssueText(textIssue, opts)).toMatchSnapshot();
  });

  it('strips markdown to readable text while preserving link URLs intact', () => {
    const text = renderIssueText(textIssue, opts);

    expect(text).toContain('Hello world, see the site (https://jeromefaria.com/a_b).');
    expect(text).toContain('Second paragraph.');
    expect(text).not.toMatch(/<\/?[a-z]/i);
  });

  it('describes image and video blocks with their alt text and links', () => {
    const text = renderIssueText(textIssue, opts);

    expect(text).toContain('LOOK\n[Image: A photo]\nA caption\nhttps://jeromefaria.com/p');
    expect(text).toContain('WATCH\n[Video: A video]\nA clip\nWatch: https://youtu.be/abc');
  });

  it('renders works, live and writing sections with their meta and canonical URLs', () => {
    const text = renderIssueText(textIssue, opts);

    expect(text).toContain('WORKS\nContraplacado\nReleased: January 2026\nFormat: LP\nLabel: Test Label\nCatalog: TL001');
    expect(text).toContain('Out now.');
    expect(text).toContain('https://jeromefaria.com/works/contraplacado');
    expect(text).toContain('LIVE\nA Show\nDate: January 2026\nVenue: Venue\nCity: City');
    expect(text).toContain('https://jeromefaria.com/live/show');
    expect(text).toContain('WRITING\nMy Essay\n\nA tagline\n\nhttps://jeromefaria.com/writing/my-essay');
  });

  it('renders a quote with its attribution and a cta as a labelled link', () => {
    const text = renderIssueText(textIssue, opts);

    expect(text).toContain('An almost romantic sound.');
    expect(text).toContain('— The Quietus https://thequietus.com/');
    expect(text).toContain('Subscribe: https://jeromefaria.com/newsletter');
  });

  it('wires the masthead, date, view-in-browser, and unsubscribe lines', () => {
    const text = renderIssueText(textIssue, opts);

    expect(text).toContain('Jerome Faria — Sound Artist & Composer');
    expect(text).toContain('January 1, 2026');
    expect(text).toContain('View in browser: https://jeromefaria.com/newsletter/2026-01-01');
    expect(text).toContain('© 2004–2026 Jerome Faria');
    expect(text).toContain('Privacy: https://jeromefaria.com/privacy');
    expect(text).toContain('Unsubscribe: https://contact.jeromefaria.workers.dev/newsletter/unsubscribe?token=TESTTOKEN');
  });

  it('omits the date, view and unsubscribe lines for a standalone invite', () => {
    const text = renderIssueText(textIssue, { origin: 'https://jeromefaria.com', embedImages: false, dated: false });

    expect(text).not.toContain('January 1, 2026');
    expect(text).not.toContain('View in browser');
    expect(text).not.toContain('Unsubscribe:');
  });

  it('omits the meta grid for a hideMeta works block, keeping the title and url', () => {
    const text = renderIssueText({ ...textIssue, blocks: [{ type: 'works', ref: 'contraplacado', hideMeta: true }] }, opts);

    expect(text).toContain('WORKS\nContraplacado');
    expect(text).not.toContain('Released:');
    expect(text).not.toContain('Catalog:');
    expect(text).toContain('https://jeromefaria.com/works/contraplacado');
  });

  it('keeps an inline markdown image in prose as a described placeholder', () => {
    const text = renderIssueText({ ...textIssue, blocks: [{ type: 'prose', markdown: 'See ![a diagram](https://jeromefaria.com/d.png) here.' }] }, opts);

    expect(text).toContain('See [Image: a diagram] here.');
  });

  it('drops sections whose referenced release, event or essay is unknown', () => {
    const text = renderIssueText(
      { ...textIssue, blocks: [
        { type: 'works', ref: 'nope' },
        { type: 'live', ref: 'nope' },
        { type: 'writing', ref: 'nope' },
        { type: 'prose', markdown: 'Only this.' },
      ] },
      opts,
    );

    expect(text).toContain('Only this.');
    expect(text).not.toContain('WORKS');
    expect(text).not.toContain('LIVE');
    expect(text).not.toContain('WRITING');
  });
});
