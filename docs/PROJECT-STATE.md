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

Alpha Slice 51 fixes integrated-slot status synchronization by deriving blocker rows and Continue eligibility from the same current preview result. A complete legal High School allocation of 185 flexible XP now reports zero remaining, removes the flexible blocker, and enables Continue when its other slots are complete. The normal integrated workflow hides `Resolve pending awards`; the generic resolver remains for genuine fallback contexts. Redundant visible `Selected: …` echoes are removed without removing native select labels, descriptions, focus, or selected-option state. Slice 50 accessibility behavior, committed-only save/export, rules, XP accounting, persistence, and the 84-item equipment catalog remain unchanged; no migration is required.

Alpha Slice 52 adds an optional Master Skill Field goal as durable Life Modules guidance state. The bounded supported subset is Basic Training, Technician/Civilian, and Technician/Vehicle. Derived status distinguishes Attributes, Traits, component Skills, and prerequisite Fields; contribution markers explain only currently useful fixed module awards; Review lists goal gaps before ordinary Optimization and routes legal existing-stat funding through final allocation. Goal selection never grants training or changes rules. The source-backed Federated Suns / Crucis March Stage 0 path is also supported, with explicit English/French/German/Hindi/Russian language selection, Natural Aptitude choice, and Art/Painting choice. Its scoped Davion theme uses only `#202B22`, `#2B3829`, `#687962`, `#D7B66A`, and `#A7C979`; Capellan behavior remains separate.

Alpha Slice 53 corrects Slice 52's catalog coupling. The goal/reference catalog now contains all 56 published Master Skill Fields from corrected-printing pp. 92–95, including MechWarrior, with prerequisites and Field Skills presented separately and source-defined variable choices preserved. The mechanically acquirable catalog remains limited to Basic Training, Technician/Civilian, and Technician/Vehicle; choosing any reference goal remains inert guidance. Existing final-allocation logic may fund only legal, already modeled destinations, while Field, affiliation, phenotype, alternative, and unresolved `/Any` requirements remain informational. Slice 52's Davion and Capellan presentation behavior is unchanged.

Alpha Slice 58 makes prerequisite Fields in that same 56-entry reference catalog inspectable through native, nested, cycle-safe disclosures. Infantry - Anti-Mech exposes Infantry and Infantry exposes Basic Training; other Field chains use the same generic model. Prerequisites and Field Skills remain separate, component Skills do not satisfy Field acquisition, unresolved `/Any` choices stay variable, and Review offers no XP control for structural Field gaps. Capellan and Federated Suns affiliation themes now consume the provisional government/faction `UI_ADAPTATION` roles from `SANSd20/battletech-faction-colors` commit `f5ce62194c57e28d3d8a7a31d69b01f901c0672f`. AToW maps those shared identity roles into its local panel, border, emphasis, success, and selected-state semantics; it does not use military palettes or describe the exact hex values as official BattleTech colors. Future affiliation themes must consume an existing shared reusable palette when available, and conflicting evidence must return to the shared authority rather than creating a competing AToW palette.

Alpha Slice 59 expands the mechanically acquirable catalog from three to eight source-audited Fields without merging it into the 56-entry reference catalog. Technical College now offers its existing Technician/Civilian and Technician/Vehicle options plus Pilot/Exoskeleton, Cartographer, Pilot/IndustrialMech, Technician/Aerospace, and Technician/Mech. All use the corrected-printing Stage 3 rate of +30 XP per Field Skill for 24 XP, retain school category/year rules, and track Attribute and actually acquired Field prerequisites. The Stage 3 selector exposes available and unavailable prerequisite status, previews the selected transaction, and commits only through Continue. Infantry remains guidance-only because no Military Academy or Military Enlistment module is implemented; MechWarrior has that same school blocker plus an unresolved Technician/Any Field-Skill choice. Broad arbitrary `/Any` selection and military-school expansion remain deferred.

Alpha Slice 60 adds the corrected-printing Military Academy and Military Enlistment as distinct Stage 3 schools using the existing Field-selection, preview, Continue, blocker, and persistence architecture. Academy costs 830 XP plus Fields, applies its fixed awards and its conditional no-Prep-School/no-Military-School entry adjustment, and gives Basic/Advanced training one year each. Enlistment costs 720 XP plus Fields, applies its fixed awards, and gives Basic training 0.5 years and Advanced training 1.5 years. Both currently offer mechanically complete Basic Training and Infantry; Infantry becomes the ninth mechanically acquirable Field and requires an actually acquired Basic Training Field. The full school Field lists are retained as reference-only choices with reasons. MechWarrior's schooling blocker is removed, but it remains non-purchasable because Technician/Any still requires an explicit destination. No faction palette, equipment, reference-catalog, save/export, or commit-boundary behavior changes.

