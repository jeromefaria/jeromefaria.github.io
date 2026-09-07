export interface ParsedFrontmatter {
  meta: Record<string, string>;
  body: string;
}

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const unquote = (value: string): string =>
  (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))
    ? value.slice(1, -1)
    : value;

export const parseFrontmatter = (raw: string): ParsedFrontmatter => {
  const match = FENCE.exec(raw);
  if (!match) return { meta: {}, body: raw };

  const meta: Record<string, string> = {};
  for (const line of (match[1] ?? '').split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    if (key) meta[key] = unquote(line.slice(separator + 1).trim());
  }

  return { meta, body: raw.slice(match[0].length) };
};
