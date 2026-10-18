import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { marked } from 'marked';

import { loadSrc, root } from '../lib/data-loader.mjs';

const { color } = await loadSrc('design/tokens.ts');
const { releaseById } = await loadSrc('data/works.ts');
const { liveEvents } = await loadSrc('data/live.ts');
const { essayBySlug } = await loadSrc('data/writing.ts');
const { localize } = await loadSrc('i18n/localized.ts');
const { formatEventDateRange, formatLongDate, formatMonthYear } = await loadSrc('utils/formatters.ts');
const { eventPhotoCredit, releasePhotoCredit } = await loadSrc('utils/newsletterCredit.ts');
const { safeNewsletterUrl } = await loadSrc('utils/newsletterUrl.ts');

const L = color.light;
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escapeHtml = value => String(value).replace(/[&<>"]/g, character => ENTITIES[character]);

const hrefValue = url => escapeHtml(safeNewsletterUrl(url) ?? '#');

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
  `<a href="${href}" style="font:500 18px/1.3 ${SANS};letter-spacing:0.08em;text-transform:uppercase;color:${L.text};text-decoration:none;">${escapeHtml(text)}</a>`;

const noteInline = text =>
  marked.parseInline(String(text)).replaceAll('<a ', `<a style="color:${L.text};text-decoration:underline;text-decoration-color:${L.muted};" `);

const paragraph = text =>
  `<div style="font:400 14px/1.7 ${SANS};color:${L.secondary};padding-top:14px;">${noteInline(text)}</div>`;

const image = (webPath, alt, opts) =>
  `<img src="${imageSrc(webPath, opts)}" alt="${escapeHtml(alt)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;margin:16px 0 4px;">`;

const caption = text =>
  `<div style="font:400 12px/1.5 ${SANS};color:${L.muted};padding-top:8px;">${escapeHtml(text)}</div>`;

const creditLine = credit => {
  if (!credit) return '';

  const html = credit.html.replaceAll('<a ', `<a target="_blank" rel="noopener noreferrer" style="color:${L.muted};text-decoration:underline;" `);
  return `<div style="font:400 11px/1.4 ${SANS};color:${L.muted};opacity:0.6;padding-top:8px;text-align:right;">${escapeHtml(credit.prefix)} ${html}</div>`;
};

const button = (text, href) =>
  `<a href="${hrefValue(href)}" style="display:inline-block;font:500 11px/1 ${SANS};letter-spacing:0.12em;text-transform:uppercase;color:${L.bg};text-decoration:none;background-color:${L.text};border:1px solid ${L.text};padding:12px 22px;">${escapeHtml(text)}</a>`;

const cta = (text, href) => `<div style="margin-top:18px;">${button(text, href)}</div>`;

const metaGrid = fields => {
  const rows = fields
    .filter(field => field.value)
    .map(
      field =>
        `<tr><td style="padding:0 0 12px;">
          <div style="font:600 10px/1 ${SANS};letter-spacing:0.1em;text-transform:uppercase;color:${L.muted};padding-bottom:4px;">${escapeHtml(field.label)}</div>
          <div style="font:400 13px/1.4 ${SANS};color:${L.text};">${escapeHtml(field.value)}</div>
        </td></tr>`,
    )
    .join('');

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">${rows}</table>`;
};

const blockCell = inner => `<tr><td style="padding:0 0 20px;">${inner}</td></tr>`;

const proseBlock = block => {
  marked.setOptions({ breaks: false });
  const html = marked
    .parse(block.markdown)
    .trim()
    .replace('<p>', '<p style="margin:0;">')
    .replaceAll('<p>', '<p style="margin:1.25em 0 0;">')
    .replaceAll('<a ', `<a style="color:${L.text};text-decoration:underline;text-decoration-color:${L.muted};" `);
  return blockCell(`<div style="margin:-4px 0;font:400 15px/1.7 ${SANS};color:${L.text};">${html}</div>`);
};

const imageBlock = (block, opts) => {
  const img = image(block.src, block.alt, opts);
  const linked = block.href ? `<a href="${hrefValue(block.href)}" style="text-decoration:none;">${img}</a>` : img;
  return blockCell([block.label ? label(block.label) : '', linked, block.caption ? caption(block.caption) : ''].join(''));
};

const videoBlock = (block, opts) =>
  blockCell([
    block.label ? label(block.label) : '',
    `<a href="${hrefValue(block.href)}" style="text-decoration:none;">${image(block.poster, block.alt, opts)}</a>`,
    block.caption ? caption(block.caption) : '',
    cta('View', block.href),
  ].join(''));

const ctaBlock = block => blockCell(`<div style="text-align:center;">${button(block.label, block.href)}</div>`);

const quoteBlock = block => {
  const source = block.url
    ? `<a href="${hrefValue(block.url)}" style="color:${L.muted};text-decoration:none;">${escapeHtml(block.source)}</a>`
    : escapeHtml(block.source);

  return blockCell(
    `<div style="font:400 16px/1.75 ${SANS};color:${L.text};">${block.quote}</div>` +
      `<div style="font:500 11px/1.4 ${SANS};letter-spacing:0.12em;text-transform:uppercase;color:${L.muted};padding-top:12px;">${source}</div>`,
  );
};

const worksBlock = (block, opts) => {
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
    label('Works') +
      heading(release.title, url) +
      (release.coverImage
        ? image(release.coverImage, release.title, opts) + creditLine(releasePhotoCredit(release.credits))
        : '') +
      (block.hideMeta ? '' : metaGrid(fields)) +
      (block.note ? paragraph(block.note) : '') +
      cta('View', url),
  );
};

const pickCover = list => list?.find(item => item.cover) ?? list?.[0];

const liveBlock = (block, opts) => {
  const event = liveEvents.find(entry => entry.id === block.ref);
  if (!event) return '';

  const title = localize(event.title, 'en');
  const cover = pickCover(event.images);
  const poster = pickCover(event.posters);
  const hero = cover?.src ?? poster?.src ?? null;
  const fields = [
    { label: 'Date', value: formatEventDateRange(event.date, event.endDate, 'en') },
    { label: 'Venue', value: event.venue.name ?? '' },
    { label: 'City', value: event.venue.city ?? '' },
  ];
  const url = `${opts.origin}/live/${event.id}`;

  return blockCell(
    label('Live') +
      heading(title, url) +
      (hero ? image(hero, title, opts) + creditLine(eventPhotoCredit(cover, poster)) : '') +
      (block.hideMeta ? '' : metaGrid(fields)) +
      (block.note ? paragraph(block.note) : '') +
      cta('View', url),
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
      cta('View', url),
  );
};

const renderBlock = (block, opts) => {
  if (block.type === 'prose') return proseBlock(block);
  if (block.type === 'image') return imageBlock(block, opts);
  if (block.type === 'video') return videoBlock(block, opts);
  if (block.type === 'works') return worksBlock(block, opts);
  if (block.type === 'live') return liveBlock(block, opts);
  if (block.type === 'quote') return quoteBlock(block);
  if (block.type === 'cta') return ctaBlock(block);
  return writingBlock(block, opts);
};

const masthead = (issue, opts) => {
  const viewRow = opts.viewUrl
    ? `<tr><td align="right" style="font:400 11px/1 ${SANS};color:${L.muted};padding:0 0 28px;">
    <a href="${opts.viewUrl}" style="color:${L.muted};text-decoration:underline;">View in browser</a>
  </td></tr>`
    : '';
  const afterBorder = opts.dated === false
    ? '<tr><td style="font-size:0;line-height:0;padding:0 0 20px;">&nbsp;</td></tr>'
    : `<tr><td style="font:400 11px/1 ${SANS};color:${L.muted};padding:16px 0 36px;">${escapeHtml(formatLongDate(issue.date))}</td></tr>`;

  return `
  ${viewRow}
  <tr><td style="border-bottom:1px solid ${L.borderSubtle};padding:0 0 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font:600 12px/1 ${SANS};letter-spacing:0.05em;text-transform:uppercase;color:${L.text};">Jerome Faria</td>
      <td align="right" style="font:400 12px/1 ${SANS};letter-spacing:0.05em;text-transform:uppercase;color:${L.muted};">Sound Artist &amp; Composer</td>
    </tr></table>
  </td></tr>
  ${afterBorder}`;
};

const footer = opts => {
  const unsubscribe = opts.unsubscribeUrl
    ? `&nbsp;&middot;&nbsp; <a href="${opts.unsubscribeUrl}" style="color:${L.muted};text-decoration:underline;">Unsubscribe</a>`
    : '';

  return `
  <tr><td style="border-top:1px solid ${L.borderSubtle};padding:24px 0 0;font:400 11px/1.6 ${SANS};letter-spacing:0.12em;text-transform:uppercase;color:${L.muted};" align="center">
    <a href="${opts.origin}/copyright" style="color:${L.muted};text-decoration:underline;">&copy; 2004&ndash;${new Date().getFullYear()} Jerome Faria</a>
    &nbsp;&middot;&nbsp; <a href="${opts.origin}/privacy" style="color:${L.muted};text-decoration:underline;">Privacy</a>
    ${unsubscribe}
  </td></tr>`;
};

const blockDivider = `<tr><td style="border-top:1px solid ${L.borderSubtle};padding:0 0 20px;font-size:0;line-height:0;">&nbsp;</td></tr>`;

export const renderIssueEmail = (issue, opts) => {
  const rendered = issue.blocks.map(block => renderBlock(block, opts)).filter(Boolean);
  const blocks = rendered.length > 1
    ? rendered.slice(0, -1).join(blockDivider) + rendered.at(-1)
    : rendered.join('');

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
      ${masthead(issue, opts)}
      ${blocks}
      ${footer(opts)}
    </table>
  </td></tr>
</table>
</body></html>`;

  return { subject: issue.subject, html };
};

const collapse = text =>
  text
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const inlineToText = tokens =>
  tokens
    .map(token => {
      switch (token.type) {
        case 'text':
          return token.tokens ? inlineToText(token.tokens) : token.text;
        case 'escape':
        case 'codespan':
          return token.text;
        case 'strong':
        case 'em':
        case 'del':
          return inlineToText(token.tokens);
        case 'br':
          return '\n';
        case 'link': {
          const label = inlineToText(token.tokens);
          const url = (token.href ?? '').trim();
          return url && url !== label ? `${label} (${url})` : label;
        }
        case 'image':
          return token.text ? `[Image: ${token.text}]` : '';
        default:
          return '';
      }
    })
    .join('');

const blockToText = tokens =>
  tokens
    .map(token => {
      switch (token.type) {
        case 'paragraph':
        case 'heading':
          return inlineToText(token.tokens);
        case 'text':
          return token.tokens ? inlineToText(token.tokens) : token.text;
        case 'blockquote':
          return blockToText(token.tokens);
        case 'list':
          return token.items
            .map((item, index) => `${token.ordered ? `${(token.start || 1) + index}. ` : '- '}${blockToText(item.tokens)}`)
            .join('\n');
        case 'code':
          return token.text;
        default:
          return '';
      }
    })
    .filter(Boolean)
    .join('\n\n');

const mdToText = source => collapse(blockToText(marked.lexer(String(source))));

const textUrl = url => safeNewsletterUrl(url) ?? '';

const sectionText = (sectionLabel, title, { meta = [], note, url } = {}) => {
  const head = [sectionLabel.toUpperCase(), title];
  for (const field of meta) if (field.value) head.push(`${field.label}: ${field.value}`);

  const parts = [head.join('\n')];
  if (note) parts.push(mdToText(note));
  if (url) parts.push(url);
  return parts.join('\n\n');
};

const proseText = block => mdToText(block.markdown);

const mediaText = (kind, block) => {
  const lines = [];
  if (block.label) lines.push(block.label.toUpperCase());
  lines.push(`[${kind}: ${block.alt}]`);
  if (block.caption) lines.push(block.caption);
  return lines;
};

const imageText = block => {
  const lines = mediaText('Image', block);
  const href = textUrl(block.href);
  if (href) lines.push(href);
  return lines.join('\n');
};

const videoText = block => {
  const lines = mediaText('Video', block);
  const href = textUrl(block.href);
  if (href) lines.push(`Watch: ${href}`);
  return lines.join('\n');
};

const worksText = (block, opts) => {
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

  return sectionText('Works', release.title, {
    meta: block.hideMeta ? [] : fields,
    note: block.note,
    url: `${opts.origin}/works/${release.id}`,
  });
};

const liveText = (block, opts) => {
  const event = liveEvents.find(entry => entry.id === block.ref);
  if (!event) return '';

  const fields = [
    { label: 'Date', value: formatEventDateRange(event.date, event.endDate, 'en') },
    { label: 'Venue', value: event.venue.name ?? '' },
    { label: 'City', value: event.venue.city ?? '' },
  ];

  return sectionText('Live', localize(event.title, 'en'), {
    meta: block.hideMeta ? [] : fields,
    note: block.note,
    url: `${opts.origin}/live/${event.id}`,
  });
};

const writingText = (block, opts) => {
  const essay = essayBySlug(block.ref);
  if (!essay) return '';

  return sectionText('Writing', essay.title, {
    note: block.note ?? essay.tagline,
    url: `${opts.origin}/writing/${essay.slug}`,
  });
};

const quoteText = block => {
  const attribution = [block.source, textUrl(block.url)].filter(Boolean).join(' ');
  const credit = attribution ? `\n— ${attribution}` : '';
  return `“${mdToText(block.quote)}”${credit}`;
};

const ctaText = block => `${block.label}: ${textUrl(block.href)}`;

const renderBlockText = (block, opts) => {
  if (block.type === 'prose') return proseText(block);
  if (block.type === 'image') return imageText(block);
  if (block.type === 'video') return videoText(block);
  if (block.type === 'works') return worksText(block, opts);
  if (block.type === 'live') return liveText(block, opts);
  if (block.type === 'quote') return quoteText(block);
  if (block.type === 'cta') return ctaText(block);
  return writingText(block, opts);
};

const mastheadText = (issue, opts) => {
  const lines = ['Jerome Faria — Sound Artist & Composer'];
  if (opts.dated !== false) lines.push(formatLongDate(issue.date));
  if (opts.viewUrl) lines.push(`View in browser: ${opts.viewUrl}`);
  return lines.join('\n');
};

const footerText = opts => {
  const lines = [
    `© 2004–${new Date().getFullYear()} Jerome Faria`,
    `Privacy: ${opts.origin}/privacy`,
  ];
  if (opts.unsubscribeUrl) lines.push(`Unsubscribe: ${opts.unsubscribeUrl}`);
  return lines.join('\n');
};

export const renderIssueText = (issue, opts) => {
  const blocks = issue.blocks.map(block => renderBlockText(block, opts)).filter(Boolean);
  const sections = [mastheadText(issue, opts), ...blocks, footerText(opts)].join('\n\n—\n\n');
  return `${sections}\n`;
};