Alpha Slice 61 adds a bounded variable Field-Skill choice representation and makes MechWarrior the tenth mechanically acquirable Field through Military Academy. Technician/Any is an explicit no-default integrated choice using the canonical Technician subskill catalog; preview replacement is transactional, Continue remains the sole commit point, and the selected concrete Skill is stored on the durable Field grant for validation and JSON round trips. MechWarrior retains actual Basic Training, DEX 4+, and RFL 4+ prerequisites, five +30-XP Skills, a calculated 120-XP Field cost, and one year. Compact Life Module Trait summaries render the stored rating beside the complete Trait name and reserve the right-hand value for XP, while unresolved Traits remain visibly pending.

Alpha Slice 62 expands the mechanical Field catalog from ten to fourteen entries. Basic Training (Naval) supplies the source-required foundation for Marine and Ship’s Crew and preserves its explicit Career/Pilot-or-Ship’s-Crew choice; Marine’s Security Systems/Any choice is bounded to Electronic or Mechanical, while Ship’s Crew reuses the canonical eight-option Technician selector. Technician/Military is fixed and available only through the currently implemented source-authorized Military Enlistment. Academy and Enlistment retain their different Basic and Advanced training times. Cavalry remains reference-only because its restricted Gunnery/Any Vehicle mapping is not yet governed; Scout remains reference-only because its four variable Skills include unrestricted Language/Any and affiliation-sensitive Streetwise/Any. The Stage 3 audit finds repeat execution wholly unsupported rather than permissive: the UI cannot currently repeat any Stage 3 school, so illegal same-general-type repetition cannot occur, but legal cross-type repetition is also deferred. The source’s three general school groups and Officer Training’s secondary status are represented and regression-tested without adding unrelated schools.

Alpha Slice 63 expands the mechanical Field catalog from fourteen to fifteen entries by promoting Cavalry through both source-authorized military schools. Cavalry requires an actually acquired Basic Training Field and DEX 3+, grants three fixed Skills plus explicit no-default choices from the canonical Driving, vehicle Gunnery, and Land-or-Sea Tactics subskills, costs 144 XP, and takes one Academy year or 1.5 Enlistment years. The three variable Skills are separately listed by the source and have no stated linked-profile rule. Scout remains reference-only: Security Systems/Any and Tracking/Any have bounded canonical lists, Streetwise/Any is affiliation-typed, but Language/Any permits any specific language and the project has no complete governed general-language catalog. Stage 3 repetition behavior, persistence boundaries, faction palettes, and equipment remain unchanged.

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

## Alpha Slice 64 checkpoint

Alpha Slice 64 expands the mechanically acquirable Skill Field catalog from fifteen to sixteen entries by promoting Scout through Military Academy and Military Enlistment. The corrected rules define each concrete language as a Language subskill and permit any specific language, but do not publish an exhaustive language catalog. The application therefore centralizes the ten concrete languages already backed by its current affiliation and archetype character-creation data as an explicitly modeled safe subset: Cantonese, English, French, German, Hindi, Japanese, Mandarin Chinese, Romanian, Russian, and Vietnamese. The legacy Mandarin spelling is normalized to Mandarin Chinese; affiliation-specific selectors retain their narrower source-backed option sets.

Scout requires an actually acquired Basic Training Field, INT 4+, WIL 3+, and absence of Illiterate. Its seven Field Skills are Comms/Conventional, Disguise, Language/Any, Security Systems/Any, Stealth, Streetwise/Any, and Tracking/Any. The four variable choices begin unset and use governed modeled-language, Electronic-or-Mechanical Security Systems, Capellan-or-FedSuns Streetwise, and Urban-or-Wilds Tracking destinations. Scout costs 168 XP, awards +30 XP to every fixed or resolved Skill, and takes one Military Academy year or 1.5 Military Enlistment years. Preview replacement, deselection cleanup, Continue-only commit, and JSON persistence use the existing durable Field-choice architecture. Arbitrary or GM-defined language entry and cross-family Stage 3 repetition remain deferred.

## Alpha Slice 65 checkpoint

Alpha Slice 65 replaces the blanket Stage 3 repeat prohibition with the corrected general-family rule. One canonical stable-ID classification covers Civilian, Intelligence/Police, Military, and secondary Officer Training; all engine, validation, persistence derivation, and UI eligibility consume that authority. A completed school blocks itself and every other school in its family, while an unused family remains eligible. The current implemented Technical College and Military Academy/Enlistment paths therefore support a real Civilian↔Military journey, but no placeholder Intelligence/Police or Officer Training option is introduced. At each resolved Stage 3 stop the player may either choose another implemented unused family or proceed directly to Stage 4.

