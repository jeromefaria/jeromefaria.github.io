import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import worker, { type Env } from './index';

interface SubscriberRecord {
  email: string;
  status: string;
  confirm_token: string | null;
  unsubscribe_token: string;
  created_at: string;
  confirmed_at?: string;
  unsubscribed_at?: string;
}

const createMockDb = (seed: SubscriberRecord[] = []): { binding: Env['DB']; rows: SubscriberRecord[] } => {
  const rows: SubscriberRecord[] = seed.map(row => ({ ...row }));

  const prepare = (sql: string) => {
    let args: unknown[] = [];

    const statement = {
      bind: (...bound: unknown[]) => {
        args = bound;
        return statement;
      },
      first: async () => {
        const byColumn = (column: 'email' | 'confirm_token' | 'unsubscribe_token'): SubscriberRecord | undefined =>
          rows.find(row => row[column] === args[0]);

        const match = sql.includes('WHERE email = ?1')
          ? byColumn('email')
          : sql.includes('WHERE confirm_token = ?1')
            ? byColumn('confirm_token')
            : byColumn('unsubscribe_token');

        return match ? { status: match.status } : null;
      },
      run: async () => {
        if (sql.startsWith('INSERT INTO subscribers')) {
          const email = args[0] as string;
          const confirmToken = args[1] as string;
          const unsubscribeToken = args[2] as string;
          const now = args[3] as string;
          const existing = rows.find(row => row.email === email);

          if (existing) {
            existing.status = 'pending';
            existing.confirm_token = confirmToken;
            existing.created_at = now;
          } else {
            rows.push({
              email,
              status: 'pending',
              confirm_token: confirmToken,
              unsubscribe_token: unsubscribeToken,
              created_at: now,
            });
          }
        } else if (sql.includes("SET status = 'active'")) {
          const found = rows.find(row => row.confirm_token === args[0]);
          if (found) {
            found.status = 'active';
            found.confirmed_at = args[1] as string;
          }
        } else if (sql.includes("SET status = 'unsubscribed'")) {
          const found = rows.find(row => row.unsubscribe_token === args[0]);
          if (found) {
            found.status = 'unsubscribed';
            found.unsubscribed_at = args[1] as string;
          }
        }

        return { success: true };
      },
    };

    return statement;
  };

  return { binding: { prepare } as unknown as Env['DB'], rows };
};

const baseEnv = (db: Env['DB']): Env => ({
  TURNSTILE_SECRET: 'secret',
  RESEND_API_KEY: 'rk_test',
  CONTACT_FROM: 'contact@jeromefaria.com',
  CONTACT_TO: 'jerome.faria@gmail.com',
  NEWSLETTER_FROM: 'newsletter@jeromefaria.com',
  SITE_URL: 'https://jeromefaria.com',
  ALLOWED_ORIGINS: 'https://jeromefaria.com',
  DB: db,
});

const subscribeRequest = (body: unknown, origin = 'https://jeromefaria.com'): Request =>
  new Request('https://worker.example/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': origin },
    body: JSON.stringify(body),
  });

const VALID_SUBSCRIBE = { token: 'tok', email: 'Reader@Example.com', botField: '' };

const turnstileResult = (success: boolean): Response =>
  ({ ok: true, json: async () => ({ success }) }) as unknown as Response;

const resendResult = (ok: boolean): Response => ({ ok, text: async () => 'error body' }) as unknown as Response;

const sentBody = (fetchMock: ReturnType<typeof vi.spyOn>): Record<string, string> =>
  JSON.parse((fetchMock.mock.calls[1] as [string, RequestInit])[1].body as string);

