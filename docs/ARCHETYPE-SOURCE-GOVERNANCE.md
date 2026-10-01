# Archetype Source Governance

## Alpha Slice 28 decision

For the eight implemented Core archetypes, the printed archetype package/prose entries on pages 52–59 govern active character-creation package values. The prefilled back-of-book archetype sheets are supplemental sheet-ready references and audit evidence. A back-sheet difference does not overwrite the governing package, and arithmetic alone does not authorize a correction.

The Slice 25 comparison in `archetype-sheet-cross-check.md` remains the evidence record. This document records the approved treatment of its conflicts without changing active archetype data.

## Governed conflicts and variants

| Finding | Active treatment | Supplemental/conflict treatment |
| --- | --- | --- |
| Tanker Attribute XP | Preserve the current prose/package XP values and the resulting 4,900-XP line-item total alongside the declared 4,500-XP package total. | Retain the back-sheet 4,500-XP allocation as conflict evidence; do not substitute it. |
| Elemental Attribute Links | Preserve current active package values. Attribute Links remain unmodeled. | Record prose `+0` versus back-sheet `-1` for DEX, INT, CHA, and EDG as a source conflict for any future link implementation. |
| Scout Equipped | Preserve 2 TP / 300 XP exactly as printed in both package and back sheet. | Record the discrepancy against the general 100-XP-per-TP expectation; do not normalize it. |
| Piloting `REF+DEX` | Continue to use `RFL` as the internal Attribute key. | Preserve `REF` as printed wording/variant evidence. Do not add a `REF` Attribute. |
| Faceman / FaceMan | Preserve display name `Faceman` and stable ID `archetype.core.faceman`. | Record `FaceMan` as the back-sheet display variant. |
| Battlefield Tech / BattleField Tech | Preserve display name `Battlefield Tech` and stable ID `archetype.core.battlefield-tech`. | Record `BattleField Tech` as the back-sheet display variant. |

## Back-sheet-only fields

Movement extensions, condition monitors, Stun/Unconscious boxes, armor/BAR presentation, weapons and combat statistics, and similar back-sheet-only fields are supplemental sheet-ready metadata candidates. They are not active creation-package mechanics and are not added to the runtime model by Slice 28.

Future work may model these fields only under separately approved scope with explicit provenance and a clear separation between source package data, derived sheet presentation, and mutable play state. Slice 28 does not implement playable-sheet behavior, movement, armor/BAR, weapons, condition monitoring, combat state, or PDF export.

## Compatibility boundary

This governance policy is inert. It changes no Archetype definition, stable ID, Character schema, Point Buy behavior, Life Modules behavior, Final Touches behavior, or equipment catalog record. Existing save/load and JSON import/export behavior remains unchanged.

