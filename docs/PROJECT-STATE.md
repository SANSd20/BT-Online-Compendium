# Project State

## Purpose

BT Online Compendium is intended to provide a web-based BattleTech *A Time of War* rules compendium and Character Generator. The current phase is Alpha. Beta 1 is a future milestone requiring completed character creation and PDF export. The long-term direction also includes a persistable playable-character sheet, which is not part of the current Alpha slices.

## Product direction

- Web application.
- Offline/PWA capable.
- Local-first.
- Local browser character saves initially.
- Import/export through a versioned portable character format.
- Public Alpha uses browser-local storage and requires no server, database, account, ChatGPT login, or cloud-character-storage service.
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
| Shared Character/Rules engine | Foundation implemented and exercised | Archetype, Point Buy, and Life Modules use the common representation, ledgers, validation, persistence, and provenance |
| Archetype v0.1 | Implemented | Published packages are source-faithful, non-customizable starting configurations |
| Point Buy v0.1 | Implemented | Core 5,000-XP default, GM-adjusted allotment recording, Attribute/Skill/Trait costs, negative-Trait ceiling, drafts, persistence, and focused catalogs |
| Life Modules v0.15 | Implemented, deliberately narrow | Existing Stage 0–4 path, final review/Optimization, Final Touches, and 84-item equipment catalog; true finalization and broad catalogs remain deferred |
| Beta 1 milestone | Future | Requires completed Core + Companion character creation and PDF export; not reached by Alpha Slice 19 |
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
- a shared-engine Archetype mapper that preserves published values and provenance in the common Character Definition;
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

Alpha Slice 19 changes deployment presentation, not character rules. Version `0.1.0-alpha.19` builds to static files in `dist/` and displays a persistent Public Alpha notice covering browser-local storage, JSON backup/import portability, incomplete rules/equipment/final validation, Core-first scope with Companion later, unavailable PDF export, and the lack of a play-ready guarantee. Public access targets a normal browser URL without ChatGPT or application login. No backend, authentication, analytics, external API, server persistence, account, cloud save, rules data, equipment data, or live hosting deployment was added. Account/login/cloud save remains a pre-v1.0 roadmap item.

The Core introduction describes the archetypes as 4,500-XP packages, but independently summing the printed Attribute, Trait, and Skill XP produces different totals for several sheets. Corrected Third Printing values are preserved without speculative repair, the declared package total and calculated line-item total remain separate, and each mismatch is recorded as a catalog note. Errata v4.0 does not provide a correction for these sheets.

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

Implementation resume point: **Alpha Slice 20 — public-preview hosting configuration and deployment**, only when a hosting target and live-deployment authorization are supplied. Publish the unchanged static build at a normal public URL; do not add authentication, backend/cloud persistence, analytics, rules content, or equipment data without separate authorization.

Planetary Rollout 1 remains a separate future authorization. Do not automatically proceed from a queued or documented rollout.
