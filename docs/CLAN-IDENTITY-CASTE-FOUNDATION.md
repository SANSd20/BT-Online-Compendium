# Clan Identity and Caste Foundation — Alpha Slice 118

Slice 118 adds schema-only Clan identity and caste foundations. It does not activate Clan character creation, awards, Phenotypes, Fields, Life Modules, or player-facing Clan selection.

## Canonical state

- Clan identity: `affiliation.clan`
- Supported caste identifiers: `warrior`, `scientist`, `merchant`, `technician`, `laborer`
- Every stored foundation record is explicitly `support: unsupported` and carries Corrected Third Printing provenance (p. 63; caste foundation rule reference).
- No identity or caste record generates XP, chronology, awards, Attribute modifiers, Traits, Skills, or Phenotype effects.

## Compatibility and protection

`CharacterDefinition.clanIdentity` and `clanCaste` are optional, so legacy Inner Sphere, Point Buy, Archetype, and Life Modules saves decode without migration. The codec preserves these fields through save/export/import and snapshots. Structural validation rejects malformed records; valid but unsupported Clan records produce availability warnings. Final Review adds a blocker whenever either field is present, preventing unsupported Clan state from becoming ready for play.

## Deferred phases

Clan affiliation packages, caste restrictions and XP, Clan Phenotype selection, Field Aptitude, Clan Fields, Clan-specific Skills and Traits, Clan Life Modules, chronology, and player-facing Clan workflow remain deferred. The existing six Clan-dependent reference Fields are not promoted.

Source authority: *A Time of War — Corrected Third Printing* and applicable *A Time of War v4.0 Errata*. The Slice 116 affiliation/Phenotype audit remains unchanged and is committed alongside this foundation.
