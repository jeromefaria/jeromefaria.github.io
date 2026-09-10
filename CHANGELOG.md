# Changelog

All notable changes since the Vue 3 rewrite. Versioned by CalVer (`YYYY.0M.patch`).

## Unreleased


### Features

- **live:** Curated media thumbnails on the Live archive ([#419](https://github.com/jeromefaria/jeromefaria.github.io/pull/419))
- **epk:** Shared-stages roster + restructured press kit ([#418](https://github.com/jeromefaria/jeromefaria.github.io/pull/418))
- **seo:** Emit event collaborators as schema.org performers with sameAs ([#406](https://github.com/jeromefaria/jeromefaria.github.io/pull/406))

### Content

- Link 8 researched entities across the registry ([#414](https://github.com/jeromefaria/jeromefaria.github.io/pull/414))

### Fixes

- **player:** Balance the immersive artwork's gap to the transport slider ([#417](https://github.com/jeromefaria/jeromefaria.github.io/pull/417))

### Refactors

- Share one name-lookup across the entity registries ([#415](https://github.com/jeromefaria/jeromefaria.github.io/pull/415))
- **registry:** Register recurring link-less entities by name ([#413](https://github.com/jeromefaria/jeromefaria.github.io/pull/413))
- **orgs:** Resolve org video authors through the registry ([#412](https://github.com/jeromefaria/jeromefaria.github.io/pull/412))
- **orgs:** Fold record labels into the org registry ([#411](https://github.com/jeromefaria/jeromefaria.github.io/pull/411))
- **venues:** Resolve recurring venue links through a registry ([#410](https://github.com/jeromefaria/jeromefaria.github.io/pull/410))
- **orgs:** Route Live promoter/org links through a registry ([#409](https://github.com/jeromefaria/jeromefaria.github.io/pull/409))
- **people:** Resolve photographer credits through the registry ([#408](https://github.com/jeromefaria/jeromefaria.github.io/pull/408))
- **people:** Resolve live collaborator links through the registry ([#407](https://github.com/jeromefaria/jeromefaria.github.io/pull/407))
- **people:** Introduce a collaborator registry and route credit links through it ([#405](https://github.com/jeromefaria/jeromefaria.github.io/pull/405))
- **live:** Split the events array into era files ([#403](https://github.com/jeromefaria/jeromefaria.github.io/pull/403))

### Tests

- Extend a11y coverage to dynamic routes and gate e2e type-checking ([#402](https://github.com/jeromefaria/jeromefaria.github.io/pull/402))

### Build & CI

- **vue:** Enforce script-setup and guard ref reactivity loss ([#416](https://github.com/jeromefaria/jeromefaria.github.io/pull/416))
- **changelog:** Make the auto-regeneration push race-proof ([#404](https://github.com/jeromefaria/jeromefaria.github.io/pull/404))
- Add CodeQL scanning and a security policy ([#401](https://github.com/jeromefaria/jeromefaria.github.io/pull/401))
- Align worker TypeScript, single-source coverage thresholds, add verify + editorconfig ([#400](https://github.com/jeromefaria/jeromefaria.github.io/pull/400))

### Docs

- Correct stale coverage numbers and rewrite the content guide ([#399](https://github.com/jeromefaria/jeromefaria.github.io/pull/399))

### Chores

- **dev:** Expose the dev server on the LAN, with opt-in HTTPS for mobile ([#420](https://github.com/jeromefaria/jeromefaria.github.io/pull/420))

## 2026.09.2 — Writing, CV & immersive player — 2026-09-09


### Features

- **player:** Konami code → random track in immersive mode ([#395](https://github.com/jeromefaria/jeromefaria.github.io/pull/395))
- **app:** Page-lifecycle handling + iOS inert/theme recovery on resume ([#392](https://github.com/jeromefaria/jeromefaria.github.io/pull/392))
- **player:** Chaptered playback, immersive artwork, keyboard control ([#388](https://github.com/jeromefaria/jeromefaria.github.io/pull/388))
- **live:** Promoter credits and the Jejum #45 poster ([#387](https://github.com/jeromefaria/jeromefaria.github.io/pull/387))
- **audio:** Make ALTAR and Depolarized playable in the built-in player ([#379](https://github.com/jeromefaria/jeromefaria.github.io/pull/379))
- **works,writing:** Cross-link releases and their essays ([#377](https://github.com/jeromefaria/jeromefaria.github.io/pull/377))
- **writing:** Publish the release essays for 2504, En Veille, and Contraplacado ([#370](https://github.com/jeromefaria/jeromefaria.github.io/pull/370))
- **writing:** Private draft workflow for the /writing section ([#368](https://github.com/jeromefaria/jeromefaria.github.io/pull/368))
- **player:** Per-track artwork in the expanded now-playing view ([#362](https://github.com/jeromefaria/jeromefaria.github.io/pull/362))
- **player:** Fill the desktop now-playing view with hi-res art ([#361](https://github.com/jeromefaria/jeromefaria.github.io/pull/361))
- **palette:** Clamp paging, dedupe the focus trap, and highlight matches ([#358](https://github.com/jeromefaria/jeromefaria.github.io/pull/358))
- **writing:** Add a writing section with the Orchestration essay ([#357](https://github.com/jeromefaria/jeromefaria.github.io/pull/357))
- **live:** Add Nuno Martins photos to the Festival Múltiplo entry ([#356](https://github.com/jeromefaria/jeromefaria.github.io/pull/356))
- **palette:** Surface the CV in ⌘K as a command and a download ([#352](https://github.com/jeromefaria/jeromefaria.github.io/pull/352))
- **cv:** Give /cv its own social card so its link preview is distinct ([#351](https://github.com/jeromefaria/jeromefaria.github.io/pull/351))
- **cv:** /cv web view + auto-generated PDF from one markdown source ([#349](https://github.com/jeromefaria/jeromefaria.github.io/pull/349))
- **seo:** Describe each release page with its own structured data ([#343](https://github.com/jeromefaria/jeromefaria.github.io/pull/343))

### Content

- **press:** Add two NNY-era reviews recovered from the archive ([#375](https://github.com/jeromefaria/jeromefaria.github.io/pull/375))
- **writing:** Restore the in-body links lost on Patreon import ([#374](https://github.com/jeromefaria/jeromefaria.github.io/pull/374))
- **live:** Fix the Olhares 2010 date and enrich the early MADEIRADIG bills ([#369](https://github.com/jeromefaria/jeromefaria.github.io/pull/369))

### Fixes

- **app:** Recover the router view from a wedged page transition on resume ([#393](https://github.com/jeromefaria/jeromefaria.github.io/pull/393))
- **build:** Add the .ts extension to the releaseDate import ([#390](https://github.com/jeromefaria/jeromefaria.github.io/pull/390))
- **lightbox:** Dismiss on any outside click; soften the disabled-arrow cursor ([#378](https://github.com/jeromefaria/jeromefaria.github.io/pull/378))
- **live:** Restore missing collaborator links across the Live page ([#372](https://github.com/jeromefaria/jeromefaria.github.io/pull/372))
- **player:** Release the audio element on close so iOS drops the Now Playing card ([#367](https://github.com/jeromefaria/jeromefaria.github.io/pull/367))
- **player:** Release the Media Session when the player is closed ([#366](https://github.com/jeromefaria/jeromefaria.github.io/pull/366))
- **a11y:** Only restore the focus ring for keyboard-opened overlays ([#364](https://github.com/jeromefaria/jeromefaria.github.io/pull/364))
- **player:** Two-column expanded layout on desktop to remove the scrollbar ([#363](https://github.com/jeromefaria/jeromefaria.github.io/pull/363))
- **writing:** Let the Orchestration essay sit inside the site ([#360](https://github.com/jeromefaria/jeromefaria.github.io/pull/360))
- **writing:** Widen the writing section to the site's content width ([#359](https://github.com/jeromefaria/jeromefaria.github.io/pull/359))
- **audio:** Snap 2504 chapters to the beep/vocal onsets ([#355](https://github.com/jeromefaria/jeromefaria.github.io/pull/355))
- **audio:** Accurate 2504 duration and compressed-aligned chapter times ([#354](https://github.com/jeromefaria/jeromefaria.github.io/pull/354))
- **i18n:** Hide the footer language switch on English-only routes ([#353](https://github.com/jeromefaria/jeromefaria.github.io/pull/353))
- **about:** List the Overlapse bio mention year-only, matching the other releases ([#347](https://github.com/jeromefaria/jeromefaria.github.io/pull/347))
- **a11y:** Identify contact errors on submit + neutralize overlay background ([#342](https://github.com/jeromefaria/jeromefaria.github.io/pull/342))
- **components:** Give MediaLinks' optional downloadUrl an explicit default ([#340](https://github.com/jeromefaria/jeromefaria.github.io/pull/340))

### Performance

- Align the hero LCP preload, prioritize above-the-fold images ([#344](https://github.com/jeromefaria/jeromefaria.github.io/pull/344))

### Refactors

- Dedupe the release-date readers and the player predicates ([#373](https://github.com/jeromefaria/jeromefaria.github.io/pull/373))
- Model release dates (derive the displayed year) ([#371](https://github.com/jeromefaria/jeromefaria.github.io/pull/371))

### Tests

- Close the worker + payload coverage loop to 100% branches ([#346](https://github.com/jeromefaria/jeromefaria.github.io/pull/346))
- Turn soft quality signals into hard gates ([#341](https://github.com/jeromefaria/jeromefaria.github.io/pull/341))

### Build & CI

- **changelog:** Authorize the auto-regeneration push with a scoped token ([#398](https://github.com/jeromefaria/jeromefaria.github.io/pull/398))
- **changelog:** Git-cliff generation, commit-convention enforcement, and auto-regeneration ([#397](https://github.com/jeromefaria/jeromefaria.github.io/pull/397))
- **deps:** Bump js-yaml in the npm-security group across 1 directory ([#391](https://github.com/jeromefaria/jeromefaria.github.io/pull/391))
- **deps:** Bump the npm-minor-patch group with 11 updates ([#383](https://github.com/jeromefaria/jeromefaria.github.io/pull/383))
- **deps-dev:** Upgrade vitest to 5 across root and worker ([#389](https://github.com/jeromefaria/jeromefaria.github.io/pull/389))
- **deps-dev:** Bump the worker-minor-patch group ([#380](https://github.com/jeromefaria/jeromefaria.github.io/pull/380))

### Docs

- **readme:** Keyboard shortcuts — palette ':' + audio-player key table ([#396](https://github.com/jeromefaria/jeromefaria.github.io/pull/396))
- **readme:** Cover the player's immersive view + keyboard control, and platform resilience ([#394](https://github.com/jeromefaria/jeromefaria.github.io/pull/394))
- **readme:** Close the gaps a clean-room reviewer setup surfaced ([#376](https://github.com/jeromefaria/jeromefaria.github.io/pull/376))
- First-person README intro + an About section linking the professional context ([#348](https://github.com/jeromefaria/jeromefaria.github.io/pull/348))

### Chores

- Finalise the 19 Sep gig as Jejum #45 ([#365](https://github.com/jeromefaria/jeromefaria.github.io/pull/365))
- **cv:** Standardise title to 'Frontend Engineer' across the résumé ([#350](https://github.com/jeromefaria/jeromefaria.github.io/pull/350))
- Close remaining A+ gaps (a11y, SEO, testing, perf) ([#345](https://github.com/jeromefaria/jeromefaria.github.io/pull/345))

## 2026.09.1 — Security, a11y & quality hardening — 2026-09-04


### Content

- Link the Hyphema artwork credit and add the Overlapse video ([#316](https://github.com/jeromefaria/jeromefaria.github.io/pull/316))

### Fixes

- **seo/i18n:** Rely on noindex for the EPK; localize the not-found page ([#337](https://github.com/jeromefaria/jeromefaria.github.io/pull/337))
- **i18n:** Localize live-description suffix + film fields; add PT golden ([#336](https://github.com/jeromefaria/jeromefaria.github.io/pull/336))
- **routing:** Redirect trailing-slash URLs to their canonical form ([#332](https://github.com/jeromefaria/jeromefaria.github.io/pull/332))
- **seo:** Make the page head reactive so it tracks the active locale ([#331](https://github.com/jeromefaria/jeromefaria.github.io/pull/331))
- **worker:** Accept the human inquiry label, not a slug ([#322](https://github.com/jeromefaria/jeromefaria.github.io/pull/322))
- **security:** Repo/CI/client hardening from the security audit ([#321](https://github.com/jeromefaria/jeromefaria.github.io/pull/321))
- **worker:** Harden contact endpoint input validation ([#320](https://github.com/jeromefaria/jeromefaria.github.io/pull/320))
- **a11y:** Address global accessibility audit findings ([#319](https://github.com/jeromefaria/jeromefaria.github.io/pull/319))
- Fix the three EN leaks on /pt (new-tab cue, EPK cities, live ensemble names) ([#317](https://github.com/jeromefaria/jeromefaria.github.io/pull/317))
- Fix 2504 chapter times and chaptered-release track state ([#315](https://github.com/jeromefaria/jeromefaria.github.io/pull/315))

### Performance

- **home:** Serve a phone-sized hero variant, desktop unchanged ([#324](https://github.com/jeromefaria/jeromefaria.github.io/pull/324))
- Home LCP, schema-barrel split, vendor chunk (quick wins) ([#323](https://github.com/jeromefaria/jeromefaria.github.io/pull/323))

### Refactors

- **data:** Split works.ts into per-section files + extract credit derivation ([#338](https://github.com/jeromefaria/jeromefaria.github.io/pull/338))
- **styles:** Use the $z-overlay token in the lightbox ([#335](https://github.com/jeromefaria/jeromefaria.github.io/pull/335))
- **i18n:** Split the message catalogs into per-locale files ([#334](https://github.com/jeromefaria/jeromefaria.github.io/pull/334))
- Post-i18n tidy — Localizable alias, StaticPage shell, Credit unification ([#318](https://github.com/jeromefaria/jeromefaria.github.io/pull/318))

### Tests

- **e2e:** Cover the audio player deep-link permalink and transport ([#330](https://github.com/jeromefaria/jeromefaria.github.io/pull/330))
- Tighten palette assertions and cover the empty-search state ([#329](https://github.com/jeromefaria/jeromefaria.github.io/pull/329))
- **e2e:** Cover the EN<->PT language switch round trip ([#328](https://github.com/jeromefaria/jeromefaria.github.io/pull/328))
- **vr:** Mobile-safari visual coverage for the page snapshots ([#327](https://github.com/jeromefaria/jeromefaria.github.io/pull/327))
- Contract + consistency guards at the data/worker/router seams ([#326](https://github.com/jeromefaria/jeromefaria.github.io/pull/326))

### Docs

- Refresh the README testing sections for this cycle's coverage ([#333](https://github.com/jeromefaria/jeromefaria.github.io/pull/333))

### Chores

- Enforce a no-comments policy and strip non-documenting comments ([#339](https://github.com/jeromefaria/jeromefaria.github.io/pull/339))

### Other

- Post-go-live fixes: locale permalinks, PT card fallback, 2504 times, cover overlay ([#314](https://github.com/jeromefaria/jeromefaria.github.io/pull/314))

## 2026.09.0 — EN/PT internationalization — 2026-09-02


### Features

- Localize the release-meta line for Portuguese ([#307](https://github.com/jeromefaria/jeromefaria.github.io/pull/307))
- Curate EPK press quotes + rename heading to Selected press ([#300](https://github.com/jeromefaria/jeromefaria.github.io/pull/300))
- Expand, extend and reorder the Press page quotes ([#294](https://github.com/jeromefaria/jeromefaria.github.io/pull/294))
- Add EME Madeira poster and MADEIRADIG 2011 lineup spot ([#297](https://github.com/jeromefaria/jeromefaria.github.io/pull/297))
- Localize the command palette ([#284](https://github.com/jeromefaria/jeromefaria.github.io/pull/284))
- Localize lightbox captions and media alt text ([#283](https://github.com/jeromefaria/jeromefaria.github.io/pull/283))
- Localize the JSON-LD structured data ([#282](https://github.com/jeromefaria/jeromefaria.github.io/pull/282))
- Localize descriptive Live event titles ([#281](https://github.com/jeromefaria/jeromefaria.github.io/pull/281))
- Generate the press kit and tech rider PDFs in Portuguese ([#278](https://github.com/jeromefaria/jeromefaria.github.io/pull/278))
- Render the press kit in Portuguese behind the i18n flag ([#277](https://github.com/jeromefaria/jeromefaria.github.io/pull/277))
- Format event dates in Portuguese under /pt ([#275](https://github.com/jeromefaria/jeromefaria.github.io/pull/275))
- Wire Live content to a Localized<T> model ([#273](https://github.com/jeromefaria/jeromefaria.github.io/pull/273))
- Wire Works content to a Localized<T> model ([#272](https://github.com/jeromefaria/jeromefaria.github.io/pull/272))
- Wire the About bio to Localized<T> ([#271](https://github.com/jeromefaria/jeromefaria.github.io/pull/271))
- Wire stable prose to a Localized<T> model ([#270](https://github.com/jeromefaria/jeromefaria.github.io/pull/270))
- Emit hreflang alternates and per-locale sitemap for /pt ([#269](https://github.com/jeromefaria/jeromefaria.github.io/pull/269))
- Translate release media buttons; rename Purchase to Download ([#268](https://github.com/jeromefaria/jeromefaria.github.io/pull/268))
- Translate the keyboard-help cheat sheet (chrome) ([#266](https://github.com/jeromefaria/jeromefaria.github.io/pull/266))
- Add a Colophon page (subtle footer link) ([#256](https://github.com/jeromefaria/jeromefaria.github.io/pull/256))

### Content

- EU-PT readability pass on the tech rider + analogue synthesiser ([#310](https://github.com/jeromefaria/jeromefaria.github.io/pull/310))
- PT Works 'Scores' section → Composições ([#306](https://github.com/jeromefaria/jeromefaria.github.io/pull/306))
- Long-bio refinements (actividade, CAVERNANCIA, NOx) ([#303](https://github.com/jeromefaria/jeromefaria.github.io/pull/303))
- Localize the credits engine and press quotes ([#274](https://github.com/jeromefaria/jeromefaria.github.io/pull/274))
- Translate the contact form (chrome) ([#267](https://github.com/jeromefaria/jeromefaria.github.io/pull/267))
- Translate nav/footer + language switcher (chrome phase 1) ([#265](https://github.com/jeromefaria/jeromefaria.github.io/pull/265))

### Fixes

- Translate venue city/country exonyms for Portuguese ([#308](https://github.com/jeromefaria/jeromefaria.github.io/pull/308))
- Navigate the command palette through the active locale ([#305](https://github.com/jeromefaria/jeromefaria.github.io/pull/305))
- Point Works Bandcamp links at the real bandcamp.com domain ([#304](https://github.com/jeromefaria/jeromefaria.github.io/pull/304))
- Two EU-PT copy corrections (verifyError, Adenda) ([#301](https://github.com/jeromefaria/jeromefaria.github.io/pull/301))
- Fix home page mobile viewport — hero fills, footer + language switch stay in view ([#295](https://github.com/jeromefaria/jeromefaria.github.io/pull/295))
- Apply EU-PT review-pass corrections ([#288](https://github.com/jeromefaria/jeromefaria.github.io/pull/288))
- Repair the epk-photos generator ([#287](https://github.com/jeromefaria/jeromefaria.github.io/pull/287))
- Correct the Nariz Entupido event details ([#285](https://github.com/jeromefaria/jeromefaria.github.io/pull/285))
- Add the .ts extension to the works import in vite.config ([#264](https://github.com/jeromefaria/jeromefaria.github.io/pull/264))
- Opt out of browser auto-translation ([#258](https://github.com/jeromefaria/jeromefaria.github.io/pull/258))
- Fix invisible lightbox controls in dark theme + guard the bug class ([#255](https://github.com/jeromefaria/jeromefaria.github.io/pull/255))

### Performance

- Stop double-optimizing images; raise Hyphema quality ([#309](https://github.com/jeromefaria/jeromefaria.github.io/pull/309))

### Refactors

- Share i18nEnabled across the runtime flag consumers ([#293](https://github.com/jeromefaria/jeromefaria.github.io/pull/293))
- Make body.ready the sole post-hydration signal ([#292](https://github.com/jeromefaria/jeromefaria.github.io/pull/292))
- Borderline audit items (useProseClick, PressQuote, shared jiti) ([#291](https://github.com/jeromefaria/jeromefaria.github.io/pull/291))
- Split _pages.scss into per-page partials ([#290](https://github.com/jeromefaria/jeromefaria.github.io/pull/290))
- Extract shared play and pause icons ([#289](https://github.com/jeromefaria/jeromefaria.github.io/pull/289))
- Remove dead code and tighten release type guards ([#286](https://github.com/jeromefaria/jeromefaria.github.io/pull/286))
- Remove standalone gerunds from the merged PT ([#276](https://github.com/jeromefaria/jeromefaria.github.io/pull/276))
- Model the NNY alias as a performedAs field on live events ([#261](https://github.com/jeromefaria/jeromefaria.github.io/pull/261))
- Model Works credits as structured, composable data ([#260](https://github.com/jeromefaria/jeromefaria.github.io/pull/260))
- Move purchasing into releases; slim footer; complete sameAs ([#257](https://github.com/jeromefaria/jeromefaria.github.io/pull/257))

### Tests

- Close i18n + lightbox coverage gaps ([#298](https://github.com/jeromefaria/jeromefaria.github.io/pull/298))
- Lock a fidelity harness for the credits normalization ([#259](https://github.com/jeromefaria/jeromefaria.github.io/pull/259))

### Build & CI

- **deps-dev:** Bump the worker-minor-patch group ([#280](https://github.com/jeromefaria/jeromefaria.github.io/pull/280))
- **deps:** Bump the npm-minor-patch group with 6 updates ([#279](https://github.com/jeromefaria/jeromefaria.github.io/pull/279))

### Docs

- Document the bilingual/i18n architecture in the README ([#299](https://github.com/jeromefaria/jeromefaria.github.io/pull/299))

### Chores

- Go live: enable the EN/PT bilingual layer (VITE_I18N) ([#313](https://github.com/jeromefaria/jeromefaria.github.io/pull/313))
- Tighten four over-long comments ([#312](https://github.com/jeromefaria/jeromefaria.github.io/pull/312))
- Add .prettierignore — this repo is ESLint-formatted, not Prettier ([#302](https://github.com/jeromefaria/jeromefaria.github.io/pull/302))

### Other

- PT go-live prep: og:locale + EU-PT copy polish ([#311](https://github.com/jeromefaria/jeromefaria.github.io/pull/311))
- About + EPK bio: fix ECT attribution, feature EME ([#296](https://github.com/jeromefaria/jeromefaria.github.io/pull/296))
- Locale routing + /pt SSG dual-tree (behind VITE_I18N) ([#263](https://github.com/jeromefaria/jeromefaria.github.io/pull/263))
- I18n engine + VITE_I18N flag (vue-i18n, lean) ([#262](https://github.com/jeromefaria/jeromefaria.github.io/pull/262))

## 2026.08.1 — Command palette & audio player — 2026-08-30


### Features

- **worker:** Rate-limit the contact endpoint by client IP ([#254](https://github.com/jeromefaria/jeromefaria.github.io/pull/254))
- Shareable deep links to lightbox photos, posters, and videos ([#250](https://github.com/jeromefaria/jeromefaria.github.io/pull/250))
- Swipe down to collapse the expanded player on touch devices ([#246](https://github.com/jeromefaria/jeromefaria.github.io/pull/246))
- Add a mobile Lighthouse profile ([#239](https://github.com/jeromefaria/jeromefaria.github.io/pull/239))
- Fail the build on unresolved credit markers ([#236](https://github.com/jeromefaria/jeromefaria.github.io/pull/236))
- Generate sitemap.xml from prerendered routes ([#225](https://github.com/jeromefaria/jeromefaria.github.io/pull/225))
- Route internal prose links through the SPA (no reload flash) ([#220](https://github.com/jeromefaria/jeromefaria.github.io/pull/220))
- Extend the command palette: audio transport + SoundCloud openers ([#219](https://github.com/jeromefaria/jeromefaria.github.io/pull/219))
- Expand the privacy notice; the palette mention opens it ([#218](https://github.com/jeromefaria/jeromefaria.github.io/pull/218))
- Seek 2504's movements within its single audio file ([#212](https://github.com/jeromefaria/jeromefaria.github.io/pull/212))
- Play specific tracks from the Works listings ([#209](https://github.com/jeromefaria/jeromefaria.github.io/pull/209))
- Encode Overlapse XIII with per-track remixer credits ([#206](https://github.com/jeromefaria/jeromefaria.github.io/pull/206))
- Player polish — buffering spinner, lock-screen artwork, black favicon ([#205](https://github.com/jeromefaria/jeromefaria.github.io/pull/205))
- Audio player — pipeline, global store, docked bar (behind a flag) ([#203](https://github.com/jeromefaria/jeromefaria.github.io/pull/203))
- Weight palette search fields so entities outrank prose ([#202](https://github.com/jeromefaria/jeromefaria.github.io/pull/202))
- Add a Clear recents command to the palette ([#201](https://github.com/jeromefaria/jeromefaria.github.io/pull/201))
- Model release credits as structured contributors ([#200](https://github.com/jeromefaria/jeromefaria.github.io/pull/200))
- Hidden ⌘K command palette + ? shortcut help ([#199](https://github.com/jeromefaria/jeromefaria.github.io/pull/199))

### Content

- Reconcile MADEIRADIG lineups with the archive; model co-billed pairs ([#253](https://github.com/jeromefaria/jeromefaria.github.io/pull/253))
- Refresh page meta descriptions (add licensing + mastering; align framing) ([#184](https://github.com/jeromefaria/jeromefaria.github.io/pull/184))

### Fixes

- Label the contact inquiry "Mixing & Mastering" ([#252](https://github.com/jeromefaria/jeromefaria.github.io/pull/252))
- Harden the contact Worker and credit-link rendering ([#249](https://github.com/jeromefaria/jeromefaria.github.io/pull/249))
- Close accessibility gaps from the audit ([#248](https://github.com/jeromefaria/jeromefaria.github.io/pull/248))
- Refcount useScrollLock and make it iOS-safe ([#247](https://github.com/jeromefaria/jeromefaria.github.io/pull/247))
- Reserve image space with intrinsic dimensions (CLS) ([#228](https://github.com/jeromefaria/jeromefaria.github.io/pull/228))
- Trap focus, restore it, and lock scroll in the expanded player ([#227](https://github.com/jeromefaria/jeromefaria.github.io/pull/227))
- Announce seek slider position as time, not raw seconds ([#226](https://github.com/jeromefaria/jeromefaria.github.io/pull/226))
- Use a plain bullet for the footer separator ([#217](https://github.com/jeromefaria/jeromefaria.github.io/pull/217))
- Stop collapsed accordion sections leaking document scroll height ([#208](https://github.com/jeromefaria/jeromefaria.github.io/pull/208))
- Center the player bar's title and controls on mobile ([#207](https://github.com/jeromefaria/jeromefaria.github.io/pull/207))
- Make the player bar responsive on narrow screens ([#204](https://github.com/jeromefaria/jeromefaria.github.io/pull/204))
- Honor prefers-reduced-motion for press hash-scroll ([#186](https://github.com/jeromefaria/jeromefaria.github.io/pull/186))

### Performance

- Render-blocking CSS for a zero-CLS first paint ([#240](https://github.com/jeromefaria/jeromefaria.github.io/pull/240))

### Refactors

- Extract TransportControls and PlayerSeek from the player surfaces ([#245](https://github.com/jeromefaria/jeromefaria.github.io/pull/245))
- Extract useFocusReturn for the overlay focus-restore dance ([#244](https://github.com/jeromefaria/jeromefaria.github.io/pull/244))
- Name the global z-index layers ([#230](https://github.com/jeromefaria/jeromefaria.github.io/pull/230))
- Split _components.scss grab-bag into focused partials ([#229](https://github.com/jeromefaria/jeromefaria.github.io/pull/229))
- Model Works mixing & mastering as generated engineering credits ([#216](https://github.com/jeromefaria/jeromefaria.github.io/pull/216))
- Extract useReleasePlayback + unify play intent ([#214](https://github.com/jeromefaria/jeromefaria.github.io/pull/214))
- Type the works artist as Credit, consistent with Poster.artist ([#193](https://github.com/jeromefaria/jeromefaria.github.io/pull/193))
- Extract ResponsivePicture and unify the image load-in fade ([#192](https://github.com/jeromefaria/jeromefaria.github.io/pull/192))
- Dedupe build scripts and E2E hydration boilerplate ([#189](https://github.com/jeromefaria/jeromefaria.github.io/pull/189))
- Extract recurring SCSS mixins ([#188](https://github.com/jeromefaria/jeromefaria.github.io/pull/188))
- Audit quick wins — dead code, dedup, worker hardening ([#185](https://github.com/jeromefaria/jeromefaria.github.io/pull/185))
- Remove the italic on EPK press quotes ([#183](https://github.com/jeromefaria/jeromefaria.github.io/pull/183))

### Tests

- De-flake the Firefox lightbox specs ([#238](https://github.com/jeromefaria/jeromefaria.github.io/pull/238))
- Refresh About visual baselines for the new-tab cue spans ([#191](https://github.com/jeromefaria/jeromefaria.github.io/pull/191))

### Build & CI

- **deps-dev:** Bump typescript from 5.9.3 to 7.0.2 in /worker ([#234](https://github.com/jeromefaria/jeromefaria.github.io/pull/234))
- **deps-dev:** Bump the npm-minor-patch group across 1 directory with 5 updates ([#235](https://github.com/jeromefaria/jeromefaria.github.io/pull/235))
- Make visual regression a blocking check ([#223](https://github.com/jeromefaria/jeromefaria.github.io/pull/223))

### Docs

- Refresh README for the enforcement + tooling from the A+ work ([#243](https://github.com/jeromefaria/jeromefaria.github.io/pull/243))
- Add a styles token reference ([#231](https://github.com/jeromefaria/jeromefaria.github.io/pull/231))
- Document the audio player and shareable permalinks ([#215](https://github.com/jeromefaria/jeromefaria.github.io/pull/215))
- Add light domain context to the README ([#198](https://github.com/jeromefaria/jeromefaria.github.io/pull/198))
- Tighten the README and soften the intro ([#197](https://github.com/jeromefaria/jeromefaria.github.io/pull/197))
- Use a plain-text architecture diagram instead of Mermaid ([#196](https://github.com/jeromefaria/jeromefaria.github.io/pull/196))
- Reframe the README as a technical case study ([#195](https://github.com/jeromefaria/jeromefaria.github.io/pull/195))
- Correct the worker deploy note on secret persistence ([#187](https://github.com/jeromefaria/jeromefaria.github.io/pull/187))

### Style

- Fluid content-rhythm spacing via clamp() ([#232](https://github.com/jeromefaria/jeromefaria.github.io/pull/232))
- Unify uppercase labels at font-weight 500 ([#194](https://github.com/jeromefaria/jeromefaria.github.io/pull/194))

### Chores

- Single-source Node version + manage worker deps ([#233](https://github.com/jeromefaria/jeromefaria.github.io/pull/233))
- Add husky pre-commit (lint-staged) + pre-push (type-check) gate ([#224](https://github.com/jeromefaria/jeromefaria.github.io/pull/224))
- Enforce TS + Vue invariants with lint rules (Wave 1) ([#222](https://github.com/jeromefaria/jeromefaria.github.io/pull/222))
- Enforce SCSS with stylelint (standard-scss, BEM-aware) ([#221](https://github.com/jeromefaria/jeromefaria.github.io/pull/221))

### Other

- Lightbox deep links v2: browser-history integration ([#251](https://github.com/jeromefaria/jeromefaria.github.io/pull/251))
- Comment sweep + palette refactor tidy-up from the A+ work ([#242](https://github.com/jeromefaria/jeromefaria.github.io/pull/242))
- Editorial corrections: bios + credits ([#241](https://github.com/jeromefaria/jeromefaria.github.io/pull/241))
- Shareable per-release permalinks that play on open ([#213](https://github.com/jeromefaria/jeromefaria.github.io/pull/213))
- Native player on audio-backed releases; player public by default ([#211](https://github.com/jeromefaria/jeromefaria.github.io/pull/211))
- Expandable full-screen player with a dismiss control ([#210](https://github.com/jeromefaria/jeromefaria.github.io/pull/210))
- Use per-link new-tab cues, drop the blanket page notes ([#190](https://github.com/jeromefaria/jeromefaria.github.io/pull/190))

## 2026.08.0 — Press kit & contact — 2026-08-26


### Features

- Add a downloadable technical rider ([#174](https://github.com/jeromefaria/jeromefaria.github.io/pull/174))
- Embed Inter in the EPK one-sheet PDF ([#173](https://github.com/jeromefaria/jeromefaria.github.io/pull/173))
- Add typed live-event query helpers ([#171](https://github.com/jeromefaria/jeromefaria.github.io/pull/171))
- EPK downloadable press kit and deep-links ([#169](https://github.com/jeromefaria/jeromefaria.github.io/pull/169))
- Add unlisted press kit (EPK) page at /epk ([#168](https://github.com/jeromefaria/jeromefaria.github.io/pull/168))
- Add event posters and streamline media controls ([#152](https://github.com/jeromefaria/jeromefaria.github.io/pull/152))
- Open external links in Live and About prose in a new tab ([#144](https://github.com/jeromefaria/jeromefaria.github.io/pull/144))
- Open external links in a new tab with a page-level cue ([#137](https://github.com/jeromefaria/jeromefaria.github.io/pull/137))
- Show NotFoundView for unknown URLs (fix SPA-redirect timing) ([#119](https://github.com/jeromefaria/jeromefaria.github.io/pull/119))
- Add videos to Works & Live, a lightbox counter, and video credits ([#113](https://github.com/jeromefaria/jeromefaria.github.io/pull/113))
- Serve responsive image variants, generated at build time ([#107](https://github.com/jeromefaria/jeromefaria.github.io/pull/107))
- Add Playwright visual-regression tests (PR-only, non-deploy-gating) ([#105](https://github.com/jeromefaria/jeromefaria.github.io/pull/105))
- Enable type-aware ESLint rules on the app source ([#104](https://github.com/jeromefaria/jeromefaria.github.io/pull/104))
- Add a screen-reader 'opens in a new tab' cue to external links ([#80](https://github.com/jeromefaria/jeromefaria.github.io/pull/80))
- Give each page a single heading and demote the masthead title ([#83](https://github.com/jeromefaria/jeromefaria.github.io/pull/83))
- Enlarge lightbox controls to meet minimum target size ([#79](https://github.com/jeromefaria/jeromefaria.github.io/pull/79))
- Expose contact-form validation errors to assistive tech ([#82](https://github.com/jeromefaria/jeromefaria.github.io/pull/82))
- Add grouped Dependabot config to reduce update-PR noise ([#66](https://github.com/jeromefaria/jeromefaria.github.io/pull/66))
- Make the lightbox a proper accessible modal dialog ([#64](https://github.com/jeromefaria/jeromefaria.github.io/pull/64))
- Instrument whole codebase for coverage and set an honest floor ([#65](https://github.com/jeromefaria/jeromefaria.github.io/pull/65))
- Add two upcoming 2026 solo dates in Portugal
- Add build-time check for internal content anchor links
- Add Contraplacado to Solo works
- Add photos to EME.LL / Olhares de Outono 2009
- Add BRØQN catalog numbers to all releases
- Add En Veille to Solo discography
- Add comprehensive documentation for local CI and content management
- Add loading spinner to hero image
- Add favicon to prevent Lighthouse console errors
- Add comprehensive CI workflow with quality checks
- Add Lighthouse CI configuration and dependencies
- Add E2E tests with Playwright
- Add unit tests for utility functions
- Add unit tests for composables
- Add testing infrastructure with Vitest and Playwright

### Content

- Contact Phase 3: cutover to the Worker + invisible Turnstile ([#182](https://github.com/jeromefaria/jeromefaria.github.io/pull/182))
- Contact Phase 2: Cloudflare Worker for Turnstile-verified email relay ([#181](https://github.com/jeromefaria/jeromefaria.github.io/pull/181))
- Adaptive inquiry form with typed routing (Phase 1) ([#178](https://github.com/jeromefaria/jeromefaria.github.io/pull/178))
- Weave the 2026 releases into the About narrative ([#176](https://github.com/jeromefaria/jeromefaria.github.io/pull/176))
- Model the Aragão Funchal run as its full 22–25 Sep four nights ([#165](https://github.com/jeromefaria/jeromefaria.github.io/pull/165))
- Point the Festival Múltiplo title at Zaratan's official page ([#150](https://github.com/jeromefaria/jeromefaria.github.io/pull/150))
- Flesh out the 23 Aug 2026 gig as Festival Múltiplo ([#148](https://github.com/jeromefaria/jeromefaria.github.io/pull/148))
- Refresh README coverage and ratchet the floor to the achieved ~83% ([#89](https://github.com/jeromefaria/jeromefaria.github.io/pull/89))

### Fixes

- Fix the rem baseline (16px root) ([#164](https://github.com/jeromefaria/jeromefaria.github.io/pull/164))
- Audit fixes — a11y assertions, CSS var, tooling cleanup ([#154](https://github.com/jeromefaria/jeromefaria.github.io/pull/154))
- Stop tracking Claude Code settings ([#130](https://github.com/jeromefaria/jeromefaria.github.io/pull/130))
- Fix mobile menu closing instantly when opened on a scrolled page ([#116](https://github.com/jeromefaria/jeromefaria.github.io/pull/116))
- Close the mobile menu on an outside tap or a scroll ([#115](https://github.com/jeromefaria/jeromefaria.github.io/pull/115))
- Re-gate deployment on the cross-browser E2E suite ([#96](https://github.com/jeromefaria/jeromefaria.github.io/pull/96))
- Fix Tier-2/3 correctness issues ([#76](https://github.com/jeromefaria/jeromefaria.github.io/pull/76))
- Fix invalid nested anchors in live-event titles ([#63](https://github.com/jeromefaria/jeromefaria.github.io/pull/63))
- Fix cover images staying invisible when already cached ([#62](https://github.com/jeromefaria/jeromefaria.github.io/pull/62))
- Patch Dependabot security alerts via in-range dependency updates ([#60](https://github.com/jeromefaria/jeromefaria.github.io/pull/60))
- Fix missing label and catalog number in mastering entry for Overlapse XIII ([#46](https://github.com/jeromefaria/jeromefaria.github.io/pull/46))
- Fix typo: rename Louis to Louie de Bettencourt in works credits ([#45](https://github.com/jeromefaria/jeromefaria.github.io/pull/45))
- Fix CI: optimise Contraplacado cover and underline credits links
- Fix CI: drop uuid v14 override breaking Cypress and Lighthouse on Node 20 ([#44](https://github.com/jeromefaria/jeromefaria.github.io/pull/44))
- Fix npm audit vulnerabilities (postcss, uuid)
- Fix En Veille release year to 2026
- Fix navigation test stale element error in Cypress 14
- Fix contact form blur tests for Cypress 14
- Fix E2E test failures and update Cypress to 14.x
- Fix all npm audit security vulnerabilities
- Fix ESLint errors in test files blocking CI
- Fix security vulnerabilities via npm audit fix and vite-ssg update
- Fix credits formatting for En Veille to be consistent
- Use higher quality JPG for hero image instead of compressed WebP
- Eliminate FOUC by inlining critical CSS and preloading fonts
- Adjust skip link scroll threshold in E2E test
- Add json-summary reporter for coverage checks

### Performance

- Subset and self-host Iosevka Aile (3.5MB CDN → 243KB local) ([#103](https://github.com/jeromefaria/jeromefaria.github.io/pull/103))
- Improve mobile-nav keyboard accessibility ([#81](https://github.com/jeromefaria/jeromefaria.github.io/pull/81))
- Optimize SSG hydration and First Contentful Paint
- Improve WCAG accessibility compliance

### Refactors

- Tighten the visual-regression tolerance to an absolute budget ([#180](https://github.com/jeromefaria/jeromefaria.github.io/pull/180))
- Extract bios into a first-class data module ([#175](https://github.com/jeromefaria/jeromefaria.github.io/pull/175))
- Model live events as setup + format axes ([#170](https://github.com/jeromefaria/jeromefaria.github.io/pull/170))
- Model Live performance type and lineup as structured data ([#162](https://github.com/jeromefaria/jeromefaria.github.io/pull/162))
- Model the tracklist as structured data ([#160](https://github.com/jeromefaria/jeromefaria.github.io/pull/160))
- Discriminate CommissionMeta on the work kind ([#158](https://github.com/jeromefaria/jeromefaria.github.io/pull/158))
- Model image credits explicitly (Credit + role) ([#157](https://github.com/jeromefaria/jeromefaria.github.io/pull/157))
- Extract FormField from ContactView ([#156](https://github.com/jeromefaria/jeromefaria.github.io/pull/156))
- Behavior-preserving cleanups from the audit ([#155](https://github.com/jeromefaria/jeromefaria.github.io/pull/155))
- Decouple the link URL from the Live event title ([#153](https://github.com/jeromefaria/jeromefaria.github.io/pull/153))
- Rename AccordionListPage to AccordionPage ([#151](https://github.com/jeromefaria/jeromefaria.github.io/pull/151))
- Extract AccordionListPage from WorksView and LiveView ([#147](https://github.com/jeromefaria/jeromefaria.github.io/pull/147))
- Drop the redundant date fallback in the live year sort ([#145](https://github.com/jeromefaria/jeromefaria.github.io/pull/145))
- Remove the dead AboutLegacyImageSection ([#143](https://github.com/jeromefaria/jeromefaria.github.io/pull/143))
- Share Photographer and Video primitives across the data types ([#142](https://github.com/jeromefaria/jeromefaria.github.io/pull/142))
- Derive the live year grouping from event dates ([#140](https://github.com/jeromefaria/jeromefaria.github.io/pull/140))
- Hoist repeated per-image alt to an event-level imageAlt ([#139](https://github.com/jeromefaria/jeromefaria.github.io/pull/139))
- Drop unused image transform fields from the live and lightbox paths ([#138](https://github.com/jeromefaria/jeromefaria.github.io/pull/138))
- Model release meta as a kind-discriminated union with a normalized render ([#136](https://github.com/jeromefaria/jeromefaria.github.io/pull/136))
- Normalize release meta into structured fields ([#135](https://github.com/jeromefaria/jeromefaria.github.io/pull/135))
- Collapse the Release union into one capability-typed interface ([#134](https://github.com/jeromefaria/jeromefaria.github.io/pull/134))
- Drop two unnecessary comments ([#132](https://github.com/jeromefaria/jeromefaria.github.io/pull/132))
- Rename terse variables and collapse redundant blocks ([#129](https://github.com/jeromefaria/jeromefaria.github.io/pull/129))
- Remove redundant comments across the codebase ([#128](https://github.com/jeromefaria/jeromefaria.github.io/pull/128))
- Extract a MediaLinks component for the gallery/video controls ([#127](https://github.com/jeromefaria/jeromefaria.github.io/pull/127))
- Extract a ReleaseCover component and collapse the duplicate cover markup ([#126](https://github.com/jeromefaria/jeromefaria.github.io/pull/126))
- Extract scroll helpers and centralize hash-state/section lookup ([#124](https://github.com/jeromefaria/jeromefaria.github.io/pull/124))
- Extract shared PageShell and ExternalLink components ([#123](https://github.com/jeromefaria/jeromefaria.github.io/pull/123))
- Extract toWebp helper and lightbox-item adapters ([#121](https://github.com/jeromefaria/jeromefaria.github.io/pull/121))
- Extract page schema/meta builders and a LightboxHost component ([#120](https://github.com/jeromefaria/jeromefaria.github.io/pull/120))
- Remove stray macOS visual snapshots and gitignore local ones ([#118](https://github.com/jeromefaria/jeromefaria.github.io/pull/118))
- Trim redundant and over-long comments ([#117](https://github.com/jeromefaria/jeromefaria.github.io/pull/117))
- Lift the lightbox controls clear of the mobile safe area and even the spacing ([#114](https://github.com/jeromefaria/jeromefaria.github.io/pull/114))
- Scope vue/one-component-per-file to source SFCs, not tests ([#111](https://github.com/jeromefaria/jeromefaria.github.io/pull/111))
- Replace Iosevka Aile with self-hosted Inter ([#108](https://github.com/jeromefaria/jeromefaria.github.io/pull/108))
- Consolidate CI and deploy workflows to remove duplication ([#101](https://github.com/jeromefaria/jeromefaria.github.io/pull/101))
- Deduplicate the ESLint config and extract useScrollLock ([#100](https://github.com/jeromefaria/jeromefaria.github.io/pull/100))
- Modernise remaining legacy patterns and enforce them via ESLint ([#99](https://github.com/jeromefaria/jeromefaria.github.io/pull/99))
- Migrate E2E from Cypress to Playwright ([#98](https://github.com/jeromefaria/jeromefaria.github.io/pull/98))
- Backfill tests to ~95% coverage and align the Codecov config ([#90](https://github.com/jeromefaria/jeromefaria.github.io/pull/90))
- Extract shared useHashScroll from useAccordion and PressView ([#87](https://github.com/jeromefaria/jeromefaria.github.io/pull/87))
- Remove the unused 'default' lightbox variant ([#86](https://github.com/jeromefaria/jeromefaria.github.io/pull/86))
- Model event venues as structured data instead of parsing strings ([#84](https://github.com/jeromefaria/jeromefaria.github.io/pull/84))
- Remove dead defaultOpen flag and lint scripts/ ([#77](https://github.com/jeromefaria/jeromefaria.github.io/pull/77))
- Backfill unit tests for all views ([#75](https://github.com/jeromefaria/jeromefaria.github.io/pull/75))
- Backfill unit tests for SiteHeader, SiteFooter, ReleaseItem ([#74](https://github.com/jeromefaria/jeromefaria.github.io/pull/74))
- Backfill unit tests for utils and key components ([#67](https://github.com/jeromefaria/jeromefaria.github.io/pull/67))
- Reorder 17:14 tracklist to match Bandcamp (8:58, 2:58, 5:18)
- Decouple deploy from flaky E2E tests ([#43](https://github.com/jeromefaria/jeromefaria.github.io/pull/43))
- Migrate E2E tests from Playwright to Cypress and expand test coverage
- Migrate codebase to TypeScript

### Tests

- Strengthen the lightbox nav tests and retire a spent characterization test ([#159](https://github.com/jeromefaria/jeromefaria.github.io/pull/159))
- Pin accordion-view wiring before the AccordionListPage extraction ([#146](https://github.com/jeromefaria/jeromefaria.github.io/pull/146))
- Backfill coverage gaps and ratchet the regression floor ([#133](https://github.com/jeromefaria/jeromefaria.github.io/pull/133))

### Build & CI

- Fail the build on a missing EPK photo source ([#177](https://github.com/jeromefaria/jeromefaria.github.io/pull/177))
- **deps-dev:** Bump the npm-minor-patch group across 1 directory with 10 updates ([#167](https://github.com/jeromefaria/jeromefaria.github.io/pull/167))
- Generate the EPK bundle at build time instead of committing it ([#172](https://github.com/jeromefaria/jeromefaria.github.io/pull/172))

### Style

- Format visually-hidden page headings to satisfy the vue lint rule ([#110](https://github.com/jeromefaria/jeromefaria.github.io/pull/110))

### Chores

- Correct and reconcile the project license ([#166](https://github.com/jeromefaria/jeromefaria.github.io/pull/166))
- Global comment sweep ([#163](https://github.com/jeromefaria/jeromefaria.github.io/pull/163))
- Remove comments that restate the code ([#161](https://github.com/jeromefaria/jeromefaria.github.io/pull/161))
- Trim unnecessary comment blocks added during the meta rework ([#141](https://github.com/jeromefaria/jeromefaria.github.io/pull/141))
- Bump the npm-minor-patch group with 7 updates ([#112](https://github.com/jeromefaria/jeromefaria.github.io/pull/112))
- Enforce deterministic CI budgets and fix the defects they surfaced ([#102](https://github.com/jeromefaria/jeromefaria.github.io/pull/102))
- Bump vite to 8, vue-router to 5, and @types/node to 26 ([#97](https://github.com/jeromefaria/jeromefaria.github.io/pull/97))
- Lint the cypress/ E2E suite ([#85](https://github.com/jeromefaria/jeromefaria.github.io/pull/85))
- Bump dev-dependency majors: eslint 10, cypress 15, start-server 3, import-sort 14 ([#88](https://github.com/jeromefaria/jeromefaria.github.io/pull/88))
- Bump the github-actions group with 9 updates ([#69](https://github.com/jeromefaria/jeromefaria.github.io/pull/69))
- Update README: refresh coverage stats and E2E spec list
- Update Patreon link to blog.jeromefaria.com
- Update Bandcamp links to music.jeromefaria.com and add Archive.org links
- Update 2504 cover image
- Update 2504 credits
- Update 2504 cover image
- Update README with testing and CI/CD documentation
- Run tests before deployment in CI workflow

### Other

- Even out the About short-bio divider spacing ([#179](https://github.com/jeromefaria/jeromefaria.github.io/pull/179))
- Address remaining code-quality findings to reach grade A ([#131](https://github.com/jeromefaria/jeromefaria.github.io/pull/131))
- Drive contact-form validation from a single field list ([#125](https://github.com/jeromefaria/jeromefaria.github.io/pull/125))
- Remove dead code, use isImageSection guard, dedup lightbox type ([#122](https://github.com/jeromefaria/jeromefaria.github.io/pull/122))
- Focus the mobile-nav container instead of the first link on open ([#109](https://github.com/jeromefaria/jeromefaria.github.io/pull/109))
- Defer cover images in collapsed accordion sections ([#106](https://github.com/jeromefaria/jeromefaria.github.io/pull/106))
- De-flake E2E specs and reprocess external links on navigation ([#95](https://github.com/jeromefaria/jeromefaria.github.io/pull/95))
- Deepen unit tests: behavioural assertions and branch-gap coverage ([#94](https://github.com/jeromefaria/jeromefaria.github.io/pull/94))
- Break focus/trigger chains to avoid stale element errors in Cypress 14
- Optimize build configuration and image compression
- Add post-build script for CSS non-render-blocking
- Make font loading async to eliminate render-blocking
- Consolidate workflows and configure Lighthouse

## 2025.12.0 — Vue 3 foundation — 2025-12-31


### Features

- Add comprehensive JSDoc type documentation
- Add privacy-enhanced YouTube videos to live events
- Add video playback support to lightbox and live events
- Add optimized images for Caligari performances
- Add event dates and photos to live performances
- Add photo gallery to Aragão performance at Teatro Baltazar Dias
- Add photo gallery to Caligari performance at Scat Music Club
- Add Glitch: Designing Imperfection book gallery with interior spreads
- Add URLs for collaborators in Works section
- Add website link for Victor Martins in Hyphema credits
- Add Instagram URL for photographer Miguel Apolinário
- Make author name in footer a clickable link to Contact page
- Add photographer credits to About and Live page images
- Create EventItem component for architectural consistency
- Add Live page photo galleries with refined lightbox UI
- Implement shareable deep links for Live events and Works releases
- Add CAVERNANCIA Bandcamp link and fix capitalization across site
- Add close button to lightbox for mobile accessibility
- Add keyboard control hints to lightbox
- Add visual validation feedback to contact form
- Add contact page with FormSubmit integration
- Add artwork credits and Bandcamp embeds for NNY releases
- Add Hugo Olim to MADEIRADIG 2005 entry
- Add CLAUDE.md to gitignore
- Add early return ESLint rules (no-else-return, no-lonely-if)
- Add eslint-plugin-simple-import-sort for automatic import ordering
- Add ESLint configuration and enforce semicolons
- Add consistent JSDoc comments to composables
- Add noIndex option to usePageHead and refactor NotFoundView
- Add vertical movement to page transitions
- Add animated underline effect to prose links
- Add subtle slide-up animation to image fade-in
- Add preload spinner to images in Works
- Show play button hover only for Bandcamp links
- Add loading indicator to Bandcamp player
- Add button :active state feedback
- Add underline indicator to active nav link
- Add prefers-reduced-motion support for accessibility
- Add loading spinner and fade-in effect on initial page load
- Add scroll-margin to release items for deep linking
- Add scroll-margin and hash watcher to Press page
- Expand internal links in About page
- Add linkable IDs and hash navigation to Press page
- Add robots.txt and sitemap.xml for search engines
- Add fallback meta tags to index.html for SEO
- Add canonical URLs and enhance meta tags in usePageHead
- Add sandbox attribute to Bandcamp iframe for security
- Add font-weight 600 to Inter font load
- Add Bandcamp links for Aires and W. R. Pyo in Overlapse XIII
- Add Overlapse XIII contributors to About page
- Add Discogs links and shorten Madeira Dig titles
- Add Madeira Dig compilation appearances (2009, 2011)
- Add Amess performances to Live page (2021-2022)
- Add JSON-LD structured data for SEO

### Content

- Revise About section narrative for clarity and flow
- Revise About page content and fix internal links

### Fixes

- Fix missing closing bracket in 2021 events array
- Fix Works page credits and update broken links
- Fix lightbox photographer credit positioning
- Fix reactivity: convert let to ref() for isInitialLoad
- Fix semantic HTML: remove improper role attribute
- Fix hero image gap on iPhone by accounting for safe area insets
- Hide keyboard hints on touch devices regardless of screen size
- Hide lightbox keyboard hints on mobile devices
- Fix critical website issues and optimize images
- Fix desktop accordion scroll offset clipping section title
- Fix mobile accordion scroll clipping on Works and Live pages
- Fix aspect ratio for non-square images in Film & Theatre
- Fix homepage footer spacing to match other pages
- Fix image load detection with nextTick and naturalHeight check
- Fix image load detection for cached images
- Fix package.json URLs for consistency
- Fix PressView to conditionally render source links
- Fix accordion scroll clipping by sticky header
- Fix British spelling and remove repeated phrase in About
- Fix content data consistency and add missing details
- Fix BandcampPlayer to use actual iframe load event
- Fix homepage scroll and adjust footer padding

### Performance

- Optimize website performance
- Improve code consistency and documentation
- Improve structured data completeness
- Increase hero bottom spacing to match Press page footer padding
- Improve magic number comment in nav-toggle
- Improve performance with WebP images and CSS cleanup
- Improve code consistency: use ID_PREFIX constants and explicit imports
- Increase footer link touch targets for mobile
- Improve accordion hash navigation with deep linking support
- Improve compilations section consistency
- Improve performance: preload hero image and optimize image loading
- Improve accessibility: WCAG AA colors and accordion focus management
- Improve UX: loading states, external links, and 404 page
- Improve code quality: normalize data, add error handling, implement head management

### Refactors

- Generate worksSections dynamically from worksData keys
- Generate liveYears dynamically from liveData keys
- Polish SCSS comments and documentation (low-priority)
- Replace magic pixel values with spacing variables
- Add overlay color variables for better themability
- Add opacity scale variables and replace hardcoded values
- Move .link-discrete utility to correct file
- Move Accordion component to correct file
- Move Lightbox component to correct file
- Fix critical SCSS issues
- Extract schema generation and form logic
- Extract duplicate code into reusable utilities
- Sort events at render time instead of using build scripts
- Use ISO date format for events with display formatter
- Reorder live events chronologically within each year
- Restructure About section for chronological flow
- Restructure Works page categories and normalize credits
- Refine Glitch book credits and metadata
- Standardize footer class names to BEM convention
- Use individual artist pages for Michael Betancourt and Taylor Deupree
- Apply ESLint code style fixes
- Remove broken link for Structura
- Standardize credit formatting in Works section
- Refactor lightbox implementation with shared component
- Remove duplicate images from Live page galleries
- Use FORM_SUBMIT constants in ContactView
- Standardize data structure naming: items property
- Extract magic numbers to constants
- Normalize lightbox image sizing for consistent display
- Remove favicon and apple-touch-icon
- Restructure About page and expand live events archive
- Replace Inter with Iosevka Aile font
- Refactor homepage hero to use calculated footer height with responsive background sizing
- Apply consistent BEM naming convention to SCSS and Vue components
- Apply ESLint formatting rules across codebase
- Consolidate component dimension variables
- Extract play-triangle-centered mixin for reusable play icon
- Extract absolute-fill mixin to reduce duplicate positioning
- Extract image-reveal mixin to reduce duplicate code
- Use dynamic year for initial accordion section in LiveView
- Extract duplicated image loading logic into useImageLoader composable
- Remove loading spinner from all Works images consistently
- Remove bold styling from publication names in About
- Simplify single-statement blocks and computed properties
- Replace if-else blocks with early returns and ternaries
- Use arrow function expressions consistently
- Use function declarations consistently
- Refactor find functions to use Array.find()
- Extract nav max-height to SCSS variable
- Extract scroll-margin-header SCSS mixin
- Extract timing constants and refactor duplicate logic
- Remove redundant code comments
- Replace setTimeout with nextTick for external link processing
- Consolidate duplicate SCSS blocks in _pages.scss
- Document magic numbers and extract loading dot size
- Remove unused touch-target mixin
- Use $transition-base variable in page transitions
- Extract overlay color to $overlay-dark variable
- Extract hover-text mixin for muted-to-text hover pattern
- Extract focus-ring mixin for consistent focus styling
- Create SCSS mixin for play button triangle
- Extract hero bottom spacing to SCSS variable
- Extract utility functions to src/utils/formatters.js
- Extract useAccordion composable for shared accordion logic
- Extract usePageHead composable for DRY head meta setup

### Docs

- Document intentional use of em units in prose styles

### Chores

- Update photographer and venue URLs from HTTP to HTTPS
- Update views to use standardized items property
- Update About page content and bio
- Update press and about sections
- Set up vite-ssg for static site generation

### Other

- Change event/release titles from buttons to actual links
- Allow tapping image to close lightbox on mobile
- Enhance About page with image lightbox and optimize images
- Disable page transition translation on homepage and remove unused .lead styles
- Revert About page to preferred phrasing
_Genesis: migration from Jekyll to a typed Vue 3 SPA (2025-12-07)._
