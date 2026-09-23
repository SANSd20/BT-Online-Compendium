# Verification Requirements

This file records both verified implementation checkpoints and requirements for later slices.

## Alpha Slice 1 verification

The Slice 1 foundation is verified by the repository's `npm run check` command, which runs:

- ESLint across the project;
- Vitest unit tests;
- TypeScript project compilation; and
- the Vite production build.

Automated coverage currently verifies:

- all three creation-method placeholders use the shared character factory and model;
- creation, allocated, and earned gameplay XP remain distinct;
- the rules/source snapshot is present;
- a versioned character file round-trips without data loss;
- `skill.level = null` survives distinctly from `skill.level = 0`;
- unrelated JSON is rejected;
- browser-local save/list/load/delete works;
- a damaged stored entry does not block the rest of the local library; and
- invalid identity references produce a blocking structural validation issue rather than a blanket override.

Manual UI verification should continue as creation screens gain real rules content. Slice 1 does not claim the future requirements below are fully implemented.

## Alpha Slice 2 verification

Slice 2 extends the same `npm run check` gate. Automated coverage verifies:

- the catalog contains exactly the eight published Core archetypes with stable IDs and Corrected Third Printing page references;
- catalog validation rejects duplicate IDs, missing required package data, and unannotated XP-total mismatches;
- every archetype creates a structurally valid shared-schema character with method `archetype`;
- published Attribute scores and phenotype modifiers, Trait/Skill levels and XP, specialties, equipment ownership, C-bills, and source notes match golden expectations;
- every derived ledger entry retains source provenance;
- the declared 4,500-XP package value remains distinct from independently summed printed line-item XP;
- all eight created characters round-trip through the versioned JSON export/import path; and
- an unknown archetype ID is rejected.

The Archetype screen supports selection, naming, creation, validation, local save, summary display, and JSON export. Existing application import handles the resulting file through the common codec. This was the Slice 2 boundary; Slice 3 implements Point Buy while Life Modules remain a placeholder.

## Alpha Slice 3 verification

Slice 3 extends the same `npm run check` gate. Automated coverage verifies:

- creation of a sourced 5,000-XP Point Buy draft with all eight minimum Attributes;
- Attribute purchases update allocated and remaining XP correctly;
- standard cumulative Skill costs and structured subskills;
- explicit `level = null` untrained state remains distinct from trained Level +0 at 20 XP;
- positive and negative Trait XP remains separate from attained TP and identity scope;
- the negative-Trait credit cannot exceed 10 percent of starting XP;
- a purchase that would overspend the pool is rejected;
- malformed Attribute and XP ledgers fail validation;
- Point Buy source and cost-table provenance survives serialization;
- Point Buy characters round-trip through JSON and local persistence; and
- all prior Archetype golden/regression tests continue to pass.

The Point Buy screen supports naming, standard or GM-adjusted starting XP, Attribute controls, focused Skill/subskill and Trait controls, automatic local saving, validation status, and JSON export. Unspent XP is a draft warning; the engine prevents negative remaining XP, and validation prevents a character with remaining XP from being marked finalized.

## Character Generator

- All creation methods use one shared Character/Rules engine.
- The eight published Archetypes serve as early golden/regression fixtures.
- Rules and data remain separate from UI/application code.
- Stable IDs, structured subskills, and provenance survive serialization.
- `skill.level = null` remains distinct from `skill.level = 0`.
- Module-purchasing XP and stat-ledger XP cannot cross-finance.
- Flexible XP remains source-bound and restriction-aware.
- Award types retain their structure instead of flattening to destination plus XP.
- Trait XP, attained TP, and active state remain distinct.
- Base Attribute scores and phenotype modifiers remain distinct.
- Phenotype-granted free Traits are not charged XP.
- Birth/final affiliations and identity-specific Traits survive save/load.
- Field definitions and source-specific Field Grants remain distinct.
- Character Definition, Derived State, and Play State remain separate.
- Versioned import/export retains enough data to reproduce and audit results.
- Unresolved rules yield an explicit unresolved state rather than invented behavior.

