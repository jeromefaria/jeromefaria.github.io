import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadSrc, root } from '../data-loader.mjs';
import { renderIssueEmail } from './render.mjs';

const ORIGIN = 'https://jeromefaria.com';
const WORKER = 'https://contact.jeromefaria.workers.dev';
const FROM = 'Jerome Faria <newsletter@jeromefaria.com>';
const RESEND_BATCH_URL = 'https://api.resend.com/emails/batch';
const BATCH_LIMIT = 100;

const args = process.argv.slice(2);
const id = args.find(argument => !argument.startsWith('--'));
const mode = args.includes('--send') ? 'send' : args.includes('--test') ? 'test' : 'dry-run';

if (!id) {
  console.error('Usage: node scripts/newsletter/send.mjs <issue-id> [--test | --send]');
  process.exit(1);
}

const readEnv = key => {
  if (process.env[key]) return process.env[key];
  const devVars = join(root, 'worker/.dev.vars');
  if (existsSync(devVars)) {
    const line = readFileSync(devVars, 'utf8').split('\n').find(entry => entry.startsWith(`${key}=`));
    if (line) return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, '');
  }
  return null;
};

const unsubscribeUrl = token => `${WORKER}/newsletter/unsubscribe?token=${token}`;

const fetchActiveSubscribers = () => {
  const raw = execFileSync(
    'npx',
    [
      'wrangler', 'd1', 'execute', 'newsletter', '--remote', '--json',
      '--command', "SELECT email, unsubscribe_token FROM subscribers WHERE status = 'active'",
    ],
    { cwd: join(root, 'worker'), encoding: 'utf8' },
  );
  return JSON.parse(raw)[0].results;
};

const recipientsFor = () => {
  if (mode === 'test') {
    const testEmail = readEnv('NEWSLETTER_TEST_EMAIL');
    if (!testEmail) throw new Error('Set NEWSLETTER_TEST_EMAIL to a test address for --test.');
    return [{ email: testEmail, unsubscribe_token: 'test-token' }];
  }

  try {
    return fetchActiveSubscribers();
  } catch (error) {
    if (mode === 'send') throw error;
    console.warn('⚠  Could not read D1 (not provisioned yet?) — using a placeholder recipient for the dry run.');
    return [{ email: 'preview@example.com', unsubscribe_token: 'placeholder-token' }];
  }
};

const buildMessages = (issue, recipients) =>
  recipients.map(recipient => {
    const { html } = renderIssueEmail(issue, {
      origin: ORIGIN,
      embedImages: false,
      viewUrl: `${ORIGIN}/newsletter/${issue.id}`,
      unsubscribeUrl: unsubscribeUrl(recipient.unsubscribe_token),
    });

    return {
      from: FROM,
      to: [recipient.email],
      subject: issue.subject,
      html,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl(recipient.unsubscribe_token)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    };
  });

const chunk = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_unused, index) =>
    items.slice(index * size, index * size + size));

const sendBatches = async messages => {
  const apiKey = readEnv('RESEND_API_KEY');
  if (!apiKey) throw new Error('Set RESEND_API_KEY (env or worker/.dev.vars) to send.');

  for (const batch of chunk(messages, BATCH_LIMIT)) {
    const response = await fetch(RESEND_BATCH_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });
    if (!response.ok) throw new Error(`Resend batch failed: ${response.status} ${await response.text()}`);
  }
};

const { issue } = await loadSrc(`data/newsletter/issues/${id}.ts`);
const recipients = recipientsFor();
const messages = buildMessages(issue, recipients);

console.log(`Issue:    ${issue.id} — "${issue.subject}"`);
console.log(`Blocks:   ${issue.blocks.length}`);
console.log(`Mode:     ${mode}`);
console.log(`Recipients: ${recipients.length}`);
console.log(`List-Unsubscribe: ${messages[0].headers['List-Unsubscribe']}`);

if (mode === 'dry-run') {
  const out = join(root, `newsletter-send-dryrun-${issue.id}.html`);
  writeFileSync(out, messages[0].html);
  console.log(`\nDry run — nothing sent. First rendered message written to:\n  ${out}`);
} else {
  await sendBatches(messages);
  console.log(`\n✓ Sent ${messages.length} email${messages.length === 1 ? '' : 's'} (${mode}).`);
}
