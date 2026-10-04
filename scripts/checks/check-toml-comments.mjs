import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ALLOWED = /^keep:\s*\S/;

const skipDelimited = (text, start, delimiter) => {
  let index = start + delimiter.length;
  while (index < text.length && !text.startsWith(delimiter, index)) index += 1;
  return index + delimiter.length;
};

const skipQuoted = (text, start) => {
  const quote = text.charAt(start);
  const escaped = quote === '"';
  let index = start + 1;
  while (index < text.length && text.charAt(index) !== quote && text.charAt(index) !== '\n') {
    index += escaped && text.charAt(index) === '\\' ? 2 : 1;
  }
  return index + 1;
};

const lineOf = (text, position) => text.slice(0, position).split('\n').length;

export const findTomlComments = text => {
  const comments = [];
  let index = 0;

  while (index < text.length) {
    if (text.startsWith('"""', index)) index = skipDelimited(text, index, '"""');
    else if (text.startsWith("'''", index)) index = skipDelimited(text, index, "'''");
    else if (text.startsWith('"', index) || text.startsWith("'", index)) index = skipQuoted(text, index);
    else if (text.startsWith('#', index)) {
      const newline = text.indexOf('\n', index);
      const end = newline === -1 ? text.length : newline;
      comments.push({ line: lineOf(text, index), body: text.slice(index + 1, end).trim() });
      index = end;
    } else index += 1;
  }

  return comments.filter(comment => !ALLOWED.test(comment.body));
};

const main = () => {
  const files = execFileSync('git', ['ls-files', '*.toml'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

  const failures = files.flatMap(file =>
    findTomlComments(readFileSync(file, 'utf8')).map(({ line, body }) => `  ${file}:${line}  # ${body}`),
  );

  if (failures.length > 0) {
    console.error('TOML must be self-documenting. Justify a genuine exception with `# keep: <reason>`:\n');
    console.error(failures.join('\n'));
    process.exit(1);
  }

  console.log(`✓ TOML comments: ${files.length} file(s) scanned, none undocumented.`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
