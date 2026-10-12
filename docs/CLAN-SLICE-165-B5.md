# Alpha Slice 165-B5 — Specific-Clan package history

Slice 165-B5 defines the internal, non-authoritative history contract for the eight Homeworld Clan packages listed on Corrected Third Printing p. 70. Records retain canonical Clan identity, the `affiliation.clan` parent, package and transaction identities, committed status, award identities, signed Attribute/Trait/Skill values, governed choices, conditional identity, and source provenance.

The validator rejects malformed or forged package and award identities, duplicate transaction or award identities, inconsistent choices, unsupported destinations, stale provenance, and more than one specific Homeworld package for a character. Negative values remain signed; Trait TP is not converted to XP. Conditional records retain condition identity and applicability but are not executed.

This slice does not apply awards, create commitment APIs, enable Clan selection, enable Clan readiness, or enable public Clan import. Controlled internal fixtures may round-trip through the character codec only with the explicit internal decode option. Atomic specific-Clan transaction integration remains B6 scope.
