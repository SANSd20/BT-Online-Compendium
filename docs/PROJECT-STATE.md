# Project State

## Purpose

BT Online Compendium is intended to provide a web-based BattleTech *A Time of War* rules compendium and Character Generator. The long-term Character Generator direction includes a persistable playable-character sheet, but playable-sheet functionality is not part of Beta 1 Slices 1–4.

## Product direction

- Web application.
- Offline/PWA capable.
- Local-first.
- Local browser character saves initially.
- Import/export through a versioned portable character format.
- No initial server, database, account, or cloud-character-storage requirement.
- A future backend may be added later.

Saved characters must retain enough underlying information to reproduce and audit the character, not merely visible record-sheet totals. The format must leave room for schema and rules/source versions, XP provenance, resolved choices, Life Module history, identity assignments, equipment and vehicles, derived-result provenance, and future Play State.

## Workstream status

| Workstream | Status | Notes |
|---|---|---|
| Repository bootstrap / durable state | Complete | Documentation authority established |
| Core + Companion rules audit | In progress | Reconciled through GM arbitration/override architecture; next target is Campaign / Rules Configuration |
| Beta 1 Slice 1 application foundation | Implemented and verified | React/TypeScript/Vite shell, shared models, validation, local saves, JSON import/export, placeholder routes |
| Beta 1 Slice 2 Archetype v0.1 | Implemented and verified | All eight Core archetypes create shared-schema characters with provenance, local save, JSON import/export, display, and golden tests |
| Beta 1 Slice 3 Point Buy v0.1 | Implemented and verified | Normal Human Attribute purchasing plus focused Skill/subskill and Trait purchasing with budget enforcement and provenance |
| Beta 1 Slice 4 Life Modules v0.1 | Implemented and verified | Stage 0/1 state machine, separate module pool, audited four-entry catalog, concrete awards, pending choices, prerequisite tracking, persistence, and UI |
| Shared Character/Rules engine | Foundation implemented and exercised | Archetype, Point Buy, and Life Modules use the common representation, ledgers, validation, persistence, and provenance |
| Archetype v0.1 | Implemented | Published packages are source-faithful, non-customizable starting configurations |
| Point Buy v0.1 | Implemented | Core 5,000-XP default, GM-adjusted allotment recording, Attribute/Skill/Trait costs, negative-Trait ceiling, drafts, persistence, and focused catalogs |
| Life Modules v0.1 | Implemented, deliberately narrow | Universal Stage 0, Capellan/Commonality, Blue Collar, and Back Woods only; choice allocation, later stages, and full catalog remain deferred |
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

## Implemented Beta 1 foundation

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
- a focused Life Module catalog containing the universal Stage 0 package, Capellan Confederation/Capellan Commonality, Blue Collar, and Back Woods;
- a Life Module state machine covering universal Stage 0, affiliation selection, Stage 1 selection, and an explicit Stage 1 award-resolution state;
- a Life Module purchasing pool separate from statistic ledgers, with module costs unable to be financed by positive or negative awards;
- fixed Attribute, Trait, Skill, structured subskill, and parameterized-Trait awards on the shared ledgers, including partial XP and source provenance;
- durable pending records for unresolved language, `/Any`, multi-choice, and flexible awards, plus final-validation prerequisite records for Back Woods;
- creation-time rules snapshots, optional-rule settings, and narrow GM-exception records;
- a versioned portable character envelope;
- browser-local save/list/load/delete behavior;
- JSON import/export and malformed-file rejection;
- a minimal typed validation-result framework; and
- automated tests for the shared factory, all eight Archetype golden fixtures, schema round-trip, `null` versus Level 0 Skills, local persistence, and structural validation.

All three creation screens use the common catalog → creation → validation → local save → export/import path. The Life Module route additionally exposes current phase, module-pool accounting, selected history, applied awards, unresolved awards, and prerequisite status.

Life Modules v0.1 intentionally does not allocate its retained FedSuns-language, `/Any`, multi-choice, or flexible awards. Because Core requires all module awards to be resolved before advancement, selecting Blue Collar or Back Woods leaves the draft in `stage-1-resolution`; it does not silently advance or finalize. Stage 2–4 content, Changing Affiliations, full affiliation-language resolution, Skill Fields, Life Events, Optimization, negative-Trait XP purchasing, and exhaustive final validation remain deferred.

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

Implementation resume point: **Life Modules v0.2 — pending-award resolution and finalization foundation**, only when separately authorized. Resolve the v0.1 pending award types and re-evaluate prerequisites before broad catalog expansion.

Planetary Rollout 1 remains a separate future authorization. Do not automatically proceed from a queued or documented rollout.
