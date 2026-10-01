import {
  type Env,
  guardPost,
  isValidEmail,
  jsonResponse,
  redirectResponse,
  type ResendMessage,
  sendResendEmail,
  verifyTurnstile,
} from './shared';

interface SubscribePayload {
  token: string;
  email: string;
  botField?: string;
}

interface SubscriberRow {
  status: string;
  created_at?: string;
}

const MAX_EMAIL_LENGTH = 254;

const CONFIRMATION_RESEND_COOLDOWN_MS = 10 * 60 * 1000;

const randomToken = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
};

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const withinResendCooldown = (createdAt?: string): boolean => {
  if (!createdAt) return false;

  return Date.now() - new Date(createdAt).getTime() < CONFIRMATION_RESEND_COOLDOWN_MS;
};

const subscribeValidationError = (payload: SubscribePayload): string | null => {
  if (typeof payload.token !== 'string' || payload.token.trim() === '') return 'Missing required field: token';
  if (typeof payload.email !== 'string' || payload.email.trim() === '') return 'Missing required field: email';
  if (!isValidEmail(payload.email)) return 'Invalid field: email';
  if (payload.email.length > MAX_EMAIL_LENGTH) return 'Field too long: email';
  return null;
};

const confirmationMessage = (email: string, confirmUrl: string, env: Env): ResendMessage => ({
  from: env.NEWSLETTER_FROM,
  to: email,
  subject: 'Confirm your subscription',
  text: [
    "Confirm your subscription to Jerome Faria's newsletter by opening this link:",
    '',
    confirmUrl,
    '',
    "If you didn't request this, ignore this email — nothing will be sent.",
  ].join('\n'),
  html: [
    '<p>Confirm your subscription to Jerome Faria&#39;s newsletter:</p>',
    `<p><a href="${confirmUrl}">Confirm subscription</a></p>`,
    '<p>If you didn&#39;t request this, ignore this email — nothing will be sent.</p>',
  ].join(''),
});

export const handleSubscribe = async (
  request: Request,
  env: Env,
  cors: Record<string, string>,
  allowedHosts: string[],
  allowedOrigins: string[],
): Promise<Response> => {
  const guard = await guardPost(request, env, cors, allowedOrigins);
  if (!guard.ok) return guard.response;

  const payload = guard.body as SubscribePayload;

  if (payload.botField) {
    return jsonResponse({ ok: true }, 200, cors);
  }

  const invalidReason = subscribeValidationError(payload);
  if (invalidReason) {
    return jsonResponse({ error: invalidReason }, 400, cors);
  }

  try {
    const verified = await verifyTurnstile(payload.token, env.TURNSTILE_SECRET, request, allowedHosts);
    if (!verified) {
      return jsonResponse({ error: 'Verification failed' }, 403, cors);
    }

    const email = normalizeEmail(payload.email);
    const existing = await env.DB.prepare('SELECT status, created_at FROM subscribers WHERE email = ?1')
      .bind(email)
      .first<SubscriberRow>();

    // eslint-disable-next-line local/no-comments -- security: address-enumeration guard
    // Already-active addresses get the same neutral response and no second email, so the endpoint never reveals who is subscribed.
    if (existing?.status === 'active') {
      return jsonResponse({ ok: true }, 200, cors);
    }

    // eslint-disable-next-line local/no-comments -- security: confirmation-resend cooldown
    // A pending address that was emailed within the cooldown gets the same neutral response without a fresh email or a rotated token, so the endpoint can't be used to bomb an inbox or grief an in-flight signup.
    if (existing?.status === 'pending' && withinResendCooldown(existing.created_at)) {
      return jsonResponse({ ok: true }, 200, cors);
    }

    const confirmToken = randomToken();
    const unsubscribeToken = randomToken();
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO subscribers (email, status, confirm_token, unsubscribe_token, created_at)
       VALUES (?1, 'pending', ?2, ?3, ?4)
       ON CONFLICT(email) DO UPDATE SET status = 'pending', confirm_token = ?2, created_at = ?4`,
    )
      .bind(email, confirmToken, unsubscribeToken, now)
      .run();

    const confirmUrl = `${env.SITE_URL}/newsletter?confirm=${confirmToken}`;
    const sent = await sendResendEmail(confirmationMessage(email, confirmUrl, env), env.RESEND_API_KEY);
    if (!sent) {
      return jsonResponse({ error: 'Could not send confirmation' }, 502, cors);
    }

    return jsonResponse({ ok: true }, 200, cors);
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return jsonResponse({ error: 'Could not subscribe' }, 502, cors);
  }
};

export const handleConfirm = async (request: Request, env: Env, cors: Record<string, string>): Promise<Response> => {
  const token = new URL(request.url).searchParams.get('token') ?? '';

  // eslint-disable-next-line local/no-comments -- security: GET must not mutate
  // A GET never mutates — mail scanners auto-fetch links; it bounces to the site page, which POSTs back on a real visit.
  if (request.method !== 'POST') {
    return redirectResponse(`${env.SITE_URL}/newsletter?confirm=${encodeURIComponent(token)}`);
  }

  const reply = (ok: boolean): Response => jsonResponse({ ok }, 200, cors);

  if (!token) return reply(false);

  const row = await env.DB.prepare('SELECT status FROM subscribers WHERE confirm_token = ?1')
    .bind(token)
    .first<SubscriberRow>();

  if (!row) return reply(false);
  if (row.status === 'active') return reply(true);
  if (row.status !== 'pending') return reply(false);

  await env.DB.prepare("UPDATE subscribers SET status = 'active', confirmed_at = ?2, confirm_token = NULL WHERE confirm_token = ?1")
    .bind(token, new Date().toISOString())
    .run();

  return reply(true);
};

export const handleUnsubscribe = async (request: Request, env: Env, cors: Record<string, string>): Promise<Response> => {
  const token = new URL(request.url).searchParams.get('token') ?? '';

  // eslint-disable-next-line local/no-comments -- security: GET must not mutate
  // A GET never mutates — it bounces to the site page; the RFC 8058 one-click and the site button both POST here.
  if (request.method !== 'POST') {
    return redirectResponse(`${env.SITE_URL}/newsletter?unsubscribe=${encodeURIComponent(token)}`);
  }

  const reply = (ok: boolean): Response => jsonResponse({ ok }, 200, cors);

  if (!token) return reply(false);

  const row = await env.DB.prepare('SELECT status FROM subscribers WHERE unsubscribe_token = ?1')
    .bind(token)
    .first<SubscriberRow>();

  if (!row) return reply(false);

  if (row.status !== 'unsubscribed') {
    await env.DB.prepare("UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = ?2 WHERE unsubscribe_token = ?1")
      .bind(token, new Date().toISOString())
      .run();
  }

  return reply(true);
};
