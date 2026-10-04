# Stage 3 Skill Field dependency audit

Alpha Slice 75 re-audits every Field that remains reference-only against the Corrected Third Printing Master Skill Fields (pp. 92–95), implemented Stage 3 school offers (pp. 82–83), and v4.0 errata. The independent reference catalog remains 56 entries. Pilot/Battle Armor is the only Slice 75 promotion, increasing the mechanical catalog from 41 to 42. Equipment remains 84 unique stable IDs.

“Ready” means the Field's current source prerequisites and Skill awards fit established mechanics; it does not authorize mass promotion. “Blocked” names the dependency still absent from the implemented character-creation scope. All variable destinations remain explicit and no-default.

## Slice 75 Pilot/Battle Armor audit

Pilot/Battle Armor requires the Infantry Field, STR 6+, and BOD 5+. It has six fixed Field Skills: Climbing, Gunnery/Battlesuit, Martial Arts, Piloting/Battlesuit, Sensor Operations, and Tactics/Land. At the Stage 3 rate it costs 144 XP and grants +30 XP to each Skill. It is offered by Solaris Internship as Advanced (two years), Military Academy as Special (two years), and Family Training as Special (two years); Military Enlistment does not offer it.

The Solaris school note waives only the Infantry Field prerequisite for this acquisition. It neither grants Infantry nor changes the STR/BOD requirements. The waiver is durable, source-module-scoped provenance and is rejected on any other school or Field. The Companion's untrained battlesuit-operation rule governs tactical play by characters without Piloting/Battlesuit; it does not alter Field acquisition. The Companion errata's Advanced Battle Armor Combat Record Sheet correction likewise does not change this Field.

## Exhaustive remaining reference-only audit (14)

| Field | Source school offer(s) | Classification | Current reason |
|---|---|---|---|
| HPG Technician | Trade School advanced; University advanced | Blocked by affiliation | Requires ComStar, Word of Blake, or Clan affiliation; no supported Stage 0 context can satisfy it. |
| Pilot - Aerospace (Civilian) | Technical College basic | Ready | Fixed prerequisites and six fixed Skills are representable. |
| Pilot - DropShip | Technical College basic; Military Academy advanced; Family Training advanced | Ready | Fixed prerequisites and six fixed Skills are representable. |
| Pilot - JumpShip | Technical College advanced; Military Academy special; Family Training special | Blocked by prerequisite Field | Requires Pilot - DropShip, which remains reference-only. |
| Infantry - Anti-Mech | Military Academy special; Military Enlistment special; Family Training special | Ready | Infantry, WIL, and fixed Skill dependencies are represented. |
| Pilot - Aerospace (Combat) | Military Academy advanced; Family Training advanced | Ready | Basic Training alternative, Attributes, and fixed Skills are represented. |
| Pilot - Aircraft (Combat) | Military Academy advanced; Family Training advanced | Ready | Basic Training alternative, Attributes, and fixed Skills are represented. |
| Pilot - WarShip | Military Academy special | Blocked by prerequisite Field | Requires Pilot - DropShip, which remains reference-only. |
| Clan Aerospace Warrior | No implemented school | Blocked by affiliation/phenotype | Clan affiliation and phenotype path are outside the implemented scope. |
| Clan Basic Training | No implemented school | Blocked by affiliation | Clan affiliation and schooling are outside the implemented scope. |
| Clan Cavalry | No implemented school | Blocked by affiliation/branching | Clan affiliation and source branch rules are outside the implemented scope. |
| Clan Elemental | No implemented school | Blocked by affiliation/phenotype | Clan affiliation and Elemental phenotype are outside the implemented scope. |
| Clan MechWarrior | No implemented school | Blocked by affiliation/phenotype | Clan affiliation and phenotype path are outside the implemented scope. |
| Clan ProtoMech Warrior | No implemented school | Blocked by affiliation/phenotype/implants | Clan affiliation, phenotype, and implant systems are outside the implemented scope. |

The strongest bounded next target is Pilot - DropShip. It is source-ready, uses fixed Skills, is offered by three already implemented schools, and unlocks the separately audited Pilot - JumpShip and Pilot - WarShip dependency chain. That recommendation is not implementation authority.

Existing open-subject, closed-domain, affiliation-bound, named-option, family, preview/Continue, persistence, and prerequisite-governance decisions remain unchanged. Stable IDs are preserved; no equipment or affiliation data changed.
