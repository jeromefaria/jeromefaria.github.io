import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/data-loader.mjs', () => ({ root: '/fake-root', loadSrc: async () => ({}) }));
vi.mock('./render.mjs', () => ({ renderIssueEmail: () => ({ html: '' }) }));

import { escapeSql } from './d1.mjs';
import { BATCH_LIMIT, batchIdempotencyKey, buildMessages, byEmail, chunk, deliver, excludeActiveSubscribers, parseRecipientList, recipientsToSend, resolveAudience, sendBatchWithRetry } from './send.mjs';

const response = (status, { retryAfter, body, data } = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: name => (name.toLowerCase() === 'retry-after' && retryAfter !== undefined ? String(retryAfter) : null) },
  text: async () => body ?? '',
  json: async () => ({ data: data ?? [] }),
});

const ok = count => response(200, { data: Array.from({ length: count }, (_unused, index) => ({ id: `m${index}` })) });
const batchOf = count => Array.from({ length: count }, (_unused, index) => ({ to: [`r${index}@x.com`] }));

describe('chunk', () => {
  it('splits into fixed-size groups, last one short', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('returns an empty array for no items', () => {
    expect(chunk([], 100)).toEqual([]);
  });
});

describe('recipientsToSend', () => {
  it('drops recipients already recorded as sent for the issue', () => {
    const active = [{ email: 'a@x.com' }, { email: 'b@x.com' }, { email: 'c@x.com' }];
    expect(recipientsToSend(active, ['b@x.com'])).toEqual([{ email: 'a@x.com' }, { email: 'c@x.com' }]);
  });

  it('returns everyone when nothing has been sent yet', () => {
    const active = [{ email: 'a@x.com' }];
    expect(recipientsToSend(active, [])).toEqual(active);
  });

  it('returns nothing when every active recipient is already sent', () => {
    const active = [{ email: 'a@x.com' }, { email: 'b@x.com' }];
    expect(recipientsToSend(active, ['a@x.com', 'b@x.com'])).toEqual([]);
  });
});

describe('byEmail', () => {
  it('orders recipients by email so a run chunks into reproducible batches', () => {
    const recipients = [{ email: 'c@x.com' }, { email: 'a@x.com' }, { email: 'b@x.com' }];
    expect([...recipients].sort(byEmail)).toEqual([{ email: 'a@x.com' }, { email: 'b@x.com' }, { email: 'c@x.com' }]);
  });
});

describe('batchIdempotencyKey', () => {
  it('is stable for the same members regardless of order', () => {
    const forward = batchIdempotencyKey('inv', [{ email: 'a@x.com' }, { email: 'b@x.com' }]);
    const reversed = batchIdempotencyKey('inv', [{ email: 'b@x.com' }, { email: 'a@x.com' }]);
    expect(forward).toBe(reversed);
  });

  it('differs when the membership or the issue differs', () => {
    const base = batchIdempotencyKey('inv', [{ email: 'a@x.com' }]);
    expect(batchIdempotencyKey('inv', [{ email: 'a@x.com' }, { email: 'b@x.com' }])).not.toBe(base);
    expect(batchIdempotencyKey('other', [{ email: 'a@x.com' }])).not.toBe(base);
  });

  it('namespaces the key by issue id and stays within Resend\'s 256-char limit', () => {
    const key = batchIdempotencyKey('inv', [{ email: 'a@x.com' }]);
    expect(key).toMatch(/^newsletter\/inv\/[a-f0-9]{64}$/);
    expect(key.length).toBeLessThanOrEqual(256);
  });
});

describe('escapeSql', () => {
  it('doubles single quotes so an address stays inside its SQL literal', () => {
    expect(escapeSql("o'brien@x.com")).toBe("o''brien@x.com");
  });

  it('leaves a quote-free value unchanged', () => {
    expect(escapeSql('2026-05-12')).toBe('2026-05-12');
  });
});

describe('parseRecipientList', () => {
  it('reads the email column of a CSV, lowercasing and de-duplicating', () => {
    const csv = 'email,name\nA@X.com,Ada\nb@x.com,Bo\nA@x.com,Dup';
    expect(parseRecipientList(csv)).toEqual([{ email: 'a@x.com' }, { email: 'b@x.com' }]);
  });

  it('treats a header-less file as one email per line', () => {
    expect(parseRecipientList('a@x.com\n b@x.com ')).toEqual([{ email: 'a@x.com' }, { email: 'b@x.com' }]);
  });

  it('throws when an address is invalid', () => {
    expect(() => parseRecipientList('email\nnot-an-email')).toThrow(/Invalid email/);
  });

  it('returns nothing for an empty file', () => {
    expect(parseRecipientList('\n  \n')).toEqual([]);
  });
});

describe('excludeActiveSubscribers', () => {
  it('drops recipients already active (case-insensitive), keeps the rest', () => {
    const recipients = [{ email: 'a@x.com' }, { email: 'b@x.com' }];
    expect(excludeActiveSubscribers(recipients, ['A@X.com'])).toEqual([{ email: 'b@x.com' }]);
  });
});

describe('sendBatchWithRetry', () => {
  const opts = extra => ({ apiKey: 'k', sleepImpl: vi.fn().mockResolvedValue(undefined), ...extra });

  it('sends once when the whole batch is accepted', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok(1));
    const options = opts({ fetchImpl });

    await sendBatchWithRetry(batchOf(1), options);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(options.sleepImpl).not.toHaveBeenCalled();
  });

  it('aborts if Resend accepts fewer messages than the batch (no silent drop)', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok(1));

    await expect(sendBatchWithRetry(batchOf(2), opts({ fetchImpl }))).rejects.toThrow(/accepted 1\/2/);
  });

  it('retries on 429 and succeeds', async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(response(429)).mockResolvedValueOnce(ok(1));
    const options = opts({ fetchImpl });

    await sendBatchWithRetry(batchOf(1), options);

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(options.sleepImpl).toHaveBeenCalledTimes(1);
  });

  it('honours the Retry-After header for the backoff', async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(response(429, { retryAfter: 3 })).mockResolvedValueOnce(ok(1));
    const options = opts({ fetchImpl });

    await sendBatchWithRetry(batchOf(1), options);

    expect(options.sleepImpl).toHaveBeenCalledWith(3000);
  });

  it('falls back to exponential backoff when there is no Retry-After', async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(response(500)).mockResolvedValueOnce(ok(1));
    const options = opts({ fetchImpl });

    await sendBatchWithRetry(batchOf(1), options);

    expect(options.sleepImpl).toHaveBeenCalledWith(500);
  });

  it('retries on 5xx then gives up after maxRetries', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response(500, { body: 'boom' }));
    const options = opts({ fetchImpl, maxRetries: 2 });

    await expect(sendBatchWithRetry(batchOf(1), options)).rejects.toThrow(/500 boom/);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it('does not retry a non-retriable status', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response(422, { body: 'bad' }));
    const options = opts({ fetchImpl });

    await expect(sendBatchWithRetry(batchOf(1), options)).rejects.toThrow(/422 bad/);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(options.sleepImpl).not.toHaveBeenCalled();
  });

  it('sends the Idempotency-Key header when one is supplied', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok(1));

    await sendBatchWithRetry(batchOf(1), opts({ fetchImpl, idempotencyKey: 'newsletter/inv/abc' }));

    expect(fetchImpl.mock.calls[0][1].headers['Idempotency-Key']).toBe('newsletter/inv/abc');
  });

  it('omits the Idempotency-Key header when none is supplied', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(ok(1));

    await sendBatchWithRetry(batchOf(1), opts({ fetchImpl }));

    expect(fetchImpl.mock.calls[0][1].headers).not.toHaveProperty('Idempotency-Key');
  });

  it('reuses the same Idempotency-Key across a retry so Resend still dedupes', async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(response(429)).mockResolvedValueOnce(ok(1));

    await sendBatchWithRetry(batchOf(1), opts({ fetchImpl, idempotencyKey: 'newsletter/inv/abc' }));

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls[0][1].headers['Idempotency-Key']).toBe('newsletter/inv/abc');
    expect(fetchImpl.mock.calls[1][1].headers['Idempotency-Key']).toBe('newsletter/inv/abc');
  });
});

