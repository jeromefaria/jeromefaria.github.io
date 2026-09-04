interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
  CONTACT_FROM: string;
  CONTACT_TO: string;
  ALLOWED_ORIGINS: string;
  RATE_LIMITER?: RateLimiter;
}

interface ContactField {
  label: string;
  value: string;
}

export interface ContactPayload {
  token: string;
  inquiry: string;
  name: string;
  email: string;
  message: string;
  fields?: ContactField[];
  botField?: string;
}

const REQUIRED_KEYS = ['token', 'inquiry', 'name', 'email', 'message'] as const;

const MAX_LENGTHS = {
  name: 200,
  email: 254,
  inquiry: 100,
  message: 5000,
  fieldLabel: 100,
  fieldValue: 1000,
} as const;

const MAX_FIELDS = 20;
const MAX_BODY_BYTES = 64 * 1024;

// eslint-disable-next-line local/no-comments -- security: DoS-cap + header-injection constraint
// The MAX_LENGTHS caps are the real DoS guard; this pattern also rejects the whitespace/angle-brackets used for reply-to header spoofing.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_SEND_URL = 'https://api.resend.com/emails';

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, character => HTML_ENTITIES[character] ?? character);

const corsHeaders = (origin: string | null, allowed: string[]): Record<string, string> => {
  const allowOrigin = origin && allowed.includes(origin) ? origin : (allowed[0] ?? '');

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
};

const jsonResponse = (body: unknown, status: number, headers: Record<string, string>): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

const toHostname = (origin: string): string => {
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

const firstMissingKey = (payload: ContactPayload): string | null =>
  REQUIRED_KEYS.find(key => {
    const value = payload[key];
    return typeof value !== 'string' || value.trim() === '';
  }) ?? null;

const hasValidFields = (fields: unknown): fields is ContactField[] | undefined =>
  fields === undefined ||
  (Array.isArray(fields) &&
    fields.every(field =>
      field !== null &&
      typeof field === 'object' &&
      typeof (field as ContactField).label === 'string' &&
      typeof (field as ContactField).value === 'string'));

// eslint-disable-next-line local/no-comments -- security: header-injection constraint
// name/inquiry are free-text but land in the email subject/reply-to, so control chars (CR/LF) must stay rejected to prevent header injection.
const firstInvalidKey = (payload: ContactPayload): string | null => {
  if (CONTROL_CHARS.test(payload.name)) return 'name';
  if (CONTROL_CHARS.test(payload.email) || !EMAIL_PATTERN.test(payload.email)) return 'email';
  if (CONTROL_CHARS.test(payload.inquiry)) return 'inquiry';
  return null;
};

const firstOversizedKey = (payload: ContactPayload): string | null => {
  if (payload.name.length > MAX_LENGTHS.name) return 'name';
  if (payload.email.length > MAX_LENGTHS.email) return 'email';
  if (payload.inquiry.length > MAX_LENGTHS.inquiry) return 'inquiry';
  if (payload.message.length > MAX_LENGTHS.message) return 'message';
  if ((payload.fields?.length ?? 0) > MAX_FIELDS) return 'fields';
  if (payload.fields?.some(field => field.label.length > MAX_LENGTHS.fieldLabel || field.value.length > MAX_LENGTHS.fieldValue)) return 'fields';
  return null;
};

export const validationError = (payload: ContactPayload): string | null => {
  const missing = firstMissingKey(payload);
  if (missing) return `Missing required field: ${missing}`;
  if (!hasValidFields(payload.fields)) return 'Invalid field format';
  const invalid = firstInvalidKey(payload);
  if (invalid) return `Invalid field: ${invalid}`;
  const oversized = firstOversizedKey(payload);
  if (oversized) return `Field too long: ${oversized}`;
  return null;
};

const detailRows = (payload: ContactPayload): [string, string][] => [
  ['Inquiry', payload.inquiry],
  ['Name', payload.name],
  ['Email', payload.email],
  ...(payload.fields ?? [])
    .filter(field => field.value?.trim())
    .map(field => [field.label, field.value] as [string, string]),
];

const emailText = (payload: ContactPayload): string =>
  [...detailRows(payload).map(([label, value]) => `${label}: ${value}`), '', payload.message].join('\n');

const emailHtml = (payload: ContactPayload): string => {
  const rows = detailRows(payload)
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join('');

  return `${rows}<hr><p>${escapeHtml(payload.message).replace(/\n/g, '<br>')}</p>`;
};

const verifyTurnstile = async (token: string, secret: string, request: Request, allowedHosts: string[]): Promise<boolean> => {
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

const sendEmail = async (payload: ContactPayload, env: Env): Promise<boolean> => {
  const response = await fetch(RESEND_SEND_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO,
      reply_to: payload.email,
      subject: `[${payload.inquiry}] Jerome Faria — ${payload.name}`,
      text: emailText(payload),
      html: emailHtml(payload),
    }),
  });

  if (!response.ok) {
    console.error('Resend send failed:', response.status, await response.text());
    return false;
  }

  return true;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(entry => entry.trim()).filter(Boolean);
    const allowedHosts = allowedOrigins.map(toHostname).filter(Boolean);
    const cors = corsHeaders(origin, allowedOrigins);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, cors);
    }

    if (!isOriginAllowed(origin, allowedOrigins)) {
      return jsonResponse({ error: 'Origin not allowed' }, 403, cors);
    }

    if (await isRateLimited(env, request.headers.get('CF-Connecting-IP'))) {
      return jsonResponse({ error: 'Too many requests' }, 429, cors);
    }

    if (exceedsBodyLimit(request)) {
      return jsonResponse({ error: 'Payload too large' }, 413, cors);
    }

    let payload: ContactPayload;
    try {
      payload = (await request.json()) as ContactPayload;
    } catch {
      return jsonResponse({ error: 'Invalid request body' }, 400, cors);
    }

    if (payload.botField) {
      return jsonResponse({ ok: true }, 200, cors);
    }

    const invalidReason = validationError(payload);
    if (invalidReason) {
      return jsonResponse({ error: invalidReason }, 400, cors);
    }

    try {
      const verified = await verifyTurnstile(payload.token, env.TURNSTILE_SECRET, request, allowedHosts);
      if (!verified) {
        return jsonResponse({ error: 'Verification failed' }, 403, cors);
      }

      const delivered = await sendEmail(payload, env);
      if (!delivered) {
        return jsonResponse({ error: 'Could not send message' }, 502, cors);
      }

      return jsonResponse({ ok: true }, 200, cors);
    } catch (error) {
      console.error('Contact relay error:', error);
      return jsonResponse({ error: 'Could not send message' }, 502, cors);
    }
  },
};
