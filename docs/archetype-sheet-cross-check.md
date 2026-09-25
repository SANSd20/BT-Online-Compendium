# Alpha Slice 25: Core Archetype Sheet Cross-Check

## Scope and result

This is an audit artifact. It does not select a governing source and does not change Archetype, rules, or equipment-catalog data.

The audit compares the eight implemented Core Archetypes in `src/domain/archetypes/coreArchetypes.ts` against:

- the prose Archetype packages in *A Time of War: The BattleTech RPG*, Corrected Third Printing, printed pages 52-59 (PDF pages 54-61); and
- the prefilled back-of-book Archetype sheets in the same PDF, PDF pages 396-403 (the sheets do not carry printed book page numbers).

AToW errata v4.0 was searched as a secondary check. It contains no Archetype-package correction for printed pages 51-59 and does not resolve the findings below.

Punctuation and typography that do not change identity were normalized only for comparison (for example, straight/curly apostrophes and hyphen variants). They were not changed in source data.

The counts below use one grouped audit row per comparison target, not one count per individual Attribute, Skill, or equipment item. Every grouped row states the population checked.

| Category | Count |
| --- | ---: |
| MATCH | 25 |
| PARTIAL MATCH | 44 |
| MISMATCH | 2 |
| PROSE ONLY | 0 |
| SHEET ONLY | 22 |
| IMPLEMENTATION ONLY | 8 |
| NEEDS DECISION | 11 |
| NEEDS SOURCE EXPANSION | 0 |
| **Total grouped findings** | **112** |

## Cross-Archetype findings requiring attention

| Priority | Archetype / field | Implemented value | Prose value | Back-sheet value | Status | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| High | Tanker Attribute XP | `400, 500, 500, 600, 400, 400, 400, 300` in STR/BOD/DEX/RFL/INT/WIL/CHA/EDG order | Same as implementation | `500, 400, 300, 300, 400, 500, 300, 400` | MISMATCH | Choose whether prose or back-sheet XP governs; do not infer from arithmetic without approval. |
| High | Tanker line-item XP total | 4,900 calculated; 4,500 declared | 4,900 calculated; printed page 51 declares all Archetypes as 4,500 | 4,500 calculated | NEEDS DECISION | Resolve with the Tanker Attribute-XP decision. |
| High | Elemental Attribute Links | Not stored | DEX, INT, CHA, EDG each `+0` | DEX, INT, CHA, EDG each `-1` | MISMATCH | Choose the source when Attribute Links are modeled. |
| Medium | Scout Equipped XP | 2 TP / 300 XP | 2 TP / 300 XP | 2 TP / 300 XP | NEEDS DECISION | Both source locations agree with the implementation but conflict with the general 100-XP-per-TP rule. Decide whether to preserve, annotate, or correct in a future slice. |
| Medium | Aerospace Pilot and Elemental Piloting link label | Link not stored | `REF+DEX` | `REF+DEX` | NEEDS DECISION | The Attribute is named `RFL`, not `REF`; decide whether this is a printed label typo when links are modeled. |
| Low | `Faceman` / `FaceMan` | `Faceman` | `Faceman` in the contents/index | `FaceMan` in the back-sheet title | NEEDS DECISION | Retain current spelling unless a naming-governance decision says otherwise. |
| Low | `Battlefield Tech` / `BattleField Tech` | `Battlefield Tech` | `Battlefield Tech` in the contents/index | `BattleField Tech` in the back-sheet title | NEEDS DECISION | Retain current spelling unless a naming-governance decision says otherwise. |

## Published XP reconciliation

Printed page 51 says the Archetypes are 4,500-XP packages. The back sheets do not print a package-total field, so their totals below are calculated from their printed Attribute, Trait, and Skill XP cells.

| Archetype | Declared total | Prose line-item total | Back-sheet line-item total | Implemented calculated total | Existing app note |
| --- | ---: | ---: | ---: | ---: | --- |
| MechWarrior | 4,500 | 4,500 | 4,500 | 4,500 | None required |
| Tanker | 4,500 | 4,900 | 4,500 | 4,900 | Present |
| Aerospace Pilot | 4,500 | 4,480 | 4,480 | 4,480 | Present |
| Elemental | 4,500 | 4,200 | 4,200 | 4,200 | Present |
| Scout | 4,500 | 4,500 | 4,500 | 4,500 | No total note; the 2 TP / 300 XP Equipped issue remains unnoted |
| Faceman | 4,500 | 5,030 | 5,030 | 5,030 | Present |
| Renegade Warrior | 4,500 | 5,000 | 5,000 | 5,000 | Present |
| Battlefield Tech | 4,500 | 4,900 | 4,900 | 4,900 | Present |

