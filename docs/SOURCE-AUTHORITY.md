# Source Authority and Provenance

## Character Generator rules scope

Current scope is **Core + Companion only**:

| Role | Source |
|---|---|
| Primary | *A Time of War — Corrected Third Printing* |
| Errata | *A Time of War Errata v4.0* |
| Supplemental | *A Time of War Companion — First Printing Corrected with Errata v1.1* |
| Historical comparison only | *A Time of War — First Printing*, when required to identify changed or removed rules |

Applicable errata—including *A Time of War Companion Errata v1.1*—must be accounted for automatically. The Corrected Third Printing remains the normal Core authority unless an established audit finding explicitly records otherwise. Historical comparison material does not displace current authority.

Rules and derived results must preserve source/provenance information.

The Alpha rules catalog records these three current sources as versioned metadata and captures them in each new character's creation-rules snapshot. Alpha Slice 2 adds the eight published Core archetype packages from Corrected Third Printing pages 52–59. Alpha Slice 3 adds the focused Point Buy foundation from Core pages 49, 51, 60, 95, 107, and 121–122. Alpha Slices 4–9 establish the narrow Life Module path through final review. Alpha Slice 10 adds Final Touches and Issued Gear foundations. Alpha Slice 11 adds the supplied 17-item starter catalog. Alpha Slice 12 adds the supplied second 17-item batch from printed pages 267–269, 286, and 288 plus the supplied affiliation-access rules. Alpha Slice 13 adds the supplied 24-record batch from printed pages 302–304, 308, 310, and 313, yielding 21 net-new current entries and audited replacements for three existing medical stable IDs. Alpha Slice 14 adds the supplied 20-item communications, remote-sensor, power/recharger, and field-gear batch from printed pages 301, 305, 306, and 312. Alpha Slice 15 adds no equipment or source content; it hardens the existing catalog and truthfully marks the 14 Slice 11 records whose raw printed triplets were not supplied in their audited handoff. Alpha Slice 16 reconciles those 14 records from the supplied audit, including page-306 source labels for the two power-pack records, without adding equipment or changing stable IDs. Alpha Slice 17 adds the supplied six-record non-combat attire/leatherwear batch from printed page 299. Alpha Slice 18 canonicalizes the existing Power Pack, Clan ID and adds three net-new Clan pack rows from printed page 306. Alpha Slices 19–20 add no source, rule, module, Skill Field, Trait, or equipment data; they change only Public Alpha presentation, versioning, tests, metadata, documentation, and GitHub Pages static deployment configuration. These slices do not add Companion templates or complete Life Module, Skill Field, or equipment catalogs. The historical First Printing is not included in the active runtime catalog.

AToW Errata v4.0 was checked against the selected Alpha Slice 4 modules. No erratum changes the implemented Capellan Confederation/Capellan Commonality, Blue Collar, or Back Woods data. Nearby Independent/Astrokaszy and extreme-gravity corrections are outside this minimal set.

AToW Errata v4.0 was also checked during the supplied Alpha Slice 6 rules audit. No erratum changes the implemented Stage 2 Back Woods or High School data; the nearby Military School/Military Academy correction remains outside this slice.

The supplied Alpha Slice 7 audit likewise records no erratum affecting Technical College or its two implemented Technician Fields.

Alpha Slice 60 audited corrected-printing pp. 80–83 and the Military Skill Fields on p. 94. Military Academy is 830 XP plus Field costs; Military Enlistment is 720 XP plus Field costs. Both follow the Stage 3 rule of exactly one Basic Field, at least one Advanced Field, no more than three total, +30 XP to every component Skill at a cost of 24 XP per Skill, and source-listed Field time. Academy's published conditional entry adjustment applies when neither Preparatory School nor Military School was taken in Stage 2. The v4.0 errata adds Pilot/WarShip to Military Academy's Special list; the corrected third printing already contains that entry, so no mechanical delta is required. Slice 60 mechanically exposes only Basic Training and Infantry from these military lists; the complete source-offered lists remain visible as reference-only metadata.

