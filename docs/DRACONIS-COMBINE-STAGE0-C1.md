# Draconis Combine Stage 0 — Alpha Slice 165-C1

Status: IMPLEMENTED - VERIFIED LOCALLY; UNCOMMITTED AND UNRELEASED

The Stage 0 Draconis Combine / House Kurita path is source-backed by the
Corrected Third Printing, printed page 64. The supported selection scope is
the parent affiliation plus Azami, Benjamin District, Dieron District, New
Samarkand (Galedon) District, and Pesht District.

The governed transaction preserves the 150-XP package cost, source awards,
language selection, provenance, affiliation records, and Stage 1 progression.
The parent Trait choice is Pain Resistance or Combat Sense. The parent +10
Skill choice is Archery, Melee Weapons, or Thrown Weapons/Blade. Azami
requires a concrete Survival subject; Dieron requires concrete Language and
Art subjects. These open choices are rejected when omitted or left as generic
placeholders; no source award is silently defaulted.

The primary language is selected through the existing Universal Stage 0
language award. Arabic, English, Japanese, and Swedanese are the currently
modeled Draconis language subset. Clan creation, other affiliation families,
Citizenship redesign, and Clan activation remain outside this slice.

C3 required explicit parent Trait and weapon Skill choices, rejecting missing
or invalid alternatives atomically. It also preserved sub-affiliation award
provenance through local persistence and JSON encode/decode. C4 made the
catalog award records the single executable Draconis award authority used by
catalog, preview, and transaction execution. C7 corrected the player-facing
context handling so the parent choice controls remain visible for all five
Draconis sub-affiliations while the existing transaction engine continues to
normalize execution through the parent context.

## Runtime/source provenance mapping

The normalized runtime identities are intentionally distinct from the source
inventory identifiers and map one-to-one:

| Source inventory ID | Runtime identity |
| --- | --- |
| `CORE-STAGE0-AFF-DRACONIS` | `stage0.draconis-combine` |
| `CORE-STAGE0-SUB-DRACONIS-AZAMI` | `stage0.draconis-combine.azami` |
| `CORE-STAGE0-SUB-DRACONIS-BENJAMIN-DISTRICT` | `stage0.draconis-combine.benjamin-district` |
| `CORE-STAGE0-SUB-DRACONIS-DIERON-DISTRICT` | `stage0.draconis-combine.dieron-district` |
| `CORE-STAGE0-SUB-DRACONIS-NEW-SAMARKAND-GALEDON-DISTRICT` | `stage0.draconis-combine.new-samarkand-galedon-district` |
| `CORE-STAGE0-SUB-DRACONIS-PESHT-DISTRICT` | `stage0.draconis-combine.pesht-district` |

The mapping is covered by direct transaction and browser export/import tests;
the runtime IDs and persistence schema are unchanged.

Verification performed for this worktree:

- focused Draconis/catalog/affiliation/UI tests: 26 passed;
- full unit suite: 95 files, 567 tests passed;
- `npm run check`: passed;
- production build: passed;
- browser integration: 7 passed, including the player-facing Draconis Combine
  Azami export/import round trip, with the transient verified Playwright cache;
- `git diff --check`: passed.

The browser round trip verified the Draconis parent identity, Azami
sub-affiliation, Combat Sense, Archery, Survival/Desert, XP accounting,
parent/sub-affiliation provenance, and Stage 1 progression state after import.

Later-stage Citizenship dependencies, Changing Affiliations, Clan activation,
phenotype-aware Attribute legality, character locking, PDF export, revision
history, and cloud saves remain deferred. This document describes an
uncommitted, unreleased implementation and makes no Core-complete claim.
