# Character and Rules Architecture

## Alpha Slice 23 implementation boundary

The implemented foundation provides typed Character and rules models, one shared character factory, structural validation, a versioned save envelope, browser-local persistence, JSON import/export, an Archetype foundation with shared XP accounting and controlled adjustments, Point Buy v0.1, and Life Modules v0.15 with Final Touches, an unchanged 84-item audited equipment catalog, affiliation-aware access review, and manual inventory fallback. Alpha Slice 23 was reimplemented from durable Slice 22 after the prior local Slice 23 commit was lost. Point Buy-from-scratch, Life Modules, rules data, and catalog data remain unchanged. The project remains Alpha; Beta 1 requires completed Core + Companion character creation and PDF export.

The Public Alpha is a static browser application at `https://sansd20.github.io/BT-Online-Compendium/`. It opens through a normal browser URL without a special platform login or application account. Characters remain in browser-local storage unless exported as JSON; clearing browser data may remove them. JSON import/export is the current portability mechanism. No backend, account, authentication, cloud save, analytics, or server-side persistence exists. Account/login/cloud save is expected before v1.0 but is not part of the current architecture. Public status does not imply complete rules, complete equipment, final/play-ready legality, PDF export, Beta 1, or v1.0 completion.

The rules catalog contains source/version descriptors, the eight published Core archetype packages, focused Point Buy catalogs, eight audited Core Life Module entries through Agitator, and two audited Skill Fields: Technician/Civilian and Technician/Vehicle. It does not claim that the full Life Module, Skill Field, or Core + Companion catalog has been entered.

Archetype definitions retain their stable ID, display name, source, Attributes, Traits, structured Skills/subskills, specialties, equipment, C-bills, phenotype, and source notes. Creation maps them into the same saved Character Definition and records the selection as a versioned `source-backed-preset`. Its original ID/name/source, published provenance reference, declared XP total, and printed allocations remain durable.

Slice 23 layers a separate controlled adjustment ledger over that foundation. It supports level changes to Attributes and Skills already present in the selected Archetype. Each record retains a stable adjustment ID, target type and ID, increase/decrease operation, source and adjusted values, Point Buy XP values and delta, foundation reference, player-choice provenance, award linkage, timestamps, and an optional note. Applying or removing a record updates only the working character ledger; it does not mutate the Core Archetype catalog. The total adjustment delta must be exactly 0 XP before save, JSON export, or progression. Slice 22 saves migrate to the versioned Slice 23 foundation with an empty ledger.

Trait adjustments, new-Skill swaps, GM override, freeform unbalanced completion, and the remaining 500 XP / 5,000 XP campaign buy-up are not implemented. Attribute and Skill delta calculations reuse Point Buy cost functions, but the Archetype experience remains a source-package adjustment workflow rather than full Point Buy.

Core page 51 calls these 4,500-XP packages, while several printed sheets' listed XP do not sum to 4,500. The model therefore stores the declared package total separately from the calculated ledger allocation and preserves an explicit source note for each mismatch. It does not infer corrected scores or XP. Tanker's printed Attribute scores and XP also conflict and are both retained as printed. Elemental's displayed Skill levels and listed XP are likewise retained separately where Field Aptitude affects the displayed level.

Point Buy v0.1 implements the Corrected Third Printing pages 49, 51, 60, 95, 107, and 121-122 foundation for a Normal Human:

- standard starting allotment of 5,000 XP, with alternate user-entered amounts recorded as GM-adjusted;
- all eight Attributes initially purchased at Level 1 for 100 XP each;
- Normal Human maxima of 8 for STR/BOD/DEX/RFL/INT/WIL and 9 for CHA/EDG;
- cumulative standard Skill costs from Level +0 through +10;
- Traits purchased at 100 XP per TP;
- negative Traits returning XP up to 10 percent of the starting allotment;
- signed ledger allocation, reconciled remaining XP, and overspend rejection; and
- explicit untrained `level = null` versus trained Level +0.

The Point Buy UI saves drafts with unspent XP, but structural validation warns that they cannot enter play. A character marked `finalized` is invalid unless remaining creation XP is zero. Slice 3 does not expose finalization because required affiliation, full catalogs, prerequisites, and exhaustive legality validation are not yet implemented.

