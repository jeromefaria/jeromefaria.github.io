import { describe, expect, it, vi } from 'vitest';

vi.mock('node:fs', () => ({ readFileSync: () => Buffer.from('hero-bytes') }));
vi.mock('../lib/pdf-fonts.mjs', () => ({ interFontFaces: async () => '/* inter faces */' }));
vi.mock('../lib/playwright-render.mjs', () => ({
  CARD_WIDTH: 1200,
  CARD_HEIGHT: 630,
  renderCard: vi.fn(),
  runAsMain: vi.fn(),
}));
vi.mock('../lib/data-loader.mjs', async () => {
  const { localize } = await import('./generators.fixture.mjs');

  return {
    root: '/fake-root',
    loadSrc: async path => {
      const modules = {
        'data/live.ts': { liveEvents: [] },
        'i18n/localized.ts': { localize },
        'utils/formatters.ts': { formatEventDateRange: () => '15 May 2015' },
        'utils/venueFormat.ts': { venueLabel: () => 'Musicbox, Lisbon' },
        'design/tokens.ts': {
          cardColor: { bg: '#000', text: '#fff', mutedOnImage: '#e5e5e5', secondaryOnImage: '#d4d4d4' },
          tracking: { display: '0.28em', tight: '-0.01em', tighter: '-0.02em' },
          weight: { medium: 500, semibold: 600 },
        },
      };

      return modules[path] ?? {};
    },
  };
});

const { cardFraming, cardHtml, escapeHtml, eventMeta, heroOf, heroStyle } = await import('./generate-og-live.mjs');

describe('heroOf', () => {
  it('prefers the cover image, falling back to the first', () => {
    expect(heroOf({ images: [{ src: 'a.jpg' }, { src: 'b.jpg', cover: true }] })).toEqual({ hero: { src: 'b.jpg', cover: true }, isPoster: false });
    expect(heroOf({ images: [{ src: 'a.jpg' }] })).toEqual({ hero: { src: 'a.jpg' }, isPoster: false });
  });

  it('falls back to posters when there are no images', () => {
    expect(heroOf({ posters: [{ src: 'p.jpg' }] })).toEqual({ hero: { src: 'p.jpg' }, isPoster: true });
  });

  it('returns null when an event has neither images nor posters', () => {
    expect(heroOf({})).toBeNull();
  });
});

describe('cardFraming', () => {
  it('uses an explicit card thumb when present', () => {
    expect(cardFraming({ cardThumb: { scale: 1.2 }, thumb: { scale: 2 } }, false)).toEqual({ scale: 1.2 });
  });

  it('anchors a poster to the top and otherwise uses the thumb', () => {
    expect(cardFraming({}, true)).toEqual({ position: 'center top' });
    expect(cardFraming({ thumb: { position: 'left' } }, false)).toEqual({ position: 'left' });
  });
});

describe('heroStyle', () => {
  it('is empty without a thumb', () => {
    expect(heroStyle(undefined)).toBe('');
  });

  it('assembles object-position and a transform list', () => {
    expect(heroStyle({ position: 'center top', scale: 1.1, rotate: 2, translateX: '10px' })).toBe(
      'object-position:center top;transform:scale(1.1) rotate(2deg) translateX(10px)',
    );
  });

  it('omits the transform when no transform fields are set', () => {
    expect(heroStyle({ position: 'left' })).toBe('object-position:left');
  });

  it('emits only a transform when there is no position', () => {
    expect(heroStyle({ scale: 1.2 })).toBe('transform:scale(1.2)');
  });
});

describe('escapeHtml', () => {
  it('escapes the HTML metacharacters', () => {
    expect(escapeHtml('A & B <C> "D"')).toBe('A &amp; B &lt;C&gt; "D"');
  });
});

describe('eventMeta', () => {
  it('joins the venue and the date range', () => {
    expect(eventMeta({ venue: { name: 'Musicbox', city: 'Lisbon', country: 'PT' }, date: '2015-05-15' }, 'en')).toBe('Musicbox, Lisbon · 15 May 2015');
  });
});

const event = { id: 'basinski', title: { en: 'Heineken Series & More', pt: 'Série Heineken' }, venue: { name: 'Musicbox', city: 'Lisbon', country: 'PT' }, date: '2015-05-15' };
const hero = { src: 'live/basinski.jpg', cardThumb: { position: 'center', translateX: '-40px' } };

describe('cardHtml', () => {
  it('renders the English live-event card', () => {
    expect(cardHtml(event, hero, false, 'en')).toMatchSnapshot();
  });

  it('embeds the hero as a base64 data URI and layers the scrim and wordmark', () => {
    const html = cardHtml(event, hero, false, 'en');

    expect(html).toContain(`src="data:image/jpeg;base64,${Buffer.from('hero-bytes').toString('base64')}"`);
    expect(html).toContain('class="scrim"');
    expect(html).toContain('<p class="wordmark">jeromefaria.com</p>');
  });

  it('applies the card framing to the hero and escapes the localized title', () => {
    const html = cardHtml(event, hero, false, 'en');

    expect(html).toContain('object-position:center;transform:translateX(-40px)');
    expect(html).toContain('<p class="eyebrow">Live</p>');
    expect(html).toContain('<h1 class="title">Heineken Series &amp; More</h1>');
    expect(html).toContain('<p class="meta">Musicbox, Lisbon · 15 May 2015</p>');
  });

  it('uses the Portuguese eyebrow and title in Portuguese', () => {
    const html = cardHtml(event, hero, false, 'pt');

    expect(html).toContain('<p class="eyebrow">Ao vivo</p>');
    expect(html).toContain('<h1 class="title">Série Heineken</h1>');
  });
});