## MechWarrior

### 1. Summary

Printed page 52 / PDF page 54; back sheet PDF page 396. Fourteen grouped targets were checked: 4 MATCH, 6 PARTIAL MATCH, 3 SHEET ONLY, and 1 IMPLEMENTATION ONLY.

### 2. Confirmed matches

| Field | Implemented value | Prose value | Back-sheet value | Status | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Archetype name | MechWarrior | MechWarrior | MechWarrior | MATCH | No change |
| Attributes and XP | 8 rows: STR 4/400, BOD 5/500, DEX 5/500, RFL 6/600, INT 4/400, WIL 4/400, CHA 4/400, EDG 3/300 | Same | Same | MATCH | No change |
| Skills, subskills, levels, XP | All 20 rows match | Same 20 rows | Same 20 rows | MATCH | No change |
| Published/calculated XP | 4,500 declared and calculated | 4,500 declared and calculated | 4,500 calculated | MATCH | No change |

Trait names/TP/XP match across all three locations (4 rows), but this is categorized PARTIAL MATCH because the implementation does not retain the printed Trait page references. Attribute Links (8 rows), Skill Links and TN/C (20 rows), and Walk/Run/Sprint (`10/20/40`) agree between the sources but are not stored in the Archetype definition. The prose equipment list (10 rows) and 552 C-bills match the implementation; the back sheet is not a full inventory. The back sheet repeats Martial Arts and Magnum Auto-Pistol identities from the implemented/prose data and adds combat statistics not present in the Archetype model.

### 3. Confirmed mismatches

None.

### 4. Present in prose only

None. Prose inventory and C-bills are implemented, although the back sheet does not repeat them.

### 5. Present in back-of-book sheet only

- Extended movement: Climb 2, Crawl 3, Swim 5.
- Prefilled Standard/Fatigue condition tracks and Stun/Unconscious boxes.
- Armor presentation: MechWarrior Cooling Vest, torso, MW Kit, BAR `1/2/0/1`; Neurohelmet, head, MW Kit, BAR `4/4/3/2`.

### 6. Present in implementation only

Stable ID, normalized subskill identities, ownership normalization, source ID/edition/rule ID, and package-note structure are implementation metadata.

### 7. Needs user decision

None.

### 8. Notes / source references

The sheet spells the weapon `Magnum Auto-Pistol`, while the prose equipment row uses `Magnum Auto Pistol`; this was treated as punctuation-only identity agreement. Weapon details on the sheet include Skill +3, AP/BD `3B/5`, range `5/20/50/120`, ammo 8, and its attack/jam note.

## Tanker

### 1. Summary

Printed page 53 / PDF page 55; back sheet PDF page 397. Fourteen grouped targets were checked: 2 MATCH, 6 PARTIAL MATCH, 1 MISMATCH, 3 SHEET ONLY, 1 IMPLEMENTATION ONLY, and 1 NEEDS DECISION.

### 2. Confirmed matches

Attribute scores (5/4/3/3/4/5/3/4) agree even though seven XP cells do not. All 5 Trait names/TP/XP and all 23 Skill names/subskills/levels/XP match across the three locations. Trait page references, Attribute Links, Skill Links/TN/C, movement `8/17/32`, the 8-row prose/implementation inventory, 727 C-bills, and weapon identity are PARTIAL MATCHES for the same model/presentation reasons described above.

### 3. Confirmed mismatches

| Field | Implemented value | Prose value | Back-sheet value | Status | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Attribute XP (STR/BOD/DEX/RFL/INT/WIL/CHA/EDG) | `400/500/500/600/400/400/400/300` | Same | `500/400/300/300/400/500/300/400` | MISMATCH | Choose governing source; no change in this slice |

### 4. Present in prose only

None. Prose inventory and C-bills are implemented.

### 5. Present in back-of-book sheet only

- Extended movement: Climb 2, Crawl 2, Swim 8.
- Prefilled condition-monitor tracks and Stun/Unconscious boxes.
- Armor presentation: Tanker's Smock, torso, Combat Kit, BAR `3/5/5/3`; Helmet (FWL), head, FWL Kit, BAR `4/4/4/3`; Boots, feet, FWL Kit, BAR `2/3/3/1`; Gloves, hands, FWL Kit, BAR `1/1/1/1`.

