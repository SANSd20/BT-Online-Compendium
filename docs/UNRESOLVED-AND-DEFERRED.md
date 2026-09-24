# Unresolved and Deferred Work

Do not invent behavior for these items. A future source clarification or explicit user/project decision is required.

## Unresolved Character Generator rules

### ProtoMech Warrior / Aerospace Phenotype / Glass Jaw

The corrected Core requires Aerospace Phenotype for the Clan ProtoMech Warrior path. Aerospace Phenotype grants Glass Jaw. Trueborn Sibko says ProtoMech warriors may not possess Glass Jaw.

Review of Core, AToW Errata v4.0, Companion, and prior web research did not establish a resolution. This remains on the clarification-question list. No builder resolution is authorized.

### Purchased weapons and magazines

The rules demonstrate reload pricing, but research has not clearly established whether a purchased weapon includes a magazine and/or how an empty magazine is priced. No resolution is authorized.

## Errata and audit findings

### Removed Thick-Skinned / Thin-Skinned system

Thick-Skinned and Thin-Skinned references inherited from older material are removed from Character Generator rules data because the system was removed in the Corrected Third Printing. Do not restore these Traits from stale Companion references.

### Oblique Artilleryman naming error

Companion page 65 refers to “Oblique Marksman.” Core First Printing and Corrected Third Printing both place Oblique Attacker on page 221 and Marksman on page 220. The Companion reference is therefore established as a naming error:

**Oblique Marksman → Oblique Attacker**

The issue has been prepared/reported through the official errata process.

### Reported rank-table issues

Previously investigated AFFS/AFFC and Free Worlds League rank-table issues have been reported through the official errata process. Preserve their reported status and do not introduce additional speculative corrections without an established source finding or project decision.

## Unresolved nearest-state semantics

AToW uses “nearest state,” but the project has not established whether the relevant origin is birth affiliation, final affiliation, campaign location, homeworld, upbringing location, or something else. It has also not established the relevant date or which recorded factions qualify as a “state.”

No nearest-state algorithm is authorized. The required conceptual order is:

1. interpret the AToW rule;
2. establish origin location;
3. establish date;
4. establish what qualifies as a state;
5. query objective planetary/political-geography services;
6. apply the established rule;
7. preserve the resolved state and eligible choices with provenance.

The data layer must not make those semantic decisions.

## Deferred implementation

- Archetype customization beyond selecting one of the eight published Core packages; customization belongs to later Point Buy work.
- Resolution of printed Archetype XP/score discrepancies unless an authoritative correction or explicit project interpretation is established. Slice 2 preserves the printed data and records the mismatches.
- Point Buy catalog expansion beyond the Slice 3 focused Skill and Trait subset.
- Point Buy phenotype selection, Exceptional Attribute interaction, Fast/Slow Learner cost columns, partial XP allocation controls, multiple instances of one Trait, specialties, affiliation selection, full prerequisites/oppositions, complete required-Skill finalization, and integration with the Final Touches flow.
- Life Module catalog expansion beyond the eight audited entries implemented through Alpha Slice 10: universal Stage 0, Capellan Confederation/Capellan Commonality, Stage 1 Blue Collar and Back Woods, Stage 2 Back Woods and High School, Stage 3 Technical College, and Stage 4 Agitator.
- Stage 3 schools beyond Technical College, Skill Fields beyond Technician/Civilian and Technician/Vehicle, Stage 4 modules beyond Agitator, repeated Stage 3 schooling, repeated or multiple Stage 4 execution, and Stage 4 career-field logic.
- Exhaustive affiliation-language validation, complete prerequisite-conflict handling, Changing Affiliations, Life Events, the full opposed-Trait catalog, and Optimization beyond currently modeled ledgers. Alpha Slice 9 implements explicit final allocation and supported Optimization only for the narrow current branch.
- Negative-Trait XP purchase execution, full equipment catalog/lookup, affiliation-based rating adjustments, heavy/combat Vehicle Trait workflow, ammo/reload accounting, armor/equipment condition, true final character locking, ready-for-play state, and PDF export. Slice 10 implements only manual personal-equipment drafting after `ready-for-final-touches`.
- Issued Gear occupation eligibility, employer catalogs, cheapest-item selection, and full GM approval workflow. Slice 10 stores an optional issuer and `gm-review` state but does not adjudicate them.
- Full Core + Companion rules-catalog data entry.
- Persistable playable-sheet functionality.
- Server/database/accounts and cloud character storage.
- Planetary Rollout 1 until separately authorized.
- Political Geography (Rollout 2).
- AToW nearest-state integration (Rollout 3).
- Planetary distribution/deployment licensing review.
- Rich normalization/UI for unused planetary properties.

## Current scope boundary

Alpha Slices 1–10 supersede the bootstrap's implementation prohibition only for the explicitly authorized application foundation, Core Archetype v0.1, Point Buy v0.1, and the narrow Life Modules v0.7/manual Final Touches scope recorded above. They do not authorize broader Life Module content, a full equipment catalog, true finalization, resolution of open rules questions, PDF export, playable-sheet runtime behavior, post-Beta publications, or progression through any planetary rollout. Beta 1 remains a future milestone requiring completed Core + Companion character creation and PDF export.
