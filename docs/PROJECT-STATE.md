# Project State

## Purpose

BT Online Compendium is intended to provide a web-based BattleTech *A Time of War* rules compendium and Character Generator. The long-term Character Generator direction includes a persistable playable-character sheet, but playable-sheet functionality is not part of the current bootstrap.

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
| Repository bootstrap / durable state | Complete | Documentation authority established; no application implementation |
| Core + Companion rules audit | In progress | Reconciled through GM arbitration/override architecture; next target is Campaign / Rules Configuration |
| Shared Character/Rules engine | Approved design; not implemented | Common foundation for all creation methods |
| Archetype v0.1 | Next implementation target; not authorized by bootstrap | Eight published archetypes are intended golden/regression fixtures |
| Point Buy | Sequenced after Archetype; not implemented | Exercises direct XP purchasing |
| Life Modules | Designed substantially; not implemented | State machine, not fixed wizard |
| Playable character sheet | Long-term direction; deferred | Play State should eventually be persistable |
| Planetary Data Foundation research/design | Substantially complete | Supporting infrastructure |
| Planetary Rollout 1 | Not started / not authorized by bootstrap | Lossless import through lookup/distance foundation |
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

Implementation resume point: **Archetype v0.1 with the shared Character/Rules engine**, only when separately authorized.

Planetary Rollout 1 remains a separate future authorization. Do not automatically proceed from a queued or documented rollout.

