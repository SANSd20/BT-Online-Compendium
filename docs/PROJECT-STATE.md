# Project State

## Purpose

BT Online Compendium is intended to provide a web-based BattleTech *A Time of War* rules compendium and Character Generator. The current phase is Alpha. Beta 1 is a future milestone requiring completed character creation and PDF export. The long-term direction also includes a persistable playable-character sheet, which is not part of the current Alpha slices.

## Product direction

- Web application.
- Offline/PWA capable.
- Local-first.
- Local browser character saves initially.
- Import/export through a versioned portable character format.
- Public Alpha uses browser-local storage and requires no server, database, special platform login, application account, or cloud-character-storage service.
- Account/login/cloud save is expected before v1.0 but remains deferred; a future backend must not silently replace the local-first portable format.

Saved characters must retain enough underlying information to reproduce and audit the character, not merely visible record-sheet totals. The format must leave room for schema and rules/source versions, XP provenance, resolved choices, Life Module history, identity assignments, equipment and vehicles, derived-result provenance, and future Play State.

## Workstream status

| Workstream | Status | Notes |
|---|---|---|
| Repository bootstrap / durable state | Complete | Documentation authority established |
| Core + Companion rules audit | In progress | Reconciled through GM arbitration/override architecture; next target is Campaign / Rules Configuration |
| Alpha Slice 1 application foundation | Implemented and verified | React/TypeScript/Vite shell, shared models, validation, local saves, JSON import/export, placeholder routes |
| Alpha Slice 2 Archetype v0.1 | Implemented and verified | All eight Core archetypes create shared-schema characters with provenance, local save, JSON import/export, display, and golden tests |
| Alpha Slice 3 Point Buy v0.1 | Implemented and verified | Normal Human Attribute purchasing plus focused Skill/subskill and Trait purchasing with budget enforcement and provenance |
| Alpha Slice 4 Life Modules v0.1 | Implemented and verified | Stage 0/1 state machine, separate module pool, audited four-entry catalog, concrete awards, pending choices, prerequisite tracking, persistence, and UI |
| Alpha Slice 5 Life Modules v0.2 | Implemented and verified | Pending language, `/Any`, multi-choice, and flexible awards resolve into shared ledgers with durable audit history and prerequisite re-evaluation |
| Alpha Slice 6 Life Modules v0.3 | Implemented and verified | Legal Stage 2 continuation plus audited Back Woods and High School modules, pooled flexible-XP caps, affiliation choices, prerequisites, persistence, validation, and UI |
| Alpha Slice 7 Life Modules v0.4 | Implemented and verified | Legal Stage 3 continuation, Technical College, Technician/Civilian and Technician/Vehicle Fields, calculated cost/time, Field provenance, persistence, validation, and UI |
| Alpha Slice 8 Life Modules v0.5 | Implemented and verified | Legal Stage 4 continuation, Agitator, calculated age 23, pending awards, Attribute flexible cap, repeat metadata, persistence, validation, and UI |
| Alpha Slice 9 Life Modules v0.6 | Implemented and verified | Final-review state, final-allocation pool, threshold-derived values, final prerequisite review, explicit Optimization, modeled opposed-Trait checks, persistence, validation, and UI |
| Alpha Slice 10 Life Modules v0.7 | Implemented and verified | Final Touches descriptions, Wealth-derived starting C-bills, Equipped-derived access limits, manual Owned/Issued inventory, optional Issued Gear, persistence, validation, and UI |
| Alpha Slice 11 Life Modules v0.8 | Implemented and verified | Searchable/filterable 17-item Core starter catalog, catalog purchases, durable source/metadata snapshots, example-backed null ratings, manual fallback, persistence, validation, and UI |
| Alpha Slice 12 Life Modules v0.9 | Implemented and verified | Second 17-item batch, raw/normalized ratings, hand-audited Availability, native/foreign adjustments, Periphery/Clan Tech caps, Issued review, persistence, validation, and UI |
| Alpha Slice 13 Life Modules v0.10 | Implemented and verified | Third 24-record batch, 21 net-new items, three stable-ID medical upgrades, inert rules metadata, persistence, validation, and UI |
| Alpha Slice 14 Life Modules v0.11 | Implemented and verified | Fourth 20-item batch covering communications, remote sensors, power/rechargers, and field gear with inert source-backed metadata |
| Alpha Slice 15 Life Modules v0.12 | Implemented and verified | No new items; hardened stable IDs, categories, sources, ratings, affiliation codes, purchase snapshots, manual fallback, and inert-metadata boundaries across all 75 entries |
| Alpha Slice 16 Life Modules v0.13 | Implemented and verified | No new items; backfilled raw ratings/triplets for 14 legacy Slice 11 records while preserving stable IDs and historical snapshot compatibility |
| Alpha Slice 17 Life Modules v0.14 | Implemented and verified | Added six audited page-299 non-combat attire/leatherwear records with inert BAR, coverage, facing, and penalty metadata; catalog total 81 |
| Alpha Slice 18 Life Modules v0.15 | Implemented and verified | Canonicalized the existing Clan Power Pack stable ID and added three net-new audited page-306 Clan pack records with inert PP/quick-charge metadata; catalog total 84 |
| Alpha Slice 19 Public Alpha deployment foundation | Implemented and verified | Static production readiness, visible Public Alpha/version/local-storage/limitations notices, platform-neutral deployment guidance; no rules, catalog, backend, login, cloud save, or live deployment |
| Alpha Slice 20 Public static host foundation | Implemented and verified | GitHub Pages selected, Actions checks/builds/deploys static `dist/`, and Vite production assets use the project-page base path; no rules, catalog, backend, login, or cloud save changes |
| Alpha Slice 21 deployment verification and text cleanup | Implemented and verified | Live Pages URL verified; public-access wording is platform-neutral; version advanced without rules, catalog, backend, login, or cloud save changes |
| Alpha Slice 22 Archetype foundation accounting | Implemented and verified | Records each selected Core Archetype as a source-backed preset, preserves original provenance, and evaluates its unchanged allocations through shared Point Buy XP accounting |
| Alpha Slice 23 Controlled Archetype adjustments | Reimplemented and verified | Adds provenance-backed, reversible Attribute and existing-Skill adjustments; zero-net XP is required for save/export/progression; recreated from durable Slice 22 after the earlier local commit was lost |
| Alpha Slice 24 Controlled adjustment review and Skill-swap foundation | Implemented and verified | Hardens adjustment validation/export and adds reversible same-XP swaps limited to unambiguous, non-specialty Skill instances already audited in Core Archetypes |
| Alpha Slice 25 Archetype Sheet Cross-Check | Implemented and verified | Audits all eight Core Archetypes against printed pages 52-59 and back-sheet PDF pages 396-403; records conflicts and sheet-only data without changing source packages, rules, or catalog data |
| Alpha Slice 26 Stage 0 affiliation-flow hotfix | Implemented and verified | Universal is explicitly non-affiliation context; Stage 0 context/language choices start empty, must be deliberate, persist through save/import, and migrate from older Alpha saves without changing rules/catalog data |
| Alpha Slice 27 pending-award/progression hotfix | Implemented and verified | Replaces known raw target inputs with safe readable selectors, retains stable IDs internally, reports exact pending blockers, and permits continuation past final-validation-only prerequisite warnings |
| Alpha Slice 28 Archetype Source Governance | Implemented and verified | Prose/package entries govern active Archetype creation values; back sheets remain supplemental evidence, conflicts/variants are preserved, and no active package values or mechanics change |
| Alpha Slice 29 Life Modules affiliation framework | Implemented and verified | Centralizes the current Capellan/Commonality context, selector groups, and Protocol/Streetwise labels; Universal remains non-affiliation and broader affiliation data remains deferred |
| Alpha Slice 30 Life Modules wizard flow review | Implemented and verified | Adds a stage tracker, persistent summary and XP status, focused pending/flexible-award controls, and separate blocker/warning panels without changing rules or catalog data |
| Alpha Slice 31 Stage 0 wizard layout polish | Implemented and verified | Groups Universal affiliation choices in a stable responsive card, preserves full labels and non-affiliation guidance, and separates the apply action without changing mechanics |
| Alpha 0.1.0-alpha.32 Stage 0 label hotfix | Implemented and verified | Shortens both Stage 0 package action labels to `Apply`; no behavior, rules, layout, or data changes |
| Alpha Slice 33 merged Stage 0 wizard flow | Implemented and verified | Removes Universal as a separate progress step and presents the unchanged Universal and Affiliation package phases as two sections inside Stage 0 |
| Alpha Slice 34 Stage 0 baseline and notice polish | Implemented and verified | Includes the Universal baseline at draft creation, keeps context/language explicit, derives the Life Modules badge from the app version, and widens the responsive Public Alpha Notice |
| Alpha Slice 35 Stage 0 UI cleanup | Implemented and verified | Hides the Universal card for normal drafts, focuses Stage 0 on Affiliation, requires an explicit secondary language in the UI, and displays full Attribute sheet values in the summary |
| Alpha Slice 36 unified Stage 0 resolution | Implemented and verified | Keeps specialized Stage 0 language choices in the Affiliation Package, suppresses their generic duplicate, and labels the committing transition `Apply and continue` |
| Alpha Slice 37 Life Modules stage-flow streamlining | Implemented and verified | Gives Stages 1–4 action-focused headings, associates pending work with its stage, adds a Review readiness summary, and collapses audit detail outside Review |
| Alpha Slice 38 Life Modules preview-then-continue flow | Implemented and verified | Previews explicit Stage 0 affiliation/language effects in the sidebar without mutating committed state; `Continue` remains the engine commit and Stage 1 transition |
| Alpha Slice 39 Life Modules compact dashboard layout | Implemented and verified | Places progress, draft controls, sticky character summary, and current-stage work in one responsive dashboard; moves audit material into a secondary drawer |
| Alpha Slice 40 corrective Life Modules dashboard | Implemented and verified | Removes the inherited desktop width bottleneck, adds a true three-pane summary/stage/preview workspace, and keeps Stage 0 Continue above the fold |
| Alpha Slice 41 integrated live preview summary | Implemented and verified | Removes the separate preview rail and makes Character Summary a clearly uncommitted running post-Continue total for selected Stage 0 choices |
| Alpha Slice 42 Character Summary XP cleanup | Implemented and verified | Shows Trait TP with XP and Skill XP, while retaining preview color without repeated row-level Preview text |
| Alpha Slice 43 progressive Stage 0 preview and Capellan theme | Implemented and verified | Shows deterministic effects and pending choice rows from context selection, opens summary sections, and scopes the Liao/Capellan palette to that selected context |
| Alpha Slice 44 public-notice and stage-label cleanup | Implemented and verified | Collapses shared notice details by default and removes duplicate Life Modules stage labels while preserving accessible controls and task headings |
| Alpha Slice 45 Stage 1–4 integrated preview | Implemented and verified | Explicitly selected supported modules preview through their existing engine operations before Continue commits and opens normal award resolution |
| Shared Character/Rules engine | Foundation implemented and exercised | Archetype, Point Buy, and Life Modules use the common representation, ledgers, validation, persistence, and provenance |
| Archetype foundation | Controlled adjustment and bounded Skill-swap foundation implemented | Published packages remain source-faithful foundations; level adjustments and safe same-XP swaps are separate, reversible, provenance-backed, and must balance to 0 XP |
| Point Buy v0.1 | Implemented | Core 5,000-XP default, GM-adjusted allotment recording, Attribute/Skill/Trait costs, negative-Trait ceiling, drafts, persistence, and focused catalogs |
| Life Modules v0.15 | Implemented, deliberately narrow | Existing Stage 0–4 path, final review/Optimization, Final Touches, and 84-item equipment catalog; true finalization and broad catalogs remain deferred |
| Beta 1 milestone | Future | Requires completed Core + Companion character creation and PDF export; not reached by Alpha Slice 45 |
| Playable character sheet | Long-term direction; deferred | Play State should eventually be persistable |
| Planetary Data Foundation research/design | Substantially complete | Supporting infrastructure |
| Planetary Rollout 1 | Not started; separate authorization required | Lossless import through lookup/distance foundation |
| Political Geography | Conceptually designed; not implemented | Rollout 2 |
| AToW nearest-state integration | Unresolved and not authorized | Rollout 3 only after semantics are established |