### 6. Present in implementation only

Stable and normalized IDs, ownership normalization, source metadata, and the existing mismatch notes are implementation metadata.

### 7. Needs user decision

The prose/implementation cells calculate to 4,900 XP, while the back-sheet cells calculate to the declared 4,500 XP. This is coupled to the Attribute-XP mismatch and must not be resolved separately by assumption.

### 8. Notes / source references

The back-sheet Submachine Gun adds Skill +2, AP/BD `3B/3B`, range `5/16/35/80`, ammo 50, BURST 10, and RECOIL -1. The existing application note accurately records the prose Attribute score/XP mismatch but predates this back-sheet comparison.

## Aerospace Pilot

### 1. Summary

Printed page 54 / PDF page 56; back sheet PDF page 398. Fourteen grouped targets were checked: 3 MATCH, 5 PARTIAL MATCH, 3 SHEET ONLY, 1 IMPLEMENTATION ONLY, and 2 NEEDS DECISION.

### 2. Confirmed matches

The name, all 8 Attribute score/XP rows, and all 25 Skill names/subskills/levels/XP match. All 5 Trait name/TP/XP rows also match, with printed page references unmodeled. Attribute Links, movement `7/17/34`, the 13-row prose/implementation inventory, 482 C-bills, and weapon identity are PARTIAL MATCHES. The grouped Skill Links/TN/C finding requires a decision because of the Piloting row described below; the remaining 24 printed Skill-link rows agree between the two source locations but are unmodeled.

### 3. Confirmed mismatches

None between the implemented fields and their source values.

### 4. Present in prose only

None. Prose inventory and C-bills are implemented.

### 5. Present in back-of-book sheet only

- Extended movement: Climb 2, Crawl 2, Swim 3.
- Prefilled condition-monitor tracks and Stun/Unconscious boxes.
- Armor presentation: Combat Flight Suit, torso, Special Kit, BAR `2/3/2/2`; Pilot's Neurohelmet, head, Special Kit, BAR `2/3/2/2`; Boots, feet, Special Kit, BAR `2/3/3/1`.

### 6. Present in implementation only

Stable and normalized IDs, ownership normalization, source metadata, and the published-total mismatch note are implementation metadata.

### 7. Needs user decision

- Both source locations print Piloting/Aerospace's link as `REF+DEX`, although the Attribute is named `RFL`; the implementation does not store the link.
- The package declares 4,500 XP but all three compared line-item sets calculate to 4,480 XP. The app preserves and notes the discrepancy.

### 8. Notes / source references

The back-sheet Needler Pistol adds Skill +2, AP/BD `2B/5S`, range `2/6/12/20`, ammo 10, and a page-268 note.

## Elemental

### 1. Summary

Printed page 55 / PDF page 57; back sheet PDF page 399. Fourteen grouped targets were checked: 4 MATCH, 4 PARTIAL MATCH, 1 MISMATCH, 2 SHEET ONLY, 1 IMPLEMENTATION ONLY, and 2 NEEDS DECISION.

### 2. Confirmed matches

The name, all 8 Attribute purchased scores/XP (including STR `7+2`, BOD `6+1`, and DEX `4-1`), all 7 Trait name/TP/XP rows, and all 15 Skill names/subskills/levels/XP match. Trait page references are unmodeled. Movement `12/22/44`, the 3-row prose/implementation inventory, 735 C-bills, and weapon identity are PARTIAL MATCHES. The absence of a personal-armor entry agrees across the package and sheet.

### 3. Confirmed mismatches

| Field | Implemented value | Prose value | Back-sheet value | Status | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Attribute Links: DEX, INT, CHA, EDG | Not stored | `+0, +0, +0, +0` | `-1, -1, -1, -1` | MISMATCH | Choose governing source when links are modeled |

The other four Attribute Links (STR +1, BOD +1, RFL 0, WIL 0) agree between the source locations.

### 4. Present in prose only

None. Prose inventory and C-bills are implemented.

### 5. Present in back-of-book sheet only

- Extended movement: Climb 6, Crawl 3, Swim 6.
- Prefilled condition-monitor tracks and Stun/Unconscious boxes.

### 6. Present in implementation only

Stable and normalized IDs, phenotype-modifier separation, Field Aptitude notes, ownership/source metadata, and the published-total mismatch note are implementation metadata.

