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

## Slice 77 Infantry/Anti-Mech audit and current remaining state

Infantry/Anti-Mech requires the actual Infantry Field and WIL 5+. Its six fixed Skills are Acrobatics/Gymnastics, Demolitions, Perception, Security Systems/Electronic, Technician/Mechanical, and Technician/Myomer. At the Stage 3 rate it costs 144 XP and grants +30 XP to each Skill. Military Academy and Family Training offer it as Special for two years; Military Enlistment offers it as Special for one year. Solaris does not offer or waive it. The v4.0 errata contains no applicable correction.

The complete staged school selection is evaluated together, so Infantry selected in the same school transaction satisfies the prerequisite when Continue commits the selection. Component Skills and a Master Skill Field goal do not substitute for acquired Field state. Tactical Anti-'Mech attack and conversion rules are outside Field acquisition.

The reference catalog remains 56 and the mechanical catalog is now 46. The ten current reference-only Fields are HPG Technician; Pilot - Aerospace (Civilian); Pilot - Aerospace (Combat); Pilot - Aircraft (Combat); Clan Aerospace Warrior; Clan Basic Training; Clan Cavalry; Clan Elemental; Clan MechWarrior; and Clan ProtoMech Warrior. Their Slice 76 classifications and blockers remain unchanged except that Infantry - Anti-Mech is no longer reference-only. The queued Ready Fields remain the three Pilot Fields. Pilot - Aerospace (Civilian), the sole Technical College basic offer, is the recommended next bounded target; this recommendation is not implementation authority.

## Slice 78 pilot audit and current remaining state

Pilot/Aerospace (Civilian) requires DEX 3+, RFL 4+, and INT 3+. It has six fixed Skills, costs 144 XP, and is offered only by Technical College as Basic for one year. Pilot/Aerospace (Combat) requires Basic Training or Basic Training (Naval), DEX 4+, and RFL 4+; its seven fixed Skills cost 168 XP. Pilot/Aircraft (Combat) requires the same alternative Field prerequisite, DEX 4+, and RFL 3+; its five fixed Skills cost 120 XP. Both combat Fields are offered by Military Academy as Advanced for one year and Family Training as Advanced for 1.5 years. None has a TDS restriction or variable choice. The v4.0 errata contains no applicable correction.

The similarly named Civilian Fields are not prerequisites for either combat Field. Actual Basic Training ownership is required, while component Skills and a Master Skill Field goal do not substitute. A Basic Training Field selected in the same school transaction satisfies the dependency under the established staged-selection semantics.

The reference catalog remains 56 and the mechanical catalog is now 49. The seven current reference-only Fields are HPG Technician; Clan Aerospace Warrior; Clan Basic Training; Clan Cavalry; Clan Elemental; Clan MechWarrior; and Clan ProtoMech Warrior. All remain blocked by unimplemented affiliation, Clan-schooling, phenotype, branching, or implant dependencies. No further non-Clan Ready Field remains in the audited reference-only set.

## Alpha Slice 79 affiliation re-evaluation

Committed ComStar and Word of Blake order affiliations now satisfy exact generic affiliation predicates. HPG Technician's prior affiliation blocker is therefore removed for those characters, but the Field remains reference-only because Slice 79 does not authorize its Field/school implementation. It is the next bounded non-Clan dependency target. The six Clan Fields remain blocked. Reference Fields remain 56 and mechanical Fields remain 49.

## Alpha Slice 81 — HPG Technician resolution

HPG Technician is mechanical through Trade School and University as an Advanced two-year Field. Its prerequisite is `(ComStar OR Word of Blake OR Clan) AND Communications Field`; exact committed affiliation identity and actual Field acquisition are required, while component Skills and goal selection do not substitute. ComStar and Word of Blake order affiliations now satisfy the two implemented branches. Clan remains a valid but currently unavailable branch. The source lists five Field Skills, producing a 120-XP reduced cost and +30 XP per Skill. The six remaining reference-only entries are Clan Aerospace Warrior, Clan Basic Training, Clan Cavalry, Clan Elemental, Clan MechWarrior, and Clan ProtoMech Warrior. Reference Fields remain 56 and mechanical Fields are 50.