## Established implementation order

The Character Generator sequence is:

1. Archetype
2. Point Buy
3. Life Modules

These are not independent generators. They must share one character representation and one rules engine. Planetary infrastructure is introduced when appropriate to this sequence and must not become the primary application architecture.

Archetype v0.1 should remain comparatively simple. Extensive Archetype customization that belongs to Point Buy must not be added prematurely.

## Character-state layers

### Character definition

- Attributes and XP
- Traits and XP
- Skills and XP
- identities
- affiliations and history
- phenotype
- Life Module history
- chronology
- equipment and inventory
- C-bills
- vehicles
- creation choices and provenance

### Derived state

- attained Attribute, Trait, and Skill values
- movement
- Standard Damage capacity
- Fatigue capacity
- encumbrance thresholds
- effective statistics
- other calculated values

Base derived values should be calculated rather than redundantly treated as independent authoritative facts where practical. Campaign options such as Companion Hero Mode may change calculations without rewriting the Character Definition.

### Play State

- current Standard damage and Fatigue
- Stunned/Unconscious state
- wounds and injuries
- ammunition
- armor condition/degradation
- equipment condition
- temporary effects/modifiers
- current encumbrance
- current C-bills
- eventual vehicle state

Base derived state and runtime Play State must remain separate.

## UI/UX direction

