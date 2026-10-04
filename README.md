# BT Online Compendium

Durable project authority for a web-based BattleTech *A Time of War* compendium and character toolset.

## Current state

**Alpha Slice 81 is implemented.** Version `0.1.0-alpha.81`. The public product title is **AToW Online Character Creator**. HPG Technician is now mechanically acquirable through Trade School and University for characters with ComStar, Word of Blake, or Clan affiliation plus the Communications Field. Its five source-listed Skills cost 120 XP and receive +30 XP each. The mechanically acquirable catalog now contains fifty entries while the independent 56-entry reference catalog and 84-item equipment catalog remain unchanged.

All eight published Core archetypes can create, display, adjust, save, export, and import characters with durable foundation provenance. Attribute and existing-Skill level changes remain separate, Point Buy-accounted records. Skill swaps retain Slice 24's exact, bounded same-XP behavior. The Slice 25 audit remains the evidence record; Slice 28 governs its conflicts without silently correcting Tanker, Elemental, or Scout values, adding `REF`, renaming stable IDs, or activating back-sheet combat fields. Point Buy, Life Modules, Final Touches, and the 84-item audited Core equipment catalog are unchanged.

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
- [`docs/archetype-sheet-cross-check.md`](docs/archetype-sheet-cross-check.md) — Alpha Slice 25 prose/package versus back-sheet audit and deferred governing decisions
- [`docs/ARCHETYPE-SOURCE-GOVERNANCE.md`](docs/ARCHETYPE-SOURCE-GOVERNANCE.md) — Alpha Slice 28 policy for active prose/package data, supplemental back sheets, conflicts, and display variants
- [`docs/LIFE-MODULES-AFFILIATION-FRAMEWORK.md`](docs/LIFE-MODULES-AFFILIATION-FRAMEWORK.md) — Alpha Slice 29 boundary for Universal, the current affiliation context, selector groups, and deferred expansion

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

The target Pages URL was verified live during Slice 21 and remains the Public Alpha deployment target. Version `0.1.0-alpha.74` will be live after this commit reaches `main` and the existing Pages deployment succeeds.

The collapsed-by-default public notice identifies version `0.1.0-alpha.74`; its expandable details retain browser-local storage, JSON backup/import portability, normal-browser access without a special platform or application login, Core-first source scope, incomplete rules and equipment coverage, lack of a play-ready guarantee, and unavailable PDF export. Source PDFs are not part of the repository or production bundle.

## Current resume points

Repository bootstrap and Alpha Slices 1–57 are complete. The implemented app is a static, local-first Public Alpha and requires no server, database, special platform login, or application account.

The Core + Companion rules audit is in progress. Its next audit target is **Campaign / Rules Configuration reconciliation**, specifically the boundaries among durable character state, current campaign rules, creation-rules provenance, and per-character GM exceptions.

The next recommended Character Generator slice is a focused accessibility and keyboard-navigation review of the completed Life Modules wizard. This is a recommendation only and requires separate authorization. Full affiliation expansion and post-Beta random-name generation remain separate future work. Archetype Final Touches handoff, full Skill catalog selection, arbitrary new Skills, specialties, Trait adjustments, GM override, unbalanced completion, and the remaining 500 XP / 5,000 XP campaign buy-up remain deferred. Rules/catalog expansion and Planetary Data Foundation Rollout 1 remain separate future authorizations.

## Status vocabulary

This project distinguishes among proposed, approved, implemented, verified, unresolved, deferred, and superseded work. Documentation of a design does not mean it has been implemented.
