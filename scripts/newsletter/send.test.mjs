import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/data-loader.mjs', () => ({ root: '/fake-root', loadSrc: async () => ({}) }));
vi.mock('./render.mjs', () => ({ renderIssueEmail: () => ({ html: '' }) }));

import { escapeSql } from './d1.mjs';
import { chunk, excludeActiveSubscribers, parseRecipientList, recipientsToSend, sendBatchWithRetry } from './send.mjs';

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
});
