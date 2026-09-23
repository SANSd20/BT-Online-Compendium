# Character and Rules Architecture

## Shared engine

Archetype, Point Buy, and Life Modules must use one Character/Rules engine. Rules/data must be separated from application and UI logic. Stable internal IDs—not mutable display names—identify rules objects.

The engine must support distinct operations conceptually equivalent to:

- `REQUIRE`
- `PROHIBIT`
- `LIMIT`
- `REPLACE`
- `CLASSIFY`
- `MODIFY`
- `GRANT`

Do not flatten all conditions into a generic prerequisite. Preserve differences among prerequisites, availability conditions, era conditions, path conditions, source-defined exceptions, and explicit GM overrides.

Rules may depend on affiliation, sub-affiliation, campaign/date context, chronology, phenotype, caste, Traits, Skills, prior modules, identities, stages, and other history.

## Life Module state machine

Life Modules are path-dependent:

Starting XP Pool → Stage 0 Affiliation → Stage 1 Early Childhood → possible legal Finalization → Stage 2 Late Childhood → path-dependent Stage 3 and/or Stage 4 → Finalization.

Some paths require later stages, skip Stage 3, require Stage 4, or permit an earlier stop. Legal next actions must be calculated from current character state. Each module must resolve required awards and choices before advancement.

Preserve module cost, fixed awards, mandatory destination choices, choice packages/groups, Flexible XP, conditional awards, prerequisites, chronology/time, Skill Fields, repeat rules, source-specific exceptions, and provenance.

### Stage 0 universal package

Stage 0 includes both the universal package and the chosen affiliation. The universal package costs 850 XP and establishes the basic foundation, including:

- +100 XP to every Attribute;
- Language/Affiliation Primary or Secondary Language;
- Language/English;
- Perception.

The affiliation's listed cost is not the complete Stage 0 cost.

### Changing Affiliations

Changing Affiliations is a separate Stage 0 mechanism. Preserve `birthAffiliation`, `finalAffiliation`, and affiliation history rather than overwriting origin.

The published mechanism applies half the XP values and purchase costs of both affiliations with the applicable rounding rules. Only final-affiliation restrictions apply. Previously resolved `/Affiliation` Skills or Languages remain historical concrete selections and are not dynamically rewritten.

## XP model

Keep the module-purchasing XP pool separate from the character-stat XP ledger.

- Module awards do not replenish the purchasing pool.
- Negative awards do not finance later modules.
- Stage 3 Skill Fields may award more Skill XP than their purchase cost.
- Finalization optimization cannot finance more Life Modules.
- Flexible XP remains attached to its source module and obeys that module/stage's restrictions.

XP must retain provenance. Do not store only flattened totals. A ledger may, for example, show distinct Perception awards from Stage 0, a Stage 2 module, and that module's Flexible XP.

## Award model

At minimum, support:

- **Fixed direct:** predetermined destination.
- **Fixed choice:** mandatory award with player-selected allowed destination.
- **Choice package/group:** one option selects linked awards.
- **Flexible award:** player allocation under source restrictions.
- **Conditional award:** exists only when its condition applies.
- **Field grant:** a Skill Field granted/purchased under source-specific cost and XP rules.

Rules may impose chunks, destination-count maxima, minimum spends, destination types, allowed fields, prohibited types, repeat behavior, and affiliation/path conditions.

## Skills and subskills

Parameterized Skills/subskills must retain structure sufficient for the rules engine, for example `Language/English`, `Survival/Desert`, `Technician/Weapons`, and `Protocol/Federated Suns`. Do not reduce structured meaning to opaque strings.

Skill state is mechanically three-valued:

- `level = null`: absent/untrained;
- `level = 0`: possessed and trained at +0;
- `level > 0`: trained at that level.

Never collapse `null` and `0`; Skills such as Climbing, Swimming, and Martial Arts can behave differently when untrained.

## Traits

Trait XP is not the same as an active Trait. A Trait generally has no mechanical effect until its required XP threshold is attained.

A Trait ledger entry must conceptually preserve accumulated XP, attained Trait Points, active state, source awards, identity, and parameters. Catalog minimum/maximum TP is validation data.

Opposed Traits, incompatible Traits, and overlapping-condition restrictions are different mechanics and must remain distinct.

## Phenotype

Every character has exactly one phenotype. Normal Human is the default where no special phenotype applies; Clan trueborn characters require an applicable special phenotype.

Purchased/base Attribute score and phenotype modifier must remain separate. Phenotype-granted free Traits are not charged XP.

## Identities

Support a primary identity, alternate identities, identity-specific Traits, and character-wide Traits. Per-identity multiplicity comes from Trait definitions. Opposed identity-based Traits do not cancel globally across unrelated identities.

Trueborn has special identity behavior and belongs to the primary/birth identity. Bloodname does not transfer between aliases.

## Skill Fields

A Skill Field definition has a stable ID, name, component Skills, and prerequisites. A separate Field Grant records source, field, XP per Skill, purchase cost/rule, training tier/context, chronology, exceptions, and choices.

Do not hard-code the standard Stage 3 cost/award formula into the field definition; other sources may grant fields differently. Independently possessing every component Skill does not necessarily confer the formal Skill Field.