Committed module history remains the durable authority for used families, so Slice 64 saves need no schema migration. Each added school previews independently and commits its module, Fields, choices, awards, costs, and time together through Continue. Earlier Fields and awards remain committed and are neither recomputed nor reapplied; module XP and Stage 3 chronology accumulate; prerequisite evaluation continues across the complete character state. Same-school and Military Academy↔Military Enlistment reuse remain illegal with an explicit family reason. The 56-entry reference catalog, 16-entry mechanical Field catalog, governed language data, Trait presentation, faction themes, and 84-item equipment catalog remain unchanged.

## Alpha Slice 66 checkpoint

Alpha Slice 66 implements Police Academy and Intelligence Operative Training as distinct source-defined schools sharing the canonical Intelligence/Police Stage 3 family. Police Academy carries its exact 680-XP base package and no entry prerequisite. Intelligence Operative Training carries its exact 760-XP base package plus durable INT 4+, WIL 5+, and Connections +2 prerequisite tracking. Both reuse the established integrated preview, pending-choice, Flexible XP, Field selection, Continue, summary, family-governance, chronology, and persistence transaction.

Police Officer, Detective, and Intelligence expand the mechanically acquirable Field catalog from 16 to 19. Their governed variable components begin unset; Streetwise/Affiliation resolves automatically from the committed Stage 0 context; and the exact Detective/Intelligence alternative prerequisite requires WIL 4, INT 3, and either INT 4 or an actually acquired Police Officer Field. Existing Basic Training, Scout, and Technician Fields are reused rather than duplicated. Unsupported source Fields remain visible as reference-only with specific dependency reasons.

The Intelligence/Police family is consumed by either implemented school, so Police Academy and Intelligence Operative Training reject one another in either order through the shared family rule. Civilian↔Intelligence/Police and Military↔Intelligence/Police remain potentially available subject to ordinary prerequisites and Field uniqueness. A three-family history accumulates module XP and Field time and leaves Stage 4 continuation optional. Committed history remains the family authority after JSON round trip, and no persistence migration is introduced. Officer Candidate School remains deferred as a secondary path outside the normal family count.

## Alpha Slice 67 checkpoint

Alpha Slice 67 implements Officer Candidate School through the existing Stage 3 transaction. OCS is a secondary school under its established stable module ID, requires a prior Intelligence/Police or Military school history containing at least one Basic and one Advanced Field, rejects a prior Civilian history at entry, remains optional, and does not add or consume a normal family. Normal same-family blocking therefore remains intact before and after OCS, while a source-legal unused family remains available afterward.

## Alpha Slice 68 checkpoint

Alpha Slice 68 centralizes bounded variable-Skill governance and promotes Communications, Engineer, Merchant Marine, Pilot - Aircraft (Civilian), Medical Assistant, Doctor, Analysis, Covert Operations, Police Tactical Officer, and Military Scientist. Closed canonical domains, named source option sets, the existing modeled language subset, and affiliation-derived Protocol/Streetwise choices remain explicit and have no defaults. The mechanical catalog is 30; the independent reference catalog remains 56 and the equipment catalog remains 84. The exhaustive decision record is `docs/STAGE3-FIELD-DEPENDENCY-AUDIT.md`.

## Alpha Slice 69 checkpoint

Alpha Slice 69 adds one reusable validated subject-entry mechanism for source-open Career, Interest, Science, and Survival choices. It fixes the parent Skill, normalizes whitespace deterministically, preserves meaningful case/punctuation, rejects unsafe identity separators/control characters and excessive length, merges case-insensitively with existing concrete Skills, and retains Continue as the only commit boundary. Scientist and Special Forces are promoted through their exact existing school offers, raising the mechanical catalog from 30 to 32. Reference Fields remain 56 and equipment remains 84. Source semantics and input policy are recorded in `docs/OPEN-SKILL-SUBJECT-AUDIT.md`.

## Alpha Slice 70 checkpoint

