import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { marked } from 'marked';

import { loadSrc, root } from '../data-loader.mjs';

const { color } = await loadSrc('design/tokens.ts');
const { releaseById } = await loadSrc('data/works.ts');
const { liveEvents } = await loadSrc('data/live.ts');
const { essayBySlug } = await loadSrc('data/writing.ts');
const { localize } = await loadSrc('i18n/localized.ts');
const { formatEventDateRange, formatLongDate, formatMonthYear } = await loadSrc('utils/formatters.ts');

const L = color.light;
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escapeHtml = value => String(value).replace(/[&<>"]/g, character => ENTITIES[character]);

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
const dataUri = webPath => {
  const ext = webPath.split('.').pop().toLowerCase();
  const bytes = readFileSync(join(root, 'public', webPath));
  return `data:${MIME[ext] ?? 'image/jpeg'};base64,${bytes.toString('base64')}`;
};

const imageSrc = (path, opts) => {
  if (/^https?:/i.test(path)) return path;
  return opts.embedImages ? dataUri(path) : `${opts.origin}${path}`;
};

const label = text =>
  `<div style="font:600 11px/1 ${SANS};letter-spacing:0.12em;text-transform:uppercase;color:${L.muted};padding-bottom:12px;">${escapeHtml(text)}</div>`;

const heading = (text, href) =>
  `<a href="${href}" style="font:500 20px/1.3 ${SANS};letter-spacing:-0.01em;color:${L.text};text-decoration:none;">${escapeHtml(text)}</a>`;

const paragraph = text =>
  `<div style="font:400 14px/1.7 ${SANS};color:${L.secondary};padding-top:14px;">${escapeHtml(text)}</div>`;

const image = (webPath, alt, opts) =>
  `<img src="${imageSrc(webPath, opts)}" alt="${escapeHtml(alt)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;margin:16px 0 4px;">`;

const caption = text =>
  `<div style="font:400 12px/1.5 ${SANS};color:${L.muted};padding-top:8px;">${escapeHtml(text)}</div>`;

const cta = (text, href) =>
  `<a href="${href}" style="display:inline-block;font:500 11px/1 ${SANS};letter-spacing:0.12em;text-transform:uppercase;color:${L.text};text-decoration:none;border:1px solid ${L.text};padding:10px 20px;margin-top:18px;">${escapeHtml(text)}</a>`;

const metaGrid = fields => {
  const cells = fields
    .filter(field => field.value)
    .map(
      field =>
        `<td valign="top" style="padding:0 20px 0 0;">
          <div style="font:600 10px/1 ${SANS};letter-spacing:0.1em;text-transform:uppercase;color:${L.muted};padding-bottom:5px;">${escapeHtml(field.label)}</div>
          <div style="font:400 13px/1.4 ${SANS};color:${L.text};">${escapeHtml(field.value)}</div>
        </td>`,
    )
    .join('');

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;"><tr>${cells}</tr></table>`;
};

const blockCell = inner => `<tr><td style="padding:0 0 40px;">${inner}</td></tr>`;

const proseBlock = block => {
  marked.setOptions({ breaks: false });
  const html = marked.parse(block.markdown);
  return blockCell(`<div style="font:400 15px/1.7 ${SANS};color:${L.text};">${html}</div>`);
};

const imageBlock = (block, opts) => {
  const img = image(block.src, block.alt, opts);
  const linked = block.href ? `<a href="${block.href}" style="text-decoration:none;">${img}</a>` : img;
  return blockCell([block.label ? label(block.label) : '', linked, block.caption ? caption(block.caption) : ''].join(''));
};

const videoBlock = (block, opts) =>
  blockCell([
    block.label ? label(block.label) : '',
    `<a href="${block.href}" style="text-decoration:none;">${image(block.poster, block.alt, opts)}</a>`,
    block.caption ? caption(block.caption) : '',
    cta('Watch', block.href),
  ].join(''));

const listenBlock = (block, opts) => {
  const release = releaseById.get(block.ref);
  if (!release) return '';

  const { meta } = release;
  const edition = meta.kind === 'music' ? (meta.editions[0] ?? null) : null;
  const fields = meta.kind === 'music'
    ? [
      { label: 'Released', value: formatMonthYear(meta.released) },
      { label: 'Format', value: meta.mediums.join(' / ') },
      { label: 'Label', value: edition?.label.text ?? '' },
      { label: 'Catalog', value: edition?.catalog ?? '' },
    ]
    : [];

  const url = `${opts.origin}/works/${release.id}`;

  return blockCell(
    label('Listen') +
      heading(release.title, url) +
      (release.coverImage ? image(release.coverImage, release.title, opts) : '') +
      metaGrid(fields) +
      (block.note ? paragraph(block.note) : '') +
      cta('Listen', url),
  );
};

const heroSrc = event => {
  const cover = list => list?.find(item => item.cover) ?? list?.[0];
  return cover(event.images)?.src ?? cover(event.posters)?.src ?? null;
};

const liveBlock = (block, opts) => {
  const event = liveEvents.find(entry => entry.id === block.ref);
  if (!event) return '';

  const title = localize(event.title, 'en');
  const hero = heroSrc(event);
  const fields = [
    { label: 'Date', value: formatEventDateRange(event.date, event.endDate, 'en') },
    { label: 'Venue', value: event.venue.name ?? '' },
    { label: 'City', value: event.venue.city ?? '' },
  ];
  const url = `${opts.origin}/live/${event.id}`;

  return blockCell(
    label('Live') +
      heading(title, url) +
      (hero ? image(hero, title, opts) : '') +
      metaGrid(fields) +
      (block.note ? paragraph(block.note) : '') +
      cta('Details', url),
  );
};

const writingBlock = (block, opts) => {
  const essay = essayBySlug(block.ref);
  if (!essay) return '';

  const url = `${opts.origin}/writing/${essay.slug}`;
  const description = block.note ?? essay.tagline;

  return blockCell(
    label('Writing') +
      heading(essay.title, url) +
      (description ? paragraph(description) : '') +
      cta('Read', url),
  );
};

const renderBlock = (block, opts) => {
  if (block.type === 'prose') return proseBlock(block);
  if (block.type === 'image') return imageBlock(block, opts);
  if (block.type === 'video') return videoBlock(block, opts);
  if (block.type === 'listen') return listenBlock(block, opts);
  if (block.type === 'live') return liveBlock(block, opts);
  return writingBlock(block, opts);
};

const masthead = (issue, viewUrl) => `
  <tr><td align="right" style="font:400 11px/1 ${SANS};color:${L.muted};padding:0 0 28px;">
    <a href="${viewUrl}" style="color:${L.muted};text-decoration:underline;">View in browser</a>
  </td></tr>
  <tr><td style="border-bottom:1px solid ${L.border};padding:0 0 10px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font:600 12px/1 ${SANS};letter-spacing:0.05em;text-transform:uppercase;color:${L.text};">Jerome Faria</td>
      <td align="right" style="font:400 12px/1 ${SANS};letter-spacing:0.05em;text-transform:uppercase;color:${L.muted};">Sound Artist &amp; Composer</td>
    </tr></table>
  </td></tr>
  <tr><td style="font:400 11px/1 ${SANS};color:${L.muted};padding:10px 0 36px;">${escapeHtml(formatLongDate(issue.date))}</td></tr>`;

const footer = (origin, unsubscribeUrl) => `
  <tr><td style="border-top:1px solid ${L.border};padding:24px 0 0;font:400 11px/1.6 ${SANS};letter-spacing:0.12em;text-transform:uppercase;color:${L.muted};" align="center">
    &copy; ${new Date().getFullYear()} Jerome Faria
    &nbsp;&middot;&nbsp; <a href="${origin}/privacy" style="color:${L.muted};text-decoration:underline;">Privacy</a>
    &nbsp;&middot;&nbsp; <a href="${unsubscribeUrl}" style="color:${L.muted};text-decoration:underline;">Unsubscribe</a>
  </td></tr>`;

export const renderIssueEmail = (issue, opts) => {
  const blocks = issue.blocks.map(block => renderBlock(block, opts)).join('');

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(issue.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${L.bg};-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${L.bg}" style="background:${L.bg};">
  <tr><td align="center" style="padding:32px 20px 48px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
      ${masthead(issue, opts.viewUrl)}
      ${blocks}
      ${footer(opts.origin, opts.unsubscribeUrl)}
    </table>
  </td></tr>
</table>
</body></html>`;

  return { subject: issue.subject, html };
};