Alpha Slice 61 re-audited corrected-printing pp. 80–83, 92–95, the worked MechWarrior example on p. 81, and the Technician Skill definition on pp. 157–158, plus v4.0 errata. MechWarrior is an Advanced Military Academy Field requiring Basic Training, DEX 4+, and RFL 4+. It grants +30 XP each to Gunnery/Mech, Piloting/Mech, Sensor Operations, Tactics/Land, and one explicitly selected Technician subskill, for a reduced 120-XP Field cost and one year. The canonical Technician options are Aeronautics, Cybernetics, Electronic, Jets, Mechanics, Myomer, Nuclear, and Weapons. The errata contains no MechWarrior or Technician/Any change.

Alpha Slice 62 audited corrected-printing pp. 80–83 and 92–95 plus the Security Systems and Technician definitions on pp. 153 and 157–158. Basic Training (Naval) requires Rank, INT 4+, RFL 3+, and no TDS; it has six Skills including an explicit Career/Pilot-or-Ship’s-Crew choice and costs 144 XP. Marine requires Basic Training (Naval) and no TDS, has five Skills including an Electronic-or-Mechanical Security Systems choice, and costs 120 XP. Ship’s Crew requires Basic Training (Naval), RFL 3+, and no TDS, has five Skills including Technician/Any, and costs 120 XP. Technician/Military requires INT 3+ and DEX 3+, has six fixed Skills, and costs 144 XP. Academy offers the first three at one year per Field; Enlistment offers all four with 0.5 years for Basic and 1.5 years for Advanced. The repetition rule on p. 81 permits another Stage 3 school only from a different Civilian, Intelligence/Police, or Military general type and excludes secondary Officer Training from that restriction. Errata v4.0 changes none of these Fields or repetition rules; its Military Academy Pilot/WarShip addition is already present in the corrected printing.

Alpha Slice 63 audited Cavalry and Scout on corrected-printing pp. 83–94 and the Driving, Gunnery, Language, Security Systems, Streetwise, Tactics, and Tracking definitions on pp. 146–159. Cavalry requires Basic Training and DEX 3+; its six Skills are Artillery, Driving/Any, Gunnery/Any Vehicle, Sensor Operations, Tactics/Land or Sea, and Technician/Mechanical. Driving resolves from Ground Vehicles, Rail Vehicles, or Sea Vehicles; vehicle Gunnery resolves from the source’s Air Vehicle, Ground Vehicle, or Sea Vehicle subskills; Tactics resolves to Land or Sea. The table states no linkage among those separately listed choices. Cavalry costs 144 XP and is offered by Academy for one year and Enlistment for 1.5 years. Scout requires Basic Training, INT 4+, WIL 3+, and no Illiterate Trait; its seven Skills are Comms/Conventional, Disguise, Language/Any, Security Systems/Any, Stealth, Streetwise/Any, and Tracking/Any. Language/Any is genuinely open to any specific language, so Scout remains reference-only rather than receiving an invented bounded language list. Errata v4.0 contains no Cavalry or Scout correction.

Slice 62 candidate dependency classifications are: **Cavalry — DEFER**, because its restricted Gunnery/Any Vehicle alternatives require a governed vehicle-choice mapping not present in the current bounded catalogs; **Marine — BOUNDED DEPENDENCY**, implemented after adding Basic Training (Naval) and the two canonical Security Systems subskills; **Scout — DEFER**, because its four variable components include unrestricted Language/Any and affiliation-sensitive Streetwise/Any; **Ship’s Crew — BOUNDED DEPENDENCY**, implemented after adding Basic Training (Naval) and reusing canonical Technician options; and **Technician/Military — READY**, implemented directly with six fixed Skills. No Field was weakened to change its classification.

The supplied Alpha Slice 8 audit records no erratum affecting Agitator or the implemented Stage 4 Real Life rules. No fresh PDF transcription was performed for Slice 8; the handoff's audited values and no-page source identifiers were preserved without inventing page citations.