Alpha Slice 70 audits the four remaining normal schools and selects University as the smallest coherent expansion. University joins the Civilian family with its exact 710-XP base package, INT 4+ prerequisite, conditional entry adjustment, fixed awards, explicit open Interest subject, affiliation-bound Protocol, one +50 Attribute choice, 220 flexible XP, and source categories/times. Manager, Planetary Surveyor, and Politician become canonical mechanical Fields; Planetary Surveyor uses a closed Driving choice and Slice 69 open Survival subject. General Studies, Anthropologist, Archaeologist, HPG Technician, and Lawyer remain visible reference-only University offers with exact blockers. Preview, Continue-only commit, cross-family rules, OCS, persistence, and backward-compatible save shape are unchanged. Reference Fields remain 56, mechanical Fields increase from 32 to 35, and equipment remains 84.

## Alpha Slice 71 checkpoint

Alpha Slice 71 resolves General Studies' structural prerequisite as a GM-arbitrated selection of one concrete Skill already possessed before University preview. The selected canonical Skill is durable prerequisite provenance, grants no XP, creates no Skill, begins unset, replaces cleanly in preview, and remains subject to GM approval. General Studies, Anthropologist, Archaeologist, and Lawyer become mechanical University Fields with exact prerequisites, governed variable Skills, +30 XP per Field Skill, and source costs/times. HPG Technician remains reference-only. Existing saves require no migration. Reference Fields remain 56, mechanical Fields increase from 35 to 39, and equipment remains 84.

## Alpha Slice 72 checkpoint

Alpha Slice 72 implements Trade School in the Civilian Stage 3 family with the exact 560-XP base package, non-INT +100 Attribute choice, Connections +50, Equipped +100, three distinct governed +20 XP Skill choices, and unrestricted 200 flexible XP. The Skill choices reuse closed domains, affiliation-derived domains, and Slice 69 open-subject validation; their visible universe is explicitly the currently modeled governed subset. Merchant and Journalist become mechanical canonical Fields at 144 XP each. General Studies and all other dependency-ready Trade School offers are reused without duplication; HPG Technician remains reference-only. Preview remains transactional and Continue remains the only commit boundary. Reference Fields remain 56, mechanical Fields increase from 39 to 41, and equipment remains 84.

## Alpha Slice 73 checkpoint

Alpha Slice 73 implements Family Training as a Military Stage 3 school. One reusable `any-of` prerequisite preserves the exact alternatives: committed Preparatory/Military School history or Connections +1 at final validation. The existing optional durable homeworld field is reused rather than duplicated; Family Training requires an explicit named planet during transactional preview and commits it only with Continue. Homeworld History resolves to the concrete Interest destination for that planet and accumulates into an existing matching Skill.

Family Training reuses governed Driving, open Survival, affiliation-bound Protocol, flexible-XP, canonical Field, family, persistence, and OCS machinery. No new Field is promoted: reference Fields remain 56, mechanical Fields remain 41, and equipment remains 84 unique records. Solaris Internship remains deferred.

## Alpha Slice 74 checkpoint

Alpha Slice 74 implements Solaris Internship as the fourth Civilian Stage 3 school. A new optional `personalDescription.residence` preserves the source's distinct Solaris VII residency fact without reinterpreting homeworld or affiliation and remains backward-compatible for older saves. Connections uses attained TP and remains a final-validation prerequisite. Required Attribute, Equipped-or-Vehicle, Streetwise, and flexible-XP choices begin unset and share the existing transactional preview/Continue flow.

All dependency-ready Solaris Fields reuse canonical definitions and two-year timing. Cavalry and MechWarrior grants carry exact acquisition-specific Basic Training waiver provenance and report `waived` only for those Field prerequisite issues; no Field, Attribute, Trait, or Skill is fabricated. Pilot/Battle Armor remains reference-only because its Field mechanics are unavailable. Solaris consumes the Civilian family, does not qualify for OCS, and leaves Military and Intelligence/Police families available. Reference Fields remain 56, mechanical Fields remain 41, and equipment remains 84 unique stable IDs.

## Alpha Slice 75 checkpoint

Alpha Slice 75 promotes Pilot/Battle Armor as the forty-second mechanical Field. Its Infantry, STR 6+, and BOD 5+ prerequisites, six fixed +30-XP Skills, 144-XP cost, and exact Solaris Internship, Military Academy, and Family Training categories/times are canonical. Solaris alone records an acquisition-specific waiver of the Infantry Field prerequisite; it does not grant Infantry, bypass Attributes, or leak to other schools or Fields. Preview, deselection, Continue-only commit, save/export isolation, stable IDs, family rules, OCS, and faction themes remain unchanged. The refreshed dependency audit classifies all fourteen remaining reference-only Fields and recommends Pilot - DropShip as the next bounded target. Reference Fields remain 56; mechanical Fields are 42; equipment remains 84 unique stable IDs.

## Alpha Slice 76 checkpoint