Life Modules must not be a blind fixed wizard. The UI and rules engine need to distinguish at least:

- legal;
- unavailable;
- prerequisite outstanding;
- source exception applies;
- GM override;
- unresolved rules question.

## Implemented Alpha foundation

The application currently provides:

- a React + TypeScript + Vite browser application and responsive shell;
- working hash-based Archetype, Point Buy, and Life Module routes;
- one shared character factory and Character Definition for all three routes;
- distinct creation-pool, allocated, and earned/unspent gameplay XP fields;
- typed foundations for Attributes, Traits, structured Skills, identities, affiliations, phenotype, equipment, vehicles, chronology, provenance, and future Play State;
- distinct personal-equipment ownership (`Owned`/`Issued`) and vehicle ownership (`Assigned`/`Owned`);
- a rules catalog boundary with stable IDs and Core + Companion source descriptors;
- all eight Core archetype packages with Attributes, Traits, structured Skills and specialties, personal equipment, C-bills, source references, and package notes;
- a shared-engine Archetype mapper that records a source-backed foundation, preserves published values/provenance, and snapshots read-only Attribute/Trait/Skill XP totals through the shared Point Buy accounting model;
- a shared-engine Point Buy workflow with a standard 5,000-XP default, recorded GM-adjusted allotments, eight minimum Normal Human Attributes, remaining/allocated XP reconciliation, overspend prevention, and the Core 10-percent negative-Trait XP ceiling;
- cumulative standard Skill costs for Levels +0 through +10 and an explicit `null` untrained versus Level +0 trained state;
- a focused Point Buy catalog containing Perception, Language subskills, Martial Arts, Small Arms, Technician subskills, Ambidextrous, Patient, Unattractive, and variable Reputation;
- a focused Life Module catalog containing the universal Stage 0 package, Capellan Confederation/Capellan Commonality, Blue Collar and Back Woods at Stage 1, Back Woods and High School at Stage 2, Technical College at Stage 3, and Agitator at Stage 4;
- a Life Module state machine covering universal Stage 0, affiliation selection, Stages 1–4 on the audited minimal branch, explicit Alpha partial stops, and a distinct unsupported-finalization boundary;
- a Life Module purchasing pool separate from statistic ledgers, with module costs unable to be financed by positive or negative awards;
- fixed Attribute, Trait, Skill, structured subskill, and parameterized-Trait awards on the shared ledgers, including partial XP and source provenance;
- durable pending records for unresolved language, `/Affiliation`, `/Any`, multi-choice, fixed-grant flexible, and pooled flexible awards, plus final-validation prerequisite records;
- source-bound resolution records for each applied choice/flexible grant, including concrete destination, XP, source, provenance, and resolution time;
- incremental resolution of language, affiliation, `/Any`, multi-choice, and flexible awards with target restrictions, duplicate-choice prevention, and Stage 2 caps of 35 XP per Skill and 200 XP per Attribute or Trait;
- automatic prerequisite re-evaluation after every resolved grant;
- separate Skill Field definitions and durable Field grants for Technician/Civilian and Technician/Vehicle, including category, prerequisites, component Skills, per-Skill cost and award, chronology, and provenance;
- Technical College cost calculation of 600 base XP plus 120 and 96 XP Field costs, with overlapping Field Skill awards stacking normally and age advancing from 16 to 19;
- Agitator's 900-XP cost, four-year chronology, fixed awards, pending `/Any` and `/Affiliation` awards, 125-XP flexible pool, and 50-XP cap per Attribute;
- durable Stage 4 repeat-policy metadata recording full repeat cost, repeatable Skill/Flexible awards, and first-occurrence-only Attribute/Trait awards without enabling repeat execution;
- a post-Stage-4 `alpha-final-review` state with a final-allocation pool distinct from the unchanged module-purchasing pool;
- explicit final XP allocation to existing Attribute, Trait, and Skill ledgers, with derived fully attained values and re-evaluated prerequisites;
- Life-Modules-only Optimization preview/application that returns excess XP to the final-allocation pool and records durable provenance/history;
- modeled Gregarious/Introvert and Illiterate/Language +4 conflict reporting plus deferred 10-percent negative-Trait purchase-cap metadata;
- a truthful `ready-for-final-touches` state that does not claim equipment completion, final lock, ready-for-play status, PDF export, or Beta 1 completion;
- a Final Touches draft entered only from `ready-for-final-touches`, with physical description, background, homeworld, metric height/weight, hair color, and eye color;
- Wealth-derived starting C-bills kept separate from the unconsumed Wealth Trait, with Owned-item spending and unspent cash retained durably;
- Equipped-derived Tech/Availability/Legality limits kept separate from inventory ownership, defaulting absent Wealth and Equipped Traits to 0 TP;
- manual inventory entries with exactly `Owned` and `Issued` ownership, durable ratings, quantity/cost, affiliation code, notes, location, source, and provenance;
- optional Issued Gear defaulting off, with Issued items costing no C-bills, remaining non-personal property, and requiring explicit enablement;
- an `equipment-draft` / `ready-for-equipment-review` boundary that does not claim catalog completeness, final lock, ready-for-play status, or PDF export;
- a 17-item starter Core equipment catalog spanning weapons, clothing, electronics, power, field gear, and medical items;
- text search plus category and source-status filtering, with quantity and Owned/Issued selection at purchase time;
- purchase-time catalog snapshots preserving stable catalog ID, category, source key/status, rules metadata, cost, ratings, affiliation code, source citation, and provenance;
- historical example-backed Medical Kit, Medipatch, and Stimpatch definitions retained in the Slice 11 batch, with their active stable IDs promoted by Slice 13 to audited page-313 records without rewriting saved purchase snapshots;
- a second 17-item audited batch covering energy/flechette/miscellaneous weapons, weapon accessories, and personal armor;
- exact raw printed rating strings and raw Availability triplets alongside hand-audited normalized Tech/Availability/Legality values;
- catalog validation requiring normalized Tech and Legality to match the raw endpoints and normalized Availability to occur somewhere in the raw triplet, without assuming a universal positional rule;
- durable equipment access profiles recording Inner Sphere/ordinary, Periphery, or Clan category plus the native affiliation code;
- foreign-affiliation Availability/Legality increases, Periphery/Clan Tech-cap adjustments, and separate Inner Sphere E/D/D versus Clan F/D/D Issued limits;
- explicit Stage 1, Stage 2, and minimal Stage 3/4 selection, resolution, prerequisite-review, and valid Alpha partial-stop states without claiming finalization or Beta 1 completion;
- creation-time rules snapshots, optional-rule settings, and narrow GM-exception records;
- a versioned portable character envelope;
- browser-local save/list/load/delete behavior;
- JSON import/export and malformed-file rejection;
- a minimal typed validation-result framework; and
- automated tests for the shared factory, all eight Archetype golden fixtures, schema round-trip, `null` versus Level 0 Skills, local persistence, and structural validation.

