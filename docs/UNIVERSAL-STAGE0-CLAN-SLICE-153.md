# Alpha Slice 153 — Universal Stage 0 Clan Affiliation

Slice 153 connects the existing internal Clan affiliation contexts to the
public Universal Stage 0 resolver without exposing Clan creation in the UI.

## Supported resolution

The canonical contexts are:

- `stage0.clan.homeworld-clan`
- `stage0.clan.invading-clan`

Both retain the canonical `affiliation.clan` identity and their distinct
category metadata. The Universal Stage 0 language award resolves through the
existing Language Skill identity and the governed `affiliation-languages`
choice list. A concrete listed language is required; free text and missing
choices are rejected.

The award remains the source-backed 20 XP Language Skill award from A Time of
War — Corrected Third Printing, p. 62. Provenance is preserved on the
Universal Stage 0 history entry and award.

## Continuity and limits

After Universal resolution, the existing Clan affiliation package, MechWarrior
caste package, and Trueborn Crèche transactions continue through the existing
build/validate/commit architecture. Slice 153 does not alter their awards,
costs, chronology, Attribute rules, or Crèche choices.

Clan creation remains internal-only. Birth-affiliation option lists and
player-facing Clan creation remain disabled, and the existing Clan readiness
blocker remains in force.
