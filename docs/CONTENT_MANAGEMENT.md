# Content Management Guide

All site content is typed TypeScript in `src/data/` — no CMS, API, or database. To edit content you edit a data file; the **types are the contract**, so `npm run type-check` tells you exactly what a valid entry looks like. This guide points you to the right file and the conventions; it deliberately does **not** re-list every field (that drifts) — the type in `src/types/` and the existing entries next to yours are the authoritative examples.

## Where content lives

| Content | File(s) |
|---|---|
| Discography / works | `src/data/works/*.ts` (`solo`, `nny`, `collaborations`, `film`, `compilations`, `publications`, `mixingAndMastering`), assembled by `src/data/works.ts` |
| Live events | `src/data/live.ts` |
| Press quotes | `src/data/press.ts` |
| Biographies | `src/data/bios.ts` |
| Writing / essays | `src/data/writing.ts` + `src/data/writingContent.ts` |
| Press kit (EPK) | `src/data/epk.ts` |
| Technical rider | `src/data/techRider.ts` |
| Colophon | `src/data/colophon.ts` |
| Privacy notice | `src/data/privacy.ts` |
| Nav, social, site metadata | `src/data/navigation.ts`, `src/data/pageMeta.ts` |
| Command palette entries | `src/data/commands.ts` |
| Playable audio | `src/data/audioManifest.ts` (streams from R2) |

Each file's shape is defined in `src/types/` (e.g. `types/live.ts`, `types/works.ts`, `types/credits.ts`). Read the type before adding an entry.

## Bilingual content (EN/PT)

User-facing strings are modelled as `Localized<{ en; pt }>` (`src/types/i18n.ts`) and resolved at render time. When a field is `Localized`, supply **both** languages:

```typescript
title: { en: 'English title', pt: 'Título em português' }
```

Plain `string` fields (ids, dates, URLs, catalog numbers) are not localized. The type tells you which is which. Preview Portuguese with `npm run dev:i18n` (no `.env` needed). PT copy follows the EU-Portuguese house style — match the tone of the surrounding entries.

## Conventions

- **Unique, semantic ids** — `album-name`, not `item-1`. Ids are used for anchors and deep links.
- **Newest first** — add new entries at the top of their array.
- **Dates** — `YYYY-MM-DD`.
- **Credit people via the typed fields** — photographers, performers, and contributors each have a typed shape (`Credit`, `Act`, `CreditClause`); don't inline free-text where a structured credit exists.
- **Links** — external URLs get a new-tab treatment automatically; use the structured link fields rather than raw `<a>` where the type provides one.

## Images

1. Drop the original JPG/PNG in `public/images/` (see `docs`-referenced dimensions below, or match an existing asset).
2. The build (`npm run build`, via `prebuild → generate-responsive-images.mjs`) generates responsive + WebP variants automatically — commit only the original; the variants are gitignored.
3. Reference the original path (`/images/name.jpg`); the site serves WebP where supported.

| Type | Guideline |
|---|---|
| Album covers | ≥ 1000×1000, JPG/PNG |
| Live photos | ~1920px wide, JPG |
| Hero | 2560×1703 (3:2) |
| About | ~1920×1280, JPG |

Audio is different: it lives in R2, not the repo — see `scripts/encode-audio.mjs` / `scripts/upload-audio.mjs` and `src/data/audioManifest.ts`.

## Before committing

```bash
npm run type-check   # the type is the contract — this catches a malformed entry
npm run lint
npm run test         # golden tests pin derived output (e.g. live-event descriptions)
npm run dev          # eyeball it (add :i18n to check PT)
```

Golden and contract tests will flag if an edit changes derived output unexpectedly — if a golden test fails, confirm the new output is what you intended, then update the snapshot.
