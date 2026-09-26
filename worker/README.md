# Site Worker

Cloudflare Worker backing the site's dynamic paths: the **contact form** and the
**newsletter**. Both verify a Cloudflare Turnstile token server-side; contact
relays a message through Resend, newsletter runs a double-opt-in subscription
backed by Cloudflare D1. It is decoupled from the Vue app — the frontend POSTs
already-validated fields, which the Worker re-validates and processes.

## Routes

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/` · `/contact` | Contact relay (Turnstile → Resend email) |
| `POST` | `/newsletter/subscribe` | Turnstile-gated signup → stores `pending`, sends a confirmation email |
| `GET` | `/newsletter/confirm?token=…` | Confirms a pending subscriber, redirects to `/newsletter?confirmed=1` |
| `GET`/`POST` | `/newsletter/unsubscribe?token=…` | One-click (RFC 8058) unsubscribe; tombstones the row |

### Contact request

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

### Subscribe request

`POST` JSON:

```json
{ "token": "<turnstile-token>", "email": "reader@example.com", "botField": "" }
```

Responses: `200 {ok:true}` on success — and identically for an already-active
address, so the endpoint never discloses who is subscribed — `400` invalid input,
`403` failed verification, `502` send failure. Confirmation is required before any
issue can reach the address (double opt-in). Unsubscribe keeps the row with
`status='unsubscribed'` (a suppression tombstone), never a hard delete.

## Configuration

`wrangler.toml` holds non-secret vars (`CONTACT_FROM`, `CONTACT_TO`,
`NEWSLETTER_FROM`, `SITE_URL`, `ALLOWED_ORIGINS`) and the `DB` D1 binding. Two
secrets are set out-of-band and never committed — the newsletter reuses both, so
nothing new to attach:

- `TURNSTILE_SECRET` — Turnstile secret key
- `RESEND_API_KEY` — Resend API key

## D1 setup (one-time)

The newsletter needs a D1 database. Create it once, paste the printed
`database_id` into `wrangler.toml` (replacing `PLACEHOLDER_RUN_WRANGLER_D1_CREATE`),
then apply the schema to both remote and local:

```sh
cd worker
npx wrangler d1 create newsletter            # prints database_id → paste into wrangler.toml
npx wrangler d1 execute newsletter --remote --file=schema.sql
npx wrangler d1 execute newsletter --local  --file=schema.sql   # for `wrangler dev`
```

## Deploy

```sh
cd worker
npm install
npx wrangler login
npx wrangler deploy                         # prints the *.workers.dev URL
npx wrangler secret list                    # confirm both secrets are attached
```

The secrets live at the Worker level and persist across deploys, so a routine
code deploy needs nothing more. Note that `wrangler deploy`'s "bindings" list
only prints the `wrangler.toml` vars — out-of-band secrets never appear there,
which is expected and not a sign they were dropped. Verify with `secret list`
rather than reading the deploy output.

First-time setup (or if `secret list` ever comes back missing one) sets them:

```sh
npx wrangler secret put TURNSTILE_SECRET    # paste the Turnstile secret key
npx wrangler secret put RESEND_API_KEY      # paste the Resend API key
```

## Develop / test

```sh
npm run dev          # local Worker at http://localhost:8787
npm test             # unit tests (mocked Turnstile, Resend, and D1)
npm run type-check
```