Alpha Slice 76 promotes Pilot/DropShip, Pilot/JumpShip, and Pilot/WarShip as the forty-third through forty-fifth mechanical Fields. DropShip's exact DEX/INT/WIL and no-TDS prerequisites, JumpShip's direct DropShip/INT/no-TDS prerequisites, and WarShip's direct DropShip/DEX/INT/no-TDS prerequisites are enforced. Each Field uses its corrected source Skill list, cost, awards, school categories, and time. Same-school dependency satisfaction is transactional: the complete staged selection is evaluated together and commits only on Continue. The v4.0 WarShip correction is already present in the Corrected Third Printing and is implemented only at Military Academy. Eleven reference-only Fields remain; Infantry - Anti-Mech is the recommended next bounded target. Reference Fields remain 56; mechanical Fields are 45; equipment remains 84 unique stable IDs.

## Alpha Slice 77 checkpoint

Alpha Slice 77 promotes Infantry/Anti-Mech as the forty-sixth mechanical Field. It requires the actual Infantry Field and WIL 5+, costs 144 XP, and grants +30 XP to each of its six fixed Skills. Military Academy and Family Training offer it as Special for two years; Military Enlistment offers it as Special for one year. Same-school Infantry satisfies the Field prerequisite because the complete selection is one transaction; component Skills and a Field goal do not substitute. Tactical Anti-'Mech attack rules remain outside character-creation Field acquisition. Ten reference-only Fields remain. Reference Fields remain 56; equipment remains 84 unique stable IDs.

## Alpha Slice 78 checkpoint

Alpha Slice 78 promotes Pilot/Aerospace (Civilian), Pilot/Aerospace (Combat), and Pilot/Aircraft (Combat) as the forty-seventh through forty-ninth mechanical Fields. Civilian Aerospace is a six-Skill, 144-XP Technical College Basic Field taking one year and requires DEX 3+, RFL 4+, and INT 3+. Combat Aerospace is a seven-Skill, 168-XP Advanced Field; Combat Aircraft is a five-Skill, 120-XP Advanced Field. Both combat Fields require Basic Training or Basic Training (Naval), plus their exact DEX/RFL thresholds, and are offered by Military Academy for one year and Family Training for 1.5 years. None of the three has a TDS restriction. The combat Fields do not depend on a Civilian pilot Field. Seven affiliation/Clan-blocked reference-only Fields remain. Reference Fields remain 56; equipment remains 84 unique stable IDs.

OCS carries its exact 550-XP base package, 115 flexible XP, and required one-year Officer Field. Officer adds the five source Skills for 120 XP and expands the mechanical Field catalog from 19 to 20. Basic Training or Basic Training (Naval) and Rank O1 (+4 TP) remain durable final prerequisites; fixed OCS Rank XP and player-directed flexible XP can satisfy Rank without a silent default. Preview, cancellation, Continue-only commit, chronology, save/export, validation, and JSON round trips reuse the existing architecture without a persistence migration. The reference catalog remains 56 and equipment remains 84 unique records.
## Alpha Slice 79 checkpoint

Alpha Slice 79 adds an optional ComStar/Word of Blake Stage 0 layer while preserving the normal birth affiliation and its complete cost/effects. The desktop UI separates Affiliation, Affiliation Language, and Affiliation Sub while retaining the existing combined stable IDs, and places the No/ComStar/Word of Blake order selector alongside them with responsive stacking. Order packages use explicit governed nearest-state, language, and Technician choices, enforce Extra Income/Property conflicts, preview transactionally, commit only through Continue, round-trip without duplicate awards, and decode old saves as No. Downstream exact-affiliation predicates recognize committed order identities. HPG Technician remains reference-only pending its own bounded Field/school implementation. Reference Fields remain 56, mechanical Fields remain 49, and equipment remains 84 unique stable IDs.

## Alpha Slice 80 checkpoint

Alpha Slice 80 corrects Stage 0 so sub-affiliation is optional. New selections default to the legal `No` value, retain the main affiliation's full module cost/effects and main choices, and omit all sub-specific effects and choices. Concrete sub-affiliations continue using their stable combined context IDs; older saves without the new explicit selection field retain their prior sub-affiliation. The desktop layout now places the full-width Affiliation selector above Language/Sub in the larger left region, with the independent ComStar/Word of Blake area on the right and accessible responsive stacking. Reference Fields remain 56, mechanical Fields remain 49, and equipment remains 84 unique stable IDs.

## Alpha Slice 81 checkpoint

