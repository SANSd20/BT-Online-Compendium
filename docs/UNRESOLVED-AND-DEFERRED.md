# Unresolved and Deferred Work

Do not invent behavior for these items. A future source clarification or explicit user/project decision is required.

Alpha Slice 45 extends integrated selection preview to every currently supported Stage 1–4 module without adding data or changing the existing post-Continue award-resolution flow. Faction theming beyond the Stage 0 Capellan context remains future work. Full affiliation-data expansion, broader accessibility and keyboard-navigation review, the post-Beta random name generator, Beta 1, and PDF export remain future work.

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

- Archetype customization beyond Slice 24's controlled Attribute/existing-Skill level adjustments and bounded same-XP Skill swaps. Slice 25 is audit-only and adds no customization. The implemented swap picker derives only from exact, non-specialty Skill identities already audited in the Core Archetype data; arbitrary full-catalog targets, new Skill/subskill creation, ambiguous subskills, specialties, and Tiered Skill resolution remain deferred. Trait adjustments (including identity-based and parameterized cases), freeform/unbalanced completion, and GM overrides also remain deferred. The implemented adjustment ledger must net to exactly 0 XP before save, export, or progression.
- Correction of the printed Archetype conflicts cataloged in `archetype-sheet-cross-check.md` remains deferred absent authoritative errata or a separately approved data change. Slice 28 governs source treatment—prose/package data remains active and back sheets remain supplemental evidence—without correcting Tanker, Elemental, Scout, printed `REF`, capitalization variants, package totals, or back-sheet-only fields.
- Point Buy catalog expansion beyond the Slice 3 focused Skill and Trait subset.
- Point Buy phenotype selection, Exceptional Attribute interaction, Fast/Slow Learner cost columns, partial XP allocation controls, multiple instances of one Trait, specialties, affiliation selection, full prerequisites/oppositions, complete required-Skill finalization, and integration with the Final Touches flow.
- Life Module catalog expansion beyond the eighteen audited entries implemented through Alpha Slice 74: universal Stage 0, Capellan Confederation/Capellan Commonality, Federated Suns/Crucis March, Stage 1 Blue Collar and Back Woods, Stage 2 Back Woods and High School, Stage 3 Technical College, Trade School, University, Solaris Internship, Police Academy, Intelligence Operative Training, Military Academy, Military Enlistment, Family Training, and Officer Candidate School, and Stage 4 Agitator.
- The bounded Life Modules wizard-flow, Stage 0 layout, integrated Stage 1–4 preview, same-page module and existing-choice slots, synchronized blocker/Continue state, one-Continue commit, flexible-pool progress text, sibling destination filtering, and Slice 50 accessibility pass are complete through Slice 51. The generic resolver remains for legacy or unsupported fallback contexts. The pre-Beta removal of the player-facing `Previewing selected choices` panel remains deferred; workflow expansion that depends on broader module, affiliation, arbitrary subskill, or full Skill/Trait catalog data also remains deferred.
- A post-Beta random name generator remains deferred.
- Full Life Modules affiliation and sub-affiliation expansion remains deferred. Slice 29 centralizes only the already implemented Capellan/Commonality context and selector metadata; unknown contexts remain deferred and are not exposed as guessed IDs or free text. Great House, Periphery, Clan, ComStar, Changing Affiliations, and broader language data require separate source-backed work.
- Stage 3 schools beyond Technical College, Trade School, University, Solaris Internship, Police Academy, Intelligence Operative Training, Military Academy, Military Enlistment, Family Training, and Officer Candidate School; mechanically acquired Skill Fields beyond the forty-six-Field Slice 77 catalog; Stage 4 modules beyond Agitator; repeated or multiple Stage 4 execution; and Stage 4 career-field logic. Pilot/Battle Armor, the DropShip/JumpShip/WarShip Fields, and Infantry/Anti-Mech are mechanical; the ten remaining reference-only Fields and their exact current blockers are recorded in `STAGE3-FIELD-DEPENDENCY-AUDIT.md`. Open Career, Interest, Science, and Survival subjects are validated explicit entries, but campaign acceptance remains GM-defined. General languages, affiliation choices, and Trade School's any-three-Skills picker remain explicitly modeled governed subsets, not claims of setting-wide completeness.
- Exhaustive affiliation-language validation, complete prerequisite-conflict handling, Changing Affiliations, Life Events, the full opposed-Trait catalog, and Optimization beyond currently modeled ledgers. Alpha Slice 9 implements explicit final allocation and supported Optimization only for the narrow current branch.
- Negative-Trait XP purchase execution, equipment catalog expansion beyond the current 84 items, full era/market interpretation of the printed Availability triplet, comprehensive affiliation-code mapping, heavy/combat Vehicle Trait workflow, ammo/reload accounting, power consumption/recharging, PP runtime tracking, quick-charge/recharge behavior, communications/network behavior, sensor detection, recording/playback behavior, consumable-use tracking, movement/falling automation, active BAR/protection/coverage/facing rules, clothing-penalty effects, armor/equipment condition, repair-job automation, healing/fatigue/addiction effects, health/combat state, true final character locking, ready-for-play state, and PDF export. Slice 18 keeps Clan pack capacity and quick-charge rules as inert metadata, rejects runtime-like inventory state, and retains manual fallback after `ready-for-final-touches`.
- Possible future source audit of the existing Power Pack, Clan hand-audited normalized Availability. Slice 18 preserves the established `B` value and does not silently change it.
- Issued Gear occupation eligibility, employer catalogs, cheapest-item selection, and full GM approval workflow. Slice 10 stores an optional issuer and `gm-review` state but does not adjudicate them.
- Full Core + Companion rules-catalog data entry.
- Persistable playable-sheet functionality.
- Server/database/accounts and cloud character storage. Account/login/cloud save is expected before v1.0 but remains unimplemented in the Public Alpha.
- Planetary Rollout 1 until separately authorized.
- Political Geography (Rollout 2).
- AToW nearest-state integration (Rollout 3).
- Planetary distribution/deployment licensing review.
- Rich normalization/UI for unused planetary properties.

## Current scope boundary

Alpha Slices 1–31 supersede the bootstrap's implementation prohibition only for the explicitly authorized application foundation, Core Archetype foundation/shared accounting, zero-net controlled Attribute/existing-Skill adjustments, bounded same-XP swaps among already-audited safe Skill instances, the Slice 25 audit and Slice 28 governance policy, Point Buy v0.1, the narrow Life Modules v0.15/Final Touches/84-item-equipment scope, the Slice 26 Stage 0 affiliation-flow hotfix, the Slice 27 pending-award/progression hotfix, the Slice 29 affiliation-framework centralization, the Slice 30 wizard presentation, the Slice 31 Stage 0 layout polish, static Public Alpha readiness, GitHub Pages deployment configuration, deployment verification, and public wording cleanup recorded above. Slices 19–31 add no equipment data, and Slices 29–31 add no broad rules catalog. These slices do not authorize broad Archetype editing, full Skill catalog management, broader Life Module content beyond the current wizard, a full equipment catalog, active item effects, true finalization, account/login/cloud save, backend services, deployment to another provider, resolution of open rules questions, PDF export, playable-sheet runtime behavior, post-Beta publications, or progression through any planetary rollout. Beta 1 remains a future milestone requiring completed Core + Companion character creation and PDF export; v1.0 remains later.
