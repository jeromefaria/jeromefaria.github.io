import { spawnSync } from 'node:child_process';
import { watch, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadSrc, root } from '../data-loader.mjs';
import { renderIssueEmail } from './render.mjs';

const ORIGIN = 'https://jeromefaria.com';
const WORKER = 'https://contact.jeromefaria.workers.dev';

const args = process.argv.slice(2);
const id = args.find(argument => !argument.startsWith('--'));
const shouldOpen = args.includes('--open');
const shouldWatch = args.includes('--watch');

if (!id) {
  console.error('Usage: npm run newsletter:preview -- <issue-id> [--open --watch]');
  process.exit(1);
}

const selfPath = fileURLToPath(import.meta.url);

const renderOnce = async () => {
  const { issue } = await loadSrc(`data/newsletter/issues/${id}.ts`);
  const { html } = renderIssueEmail(issue, {
    origin: ORIGIN,
    embedImages: true,
    viewUrl: `${ORIGIN}/newsletter/${issue.id}`,
    unsubscribeUrl: `${WORKER}/newsletter/unsubscribe?token=PREVIEW`,
  });

  const out = join(root, `newsletter-preview-${issue.id}.html`);
  writeFileSync(out, html);
  return out;
};

const out = await renderOnce();
console.log(out);
if (shouldOpen) spawnSync('open', [out]);

if (shouldWatch) {
  const dirs = [join(root, 'src/data/newsletter'), join(root, 'scripts/newsletter')];

  let timer = null;
  const rerender = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const result = spawnSync(process.execPath, [selfPath, id], { stdio: 'inherit' });
      if (result.status === 0) console.log(`↻ re-rendered ${new Date().toLocaleTimeString()}`);
    }, 150);
  };

  for (const dir of dirs) watch(dir, { recursive: true }, rerender);
  console.log('watching for changes — edit the issue and save, then refresh the preview. Ctrl+C to stop.');
}
