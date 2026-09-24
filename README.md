# BT Online Compendium

Durable project authority for a web-based BattleTech *A Time of War* compendium and character toolset.

## Current state

**Alpha Slice 19 is implemented.** Version `0.1.0-alpha.19` prepares the React + TypeScript + Vite application for a public Alpha preview while preserving Archetype v0.1, Point Buy v0.1, Life Modules v0.15, and the 84-item equipment catalog unchanged.

All eight published Core archetypes can create, display, save, export, and import characters with source provenance. Point Buy v0.1 creates a Normal Human draft with a focused catalog. Life Modules v0.15 covers the narrow Stage 0–4 branch, final review, Final Touches, and a searchable 84-item audited Core equipment catalog with manual fallback. Slice 19 adds public status/version information, persistent local-storage and limitations notices, static-deployment guidance, and production metadata; it adds no rules or catalog data.

The project remains in **Alpha**. Final Touches and “ready for equipment review” are draft states, not a finalized or ready-for-play character. Beta 1 is a future milestone requiring completed Core + Companion character creation and PDF export. The full equipment catalog, affiliation-adjusted access, heavy/combat-vehicle workflow, ammo and condition tracking, true character locking, negative-Trait purchase UI, PDF export, Planetary work, and playable-sheet runtime behavior remain outside the current implementation.

The primary product direction is an offline/PWA-capable, local-first web application whose Character Generator can later evolve into a playable character sheet. Public Alpha access targets an ordinary public browser URL and does not depend on ChatGPT login, workspace access, or session hosting. Character persistence remains local browser storage plus JSON import/export. Clearing browser data may remove saved work, so users should export backups. No app account, backend, or cloud save exists in this slice; account/login/cloud save is expected before v1.0 but remains deferred.

## Established implementation order

1. Archetype
2. Point Buy
3. Life Modules

All three creation methods must use one shared Character/Rules engine. Archetype establishes and exercises the common representation; Point Buy exercises direct XP purchasing; Life Modules adds its staged, path-dependent process.

Planetary functionality is supporting infrastructure. It does not replace or supersede this sequence, and the existence of planetary data does not create a mandatory homeworld requirement.

## Repository map

- [`src/domain/`](src/domain/) — shared Character/rules models and focused Archetype, Point Buy, and Life Module catalogs
- [`src/domain/finalTouches/`](src/domain/finalTouches/) — audited Wealth/C-bill, Equipped-rating, ownership, and equipment-draft rules
- [`src/domain/equipment/`](src/domain/equipment/) — audited personal-equipment catalog, raw/normalized ratings, metadata, lookup, filtering, and structural validation
- [`src/domain/skillFields/`](src/domain/skillFields/) — minimal durable Skill Field catalog and source-specific cost/grant definitions
- [`src/engine/`](src/engine/) — shared character factory plus Archetype, Point Buy, and Life Module engines
- [`src/validation/`](src/validation/) — typed validation results and minimal structural validation
- [`src/persistence/`](src/persistence/) — versioned JSON codec, local repository, and browser import/export
- [`src/ui/`](src/ui/) — app shell and functional Archetype v0.1, Point Buy v0.1, and Life Modules v0.15 routes
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

## Static public-preview readiness

The application builds as static files and has no server, authentication, analytics, external API, secret, or environment-variable requirement:

```bash
npm install
npm run build
npm run preview
```

`npm run build` writes the deployable site to `dist/`. The hash-based routes work on a conventional static host without provider-specific rewrite rules. A future host should publish `dist/` at a normal public HTTPS URL that requires neither ChatGPT access nor an application login. No hosting provider is hardwired, and Slice 19 does not perform a live deployment.

The public notice in the application identifies version `0.1.0-alpha.19`, browser-local storage, JSON backup/import portability, Core-first source scope, incomplete rules and equipment coverage, lack of a play-ready guarantee, and unavailable PDF export. Source PDFs are not part of the repository or production bundle.

## Current resume points

Repository bootstrap and Alpha Slices 1–19 are complete. The implemented app is a static, local-first Public Alpha and requires no server, database, account, or ChatGPT login.

The Core + Companion rules audit is in progress. Its next audit target is **Campaign / Rules Configuration reconciliation**, specifically the boundaries among durable character state, current campaign rules, creation-rules provenance, and per-character GM exceptions.

The next recommended implementation slice is **Alpha Slice 20 — public-preview hosting configuration and deployment**, only when a hosting target and live-deployment authorization are supplied. It should publish the existing static `dist/` output at a normal public URL without adding authentication, backend storage, analytics, rules content, or catalog data. Rules/catalog expansion and Planetary Data Foundation Rollout 1 remain separate future authorizations.

## Status vocabulary

This project distinguishes among proposed, approved, implemented, verified, unresolved, deferred, and superseded work. Documentation of a design does not mean it has been implemented.
