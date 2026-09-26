import { type ContactPayload, handleContact, validationError } from './contact';
import { handleConfirm, handleSubscribe, handleUnsubscribe } from './newsletter';
import { corsHeaders, type Env, jsonResponse, toHostname } from './shared';

export type { ContactPayload, Env };
export { validationError };

const normalizePath = (url: string): string => new URL(url).pathname.replace(/\/+$/, '') || '/';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(entry => entry.trim()).filter(Boolean);
    const allowedHosts = allowedOrigins.map(toHostname).filter(Boolean);
    const cors = corsHeaders(origin, allowedOrigins);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    switch (normalizePath(request.url)) {
      case '/':
      case '/contact':
        return handleContact(request, env, cors, allowedHosts, allowedOrigins);
      case '/newsletter/subscribe':
        return handleSubscribe(request, env, cors, allowedHosts, allowedOrigins);
      case '/newsletter/confirm':
        return handleConfirm(request, env);
      case '/newsletter/unsubscribe':
        return handleUnsubscribe(request, env);
      default:
        return jsonResponse({ error: 'Not found' }, 404, cors);
    }
  },
};
