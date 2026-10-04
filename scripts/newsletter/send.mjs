import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadSrc, root } from '../lib/data-loader.mjs';
import { d1Exec, d1Query, escapeSql, isEmail } from './d1.mjs';
import { renderIssueEmail } from './render.mjs';

const ORIGIN = 'https://jeromefaria.com';
const WORKER = 'https://contact.jeromefaria.workers.dev';
const FROM = 'Jerome Faria <newsletter@jeromefaria.com>';
const RESEND_BATCH_URL = 'https://api.resend.com/emails/batch';
const BATCH_LIMIT = 100;
const BATCH_INTERVAL_MS = 550;
const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 500;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const unsubscribeUrl = token => `${WORKER}/newsletter/unsubscribe?token=${token}`;
const unsubscribePageUrl = token => `${ORIGIN}/newsletter?unsubscribe=${token}`;

const readEnv = key => {
  if (process.env[key]) return process.env[key];
  const devVars = join(root, 'worker/.dev.vars');
  if (existsSync(devVars)) {
    const line = readFileSync(devVars, 'utf8').split('\n').find(entry => entry.startsWith(`${key}=`));
    if (line) return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, '');
  }
  return null;
};

const ensureSendsTable = () =>
  d1Exec('CREATE TABLE IF NOT EXISTS sends (issue_id TEXT NOT NULL, email TEXT NOT NULL, sent_at TEXT NOT NULL, PRIMARY KEY (issue_id, email))');

const fetchActiveSubscribers = () => d1Query("SELECT email, unsubscribe_token FROM subscribers WHERE status = 'active'");

const fetchSentEmails = issueId => d1Query(`SELECT email FROM sends WHERE issue_id = '${escapeSql(issueId)}'`).map(row => row.email);

const recordSent = (issueId, recipients) => {
  const now = new Date().toISOString();
  const values = recipients
    .map(recipient => `('${escapeSql(issueId)}', '${escapeSql(recipient.email)}', '${now}')`)
    .join(', ');
  d1Exec(`INSERT OR IGNORE INTO sends (issue_id, email, sent_at) VALUES ${values}`);
};

export const chunk = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_unused, index) => items.slice(index * size, index * size + size));

export const recipientsToSend = (active, sentEmails) => {
  const sent = new Set(sentEmails);
  return active.filter(recipient => !sent.has(recipient.email));
};

export const parseRecipientList = text => {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const header = lines[0].toLowerCase().split(',').map(column => column.trim());
  const emailColumn = header.indexOf('email');
  const hasHeader = emailColumn !== -1;
  const rows = hasHeader ? lines.slice(1) : lines;

  const emails = [...new Set(
    rows.map(line => (hasHeader ? (line.split(',')[emailColumn] ?? '') : line).trim().toLowerCase()).filter(Boolean),
  )];

  const invalid = emails.filter(email => !isEmail(email));
  if (invalid.length > 0) {
    throw new Error(`Invalid email${invalid.length === 1 ? '' : 's'} in recipient list: ${invalid.join(', ')}`);
  }

  return emails.map(email => ({ email }));
};

const loadRecipientsFromFile = path => parseRecipientList(readFileSync(path, 'utf8'));

export const excludeActiveSubscribers = (recipients, activeEmails) => {
  const active = new Set(activeEmails.map(email => email.toLowerCase()));
  return recipients.filter(recipient => !active.has(recipient.email));
};

export const sendBatchWithRetry = async (batch, { apiKey, fetchImpl = fetch, sleepImpl = sleep, maxRetries = MAX_RETRIES }) => {
  for (let attempt = 0; ; attempt += 1) {
    const response = await fetchImpl(RESEND_BATCH_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });
    if (response.ok) {
      const body = await response.json();
      const accepted = Array.isArray(body?.data) ? body.data.length : 0;
      if (accepted !== batch.length) {
        throw new Error(`Resend accepted ${accepted}/${batch.length} in a batch — aborting rather than risk dropping recipients`);
      }
      return;
    }

    const retriable = response.status === 429 || response.status >= 500;
    if (!retriable || attempt >= maxRetries) {
      throw new Error(`Resend batch failed: ${response.status} ${await response.text()}`);
    }

    const retryAfter = Number(response.headers.get('retry-after'));
    const backoff = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : BASE_BACKOFF_MS * 2 ** attempt;
    await sleepImpl(backoff);
  }
};