Life Modules v0.15 implements the Stage 0 universal → Stage 0 affiliation → Stage 1 → Stage 2 → Technical College Stage 3 → Agitator Stage 4 path, with an explicit Alpha stop before each optional continuation, a final-review state after Stage 4, and a gated Final Touches/equipment draft with affiliation-aware catalog purchasing. It keeps the module-purchasing pool separate from awarded statistic XP, records selected-module and Field history, applies fixed awards to shared ledgers, and resolves pending language, affiliation, `/Any`, multi-choice, and flexible allocations incrementally. Every resolved allocation retains its source award, concrete destination, XP, provenance, and resolution time.

Prerequisites are re-evaluated after each allocation. Stage 2 retains its source caps; Stage 3 records Skill Fields as grants rather than playable Skills; and Agitator reaches age 23 with repeat-policy metadata while repeat execution remains blocked. Resolved Stage 4 drafts may explicitly enter `alpha-final-review`. The immutable module-pool remainder seeds a separate final-allocation pool. Final allocation targets existing Attribute, Trait, and Skill instances and records player-choice provenance. Attained values derive from fully purchased thresholds, so partial XP remains durable without increasing the active value.

Optimization is Life-Modules-only and explicit. A preview identifies supported excess or out-of-range XP; applying one opportunity records before/after XP, returned XP, reason, time, rules source, and provenance, then credits only the final-allocation pool. It never finances modules. Current opposed-Trait checks cover modeled Gregarious/Introvert and Illiterate versus a Language at Level +4 or higher. The negative-Trait XP purchase cap is calculated as 10 percent of starting allotment, but purchase execution remains deferred. `ready-for-final-touches` means only that current final-review blockers are clear. Slice 10 permits a durable Final Touches/equipment draft after that gate; PDF export, true final lock, and ready-for-play status remain unsupported.

The `playState` property is only a versioned extension point. No playable-sheet runtime system or UI is implemented.

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


## Construction, prerequisites, and final validation

Life Module prerequisites need not be satisfied at the moment a module or Skill Field is selected, but normally must be satisfied by final character validation. Temporary prerequisite failure during construction is therefore distinct from final validation failure.

When multiple requirements affect the same statistic, apply the rules-defined more restrictive requirement. Conflicting Life Module or Skill Field prerequisites normally prevent the later conflicting selection. Explicit GM arbitration may override a Life Module prerequisite, and an approved exception must be preserved so the character does not become invalid again when reopened.

Partial XP invested in Attributes, Traits, and Skills is legitimate durable state. Accumulated XP and attained value remain separate concepts.

Optimization is an explicit optional creation operation; never perform it silently. Alpha Slice 9 previews and applies supported Life Module Optimization with durable provenance. Buying additional creation XP through negative Traits is a separate optional operation subject to the Core limit of 10 percent of starting XP; Slice 9 records the cap but does not expose purchase UI. The same applicable ceiling governs Point Buy.

The starting creation XP pool must be exhausted before normal play. Allocated XP that does not yet attain the next Attribute, Trait, or Skill level remains on that statistic. Keep separate:

- the creation XP pool;
- XP allocated to character statistics;
- earned and unspent gameplay XP.

## Final Touches, equipment, and currency

Alpha Slices 10–17 implement this section as an affiliation-aware catalog-backed draft boundary with manual fallback. It stores physical description, background, homeworld text, metric height/weight, optional hair/eye color, Wealth-derived starting cash, Equipped-derived access limits, character affiliation category/native code, Issued Gear configuration, and inventory. Entering the draft requires the Life Modules `ready-for-final-touches` state. Reaching `ready-for-equipment-review` is not character finalization.

Descriptive Final Touches, including appearance and background, are not mechanical legality requirements unless a specific rule makes them so.

Starting-equipment purchasing is the final pre-play equipment step, but a player need not spend all C-bills. Unspent C-bills carry into play.

Equipped is an access-limit Trait, not a consumable equipment-point pool. Wealth and C-bills are different:

- **Wealth** is the official Trait representing financial standing, resources, and access—conceptually closer to creditworthiness than cash.
- **C-bills** are tracked spendable liquid funds.

Spending or receiving C-bills does not automatically modify Wealth. Do not rename Wealth to “Credit Score” or create a derived numerical Wealth account without a rule requiring one. Salary, bonuses, Property/Extra Income, and expenses may change currency without changing Wealth.

