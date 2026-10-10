# Life Modules finalization audit

Authority: *A Time of War — The BattleTech RPG*, Corrected Third Printing, printed pp. 95–99, checked against the v4.0 errata. The errata contains no applicable correction to these finalization rules.

## Source sequence

1. Complete the Life Modules and retain the unspent XP Pool.
2. Determine fully attained Attribute scores, Trait Points, and Skill levels. Attributes and Traits use 100 XP per point. Skills use the Standard, Fast Learner, or Slow Learner threshold column as applicable.
3. Enforce character minimums and maximums. Attributes must reach 1; Skills below level 0 disappear; Traits use their individual ranges. Phenotype governs Attribute maxima, Traits use their listed TP limits, and Skills cap at level 10.
4. Resolve opposed Traits before Optimization by adding their signed XP and retaining only the positive or negative remainder. A zero result removes both. Illiterate is the exception: it remains unless the character has any Language at level 4+, at which point Illiterate is erased without reducing Language. A normally negative Trait with positive XP is erased and its positive XP enters the Pool.
5. Optimize leftover points. Positive statistics fall to their highest fully attained level; a positive statistic below its first threshold may disappear. Negative Traits move farther negative to the next fully attained negative TP. Excess beyond a maximum returns automatically. Optimization returns XP to the Pool; it does not buy improvements.
6. Spend the available Pool on source-legal final improvements. The worked example improves Traits and Attributes, then later Attributes and Skills.
7. Optionally buy additional XP through fully attained negative Trait levels only, after Optimization. The cap is 10% of the original design allotment (normally 500 XP for a 5,000-XP design); Attributes and Skills cannot be reduced to finance it, and negative Trait minima still apply.
8. Spend the resulting XP, then proceed to Final Touches. A Skill specialty costs 20 XP, needs GM approval, and is limited to one per Skill; changing it later has a separate 20-XP removal cost.

## Slice 85 implementation

Slice 85 turns the existing narrow final-review screen into an ordered architecture: levels and requirements, opposed Traits, Optimization, final improvements, optional additional XP, and final validation. It implements:

- Standard, Fast Learner, and Slow Learner attained Skill thresholds through level 10;
- Attribute/Trait/Skill attained-level display and explicit Optimization previews;
- all printed opposed-Trait identities when present in the character ledger, including the Illiterate/Language exception;
- signed-XP opposed cancellation as a recorded finalization adjustment with provenance;
- source examples for positive excess, negative-Trait thresholds, modeled maxima, and sub-level-0 Skills;
- explicit recovery of optimized XP into the final Pool;
- final XP improvements to existing modeled statistics, with modeled Attribute and Skill maxima enforced;
- a durable 10%-of-original-allotment optional-rule cap;
- backward-compatible persistence for allocations, optimization, and opposed-Trait resolution records.

Optimization remains explicit and never rewrites Life Module history or its award provenance. Finalization adjustments add their own provenance. Draft save/export continues to serialize only committed character state.

## Deliberately deferred

The present catalog cannot yet safely provide exhaustive Trait purchase, Trait prerequisite/conflict, Phenotype, Exceptional Attribute, or specialty workflows. Therefore Slice 85 does not expose purchase of new Traits or Skills, optional negative-Trait XP execution, specialty editing, automatic funding of an Attribute minimum by reducing arbitrary other statistics, or a final ready-for-play lock. These require the next bounded finalization slice rather than guessed catalog data. Existing Final Touches and equipment review remain draft states.

## Verification examples

- Attribute 325 XP → score 3 at 300 XP → recover 25 XP.
- Compulsion −125 XP → TP −2 at −200 XP → recover 75 XP.
- Patient 200 XP with maximum +1 → 100 XP → recover 100 XP.
- Career/Soldier 115 XP (Standard) → level 3 at 80 XP → recover 35 XP.
- Strategy 10 XP → below level 0 → remove and recover 10 XP.

## Alpha Slice 89 checkpoint

Slice 89 exposes final improvements only for existing concrete ledger entries. Optimization recovers XP into the separate finalization pool; final allocations reduce that working pool and add player-choice provenance. Removing a proposed allocation reverses its ledger delta and returns the exact XP without changing Life Module award provenance.