All three creation screens use the common catalog → creation → validation → local save → export/import path. The Life Module route additionally exposes current phase, module-pool accounting, selected history, applied awards, unresolved awards, and prerequisite status.

Life Modules v0.15 retains the existing minimal Stage 0–4, final-review, and Final Touches flow and expands the catalog from 81 to 84 items. Slice 18 canonicalizes the existing Power Pack, Clan ID from `core.power.powerPack.clan` to `core.power.clan.powerPack.standard`, preserves its display name and normalized `F/B/A` rating, and adds three net-new audited page-306 Clan pack records. Catalog items and manual entries share Owned/Issued accounting, and version-2 snapshots preserve purchase-time name, cost, category, affiliation, source, ratings, metadata, and notes. PP capacity and quick-charge remain inert metadata and do not create power runtime state.

Alpha Slice 19 changes deployment presentation, not character rules. Version `0.1.0-alpha.19` builds to static files in `dist/` and displays a persistent Public Alpha notice covering browser-local storage, JSON backup/import portability, incomplete rules/equipment/final validation, Core-first scope with Companion later, unavailable PDF export, and the lack of a play-ready guarantee. Public access targets a normal browser URL without a special platform login or application account. No backend, authentication, analytics, external API, server persistence, account, cloud save, rules data, equipment data, or live hosting deployment was added. Account/login/cloud save remains a pre-v1.0 roadmap item.