describe('newsletter — subscribe', () => {
  let fetchMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock = vi.spyOn(globalThis, 'fetch');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stores a pending subscriber and sends a confirmation email', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(true)).mockResolvedValueOnce(resendResult(true));
    const { binding, rows } = createMockDb();

    const response = await worker.fetch(subscribeRequest(VALID_SUBSCRIBE), baseEnv(binding));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.email).toBe('reader@example.com');
    expect(rows[0]?.status).toBe('pending');
    expect(rows[0]?.confirm_token).toMatch(/^[0-9a-f]{64}$/);

    const sent = sentBody(fetchMock);
    expect((fetchMock.mock.calls[1] as [string, RequestInit])[0]).toBe('https://api.resend.com/emails');
    expect(sent.from).toBe('newsletter@jeromefaria.com');
    expect(sent.to).toBe('reader@example.com');
    expect(sent.reply_to).toBeUndefined();
    expect(sent.html).toContain('https://worker.example/newsletter/confirm?token=');
  });

  it('silently drops a filled honeypot without touching the database or network', async () => {
    const { binding, rows } = createMockDb();

    const response = await worker.fetch(subscribeRequest({ ...VALID_SUBSCRIBE, botField: 'spam' }), baseEnv(binding));

    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(rows).toHaveLength(0);
  });

  it('rejects a missing token', async () => {
    const { binding } = createMockDb();
    const response = await worker.fetch(subscribeRequest({ email: 'a@b.co' }), baseEnv(binding));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a missing email', async () => {
    const { binding } = createMockDb();
    const response = await worker.fetch(subscribeRequest({ token: 'tok' }), baseEnv(binding));
    expect(response.status).toBe(400);
  });

  it('rejects a malformed email before verifying', async () => {
    const { binding } = createMockDb();
    const response = await worker.fetch(subscribeRequest({ ...VALID_SUBSCRIBE, email: 'Support <evil@x>' }), baseEnv(binding));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an over-long email', async () => {
    const { binding } = createMockDb();
    const email = `${'x'.repeat(250)}@example.com`;
    const response = await worker.fetch(subscribeRequest({ ...VALID_SUBSCRIBE, email }), baseEnv(binding));
    expect(response.status).toBe(400);
  });

  it('rejects a failed Turnstile verification without storing', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(false));
    const { binding, rows } = createMockDb();

    const response = await worker.fetch(subscribeRequest(VALID_SUBSCRIBE), baseEnv(binding));

    expect(response.status).toBe(403);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(rows).toHaveLength(0);
  });

  it('returns a neutral ok without a second email for an already-active address', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(true));
    const { binding } = createMockDb([
      { email: 'reader@example.com', status: 'active', confirm_token: null, unsubscribe_token: 'u1', created_at: 't' },
    ]);

    const response = await worker.fetch(subscribeRequest(VALID_SUBSCRIBE), baseEnv(binding));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('re-arms a previously unsubscribed address back to pending', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(true)).mockResolvedValueOnce(resendResult(true));
    const { binding, rows } = createMockDb([
      { email: 'reader@example.com', status: 'unsubscribed', confirm_token: null, unsubscribe_token: 'u1', created_at: 't' },
    ]);

    const response = await worker.fetch(subscribeRequest(VALID_SUBSCRIBE), baseEnv(binding));

    expect(response.status).toBe(200);
    expect(rows[0]?.status).toBe('pending');
    expect(rows[0]?.confirm_token).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns 502 when the confirmation email fails to send', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(true)).mockResolvedValueOnce(resendResult(false));
    const { binding } = createMockDb();

    const response = await worker.fetch(subscribeRequest(VALID_SUBSCRIBE), baseEnv(binding));

    expect(response.status).toBe(502);
  });

  it('returns 502 when a database call throws', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(true));
    const throwingDb = { prepare: () => ({ bind: () => ({ first: async () => { throw new Error('d1 down'); } }) }) } as unknown as Env['DB'];

    const response = await worker.fetch(subscribeRequest(VALID_SUBSCRIBE), baseEnv(throwingDb));

    expect(response.status).toBe(502);
  });

  it('returns 405 for a GET to the subscribe endpoint', async () => {
    const { binding } = createMockDb();
    const request = new Request('https://worker.example/newsletter/subscribe', {
      method: 'GET',
      headers: { 'Origin': 'https://jeromefaria.com' },
    });

    const response = await worker.fetch(request, baseEnv(binding));

    expect(response.status).toBe(405);
  });

  it('rejects a disallowed origin', async () => {
    const { binding } = createMockDb();
    const response = await worker.fetch(subscribeRequest(VALID_SUBSCRIBE, 'https://evil.example'), baseEnv(binding));
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 429 when the rate limiter denies the IP', async () => {
    const { binding } = createMockDb();
    const env: Env = { ...baseEnv(binding), RATE_LIMITER: { limit: async () => ({ success: false }) } };
    const request = new Request('https://worker.example/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'https://jeromefaria.com', 'CF-Connecting-IP': '1.2.3.4' },
      body: JSON.stringify(VALID_SUBSCRIBE),
    });

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(429);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('newsletter — confirm', () => {
  const confirmRequest = (query: string): Request =>
    new Request(`https://worker.example/newsletter/confirm${query}`);

  it('activates a pending subscriber and redirects with confirmed=1', async () => {
    const { binding, rows } = createMockDb([
      { email: 'reader@example.com', status: 'pending', confirm_token: 'ct', unsubscribe_token: 'ut', created_at: 't' },
    ]);

    const response = await worker.fetch(confirmRequest('?token=ct'), baseEnv(binding));

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://jeromefaria.com/newsletter?confirmed=1');
    expect(rows[0]?.status).toBe('active');
    expect(rows[0]?.confirmed_at).toBeTruthy();
  });

  it('is idempotent for an already-active token', async () => {
    const { binding, rows } = createMockDb([
      { email: 'reader@example.com', status: 'active', confirm_token: 'ct', unsubscribe_token: 'ut', created_at: 't', confirmed_at: 'earlier' },
    ]);

    const response = await worker.fetch(confirmRequest('?token=ct'), baseEnv(binding));

    expect(response.headers.get('Location')).toBe('https://jeromefaria.com/newsletter?confirmed=1');
    expect(rows[0]?.confirmed_at).toBe('earlier');
  });

  it('redirects with confirmed=0 for a missing token', async () => {
    const { binding } = createMockDb();
    const response = await worker.fetch(confirmRequest(''), baseEnv(binding));
    expect(response.headers.get('Location')).toBe('https://jeromefaria.com/newsletter?confirmed=0');
  });

  it('redirects with confirmed=0 for an unknown token', async () => {
    const { binding } = createMockDb();
    const response = await worker.fetch(confirmRequest('?token=nope'), baseEnv(binding));
    expect(response.headers.get('Location')).toBe('https://jeromefaria.com/newsletter?confirmed=0');
  });
});

describe('newsletter — unsubscribe', () => {
  const seed = (): SubscriberRecord[] => [
    { email: 'reader@example.com', status: 'active', confirm_token: null, unsubscribe_token: 'ut', created_at: 't', confirmed_at: 'c' },
  ];

  const unsubscribeRequest = (query: string, method = 'GET'): Request =>
    new Request(`https://worker.example/newsletter/unsubscribe${query}`, { method });

  it('tombstones the subscriber and redirects on a GET link click', async () => {
    const { binding, rows } = createMockDb(seed());

    const response = await worker.fetch(unsubscribeRequest('?token=ut'), baseEnv(binding));

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://jeromefaria.com/newsletter?unsubscribed=1');
    expect(rows[0]?.status).toBe('unsubscribed');
    expect(rows[0]?.unsubscribed_at).toBeTruthy();
  });

  it('answers a one-click POST with 200 and no redirect', async () => {
    const { binding, rows } = createMockDb(seed());

    const response = await worker.fetch(unsubscribeRequest('?token=ut', 'POST'), baseEnv(binding));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Unsubscribed');
    expect(rows[0]?.status).toBe('unsubscribed');
  });

  it('is idempotent for an already-unsubscribed token', async () => {
    const { binding, rows } = createMockDb([
      { email: 'reader@example.com', status: 'unsubscribed', confirm_token: null, unsubscribe_token: 'ut', created_at: 't', unsubscribed_at: 'earlier' },
    ]);

    const response = await worker.fetch(unsubscribeRequest('?token=ut'), baseEnv(binding));

    expect(response.headers.get('Location')).toBe('https://jeromefaria.com/newsletter?unsubscribed=1');
    expect(rows[0]?.unsubscribed_at).toBe('earlier');
  });

  it('redirects with unsubscribed=0 for a missing token on GET', async () => {
    const { binding } = createMockDb(seed());
    const response = await worker.fetch(unsubscribeRequest(''), baseEnv(binding));
    expect(response.headers.get('Location')).toBe('https://jeromefaria.com/newsletter?unsubscribed=0');
  });

  it('returns 400 for a missing token on a one-click POST', async () => {
    const { binding } = createMockDb(seed());
    const response = await worker.fetch(unsubscribeRequest('', 'POST'), baseEnv(binding));
    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Invalid unsubscribe link');
  });

  it('returns 400 for an unknown token on a one-click POST', async () => {
    const { binding } = createMockDb(seed());
    const response = await worker.fetch(unsubscribeRequest('?token=nope', 'POST'), baseEnv(binding));
    expect(response.status).toBe(400);
  });
});
