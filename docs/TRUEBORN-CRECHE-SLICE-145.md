# Trueborn Crèche — Alpha Slice 145

Slice 145 adds an internal executable transaction for the source-defined Trueborn Crèche Stage 1 module. Clan character creation and Clan readiness remain disabled in the player-facing application.

The Corrected Third Printing, p. 76, defines a 300 XP module requiring Clan affiliation plus Phenotype and Trueborn Traits. The source contract is represented for Aerospace, Elemental, and MechWarrior Phenotypes. The exact awards are STR +100, BOD +125, RFL +125, WIL +100, CHA −75; Compulsion/Clan Honor −100, Phenotype +0, Slow Learner −300, Trueborn +200; Interest/Clan Remembrance +10, Martial Arts +10, Melee Weapons +5, Protocol/Clan +10, Small Arms +5, and Swimming +10.

The module also provides five separate flexible awards of +15 XP. The internal transaction requires five explicit concrete Attribute, Trait, or Skill destinations and commits them atomically with the fixed awards. It records the canonical `stage1.trueborn-creche` history entry, 300 XP cost, +10 years chronology, and p. 76 provenance. Stage 0 Clan package history is required; fabricated history is rejected.

The resulting committed history is the prerequisite consumed by the existing Trueborn Sibko MechWarrior transaction. This slice does not add Sibko awards, activate Clan UI, or remove the Clan readiness blocker.