Wealth is identity-bound. Ordinary C-bills are character-wide unless later authoritative rules establish otherwise; do not invent separate bank balances for aliases.

The implemented Wealth table maps attained TP -1 through +10 to starting C-bills; absent Wealth defaults to 0 TP and 1,000 C-bills. The starting total is captured when Final Touches begins, while spent and remaining totals derive from Owned items. Unspent C-bills remain durable.

The implemented Equipped table maps attained TP -1 through +8 to maximum Tech/Availability/Legality letters; absent Equipped defaults to 0 TP and D/B/B. Slice 10 validates manual items against these base limits. Periphery/Clan Tech adjustments and non-native-affiliation Availability/Legality adjustments remain deferred because the current narrow branch does not model all required affiliation classifications.

### Optional Issued Gear

Support the Core optional Issued Gear rule, off by default. Enabling it later enables issued-gear functionality prospectively and does not rebuild or retroactively change original purchases. Disabling it later must not silently delete existing issued items.

Personal-equipment ownership needs only:

- **Owned**;
- **Issued**.

Slice 10 establishes an optional issuer/employer note and GM-review state. It does not add issuer identities, issue dates, sessions, units, or adjudication machinery.

Issued Gear is an explicit creation-rules option and defaults off. Owned items reduce C-bills and are personal property. Issued items require the option, reduce no C-bills, and are not personal property. Disabling the option later does not delete recorded Issued items; it creates a validation issue. Slice 10 does not adjudicate occupation eligibility or automatically choose the cheapest item.

### Inventory and loadout

Inventory is character-wide. Preserve equipment location because the Core record sheet records where equipment is kept. Ownership and location are independent.

Slice 18 inventory accepts 84 current audited catalog items or manual entries. The existing page-306 Power Pack, Clan row now uses canonical ID `core.power.clan.powerPack.standard` while retaining its display name and hand-audited normalized `F/B/A` rating; three net-new Clan pack rows share the `core.power.clan.*` namespace. All 84 current records carry `preserved` raw-rating status; normalized Tech and Legality match raw endpoints and normalized Availability occurs somewhere in the triplet without inferring a universal position or era meaning. Version-2 purchase snapshots preserve name, cost, category, source, affiliation, ratings, metadata, and notes. Manual entries stay visibly non-catalog and retain their entered data. PP capacity and quick-charge remain inert metadata; direct runtime-like inventory state is rejected.

The access calculator keeps four concepts distinct: normalized item rating, effective item rating, base Equipped limits, and adjusted character limits. Neutral or native items retain normal Availability/Legality. A non-neutral foreign affiliation increases both one letter, capped at F. Periphery reduces the Owned Tech cap one letter with a B floor; Clan increases it one letter with an F ceiling. Issued items require the option and use E/D/D for Inner Sphere/Periphery or F/D/D for Clan, cost no C-bills, and remain non-personal property. Employer eligibility remains a review task.

Items not currently carried do not automatically count toward current carried weight or encumbrance. Combat loadout is a subset/reference into inventory, not a duplicate authoritative inventory. Worn armor, currently relevant weapons, and ammunition belong to current combat/loadout state.

### Vehicles

Vehicle Level establishes the major vehicle entitlement/class and normally represents an assigned vehicle. Paying the Core ownership enhancement makes it owned. Use:

- **Assigned**;
- **Owned**.

Do not use personal-equipment “Issued” terminology for Vehicle Level. Clan characters who remain in the Clans cannot select vehicle ownership under the Core rule.

Vehicle Level does not select an exact model; Custom Vehicle controls model-selection choice. Preserve the relationship between each Custom Vehicle instance and its applicable Vehicle Trait/vehicle. Vehicle Traits are identity-bound. Companion vehicle expansions remain optional/deferred unless separately authorized.

## Creation and current rule profiles

Identity remains a rules object, not merely a name string. Active identity determines which identity-bound Traits apply. Alternate identities are not duplicate characters; ordinary inventory and C-bills remain character-wide unless an authoritative rule says otherwise. Vehicle Traits remain identity-associated because Core explicitly defines them that way.

Do not permanently bind all optional rules to the state used at creation. Preserve historical creation-rule provenance/snapshot where needed and separately support current campaign/play rules. A later current-rule change that would materially alter creation must flag the difference rather than silently rebuilding the character. Recalculation or rebuilding is explicit.

## Advancement and post-creation modification