### 7. Needs user decision

- Both sources print Piloting/Battlesuit's link as `REF+DEX`, although the Attribute is named `RFL`; the implementation does not store the link.
- The package declares 4,500 XP but all three line-item sets calculate to 4,200 XP. The app preserves and notes the discrepancy.

### 8. Notes / source references

Both sources mark the same seven Field-Aptitude-affected Skill values: Climbing, Gunnery/Battlesuit, Melee Weapons, Piloting/Battlesuit, Sensor Operations, Small Arms, and Tactics/Infantry. The back-sheet Combat Shotgun adds Skill +2, AP/BD `3B/5S`, range `5/12/24/50`, and ammo 8.

## Scout

### 1. Summary

Printed page 56 / PDF page 58; back sheet PDF page 400. Fourteen grouped targets were checked: 5 MATCH, 5 PARTIAL MATCH, 2 SHEET ONLY, 1 IMPLEMENTATION ONLY, and 1 NEEDS DECISION.

### 2. Confirmed matches

The name, all 8 Attribute score/XP rows, all 29 Skill names/subskills/levels/XP, and the 4,500 calculated/declared total match. Attribute Links, Skill Links/TN/C, movement `7/18/36`, the 17-row prose/implementation inventory, 85 C-bills, and weapon identity are PARTIAL MATCHES. The blank personal-armor block does not conflict with the package: Sneaksuit Camo is carried equipment, not identified as personal armor in either compared source block.

### 3. Confirmed mismatches

None between the three printed/implemented values. The internal Trait-cost issue below is a governing decision, not a cross-source mismatch, because both source locations repeat it.

### 4. Present in prose only

None. Prose inventory and C-bills are implemented.

### 5. Present in back-of-book sheet only

- Extended movement: Climb 2, Crawl 2, Swim 3.
- Prefilled condition-monitor tracks and Stun/Unconscious boxes.

### 6. Present in implementation only

Stable and normalized IDs, ownership normalization, and source metadata are implementation metadata. Unlike other known printed XP irregularities, no dedicated note records the Equipped cost issue.

### 7. Needs user decision

| Field | Implemented value | Prose value | Back-sheet value | Status | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Equipped | 2 TP / 300 XP | 2 TP / 300 XP | 2 TP / 300 XP | NEEDS DECISION | Decide whether to preserve, annotate, or correct against the general 100-XP-per-TP rule |

Trait page references are also absent from the implementation. That missing presentation detail is part of this grouped NEEDS DECISION finding rather than a separate counted row.

### 8. Notes / source references

The back-sheet Pulse Laser Pistol adds Skill +3, AP/BD `3E/2B`, range `12/30/70/195`, ammo `2 PPS`, BURST 5, and RECOIL 0. The 4,500 line-item total incorporates the printed 300-XP Equipped value.

## Faceman

### 1. Summary

Printed page 57 / PDF page 59; back sheet PDF page 401. Fourteen grouped targets were checked: 2 MATCH, 6 PARTIAL MATCH, 3 SHEET ONLY, 1 IMPLEMENTATION ONLY, and 2 NEEDS DECISION.

### 2. Confirmed matches