Alpha Slice 81 promotes HPG Technician through Trade School and University as an Advanced two-year Field. It requires the actual Communications Field and one of the exact committed ComStar, Word of Blake, or Clan affiliations; ComStar and Word of Blake order affiliations qualify independently of optional birth sub-affiliation, while Clan remains source-valid but unavailable. The corrected source lists five Skills—Administration, Comms/Conventional, Comms/HPG, Computers, and Cryptography—so the reduced cost is 120 XP with +30 XP per Skill. Same-transaction Communications acquisition uses the established staged-Field prerequisite semantics. Reference Fields remain 56, mechanical Fields increase to 50, the six remaining reference-only Fields are Clan Fields, and equipment remains 84 unique stable IDs. The ComStar/Word of Blake Service module remains deferred.

## Alpha Slice 82 checkpoint

Alpha Slice 82 changes presentation without closing the source-open Career, Interest, Science, and Survival domains. Open awards now offer existing character subjects and safe modeled subjects first, with Other… revealing the existing normalized and validated custom-subject input; closed domains remain dropdown-only. Broad Skill awards use direct Skill destination selection, and Blue Collar’s four +10-XP slots are presented as compact Skill selectors without exposing the generic target-type editor. The durable destination, XP, provenance, persistence, preview, and Continue models remain unchanged. Stage 0 contextualizes the already-pending Universal affiliation-language award before resolution, fixing the stale Federated Suns/French blocker without bypassing safe-choice validation. A nearest-state Order language is intentionally recorded as a concrete 0-XP Skill award because it establishes the required secondary-language identity without inventing XP; it merges normally with XP from other packages.

## Alpha Slice 83 checkpoint

Alpha Slice 83 refines the Slice 82 choice presentation without changing its rules model. Open-subject and broad Skill choices render as compact vertical cards with the choice name, XP, and pending state together in the header. Parent selectors, governed subskills, Other… custom-subject inputs, help, and validation stack locally below that header. Known-subject selections do not reserve empty custom-input space, multiple slots remain distinct, and the layout collapses naturally at narrow widths. Award semantics, open/closed governance, XP, provenance, persistence, preview replacement, the Continue boundary, and the Slice 82 Stage 0 language fix remain unchanged.

## Alpha Slice 84 checkpoint

Alpha Slice 84 implements ComStar/Word of Blake Service through the existing Stage 4 transaction. The corrected-printing p. 85 module costs 900 XP, adds five years, requires committed ComStar or Word of Blake affiliation, and limits Lost Limb, Poor Hearing, Poor Vision, and TDS to their lowest possible level. Shared and affiliation-specific Attribute, Trait, and Skill awards are branch-isolated; Equipped/Vehicle/Wealth, Communications, Language, Protocol, Technician, four distinct +40-XP Skills, and the 50-XP flexible pool use existing governed choice controls. Protocol/Affiliation follows the committed Order identity. If Fields are possessed, the four Skill destinations derive only from Skills awarded by those acquired Fields; otherwise the governed any-Skill fallback applies. Repeated Service charges full cost and time, repeats Skill and Flexible XP awards, and does not repeat Attribute or Trait awards. Alternative Covert Operations, To Serve and Protect, and Tour of Duty choices remain deferred. Reference Fields remain 56, mechanical Fields remain 50, and equipment remains 84 unique stable IDs.

## Alpha Slice 85 checkpoint

Alpha Slice 85 audits the corrected-printing final character-creation rules on pp. 95–99 and records the source sequence in `docs/LIFE-MODULE-FINALIZATION-AUDIT.md`. Final review now distinguishes attained levels and requirements, opposed-Trait cancellation, Optimization, final XP improvements, the optional additional-XP rule, and final validation. Standard, Fast Learner, and Slow Learner thresholds are modeled through Skill level 10; the printed opposed-Trait pairs and Illiterate exception resolve explicitly with durable adjustment provenance; Optimization returns excess XP without rewriting Life Module history; and final improvements enforce the currently modeled Attribute and Skill maxima. Optional negative-Trait XP execution, new-statistic purchasing, specialties, exhaustive Trait/Phenotype rules, and ready-for-play locking remain deferred. Reference Fields remain 56, mechanical Fields remain 50, and equipment remains 84 unique stable IDs.

## Alpha Slice 86 checkpoint

