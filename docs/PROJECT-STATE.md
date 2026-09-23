# Project State

## Purpose

BT Online Compendium is intended to provide a web-based BattleTech *A Time of War* rules compendium and Character Generator. The current phase is Alpha. Beta 1 is a future milestone requiring completed character creation and PDF export. The long-term direction also includes a persistable playable-character sheet, which is not part of the current Alpha slices.

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
| Alpha Slice 1 application foundation | Implemented and verified | React/TypeScript/Vite shell, shared models, validation, local saves, JSON import/export, placeholder routes |
| Alpha Slice 2 Archetype v0.1 | Implemented and verified | All eight Core archetypes create shared-schema characters with provenance, local save, JSON import/export, display, and golden tests |
| Alpha Slice 3 Point Buy v0.1 | Implemented and verified | Normal Human Attribute purchasing plus focused Skill/subskill and Trait purchasing with budget enforcement and provenance |
| Alpha Slice 4 Life Modules v0.1 | Implemented and verified | Stage 0/1 state machine, separate module pool, audited four-entry catalog, concrete awards, pending choices, prerequisite tracking, persistence, and UI |
| Alpha Slice 5 Life Modules v0.2 | Implemented and verified | Pending language, `/Any`, multi-choice, and flexible awards resolve into shared ledgers with durable audit history and prerequisite re-evaluation |
| Alpha Slice 6 Life Modules v0.3 | Implemented and verified | Legal Stage 2 continuation plus audited Back Woods and High School modules, pooled flexible-XP caps, affiliation choices, prerequisites, persistence, validation, and UI |
| Alpha Slice 7 Life Modules v0.4 | Implemented and verified | Legal Stage 3 continuation, Technical College, Technician/Civilian and Technician/Vehicle Fields, calculated cost/time, Field provenance, persistence, validation, and UI |
| Shared Character/Rules engine | Foundation implemented and exercised | Archetype, Point Buy, and Life Modules use the common representation, ledgers, validation, persistence, and provenance |
| Archetype v0.1 | Implemented | Published packages are source-faithful, non-customizable starting configurations |
| Point Buy v0.1 | Implemented | Core 5,000-XP default, GM-adjusted allotment recording, Attribute/Skill/Trait costs, negative-Trait ceiling, drafts, persistence, and focused catalogs |
| Life Modules v0.4 | Implemented, deliberately narrow | Existing Stage 0–2 path plus Technical College and two Technician Fields; Stage 4, repeated schooling, finalization, and broad catalogs remain deferred |
| Beta 1 milestone | Future | Requires completed Core + Companion character creation and PDF export; not reached by Alpha Slice 7 |
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
- a focused Life Module catalog containing the universal Stage 0 package, Capellan Confederation/Capellan Commonality, Blue Collar and Back Woods at Stage 1, Back Woods and High School at Stage 2, and Technical College at Stage 3;
- a Life Module state machine covering universal Stage 0, affiliation selection, Stage 1, explicit Alpha partial stops, legal continuation through Stage 2 and the minimal Stage 3 branch, and distinct unsupported-later-stage boundaries;
- a Life Module purchasing pool separate from statistic ledgers, with module costs unable to be financed by positive or negative awards;
- fixed Attribute, Trait, Skill, structured subskill, and parameterized-Trait awards on the shared ledgers, including partial XP and source provenance;
- durable pending records for unresolved language, `/Affiliation`, `/Any`, multi-choice, fixed-grant flexible, and pooled flexible awards, plus final-validation prerequisite records;
- source-bound resolution records for each applied choice/flexible grant, including concrete destination, XP, source, provenance, and resolution time;
- incremental resolution of language, affiliation, `/Any`, multi-choice, and flexible awards with target restrictions, duplicate-choice prevention, and Stage 2 caps of 35 XP per Skill and 200 XP per Attribute or Trait;
- automatic prerequisite re-evaluation after every resolved grant;
- separate Skill Field definitions and durable Field grants for Technician/Civilian and Technician/Vehicle, including category, prerequisites, component Skills, per-Skill cost and award, chronology, and provenance;
- Technical College cost calculation of 600 base XP plus 120 and 96 XP Field costs, with overlapping Field Skill awards stacking normally and age advancing from 16 to 19;
- explicit Stage 1, Stage 2, and minimal Stage 3 selection, resolution, prerequisite-review, and valid Alpha partial-stop states without claiming Stage 4, finalization, or Beta 1 completion;
- creation-time rules snapshots, optional-rule settings, and narrow GM-exception records;
- a versioned portable character envelope;
- browser-local save/list/load/delete behavior;
- JSON import/export and malformed-file rejection;
- a minimal typed validation-result framework; and
- automated tests for the shared factory, all eight Archetype golden fixtures, schema round-trip, `null` versus Level 0 Skills, local persistence, and structural validation.

All three creation screens use the common catalog → creation → validation → local save → export/import path. The Life Module route additionally exposes current phase, module-pool accounting, selected history, applied awards, unresolved awards, and prerequisite status.

Life Modules v0.4 retains the existing award-resolution behavior and adds explicit continuation from `alpha-stage-2-stop` into Technical College. The selected school and its two Fields cost 816 XP total. Field awards use their own provenance records, award +30 XP to every component Skill, remain durable independently of the playable Skill ledger, and add three years to the character chronology. Technical College adds pending Interest/Any +30 XP and a durable 200-XP flexible pool. Field prerequisites are tracked and re-evaluated after those allocations; resolved, prerequisite-satisfied drafts reach `alpha-stage-3-stop`. This remains an Alpha partial stop. Stage 4, other Stage 3 schools and Fields, repeated schooling, Changing Affiliations, Life Events, Optimization, negative-Trait XP purchasing, and exhaustive final validation remain deferred.

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

Implementation resume point: **Alpha Slice 8 — Life Modules v0.5 minimal Stage 4 foundation**, only when separately authorized. Add an audited minimal Stage 4 branch and only its required supporting mechanics, without implying complete finalization support.

Planetary Rollout 1 remains a separate future authorization. Do not automatically proceed from a queued or documented rollout.