Attributes use the cumulative 100-XP-per-score model and the governed Point Buy maxima (`STR/BOD/DEX/RFL/INT/WIL 8`, `CHA/EDG 9`). The current catalog supports Normal Human creation and preserves phenotype modifiers on imported/archetype entries. Exhaustive phenotype-specific maxima and Exceptional Attribute are not represented by the governed creation catalog, so unsupported phenotype cases remain deferred rather than guessed or permitted.

Existing Traits are bounded to concrete ledger instances with catalog-defined TP ranges. Fixed-level Traits cannot be raised beyond their modeled maximum; variable/ranged Traits use the catalog range. New Traits, incomplete prerequisite/conflict metadata, and optional negative-Trait Additional XP purchases remain deferred.

Existing concrete Skills can receive final XP only on the exact ledger address already possessed, using Standard, Fast Learner, or Slow Learner cumulative thresholds and a hard Level +10 maximum. Arbitrary new Skills and specialties remain deferred.

The Stage 0 package status badge was audited as redundant presentation-only state and removed. Keyboard focus remains visible and uses the active faction/Order accent while required and invalid borders remain independent. Slice 89 preserves the 56 Reference Fields, 50 Mechanical Fields, and 84-record equipment catalog.

## Alpha Slice 90 checkpoint

The optional Additional Experience Points rule is implemented after Optimization and opposed-Trait resolution. It supports adding or enhancing governed negative Traits only when the resulting level is a fully attained legal negative TP value. The aggregate allowance is 10% of the original design allotment, not the current Pool or recovered Optimization amount; for a standard 5,000-XP design this is 500 XP. Each transaction records the before/after Trait XP, gained XP, player-choice provenance, and exact Pool increase. Removing a proposal reverses the Trait and Pool changes without regenerating XP.

The current governed catalog safely exposes only negative Traits with modeled ranges and complete parameters; unsupported negative Traits, incomplete prerequisite/conflict metadata, and GM approval workflows remain blocked/deferred. Attributes and Skills cannot be reduced to create Additional XP. Illiterate remains subject to its existing special opposed-Trait handling and maximum. Additional XP is spent through the ordinary final-improvement Pool and cannot be purchased while Optimization opportunities remain.

Slice 90 also refines required-unresolved controls to a generic 1px `#9B5555` border. Invalid `#FF6B6B`, disabled, resolved active-theme borders, and theme-aware focus remain separate.

## Alpha Slice 91 checkpoint

## Alpha Slice 97 checkpoint

Source reconciliation verified the Corrected Third Printing directly from `C:\Users\boill\Box\Games\Boardgames\BattleTech\Rulebooks\Total Warfare\4 RPG\1 A Time of War-The BattleTech RPG — Corrected Third Printing.pdf` using pypdf, with v4.0 errata text extracted from the corresponding errata PDF. Printed p. 95 establishes Attribute minimum reset and p. 97 establishes Skill Specialties and Optimization. Printed p. 107 provides the Master Traits List and multiple-Trait rules; p. 116 defines Exceptional Attribute as +2 TP; pp. 121-122 define Phenotype and its table. The source table records Normal Human maximums 8/8/8/8/8/8/9/9, Aerospace modifiers -1/-1/+2/+2 with maxima 7/7/9/9/9/8/8/8, Elemental +2/+1/-1 with maxima 9/9/7/8/8/9/8/8, and MechWarrior +1 DEX/+1 RFL with maxima 8/8/9/9/8/8/9/8. Slice 97 adds reusable phenotype metadata, effective Attribute legality, one-per-target Exceptional Attribute validation, source-page Trait metadata for the supported catalog, and partial Exceptional Attribute handling. Clan creation, specialties, unrestricted new Traits/Skills, equipment expansion, aging, record-sheet export, and ready-for-play locking remain deferred.

Life Module catalogs use a reusable dropdown-first presentation policy for one-of-many selection. Available entries are selectable; supported but ineligible entries remain visible and disabled with engine-derived reasons; source items not mechanically supported are represented by the separate unsupported state and remain visible during Public Alpha. The policy can hide unsupported entries in a future production mode without changing canonical IDs or catalogs. Stage 3 school selection adopts the same selector while preserving the specialized Field, staged dependency, school-family, and OCS workflows in the selected detail panel. Presentation state is not persisted separately; committed module/school history remains the save authority.

