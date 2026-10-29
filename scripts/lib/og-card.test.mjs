import { describe, expect, it, vi } from 'vitest';

vi.mock('./data-loader.mjs', () => ({
  root: '/fake-root',
  loadSrc: async () => ({
    cardColor: { bg: '#000', text: '#fff', muted: '#a3a3a3', divider: '#2a2a2a' },
    tracking: { display: '0.28em', tighter: '-0.02em' },
    weight: { normal: 400, medium: 500, semibold: 600 },
  }),
}));
vi.mock('./pdf-fonts.mjs', () => ({ interFontFaces: async () => '/* inter faces */' }));
vi.mock('./playwright-render.mjs', () => ({ CARD_WIDTH: 1200, CARD_HEIGHT: 630 }));

const { textCardHtml } = await import('./og-card.mjs');

const card = {
  eyebrow: 'Writing',
  title: 'The Internet Forgets',
  subtitle: 'On link rot and cultural amnesia',
  description: 'A short essay on preservation.',
  footerLeft: 'Jerome Faria',
  footerUrl: 'jeromefaria.com/writing/the-internet-forgets',
};

describe('textCardHtml', () => {
  it('renders a text social card at card dimensions', () => {
    expect(textCardHtml(card)).toMatchSnapshot();
  });

  it('places every field in its slot', () => {
    const html = textCardHtml(card);

    expect(html).toContain('<p class="eyebrow">Writing</p>');
    expect(html).toContain('<h1 class="title">The Internet Forgets</h1>');
    expect(html).toContain('<p class="subtitle">On link rot and cultural amnesia</p>');
    expect(html).toContain('<p class="description">A short essay on preservation.</p>');
    expect(html).toContain('<span>Jerome Faria</span>');
    expect(html).toContain('<span class="url">jeromefaria.com/writing/the-internet-forgets</span>');
  });

  it('omits the description block when no description is given', () => {
    const html = textCardHtml({ ...card, description: undefined });

    expect(html).not.toContain('class="description"');
  });

  it('sizes the body to the card viewport', () => {
    const html = textCardHtml(card);

    expect(html).toContain('width: 1200px;');
    expect(html).toContain('height: 630px;');
  });
});
