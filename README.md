# BT Online Compendium

Durable project authority for a web-based BattleTech *A Time of War* compendium and character toolset.

## Current state

**Alpha Slice 24 is implemented.** Version `0.1.0-alpha.24` reviews and hardens controlled Archetype adjustments and adds bounded, reversible same-XP Skill swaps over each source-backed Core Archetype foundation.

All eight published Core archetypes can create, display, adjust, save, export, and import characters with durable foundation provenance. Attribute and existing-Skill level changes remain separate, Point Buy-accounted records. Skill swaps are available only when the source and replacement are exact, non-specialty Skill instances already audited in the existing Core Archetype data, their required subskill identities are explicit, and their shared Point Buy XP values match exactly. Ambiguous targets are blocked rather than guessed. All adjustment deltas must net to exactly 0 XP before save, export, or progression. Point Buy v0.1 and Life Modules v0.15 behavior remain unchanged, as does the 84-item audited Core equipment catalog. Slice 24 adds no rules or catalog data.

The project remains in **Alpha**. Final Touches and “ready for equipment review” are draft states, not a finalized or ready-for-play character. Beta 1 is a future milestone requiring completed Core + Companion character creation and PDF export. The full equipment catalog, affiliation-adjusted access, heavy/combat-vehicle workflow, ammo and condition tracking, true character locking, negative-Trait purchase UI, PDF export, Planetary work, and playable-sheet runtime behavior remain outside the current implementation.

The primary product direction is an offline/PWA-capable, local-first web application whose Character Generator can later evolve into a playable character sheet. The Public Alpha is accessible at a normal browser URL with no special platform login or application account required. Character persistence remains local browser storage plus JSON import/export. Clearing browser data may remove saved work, so users should export backups. No app account, backend, or cloud save exists in this slice; account/login/cloud save is expected before v1.0 but remains deferred.

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

## Public Alpha hosting

GitHub Pages is the selected static host. The target public URL is:

<https://sansd20.github.io/BT-Online-Compendium/>

The application has no server, authentication, analytics, external runtime API, secret, or environment-variable requirement. Build and preview it locally with:

```bash
npm install
npm run build
npm run preview
```

`npm run build` writes the deployable site to `dist/` with Vite's production base set to `/BT-Online-Compendium/`; `npm run dev` remains rooted at `/`. Hash-based routes require no rewrite rules. The workflow at `.github/workflows/deploy-pages.yml` runs on every push to `main` or by manual dispatch, installs with `npm ci`, runs `npm run check`, rebuilds, uploads `dist/`, and deploys it through the GitHub Pages environment with no repository secrets.

The repository's Pages **Source** setting must be **GitHub Actions**. The public site opens through a normal browser URL and requires neither a special platform login nor an application login. Character data still lives only in that browser; JSON export/import is the portability and backup mechanism.

The target Pages URL was verified live during Slice 21 and remains the Public Alpha deployment target. Version `0.1.0-alpha.24` will be live after this commit reaches `main` and the existing Pages deployment succeeds.

The public notice in the application identifies version `0.1.0-alpha.24`, browser-local storage, JSON backup/import portability, normal-browser access without a special platform or application login, Core-first source scope, incomplete rules and equipment coverage, lack of a play-ready guarantee, and unavailable PDF export. Source PDFs are not part of the repository or production bundle.

## Current resume points

Repository bootstrap and Alpha Slices 1–24 are complete. The implemented app is a static, local-first Public Alpha and requires no server, database, special platform login, or application account.

The Core + Companion rules audit is in progress. Its next audit target is **Campaign / Rules Configuration reconciliation**, specifically the boundaries among durable character state, current campaign rules, creation-rules provenance, and per-character GM exceptions.

The next recommended slice is **Alpha Slice 25 — Archetype Final Touches Handoff**, contingent on a separate authorization to extend the existing Final Touches entry path beyond Life Modules. Full Skill catalog selection, arbitrary new Skills, specialties, Trait adjustments, GM override, unbalanced completion, and the remaining 500 XP / 5,000 XP campaign buy-up remain deferred. Rules/catalog expansion and Planetary Data Foundation Rollout 1 remain separate future authorizations.

## Status vocabulary

This project distinguishes among proposed, approved, implemented, verified, unresolved, deferred, and superseded work. Documentation of a design does not mean it has been implemented.
