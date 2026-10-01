import { type ContactPayload, handleContact, validationError } from './contact';
import { handleConfirm, handleSubscribe, handleUnsubscribe } from './newsletter';
import { corsHeaders, type Env, isRateLimited, jsonResponse, toHostname } from './shared';

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

    const path = normalizePath(request.url);

    if (path === '/newsletter/confirm' || path === '/newsletter/unsubscribe') {
      if (await isRateLimited(env, request.headers.get('CF-Connecting-IP'))) {
        return jsonResponse({ error: 'Too many requests' }, 429, cors);
      }

      return path === '/newsletter/confirm' ? handleConfirm(request, env, cors) : handleUnsubscribe(request, env, cors);
    }

    switch (path) {
      case '/':
      case '/contact':
        return handleContact(request, env, cors, allowedHosts, allowedOrigins);
      case '/newsletter/subscribe':
        return handleSubscribe(request, env, cors, allowedHosts, allowedOrigins);
      default:
        return jsonResponse({ error: 'Not found' }, 404, cors);
    }
  },
};