Alpha Slice 9 uses the supplied audited final-validation and Optimization rules basis. No fresh PDF transcription was performed. Final allocation and Optimization results retain a Core rules source identifier plus per-action provenance, while unsupported or partially modeled rules remain explicitly deferred.

Alpha Slice 10 uses the supplied audited Final Touches and equipment rules basis. No fresh PDF transcription was performed. Final Touches entry, manual items, ownership, and optional-rule state retain Core source identifiers and provenance; full catalogs and deferred adjustments are not inferred.

Alpha Slice 11 uses the supplied audited starter-equipment addendum. No PDF inspection or fresh transcription was performed. Catalog source keys cover the supplied Corrected Third Printing page references and Final Touches example source; three medical items remain explicitly `example-backed` with null ratings rather than inferred table data.

Alpha Slice 12 uses the supplied audited catalog batch and corrected rating-normalization rule. No PDF inspection or fresh transcription was performed. Raw printed ratings are preserved exactly. Normalized Availability is hand-audited item by item and need only occur within the raw triplet; the full era/market meaning of that triplet remains unresolved and is not inferred.

Alpha Slice 13 uses only the supplied audited Batch 3 data; no PDF inspection or fresh transcription was performed. It continues the same raw-rating and hand-audited normalization rule. The page-313 Medical Kit, Medipatch, and Stimpatch definitions supersede the active catalog values under their existing stable IDs, while already-saved inventory retains its purchase-time source and rating snapshot.

Alpha Slice 14 uses the supplied audited Batch 4 addendum after a bounded source-table inspection established that item selection and normalized Availability required explicit project authority. The addendum's stable IDs and normalized ratings are authoritative. Raw ratings and Availability triplets remain exact, no positional Availability rule is inferred, and operational details remain metadata only.

Alpha Slice 16 uses only the supplied 14-record legacy-rating backfill; no PDF inspection or fresh transcription was performed. All current catalog records now preserve supplied raw ratings and Availability triplets. Historical normalized-only purchase snapshots remain valid and are not rewritten to current catalog data.

Alpha Slice 17 uses only the supplied six-record page-299 clothing addendum; no PDF inspection or fresh transcription was performed. Raw ratings, hand-audited normalized ratings, source references, and stable IDs are preserved as supplied. BAR, coverage, front-only facing, and the Leather Gloves DEX-related penalty remain inert metadata.

Alpha Slice 18 uses only the revised supplied page-306 Clan power-pack handoff; no PDF inspection or fresh transcription was performed. The existing Power Pack, Clan record retains its display name and hand-audited normalized `F/B/A` rating under canonical ID `core.power.clan.powerPack.standard`; three net-new Clan pack records preserve the supplied raw ratings, normalized ratings, source, and `CLAN` affiliation. A possible future audit of the existing Power Pack, Clan normalized Availability remains deferred rather than being silently changed.

AToW Errata v4.0 was checked for corrections to the Point Buy starting allotment, Attribute/Trait costs, Skill XP table, and negative-Trait limit; no applicable correction to those rules was identified. The Corrected Third Printing values therefore remain authoritative for Point Buy v0.1.

For the eight implemented Core archetypes, Alpha Slice 28 establishes that the prose/package entries on pages 52–59 govern active creation-package values. Back-of-book sheets are supplemental sheet-ready references and conflict evidence; they do not automatically override the packages. The catalog preserves printed package values even when a sheet differs or line-item XP does not match the Core page 51 declaration that archetypes use 4,500 XP. Declared and calculated totals remain distinct, and discrepancies carry explicit source notes or durable governance documentation. Errata v4.0 contains no archetype-sheet correction that authorizes silently changing those values. See `ARCHETYPE-SOURCE-GOVERNANCE.md` and `archetype-sheet-cross-check.md`.

Tactical Operations, Interstellar Operations, and other available BattleTech books are not authorized to expand or alter current Character Generator rules scope. Their availability as project material does not make them governing Character Generator sources.

When a published ambiguity or conflict is unresolved, preserve it as unresolved instead of inventing application behavior.

## Rules provenance

