import { existsSync, readdirSync, readFileSync } from 'node:fs';

const ALLOWED = /^(keep:\s*\S|!|\[if\s|stylelint-|eslint-|@ts-)/;

const sourceHtmlFiles = () => {
  const files = existsSync('index.html') ? ['index.html'] : [];
  if (existsSync('public')) {
    for (const entry of readdirSync('public', { recursive: true })) {
      if (typeof entry === 'string' && entry.endsWith('.html')) {
        files.push(`public/${entry}`);
      }
    }
  }
  return files;
};

const stripStrings = line =>
  line.replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, '');

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

const collectComments = text => {
  const found = [];

  for (const match of text.matchAll(/<!--([\s\S]*?)-->/g)) {
    found.push({ index: match.index, body: match[1] });
  }

  for (const block of text.matchAll(/<(script|style)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const isScript = block[1].toLowerCase() === 'script';
    const content = block[2];
    const base = block.index + block[0].indexOf(content);

    for (const comment of content.matchAll(/\/\*([\s\S]*?)\*\//g)) {
      found.push({ index: base + comment.index, body: comment[1] });
    }

    if (isScript) {
      let offset = 0;
      for (const rawLine of content.split('\n')) {
        const marker = stripStrings(rawLine).search(/(^|[^:])\/\//);
        if (marker !== -1) {
          const at = stripStrings(rawLine).indexOf('//', marker);
          found.push({ index: base + offset + at, body: rawLine.slice(at + 2) });
        }
        offset += rawLine.length + 1;
      }
    }
  }

  return found;
};

const files = sourceHtmlFiles();
const violations = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const comment of collectComments(text)) {
    if (ALLOWED.test(comment.body.trim())) continue;
    violations.push(`${file}:${lineOf(text, comment.index)}  ${comment.body.trim().slice(0, 80)}`);
  }
}

if (violations.length > 0) {
  console.error('HTML comments must be self-documenting. Justify a genuine exception with `<!-- keep: <reason> -->` (or `/* keep: … */` / `// keep: …` inside inline script/style):\n');
  console.error(violations.map(entry => `  ${entry}`).join('\n'));
  process.exit(1);
}

console.log(`✓ HTML comments: ${files.length} file(s) scanned, no undocumented comments.`);
