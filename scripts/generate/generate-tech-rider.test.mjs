import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/playwright-render.mjs', () => ({ renderPdf: vi.fn(), withBrowser: vi.fn(), runAsMain: vi.fn() }));
vi.mock('../lib/pdf-styles.mjs', () => ({ baseStyles: async () => '' }));
vi.mock('../lib/data-loader.mjs', async () => {
  const { FAKE_ROOT, makeLoadSrc } = await import('./generators.fixture.mjs');

  return {
    root: FAKE_ROOT,
    loadSrc: makeLoadSrc({
      'data/techRider.ts': {
        techRider: {
          updated: { en: 'March 2026', pt: 'Março de 2026' },
          overview: { en: 'A compact solo setup.', pt: 'Montagem solo compacta.' },
          summary: { en: ['Stereo DI out.', 'Two power sockets.'], pt: ['Saída DI estéreo.', 'Duas tomadas.'] },
          sections: [
            {
              title: { en: 'Stage', pt: 'Palco' },
              body: { en: 'Body text.', pt: 'Texto do corpo.' },
              bullets: { en: ['A plain bullet', { label: 'Power', text: '230V' }], pt: ['Um ponto', { label: 'Energia', text: '230V' }] },
            },
            {
              title: { en: 'Inputs', pt: 'Canais' },
              table: { kind: 'input', rows: { en: [['DI L/R', 'Mono', 'from mixer']], pt: [['DI E/D', 'Mono', 'da mesa']] } },
            },
            {
              title: { en: 'Timing', pt: 'Tempos' },
              table: { kind: 'timing', rows: [['Soundcheck', '30 min']] },
              footnote: { en: 'Subject to change.', pt: 'Sujeito a alterações.' },
            },
          ],
          contact: 'booking@example.com',
        },
      },
    }),
  };
});

const { bullet, renderTable, riderHtml, section } = await import('./generate-tech-rider.mjs');

describe('bullet', () => {
  it('renders a plain string as an item', () => {
    expect(bullet('A note')).toBe('<div class="item">A note</div>');
  });

  it('renders a labelled item with its label and text', () => {
    expect(bullet({ label: 'Power', text: '230V' })).toBe('<div class="item"><span class="lbl">Power</span> — 230V</div>');
  });
});

describe('renderTable', () => {
  it('builds an input table with its headers and cells', () => {
    const html = renderTable({ kind: 'input', rows: { en: [['a', 'b', 'c']] } }, 'en', { inputHeaders: ['Input', 'Format', 'Notes'] });

    expect(html).toContain('<table class="io">');
    expect(html).toContain('<th>Input</th><th>Format</th><th>Notes</th>');
    expect(html).toContain('<td>a</td>');
  });

  it('builds a borderless timing table', () => {
    const html = renderTable({ kind: 'timing', rows: [['Soundcheck', '30 min']] }, 'en', {});

    expect(html).toContain('<table class="timing">');
    expect(html).toContain('<td>Soundcheck</td>');
  });
});

describe('section', () => {
  it('renders only the heading when a section has no body, bullets, table or footnote', () => {
    const html = section({ title: { en: 'Solo' } }, 'en', {});

    expect(html).toContain('<h2>Solo</h2>');
    expect(html).not.toContain('class="body"');
    expect(html).not.toContain('class="footnote"');
  });
});

describe('riderHtml', () => {
  it('renders the English technical rider document', () => {
    expect(riderHtml('en')).toMatchSnapshot();
  });

  it('renders the masthead, overview and summary', () => {
    const html = riderHtml('en');

    expect(html).toContain('Technical Rider');
    expect(html).toContain('Updated March 2026');
    expect(html).toContain('A compact solo setup.');
    expect(html).toContain('<div class="item">Stereo DI out.</div>');
  });

  it('renders each section, its bullets and its tables', () => {
    const html = riderHtml('en');

    expect(html).toContain('<h2>Stage</h2>');
    expect(html).toContain('<div class="item">A plain bullet</div>');
    expect(html).toContain('<span class="lbl">Power</span> — 230V');
    expect(html).toContain('<td>DI L/R</td>');
    expect(html).toContain('<td>Soundcheck</td>');
    expect(html).toContain('Subject to change.');
  });

  it('wires the booking contact as a mailto link', () => {
    expect(riderHtml('en')).toContain('<a href="mailto:booking@example.com">booking@example.com</a>');
  });

  it('renders the Portuguese chrome and input headers', () => {
    const html = riderHtml('pt');

    expect(html).toContain('Rider técnico');
    expect(html).toContain('Actualizado em Março de 2026');
    expect(html).toContain('<h2>Palco</h2>');
    expect(html).toContain('<th>Canal</th>');
  });
});