Alpha Slice 86 gives a canonical committed or Stage 0 preview ComStar/Word of Blake Order affiliation global visual priority over the birth affiliation. The synchronized `PROVISIONAL` `UI_ADAPTATION` palettes come from `SANSd20/battletech-faction-colors` government UI authority at commit `8fb1dde0e10c2f455fef7d822b6bd6e2ae43d760`; exact provenance and roles are recorded in `docs/ORDER-AFFILIATION-THEME-AUDIT.md`. Order surfaces remain dark and readable, while a compact, accessible identity marker retains the birth affiliation as a subordinate border/label. No-order behavior is unchanged. Theme state is derived from canonical affiliation data during preview, committed later stages, and save/import; no presentation state or persistence migration is added. Reference Fields remain 56, mechanical Fields remain 50, and equipment remains 84 unique stable IDs.

## Alpha Slice 87 checkpoint

Alpha Slice 87 adds a generic required-control status model documented in `docs/CONTROL-STATUS-AUDIT.md`. Enabled required unresolved or invalid controls receive semantic invalid state and one shared accessible error border; disabled prerequisites and empty optional controls do not. The most specific child control is responsible, including custom `Other…` subjects, governed subskills, direct Skill/Field choices, Flexible XP, Stage 4, and modeled final allocation. Existing blocker text and validation remain, focus and error cues coexist, and resolving a control restores its active neutral, birth-affiliation, or Order-theme border. Rules, persistence, provenance, and transaction boundaries are unchanged. Reference Fields remain 56, mechanical Fields remain 50, and equipment remains 84 unique stable IDs.

## Alpha Slice 88 checkpoint

Alpha Slice 88 refines the shared control status model: required-but-unresolved uses an unobtrusive 1px `#512525` border and `aria-required`, while genuinely invalid entered values retain the stronger error treatment and `aria-invalid`. Empty `Other…` custom subjects are required-unresolved; malformed non-empty subjects are invalid. Focus remains independent and resolution restores the current neutral, birth-affiliation, or Order-theme border. A generic mapped-ID filter removes only blocker rows already owned by visible concrete controls; non-mappable and mixed-set blockers remain section-level. Stage 0 no longer repeats its control-level requirements in the former large panel. Reference Fields remain 56, mechanical Fields remain 50, and equipment remains 84 unique stable IDs.
## Alpha Slice 90 checkpoint

Optional Additional Experience Points are now available in Life Module final review after Optimization. Governed negative Traits may be added or enhanced at fully attained legal negative TP levels, subject to an aggregate 10% cap of the original design allotment. Transactions are reversible, provenance-backed, persistence-safe, and feed the ordinary finalization Pool. Unsupported Trait metadata remains blocked. Required-unresolved controls use the refined generic `#9B5555` 1px border; invalid and theme-aware focus semantics remain separate. Reference Fields remain 56, Mechanical Fields 50, and equipment remains 84 unique stable IDs.

## Alpha Slice 91 checkpoint

Life Module catalog selection is now dropdown-first for Stage 1 Early Childhood, Stage 2 Late Childhood, Stage 3 Higher Education schools, and Stage 4 Real Life. The selected item alone opens its detail and choice area; existing preview/Continue transaction boundaries, chronology, prerequisites, flexible XP, Field selection, OCS, and repeat behavior remain engine-backed. A reusable availability policy distinguishes available, ineligible, and unsupported entries, keeps unsupported entries visible in Public Alpha, and supports future production hiding without changing catalog identity or rules. Required selectors retain the generic `#9B5555` treatment and theme-aware focus.

## Alpha Slice 92 checkpoint

Stage 3 Higher Education now presents the selected school as the primary context and replaces the dense Field checkbox catalog with compact Basic, Advanced, and Special Field selectors. The selected Field summary retains category, XP, chronology, and the existing availability/final-prerequisite distinction. Field legality, same-transaction dependencies, school-specific details, OCS, Solaris, University, military, chronology, XP, preview/Continue, persistence, and backward compatibility remain governed by the existing rules and transaction models. Public Alpha catalog availability remains explicit and unsupported entries remain visible under the reusable policy. Release metadata is `0.1.0-alpha.92`.

## Alpha Slice 93 checkpoint

Slice 93 fixes the in-place action focus regression in Life Modules. The stage heading now receives focus only when the Life Module phase changes, including initial draft creation and intentional stage entry; same-phase mutations such as Optimization, final-improvement changes, Additional XP changes, and Stage 3 Field changes retain their current working context. Rules, calculations, persistence, provenance, Stage 3 selectors, status borders, theme-aware focus, and navigation behavior remain unchanged. Focus-policy tests cover phase entry versus same-phase local mutation. Release metadata is `0.1.0-alpha.93`.

## Alpha Slice 94 checkpoint

## Alpha Slice 110 checkpoint