## Alpha Slice 98 checkpoint

The corrected printing's printed p. 95 establishes 20-XP Skill specialties, GM approval, one specialty per Skill, and the prohibition on representing another Skill or Subskill; printed p. 97 establishes the 20-XP un-specialization and later re-specialization procedure. The v4.0 errata's p. 141 specialty correction changes the Gunnery example terminology from “Lasers” to “Energy.” Slice 98 implements these mechanics only for the existing governed catalog: new concrete Skills require a canonical entry and required subskill, cost the current progression's Level 0 threshold, and preserve canonical identity, provenance, and XP Pool accounting. Specialty proposals, explicit GM approval state, cancellation, committed removal, replacement eligibility, and persistence are represented without GM accounts or cloud workflow. Unsupported Skills and gameplay-specific specialty modifiers remain deferred.

## Alpha Slice 99 checkpoint

## Alpha Slice 101 - post-creation aging

## Alpha Slice 102 - readiness and finalized snapshots

Slice 102 adds a deterministic readiness evaluation over committed character state. It distinguishes incomplete creation, ready-for-final-touches, and ready-for-play. Mandatory blockers include incomplete supported Life Modules, unresolved final-review blockers, invalid aging outcomes, missing supported Final Touches requirements, invalid equipment, and an unreviewed equipment draft. Empty inventory remains legal. TN/Complexity gaps, partial equipment effects/catalog coverage, and PDF export remain nonblocking advisories.

Ready-for-play snapshots are immutable copies of the validated committed character, derived record sheet, source version, provenance IDs, and creation metadata. The editable draft remains separate and later edits append a new snapshot rather than mutating an earlier one. Persisted readiness booleans are not trusted; readiness is recomputed before snapshot creation. Old Alpha saves without snapshots remain valid and editable. Stasis Tube support remains deferred and is not treated as an implemented readiness input.

The Corrected Third Printing aging rules on pp. 332-333 were rechecked directly. Aging begins when a character reaches age 25 and applies the published birthday XP adjustments at ages 25, 31, 41, 51, 61, 71, 81, 91, and 101. The adjustment columns affect STR, BOD, DEX, RFL, INT, WIL, and CHA; EDG and Phenotype maximums are not affected. Reputation -150 at 31 and -300 at 51 apply to Clan characters under the printed footnotes. Slow Learner -300 appears at 61 and Glass Jaw -300 at 71; those negative Traits are re-applied at later brackets as the source directs. No random aging roll or player choice is required by this table.

Slice 101 derives these effects from committed chronology after character creation. It does not mutate Life Module awards, creation XP, final review purchases, Optimization, Optional Additional XP, or the original Attribute/Trait ledgers. The derived record sheet applies aging XP before Attribute legality and exposes the final age, brackets, effects, and unsupported ages beyond the published 101-year table in Final Touches. Ages below 25 have no aging effects. Aging below the Attribute minimum is reported for review rather than silently clamped.

No ready-for-play state, lock, GM approval workflow, or finalized snapshot was added. Aging has no separate persisted mutable ledger because it is deterministically derived from committed chronology and current character state; older saves therefore remain compatible without duplicate application. Source: AToW Corrected Third Printing pp. 332-333.

The corrected printing's printed pp. 99-101 establishes Final Touches, Wealth's maximum total personal-equipment value, Equipped's Tech/Availability/Legality limits, foreign-affiliation Availability/Legality adjustment, Issued Gear ownership boundaries, and record-sheet completion requirements. Printed p. 41 supplies Attribute link modifiers; pp. 165 and 167 supply condition-monitor, initiative, and movement formulas. Slice 99 derives only values supported by committed state: effective Attributes/link modifiers, Skill levels with specialty preservation, Standard Damage, Fatigue Damage, movement rates, Initiative mode, modeled Toughness, and catalog effect status. Skill TN/Complexity and active or conditional equipment effects remain explicit unsupported/inert data where the current catalog/model lacks all dependencies. The 84-record catalog and stable IDs are unchanged.
