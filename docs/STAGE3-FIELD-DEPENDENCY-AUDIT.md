# Stage 3 Skill Field dependency audit

Alpha Slice 76 re-audits the spacecraft-pilot dependency chain against the Corrected Third Printing Master Skill Fields (pp. 93–94), implemented Stage 3 school offers (pp. 82–83), and v4.0 errata. The independent reference catalog remains 56 entries. Pilot/DropShip, Pilot/JumpShip, and Pilot/WarShip increase the mechanical catalog from 42 to 45. Equipment remains 84 unique stable IDs.

“Ready” means the Field's current source prerequisites and Skill awards fit established mechanics; it does not authorize mass promotion. “Blocked” names the dependency still absent from the implemented character-creation scope. All variable destinations remain explicit and no-default.

## Slice 75 Pilot/Battle Armor audit

Pilot/Battle Armor requires the Infantry Field, STR 6+, and BOD 5+. It has six fixed Field Skills: Climbing, Gunnery/Battlesuit, Martial Arts, Piloting/Battlesuit, Sensor Operations, and Tactics/Land. At the Stage 3 rate it costs 144 XP and grants +30 XP to each Skill. It is offered by Solaris Internship as Advanced (two years), Military Academy as Special (two years), and Family Training as Special (two years); Military Enlistment does not offer it.

The Solaris school note waives only the Infantry Field prerequisite for this acquisition. It neither grants Infantry nor changes the STR/BOD requirements. The waiver is durable, source-module-scoped provenance and is rejected on any other school or Field. The Companion's untrained battlesuit-operation rule governs tactical play by characters without Piloting/Battlesuit; it does not alter Field acquisition. The Companion errata's Advanced Battle Armor Combat Record Sheet correction likewise does not change this Field.

## Slice 76 spacecraft-pilot dependency audit

Pilot/DropShip requires DEX 4+, INT 3+, WIL 3+, and absence of TDS. Its six fixed Skills cost 144 XP and receive +30 XP each. Pilot/JumpShip requires the actual Pilot/DropShip Field, INT 5+, and absence of TDS; its five fixed Skills cost 120 XP. Pilot/WarShip requires the actual Pilot/DropShip Field, DEX 4+, INT 6+, and absence of TDS; its seven fixed or affiliation-bound Skills cost 168 XP. Component Skills and a Master Skill Field goal do not substitute for acquired Field state.

DropShip is offered by Technical College as Basic for one year, Military Academy as Advanced for one year, and Family Training as Advanced for 1.5 years. JumpShip is offered by Technical College as Advanced for two years and by Military Academy and Family Training as Special for two years. WarShip is offered only by Military Academy as Special for two years. The v4.0 errata adds Pilot/WarShip to Military Academy's Special list; the Corrected Third Printing already incorporates it. Both dependent Fields therefore have no remaining blocker and are promoted with DropShip. The complete staged school selection is evaluated together, so a same-school DropShip grant satisfies JumpShip or WarShip in that single Continue transaction while preview remains uncommitted.

## Exhaustive remaining reference-only audit (11)

| Field | Source school offer(s) | Classification | Current reason |
|---|---|---|---|
| HPG Technician | Trade School advanced; University advanced | Blocked by affiliation | Requires ComStar, Word of Blake, or Clan affiliation; no supported Stage 0 context can satisfy it. |
| Pilot - Aerospace (Civilian) | Technical College basic | Ready | Fixed prerequisites and six fixed Skills are representable. |
| Infantry - Anti-Mech | Military Academy special; Military Enlistment special; Family Training special | Ready | Infantry, WIL, and fixed Skill dependencies are represented. |
| Pilot - Aerospace (Combat) | Military Academy advanced; Family Training advanced | Ready | Basic Training alternative, Attributes, and fixed Skills are represented. |
| Pilot - Aircraft (Combat) | Military Academy advanced; Family Training advanced | Ready | Basic Training alternative, Attributes, and fixed Skills are represented. |
| Clan Aerospace Warrior | No implemented school | Blocked by affiliation/phenotype | Clan affiliation and phenotype path are outside the implemented scope. |
| Clan Basic Training | No implemented school | Blocked by affiliation | Clan affiliation and schooling are outside the implemented scope. |
| Clan Cavalry | No implemented school | Blocked by affiliation/branching | Clan affiliation and source branch rules are outside the implemented scope. |
| Clan Elemental | No implemented school | Blocked by affiliation/phenotype | Clan affiliation and Elemental phenotype are outside the implemented scope. |
| Clan MechWarrior | No implemented school | Blocked by affiliation/phenotype | Clan affiliation and phenotype path are outside the implemented scope. |
| Clan ProtoMech Warrior | No implemented school | Blocked by affiliation/phenotype/implants | Clan affiliation, phenotype, and implant systems are outside the implemented scope. |

The strongest bounded next target is Infantry - Anti-Mech. It is source-ready, uses a represented Infantry prerequisite plus fixed Skills, and is offered by three implemented schools. That recommendation is not implementation authority.

Existing open-subject, closed-domain, affiliation-bound, named-option, family, preview/Continue, persistence, and prerequisite-governance decisions remain unchanged. Stable IDs are preserved; no equipment or affiliation data changed.