Alpha Slice 20 selects GitHub Pages for that unchanged Public Alpha. Version `0.1.0-alpha.20` configures production assets for `/BT-Online-Compendium/` while preserving root-based local development. The Pages workflow checks the app, produces static `dist/`, uploads it, and deploys through the `github-pages` environment on `main` pushes or manual dispatch. The target URL is `https://sansd20.github.io/BT-Online-Compendium/`; repository Pages settings must use GitHub Actions. No rules, catalog entries, stable IDs, backend, authentication, application login, analytics, cloud save, or server persistence changed.

Slice 20's local workflow structure, checks, production build, base path, and generated artifact contents are verified.

Alpha Slice 21 verifies the live Pages deployment at `https://sansd20.github.io/BT-Online-Compendium/`. The site loaded at the configured project path with the Public Alpha notice, local-storage warning, visible `0.1.0-alpha.20` version, and no login gate before the Slice 21 update. Version `0.1.0-alpha.21` replaces public-facing platform-specific access language with normal-browser, no-special-platform-login, and no-application-account wording. Rules, catalog data, stable IDs, source references, ratings, backend behavior, authentication, and cloud save remain unchanged; the catalog remains 84 items.

Alpha Slice 22 records each selected Core Archetype as a versioned `source-backed-preset`. The foundation retains the original ID, name, source citation, published provenance reference, package notes, declared XP total, shared-accounting allocation breakdown, and any declared-versus-listed difference. An empty adjustment ledger reserves a durable boundary for later equal-XP customization, but the current UI is read-only and the original package remains unchanged. Older Alpha Archetype JSON imports are migrated into this metadata without rewriting their ledgers. Point Buy-from-scratch, Life Modules, and the 84-item equipment catalog are unchanged.

Alpha Slice 23 was freshly reimplemented from the durable Slice 22 checkpoint after the previous local Slice 23 commit and tree could not be recovered. It activates the separate adjustment ledger for controlled Attribute and existing-Skill level changes. Adjustments preserve foundation references, before/after values, Point Buy XP deltas, player-choice provenance, award links, timestamps, and optional notes. They are reversible, and the original Core definition remains unchanged. Temporary unbalanced editing is allowed in memory, but a nonzero net adjustment blocks save, JSON export, and progression. Slice 22 saves migrate with an empty ledger. Trait adjustments, new-Skill swaps, GM override, unbalanced completion, and remaining campaign buy-up handling remain deferred. Point Buy-from-scratch, Life Modules, rules/catalog data, stable IDs, and the 84-item equipment catalog are unchanged.

