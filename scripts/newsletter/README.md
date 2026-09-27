# Newsletter — authoring & sending

The self-owned newsletter. An issue is a small typed data file; the same file
renders to the **email** (table-based HTML, sent via Resend) and to a
**`/newsletter/:issue` archive page** on the site (the "view in browser" target
and permanent record).

Signup lives elsewhere — the `/newsletter` page + the worker's double-opt-in
store this reads from. This directory is only about writing and sending issues.

- **Author** an issue → `src/data/newsletter/issues/<id>.ts`
- **Register** it → `src/data/newsletter/issues.ts`
- **Preview** → `npm run newsletter:preview -- <id>`
- **Send** → `npm run newsletter:send -- <id> [--test | --send]`

---

## 1. Anatomy of an issue

The `issues/` directory starts empty — the first real issue is the first file.
Each issue is one file exporting a typed `issue`; create a new one following
this shape:

```ts
// src/data/newsletter/issues/2026-05-12.ts
import type { NewsletterIssue } from '../types.ts';

export const issue: NewsletterIssue = {
  id: '2026-05-12',                       // must be unique — see "IDs" below
  date: '2026-05-12',                     // ISO date; shown in the masthead
  subject: 'Contraplacado, and a night in Porto',  // the email subject line
  blocks: [
    /* … ordered blocks — see the reference below … */
  ],
};
```

Then register it in `src/data/newsletter/issues.ts` — import it and add it to
the `issues` array (they're sorted newest-first automatically):

```ts
import { issue as issue20260512 } from './issues/2026-05-12.ts';
// …
const issues: NewsletterIssue[] = [issue20260512 /* , …others… */];
```

> **Import extensions.** Files under `src/data/newsletter/` use explicit `.ts`
> extensions on relative imports (`'../types.ts'`). That's required because
> `vite.config.ts` loads them at build time to enumerate the archive pages.

### IDs

The `id` is the archive URL (`/newsletter/<id>`), the filename, and the registry
key — so it must be **unique**. Convention: the **full send date,
`YYYY-MM-DD`**. If you ever send twice in one day, add a suffix
(`2026-05-12-b`) or use a descriptive slug. A duplicate id **fails the build
loudly** (the `assertUniqueIds` guard), so you can't ship a silent collision.

---

## 2. Block reference

`blocks` is an ordered list. Reorder by moving entries; drop a section by
deleting its block; the masthead and footer wrap whatever you provide.

### `prose` — freeform Markdown

The writing block, and the blank-slate primitive. An issue of nothing but prose
is a plain letter.

```ts
{ type: 'prose', markdown: 'A line to open.\n\nAnd **another** paragraph.' }
```

### `image` — a standalone visual

```ts
{
  type: 'image',
  src: '/images/newsletter/studio.jpg',   // hosted in public/ — see "Images"
  alt: 'Inside the studio',
  label: 'Look',                           // optional section title (omit to compose freely)
  caption: 'Where it was made.',           // optional
  href: 'https://example.com',             // optional — makes the image a link
}
```

### `video` — a poster that plays

Email can't play video, so it shows the poster + a **View** button that links
out. The archive plays it inline when you give an `embedUrl` (a
YouTube-nocookie / Vimeo *embed* URL), otherwise the poster links out.

```ts
{
  type: 'video',
  poster: '/images/newsletter/live-poster.jpg',       // hosted in public/
  href: 'https://youtu.be/XXXX',                       // where it plays (email + fallback)
  embedUrl: 'https://www.youtube-nocookie.com/embed/XXXX',  // optional — inline player on the archive
  alt: 'Live at Fábrica',
  label: 'Watch',                                       // optional section title
  caption: 'Full set, 40 minutes.',                     // optional
}
```

### `quote` — a press clipping or pull-quote

A freeform quote styled like the **Press** page — the quote, then its source
(linked when you give a `url`). Freeform, so it can carry a press clipping, a
listener's words, or anything else; the quote may hold inline markup (`<em>`).

```ts
{
  type: 'quote',
  quote: 'An almost <em>romantic</em> sound that recalls Eno.',
  source: 'The Quietus',
  url: 'https://thequietus.com/…',   // optional — links the source
}
```

### `cta` — a button link

A standalone call-to-action button, rendered on-brand (filled) in both the email
and the archive. Internal links (starting `/`) route in-app on the archive;
external links open in a new tab.

```ts
{ type: 'cta', label: 'Subscribe', href: '/newsletter' }
{ type: 'cta', label: 'Buy tickets', href: 'https://venue.example/tickets' }
```

### `writing` / `works` / `live` — references to site content

These point at something that **already lives on the site** by its id, and the
renderer fills in the title, image, meta, and canonical link. You never retype a
catalog number or a venue. Each carries a generic **View** button through to the
canonical page.

```ts
{ type: 'writing', ref: 'orchestration' }                 // ref = essay slug  (src/data/writing.ts)
{ type: 'works',   ref: 'contraplacado', note: 'Out now.' } // ref = release id (src/data/works.ts)
{ type: 'live',    ref: 'jejum-45',      note: 'In Porto.' } // ref = event id   (src/data/live.ts)
```

- `note` (optional) is your per-issue framing, shown under the auto-filled meta.
- **Works** shows Released · Format · Label · Catalog; **Live** shows Date ·
  Venue · City; **Writing** shows the essay tagline (or your `note`).
- `hideMeta: true` (works / live) drops the auto meta grid — for a leaner,
  editorial block where the `note` carries the relevant facts instead.
- **Photo credit** is auto-derived and shown under the image (bottom-right,
  muted): **works** from the release's `photography` credit; **live** from the
  cover image's `photographer` (or, if a poster is used, its `artist`). Linked
  when the person/org resolves to a URL. Nothing to author.
- **Gotcha:** a `ref` that doesn't match any id is **silently dropped** from the
  issue — no error. Double-check ids against the data files (or just preview and
  look for the missing block).

---

## 3. Images

Host every image yourself — **don't hotlink** external URLs (that's the link-rot
this whole project exists to avoid).

