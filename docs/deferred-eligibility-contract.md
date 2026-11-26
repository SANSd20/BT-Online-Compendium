# Deferred Eligibility Contract

This contract permits a source-authorized Life Module selection to remain
provisional when a required eligibility value is explicitly unavailable until
a later lifecycle stage.

Eligibility is represented as `eligible`, `ineligible`, or `pending`. Pending
records identify the affected stage and subject, the requirement, the required
dependency keys, the source rule, and the information needed for resolution.

Pending conditions may accompany provisional awards and survive persistence,
but they block Final Review readiness. Ineligible conditions also block Final
Review readiness. Reevaluation updates the existing record and never reapplies
the associated awards.

The Life Module transaction boundary supports `set-deferred-eligibility` and
`reevaluate-deferred-eligibility` operations. The transaction derives the
record status from the supplied dependency values, applies the record
atomically with the other operations, and preserves it through commit and
JSON Resume. Pending records are allowed through provisional stage
progression; a known ineligible record blocks the next progression boundary.
Ordinary pending choices and non-deferable validation errors remain blocking.

For the Terran Venusian Citizen rule, the future chronology layer will derive a
permissible Birth Year range from Campaign Year and completed Life Module
chronology. The player will select an exact year from that range. Birth Year
3059 or earlier is eligible; Birth Year after 3059 is ineligible; no selected
Birth Year remains pending. Campaign Year is never substituted for Birth Year.

This contract does not implement the chronology engine, Birth Year controls,
Terran affiliation records, or later-stage Life Modules.