Alpha Slice 24 reviews and hardens that ledger and adds a bounded `skill-swap` operation. Replacement choices are derived only from exact Skill instances already present in the eight audited Core Archetype definitions. A source/replacement pair is exposed only when both use standard shared Point Buy XP, their XP and levels match exactly, the replacement is absent from the selected foundation and current swaps, and identity is unambiguous. Required subskills must be explicit; mixed parameterized/unparameterized roots, conflicting labels, specialties, and Field Aptitude/nonstandard-XP instances are blocked. Swap records preserve source and replacement snapshots, source award identity, audited target citation, player-choice provenance, timestamps, and optional notes; removal restores the exact source-backed ledger entry. Balanced but malformed Archetype state is now also blocked from save/export. Full Skill-catalog selection, arbitrary new Skills, specialties, Trait adjustments, GM override, unbalanced completion, and remaining campaign buy-up handling remain deferred. Point Buy-from-scratch, Life Modules, rules/catalog data, stable IDs, and the 84-item equipment catalog are unchanged.

Alpha Slice 25 performs the durable Archetype Sheet Cross-Check in `docs/archetype-sheet-cross-check.md`. All eight implemented packages were compared with both the prose Archetype entries and the prefilled back-of-book sheets. It records 112 grouped findings: 25 MATCH, 44 PARTIAL MATCH, 2 MISMATCH, 22 SHEET ONLY, 8 IMPLEMENTATION ONLY, and 11 NEEDS DECISION; no PROSE ONLY or NEEDS SOURCE EXPANSION findings were identified. The highest-priority conflicts are Tanker's Attribute XP cells and Elemental's Attribute Links. Scout's repeated Equipped 2 TP / 300 XP value, two `REF+DEX` Piloting labels, name capitalization, six non-4,500 line-item totals, and placement of sheet-only derived/combat data remain decisions. No Archetype, rules, equipment, stable-ID, Point Buy, Life Modules, Final Touches, or Skill-swap data changed.

The Core introduction describes the archetypes as 4,500-XP packages, but independently summing the printed Attribute, Trait, and Skill XP produces different totals for several sheets. Corrected Third Printing values are preserved without speculative repair, the declared package total and calculated line-item total remain separate, and each mismatch is recorded as a catalog note. Errata v4.0 does not provide a correction for these sheets.

Alpha Slice 29 establishes the typed, source-governed Life Modules affiliation framework documented in `LIFE-MODULES-AFFILIATION-FRAMEWORK.md`. Universal is explicitly non-affiliation and remains outside the selectable affiliation registry. The existing Capellan Confederation / Capellan Commonality context, three current language selector groups, and current Protocol/Streetwise labels are centralized without changing IDs, award values, persistence fields, or user-facing choices. Unknown contexts are deferred rather than exposed as free text. No broad affiliation data, random name generator, module packages, equipment data, or catalog IDs were added; the catalog remains 84 items.

Alpha Slice 30 completes the bounded Life Modules wizard-flow review. The existing engine phases now drive a modern progress tracker; the active stage shares a two-column workspace with a persistent Character/Attribute/Trait/Skill/module summary; module and stat XP remain visible; pending and flexible awards are placed directly beside the current-stage work; and exact blockers are separated from final-validation-only warnings. Save/export and Back-to-creator actions remain available. No Life Module rules, packages, affiliation data, equipment records, or other creation methods changed.

Alpha Slice 31 completes the focused Stage 0 Universal layout polish. Explanation and non-affiliation guidance precede a stable affiliation-choice card; context and language controls align in two columns at desktop widths and stack on narrow screens; the language control occupies a predictable location before and after context selection; full affiliation text remains available; and the apply action is separated below the choices. No Life Module mechanics, rules data, affiliation data, equipment records, or other creation methods changed.

Alpha Slice 33 merges the existing Universal and Affiliation phases into one top-level Stage 0 wizard presentation. Stage 0 shows both package sections, marks Universal complete before unlocking the existing affiliation action, and advances to Stage 1 through the unchanged engine transition. Universal remains non-affiliation, neither selector receives a silent default, and no rules, award mechanics, saved-data shape, module or affiliation data, random-name behavior, other creation method, or equipment data changed.

Alpha Slice 34 applies the unchanged Universal Fixed Experience Points package when a new Life Modules draft is created. Its fixed awards and 850 XP cost are included immediately, while the affiliation-language award remains pending until the player explicitly chooses a supported context and language in Stage 0. Older `stage-0-universal` saves retain their compatibility path. The Life Modules page badge now derives from the current application version, and the Public Alpha Notice is wider with a responsive two-column desktop list. No broad module or affiliation data, random-name behavior, other creation method, or equipment data changed.

Alpha Slice 35 removes the large Universal card from normal new Stage 0 drafts while preserving it only for legacy `stage-0-universal` compatibility. The tracker subtitle and active workspace now focus on Affiliation. The secondary-language selector uses an instructional placeholder rather than a pending pseudo-language, its Apply action remains separate and is disabled until a listed language is selected, and helper text explains the unresolved state. The Life Modules summary now displays accumulated Attribute sheet values such as 100 instead of normalized purchased levels such as 1. Navigation labels distinguish returning to the creator from undoing choices. No rules, ledger, persistence, module, affiliation, other creation method, or equipment data changed.

