# G1h-D — Capellan Citizenship Enforcement

The Capellan Stage 2 Military School and every Capellan Stage 3 school are
governed by the source-defined Citizenship trait. A character qualifies only
when an active `trait.citizenship` record has a non-empty `subject` parameter.

The engine enforces the rule during transaction eligibility and commit, and
final validation reports the durable restriction IDs
`restriction.scope.capellan-stage-2-military` and
`restriction.scope.capellan-stage-3`. The Life Modules screen keeps governed
choices visible with an unavailable reason. The Stage 4 Civilian Job
substitution remains a legal Stage 2 alternative and is not itself subject to
the Military School Citizenship gate; its existing chronology behavior is
unchanged.

No Clan activation, public import, or source-data change is included. Browser
conformance remains deferred to G3-A.
