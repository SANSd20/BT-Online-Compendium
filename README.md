# BT Online Compendium

Durable project authority for a web-based BattleTech *A Time of War* compendium and character toolset.

## Current state

**Alpha Slice 9 is implemented.** The React + TypeScript + Vite application includes Archetype v0.1, Point Buy v0.1, and Life Modules v0.6 on the shared Character/Rules model, with versioned JSON character files, browser-local persistence, and import/export.

All eight published Core archetypes can create, display, save, export, and import characters with source provenance. Point Buy v0.1 creates a Normal Human draft with a focused catalog. Life Modules v0.6 covers the narrow Stage 0–4 branch and adds an explicit post-Stage-4 final review: a separate final-allocation pool, threshold-derived values, final prerequisite checks, supported opposed-Trait diagnostics, explicit Optimization preview/application with provenance, and 10-percent negative-Trait purchase-cap metadata.

The project remains in **Alpha**. “Ready for Final Touches” is a review state, not a finalized or ready-for-play character. Beta 1 is a future milestone requiring completed Core + Companion character creation and PDF export. Equipment purchasing, true character locking, full catalogs and legality checks, negative-Trait purchase UI, PDF export, Planetary work, and playable-sheet runtime behavior remain outside the current implementation.

The primary product direction is an offline/PWA-capable, local-first web application whose Character Generator can later evolve into a playable character sheet. Initial character persistence is local browser storage plus import/export through a versioned portable format; server accounts and cloud character storage are not initial requirements.

## Established implementation order

1. Archetype
2. Point Buy
3. Life Modules

All three creation methods must use one shared Character/Rules engine. Archetype establishes and exercises the common representation; Point Buy exercises direct XP purchasing; Life Modules adds its staged, path-dependent process.

Planetary functionality is supporting infrastructure. It does not replace or supersede this sequence, and the existence of planetary data does not create a mandatory homeworld requirement.

## Repository map

- [`src/domain/`](src/domain/) — shared Character/rules models and focused Archetype, Point Buy, and Life Module catalogs
- [`src/domain/skillFields/`](src/domain/skillFields/) — minimal durable Skill Field catalog and source-specific cost/grant definitions
- [`src/engine/`](src/engine/) — shared character factory plus Archetype, Point Buy, and Life Module engines
- [`src/validation/`](src/validation/) — typed validation results and minimal structural validation
- [`src/persistence/`](src/persistence/) — versioned JSON codec, local repository, and browser import/export
- [`src/ui/`](src/ui/) — app shell and functional Archetype v0.1, Point Buy v0.1, and Life Modules v0.6 routes
- [`docs/PROJECT-STATE.md`](docs/PROJECT-STATE.md) — purpose, approved direction, statuses, sequence, and resume point
- [`docs/SOURCE-AUTHORITY.md`](docs/SOURCE-AUTHORITY.md) — rules scope, errata policy, provenance, and planetary upstream authority
- [`docs/CHARACTER-AND-RULES-ARCHITECTURE.md`](docs/CHARACTER-AND-RULES-ARCHITECTURE.md) — established Character Generator domain and engine requirements
- [`docs/PLANETARY-DATA-FOUNDATION.md`](docs/PLANETARY-DATA-FOUNDATION.md) — completed planetary research/design and rollout boundaries
- [`docs/UNRESOLVED-AND-DEFERRED.md`](docs/UNRESOLVED-AND-DEFERRED.md) — unresolved rules questions, deferred work, and prohibited assumptions
- [`docs/VERIFICATION.md`](docs/VERIFICATION.md) — verified checkpoints and future implementation expectations

## Run locally

Requires Node.js 20.19 or newer (Node.js 22.12 or newer is also supported by the selected Vite version).

```bash
npm install
npm run dev
```

Use `npm run check` to run lint, unit tests, TypeScript compilation, and the production build.

## Current resume points

Repository bootstrap and Alpha Slices 1–9 are complete. The implemented app is local-first and requires no server, database, or account.

The Core + Companion rules audit is in progress. Its next audit target is **Campaign / Rules Configuration reconciliation**, specifically the boundaries among durable character state, current campaign rules, creation-rules provenance, and per-character GM exceptions.

The next recommended implementation slice, only when separately authorized and supplied with audited rules data, is **Alpha Slice 10 — Final Touches/equipment foundation**. It should remain narrow, preserve Wealth versus C-bills and Owned versus Issued equipment, and must not imply PDF export, ready-for-play status, or Beta 1 completion. Planetary Data Foundation Rollout 1 remains designed but unimplemented and requires separate authorization.

## Status vocabulary

This project distinguishes among proposed, approved, implemented, verified, unresolved, deferred, and superseded work. Documentation of a design does not mean it has been implemented.
