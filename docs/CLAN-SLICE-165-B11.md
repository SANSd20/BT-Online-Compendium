# Alpha Slice 165-B11

## Typed destination repair

Slice 165-B11 repairs two specific-Clan transaction destinations from the Homeworld Clan table in *A Time of War — Corrected Third Printing*, p. 70. The v4.0 errata does not alter these awards.

- Blood Spirit `Exceptional Attribute/WIL` now commits as Trait `trait.exceptional-attribute` with the application’s canonical `{ attribute: "WIL" }` parameter and +200 XP.
- Ice Hellion `Survival/Arctic` now commits as Skill `skill.survival` with the canonical Arctic subskill and +10 XP.

The defect was in the award application path, not the governed destination catalog: the transaction reconstructed IDs from display strings instead of consuming `resolveClanDestination`. Specific-Clan fixed awards now pass through that existing typed resolver and reject unresolved or mismatched destinations before commitment.

## Transaction and persistence verification

Focused real-transaction tests inspect committed ledger identities, parameters, signed XP, source awards, package history, generic Homeworld accumulation, duplicate rejection, atomic failure, and internal encode/decode. Ice Hellion Clan Remembrance remains additive at +40 XP from the generic +25 and specific +15 awards.

Historical malformed internal saves are not migrated. Public Clan import, player-facing Clan creation, Clan readiness, canonical consumer mappings, claim-level persistence, and additional specific-Clan paths remain deferred. The `clan-foundation-unsupported` readiness boundary is unchanged.