## Alpha Slice 4 verification

Slice 4 extends the same `npm run check` gate. Automated coverage verifies:

- the Life Module catalog contains exactly the audited universal Stage 0 package, Capellan Confederation/Capellan Commonality, Blue Collar, and Back Woods entries;
- duplicate module IDs are detected and unknown module requests are rejected;
- a sourced Life Module draft begins with a standard 5,000-XP module-purchasing pool or records a GM-adjusted positive whole-number allotment;
- the universal package deducts 850 XP and applies +100 XP to every Attribute, concrete Language awards, and Perception XP;
- Capellan/Commonality deducts 150 XP and applies its fixed Attribute, positive/negative and parameterized Trait, Skill, and structured subskill awards;
- Blue Collar and Back Woods deduct their published costs and apply concrete fixed awards without allowing awards to finance the module pool;
- unresolved language, `/Any`, multi-choice, and flexible awards persist as source-bound pending records;
- Back Woods affiliation, STR 4+, and BOD 5+ prerequisites are recorded, with unsatisfied Attribute minimums retained for final validation rather than blocking selection;
- partial XP remains distinct from attained Attribute levels, Trait Points/activation, and Skill levels, including `null` versus Level +0;
- overspending is rejected and malformed pool/history reconciliation fails validation;
- Life Module history, awards, pending state, prerequisites, and provenance round-trip through the versioned JSON format; and
- all prior Archetype and Point Buy regression tests continue to pass.

Manual UI verification should confirm the route exposes phase, module-pool status, selected modules, applied awards, unresolved awards, prerequisite status, local save, and export. A Stage 1 selection with unresolved awards must remain in Stage 1 resolution and must not be presented as finalized or advanced to Stage 2.

## Alpha Slice 5 verification

Slice 5 extends the same `npm run check` gate. Automated coverage verifies:

- concrete language-choice grants apply to structured Language subskills;
- `/Any` awards require and retain concrete subskills;
- multi-choice awards resolve one grant at a time and preserve the remaining count;
- flexible awards apply only to source-permitted Attribute, Trait, or Skill target types;
- duplicate destinations within the same source award, missing subskills, and invalid flexible targets are rejected;
- resolved grants update Attribute, Trait, and Skill ledgers without changing the module-purchasing pool;
- partial Trait XP remains inactive until its threshold and Skill XP retains `null` versus Level +0 behavior;
- every resolved grant retains source, destination, XP, provenance, and resolution history;
- pending and resolved grant counts reconcile with durable catalog-derived requirements;
- malformed resolved destinations, missing grants, invalid provenance, and inconsistent phase/stop state fail validation;
- prerequisites are re-evaluated after every allocation;
- fully resolved, prerequisite-satisfied Stage 0/1 drafts reach `alpha-partial-stop` while later continuation and full finalization remain unsupported;
- partially resolved state survives both local storage and versioned JSON round trips; and
- all prior Archetype, Point Buy, and Life Module v0.1 regression tests continue to pass.

Manual UI verification should confirm every pending award exposes an appropriate resolver, each applied grant disappears or decrements its source pending record, summaries update immediately, resolved choices remain visible, and the Alpha partial-stop message cannot be mistaken for Beta 1 completion.

## Alpha Slice 6 verification

Slice 6 extends the same `npm run check` gate. Automated coverage verifies:

- a resolved Stage 1 Alpha stop can explicitly continue into Stage 2 without implying finalization;
- Stage 2 Back Woods and High School are present in the catalog and only one Stage 2 module may be selected;
- each Stage 2 module deducts its published cost from the separate module-purchasing pool and applies its fixed Attribute, Trait, Skill, and structured-subskill awards;
- Stage 2 `/Any`, `/Affiliation`, language, and flexible awards persist as source-bound pending state and resolve through the shared award engine;
- the 125-XP and 185-XP flexible awards retain a durable remaining pool rather than artificial fixed chunks;
- Stage 2 flexible allocation enforces no more than 35 XP to one Skill and no more than 200 XP to one Attribute or Trait;
- High School tracks a non-Clan affiliation and absence of an active Illiterate Trait, with prerequisites re-evaluated after award changes;
- Stage 2 chronology records age 16, provenance survives, and resolved plus unresolved Stage 2 state round-trips through the versioned JSON format;
- malformed flexible allocations, cap violations, invalid targets, overspending, unknown modules, and inconsistent stage state are rejected or reported; and
- all prior Archetype, Point Buy, and Life Module regression tests continue to pass.