Alpha Slice 36 makes the Stage 0 Affiliation Package the single resolution area for its context, affiliation-language, and secondary-language choices. The generic pending-award panel filters only the specialized Universal affiliation-language award during the Stage 0 affiliation phase; later-stage and unsupported awards remain available there. The card lists each missing required choice, shows a ready state when complete, and labels its existing committing transition `Apply and continue`. No engine, rules, award, validation, persistence, other creation method, or equipment behavior changed.

Alpha Slice 37 streamlines Life Modules Stages 1–4 and Review without changing their engines. Each phase now presents its stage name, current user action, and focused instruction before module choices or continuation controls. Generic pending choices are explicitly labeled as work created by the current stage. Review adds a compact modules/pending/warnings/XP summary and keeps broader module, award, resolved-choice, rule, and validation details open; those audit sections are collapsible during normal stage work. Blockers and final-validation warnings retain their distinct established presentation. No rules, progression, XP accounting, persistence, other creation method, or equipment data changed.

Alpha Slice 38 derives a temporary Stage 0 preview from the existing affiliation transition without replacing committed character state. Once all explicit selectors are valid, the sidebar shows the post-Continue module XP and changed full-value Attributes, Traits, and Skills under a visibly unsaved heading. Save/export continue to receive only the committed character, and `Continue` performs the existing engine transition, provenance writes, pending resolution, and Stage 1 advance. Later-stage previews remain deferred. Slice 36 filtering, Slice 37 stage flow, empty selector defaults, rules, progression, persistence schema, other creation methods, and the 84-item equipment catalog are unchanged.

Alpha Slice 39 reorganizes the Life Modules screen into a compact dashboard without changing its behavior. XP status, progress, return/save/export controls, the sticky character summary, and current-stage action occupy the primary desktop region; the summary now identifies the current stage. Audit timelines, applied awards, resolved choices, Skill Fields, and rule/validation details are collected under a secondary drawer that remains closed outside Review. Tablet and mobile layouts stack the toolbar, summary, and stage workspace while retaining a horizontally scrollable tracker and keeping audit content last. The presentation is modern web UI inspired only by compact workflow structure, not an old Windows visual skin. Slice 36–38 resolution, streamlined stage flow, and preview behavior remain intact; save/export still receive committed state only. No rules, data, progression, persistence, other creation methods, or equipment catalog changed.

Alpha Slice 40 corrects the desktop result after visual review showed that Slice 39 still inherited the global 1,120-pixel `main` width and therefore could not materially use a wide viewport. The Life Modules route now supports a 1,760-pixel, 96-viewport-width canvas. Wide screens show character summary, current stage, and visibly unsaved preview as three independent panes; intermediate widths move preview below the stage in a two-pane layout; narrow layouts put current-stage work before summary and preview. Stage 0 Continue moves into the package header so the primary action is visible without reaching the bottom of the package, and preview values use aligned compact rows. No engine, rules, data, save/export, persistence, migration, other creation method, or equipment behavior changed.

Alpha Slice 41 removes Slice 40's separate preview pane and integrates its temporary result into Character Summary. Each explicit Stage 0 selector updates a safe uncommitted-status list immediately. Until all three choices are valid, the committed totals remain visible with a helper explaining that package effects require completion. Once valid, the summary displays the cloned post-Continue state: Module XP, net stat XP, pending count, full-value Attributes, Traits, Skills, and package history, with changed rows and totals marked Preview or After Continue. Save/export continue to receive only the committed character; Continue uses the unchanged engine commit and advance. No migration is required, and no engine, rules, data, persistence, other creation method, or equipment behavior changed.

Alpha Slice 42 makes that integrated summary read as an XP sheet rather than a debug view. Active Traits display attained TP alongside accumulated XP, pending Traits retain any safely known XP, and Skills display accumulated XP instead of level notation such as a dash or `+0`. Preview rows keep the established color/class distinction, but repeated visible Preview badges are removed in favor of the one summary-level not-saved notice. No accounting, engine, save/export, persistence, migration, other creation method, or equipment behavior changed.

Alpha Slice 43 begins the Stage 0 presentation preview on explicit affiliation-context selection. Its cloned projection applies only deterministic Capellan/Commonality package effects and lists unresolved affiliation, Capellan-secondary, and Federated Suns language awards as pending XP rows; explicit choices progressively resolve those rows without mutating committed state. Attributes, Traits, Skills, and Chosen modules open by default, and repeated value-level `After Continue · Preview` labels are removed. The selected Capellan context alone adds a scoped jade/gold Life Modules theme with secondary burgundy accents; clearing or changing that context removes the class and restores the default palette. Continue, save/export, engine rules, accounting, persistence, and equipment remain unchanged.