- Put files in `public/images/` (a `public/images/newsletter/` subfolder keeps
  issue-only assets tidy) and reference them by web path: `/images/newsletter/x.jpg`.
- The email links to `https://jeromefaria.com/images/…`; the archive uses the
  site's responsive-image pipeline.
- `listen` / `live` covers come from the site data automatically — nothing to add.
- For `video`, the **poster is yours** (in `public/`); the video itself plays on
  YouTube/Vimeo via `href` / `embedUrl`.

---

## 4. Preview

```sh
npm run newsletter:preview -- 2026-05-12            # render the email to a file
npm run newsletter:preview -- 2026-05-12 --open     # …and open it in the browser
npm run newsletter:preview -- 2026-05-12 --watch    # re-render on every save
```

Writes `newsletter-preview-<id>.html` (gitignored). With `--watch`, keep the tab
open and refresh after each save. Preview embeds images inline so it renders
anywhere; the real send uses absolute URLs.

For the **archive** page, run `npm run dev` and open `/newsletter/<id>`.

---

## 5. Send

Safe by default — no flag is a dry run.

```sh
npm run newsletter:send -- 2026-05-12            # DRY RUN: renders, reports the plan, sends nothing
npm run newsletter:send -- 2026-05-12 --test     # sends ONE email, to NEWSLETTER_TEST_EMAIL (you)
npm run newsletter:send -- 2026-05-12 --send     # the real send, to every active subscriber
```

- One personalized email per subscriber, with a per-recipient `List-Unsubscribe`
  + one-click POST header wired to the worker's unsubscribe endpoint (so Gmail /
  Apple Mail's native "unsubscribe" works). Sent via Resend's batch API, 100 per
  request.
- The active list is read from **D1 via wrangler**; a dry run without D1 (or with
  no subscribers) falls back to a placeholder recipient so you can still inspect
  the render.
- **Resumable.** Each recipient of a successful batch is recorded in the D1
  `sends` table (`(issue_id, email)`). A `--send` re-run skips anyone already
  recorded for *this* issue, so an interrupted send **resumes instead of
  re-mailing** those already delivered. It's at-least-once, not exactly-once: a
  batch interrupted between Resend accepting it and the record being written can
  re-send on the next run — at most one batch's worth. "Nothing to send" means
  every active subscriber is already recorded.
- **Rate-limit safe.** Batches are paced under Resend's request limit and each is
  retried with exponential backoff on `429` / `5xx` (honouring `Retry-After`).
  The send aborts once retries are exhausted (or if Resend accepts fewer messages
  than the batch — a loud failure beats a silent drop); everything recorded before
  the abort is skipped on the next run.

### Requirements for `--test` / `--send`

| What | Where |
|---|---|
| `RESEND_API_KEY` | env var, or a line in `worker/.dev.vars` (gitignored) |
| `NEWSLETTER_TEST_EMAIL` | env var — the address `--test` sends to |
| D1 database `newsletter` | provisioned + `wrangler` authenticated (`cd worker && npx wrangler d1 create newsletter`) |

Always `--test` to yourself first, read it in a real client, then `--send`.

---

## 6. Before the first real send — production gate

Green CI proves the browser UX (E2E) and the email-render logic (the
`render.mjs` snapshot). It does **not** exercise the live worker + D1 + Resend
path — nothing automated does, and a send is irreversible. So run this once, by
hand, against the deployed backend before the first `--send` ever goes out:

1. **Deploy** the worker + D1 (see `worker/README.md`); confirm the
   `RESEND_API_KEY` and `TURNSTILE_SECRET` secrets are set.
2. **Subscribe for real** at `/newsletter` with an address you control → a
   confirmation email arrives (live Resend) → click confirm → the worker
   redirects to `/newsletter?confirmed=1` and the D1 row reads `status = 'active'`.
3. **Unsubscribe round-trip** — use the email's one-click unsubscribe → the D1
   row flips to `status = 'unsubscribed'` (tombstone, not deleted). Re-subscribe
   to restore an active test recipient.
4. **Test-send** to yourself: `npm run newsletter:send -- <id> --test`. Open it
   in **Gmail and Apple Mail** and check: images load (absolute URLs), the layout
   holds, links resolve, and the client's native **Unsubscribe** actually
   tombstones you in D1.
5. Only once every step passes: `npm run newsletter:send -- <id> --send`.

This is the release gate. If any step fails, do not send.

---

## 7. Typical flow

1. Write `src/data/newsletter/issues/<date>.ts`; register it in `issues.ts`.
2. Drop any images into `public/images/newsletter/`.
3. `npm run newsletter:preview -- <date> --watch` and iterate.
4. Check the archive at `/newsletter/<date>` via `npm run dev`.
5. `--test` to yourself, read it in the inbox.
6. `--send`.