describe('buildMessages', () => {
  const issue = { id: 'inv', subject: 'Hi', blocks: [] };

  it('standalone drops the List-Unsubscribe header, one message per recipient', () => {
    const messages = buildMessages(issue, [{ email: 'a@x.com' }, { email: 'b@x.com' }], { standalone: true });

    expect(messages).toHaveLength(2);
    expect(messages[0]).toMatchObject({ to: ['a@x.com'], subject: 'Hi' });
    expect(messages[0].headers).toBeUndefined();
  });

  it('a subscriber send carries a per-recipient List-Unsubscribe + one-click header', () => {
    const messages = buildMessages(issue, [{ email: 'a@x.com', unsubscribe_token: 'tok' }]);

    expect(messages[0].headers['List-Unsubscribe']).toContain('tok');
    expect(messages[0].headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
  });
});

describe('resolveAudience', () => {
  it('test mode sends to NEWSLETTER_TEST_EMAIL, ignoring --recipients', () => {
    process.env.NEWSLETTER_TEST_EMAIL = 'me@x.com';
    const audience = resolveAudience({ standalone: true, mode: 'test', recipientsFile: 'list.csv' });

    expect(audience).toEqual([{ email: 'me@x.com', unsubscribe_token: 'test-token' }]);
    delete process.env.NEWSLETTER_TEST_EMAIL;
  });
});

describe('deliver', () => {
  const issue = { id: 'inv', subject: 'Hi', blocks: [] };
  const deps = extra => ({ apiKey: 'k', send: vi.fn().mockResolvedValue(undefined), record: vi.fn(), sleepImpl: vi.fn().mockResolvedValue(undefined), ...extra });

  it('sorts the audience and sends each batch with its reproducible idempotency key, recording the send', async () => {
    const options = deps();
    const recipients = [{ email: 'c@x.com' }, { email: 'a@x.com' }, { email: 'b@x.com' }];

    await deliver({ issue, recipients, standalone: false, mode: 'send' }, options);

    expect(options.send).toHaveBeenCalledTimes(1);
    const [, sendOptions] = options.send.mock.calls[0];
    expect(sendOptions.idempotencyKey).toBe(batchIdempotencyKey('inv', recipients));
    expect(options.record).toHaveBeenCalledWith('inv', [{ email: 'a@x.com' }, { email: 'b@x.com' }, { email: 'c@x.com' }]);
  });

  it('spaces multiple batches and records each once in send mode', async () => {
    const options = deps();
    const recipients = Array.from({ length: BATCH_LIMIT + 1 }, (_unused, index) => ({ email: `u${index}@x.com` }));

    await deliver({ issue, recipients, standalone: false, mode: 'send' }, options);

    expect(options.send).toHaveBeenCalledTimes(2);
    expect(options.record).toHaveBeenCalledTimes(2);
    expect(options.sleepImpl).toHaveBeenCalledTimes(1);
    expect(options.send.mock.calls[0][1].idempotencyKey).not.toBe(options.send.mock.calls[1][1].idempotencyKey);
  });

  it('does not record sends when the mode is not a real send', async () => {
    const options = deps();

    await deliver({ issue, recipients: [{ email: 'a@x.com' }], standalone: false, mode: 'test' }, options);

    expect(options.send).toHaveBeenCalledTimes(1);
    expect(options.record).not.toHaveBeenCalled();
  });

  it('throws when no API key is available', async () => {
    await expect(
      deliver({ issue, recipients: [{ email: 'a@x.com' }], standalone: false, mode: 'send' }, deps({ apiKey: '' })),
    ).rejects.toThrow(/RESEND_API_KEY/);
  });
});
