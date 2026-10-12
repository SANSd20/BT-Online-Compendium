# Clan Affiliation and Caste Package Audit — Alpha Slice 119

The authoritative Corrected Third Printing defines Invading Clan (75 XP) and Homeworld Clan (50 XP) on printed pp. 70–71. The Homeworld category has eight named sub-affiliations: Blood Spirit, Cloud Cobra, Coyote, Fire Mandrill, Goliath Scorpion, Ice Hellion, Star Adder, and Steel Viper. Printed p. 71 defines ten caste/sub-caste award packages: MechWarrior, Elemental, Elemental-Advanced, Aerospace or ProtoMech, Aerospace-Naval, Warrior Caste (Other), Scientist, Technician, Merchant, and Laborer.

This slice records the source package inventory and fixed award summaries in `src/domain/character/clanPackages.ts`. Records are deliberately `unsupported`: no package can be selected, no award is applied, and no XP is spent. This preserves the Slice 118 readiness blocker and does not activate Clan character creation.

The package rules depend on Clan Phenotypes, Field Aptitude and Clan Fields, Clan-specific Skill/Trait subject choices, Clan Life Modules, chronology/service era, and other source restrictions not yet supported by the creator. Alpha Slice 165-A represents all eight Homeworld identities and their complete fixed award and choice catalog in `HOMEWORLD_CLAN_PACKAGES`, while retaining `unsupported` status. No package is executable or selectable.

Source: A Time of War — Corrected Third Printing, pp. 63, 70–74; applicable v4.0 errata reviewed with no conflicting correction identified for these packages.
