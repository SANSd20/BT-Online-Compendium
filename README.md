# BT Online Compendium

Durable project authority for a web-based BattleTech *A Time of War* compendium and character toolset.

## Current state

**Alpha Slice 7 is implemented.** The React + TypeScript + Vite application includes Archetype v0.1, Point Buy v0.1, and Life Modules v0.4 on the shared Character/Rules model, with versioned JSON character files, browser-local persistence, and import/export.

All eight published Core archetypes can create, display, save, export, and import characters with source provenance. Point Buy v0.1 creates a Normal Human draft, tracks the creation budget, and purchases Attributes plus a deliberately limited set of Skills/subskills and positive/negative Traits. Life Modules v0.4 covers the existing Stage 0–2 catalog plus the Technical College Stage 3 branch with Technician/Civilian and Technician/Vehicle Skill Fields. It calculates the 600 XP school base plus 216 XP in Field costs, applies overlapping Field Skill awards, records the Fields as training packages, advances age from 16 to 19, and preserves pending Interest and flexible awards.

The project remains in **Alpha**. Beta 1 is a future milestone requiring completed Core + Companion character creation and PDF export. Most Life Module content, Stage 4, full finalization, complete catalogs and legality checks, PDF export, Planetary work, and playable-sheet runtime behavior remain outside the current implementation.

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
- [`src/ui/`](src/ui/) — app shell and functional Archetype v0.1, Point Buy v0.1, and Life Modules v0.4 routes
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

Repository bootstrap and Alpha Slices 1–7 are complete. The implemented app is local-first and requires no server, database, or account.

The Core + Companion rules audit is in progress. Its next audit target is **Campaign / Rules Configuration reconciliation**, specifically the boundaries among durable character state, current campaign rules, creation-rules provenance, and per-character GM exceptions.

The next recommended implementation slice, only when separately authorized, is **Alpha Slice 8 — Life Modules v0.5 minimal Stage 4 foundation**: add an audited minimal Stage 4 branch and its legal continuation boundary without implying complete finalization support. Planetary Data Foundation Rollout 1 remains designed but unimplemented and also requires separate authorization.

## Status vocabulary

This project distinguishes among proposed, approved, implemented, verified, unresolved, deferred, and superseded work. Documentation of a design does not mean it has been implemented.
