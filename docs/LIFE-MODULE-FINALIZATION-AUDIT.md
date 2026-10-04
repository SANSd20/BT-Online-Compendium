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
