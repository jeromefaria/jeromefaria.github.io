export interface Env {
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
  CONTACT_FROM: string;
  CONTACT_TO: string;
  ALLOWED_ORIGINS: string;
}

interface ContactField {
  label: string;
  value: string;
}

interface ContactPayload {
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
  fieldValue: 1000,
} as const;

const MAX_FIELDS = 20;

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

const firstMissingKey = (payload: ContactPayload): string | null =>
  REQUIRED_KEYS.find(key => String(payload[key] ?? '').trim() === '') ?? null;

const firstOversizedKey = (payload: ContactPayload): string | null => {
  if (payload.name.length > MAX_LENGTHS.name) return 'name';
  if (payload.email.length > MAX_LENGTHS.email) return 'email';
  if (payload.inquiry.length > MAX_LENGTHS.inquiry) return 'inquiry';
  if (payload.message.length > MAX_LENGTHS.message) return 'message';
  if ((payload.fields?.length ?? 0) > MAX_FIELDS) return 'fields';
  if (payload.fields?.some(field => (field.value?.length ?? 0) > MAX_LENGTHS.fieldValue)) return 'fields';
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

const verifyTurnstile = async (token: string, secret: string, request: Request): Promise<boolean> => {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);

  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) {
    form.append('remoteip', ip);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form });
  const result = (await response.json()) as { success?: boolean };

  return result.success === true;
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
    const cors = corsHeaders(origin, allowedOrigins);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, cors);
    }

    // A browser that sends a disallowed Origin is rejected outright; CORS headers alone
    // don't stop the request reaching here. Origin-less (script) clients still face Turnstile.
    if (origin !== null && !allowedOrigins.includes(origin)) {
      return jsonResponse({ error: 'Origin not allowed' }, 403, cors);
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

    const missing = firstMissingKey(payload);
    if (missing) {
      return jsonResponse({ error: `Missing required field: ${missing}` }, 400, cors);
    }

    const oversized = firstOversizedKey(payload);
    if (oversized) {
      return jsonResponse({ error: `Field too long: ${oversized}` }, 400, cors);
    }

    try {
      const verified = await verifyTurnstile(payload.token, env.TURNSTILE_SECRET, request);
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