Rules objects, awards, resolutions, and derived results should retain stable source identities and sufficient detail to trace a result to the governing source. Resolved `/Any` and `/Affiliation` selections must retain both their concrete resolution and source provenance.

Historical creation rules and current campaign/play rules are different provenance concerns. A saved character may need the rules/source snapshot that produced its creation result while also operating under a later current campaign profile. Changing current rules must not silently recalculate or rewrite historical creation results; a rebuild or recalculation is explicit.

Manual GM decisions are not source facts. Future architecture must distinguish:

- imported/published fact;
- compendium-derived result;
- manual GM decision or override.

## Planetary upstream source

The established upstream planetary source is [MegaMek/mm-data](https://github.com/MegaMek/mm-data), principally:

`data/universe/planetary_systems/`

including `canon_systems/` and `connector_systems/`.

The actual dataset now resides primarily in `mm-data`; MekHQ consumes it. Preserve the distinction between a **planetary system** and a **planet/world**. A system may contain multiple worlds, and a primary world is not necessarily the only possible character homeworld.

Planetary Layer 1 snapshots must identify at least:

- upstream repository;
- exact Git commit SHA;
- upstream path;
- original YAML;
- file identity/hash;
- import metadata;
- license/attribution metadata;
- `canon_system` versus `connector_system` source-path classification.

## Planetary value provenance

Upstream values may be bare, sourced, or sourced-and-versioned. Preserve `value`, `source`, and `version` rather than flattening them.

A source annotation does not automatically mean published BattleTech canon. Observed forms include publication citations, `canon`, SUCS plus version, and unsourced/generated/support values. Likewise, placement under `canon_systems/` means the system is a real BattleTech system; it does not prove every value in the file is a published canonical fact.

Do not silently substitute Sarna or another secondary source for upstream data, and do not convert “present in MegaMek” into “published canon.”

## Licensing status

MegaMek Data identifies itself as CC BY-NC-SA 4.0 and includes BattleTech/Microsoft notices. Every imported snapshot must preserve upstream attribution and license metadata.

Public redistribution and deployment licensing remain a later review item; the present research does not claim to resolve every legal question.

## Alpha Slice 64 — Language/Any and Scout

Corrected Third Printing p. 148 defines Language subskills as “any specific language”: each Language subskill identifies one language in the character’s repertoire. It describes a wide variety of languages and dialects but supplies no exhaustive catalog and no rule limiting Scout’s Language/Any choice to the character’s affiliation. The finite application list is therefore identified only as the currently modeled, source-backed character-creation subset; it is not represented as every legal BattleTech language. Affiliation-bound Language awards retain their separate automatic or constrained semantics. The v4.0 errata contains no Language or Scout correction.

The Scout entry on corrected-printing p. 94 requires Basic Training, INT 4+, WIL 3+, and no Illiterate Trait. Its seven Skills are Comms/Conventional, Disguise, Language/Any, Security Systems/Any, Stealth, Streetwise/Any, and Tracking/Any. Security Systems resolves to Electronic or Mechanical; Streetwise subskills are by affiliation and the current supported contexts are Capellan and FedSuns; Tracking resolves to Urban or Wilds. Corrected-printing p. 83 offers the same Scout Field as Advanced training through Military Academy for one year and Military Enlistment for 1.5 years. At 24 XP per seven Field Skills, Scout costs 168 XP and awards +30 XP to each Skill.

## Alpha Slice 65 — legal cross-family Stage 3 repetition

Corrected-printing pp. 80–83 were re-audited, especially “Repeating Stage 3” on p. 81 and the Master Schools List on pp. 82–83. A character may not repeat Stage 3 schooling from the same general family, but may take another school from a completely different family. Civilian contains Technical College, Trade School, University, and Solaris Internship; Intelligence/Police contains Police Academy and Intelligence Operative Training; Military contains Military Academy, Military Enlistment, and Family Training. Officer Training is a secondary addition available after Intelligence, Police, or Military schooling and is explicitly not counted against the family-reuse rule. Field time accumulates to determine age, and every school retains its normal full module and Field costs. The v4.0 errata contains no change to Stage 3 repetition, these family memberships, or Officer Training treatment.

## Alpha Slice 66 — Intelligence/Police Stage 3 foundation

Corrected-printing pp. 82–83 establish two distinct Intelligence/Police schools. Police Academy costs 680 XP plus Fields, has no prerequisites, and awards RFL +100, WIL +100, Connections +50, Rank +100, Reputation +100, Computers +15, Driving/Any +20, Protocol/Affiliation +25, Streetwise/Affiliation +30, and 140 flexible XP. It offers Police Officer as Basic at 0.5 years; Analysis, Communications, Detective, Intelligence, and Technician/Military as Advanced at one year; and Covert Operations, Police Tactical Officer, Special Forces, Technician/Aerospace, and Technician/Vehicle as Special at two years.

Intelligence Operative Training costs 760 XP plus Fields and requires INT 4+, WIL 5+, and Connections +2 TP or higher. It awards INT +100, WIL +150, any one Attribute +50, Alternate ID +50, Connections +200, In For Life -300, Rank +250, Wealth +50, Acting +20, Computers +20, Protocol/Affiliation +20, and 150 flexible XP. It offers Basic Training as Basic at one year; Analysis, Covert Operations, Detective, Intelligence, Police Officer, and Scout as Advanced at one year; and Police Tactical Officer and Special Forces as Special at two years.

Corrected-printing p. 93 supplies the promoted Fields. Police Officer requires WIL 3 and contains Acting, Career/Police, Driving/Any, Martial Arts, MedTech/General, Small Arms, and Streetwise/Affiliation. Detective requires WIL 4 plus either INT 4 or INT 3 with the Police Officer Field; it contains Career/Detective, Computers, Interrogation, Investigation, Perception, Security Systems/Any, and Streetwise/Affiliation. Intelligence uses the same prerequisite expression and contains Comms/Conventional, Computers, Cryptography, Language/Any, and Sensor Operations. These Fields cost 168, 168, and 120 XP respectively at the ordinary 24 XP per Skill.

Field dependency classification is source-driven. READY/reused or newly mechanical Fields are Police Officer, Detective, Intelligence, Basic Training, Scout, Technician/Military, Technician/Aerospace, and Technician/Vehicle. Analysis remains reference-only because it needs two unrestricted Language/Any destinations and Tactics/Any; Communications because Protocol/Any is not governed; Covert Operations because Protocol/Any, Streetwise/Any, and Tracking/Any are not fully governed; Police Tactical Officer because Thrown Weapons/Any is not governed; and Special Forces because Survival/Any and Tracking/Any are not fully governed. Goal/reference selection and component Skills do not substitute for an acquired prerequisite Field.

Officer Candidate School remains a separately purchased secondary addition after Intelligence, Police, or Military schooling, requires at least one Basic and one Advanced Field, grants the Officer Field and officer-rank access, and remains outside the normal family-repetition count. It is not implemented in Slice 66. The v4.0 errata contains no Police Academy, Intelligence Operative Training, promoted-Field, Officer Training, or Stage 3 correction.

## Alpha Slice 67 — Officer Candidate School

Corrected-printing pp. 80–83 establish Officer Candidate School as a special secondary addition to Stage 3 rather than a fourth normal family. A character must previously have used only Intelligence/Police or Military schooling and must possess at least one Basic and one Advanced Field. OCS costs 550 XP plus the required Officer Field, grants CHA +100, EDG -200, Connections +50, Equipped +50, Rank +250, Reputation +50, Wealth +100, Leadership +10, Protocol/Affiliation +25, and 115 flexible XP. Its Officer Field takes one year; there are no Advanced or Special selections. Completion permits officer-grade Rank selections.

Corrected-printing p. 94 defines Officer as a five-Skill Field requiring Basic Training or Basic Training (Naval) and Rank O1 or higher. Its Skills are Administration, Leadership, Melee Weapons, Protocol/Affiliation, and Training. At 24 XP per Skill it costs 120 XP and awards +30 XP to each Skill, making the complete OCS transaction 670 XP. The Rank table on p. 124 identifies O1 at +4 TP and states that officer ranks require the Officer Field. Field prerequisites remain final-character requirements, so OCS awards and flexible XP may contribute toward O1 while the acquired Basic Training requirement remains durably tracked. The v4.0 errata contains no Officer Candidate School, Officer Field, or Rank correction.

## Alpha Slice 68 — governed `/Any` dependencies

The Corrected Third Printing Master Skill Fields list on pp. 92–95 is authoritative for Field prerequisites and components. Stage 3 school tables on pp. 82–83 are authoritative for offer category and duration. The v4.0 errata was checked for applicable corrections; its Military Academy Pilot/WarShip correction is already reflected in the corrected printing and does not alter the Slice 68 variable-choice semantics. The implementation distinguishes closed canonical subskill sets, modeled bounded language/affiliation subsets, named finite source options, affiliation-bound automatic awards, and open GM-defined choices. See `docs/STAGE3-FIELD-DEPENDENCY-AUDIT.md`.

## Alpha Slice 69 — open Skill subjects

Corrected-printing pp. 144, 147–148, 153, and 156–157 govern Career, Interest, Science, and Survival. Each is open rather than an exhaustive finite list, while the parent Skill remains fixed and the gamemaster determines whether a proposed subject applies instead of a better-fitting Skill. Survival is restricted to general environment types and carries planet-specific guidance. Master Skill Fields pp. 93–94 and Stage 3 school tables pp. 82–83 authorize Scientist and Special Forces with their implemented categories and durations. The v4.0 errata contains no semantic correction for these four parent Skills. See `docs/OPEN-SKILL-SUBJECT-AUDIT.md`.

## Alpha Slice 70 — University and dependency-ready Fields

Corrected-printing p. 82 defines University as a 710-XP Civilian school requiring INT 4+, with a conditional entry adjustment when Preparatory School, Nobility, and White Collar are all absent. Its exact Attribute, Trait, Skill, affiliation-bound, open Interest, fixed-grant Attribute, and 220 flexible XP awards are implemented through existing mechanisms. The same table supplies one-year Basic and two-year Advanced/Special Field offers. Corrected-printing pp. 92–93 define Manager, Planetary Surveyor, and Politician; all award +30 XP to each listed Skill at the p. 81 reduced cost of 24 XP per Skill. The v4.0 errata contains no correction to University or these Fields. The full remaining-school and Field classification is `docs/STAGE3-SCHOOL-EXPANSION-AUDIT.md`.

## Alpha Slice 71 — General Studies prerequisite semantics

Corrected-printing p. 92 requires General Studies to have INT 3 and at least one other Skill related to its listed Field Skills. It supplies no closed relationship list or minimum level, so the relationship remains a GM judgment. The implementation records a player-selected concrete Skill already possessed before the University preview, labels the choice as subject to GM approval, and grants no prerequisite XP. The same page defines Anthropologist, Archaeologist, and Lawyer and their dependency on the actually acquired General Studies Field. The v4.0 errata contains no correction to these entries. See `docs/GENERAL-STUDIES-PREREQUISITE-AUDIT.md`.

## Alpha Slice 72 — Trade School and any-three-Skills semantics

Corrected-printing p. 82 defines Trade School as a 560-XP Civilian school with no prerequisite, INT +50, any one other Attribute +100, Connections +50, Equipped +100, any three Skills +20 XP each, and 200 flexible XP. “Other” excludes INT, the Attribute already named by the package. The three plural Skill awards are distinct concrete Skill destinations; the source does not require them to pre-exist or impose a category or Stage 2 cap. Parameterized Skills still require canonical subskills or governed open subjects. Corrected-printing p. 92 defines Merchant and Journalist and the p. 82 table establishes their Trade School categories and durations. The v4.0 errata contains no applicable correction.

## Alpha Slice 73 — Family Training, alternative prerequisite, and homeworld

Corrected-printing pp. 81 and 83 establish Family Training as a Military-family Stage 3 school costing 570 XP plus Fields. Its prerequisite is Preparatory School or Military School as a Stage 2 module, **or** Connections +1 TP or higher. The branches are alternatives and grant no XP. The automatic package is STR +75, BOD +75, RFL +50, WIL +50, Equipped +50, Rank +100, Driving/Any +15, Interest/Homeworld History +20, Protocol/Affiliation +15, Survival/Any +20, and 100 flexible XP. Basic Fields take 0.5 years, Advanced Fields 1.5 years, and Special Fields two years. Family Training is Military schooling for both the family rule and OCS eligibility.

Corrected-printing p. 99 places homeworld among player-recorded defining features and leaves its recording to the controlling player. It does not derive a planet from Stage 0 affiliation. Interest on pp. 147–148 permits specific cultural or academic subjects. Slice 73 therefore requires a concrete named planet and resolves the placeholder to `Interest/<planet> History`; it does not invent a planet catalog or substitute an affiliation. The v4.0 errata contains no applicable Family Training, homeworld, prerequisite, or OCS correction.

## Alpha Slice 74 — Solaris Internship residence and Field waivers

Corrected-printing pp. 80-82 were re-audited for Stage 3 selection, prerequisite timing, Field costs, age, family repetition, and Solaris Internship. The school is Civilian, costs 700 XP plus Fields, requires actual Solaris VII residence and Connections +2 TP, and grants the exact Attribute, Trait, Skill, and 100 flexible-XP package recorded in the Stage 3 audit. Streetwise/Any follows the Streetwise definition's affiliation context rather than arbitrary text. Basic and Advanced programs each take two years. The v4.0 errata contains no applicable Solaris Internship, residence, Connections, Field, or waiver correction.

The double-asterisk school note is the complete waiver authority: Solaris Cavalry and MechWarrior do not require Basic Training, while Solaris-trained Battle Armor pilots do not require Infantry or Basic Training. These are automatic, acquisition-specific exceptions; they neither grant the missing Field nor satisfy it for any other validation. Slice 74 records exact waiver provenance on Cavalry or MechWarrior grants. Pilot/Battle Armor remains reference-only because the canonical mechanical Field is absent.

## Alpha Slice 75 — Pilot/Battle Armor acquisition

Corrected-printing p. 94 defines Pilot - Battle Armor with Infantry, STR 6+, and BOD 5+ prerequisites and the six fixed Skills Climbing, Gunnery/Battlesuit, Martial Arts, Piloting/Battlesuit, Sensor Operations, and Tactics/Land. Corrected-printing pp. 82–83 establish its Solaris Internship Advanced, Military Academy Special, and Family Training Special offers at two years; Military Enlistment does not offer it. The Solaris note authorizes only the acquisition-specific Infantry Field waiver relevant to this Field, because Pilot/Battle Armor has no Basic Training prerequisite to waive.

The Core v4.0 errata contains no applicable correction. The Companion p. 57 untrained-battlesuit rule governs tactical fatigue/BOD checks for operating battle armor without Piloting/Battlesuit and is not a Field-acquisition rule. Companion errata v1.1 corrects Martial Arts on an Advanced Battle Armor Combat Record Sheet, not the Master Skill Field. Slice 75 therefore promotes the canonical Field without importing tactical battle-armor rules.

## Alpha Slice 76 — spacecraft Pilot dependency chain

Corrected-printing pp. 82–83 and 93–94 are authoritative for Pilot/DropShip, Pilot/JumpShip, and Pilot/WarShip. JumpShip and WarShip each depend directly on the actual Pilot/DropShip Field; the source does not establish a DropShip-to-JumpShip-to-WarShip chain. Component Skills and a goal selection are not Field ownership. DropShip is a six-Skill 144-XP Field; JumpShip is a five-Skill 120-XP Field; WarShip is a seven-Skill 168-XP Field with affiliation-bound Protocol. All three use the published +30 XP per Skill and 24 XP per Skill cost.

The v4.0 errata adds Pilot/WarShip to Military Academy's Special list. The Corrected Third Printing already contains that corrected two-year offer. No other errata changes these Fields. Technical College offers DropShip Basic for one year and JumpShip Advanced for two years; Military Academy offers DropShip Advanced for one year and JumpShip/WarShip Special for two years; Family Training offers DropShip Advanced for 1.5 years and JumpShip Special for two years.

## Alpha Slice 77 — Infantry/Anti-Mech acquisition

Corrected-printing pp. 83 and 94 define Infantry/Anti-Mech as a six-Skill Special Field requiring the actual Infantry Field and WIL 5+. Its fixed Skills are Acrobatics/Gymnastics, Demolitions, Perception, Security Systems/Electronic, Technician/Mechanical, and Technician/Myomer. At 24 XP per Skill it costs 144 XP and awards +30 XP to each Skill. Military Academy and Family Training offer it for two years; Military Enlistment offers it for one year. Solaris does not offer or waive it. The v4.0 errata contains no applicable correction.

The tactical infantry Anti-'Mech ability and attack procedures are separate from Master Skill Field acquisition. The tactical conversion note associates that ability with Climbing for conventional infantry, but does not add Climbing to this Field or authorize tactical combat mechanics in the character creator.

## Alpha Slice 78 — civilian and combat pilot Fields

Corrected-printing pp. 82 and 92 define Pilot/Aerospace (Civilian) as a Technical College Basic Field taking one year. It requires DEX 3+, RFL 4+, and INT 3+ and grants Career/Aerospace Pilot, Comms/Conventional, Navigation/Air, Navigation/Space, Piloting/Aerospace, and Sensor Operations. The source imposes no TDS restriction. Six Skills cost 144 XP at the Stage 3 rate and receive +30 XP each.

Corrected-printing pp. 83 and 94 independently define both combat Fields. Pilot/Aerospace (Combat) requires Basic Training or Basic Training (Naval), DEX 4+, and RFL 4+; its seven fixed Skills cost 168 XP. Pilot/Aircraft (Combat) requires Basic Training or Basic Training (Naval), DEX 4+, and RFL 3+; its five fixed Skills cost 120 XP. Both are Military Academy Advanced one-year and Family Training Advanced 1.5-year offers. Neither depends on a Civilian pilot Field, neither has a TDS or affiliation restriction, and neither has a variable Skill. The v4.0 errata contains no applicable correction. Tactical aerospace combat and unit-category rules do not alter these character Field definitions.

## Alpha Slice 79 — ComStar / Word of Blake affiliation

Corrected-printing p. 74 defines the 50-XP ComStar/Word of Blake affiliation module as an overlay requiring a normal birth affiliation. Unlike ordinary affiliation changes, it preserves the full XP cost and effects of that birth affiliation. The same entry governs the shared English primary language, nearest-state secondary language, shared awards, exact ComStar and Word of Blake branches, Technician/Any and Protocol destinations, and the prohibition on Extra Income and Property. The v4.0 errata contains no applicable affiliation-package correction; its ComStar/Word of Blake references concern equipment ratings only. The source does not define a geographic nearest-state algorithm, so Slice 79 records an explicit choice among modeled states rather than silently equating birth affiliation with nearest state.

## Alpha Slice 80 — optional sub-affiliation correction

Corrected-printing pp. 62–63 require a Stage 0 affiliation but explicitly label sub-affiliation optional. Omitting the sub-affiliation omits its listed XP/effects without reducing the affiliation module cost; the text notes this wastes potential character experience. The v4.0 errata has no correction to that rule. Its only sub-affiliation-related correction concerns Astrokaszy Streetwise/Periphery and is outside the currently modeled contexts.

## Alpha Slice 81 — HPG Technician

Corrected-printing pp. 82 and 92 define HPG Technician as an Advanced two-year Field at Trade School and University. Its prerequisite is ComStar, Word of Blake, or Clan affiliation plus the Communications Field. The five fixed Skills are Administration, Comms/Conventional, Comms/HPG, Computers, and Cryptography; Perception is not part of the corrected entry. At 24 XP per Skill the Field costs 120 XP and awards +30 XP to each Skill. The v4.0 errata contains no applicable HPG Technician, HPG communications, affiliation, or school-offer correction.