Slice 110 defines the supported-path readiness boundary across Life Modules, Point Buy, and Archetype. A supported path has resolved mandatory choices and prerequisites, legal Attribute/Trait/Skill ledgers, reconciled method-specific XP, resolved supported aging/Stasis effects, and completed Final Touches equipment review. Optional narrative fields, empty inventory, partial equipment gameplay effects, unavailable Skill TN/Complexity metadata, and PDF record-sheet export remain nonblocking advisories. Readiness is recomputed from canonical state rather than persisted flags. The governed catalog boundary remains 56 reference Fields, 50 mechanical Fields, and 84 equipment records/IDs.

Life Modules retain committed Stages 0-4, Final Review, Optimization, Final Improvements, Optional Additional XP, aging, and Stasis gates, including legal Stage 3/4 skipping. Point Buy retains its narrow five-Skill and six-Trait catalog, Normal Human Attribute maximums, concrete Skill/subskill identity, exact XP reconciliation, negative-Trait cap, and required-language checks. Archetype retains the eight source-backed Core foundations and audited balanced adjustments; published package equipment remains source-backed package data. Point Buy and Archetype do not inherit Life Module-only Final Review requirements.

Final Touches initialization is method-neutral for Point Buy and Archetype while remaining Final-Review-gated for Life Modules. Published Archetype package items retain source provenance and are not reinterpreted as new purchases. Finalized snapshots, save/resume, export/import, provenance, aging, and Stasis remain shared and backward-compatible. Source authority remains the Corrected Third Printing pp. 41, 49, 95-99, 107, 116, 121-122, 165, 167, 185-186, and 332-333 with applicable v4.0 Errata; gameplay automation gaps remain separate from creation legality. Release metadata is `0.1.0-alpha.110`.

## Alpha Slice 95 checkpoint

## Alpha Slice 97 checkpoint

Source-verified Phenotype definitions now preserve XP-derived Attribute scores, free phenotype modifiers, phenotype-specific maxima, and Exceptional Attribute adjustments separately. Exceptional Attribute is a +2 TP target-specific Trait: partial funding remains inactive, one instance may apply per Attribute, and the higher Attribute score still requires ordinary XP. Supported Trait metadata now records source pages, categories, ranges, and repeatability for the governed catalog. Release metadata is `0.1.0-alpha.97`.

## Alpha Slice 98 checkpoint

Final review now supports governed purchases of new concrete Skills from the existing supported catalog at the current progression's Level 0 threshold, with required concrete subskills, duplicate prevention, provenance, and reversible XP-pool accounting. Skill specialties are attached to one concrete Skill, cost 20 XP, normalize subject text, require explicit recorded GM approval, and support proposal cancellation, committed un-specialization, and later re-specialization. Unsupported/open-ended Skills remain unavailable. Release metadata is `0.1.0-alpha.98`; readiness remains `ready-for-final-touches`, not ready-for-play.

## Alpha Slice 99 checkpoint

Final Touches now exposes a reusable deterministic Character Record Sheet derivation. It derives effective Attributes and link modifiers, Skill levels and preserved specialties, Standard Damage, Fatigue Damage, movement rates, Initiative mode, modeled Toughness, and equipment effect status from committed state without mutating or persisting duplicate derived authority. Source-backed but unsupported TN/Complexity and gameplay-dependent equipment effects remain explicitly unavailable or inert. Wealth/Equipped purchasing, ownership, ratings, affiliation adjustments, Issued Gear, costs, snapshots, and provenance remain governed by the existing 84-record catalog and Final Touches engine. Release metadata is `0.1.0-alpha.99`; readiness remains `ready-for-final-touches`.

Driving is canonicalized to Ground Vehicles, Rail Vehicles, and Sea Vehicles with legacy alias migration and duplicate-ledger preservation. Flexible XP pool allocations accept either sign while pool budgets and caps consume absolute magnitude. Character Summary Traits and Skills are alphabetized for presentation only. Release metadata is `0.1.0-alpha.95`.

Final Touches now has an explicit ready-for-final-touches gate followed by an editable descriptive/equipment foundation. Review readiness continues to derive from the canonical Life Module final-review blockers; the UI does not duplicate mechanical legality. Final Touches presents metric appearance fields, player-written background, derived Life Module history, canonical affiliation/order display, and Wealth/Equipped equipment limits. Homeworld is read-only after Family Training because it is already part of a source-bound History Skill resolution. The 84-item equipment catalog is classified as a partial current catalog, so manual inventory and explicit coverage wording remain available without implying exhaustive purchasing. Equipment purchasing, vehicles, complete record-sheet output, combat-derived data, specialty editing, aging expansion, final lock, and ready-for-play status remain deferred. Release metadata is `0.1.0-alpha.94`.
