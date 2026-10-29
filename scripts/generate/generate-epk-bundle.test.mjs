import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/playwright-render.mjs', () => ({ renderPdf: vi.fn(), withBrowser: vi.fn(), runAsMain: vi.fn() }));
vi.mock('../lib/pdf-styles.mjs', () => ({ baseStyles: async () => '' }));
vi.mock('../lib/data-loader.mjs', async () => {
  const { FAKE_ROOT, makeLoadSrc } = await import('./generators.fixture.mjs');

  return { root: FAKE_ROOT, loadSrc: makeLoadSrc() };
});

const { bundleHtml, rows } = await import('./generate-epk-bundle.mjs');

const content = {
  longBio: '<p>Long bio paragraph.</p>',
  quotes: [{ quote: { en: 'An almost romantic sound.', pt: 'Um som quase romântico.' }, source: 'The Quietus' }],
  liveHighlights: [{ year: '2015', id: 'basinski', title: 'Heineken Series', location: 'Musicbox, Lisbon' }],
  workHighlights: [{ year: '2024', id: '2504', title: '2504' }],
  sharedStages: [{ name: 'William Basinski', url: 'https://williambasinski.com' }, { name: 'Taylor Deupree' }],
};

describe('rows', () => {
  it('renders a year cell and a body cell per item', () => {
    expect(rows([{ year: '2024', body: 'A work' }])).toBe('<div class="year">2024</div><div>A work</div>');
  });
});

describe('bundleHtml', () => {
  it('renders the English press kit document', () => {
    expect(bundleHtml('en', content)).toMatchSnapshot();
  });

  it('renders the biography and the attributed press quotes', () => {
    const html = bundleHtml('en', content);

    expect(html).toContain('Long bio paragraph.');
    expect(html).toContain('<h2>Selected press</h2>');
    expect(html).toContain('An almost romantic sound.<cite>The Quietus</cite>');
  });

  it('builds absolute, locale-aware deep links for performances and works', () => {
    const html = bundleHtml('en', content);

    expect(html).toContain('<h2>Selected performances</h2>');
    expect(html).toContain('<a href="https://jeromefaria.com/live#basinski">Heineken Series</a> — Musicbox, Lisbon');
    expect(html).toContain('<h2>Selected works</h2>');
    expect(html).toContain('<a href="https://jeromefaria.com/works#2504">2504</a>');
  });

  it('prefixes deep links with the locale segment in Portuguese', () => {
    const html = bundleHtml('pt', content);

    expect(html).toContain('<h2>Imprensa seleccionada</h2>');
    expect(html).toContain('<a href="https://jeromefaria.com/pt/live#basinski">Heineken Series</a>');
  });

  it('links a shared-stage act with a url and leaves the rest plain', () => {
    const html = bundleHtml('en', content);

    expect(html).toContain('<h2>Shared stages with</h2>');
    expect(html).toContain('<a href="https://williambasinski.com">William Basinski</a>');
    expect(html).toContain('<span class="sep">·</span>Taylor Deupree');
  });
});
