import {
  CONTROL_CHARS,
  EMAIL_PATTERN,
  type Env,
  escapeHtml,
  guardPost,
  jsonResponse,
  sendResendEmail,
  verifyTurnstile,
} from './shared';

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

export const handleContact = async (
  request: Request,
  env: Env,
  cors: Record<string, string>,
  allowedHosts: string[],
  allowedOrigins: string[],
): Promise<Response> => {
  const guard = await guardPost(request, env, cors, allowedOrigins);
  if (!guard.ok) return guard.response;

  const payload = guard.body as ContactPayload;

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

    const delivered = await sendResendEmail(
      {
        from: env.CONTACT_FROM,
        to: env.CONTACT_TO,
        replyTo: payload.email,
        subject: `[${payload.inquiry}] Jerome Faria — ${payload.name}`,
        text: emailText(payload),
        html: emailHtml(payload),
      },
      env.RESEND_API_KEY,
    );
    if (!delivered) {
      return jsonResponse({ error: 'Could not send message' }, 502, cors);
    }

    return jsonResponse({ ok: true }, 200, cors);
  } catch (error) {
    console.error('Contact relay error:', error);
    return jsonResponse({ error: 'Could not send message' }, 502, cors);
  }
};
