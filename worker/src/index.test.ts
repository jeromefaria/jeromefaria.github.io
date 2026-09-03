import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import worker, { type Env } from './index';

const ENV: Env = {
  TURNSTILE_SECRET: 'secret',
  RESEND_API_KEY: 'rk_test',
  CONTACT_FROM: 'contact@jeromefaria.com',
  CONTACT_TO: 'jerome.faria@gmail.com',
  ALLOWED_ORIGINS: 'https://jeromefaria.com,http://localhost:5173',
};

const VALID_BODY = {
  token: 'tok',
  inquiry: 'booking',
  name: 'Jane Roe',
  email: 'jane@example.com',
  message: 'Hello there.',
  fields: [{ label: 'Location', value: 'Lisbon' }],
  botField: '',
};

const postRequest = (body: unknown, origin = 'https://jeromefaria.com'): Request =>
  new Request('https://worker.example/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': origin },
    body: JSON.stringify(body),
  });

const turnstileResult = (success: boolean): Response =>
  ({ ok: true, json: async () => ({ success }) }) as unknown as Response;

const resendResult = (ok: boolean): Response => ({ ok, text: async () => 'error body' }) as unknown as Response;

const sentBody = (fetchMock: ReturnType<typeof vi.spyOn>): Record<string, string> =>
  JSON.parse((fetchMock.mock.calls[1] as [string, RequestInit])[1].body as string);

describe('contact worker', () => {
  let fetchMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock = vi.spyOn(globalThis, 'fetch');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('answers a CORS preflight with an allowed origin', async () => {
    const request = new Request('https://worker.example/', {
      method: 'OPTIONS',
      headers: { 'Origin': 'https://jeromefaria.com' },
    });

    const response = await worker.fetch(request, ENV);

    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://jeromefaria.com');
  });

  it('rejects a non-POST method', async () => {
    const response = await worker.fetch(new Request('https://worker.example/'), ENV);
    expect(response.status).toBe(405);
  });

  it('rejects an invalid JSON body', async () => {
    const request = new Request('https://worker.example/', { method: 'POST', body: '{' });
    const response = await worker.fetch(request, ENV);
    expect(response.status).toBe(400);
  });

  it('silently drops a filled honeypot without calling out', async () => {
    const response = await worker.fetch(postRequest({ ...VALID_BODY, botField: 'spam' }), ENV);

    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a blank required field before verifying', async () => {
    const response = await worker.fetch(postRequest({ ...VALID_BODY, name: '  ' }), ENV);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a request from a disallowed origin before doing anything', async () => {
    const response = await worker.fetch(postRequest(VALID_BODY, 'https://evil.example'), ENV);

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an over-long message before verifying', async () => {
    const response = await worker.fetch(postRequest({ ...VALID_BODY, message: 'x'.repeat(5001) }), ENV);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects too many extra fields', async () => {
    const fields = Array.from({ length: 21 }, (_unused, index) => ({ label: `L${index}`, value: 'v' }));
    const response = await worker.fetch(postRequest({ ...VALID_BODY, fields }), ENV);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a malformed (non-array) fields value without crashing', async () => {
    const response = await worker.fetch(postRequest({ ...VALID_BODY, fields: 1 }), ENV);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an over-long field label', async () => {
    const fields = [{ label: 'L'.repeat(101), value: 'v' }];
    const response = await worker.fetch(postRequest({ ...VALID_BODY, fields }), ENV);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid email address (reply-to spoofing) before verifying', async () => {
    const response = await worker.fetch(postRequest({ ...VALID_BODY, email: 'Support <evil@attacker.example>' }), ENV);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects control characters in a header-bound field', async () => {
    const response = await worker.fetch(postRequest({ ...VALID_BODY, name: 'Jane\r\nBcc: evil@x' }), ENV);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an inquiry outside the slug taxonomy', async () => {
    const response = await worker.fetch(postRequest({ ...VALID_BODY, inquiry: 'Anything I Want' }), ENV);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an over-large body before parsing', async () => {
    const request = new Request('https://worker.example/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://jeromefaria.com',
        'Content-Length': String(64 * 1024 + 1),
      },
      body: JSON.stringify(VALID_BODY),
    });

    const response = await worker.fetch(request, ENV);

    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a Turnstile token minted for a different hostname', async () => {
    fetchMock.mockResolvedValueOnce(
      { ok: true, json: async () => ({ success: true, hostname: 'evil.example' }) } as unknown as Response,
    );

    const response = await worker.fetch(postRequest(VALID_BODY), ENV);

    expect(response.status).toBe(403);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects a failed Turnstile verification without sending', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(false));

    const response = await worker.fetch(postRequest(VALID_BODY), ENV);

    expect(response.status).toBe(403);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('verifies, sends via Resend, and returns ok', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(true)).mockResolvedValueOnce(resendResult(true));

    const response = await worker.fetch(postRequest(VALID_BODY), ENV);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    const sent = sentBody(fetchMock);
    expect((fetchMock.mock.calls[1] as [string, RequestInit])[0]).toBe('https://api.resend.com/emails');
    expect(sent.from).toBe(ENV.CONTACT_FROM);
    expect(sent.to).toBe(ENV.CONTACT_TO);
    expect(sent.reply_to).toBe('jane@example.com');
    expect(sent.subject).toBe('[booking] Jerome Faria — Jane Roe');
    expect(sent.text).toContain('Location: Lisbon');
    expect(sent.html).toContain('<strong>Email:</strong>');
  });

  it('returns 502 when Resend fails', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(true)).mockResolvedValueOnce(resendResult(false));

    const response = await worker.fetch(postRequest(VALID_BODY), ENV);

    expect(response.status).toBe(502);
  });

  it('returns a CORS 502 when a downstream request throws', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network error'));

    const response = await worker.fetch(postRequest(VALID_BODY), ENV);

    expect(response.status).toBe(502);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://jeromefaria.com');
  });

  it('escapes HTML in user content', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(true)).mockResolvedValueOnce(resendResult(true));

    await worker.fetch(postRequest({ ...VALID_BODY, message: '<script>alert(1)</script>' }), ENV);

    const sent = sentBody(fetchMock);
    expect(sent.html).toContain('&lt;script&gt;');
    expect(sent.html).not.toContain('<script>');
  });

  it('falls back to the primary origin for a disallowed one', async () => {
    fetchMock.mockResolvedValue(turnstileResult(true));

    const response = await worker.fetch(postRequest(VALID_BODY, 'https://evil.example'), ENV);

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://jeromefaria.com');
  });

  const ipRequest = (): Request =>
    new Request('https://worker.example/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'https://jeromefaria.com', 'CF-Connecting-IP': '1.2.3.4' },
      body: JSON.stringify(VALID_BODY),
    });

  it('returns 429 without verifying when the rate limiter denies the IP', async () => {
    const env: Env = { ...ENV, RATE_LIMITER: { limit: async () => ({ success: false }) } };

    const response = await worker.fetch(ipRequest(), env);

    expect(response.status).toBe(429);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('proceeds when the rate limiter allows the IP', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(true)).mockResolvedValueOnce(resendResult(true));
    const env: Env = { ...ENV, RATE_LIMITER: { limit: async () => ({ success: true }) } };

    const response = await worker.fetch(ipRequest(), env);

    expect(response.status).toBe(200);
  });
});
