# Alpha Slice 165-B10

Slice 165-B10 corrects the Trueborn Sibko MechWarrior flexible-XP award from 150 XP to the source-defined 50 XP. The Corrected Third Printing, p. 79, assigns +150 XP to Aerospace and standard Elemental branches, but +50 XP to Advanced Elemental and MechWarrior branches. No applicable v4.0 erratum changes that distinction.

The correction preserves the single `sibko.flexible` award, the 1,600-XP Trueborn Sibko module cost, age 16 completion, the six Clan MechWarrior Field Skills at +80 XP each, and the 384-XP Field purchase cost. Existing final-design prerequisite handling remains unchanged: the combined Sibko and Clan MechWarrior requirements are Clan affiliation, MechWarrior Phenotype, BOD 4, DEX 4, RFL 4, and WIL 5, with numeric requirements deferred until final validation.

Regression coverage verifies the exact pending amount, legal 50-XP resolution, rejected and atomic over-allocation, one grant with canonical provenance, persistence through internal encode/decode, and unchanged readiness protections. Existing source-incorrect Clan fixtures now allocate 50 XP. Freeborn Sibko remains outside the implemented player-facing catalog and is unchanged; its source-defined MechWarrior award remains 150 flexible XP with a six-Skill +50 XP Field purchased for 240 XP.

Historical internal records that already contain the incorrect 150-XP grant are not silently rewritten. Migration or compatibility handling for those records remains deferred pending separate authorization. Public Clan creation, Clan readiness, and public Clan import remain disabled.