All 8 Attribute score/XP rows and all 16 Skill identities (including Acting's Deception specialty), levels, and XP match. All 4 Trait names/TP/XP match, with page references unmodeled. Attribute Links, Skill Links/TN/C, movement `7/17/34`, the 10-row prose/implementation inventory, 402 C-bills, and weapon identity are PARTIAL MATCHES.

### 3. Confirmed mismatches

None in numeric package data.

### 4. Present in prose only

None. Prose inventory and C-bills are implemented.

### 5. Present in back-of-book sheet only

- Extended movement: Climb 2, Crawl 2, Swim 3.
- Prefilled condition-monitor tracks and Stun/Unconscious boxes.
- Armor presentation: Flak Vest, torso, Personal, BAR `1/5/1/3`.

### 6. Present in implementation only

Stable and normalized IDs, specialty structure, ownership/source metadata, and the published-total mismatch note are implementation metadata.

### 7. Needs user decision

- Name capitalization: implementation/prose/index `Faceman`; back-sheet title `FaceMan`.
- The package declares 4,500 XP but all three line-item sets calculate to 5,030 XP. The app preserves and notes the discrepancy.

### 8. Notes / source references

The sheet spells `Holdout Pistol`; the prose/implementation use `Hold-Out Pistol`. This was normalized as the same identity. The sheet adds Skill +0, AP/BD `3B/3`, range `2/5/8/20`, and ammo 2.

## Renegade Warrior

### 1. Summary

Printed page 58 / PDF page 60; back sheet PDF page 402. Fourteen grouped targets were checked: 3 MATCH, 6 PARTIAL MATCH, 3 SHEET ONLY, 1 IMPLEMENTATION ONLY, and 1 NEEDS DECISION.

### 2. Confirmed matches

The name, all 8 Attribute score/XP rows, and all 17 Skill identities (including Small Arms' Rifles specialty), levels, and XP match. All 3 Trait name/TP/XP rows match, with page references unmodeled. Attribute Links, Skill Links/TN/C, movement `10/21/42`, the 11-row prose/implementation inventory, 4,074 C-bills, and weapon identities are PARTIAL MATCHES.

### 3. Confirmed mismatches

None.

### 4. Present in prose only

None. The prose inventory includes smoke grenades, which are implemented but not repeated in the back-sheet weapon block; this is included in the equipment PARTIAL MATCH rather than PROSE ONLY because the implementation contains it.

### 5. Present in back-of-book sheet only

- Extended movement: Climb 6, Crawl 3, Swim 5.
- Prefilled condition-monitor tracks and Stun/Unconscious boxes.
- Armor presentation: Jacket, torso, Periphery, BAR `1/5/1/3`.

### 6. Present in implementation only

Stable and normalized IDs, specialty structure, ownership/source metadata, and the published-total mismatch note are implementation metadata.

### 7. Needs user decision

The package declares 4,500 XP but all three line-item sets calculate to 5,000 XP. The app preserves and notes the discrepancy.

### 8. Notes / source references

The sheet adds combat statistics for Martial Arts, two Vibroblades, Auto-Pistol, and Imperator AX-22. The rifle is Skill +3, AP/BD `4B/4B`, range `30/80/185/435`, ammo 15, BURST 15, and RECOIL -1. Smoke grenades are not listed in the combat block.

## Battlefield Tech

### 1. Summary

Printed page 59 / PDF page 61; back sheet PDF page 403. Fourteen grouped targets were checked: 2 MATCH, 6 PARTIAL MATCH, 3 SHEET ONLY, 1 IMPLEMENTATION ONLY, and 2 NEEDS DECISION.

### 2. Confirmed matches

All 8 Attribute score/XP rows and all 15 Skill names/subskills/levels/XP match. All 3 Trait name/TP/XP rows match, with page references unmodeled. Attribute Links, Skill Links/TN/C, movement `8/18/36`, the 13-row prose/implementation inventory, 7,898 C-bills, and weapon identity are PARTIAL MATCHES.

### 3. Confirmed mismatches

None in numeric package data.

### 4. Present in prose only

None. Prose inventory and C-bills are implemented.

### 5. Present in back-of-book sheet only

- Extended movement: Climb 2, Crawl 2, Swim 4.
- Prefilled condition-monitor tracks and Stun/Unconscious boxes.
- Armor presentation: Flak Jacket, torso, Personal, BAR `1/5/1/3`.

### 6. Present in implementation only

Stable and normalized IDs, ownership/source metadata, and the published-total mismatch note are implementation metadata.

### 7. Needs user decision

- Name capitalization: implementation/prose/index `Battlefield Tech`; back-sheet title `BattleField Tech`.
- The package declares 4,500 XP but all three line-item sets calculate to 4,900 XP. The app preserves and notes the discrepancy.

### 8. Notes / source references

The back-sheet Revolver adds Skill +2, AP/BD `4B/4`, range `8/18/40/90`, and ammo 6.

## Deferred governing decisions

No decision is made here. A future correction/decision slice should address, in order:

1. Tanker Attribute XP and its resulting package total.
2. Elemental Attribute Links.
3. Whether the repeated Scout Equipped 2 TP / 300 XP value is preserved, annotated, or corrected.
4. Whether `REF+DEX` on the two Piloting rows is a printed label typo for `RFL+DEX`.
5. Whether back-sheet-only derived/combat presentation belongs in the Archetype source package, a calculated character-sheet layer, or both.
6. Naming capitalization for Faceman and Battlefield Tech.
7. The declared-versus-line-item total discrepancies (six in the current implementation, with Tanker overlapping the separate prose/back-sheet conflict).

Until those choices are authorized, `coreArchetypes.ts` remains unchanged.