Post-creation advancement is not unrestricted Point Buy reuse:

- Attributes require XP plus the rules-defined practice, training, and GM concurrence.
- New Traits normally require justification and GM approval.
- Creation-only Traits cannot normally be acquired through later XP purchases.
- Rank changes through campaign/GM promotion or demotion, not an ordinary XP purchase.
- Skills have training/use requirements; Advanced Skills have stricter training rules.
- Aging can directly alter Attribute XP and Traits.

Support distinct post-creation mechanisms conceptually:

- XP advancement;
- aging;
- gameplay/event effects;
- GM/campaign changes.

A minimal provenance/origin marker may distinguish these mechanisms, but no large audit-log requirement is established.

## Edge state

Distinguish the developed EDG Attribute from currently available Edge. Burning Edge reduces available Edge, not accumulated EDG Attribute XP.

Recovering burned Edge and improving EDG are different:

- burned Edge recovery costs 20 XP per recovered point;
- improving EDG follows normal Attribute advancement at 100 XP per Attribute point;
- natural/GM recovery cannot exceed the underlying EDG score;
- if available Edge reaches 0, the first point must be restored through the rules-defined XP method before ordinary recovery resumes.

Unlucky has its own anti-Edge pool and is not part of the character’s EDG pool.

## Damage, healing, and permanent effects

Keep separate:

1. base/durable character state;
2. current condition/runtime state;
3. permanent effects.

Runtime state includes Standard Damage, Fatigue, Stunned/Unconscious state, bleeding, temporary injury modifiers, temporary movement effects, and unresolved specific wounds where applicable. Runtime injury modifies effective values without destructively rewriting base Attributes.

Optional Hit Locations add location-specific wound state prospectively when enabled. Do not invent hit locations for prior abstract damage.

Healing and surgery can convert injuries into durable effects such as Lost Limb, Poor Vision, Poor Hearing, Handicap, Compulsion/Medical Addiction, or permanent Attribute modifiers. Permanent Fatigue must be representable separately from recoverable Fatigue.

### Prosthetics and implants

Prosthetics and implants are not solely ordinary inventory. Preserve an underlying injury/condition separately from an installed replacement where the rules do so.

Types 1–5 generally offset an underlying condition rather than deleting it. Type 6 cloned replacements can eliminate the corresponding condition where Core specifies that result.

Installed augmentations may modify Attributes, Traits, Skills, Initiative, BAR, Fatigue, and other effective values. Do not overwrite base Attribute XP; derive effective statistics from base state plus applicable modifiers. Companion advanced cybernetics require a generic effect/modifier mechanism rather than one-off fields for each implant.

## Specialties and Skill Field history

A root Skill plus a required subskill is a distinct trained Skill instance. Different subskills have separate XP, levels, and target numbers. **/Any** awards must resolve to a specific legal subskill while retaining provenance from the unresolved award to that choice.

Specialties are optional and distinct from subskills. Under Core, one Skill/subskill may have at most one specialty, which may develop after creation.

Skill Fields award XP to underlying Skills, not playable Skill statistics. Preserve selected Fields in creation provenance/history because later rules can reference Field membership. Do not create false statistics such as “MechWarrior Field Level 4.”

## Special Pilot Abilities

Special Pilot Abilities (SPAs) are their own capability type, not Traits or Skills. Preserve the official term.

Core classes are Gunnery, Piloting, and Miscellaneous; Companion adds Infantry. Class definitions must be data-driven/extensible rather than hard-coded to the Core classes.

SPA data may include prerequisites, fixed or conditional XP cost, class limits, acquisition thresholds, repeatability, GM approval, and effect/application conditions. Acquisition prerequisites and conditions for use in play are distinct.

SPAs are ordinarily unavailable during character creation, but the rules explicitly support GM exceptions for appropriate experienced starting characters or NPCs. Encode the ordinary restriction and supported exception—not an absolute prohibition.

## GM arbitration and overrides

GM discretion has distinct forms:

- campaign configuration;
- a specific rule exception or override.

Do not implement a universal unrestricted “ignore rules” switch. Validation should distinguish hard requirements, GM-arbitrable requirements, campaign-configurable restrictions, and informational conditions.

A durable exception needs only the affected rule/requirement identifier, approved state, and an optional note. No GM account identity, approval date, session number, signature, or similar bureaucracy is required without a future established need.
