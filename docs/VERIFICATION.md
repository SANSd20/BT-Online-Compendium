# Future Verification Requirements

This file records verification expectations; the bootstrap does not execute implementation tests.

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

