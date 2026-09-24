interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
  CONTACT_FROM: string;
  CONTACT_TO: string;
  NEWSLETTER_FROM: string;
  SITE_URL: string;
  ALLOWED_ORIGINS: string;
  DB: D1Database;
  RATE_LIMITER?: RateLimiter;
}

export const MAX_BODY_BYTES = 64 * 1024;

// eslint-disable-next-line local/no-comments -- security: DoS-cap + header-injection constraint
// The length caps are the real DoS guard; this pattern also rejects the whitespace/angle-brackets used for reply-to header spoofing.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_SEND_URL = 'https://api.resend.com/emails';

const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
} as const;

const HTML_ESCAPE_PATTERN = new RegExp(`[${Object.keys(HTML_ENTITIES).join('')}]`, 'g');

export const escapeHtml = (value: string): string =>
  value.replace(HTML_ESCAPE_PATTERN, character => HTML_ENTITIES[character as keyof typeof HTML_ENTITIES]);

export const corsHeaders = (origin: string | null, allowed: string[]): Record<string, string> => {
  const allowOrigin = origin && allowed.includes(origin) ? origin : (allowed[0] ?? '');

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
};

export const jsonResponse = (body: unknown, status: number, headers: Record<string, string>): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

export const redirectResponse = (location: string): Response =>
  new Response(null, { status: 302, headers: { Location: location } });

export const toHostname = (origin: string): string => {
  try {
    return new URL(origin).hostname;
  } catch {
    return '';
  }
};

const isOriginAllowed = (origin: string | null, allowed: string[]): boolean =>
  origin === null || allowed.includes(origin);

const exceedsBodyLimit = (request: Request): boolean => {
  const declaredLength = Number(request.headers.get('Content-Length') ?? '0');
  return Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES;
};

const isRateLimited = async (env: Env, clientIp: string | null): Promise<boolean> => {
  if (!env.RATE_LIMITER || !clientIp) return false;
  const { success } = await env.RATE_LIMITER.limit({ key: clientIp });
  return !success;
};

export type PostGuard = { ok: true; body: unknown } | { ok: false; response: Response };

export const guardPost = async (
  request: Request,
  env: Env,
  cors: Record<string, string>,
  allowedOrigins: string[],
): Promise<PostGuard> => {
  if (request.method !== 'POST') {
    return { ok: false, response: jsonResponse({ error: 'Method not allowed' }, 405, cors) };
  }

  if (!isOriginAllowed(request.headers.get('Origin'), allowedOrigins)) {
    return { ok: false, response: jsonResponse({ error: 'Origin not allowed' }, 403, cors) };
  }

  if (await isRateLimited(env, request.headers.get('CF-Connecting-IP'))) {
    return { ok: false, response: jsonResponse({ error: 'Too many requests' }, 429, cors) };
  }

  if (exceedsBodyLimit(request)) {
    return { ok: false, response: jsonResponse({ error: 'Payload too large' }, 413, cors) };
  }

  try {
    return { ok: true, body: await request.json() };
  } catch {
    return { ok: false, response: jsonResponse({ error: 'Invalid request body' }, 400, cors) };
  }
};

export const verifyTurnstile = async (
  token: string,
  secret: string,
  request: Request,
  allowedHosts: string[],
): Promise<boolean> => {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);

  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) {
    form.append('remoteip', ip);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form });
  const result = (await response.json()) as { success?: boolean; hostname?: string };

  if (result.success !== true) return false;

  // eslint-disable-next-line local/no-comments -- security: token hostname-pinning
  // Pin the token to the site's own hostname so a token minted for another site can't be replayed against this worker.
  return !result.hostname || allowedHosts.includes(result.hostname);
};

export interface ResendMessage {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export const sendResendEmail = async (message: ResendMessage, apiKey: string): Promise<boolean> => {
  const response = await fetch(RESEND_SEND_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: message.from,
      to: message.to,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });

  if (!response.ok) {
    console.error('Resend send failed:', response.status, await response.text());
    return false;
  }

  return true;
};
