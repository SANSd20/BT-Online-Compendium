# Stage 3 Skill Field dependency audit

Alpha Slice 68 audits every entry that was reference-only at the Alpha Slice 67 checkpoint against the Corrected Third Printing Master Skill Fields list (pp. 92–95), the implemented Stage 3 school offers (pp. 82–83), and the v4.0 errata. “Modeled bounded” means the UI presents only concrete values already governed by current character-creation data; it is not a claim that those values exhaust the setting.

## Governance decisions

| Choice family | Classification | Mechanical policy |
|---|---|---|
| Technician, Security Systems, Driving, Tactics, Tracking, Thrown Weapons, MedTech, Surgery | Closed canonical | Present the complete published subskill set; never preselect. |
| Language/Any | Modeled bounded subset | Present the ten concrete languages already sourced by current character creation; never preselect. |
| Protocol/Any, Streetwise/Any | Affiliation-constrained modeled subset | Derive choices from supported affiliation contexts (currently Capellan and FedSuns); never bind `/Any` automatically. |
| Protocol/Affiliation, Streetwise/Affiliation | Affiliation-bound | Resolve from the character’s committed affiliation. |
| Piloting/Air Vehicle or VTOL; Career/Pilot or Ship’s Crew | Named source option set | Present only the choices named by the Field. |
| Career/Any, Interest/Any, Science/Any, Survival/Any | Open / GM-defined | Accept a validated explicit subject with a fixed parent Skill; examples are not converted into a fabricated exhaustive list. |

## Exhaustive prior reference-only audit (36)

| Field | Category | Implemented school offer(s) | Dependency assessment | Slice 68 result |
|---|---|---|---|---|
| Anthropologist | Civilian | None | General Studies prerequisite; Interest/History culture and Protocol/Any include open/unimplemented dependencies | Reference-only: blocked |
| Archaeologist | Civilian | None | General Studies prerequisite; Interest/History culture is open | Reference-only: blocked |
| Communications | Civilian | Technical basic; Police advanced | Protocol/Any is affiliation-constrained and modeled | Mechanical |
| Doctor | Civilian | Military Academy special | Medical Assistant dependency is promoted; MedTech and Surgery are closed; Protocol/Affiliation is automatic | Mechanical |
| Engineer | Civilian | Technical advanced | Technician prerequisite is implemented; Technician/Any is closed | Mechanical |
| General Studies | Civilian | None | Career/Any and Interest/Any are open; cross-field structural requirement | Reference-only: blocked |
| HPG Technician | Civilian | None | Communications dependency becomes available, but school offer is not implemented | Reference-only: blocked |
| Journalist | Civilian | None | Fixed data is representable, but no implemented school offers it | Reference-only: ready, not offered |
| Lawyer | Civilian | None | General Studies prerequisite and Protocol/Any | Reference-only: blocked |
| Manager | Civilian | None | Fixed data is representable, but no implemented school offers it | Reference-only: ready, not offered |
| Medical Assistant | Civilian | Military Enlistment advanced | MedTech/Any is closed | Mechanical |
| Merchant | Civilian | None | Protocol/Any and Streetwise/Any are modeled, but no implemented school offers it | Reference-only: ready, not offered |
| Merchant Marine | Civilian | Technical advanced | Protocol/Any modeled; Technician/Any closed | Mechanical |
| Pilot - Aerospace (Civilian) | Civilian | Technical basic | Fixed data is representable; excluded from this dependency-driven promotion | Reference-only: ready |
| Pilot - Aircraft (Civilian) | Civilian | Technical basic | Source names Air Vehicle or VTOL as a finite choice | Mechanical |
| Pilot - DropShip | Civilian | Technical basic; Military Academy advanced | Fixed data is representable; excluded from this dependency-driven promotion | Reference-only: ready |
| Pilot - JumpShip | Civilian | Military Academy special | Requires Pilot - DropShip, which remains reference-only | Reference-only: blocked |
| Planetary Surveyor | Civilian | None | Scientist and Survival are representable, but no implemented school offers it | Reference-only: ready, not offered |
| Politician | Civilian | None | Manager prerequisite; no implemented school offer | Reference-only: blocked |
| Scientist | Civilian | Military Academy advanced | Interest/Any and Science/Any use validated open subjects | Mechanical in Slice 69 |
| Analysis | Intelligence/Police | Police advanced; Intelligence advanced; Military Academy advanced | Two distinct modeled Language choices plus closed Tactics choice | Mechanical |
| Covert Operations | Intelligence/Police | Police special; Intelligence advanced | Modeled Language, Protocol and Streetwise choices; Tracking closed | Mechanical |
| Police Tactical Officer | Intelligence/Police | Police special; Intelligence special; Military Enlistment special | Police Officer prerequisite implemented; Thrown Weapons closed | Mechanical |
| Infantry - Anti-Mech | Military | Military Academy/Enlistment special | Fixed data is representable; excluded from this dependency-driven promotion | Reference-only: ready |
| Military Scientist | Military | Military Academy special | Analysis dependency promoted; Tactics/Any closed | Mechanical |
| Pilot - Aerospace (Combat) | Military | Military Academy advanced | Fixed data is representable; excluded from this dependency-driven promotion | Reference-only: ready |
| Pilot - Aircraft (Combat) | Military | Military Academy advanced | Fixed data is representable; excluded from this dependency-driven promotion | Reference-only: ready |
| Pilot - Battle Armor | Military | Military Academy special | Fixed data is representable; excluded from this dependency-driven promotion | Reference-only: ready |
| Pilot - WarShip | Military | Military Academy special | Requires Pilot - DropShip, which remains reference-only | Reference-only: blocked |
| Special Forces | Military | Police/Intelligence/Military schools | Survival/Any uses a validated open environment; Tracking/Any is closed | Mechanical in Slice 69 |
| Clan Aerospace Warrior | Clan | None | Clan affiliation and phenotype systems not implemented | Reference-only: blocked |
| Clan Basic Training | Clan | None | Clan affiliation system not implemented | Reference-only: blocked |
| Clan Cavalry | Clan | None | Clan affiliation plus source branching not implemented | Reference-only: blocked |
| Clan Elemental | Clan | None | Clan affiliation and phenotype systems not implemented | Reference-only: blocked |
| Clan MechWarrior | Clan | None | Clan affiliation and phenotype systems not implemented | Reference-only: blocked |
| Clan ProtoMech Warrior | Clan | None | Clan affiliation, phenotype, and implant systems not implemented | Reference-only: blocked |

The independent reference catalog remains 56 entries. Slice 68 promoted ten Fields; Slice 69 promotes Scientist and Special Forces, bringing the mechanical catalog to 32. No existing stable IDs, equipment data, affiliation defaults, persistence boundary, XP rule, or OCS behavior changed.