Alpha Slice 44 reduces presentation clutter without changing behavior. The shared Public Alpha Notice now uses a collapsed-by-default native disclosure; its heading, version, concise warning, and control remain visible, and expansion restores the unchanged detailed paragraph and two-column desktop list. The Life Modules tracker is now the sole repeated stage indicator: Character Summary no longer includes a Current stage row, and the workspace heading no longer repeats the all-caps stage kicker. Task headings remain semantic and visible. Slice 43 preview/theme behavior, Continue, save/export, rules, accounting, persistence, and equipment remain unchanged.

Alpha Slice 45 extends the integrated preview pattern to all currently supported Stage 1–4 selections without adding module data. Selecting Blue Collar, either Back Woods module, High School, the displayed Technical College path, or Agitator invokes its existing engine operation against committed state and shows the returned clone as an uncommitted running total. Deterministic effects, full Attributes, Trait TP/XP, Skill XP, module history, pending/flexible awards, and preview warnings are visible before Continue. Continue invokes the same dispatcher against committed state and enters the existing resolution phase; pending awards still block stage advancement until resolved. Save/export remain committed-only, no migration is required, and Stage 0/theme/notice behavior is unchanged.

Alpha Slice 46 turns those Stage 1–4 pending awards into same-page choice slots. Fixed multi-grant awards display one labeled slot per grant, while variable flexible pools use explicit destination/amount allocation slots that can be added without committing. Filling a slot replays the existing resolver against the cloned module preview, keeps the selected card active, and updates Character Summary. Normal slot workflow has no per-grant Apply button; Continue remains disabled until the selected module's slots are complete, then commits the fully resolved module clone and advances according to existing progression. The generic pending resolver remains as a compatibility and unsupported-award fallback. Save/export, persisted shape, Stage 0, Capellan theming, module data, award values, and the 84-item equipment catalog remain unchanged.

Alpha Slice 47 fixes the combined-workflow visibility gap from Slice 46. If committed pending awards already exist when a Stage 1–4 module is previewed, they remain visible and resolvable in a separately labeled `Existing pending choices` section above the module's slots. Resolving one of those earlier awards intentionally retains the selected module and every local slot value, while resolving a module slot never hides the earlier section. Continue requires both sets to be complete. Rules, award data, progression, save/export, persisted shape, Stage 0, Capellan theming, and equipment remain unchanged.

Alpha Slice 48 improves flexible-XP slot usability without changing rules. Each flexible pool reports assigned and remaining XP live, or its over-limit amount. Known Attribute, Trait, Skill, subskill, and language destinations selected in one slot are filtered from sibling slots in that same award group, remain visible in their own slot, and become available again when changed or cleared. Filtering does not cross award groups. Selected-module preview, existing pending choices, Continue gating and commit behavior, committed-only save/export, Stage 0 progressive preview, Capellan theming, persisted data, and the 84-item equipment catalog remain unchanged; no migration is required.

Alpha Slice 49 converts supported existing pending awards displayed inside an active Stage 1–4 module workspace into local slot selections. The old per-grant Apply control is absent from this normal path. The module, earlier choices, and module-local slots are resolved on one clone through existing engine operations and replace committed state only through Continue after all are complete. Save/export therefore remain committed-only. The generic resolver remains available outside the slot transaction and for legacy or unsupported fallback awards. Rules, award values, XP accounting, progression, persistence, Stage 0, Capellan theming, Slice 48 filtering/progress, and the 84-item equipment catalog remain unchanged; no migration is required.

## Current audit checkpoint

The Core + Companion character-system reconciliation has established durable findings for:

- construction and final validation;
- Final Touches;
- starting equipment and optional Issued Gear;
- inventory and combat loadout;
- Vehicle and Custom Vehicle;
- alternate identities and identity-bound Traits;
- Wealth versus C-bills;
- advancement and post-creation modification;
- Edge;
- damage, healing, and permanent injury;
- implants and prosthetics;
- Skills, subskills, specialties, and Skill Fields;
- Special Pilot Abilities;
- GM arbitration and override architecture.

The next rules-audit target is **Campaign / Rules Configuration reconciliation**. That audit will distinguish durable character state, current campaign rules, creation-rules snapshot/provenance, and per-character GM exceptions. This documentation update does not perform that reconciliation.

## Resume points

Audit resume point: **Campaign / Rules Configuration reconciliation.**

Character Generator resume point: **Alpha Slice 26 — Archetype Source Governance**, contingent on explicit user decisions for the Slice 25 findings. Do not silently select prose, back-sheet, or calculated values. Archetype Final Touches handoff remains a separate future candidate. Do not add full Skill-catalog selection, arbitrary new Skills, specialties, Trait adjustments, GM override, unbalanced completion, campaign buy-up handling, rules/catalog content, or equipment data without separate authorization.

Planetary Rollout 1 remains a separate future authorization. Do not automatically proceed from a queued or documented rollout.
