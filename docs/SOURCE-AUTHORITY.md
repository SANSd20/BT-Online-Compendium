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

The Alpha rules catalog records these three current sources as versioned metadata and captures them in each new character's creation-rules snapshot. Alpha Slice 2 adds the eight published Core archetype packages from Corrected Third Printing pages 52–59. Alpha Slice 3 adds the focused Point Buy foundation from Core pages 49, 51, 60, 95, 107, and 121–122. Alpha Slice 4 adds the initial Stage 0/1 modules, Alpha Slice 5 resolves their pending awards, and Alpha Slice 6 adds Stage 2 Back Woods and High School. Alpha Slice 7 adds the audited Technical College branch and the Technician/Civilian and Technician/Vehicle Skill Fields. Alpha Slice 8 adds the audited Agitator Stage 4 branch and repeat-policy metadata. These slices do not add Companion templates or complete Life Module or Skill Field catalogs. The historical First Printing is not included in the active runtime catalog.

AToW Errata v4.0 was checked against the selected Alpha Slice 4 modules. No erratum changes the implemented Capellan Confederation/Capellan Commonality, Blue Collar, or Back Woods data. Nearby Independent/Astrokaszy and extreme-gravity corrections are outside this minimal set.

AToW Errata v4.0 was also checked during the supplied Alpha Slice 6 rules audit. No erratum changes the implemented Stage 2 Back Woods or High School data; the nearby Military School/Military Academy correction remains outside this slice.

The supplied Alpha Slice 7 audit likewise records no erratum affecting Technical College or its two implemented Technician Fields. The Military Academy Pilot/WarShip correction remains outside this slice.

The supplied Alpha Slice 8 audit records no erratum affecting Agitator or the implemented Stage 4 Real Life rules. No fresh PDF transcription was performed for Slice 8; the handoff's audited values and no-page source identifiers were preserved without inventing page citations.

AToW Errata v4.0 was checked for corrections to the Point Buy starting allotment, Attribute/Trait costs, Skill XP table, and negative-Trait limit; no applicable correction to those rules was identified. The Corrected Third Printing values therefore remain authoritative for Point Buy v0.1.

The archetype catalog preserves printed values even when a sheet's line-item XP does not match the Core page 51 declaration that archetypes use 4,500 XP. Declared and calculated totals remain distinct, and unresolved discrepancies carry explicit source notes. Errata v4.0 contains no archetype-sheet correction that authorizes silently changing those values.

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
