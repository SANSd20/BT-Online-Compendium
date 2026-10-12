# Alpha Slice 165-A — Homeworld Clan sub-affiliation foundation

The Corrected Third Printing, printed p. 70, defines eight Homeworld Clan identities: Blood Spirit, Cloud Cobra, Coyote, Fire Mandrill, Goliath Scorpion, Ice Hellion, Star Adder, and Steel Viper. The v4.0 Errata contains no entries for those names or the Homeworld/Invading Clan categories.

`src/domain/character/clanIdentity.ts` provides canonical specific identity IDs beneath `affiliation.clan`. `src/domain/character/clanPackages.ts` provides `HOMEWORLD_CLAN_PACKAGES`, including every fixed Attribute, Trait, and Skill award, negative award, required governed choice, source citation, and conditional restriction recovered from the source table.

All records remain `unsupported`. The catalog is an identity and provenance foundation, not an executable transaction. Deferred dependencies include Clan Phenotypes and Field Aptitude, caste and service-era restrictions, concrete Skill/Trait choice resolution, Clan Fields, and Clan Life Modules. Player-facing Clan selection, readiness, and public Clan import remain disabled.

Required choices represented include Cloud Cobra’s additional Skill, Coyote’s Trait, Fire Mandrill’s Attribute allocation/Trait/two Skills, Goliath Scorpion’s Trait, and Star Adder’s Compulsion. Fire Mandrill secondary-language restrictions and Goliath Scorpion language/caste restrictions are preserved as conditional metadata.

Next work remains Slice 165-B/C: integrate these governed records into internal transactions and persistence, then add a separately authorized, source-complete selection/navigation layer. Catalog presence must not be treated as mechanical support or player-facing availability.
