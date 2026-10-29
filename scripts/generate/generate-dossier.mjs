import { join } from 'node:path';

import { loadSrc } from '../lib/data-loader.mjs';
import { contentFor, epkDossierFile, locales, localize, outDir, root, siteConfig, siteUrl } from '../lib/epk-context.mjs';
import { baseStyles } from '../lib/pdf-styles.mjs';
import { renderPdf, runAsMain } from '../lib/playwright-render.mjs';

const { dossierManifest, dossierTimeline, dossierCompilations, dossierEngineering, dossierEntryKinds } = await loadSrc('data/dossier.ts');
const { bios } = await loadSrc('data/bios.ts');
const { pressQuotes } = await loadSrc('data/press.ts');

const styles = await baseStyles(root);

const chrome = {
  en: {
    biography: 'Biography',
    timeline: 'Timeline',
    compilations: 'Compilation appearances',
    engineering: 'Mastering & engineering',
    press: 'Selected press',
    also: 'Also written about in',
    stages: 'Shared stages',
    kinds: { release: 'Release', score: 'Score', live: 'Live', publication: 'Publication', talk: 'Talk', workshop: 'Workshop', installation: 'Installation' },
  },
  pt: {
    biography: 'Biografia',
    timeline: 'Cronologia',
    compilations: 'Participações em compilações',
    engineering: 'Masterização & engenharia',
    press: 'Imprensa seleccionada',
    also: 'Também objecto de crítica em',
    stages: 'Partilhou palco com',
    kinds: { release: 'Edição', score: 'Composição', live: 'Ao vivo', publication: 'Publicação', talk: 'Conversa', workshop: 'Workshop', installation: 'Instalação' },
  },
};

for (const locale of locales) {
  for (const kind of dossierEntryKinds) {
    if (!chrome[locale].kinds[kind]) throw new Error(`generate-dossier: missing ${locale} label for kind "${kind}"`);
  }
}

export const groupByYear = entries => {
  const groups = new Map();

  for (const entry of entries) {
    const bucket = groups.get(entry.year) ?? [];
    bucket.push(entry);
    groups.set(entry.year, bucket);
  }

  return [...groups];
};

const featuredQuotes = dossierManifest.featuredPressIds
  .map(id => pressQuotes.find(quote => quote.id === id))
  .filter(quote => quote !== undefined);

const featuredSources = new Set(featuredQuotes.map(quote => quote.source));
const alsoSources = [...new Set(pressQuotes.map(quote => quote.source))].filter(source => !featuredSources.has(source));

export const dossierHtml = locale => {
  const labels = chrome[locale];

  const timeline = groupByYear(dossierTimeline)
    .map(([year, entries]) => `<div class="group">
      <div class="year">${year}</div>
      <div class="items">${entries
    .map(entry => `<div class="entry"><span class="tag">${labels.kinds[entry.kind]}</span><span class="body"><strong>${entry.title}</strong> — <span class="detail">${localize(entry.detail, locale)}</span></span></div>`)
    .join('')}</div>
    </div>`)
    .join('');

  const credits = items => items
    .map(item => `<div class="year">${item.year}</div><div><strong>${item.title}</strong> — <span class="detail">${localize(item.detail, locale)}</span></div>`)
    .join('');

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  ${styles}
  body { font-size: 9.5pt; line-height: 1.45; }
  header { border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 10px; }
  .masthead-row { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; margin-top: 4px; }
  .contact { font-size: 9pt; color: #666; }
  .contact a { color: #1a1a1a; text-decoration: none; white-space: nowrap; }
  section { margin-bottom: 14px; }
  .keep { break-inside: avoid; }
  h2 { margin: 0 0 6px; }
  .prose p { margin: 0 0 7px; }
  .prose p:last-child { margin-bottom: 0; }
  .timeline { margin-top: 8px; }
  .group { display: grid; grid-template-columns: 2.6rem 1fr; gap: 10px; margin-bottom: 7px; break-inside: avoid; }
  .year { color: #999; font-variant-numeric: tabular-nums; }
  .items { display: flex; flex-direction: column; gap: 3px; }
  .entry { display: grid; grid-template-columns: 7.5em 1fr; gap: 6px; align-items: baseline; font-size: 9pt; }
  .tag { font-size: 6.5pt; text-transform: uppercase; letter-spacing: 0.07em; color: #999; white-space: nowrap; }
  .detail { color: #555; }
  .grid { display: grid; grid-template-columns: 2.6rem 1fr; gap: 4px 10px; font-size: 9pt; }
  blockquote { margin: 0 0 8px; break-inside: avoid; }
  blockquote cite { display: block; font-style: normal; font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 3px; }
  .also { margin-top: 8px; font-size: 8.5pt; color: #666; }
  .also .label { text-transform: uppercase; letter-spacing: 0.1em; font-size: 7.5pt; color: #999; }
  .roster p { margin: 6px 0 0; line-height: 1.6; }
  .roster a { color: #1a1a1a; text-decoration: underline; text-decoration-color: #ccc; text-underline-offset: 2px; }
  .roster .sep { color: #999; margin: 0 5px; }
</style></head><body>
  <header>
    <h1>Jerome Faria</h1>
    <div class="masthead-row">
      <div class="tagline">${localize(siteConfig.tagline, locale)}</div>
      <div class="contact"><a href="${siteUrl}">${siteUrl.replace(/^https?:\/\//, '')}</a></div>
    </div>
  </header>
  <section><h2>${labels.biography}</h2><div class="prose">${localize(bios[dossierManifest.bio], locale)}</div></section>
  <section><h2>${labels.timeline}</h2><div class="timeline">${timeline}</div></section>
  <section class="keep"><h2>${labels.compilations}</h2><div class="grid">${credits(dossierCompilations)}</div></section>
  <section class="keep"><h2>${labels.engineering}</h2><div class="grid">${credits(dossierEngineering)}</div></section>
  <section><h2>${labels.press}</h2>
    ${featuredQuotes.map(quote => `<blockquote>${localize(quote.quote, locale)}<cite>${quote.source}</cite></blockquote>`).join('')}
    <p class="also"><span class="label">${labels.also}:</span> ${alsoSources.join(' · ')}</p>
  </section>
  <section class="roster keep"><h2>${labels.stages}</h2>
    <p>${contentFor(locale).sharedStages.map(act => (act.url ? `<a href="${act.url}">${act.name}</a>` : act.name)).join('<span class="sep">·</span>')}</p>
  </section>
</body></html>`;
};

export const render = async browser => {
  for (const locale of locales) {
    const pdfPath = join(outDir, `${epkDossierFile(locale)}.pdf`);
    await renderPdf(browser, {
      html: dossierHtml(locale),
      path: pdfPath,
      margin: { top: '12mm', bottom: '12mm', left: '14mm', right: '14mm' },
    });

    console.log(`Dossier (${locale}): PDF → public/epk/${epkDossierFile(locale)}.pdf`);
  }
};

await runAsMain(import.meta, render);
