import {
  type Env,
  escapeHtml,
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
  email: string;
  status: string;
  created_at?: string;
}

type OwnerNotificationKind = 'subscribed' | 'unsubscribed';

const MAX_EMAIL_LENGTH = 254;

const CONFIRMATION_RESEND_COOLDOWN_MS = 10 * 60 * 1000;

const EMAIL = {
  sans: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
  paper: '#fff',
  ink: '#000',
  muted: '#767676',
  link: '#444',
  rule: '#eee',
} as const;

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

const confirmationText = (confirmUrl: string): string => [
  'Jerome Faria — Sound Artist & Composer',
  '',
  'Thank you for signing up to my newsletter.',
  '',
  "The occasional note when there's something new — no algorithm, nothing tracking you.",
  '',
  'Please confirm your email to start receiving it:',
  '',
  confirmUrl,
  '',
  "If you didn't request this, ignore this email — nothing will be sent.",
].join('\n');

const confirmationHtml = (confirmUrl: string, env: Env): string => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>Confirm your subscription</title>
</head>
<body style="margin:0;padding:0;background:${EMAIL.paper};-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${EMAIL.paper}" style="background:${EMAIL.paper};">
  <tr><td align="center" style="padding:32px 20px 48px;">
    <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:480px;">
      <tr><td style="border-bottom:1px solid ${EMAIL.rule};padding:0 0 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font:600 12px/1 ${EMAIL.sans};letter-spacing:.05em;text-transform:uppercase;color:${EMAIL.ink};">Jerome Faria</td>
          <td align="right" style="font:400 12px/1 ${EMAIL.sans};letter-spacing:.05em;text-transform:uppercase;color:${EMAIL.muted};">Sound Artist &amp; Composer</td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:34px 0 0;font:500 19px/1.3 ${EMAIL.sans};letter-spacing:-.01em;color:${EMAIL.ink};">Thank you for signing up to my newsletter.</td></tr>
      <tr><td style="padding:14px 0 0;font:400 15px/1.5 ${EMAIL.sans};color:${EMAIL.ink};">Please confirm your email to start receiving it.</td></tr>
      <tr><td style="padding:18px 0 0;font:400 13px/1.5 ${EMAIL.sans};color:${EMAIL.muted};">The occasional note when there&rsquo;s something new &mdash; no algorithm, nothing tracking you.</td></tr>
      <tr><td align="center" style="padding:26px 0 0;text-align:center;"><a href="${confirmUrl}" style="display:inline-block;font:500 11px/1 ${EMAIL.sans};letter-spacing:.12em;text-transform:uppercase;color:${EMAIL.paper};text-decoration:none;background:${EMAIL.ink};border:1px solid ${EMAIL.ink};padding:12px 22px;">Confirm subscription</a></td></tr>
      <tr><td style="padding:22px 0 0;font:400 11px/1.5 ${EMAIL.sans};color:${EMAIL.muted};">Or paste this link into your browser:<br><a href="${confirmUrl}" style="color:${EMAIL.link};text-decoration:underline;word-break:break-all;">${confirmUrl}</a></td></tr>
      <tr><td style="padding:10px 0 34px;font:400 11px/1.5 ${EMAIL.sans};color:${EMAIL.muted};">If you didn&rsquo;t request this, ignore this email &mdash; nothing will be sent.</td></tr>
      <tr><td style="border-top:1px solid ${EMAIL.rule};padding:20px 0 0;font:400 11px/1.6 ${EMAIL.sans};letter-spacing:.08em;text-transform:uppercase;color:${EMAIL.muted};" align="center">&copy; 2004&ndash;${new Date().getFullYear()} Jerome Faria &nbsp;&middot;&nbsp; <a href="${env.SITE_URL}/privacy" style="color:${EMAIL.muted};text-decoration:underline;">Privacy</a></td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

const confirmationMessage = (email: string, confirmUrl: string, env: Env): ResendMessage => ({
  from: env.NEWSLETTER_FROM,
  to: email,
  subject: 'Confirm your subscription',
  text: confirmationText(confirmUrl),
  html: confirmationHtml(confirmUrl, env),
});

const ownerNotification = (email: string, kind: OwnerNotificationKind, env: Env): ResendMessage => {
  const subscribed = kind === 'subscribed';
  const line = subscribed
    ? `${email} confirmed their subscription to the newsletter.`
    : `${email} unsubscribed from the newsletter.`;

  return {
    from: env.CONTACT_FROM,
    to: env.CONTACT_TO,
    subject: subscribed ? 'New newsletter subscriber' : 'Newsletter unsubscribe',
    text: line,
    html: `<p>${escapeHtml(line)}</p>`,
  };
};

const notifyOwner = async (email: string, kind: OwnerNotificationKind, env: Env): Promise<void> => {
  try {
    await sendResendEmail(ownerNotification(email, kind, env), env.RESEND_API_KEY);
  } catch (error) {
    console.error('Newsletter owner-notification error:', error);
  }
};

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
    const existing = await env.DB.prepare('SELECT email, status, created_at FROM subscribers WHERE email = ?1')
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

export const handleConfirm = async (
  request: Request,
  env: Env,
  cors: Record<string, string>,
  ctx: ExecutionContext,
): Promise<Response> => {
  const token = new URL(request.url).searchParams.get('token') ?? '';

  // eslint-disable-next-line local/no-comments -- security: GET must not mutate
  // A GET never mutates — mail scanners auto-fetch links; it bounces to the site page, which POSTs back on a real visit.
  if (request.method !== 'POST') {
    return redirectResponse(`${env.SITE_URL}/newsletter?confirm=${encodeURIComponent(token)}`);
  }

  const reply = (ok: boolean): Response => jsonResponse({ ok }, 200, cors);

  if (!token) return reply(false);

  const row = await env.DB.prepare('SELECT email, status FROM subscribers WHERE confirm_token = ?1')
    .bind(token)
    .first<SubscriberRow>();

  if (!row) return reply(false);
  if (row.status === 'active') return reply(true);
  if (row.status !== 'pending') return reply(false);

  await env.DB.prepare("UPDATE subscribers SET status = 'active', confirmed_at = ?2, confirm_token = NULL WHERE confirm_token = ?1")
    .bind(token, new Date().toISOString())
    .run();

  ctx.waitUntil(notifyOwner(row.email, 'subscribed', env));

  return reply(true);
};

export const handleUnsubscribe = async (
  request: Request,
  env: Env,
  cors: Record<string, string>,
  ctx: ExecutionContext,
): Promise<Response> => {
  const token = new URL(request.url).searchParams.get('token') ?? '';

  // eslint-disable-next-line local/no-comments -- security: GET must not mutate
  // A GET never mutates — it bounces to the site page; the RFC 8058 one-click and the site button both POST here.
  if (request.method !== 'POST') {
    return redirectResponse(`${env.SITE_URL}/newsletter?unsubscribe=${encodeURIComponent(token)}`);
  }

  const reply = (ok: boolean): Response => jsonResponse({ ok }, 200, cors);

  if (!token) return reply(false);

  const row = await env.DB.prepare('SELECT email, status FROM subscribers WHERE unsubscribe_token = ?1')
    .bind(token)
    .first<SubscriberRow>();

  if (!row) return reply(false);

  if (row.status !== 'unsubscribed') {
    await env.DB.prepare("UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = ?2 WHERE unsubscribe_token = ?1")
      .bind(token, new Date().toISOString())
      .run();

    ctx.waitUntil(notifyOwner(row.email, 'unsubscribed', env));
  }

  return reply(true);
};
