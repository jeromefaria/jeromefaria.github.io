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
  inquiry: 'Booking',
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

const resendResult = (ok: boolean): Response => ({ ok }) as unknown as Response;

const sentBody = (fetchMock: ReturnType<typeof vi.spyOn>): Record<string, string> =>
  JSON.parse((fetchMock.mock.calls[1] as [string, RequestInit])[1].body as string);

describe('contact worker', () => {
  let fetchMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock = vi.spyOn(globalThis, 'fetch');
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
    expect(sent.subject).toBe('[Booking] Jerome Faria — Jane Roe');
    expect(sent.text).toContain('Location: Lisbon');
    expect(sent.html).toContain('<strong>Email:</strong>');
  });

  it('returns 502 when Resend fails', async () => {
    fetchMock.mockResolvedValueOnce(turnstileResult(true)).mockResolvedValueOnce(resendResult(false));

    const response = await worker.fetch(postRequest(VALID_BODY), ENV);

    expect(response.status).toBe(502);
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
});
