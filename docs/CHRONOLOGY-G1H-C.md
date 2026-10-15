# G1h-C Capellan Civilian Job Substitution

The published relation `relation.capellan.stage-2-civilian-job-substitution` now has a local application transaction. It is available only for a character with `affiliation.capellan-confederation` in the active Stage 2 selection phase.

The transaction reuses the canonical `stage4.civilian-job` module identity and its normal 600 XP cost and awards. History records the source module's canonical Stage 4 identity, applied stage 2, normal six-year duration, zero actual elapsed duration, the substitution reason, and the relation ID. The relation is not represented as a duplicate Stage 2 module.

The transaction applies typed `SET_AGE(18)` with the Capellan relation provenance. It does not apply `ADD_YEARS(6)`, does not overwrite a fixed DOB, and leaves the normal Stage 3 continuation path available. Existing transaction validation, persistence, and import/export mechanisms remain in use.

Dual-page source provenance is preserved by the published relation: printed p.64 governs the substitution and age 18, while printed p.85 governs the Civilian Job module definition. Citizenship restrictions are intentionally deferred to G1h-D. Player-facing UI exposure and browser workflow verification remain follow-up work.
