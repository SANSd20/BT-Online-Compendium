# Project State

## Purpose

BT Online Compendium is intended to provide a web-based BattleTech *A Time of War* rules compendium and Character Generator. The long-term Character Generator direction includes a persistable playable-character sheet, but playable-sheet functionality is not part of Beta 1 Slices 1–2.

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
| Shared Character/Rules engine | Foundation implemented and exercised | Archetype creation uses the common representation and factory; Point Buy and Life Modules remain placeholders |
| Archetype v0.1 | Implemented | Published packages are source-faithful, non-customizable starting configurations |
| Point Buy | Sequenced after Archetype; not implemented | Placeholder route only; purchasing rules remain deferred |
| Life Modules | Designed substantially; not implemented | Placeholder route only; state machine and module content remain deferred |
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
- a working hash-based Archetype route and placeholder Point Buy and Life Module routes;
- one shared character factory and Character Definition for all three routes;
- distinct creation-pool, allocated, and earned/unspent gameplay XP fields;
- typed foundations for Attributes, Traits, structured Skills, identities, affiliations, phenotype, equipment, vehicles, chronology, provenance, and future Play State;
- distinct personal-equipment ownership (`Owned`/`Issued`) and vehicle ownership (`Assigned`/`Owned`);
- a rules catalog boundary with stable IDs and Core + Companion source descriptors;
- all eight Core archetype packages with Attributes, Traits, structured Skills and specialties, personal equipment, C-bills, source references, and package notes;
- a shared-engine Archetype mapper that preserves published values and provenance in the common Character Definition;
- creation-time rules snapshots, optional-rule settings, and narrow GM-exception records;
- a versioned portable character envelope;
- browser-local save/list/load/delete behavior;
- JSON import/export and malformed-file rejection;
- a minimal typed validation-result framework; and
- automated tests for the shared factory, all eight Archetype golden fixtures, schema round-trip, `null` versus Level 0 Skills, local persistence, and structural validation.

The Archetype screen proves the common catalog → creation → validation → local save → export/import path with published data. Point Buy and Life Modules remain placeholders.

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

Implementation resume point: **Beta 1 Slice 3 — Point Buy v0.1 on the implemented shared Character/Rules foundation**, only when separately authorized.

Planetary Rollout 1 remains a separate future authorization. Do not automatically proceed from a queued or documented rollout.
