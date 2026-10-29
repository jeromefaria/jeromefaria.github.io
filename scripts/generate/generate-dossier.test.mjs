import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/playwright-render.mjs', () => ({ renderPdf: vi.fn(), withBrowser: vi.fn(), runAsMain: vi.fn() }));
vi.mock('../lib/pdf-styles.mjs', () => ({ baseStyles: async () => '' }));
vi.mock('../lib/data-loader.mjs', async () => {
  const { FAKE_ROOT, makeLoadSrc } = await import('./generators.fixture.mjs');

  return {
    root: FAKE_ROOT,
    loadSrc: makeLoadSrc({
      'data/dossier.ts': {
        dossierManifest: { bio: 'press', featuredPressIds: ['q1', 'q3'] },
        dossierTimeline: [
          { year: '2010', kind: 'talk', title: 'A Talk', detail: { en: 'Porto', pt: 'Porto' } },
          { year: '2012', kind: 'workshop', title: 'A Workshop', detail: { en: 'Funchal workshop', pt: 'Workshop no Funchal' } },
          { year: '2012', kind: 'installation', title: 'Flow', detail: { en: 'Software projection', pt: 'Projecção de software' } },
          { year: '2024', kind: 'release', title: '2504', detail: { en: 'BRØQN', pt: 'BRØQN' } },
        ],
        dossierCompilations: [{ year: '2007', title: 'Crystal Space', detail: { en: 'on Thisco', pt: 'em Thisco' } }],
        dossierEngineering: [{ year: '2025', title: 'Overlapse XIII', detail: { en: 'Mastering', pt: 'Masterização' } }],
        dossierEntryKinds: ['release', 'talk', 'workshop', 'installation'],
      },
      'data/bios.ts': { bios: { press: { en: '<p>English press bio.</p>', pt: '<p>Biografia de imprensa.</p>' }, short: { en: 's', pt: 's' } } },
      'data/press.ts': {
        pressQuotes: [
          { id: 'q1', quote: { en: 'Quote one.', pt: 'Citação um.' }, source: 'The Quietus' },
          { id: 'q2', quote: { en: 'Quote two.', pt: 'Citação dois.' }, source: 'BodySpace' },
          { id: 'q3', quote: { en: 'Quote three.', pt: 'Citação três.' }, source: 'A Closer Listen' },
        ],
      },
    }),
  };
});

const { dossierHtml, groupByYear } = await import('./generate-dossier.mjs');

describe('groupByYear', () => {
  it('groups entries by year, preserving first-seen order', () => {
    const grouped = groupByYear([
      { year: '2012', title: 'a' },
      { year: '2012', title: 'b' },
      { year: '2010', title: 'c' },
    ]);

    expect(grouped.map(([year]) => year)).toEqual(['2012', '2010']);
    expect(grouped[0][1]).toHaveLength(2);
    expect(grouped[1][1]).toHaveLength(1);
  });
});

describe('dossierHtml', () => {
  it('renders the English dossier document', () => {
    expect(dossierHtml('en')).toMatchSnapshot();
  });

  it('renders the biography, timeline, compilations and engineering sections', () => {
    const html = dossierHtml('en');

    expect(html).toContain('<h2>Biography</h2>');
    expect(html).toContain('English press bio.');
    expect(html).toContain('<h2>Timeline</h2>');
    expect(html).toContain('<h2>Compilation appearances</h2>');
    expect(html).toContain('<h2>Mastering & engineering</h2>');
  });

  it('groups a shared year and tags each entry with its kind label', () => {
    const html = dossierHtml('en');

    expect(html).toContain('<span class="tag">Workshop</span>');
    expect(html).toContain('<span class="tag">Installation</span>');
    expect(html).toContain('<span class="tag">Talk</span>');
    expect(html).toContain('Flow');
  });

  it('quotes the featured press and lists only the rest under "also"', () => {
    const html = dossierHtml('en');

    expect(html).toContain('<cite>The Quietus</cite>');
    expect(html).toContain('<cite>A Closer Listen</cite>');
    expect(html).toContain('<span class="label">Also written about in:</span> BodySpace');
    expect(html).not.toContain('<cite>BodySpace</cite>');
  });

  it('links a shared-stage act that has a url and leaves the rest as plain text', () => {
    const html = dossierHtml('en');

    expect(html).toContain('<a href="https://williambasinski.com">William Basinski</a>');
    expect(html).toContain('<span class="sep">·</span>Taylor Deupree');
  });

  it('renders the Portuguese chrome and pré-AO copy', () => {
    const html = dossierHtml('pt');

    expect(html).toContain('<h2>Biografia</h2>');
    expect(html).toContain('<h2>Cronologia</h2>');
    expect(html).toContain('<h2>Imprensa seleccionada</h2>');
    expect(html).toContain('<span class="tag">Instalação</span>');
    expect(html).toContain('Projecção de software');
  });
});
