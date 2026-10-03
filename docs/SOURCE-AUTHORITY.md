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
