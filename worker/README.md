# Contact Worker

Cloudflare Worker backing the site's contact form. It verifies a Cloudflare
Turnstile token server-side and relays the message as email through Resend. It
is decoupled from the Vue app: the frontend resolves the inquiry taxonomy and
POSTs already-labelled fields, which the Worker validates and forwards.

## Request

`POST` JSON:

```json
{
  "token": "<turnstile-token>",
  "inquiry": "Booking",
  "name": "Jane Roe",
  "email": "jane@example.com",
  "message": "…",
  "fields": [{ "label": "Location", "value": "Lisbon" }],
  "botField": ""
}
```

Responses: `200 {ok:true}` on success (and on a tripped honeypot, silently),
`400` invalid/missing input, `403` failed verification, `502` send failure.

## Configuration

`wrangler.toml` holds non-secret vars (`CONTACT_FROM`, `CONTACT_TO`,
`ALLOWED_ORIGINS`). Two secrets are set out-of-band and never committed:

- `TURNSTILE_SECRET` — Turnstile secret key
- `RESEND_API_KEY` — Resend API key

## Deploy

Set the secrets **after** `deploy`, and don't `deploy` again afterward — a
`wrangler deploy` detaches previously-set secrets from the served version, so
setting them last is what binds them at runtime.

```sh
cd worker
npm install
npx wrangler login
npx wrangler deploy                         # prints the *.workers.dev URL
npx wrangler secret put TURNSTILE_SECRET    # paste the Turnstile secret key
npx wrangler secret put RESEND_API_KEY      # paste the Resend API key
```

## Develop / test

```sh
npm run dev          # local Worker at http://localhost:8787
npm test             # unit tests (mocked Turnstile + Resend)
npm run type-check
```
