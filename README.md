# BT Online Compendium

Durable project authority for a web-based BattleTech *A Time of War* compendium and character toolset.

## Current state

This repository currently contains **design and project-state documentation only**. Application implementation has not started.

The primary product direction is an offline/PWA-capable, local-first web application whose Character Generator can later evolve into a playable character sheet. Initial character persistence is local browser storage plus import/export through a versioned portable format; server accounts and cloud character storage are not initial requirements.

## Established implementation order

1. Archetype
2. Point Buy
3. Life Modules

All three creation methods must use one shared Character/Rules engine. Archetype establishes and exercises the common representation; Point Buy exercises direct XP purchasing; Life Modules adds its staged, path-dependent process.

Planetary functionality is supporting infrastructure. It does not replace or supersede this sequence, and the existence of planetary data does not create a mandatory homeworld requirement.

## Repository map

- [`docs/PROJECT-STATE.md`](docs/PROJECT-STATE.md) — purpose, approved direction, statuses, sequence, and resume point
- [`docs/SOURCE-AUTHORITY.md`](docs/SOURCE-AUTHORITY.md) — rules scope, errata policy, provenance, and planetary upstream authority
- [`docs/CHARACTER-AND-RULES-ARCHITECTURE.md`](docs/CHARACTER-AND-RULES-ARCHITECTURE.md) — established Character Generator domain and engine requirements
- [`docs/PLANETARY-DATA-FOUNDATION.md`](docs/PLANETARY-DATA-FOUNDATION.md) — completed planetary research/design and rollout boundaries
- [`docs/UNRESOLVED-AND-DEFERRED.md`](docs/UNRESOLVED-AND-DEFERRED.md) — unresolved rules questions, deferred work, and prohibited assumptions
- [`docs/VERIFICATION.md`](docs/VERIFICATION.md) — future implementation verification expectations

## Current resume points

Repository bootstrap is complete. No application framework has been selected and no application code has been implemented.

The Core + Companion rules audit is in progress. Its next audit target is **Campaign / Rules Configuration reconciliation**, specifically the boundaries among durable character state, current campaign rules, creation-rules provenance, and per-character GM exceptions.

The next implementation work, only when separately authorized, remains **Archetype v0.1 using the shared Character/Rules engine**. Planetary Data Foundation Rollout 1 remains designed but unimplemented and also requires separate authorization.

## Status vocabulary

This project distinguishes among proposed, approved, implemented, verified, unresolved, deferred, and superseded work. Documentation of a design does not mean it has been implemented.

