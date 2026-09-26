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
}

const MAX_EMAIL_LENGTH = 254;

const randomToken = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
};

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

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
    const existing = await env.DB.prepare('SELECT status FROM subscribers WHERE email = ?1')
      .bind(email)
      .first<SubscriberRow>();

    // eslint-disable-next-line local/no-comments -- security: address-enumeration guard
    // Already-active addresses get the same neutral response and no second email, so the endpoint never reveals who is subscribed.
    if (existing?.status === 'active') {
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

    const confirmUrl = `${new URL(request.url).origin}/newsletter/confirm?token=${confirmToken}`;
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

export const handleConfirm = async (request: Request, env: Env): Promise<Response> => {
  const token = new URL(request.url).searchParams.get('token') ?? '';
  const done = (confirmed: 0 | 1): Response => redirectResponse(`${env.SITE_URL}/newsletter?confirmed=${confirmed}`);

  if (!token) return done(0);

  const row = await env.DB.prepare('SELECT status FROM subscribers WHERE confirm_token = ?1')
    .bind(token)
    .first<SubscriberRow>();

  if (!row) return done(0);

  if (row.status !== 'active') {
    await env.DB.prepare("UPDATE subscribers SET status = 'active', confirmed_at = ?2 WHERE confirm_token = ?1")
      .bind(token, new Date().toISOString())
      .run();
  }

  return done(1);
};

export const handleUnsubscribe = async (request: Request, env: Env): Promise<Response> => {
  const oneClick = request.method === 'POST';
  const token = new URL(request.url).searchParams.get('token') ?? '';
  const fail = (): Response =>
    oneClick
      ? new Response('Invalid unsubscribe link', { status: 400 })
      : redirectResponse(`${env.SITE_URL}/newsletter?unsubscribed=0`);
  const succeed = (): Response =>
    oneClick
      ? new Response('Unsubscribed', { status: 200 })
      : redirectResponse(`${env.SITE_URL}/newsletter?unsubscribed=1`);

  if (!token) return fail();

  const row = await env.DB.prepare('SELECT status FROM subscribers WHERE unsubscribe_token = ?1')
    .bind(token)
    .first<SubscriberRow>();

  if (!row) return fail();

  if (row.status !== 'unsubscribed') {
    await env.DB.prepare("UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = ?2 WHERE unsubscribe_token = ?1")
      .bind(token, new Date().toISOString())
      .run();
  }

  return succeed();
};
