# Reusable Browser Verification Framework

The browser verification layer is intentionally split into shared workflow
helpers and faction fixtures. `scripts/browserVerification.mjs` provides:

- installed-Chrome launch with `ATOW_BROWSER_EXECUTABLE_PATH`;
- legitimate Stage 0 March creation through accessible UI controls;
- exact import-status/card resume handling;
- summary assertions for typed awards and pending-choice state;
- export/import checkpoint support;
- stage checkpoint snapshots for later progression assertions.
- generic module selection, visible-choice resolution, and stage transitions.

`B12_FIXTURES.capellan` and `B12_FIXTURES.draconis` contain only
faction-specific identity and expected award data. They reuse the same
workflow helpers and do not inject character state.

## Checkpoint contract

Each checkpoint is reached through the player-facing UI, then may be exported
to a disposable path outside the repository. Resume by supplying the file to
the supported import control, waiting for the exact `Imported <name>.` status,
scoping to that character's card, and clicking `Resume`. Never use broad text
locators or preconstructed intermediate state.

The shared checkpoint vocabulary is Stage 0, Stage 1, Stage 2, Stage 3, Stage
4, and Final Review. `chooseAvailableModule`, `resolveVisibleChoiceSlots`,
and `continueStage` are intentionally generic; a faction fixture supplies
only the source-valid module labels and expected awards. Checkpoint artifacts
must be exported after each successful transition and resumed in a fresh
browser context.

The B12 implementation verifies Stage 0 and Stage 1 import/resume checkpoints;
the V1d progression below extends browser verification through Stage 4 and
Final Review.

## V1d executable progression

`V1D_FIXTURES.capellanProgression` and `completeV1dProgression` exercise a
source-valid Federated Suns / Capellan March route entirely through the
player-facing browser UI:

1. Stage 0: English, Capellan March, Spanish march language, Strategy.
2. Stage 1: Blue Collar with Aerospace Pilot, FedSuns History, Geology, and
   four visible Skill allocations.
3. Stage 2: High School with two governed Interest choices and 185 XP to INT.
4. Stage 3: Technical College with Technician/Civilian (Basic),
   Technician/Vehicle (Advanced), FedSuns History, and 200 XP to INT.
5. Stage 4: Agitator with governed Driving and Prestidigitation choices and
   three capped flexible allocations totaling 125 XP.

The integration test exports a disposable Stage 4/Final Review checkpoint,
closes the browser session, imports it into a fresh session, and resumes the
same character. `completeV1dFinalReview` then uses the normal UI to run
Optimize All, raise DEX to satisfy the Technician/Civilian DEX 3+ requirement,
and allocate the remaining final pool across legal existing Attributes. The
test asserts Final Review reaches Ready for Final Touches with no pending
awards, optimization opportunities, or final blockers. Checkpoint files remain
outside the repository.

The fixture records only source-valid labels and XP decisions; it does not
inject character JSON or alter gameplay rules. The generic helpers remain
faction-independent, so future factions can supply equivalent fixture data.

## Adding another faction

Add a fixture containing only source-specific identity, choices, and expected
summary awards. Reuse `createMarchThroughStage0`, `assertFixtureSummary`,
`exportAndReopen`, and `checkpointSnapshot`; do not add faction branches to
the generic helpers.

## Boundaries

These helpers verify browser-observable behavior. Engine-only assertions,
codec round trips, and source-fidelity checks remain separate tests. Temporary
artifacts belong outside the repository, and no helper changes game rules,
Clan activation, deployment, or release metadata.