export const buildMessages = (issue, recipients, { standalone = false } = {}) => {
  if (standalone) {
    const { html } = renderIssueEmail(issue, { origin: ORIGIN, embedImages: false, dated: false });
    return recipients.map(recipient => ({ from: FROM, to: [recipient.email], subject: issue.subject, html }));
  }

  return recipients.map(recipient => {
    const { html } = renderIssueEmail(issue, {
      origin: ORIGIN,
      embedImages: false,
      viewUrl: `${ORIGIN}/newsletter/${issue.id}`,
      unsubscribeUrl: unsubscribePageUrl(recipient.unsubscribe_token),
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
};

const recipientsFor = mode => {
  if (mode === 'test') {
    const testEmail = readEnv('NEWSLETTER_TEST_EMAIL');
    if (!testEmail) throw new Error('Set NEWSLETTER_TEST_EMAIL to a test address for --test.');
    return [{ email: testEmail, unsubscribe_token: 'test-token' }];
  }

  const placeholder = [{ email: 'preview@example.com', unsubscribe_token: 'placeholder-token' }];

  try {
    const active = fetchActiveSubscribers();
    return mode === 'dry-run' && active.length === 0 ? placeholder : active;
  } catch (error) {
    if (mode === 'send') throw error;
    console.warn('⚠  Could not read D1 (not provisioned yet?) — using a placeholder recipient for the dry run.');
    return placeholder;
  }
};

export const resolveAudience = ({ standalone, mode, recipientsFile }) => {
  if (!(standalone && mode !== 'test')) return recipientsFor(mode);

  const fromFile = loadRecipientsFromFile(recipientsFile);
  try {
    return excludeActiveSubscribers(fromFile, fetchActiveSubscribers().map(subscriber => subscriber.email));
  } catch (error) {
    if (mode === 'send') throw error;
    console.warn('⚠  Could not read D1 to exclude active subscribers — proceeding without that check (dry run).');
    return fromFile;
  }
};

const printSummary = ({ issue, mode, standalone, audience, alreadySent, recipients }) => {
  console.log(`Issue:      ${issue.id} — "${issue.subject}"`);
  console.log(`Blocks:     ${issue.blocks.length}`);
  console.log(`Mode:       ${mode}${standalone ? ' (standalone invite)' : ''}`);
  if (mode === 'send') {
    console.log(`${standalone ? 'Recipients:' : 'Active:    '} ${audience.length}`);
    console.log(`Already sent: ${alreadySent.length}`);
  }
  console.log(`To send:    ${recipients.length}`);
};

const deliver = async ({ issue, recipients, standalone, mode }) => {
  const apiKey = readEnv('RESEND_API_KEY');
  if (!apiKey) throw new Error('Set RESEND_API_KEY (env or worker/.dev.vars) to send.');

  const batches = chunk(recipients, BATCH_LIMIT);
  let sentCount = 0;

  for (const [index, batch] of batches.entries()) {
    await sendBatchWithRetry(buildMessages(issue, batch, { standalone }), { apiKey });
    if (mode === 'send') recordSent(issue.id, batch);
    sentCount += batch.length;
    if (index < batches.length - 1) await sleep(BATCH_INTERVAL_MS);
  }

  console.log(`\n✓ Sent ${sentCount} email${sentCount === 1 ? '' : 's'} (${mode}).`);
};

const run = async () => {
  const args = process.argv.slice(2);
  const id = args.find(argument => !argument.startsWith('--'));
  const mode = args.includes('--send') ? 'send' : args.includes('--test') ? 'test' : 'dry-run';
  const recipientsFlag = args.indexOf('--recipients');
  const recipientsFile = recipientsFlag === -1 ? null : args[recipientsFlag + 1];
  const standalone = Boolean(recipientsFile);

  if (!id) {
    console.error('Usage: node scripts/newsletter/send.mjs <issue-id> [--recipients <file>] [--test | --send]');
    process.exit(1);
  }

  const { issue } = await loadSrc(`data/newsletter/issues/${id}.ts`);

  if (mode === 'send') ensureSendsTable();

  const audience = resolveAudience({ standalone, mode, recipientsFile });
  const alreadySent = mode === 'send' ? fetchSentEmails(issue.id) : [];
  const recipients = mode === 'send' ? recipientsToSend(audience, alreadySent) : audience;

  printSummary({ issue, mode, standalone, audience, alreadySent, recipients });

  if (recipients.length === 0) {
    console.log('\nNothing to send — every recipient already received this issue.');
    return;
  }

  const firstMessage = buildMessages(issue, [recipients[0]], { standalone })[0];
  if (!standalone) console.log(`List-Unsubscribe: ${firstMessage.headers['List-Unsubscribe']}`);

  if (mode === 'dry-run') {
    const out = join(root, `newsletter-send-dryrun-${issue.id}.html`);
    writeFileSync(out, firstMessage.html);
    console.log(`\nDry run — nothing sent. First rendered message written to:\n  ${out}`);
    return;
  }

  await deliver({ issue, recipients, standalone, mode });
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
