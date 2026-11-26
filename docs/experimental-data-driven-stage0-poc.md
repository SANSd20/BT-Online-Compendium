# Experimental data-driven Stage 0 proof of concept

Status: PARTIAL — experimental only; not player-facing

This proof of concept is isolated under `src/experimental/` and is not used by
the production Stage 0 routing. It exercises a shared interpreter over a
normalized FWL pilot record set and reuses the application character model,
generic module award application, XP ledger, pending-award resolution,
provenance, and stage transition code.

## Source boundary

The pilot was checked against the authenticated `SANSd20/AToW-Reference-Data`
`main` branch, especially:

- `legacy-data/Stage 0 - Affiliation/56 Free Worlds League (House Marik).txt`
- `legacy-data/Stage 0 - Sub-Affiliation/56 Free Worlds League (House Marik) - *.txt`
- `design/CANONICAL-SCHEMA-v0.4a.md`
- `docs/PILOT-v0.4b.md`
- `src/` and `tests/` validation infrastructure

The reference repository's canonical pilot does not yet contain an exported FWL
mechanics record, so legacy records remain input evidence for this experiment.

## Verified proof points

- Parent inheritance and fixed awards are interpreted through shared code.
- FWL parent and all five published sub-affiliation IDs are represented.
- A disposable data-only record uses the same interpreter without a new faction
  resolver or production UI branch.
- Focused interpreter tests pass.
- Existing production tests and build remain passing.

## Known limitations

This is not a release-ready replacement for the specialized path. The source
legacy parent record includes `Protocol/Free Worlds=10`, while the current
production FWL catalog does not; the parent equivalence test therefore compares
against the current application behavior and does not claim source reconciliation.
The experimental record set also remains a consumer-side pilot rather than a
runtime import of the private reference repository. Full six-context equivalence
across incomplete previews, persistence round trips, and all choice restrictions
requires a follow-up task before any production routing or player-facing use.