Manual UI verification should confirm Stage 1's Alpha partial stop offers explicit Stage 2 continuation, Back Woods and High School are selectable, pooled flexible XP accepts an allocation amount and reports the remaining pool, prerequisite status updates, and the Stage 2 stop clearly states that Stage 3, Stage 4, and finalization remain unsupported.

## Core + Companion audit requirements

Verify that future implementation:

- distinguishes temporary construction-time prerequisite failure from final validation failure;
- applies the rules-defined more restrictive requirement when multiple requirements affect one statistic;
- preserves approved GM-arbitrated prerequisite exceptions;
- preserves partial XP separately from attained values;
- never performs Optimization or negative-Trait XP purchases silently;
- enforces the applicable 10-percent negative-Trait XP ceiling for creation and Point Buy;
- separates creation-pool, allocated, and earned/unspent gameplay XP;
- permits unspent starting C-bills to carry into play;
- treats Equipped as access limits rather than consumable points;
- keeps Wealth separate from character-wide C-bills;
- applies identity-bound Wealth and Vehicle Traits only through the active identity;
- keeps optional Issued Gear off by default and preserves issued items across later configuration changes;
- keeps equipment ownership, location, carried state, and loadout relationships independent;
- represents combat loadout as references into inventory, not duplicate items;
- distinguishes assigned and owned vehicles and links Custom Vehicle choices to the applicable vehicle entitlement;
- preserves creation-rules provenance separately from current campaign/play rules;
- makes recalculation/rebuild explicit after material rule changes;
- enforces advancement-specific training, justification, GM, creation-only, and promotion restrictions;
- distinguishes EDG development, available Edge, burned-Edge recovery, and the Unlucky anti-Edge pool;
- separates base character state, current condition, and permanent injury/effect state;
- applies optional Hit Locations prospectively without inventing locations for earlier abstract damage;
- preserves underlying conditions separately from prosthetic/implant replacements where required;
- derives augmentation effects without rewriting base Attribute XP;
- maintains separate XP/level/TN state for each required subskill;
- retains provenance when resolving **/Any** awards;
- keeps specialties distinct from subskills and enforces the one-specialty Core limit;
- keeps Skill Fields as packages/history rather than playable Skill levels;
- stores SPAs as their own extensible capability type;
- separates SPA acquisition prerequisites from conditions for using the SPA;
- represents ordinary SPA creation restrictions plus GM exceptions rather than an absolute ban;
- distinguishes campaign configuration from narrow durable GM overrides;
- does not reintroduce Thick-Skinned or Thin-Skinned from stale references;
- uses Oblique Attacker rather than Oblique Marksman for the Companion page 65 reference.

## Planetary Rollout 1

Verify at minimum:

- raw YAML fidelity;
- unknown-field survival;
- sourced values retain source/version/value;
- unsourced values remain unsourced;
- temporal ownership before and after a real transition;
- multiple factions remain multiple;
- historical-name resolution;
- Euclidean distance against an independently calculated result;
- connectors remain in raw storage but are excluded from ordinary lookup;
- staged snapshots do not alter accepted results;
- later deletion does not destroy older snapshots;
- ambiguous names do not resolve arbitrarily.

Known useful systems include New Avalon, Terra, and Skye. Eventual fixtures must also use real upstream examples of an Independent world, an abandoned/uninhabited world, a disputed world, a historically renamed world, and a connector. Do not invent fixture behavior.

## Documentation/state review

At every material checkpoint, ensure status labels remain accurate. Designed or documented work must not be reported as implemented, and implemented work must not be reported as verified until its required checks have passed.
