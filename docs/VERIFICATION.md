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

## Alpha Slice 7 verification

Slice 7 extends the same `npm run check` gate. Automated coverage verifies:

- a resolved Stage 2 Alpha stop can explicitly continue into the minimal Stage 3 branch;
- Technical College is the only implemented Stage 3 school and repeated Stage 3 schooling remains unavailable;
- exactly one Basic Field, at least one Advanced Field, no more than three Fields total, and school-offered Field membership are enforced or validated;
- Technician/Civilian costs 120 XP, Technician/Vehicle costs 96 XP, and Technical College records 600 base plus 216 Field XP for an 816-XP total;
- Skill Fields are durable training grants with category, cost, XP-per-Skill, time, source, and provenance rather than playable Skills;
- Technical College fixed awards and both Fields' component-Skill awards apply to the shared ledgers, including stacking Technician Skills and Computers;
- Interest/Any +30 XP and the 200-XP flexible award remain durable and resolve through the common pending-award engine;
- Technician/Civilian and Technician/Vehicle prerequisites are tracked and re-evaluated after allocations;
- selected Fields add three years, producing age 19 from the Stage 2 age-16 boundary;
- malformed or missing Field records, unknown or duplicate Fields, bad cost/age calculations, missing Field prerequisites, and unsupported Stage 4 continuation are reported;
- local storage and versioned JSON preserve Stage 3 school, Field, resolved, and unresolved state; and
- all prior Archetype, Point Buy, and Life Module regression tests continue to pass.

Manual UI verification should confirm the Stage 2 stop offers explicit Stage 3 continuation, Technical College shows its base/Field/total costs and age increase, the selected Fields are visible as durable records, pending awards resolve normally, and the Stage 3 stop exposes only the audited Stage 4 continuation.

## Alpha Slice 8 verification

Slice 8 extends the same `npm run check` gate. Automated coverage verifies:

- a resolved Stage 3 Alpha stop can explicitly continue into Stage 4;
- Agitator is the only implemented Stage 4 module and costs 900 XP from the separate module pool;
- all published fixed Attribute, Trait, Skill, and structured-subskill awards apply through the shared ledgers;
- Driving/Any +65 XP, Prestidigitation/Any +100 XP, Streetwise/Affiliation +75 XP, and the 125-XP flexible pool remain durable and resolvable;
- Agitator flexible XP rejects more than 50 XP allocated to one Attribute;
- age is calculated as 16 plus selected Stage 3 and Stage 4 time, producing age 23 for the current branch;
- durable history preserves the deferred same-module repeat policy, full repeat cost, repeatable Skill/Flexible awards, and first-occurrence-only Attribute/Trait awards;
- repeated or multiple Stage 4 execution, unknown Stage 4 modules, malformed cost/time/age/history, and finalization are rejected or reported;
- local storage and versioned JSON preserve Stage 4 history, chronology, repeat metadata, and resolved/unresolved awards; and
- all prior Archetype, Point Buy, and Life Module regression tests continue to pass.

Manual UI verification should confirm the Stage 3 stop offers explicit Stage 4 continuation, Agitator shows its 900-XP cost and four-year contribution, age displays as 23, pending awards use the existing controls, the Attribute cap is visible through validation behavior, and the Stage 4 stop does not imply repeat execution, Optimization, finalization, or PDF export support.

## Alpha Slice 9 verification

Slice 9 extends the same `npm run check` gate. Automated coverage verifies:

- a resolved Stage 4 Alpha stop can explicitly enter final review without changing the recorded module-purchasing pool;
- the final-allocation pool starts from the module-pool remainder and separately reconciles allocations, Optimization returns, and remaining XP;
- final XP can target existing Attributes, Skills/subskills, and modeled Traits, with overspending rejected and player-choice provenance retained;
- Attribute, Trait, and Standard Skill active values derive only from fully attained XP thresholds while partial XP remains durable;
- final prerequisite status is re-evaluated after allocations and Optimization;
- supported Optimization preview detects Attribute, Skill, positive-Trait, negative-Trait, and modeled-maximum excess where applicable;
- applying Optimization is explicit, Life-Modules-only, returns XP to the final-allocation pool, and records before/after values plus source provenance;
- modeled Gregarious/Introvert and Illiterate/Language +4 conflicts are reported rather than silently resolved;
- the negative-Trait XP purchase cap is 10 percent of starting allotment while purchase execution remains deferred;
- unresolved awards, unallocated XP, unmet prerequisites, Optimization opportunities, opposed Traits, and Attribute minimum failures block `ready-for-final-touches`;
- `ready-for-final-touches` does not change the character's draft status or imply equipment, PDF, final lock, or ready-for-play support;
- local storage and versioned JSON preserve final-review allocations and Optimization history; and
- all prior Archetype, Point Buy, and Life Module regression tests continue to pass.

Manual UI verification should confirm final review exposes the separate allocation pool, existing-stat targets, derived values, Optimization previews with explicit Apply controls, review blockers, the deferred negative-Trait cap, and accurate scope warnings.

## Alpha Slice 10 verification

Slice 10 extends the same `npm run check` gate. Automated coverage verifies:

- Final Touches can be entered only after the Life Modules `ready-for-final-touches` gate;
- absent Wealth/Equipped default to 0 TP, 1,000 C-bills, and D/B/B, while exact audited Wealth and Equipped table mappings remain stable;
- descriptive fields and positive metric height/weight persist;
- Owned items reduce C-bills, preserve unspent cash, and validate affordability plus Tech/Availability/Legality limits;
- Issued Gear defaults off, Issued entries require explicit enablement, cost no C-bills, and remain non-personal property;
- turning Issued Gear off does not delete existing items and instead exposes a validation issue;
- equipment review readiness remains a draft state and full finalization stays unsupported;
- browser-local save/load and versioned JSON preserve Final Touches, optional-rule state, and inventory; and
- all earlier Archetype, Point Buy, Life Module, final-review, and Optimization regression tests continue to pass.

Manual UI verification should confirm the Final Touches gate, description fields, Wealth/C-bill and Equipped-limit summaries, Owned/Issued entry behavior, validation messages, local save/export/import controls, and truthful warnings that catalog lookup, runtime tracking, PDF export, and finalization are unavailable.

## Alpha Slice 11 verification

Slice 11 extends the same `npm run check` gate. Automated coverage verifies:

- the starter catalog contains exactly 17 unique, structurally valid entries;
- audited cost, ratings, affiliation, rules metadata, source labels, and `audited-core`/`example-backed` status are preserved;
- search plus category and source-status filtering return the expected catalog entries;
- catalog quantities calculate total cost and Owned entries reduce C-bills through the existing accounting path;
- catalog entries retain stable IDs, purchase-time catalog snapshots, source citations, and provenance;
- fully rated Owned and Issued catalog items use the existing Equipped/Issued limits;
- example-backed Medical Kit, Medipatch, and Stimpatch preserve null ratings and are not rejected solely for missing unaudited ratings;
- catalog Issued items require Issued Gear and cost no personal C-bills;
- unknown catalog IDs and invalid quantities are rejected;
- manual entry remains available; and
- browser-local save/load plus versioned JSON preserve mixed manual and catalog inventory.

Manual UI verification should confirm all 17 items are browsable, text/category/source filters work, quantity and ownership controls feed catalog purchases, null ratings are visibly identified rather than invented, manual entry remains usable, and metadata does not expose runtime controls.

## Alpha Slice 12 verification

Slice 12 extends the same `npm run check` gate. Automated coverage verifies:

- the second batch contains exactly 17 unique entries and the combined catalog contains 34;
- every new entry retains stable ID, Core source, `audited-core` status, exact raw rating, raw Availability triplet, normalized rating, and inert metadata;
- raw-rating parsing rejects malformed values;
- normalized Tech/Legality match raw endpoints and normalized Availability occurs somewhere in the triplet without enforcing a position;
- neutral and native-affiliation items receive no foreign penalty;
- foreign-affiliation items increase effective Availability and Legality one step;
- Periphery lowers the Owned Tech cap one step with a B floor and Clan raises it one step with an F ceiling;
- Owned items above effective access produce reason-coded blocking validation;
- Issued items require Issued Gear and use Inner Sphere/Periphery E/D/D or Clan F/D/D without consuming C-bills or becoming personal property;
- missing native affiliation is reported when foreign-affiliation adjustment is enabled;
- armor BAR/patch and weapon AP/BD data remain metadata only;
- raw and normalized purchase snapshots survive browser-local and JSON round trips; and
- all earlier Archetype, Point Buy, Life Module, Final Touches, and catalog tests continue to pass.

Manual UI verification should confirm printed, normalized, and effective ratings are distinct; the access profile updates limits and allowed/blocked reasons; catalog purchasing respects Owned/Issued selection; and no combat, armor, health, power, ammunition, finalization, or PDF behavior is implied.

## Alpha Slice 13 verification

Slice 13 extends the same `npm run check` gate. Automated coverage verifies:

- Batch 3 contains exactly 24 unique audited records and the merged current catalog contains 55 unique entries;
- 21 records add new stable IDs while Medical Kit, Medipatch, and Stimpatch promote the three existing IDs to audited page-313 definitions;
- each Batch 3 record retains its supplied page source, exact raw rating, raw Availability triplet, hand-audited normalized rating, affiliation code, and inert metadata;
- raw-rating validation continues to match Tech and Legality endpoints while accepting normalized Availability from any position in the triplet;
- LA, DC, CS, and CLAN item affiliation codes survive catalog lookup and feed the existing access calculator;
- page-313 medical upgrades use current audited ratings without mutating the historical Slice 11 records;
- recording, optics, security, repair, medical, fatigue, healing, addiction, and power data remain metadata rather than runtime mechanics;
- purchase-time Batch 3 metadata, ratings, source, and provenance survive versioned JSON round trips; and
- all earlier Archetype, Point Buy, Life Module, Final Touches, access-calculator, and equipment-catalog tests continue to pass.

Manual UI verification should confirm all 55 current entries remain searchable/filterable, promoted medical entries display audited ratings and sources, affiliation-adjusted access still reports blocking reasons, and no metadata-only behavior is presented as automated play state.

## Alpha Slice 14 verification

Slice 14 extends the same `npm run check` gate. Automated coverage verifies:

- Batch 4 contains exactly 20 unique audited entries and the merged current catalog contains 75 unique entries;
- every Batch 4 entry retains its supplied stable ID, Core page source, exact raw rating, raw Availability triplet, hand-audited normalized rating, and metadata;
- normalized Tech and Legality match the raw endpoints and normalized Availability occurs somewhere in the triplet without assuming a position;
- the Clan Power Pack retains `CLAN` affiliation while generic items remain neutral;
- communications range and PPW/PPH, remote-sensor detection, power capacity/recharge, visibility, consumable, Skill-bonus, encumbrance, and falling data remain inert metadata;
- adding Slice 14 equipment creates no power counter, sensor state, remaining-use counter, or movement/falling state;
- purchase-time Slice 14 metadata, ratings, source, and provenance survive versioned JSON round trips; and
- all earlier Archetype, Point Buy, Life Module, Final Touches, access-calculator, and equipment-catalog tests continue to pass.

Manual UI verification should confirm all 75 entries remain searchable/filterable, Batch 4 ratings and sources display through the existing catalog workflow, access review behavior is unchanged, and no metadata-only detail is presented as runtime automation.

## Alpha Slice 15 verification

Slice 15 adds no equipment and retains the 75-item current catalog. Automated coverage verifies:

- all current IDs are unique, follow the established stable-ID syntax, and retain the pre-Slice-15 values;
- category paths are non-empty, safe, and consistent with an explicit current domain-to-top-level-category audit map;
- source keys, source citations, source statuses, affiliation codes, metadata, and notes are structurally valid;
- all 61 entries supplied with raw printed ratings retain an exact parseable rating and matching raw Availability triplet;
- the 14 normalized-only Slice 11 records are explicitly marked `not-supplied-in-audit` instead of receiving invented raw triplets;
- normalized Tech and Legality match raw endpoints, while normalized Availability may match any triplet position and is never assumed to be the middle code;
- current purchases create version-2 snapshots preserving purchase-time name, cost, category, source, affiliation, ratings, metadata, and notes;
- older example-backed Medical Kit, Medipatch, and Stimpatch snapshots remain accepted and round-trip without being rewritten to current catalog data;
- Owned and Issued behavior remains correct across weapons, armor, electronics, power, medical, repair, and field-gear categories;
- manual entries remain non-catalog records, preserve entered data, and use the same Owned/Issued accounting;
- direct power, ammunition, magazine, armor, medical, sensor, communications, repair, consumable, movement, and other runtime-like inventory state is rejected; and
- all earlier Archetype, Point Buy, Life Module, Final Touches, access-calculator, persistence, and catalog tests continue to pass.

Manual UI verification should confirm all 75 entries remain searchable/filterable, normalized-only legacy ratings are described as unsupplied rather than inferred, manual entry remains available, and catalog metadata is not presented as active play-state automation.

## Alpha Slice 16 verification

Slice 16 adds no equipment and retains the 75-item current catalog. Automated coverage verifies:

- the 14 formerly normalized-only Slice 11 records retain their stable IDs and supplied normalized ratings while gaining exact raw ratings and matching raw Availability triplets;
- all 75 current records carry `preserved` raw-rating status and pass the established raw/normalized consistency validator;
- normalized Tech and Legality match raw endpoints and normalized Availability occurs somewhere in the raw triplet without assuming a positional rule;
- the two power-pack records use the supplied page-306 source reference while the other 12 backfilled records retain their supplied page references;
- Medical Kit, Medipatch, and Stimpatch remain governed by their Slice 13 audited replacements and are not changed by the backfill;
- new purchases snapshot the backfilled raw rating and triplet;
- pre-backfill normalized-only purchase snapshots remain valid and survive JSON round trips without being rewritten;
- catalog count remains exactly 75 and no stable IDs are added or removed; and
- all earlier Archetype, Point Buy, Life Module, Final Touches, access-calculator, persistence, and catalog tests continue to pass.

Manual UI verification should confirm the 14 reconciled records display their printed ratings, all 75 entries remain searchable/filterable, manual entry remains available, and catalog metadata is not presented as active play-state automation.

## Alpha Slice 17 verification

Slice 17 adds six audited Core non-combat attire/leatherwear records from printed page 299 and increases the current catalog from 75 to 81 items. Automated coverage verifies:

- all six supplied stable IDs, costs, categories, neutral affiliations, raw ratings, Availability triplets, normalized ratings, page-299 source references, and `audited-core` status;
- normalized Tech and Legality match the raw endpoints and normalized Availability occurs in the raw triplet;
- Fatigues, Jump Suit, and Leather Boots retain their existing stable IDs and catalog values;
- Owned and Issued clothing purchases retain the established C-bill/property behavior;
- version-2 purchase snapshots and JSON round trips preserve cost, category, affiliation, source, raw/normalized ratings, notes, and inert metadata;
- BAR, coverage, front-only facing, and the Leather Gloves DEX-related penalty remain catalog metadata rather than inventory runtime state;
- catalog count is exactly 81 with unique IDs and all entries pass catalog validation; and
- all earlier Archetype, Point Buy, Life Module, Final Touches, access-calculator, persistence, and catalog tests continue to pass.

Manual UI verification should confirm all 81 entries remain searchable/filterable, the new clothing records display their source-backed ratings and metadata, manual entry remains available, and no active protection, coverage, facing, or clothing-penalty behavior is implied.

## Alpha Slice 18 verification

Slice 18 canonicalizes the existing page-306 Power Pack, Clan stable ID and adds three net-new audited Clan pack records, increasing the current catalog from 81 to 84 items. Automated coverage verifies:

- `core.power.powerPack.clan` is absent and `core.power.clan.powerPack.standard` is the sole catalog entry for the existing source row;
- Power Pack, Clan retains its display name, raw rating, normalized `F/B/A` rating, cost, `CLAN` affiliation, source, capacity, and quick-charge metadata;
- Micro Power Pack, Clan, Military Power Pack, Clan, and Satchel Battery, Clan preserve their supplied stable IDs, categories, costs, raw ratings/triplets, normalized ratings, page-306 source, and `CLAN` affiliation;
- normalized Tech and Legality match raw endpoints and normalized Availability occurs in each raw triplet without imposing a positional rule;
- native versus foreign Clan access and Owned versus Issued behavior continue to use the existing access calculator;
- version-2 purchase snapshots and JSON round trips preserve source, ratings, cost, category, affiliation, notes, PP capacity, and quick-charge metadata;
- PP capacity and quick-charge do not create runtime power, consumption, recharge, or tracking state;
- catalog count is exactly 84 with unique IDs and all entries pass catalog validation; and
- all earlier Archetype, Point Buy, Life Module, Final Touches, access-calculator, persistence, and catalog tests continue to pass.

Manual UI verification should confirm all 84 entries remain searchable/filterable, the four Clan packs display their source-backed ratings and inert metadata, manual entry remains available, and no active power or recharge behavior is implied.

## Alpha Slice 19 verification

Slice 19 prepares the unchanged Character Creator for a static Public Alpha preview. Automated and build coverage verifies:

- application and exported-character metadata use version `0.1.0-alpha.19`;
- the always-visible Public Alpha notice identifies browser-local storage, the risk of browser-data clearing, and JSON export/import as the portability path;
- the notice states that no special platform login or application account is required and that no backend or cloud save exists;
- account/login/cloud save is described as planned before v1.0 rather than active;
- Core *A Time of War* remains first in scope, Companion support remains later, and incomplete rules/equipment/final validation do not imply a finalized or play-ready character;
- PDF export is explicitly unavailable;
- the equipment catalog remains exactly 84 unique entries and the existing catalog tests continue to protect IDs, ratings, sources, metadata, and behavior;
- the Vite production build emits a static `dist/` site without backend, authentication, analytics, external API, or secret configuration; and
- all earlier Archetype, Point Buy, Life Module, Final Touches, access-calculator, persistence, and catalog tests continue to pass.

Manual preview verification should confirm the status/version notice is legible on desktop and mobile layouts, remains visible on every route, and does not imply live deployment, complete rules coverage, PDF output, or ready-for-play status. A live public deployment requires a separately authorized hosting target.

## Alpha Slice 20 verification

Slice 20 selects GitHub Pages as the static Public Alpha host without changing character rules or the equipment catalog. Automated and build coverage verifies:

- application and exported-character metadata use version `0.1.0-alpha.20`;
- the production Vite base is `/BT-Online-Compendium/` while the local development base remains `/`;
- the Pages workflow runs on `main` pushes and manual dispatch, uses minimal `contents`, `pages`, and OIDC permissions, installs reproducibly, runs the full check, builds, uploads `dist/`, and deploys through the `github-pages` environment;
- the public notice retains browser-local storage, JSON portability, incomplete-scope warnings, no special platform login or application account, no backend/cloud save, and unavailable PDF export;
- the equipment catalog remains exactly 84 unique entries and existing rules/catalog tests remain unchanged; and
- the production bundle contains only generated application assets and does not include source PDFs.

Deployment verification should confirm the workflow succeeds, the Pages environment is configured with GitHub Actions as its source, and `https://sansd20.github.io/BT-Online-Compendium/` opens with the Public Alpha notice and version `0.1.0-alpha.20`. A blocked deployment should record the exact Pages setting or repository-policy blocker rather than switching hosts.

## Alpha Slice 21 verification

Slice 21 verifies the live GitHub Pages Public Alpha and cleans up its public-access wording without changing character rules or equipment data. Verification covers:

- the live target `https://sansd20.github.io/BT-Online-Compendium/` loads at the configured project path;
- the deployed Slice 20 page showed the Public Alpha notice, browser-local storage warning, visible version `0.1.0-alpha.20`, JSON portability, and no login gate before the Slice 21 update;
- application and exported-character metadata advance to `0.1.0-alpha.21`;
- the notice uses normal-browser, no-special-platform-login, and no-application-account wording while retaining the browser-data clearing warning, deferred account/login/cloud-save roadmap, incomplete-scope warning, and unavailable PDF export;
- public application and documentation text contain no platform-specific access wording;
- the equipment catalog remains exactly 84 unique entries and all existing rules/catalog tests continue to pass; and
- the production build retains `/BT-Online-Compendium/` as its asset base and remains a static site without backend, authentication, analytics, cloud save, or external runtime APIs.

After the Slice 21 commit reaches `main`, deployment verification should confirm the Pages workflow succeeds and the live notice reports version `0.1.0-alpha.21` with the revised wording.

## Alpha Slice 22 verification

Slice 22 integrates Core Archetypes with the shared Point Buy XP accounting model without changing published packages or presenting Archetype creation as a switch to Point Buy. Automated coverage verifies:

- every Core Archetype still produces its existing golden Attributes, Traits, Skills, equipment, C-bills, declared total, and listed allocation total;
- the selected package is recorded as a versioned source-backed foundation with original ID, display name, source citation, and valid published-provenance reference;
- shared accounting records separate Attribute, Trait, and Skill XP totals plus the declared-versus-listed difference, including existing documented source discrepancies;
- a stale accounting snapshot fails structural validation rather than silently rewriting source-backed data;
- save/load and JSON export/import preserve foundation and accounting metadata;
- older Alpha Archetype JSON without Slice 22 fields migrates safely without changing its allocation ledgers;
- the Archetype result UI explains the read-only foundation/accounting relationship and keeps customization deferred;
- Point Buy-from-scratch and Life Modules regression suites remain unchanged and passing;
- application/export metadata reports `0.1.0-alpha.22`; and
- the equipment catalog remains exactly 84 entries with no ID, source, rating, or runtime behavior changes.

After the Slice 22 commit reaches `main`, deployment verification should confirm the existing Pages workflow succeeds and the live Public Alpha reports version `0.1.0-alpha.22`.

## Alpha Slice 23 verification

Slice 23 was reimplemented from durable Slice 22 after the earlier local Slice 23 commit could not be recovered. Automated coverage verifies:

- every Core Archetype still produces the same source-backed package and published/listed totals;
- empty adjustment ledgers remain valid and Slice 22 foundations migrate to the version 2 foundation state without allocation changes;
- balanced Attribute and existing-Skill adjustments pass validation while nonzero net XP blocks completion, save, and JSON export;
- every adjustment retains its target, operation, before/after values, Point Buy XP delta, source-foundation reference, provenance, award link, timestamps, and optional note;
- removal restores the exact source-backed level and XP;
- balanced adjustment ledgers survive JSON and browser-local save/load round trips;
- the adjustment UI displays per-entry and net XP, balanced/unbalanced status, and reversible removal;
- Trait changes, new-Skill swaps, GM override, and unbalanced completion remain unavailable;
- Point Buy-from-scratch, Life Modules, Final Touches, and all existing regression suites remain unchanged;
- the equipment catalog remains exactly 84 unique stable IDs with no rules/catalog data changes; and
- application/export metadata reports `0.1.0-alpha.23` while the phase remains Public Alpha.

Required release verification remains `npm run check` followed by an explicit `npm run build`. If the commit reaches `main`, the existing Pages workflow should deploy and the live Public Alpha should report version `0.1.0-alpha.23`.

## Alpha Slice 24 verification

Slice 24 reviews and hardens the Slice 23 ledger and adds bounded same-XP Skill swaps without creating a full Skill catalog. Automated coverage verifies:

- all Slice 23 Attribute and existing-Skill level adjustment behavior remains passing;
- a safe Skill swap is offered only for an exact Skill instance already audited in the existing Core Archetype definitions;
- source and replacement use equal shared Point Buy XP and retain explicit source/replacement snapshots and provenance;
- under-specified mixed subskill identities, specialties, conflicting identities, Field Aptitude/nonstandard XP cases, duplicates, and unequal-XP targets are unavailable or rejected;
- a swap replaces only the working character ledger entry and never mutates the Core Archetype definition;
- removal restores the exact source-backed Skill address, level, XP, source award identity, notes, and specialty state;
- Skill-swap records survive JSON and browser-local save/load round trips;
- malformed balanced Archetype state is blocked from save/export in addition to the existing nonzero-net-XP block;
- Point Buy-from-scratch, Life Modules, Final Touches, and all prior regression suites remain passing;
- the equipment catalog remains exactly 84 unique stable IDs with no rules/catalog data changes; and
- application/export metadata reports `0.1.0-alpha.24` while the phase remains Public Alpha.

Required release verification remains `npm run check` followed by an explicit `npm run build`. If the commit reaches `main`, the existing Pages workflow should deploy and the live Public Alpha should report version `0.1.0-alpha.24`.

## Alpha Slice 25 verification

Slice 25 is an audit/documentation release. Verification confirms:

- `docs/archetype-sheet-cross-check.md` covers MechWarrior, Tanker, Aerospace Pilot, Elemental, Scout, Faceman, Renegade Warrior, and Battlefield Tech;
- printed Archetype pages 52-59 and back-sheet PDF pages 396-403 were both inspected;
- the report separates matches, partial matches, mismatches, prose-only, sheet-only, implementation-only, user-decision, and source-expansion categories;
- Tanker Attribute XP and Elemental Attribute Link conflicts are reported without correction;
- back-sheet-only movement, condition-monitor, armor/BAR, and weapon-combat presentation is reported without being promoted into source data;
- no Archetype package, rules data, equipment data, stable ID, Point Buy-from-scratch, Life Modules, Final Touches, or Slice 24 Skill-swap behavior changed;
- the equipment catalog remains exactly 84 unique stable IDs; and
- application metadata reports `0.1.0-alpha.25` while the phase remains Public Alpha.

Required release verification is `npm run check` followed by an explicit `npm run build`. If the commit reaches `main`, the existing Pages workflow should deploy and the live Public Alpha should report version `0.1.0-alpha.25`.

Slice 25 checkpoint result: lint passed; 19 test files and 170 tests passed; the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. The generated production bundle reports `0.1.0-alpha.25`.

## Alpha Slice 26 verification

Slice 26 is a narrow Life Modules Stage 0 affiliation-flow hotfix. Automated coverage verifies:

- a new Stage 0 Universal draft contains neither an affiliation context nor an affiliation-language selection;
- Mandarin Chinese is not applied unless the user explicitly selects the Capellan Confederation / Capellan Commonality context and then selects Mandarin Chinese;
- the engine rejects a missing or mismatched Stage 0 affiliation context and rejects an empty or invalid affiliation language;
- validation requires the stored context, language, and resolved Universal affiliation-language award to agree;
- save/load and JSON export/import preserve explicit Stage 0 context and language state;
- older Alpha saves without the new context field migrate to the only compatible context already implied by their resolved Stage 0 language;
- Life Modules Stage 1–4, Archetype, Point Buy, Final Touches, Public Alpha notice, and equipment regression suites remain passing;
- the equipment catalog remains exactly 84 unique stable IDs with no rules/catalog data changes; and
- application/export metadata reports `0.1.0-alpha.26` while the phase remains Public Alpha.

Required release verification is `npm run check` followed by an explicit `npm run build`. If the commit reaches `main`, the existing Pages workflow should deploy and the live Public Alpha should report version `0.1.0-alpha.26`.

Slice 26 checkpoint result: lint passed; 19 test files and 173 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. The generated production bundle reports `0.1.0-alpha.26`.

## Alpha Slice 27 verification

Slice 27 is a narrow Life Modules pending-award selector and progression hotfix. Automated coverage verifies:

- known affiliation-language awards expose readable choices, including English and French for the currently supported Federated Suns language award;
- known `/Any` awards expose safe current-Alpha subskills, including Badlands, Desert, and Forest for Survival;
- flexible Trait choices display names such as Fit while preserving stable IDs such as `trait.fit` internally;
- new selector-backed resolutions reject values outside their safe current-Alpha option lists;
- resolved selector targets survive browser-local and JSON round trips through the existing durable award destination structure;
- unresolved pending awards remain current-stage blockers and are reported by exact award description and remaining amount;
- final-validation-only prerequisites remain visible with exact module/prerequisite details but permit the next legal stage transition;
- older prerequisite-review saves migrate to the corresponding continuable Alpha stop, while older resolved free-text choices remain import-compatible;
- Life Modules Stage 1–4 rules, Archetype, Point Buy, Final Touches, Public Alpha notice, and equipment regression suites remain passing;
- the equipment catalog remains exactly 84 unique stable IDs with no rules/catalog data changes; and
- application/export metadata reports `0.1.0-alpha.27` while the phase remains Public Alpha.

Required release verification is `npm run check` followed by an explicit `npm run build`. If the commit reaches `main`, the existing Pages workflow should deploy and the live Public Alpha should report version `0.1.0-alpha.27`.

Slice 27 checkpoint result: lint passed; 20 test files and 179 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. The generated production bundle reports `0.1.0-alpha.27`.

## Alpha Slice 28 verification

Slice 28 establishes Archetype source governance without changing active package data. Automated coverage verifies:

- prose/package values remain the active creation data and back-sheet conflicts do not overwrite them;
- Tanker Attribute XP remains `400/500/500/600/400/400/400/300` in STR/BOD/DEX/RFL/INT/WIL/CHA/EDG order;
- Elemental active Attribute values and phenotype modifiers remain unchanged and Attribute Links remain unmodeled;
- Scout Equipped remains 2 TP / 300 XP rather than being normalized from the general Trait cost;
- RFL remains present for every Archetype and no REF Attribute is introduced;
- `Faceman` / `archetype.core.faceman` and `Battlefield Tech` / `archetype.core.battlefield-tech` remain unchanged;
- governed Archetype characters retain identical active data through JSON export/import;
- the public notice retains “A Time of War character creator” and application metadata reports `0.1.0-alpha.28`;
- Point Buy, Life Modules, Final Touches, and all prior Archetype regression suites remain passing;
- the equipment catalog remains exactly 84 unique stable IDs with no equipment data changes; and
- back-sheet-only movement, condition, armor/BAR, weapon, and combat fields remain inactive.

Required release verification is `npm run check` followed by an explicit `npm run build`. If the commit reaches `main`, the existing Pages workflow should deploy and the live Public Alpha should report version `0.1.0-alpha.28`.

Slice 28 checkpoint result: lint passed; 21 test files and 188 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. The generated production bundle reports `0.1.0-alpha.28`.

## Alpha Slice 29 affiliation-framework verification

Verify that Universal is explicitly non-affiliation and absent from selectable affiliation contexts; a new Life Modules draft has no affiliation context or language default; the current Capellan/Commonality context resolves through the registry; existing affiliation, Capellan-secondary, and Federated Suns language selectors retain their exact options; Protocol and Streetwise retain the `Capellan` label; unknown contexts resolve as deferred; and Life Modules JSON round trips retain their existing shape and behavior. Also verify version `0.1.0-alpha.29`, title `A Time of War character creator`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 29 checkpoint result: lint passed; 22 test files and 191 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.29`.

## Alpha Slice 30 wizard-flow verification

Verify that the Life Modules progress tracker identifies the current Universal/Stage 0–4/Review step; the persistent summary exposes the character, Attributes, Traits, Skills, chosen modules, pending count, and XP; pending and flexible awards remain accessible in the active-stage workspace; exact current-stage blockers and final-validation-only warnings render separately; save/export and Back-to-creator actions remain available; and existing engine progression, persistence, selectors, Universal non-affiliation behavior, and empty Stage 0 defaults remain unchanged. Also verify version `0.1.0-alpha.30`, title `A Time of War character creator`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 30 checkpoint result: lint passed; 23 test files and 194 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Existing engine, persistence, affiliation-framework, equipment-catalog, Archetype, Point Buy, Final Touches, public-title, and selector coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.30`.

## Alpha Slice 31 Stage 0 layout verification

Verify that Stage 0 Universal presents explanation and explicit non-affiliation guidance before a stable affiliation-choice card; context and language controls remain present in a consistent order; the language selector is disabled until context selection; the apply action occupies a separate row and remains disabled until both current source-backed choices are valid; the full Capellan Confederation / Capellan Commonality label is preserved with title text; and the choice grid stacks at narrow widths. Existing blockers/warnings, engine behavior, empty defaults, affiliation framework, pending selectors, persistence, and Stage 1–4 behavior must remain unchanged. Also verify version `0.1.0-alpha.31`, title `A Time of War character creator`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 31 checkpoint result: lint passed; 24 test files and 197 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Existing engine, persistence, affiliation-framework, equipment-catalog, Archetype, Point Buy, Final Touches, public-title, blocker/warning, and selector coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.31`.

## Alpha 0.1.0-alpha.32 Stage 0 label verification

Verify that the Stage 0 Universal and affiliation-package action buttons both read `Apply`; the Universal validity gate, non-affiliation guidance, empty defaults, engine progression, pending selectors, and Stage 1–4 behavior remain unchanged; application metadata reports `0.1.0-alpha.32`; the public title remains `A Time of War character creator`; and the equipment catalog remains exactly 84 unique stable IDs with no data changes. Required release verification is `npm run check` followed by a separate `npm run build`.

Hotfix checkpoint result: lint passed; 24 test files and 197 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.32` with the Stage 0 `Apply` label.

## Alpha Slice 33 merged Stage 0 verification

Verify that the progress tracker contains six top-level steps beginning with Stage 0 and has no separate Universal step; both existing engine phases map to Stage 0; the page contains distinct Universal Package and Affiliation Package sections; Universal is marked complete before the affiliation action unlocks; both available actions read `Apply`; and Universal remains explicitly non-affiliation. Existing empty defaults, package awards, gating, pending-award blockers, non-blocking final-validation warnings, engine transitions, persistence, Stage 1–4 behavior, Archetype, Point Buy, and Final Touches must remain unchanged. Also verify version `0.1.0-alpha.33`, title `A Time of War character creator`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 33 checkpoint result: lint passed; 25 test files and 199 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Existing engine, persistence, pending-award, blocker/warning, Stage 1–4, Archetype, Point Buy, Final Touches, public-title, and equipment-catalog coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.33`.

## Alpha Slice 34 Stage 0 baseline and notice verification

Verify that creating a Life Modules draft immediately records the unchanged 850 XP Universal package, fixed Attribute/English/Perception awards, provenance, and pending affiliation-language award; Stage 0 shows the baseline as included without a redundant Universal action for new drafts; context and language remain empty until explicit selection; applying the affiliation package resolves that pending award and preserves existing progression; and older `stage-0-universal` drafts retain a compatibility path. Verify that the six-step progress tracker remains unchanged, the Life Modules badge derives `v0.1.0-alpha.34` from application metadata and no longer says Slice 22, and the wider Public Alpha Notice uses two desktop columns with a narrow one-column fallback. Existing pending blockers, final-validation warnings, persistence, Stage 1–4, Archetype, Point Buy, Final Touches, title, URL, and equipment behavior must remain unchanged. Also verify exactly 84 equipment records with unchanged stable IDs/data and successful `npm run check` plus a separate `npm run build`.

Slice 34 checkpoint result: lint passed; 25 test files and 200 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Automatic Universal baseline creation, explicit empty context/language state, pending-award validation, the legacy compatibility path, the six-step tracker, the version-derived badge, and existing Stage 1–4, persistence, Archetype, Point Buy, Final Touches, public-title, and equipment-catalog coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.34`.

## Alpha Slice 35 Stage 0 UI and Attribute-display verification

Verify that normal Slice 34+ drafts show no Mandatory Baseline or Universal Package card while the unchanged Universal module remains in their ledger; legacy `stage-0-universal` drafts retain a clearly labeled compatibility path; the Stage 0 tracker subtitle is `Affiliation`; the secondary-language selector contains only listed languages plus a disabled instructional placeholder and no `Leave pending` pseudo-language; its separate Apply action is disabled until explicit context, affiliation-language, and secondary-language choices are valid; and helper text explains the unresolved state. Verify that the Life Modules summary renders accumulated Attribute sheet values such as 100 rather than normalized purchased levels such as 1, and that return, save, and export navigation remains clearly labeled without implying undo. Existing rules, pending blockers, final-validation warnings, persistence, Stage 1–4, Archetype, Point Buy, Final Touches, title, URL, and equipment behavior must remain unchanged. Also verify version `0.1.0-alpha.35`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 35 checkpoint result: lint passed; 25 test files and 202 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Focused coverage verifies the normal and legacy Stage 0 presentations, explicit secondary-language gate, Affiliation tracker text, current version, and all eight 100-point baseline Attribute displays. Existing engine, persistence, blocker/warning, Stage 1–4, Archetype, Point Buy, Final Touches, public-title, and equipment-catalog coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.35`.

## Alpha Slice 36 unified Stage 0 award-resolution verification

Verify that the Stage 0 Affiliation Package is the single presentation for its context, affiliation-language, and secondary-language choices; the exact `stage0.universal-fixed-xp` / `universal.language.affiliation` pending award is suppressed from the generic resolver only during `stage-0-affiliation`; later-stage and unsupported awards remain available to generic resolution; and the generic pending panel is absent when no non-specialized Stage 0 awards remain. Verify that the card lists exact missing choices, retains disabled gating until all three choices are valid, shows a ready message afterward, and labels the existing Stage 1 transition `Apply and continue`. The tracker remains six steps with Stage 0 / Affiliation, Attributes remain full sheet values, and Universal remains non-affiliation. Existing engine flow, rules, persistence, pending blockers, final-validation warnings, Stage 1–4, Archetype, Point Buy, Final Touches, title, URL, and equipment behavior must remain unchanged. Also verify version `0.1.0-alpha.36`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 36 checkpoint result: lint passed; 25 test files and 203 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Focused coverage verifies exact Stage 0 filtering, preservation of generic resolution for later phases and unsupported awards, missing-choice and ready messaging, disabled gating, `Apply and continue`, current version, six-step Affiliation tracker, and 100-point Attribute displays. Existing engine, persistence, blocker/warning, Stage 1–4, Archetype, Point Buy, Final Touches, public-title, and equipment-catalog coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.36`.

## Alpha Slice 37 Life Modules stage-flow verification

Verify that Stage 1 identifies Early Childhood and asks the user to choose one module; Stage 2 identifies Late Childhood and does the same; Stage 3 identifies Higher Education and keeps Interest/flexible-XP work associated with the education stage; Stage 4 identifies Real Life, explains the current Agitator-only Alpha scope, and directs the user toward Review; and Review summarizes selected modules, pending choices, final warnings, and module XP. Verify that blockers and final-validation-only warnings retain distinct consistent presentation; selected-module, applied-award, resolved-choice, rule, and validation audit details remain accessible but collapse outside Review and open in Review; and Stage 0 retains the specialized Slice 36 flow. Existing rules, engines, progression, XP accounting, persistence, Stage 1–4 results, Archetype, Point Buy, Final Touches, title, URL, and equipment behavior must remain unchanged. Also verify version `0.1.0-alpha.37`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 37 checkpoint result: lint passed; 25 test files and 205 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Focused coverage verifies Stage 1–4 action-focused presentation, Review module/pending/warning/XP summary, Stage 0 specialized filtering, six-step tracking, full Attribute values, and current version. Existing engine, persistence, blocker/warning, Stage 1–4 result, Archetype, Point Buy, Final Touches, public-title, and equipment-catalog coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.37`.

## Alpha Slice 38 Life Modules preview-then-continue verification

Verify that complete, explicit Stage 0 context and language selections produce a sidebar section labeled `Preview · Not saved`; the preview reports post-Continue module XP plus changed Attributes, Traits, and Skills using full sheet Attribute values; incomplete selectors produce no preview and retain disabled gating; and the action reads `Continue` with clear commit helper text. The preview must be derived without mutating the committed character, ledger, pending awards, or provenance, so save/export before Continue continue to serialize only committed state. Continue must use the existing engine transition to commit and advance to Stage 1. Slice 36 specialized pending filtering, Slice 37 Stage 1–4 flow, six-step tracking, empty defaults, compatibility imports, rules, Archetype, Point Buy, Final Touches, title, URL, and equipment behavior remain unchanged. Verify version `0.1.0-alpha.38`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 38 checkpoint result: lint passed; 26 test files and 208 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Focused coverage verifies null preview for incomplete selectors, a visibly unsaved complete Stage 0 preview, full post-Continue Attribute values and package effects, original-character immutability, disabled/ready `Continue` gating, specialized pending filtering, six-step tracking, Slice 37 stage presentation, and current version. Existing engine, persistence, compatibility, Archetype, Point Buy, Final Touches, public-title, and equipment-catalog coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.38`.

## Alpha Slice 39 Life Modules compact-dashboard verification

Verify that the Life Modules page exposes a compact-dashboard landmark containing XP status, the six-step tracker, return/save/export controls, the current character summary, and the current-stage workspace; the summary identifies the current stage; and desktop styling presents summary and stage work side by side with reduced spacing and a viewport-bounded sticky summary. Verify that tablet/mobile styling stacks the dashboard cleanly, preserves the horizontally scrollable tracker, keeps action controls prominent, and places deep audit material afterward. Audit timelines, Skill Fields, applied awards, resolved choices, and rule/validation details must remain accessible inside a secondary drawer that is closed during normal stage work and open during Review. Slice 36 specialized pending filtering, Slice 37 stage actions, Slice 38 visibly unsaved Stage 0 preview, full Attribute values, empty defaults, committed-only save/export, compatibility imports, rules, Archetype, Point Buy, Final Touches, title, URL, and equipment behavior must remain unchanged. Verify version `0.1.0-alpha.39`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 39 checkpoint result: lint passed; 26 test files and 210 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Focused component coverage verifies the compact-dashboard, progress, summary, current-stage, and draft-action landmarks; current-stage context in the summary; the secondary audit drawer's normal and Review states; Stage 0 preview identification; Slice 37 action headings; and current version. Existing engine, persistence, compatibility, Archetype, Point Buy, Final Touches, public-title, and 84-item equipment-catalog coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.39`.

## Alpha Slice 40 corrective dashboard verification

Verify that Life Modules overrides the global page-width constraint and uses a wide desktop canvas; complete Stage 0 choices render summary, current stage, and `Preview · Not saved` as three distinct panes; `Continue` appears in the active package header; preview Attributes, Traits, and Skills use aligned compact rows; intermediate widths use two panes; and narrow layouts order current-stage work before summary, preview, and audit detail. Visual verification should confirm the result is materially different from the Slice 39 screenshot and that the primary action is visible in the initial dashboard viewport. Slice 36 specialized filtering, Slice 37 action flow, Slice 38 preview immutability, Slice 39 audit drawer, full Attribute values, empty defaults, committed-only save/export, compatibility imports, rules, Archetype, Point Buy, Final Touches, title, URL, and equipment behavior must remain unchanged. Verify version `0.1.0-alpha.40`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 40 checkpoint result: lint passed; 26 test files and 210 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. A local desktop browser check with complete Stage 0 choices confirmed the full-width three-pane layout, independent compact preview rail, two-column Attribute summary, and above-the-fold Continue action. Focused coverage verifies the dashboard preview rail and all prior Slice 36–39 presentation invariants. Existing engine, persistence, compatibility, Archetype, Point Buy, Final Touches, public-title, and 84-item equipment-catalog coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.40`.

## Alpha Slice 41 integrated live-preview verification

Verify that the normal dashboard has no separate preview pane; Character Summary and current-stage work remain side by side on desktop; each explicit Stage 0 selection immediately appears in an `Uncommitted live preview` status; incomplete choices retain committed totals and show a no-guessing completion helper; and complete choices display post-Continue Module XP, net stat XP, pending count, full-value Attributes, Traits, Skills, and package history with Preview/After Continue markers. Continue must remain disabled until all required choices are valid and then use the existing engine transition. Save/export must continue to receive only committed character state. Slice 36 specialized filtering, Slice 37 action flow, Slice 38 preview immutability, Slice 39 audit drawer, Slice 40 wide layout and above-the-fold Continue action, empty defaults, compatibility imports, rules, Archetype, Point Buy, Final Touches, title, URL, and equipment behavior must remain unchanged. Verify version `0.1.0-alpha.41`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 41 checkpoint result: lint passed; 26 test files and 211 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Local desktop browser checks verified both partial and complete Stage 0 selection states: the third pane is absent, partial selections are tagged without invented effects, complete post-Continue totals and rows appear inside Character Summary, and Continue remains above the fold. Focused coverage verifies the absent preview pane, integrated complete preview, safe partial preview, original-character immutability, gating, specialized filtering, six-step tracker, full Attribute values, Slice 37 headings, and current version. Existing engine, persistence, compatibility, Archetype, Point Buy, Final Touches, public-title, and 84-item equipment-catalog coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.41`.

## Alpha Slice 42 Character Summary XP-display verification

Verify that active Trait rows show signed Trait Points and accumulated XP, including positive and negative examples; pending Traits show known XP only when safely available; Skill rows show accumulated XP rather than level notation, dash, or `+0`; and full Attribute values remain unchanged. Previewed rows must retain the `preview-row` styling without visible row-level Preview text, while the summary-level “Not saved until Continue” notice remains. Slice 36 specialized filtering, Slice 37 action flow, Slice 38 preview immutability, Slice 39 audit drawer, Slice 40 wide layout, Slice 41 integrated partial/full preview, empty defaults, committed-only save/export, compatibility imports, rules, Archetype, Point Buy, Final Touches, title, URL, and equipment behavior must remain unchanged. Verify version `0.1.0-alpha.42`, exactly 84 equipment records with unchanged stable IDs/data, and successful `npm run check` plus a separate `npm run build`.

Slice 42 checkpoint result: lint passed; 26 test files and 212 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Focused coverage verifies signed Trait Points with accumulated XP for positive and negative Traits, XP-only Skill displays without level-style placeholders, retained preview-row styling without repeated row-level Preview text, the summary-level unsaved notice, full Attribute values, and current version. Existing engine, persistence, compatibility, specialized filtering, stage flow, preview immutability, committed-only save/export, Archetype, Point Buy, Final Touches, public-title, and 84-item equipment-catalog coverage remained green. The equipment catalog and resource data have no diff, and the generated production bundle reports `0.1.0-alpha.42`.

## Alpha Slice 43 progressive Stage 0 preview and Capellan-theme verification

Verify that no preview appears before explicit context selection; selecting Capellan Confederation / Commonality immediately projects deterministic fixed package effects into a cloned character; unresolved affiliation-language, Capellan-secondary-language, and Federated Suns language awards appear as pending XP rows; and later explicit choices progressively resolve only their matching preview awards. Attributes, Traits, Skills, and Chosen modules must be open by default. Repeated row/value Preview and `After Continue · Preview` labels must be absent while one summary-level “Not saved until Continue” notice remains. The Capellan context alone must add the scoped `capellan-theme` treatment and clearing or changing context must restore the default theme. Continue remains the only commit point, and save/export continue to receive committed state only. Verify version `0.1.0-alpha.43`, exactly 84 equipment records with unchanged stable IDs/data, unchanged public title and URL, and successful `npm run check` plus a separate `npm run build`.

Slice 43 checkpoint result: lint passed; 26 test files and 214 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. A local desktop browser check confirmed the default palette before selection, immediate fixed effects plus three pending language rows after Capellan context selection, all four summary sections expanded, the single unsaved notice, the jade/gold theme with restrained burgundy current-stage emphasis, and full restoration of the default palette and committed totals after clearing the context. Focused coverage verifies preview immutability, progressive award resolution, context-only theme activation/reversion, absent repeated Preview labels, current version, and prior flow invariants. Existing engine, persistence, save/export, compatibility, Archetype, Point Buy, Final Touches, public-title, and 84-item equipment-catalog coverage remained green. The equipment catalog and resource data have no diff.

## Alpha Slice 44 public-notice and stage-label verification

Verify that the shared Public Alpha Notice renders its heading, current version, concise warning, and accessible `Show details` disclosure while closed by default; expansion must reveal the complete existing explanatory paragraph and list, retaining desktop two-column styling. Verify that Life Modules Character Summary has no Current stage row and the current-stage workspace has no redundant all-caps stage kicker, while the six-step tracker still identifies the current step and task headings such as `Choose affiliation details` remain visible and semantic. Slice 43 progressive preview, pending rows, four open summary sections, Capellan theme activation/reversion, Continue commit boundary, and committed-only save/export must remain unchanged. Verify version `0.1.0-alpha.44`, exactly 84 equipment records with unchanged stable IDs/data, unchanged public title and URL, and successful `npm run check` plus a separate `npm run build`.

Slice 44 checkpoint result: lint passed; 26 test files and 215 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. Local desktop browser checks confirmed the initial compact notice, visible heading/version/summary and Show details control, expanded complete two-column content with a Hide details control, the six-step tracker, absent Character Summary stage row and stage kicker, and retained `Choose affiliation details` heading. Focused coverage verifies default/expanded disclosure markup, preserved notice wording, redundant-label removal, current version, Slice 43 progressive preview/theme behavior, and existing flow invariants. Existing engine, persistence, save/export, compatibility, Archetype, Point Buy, Final Touches, public-title, and 84-item equipment-catalog coverage remained green. The equipment catalog and resource data have no diff.

## Alpha Slice 45 Stage 1–4 integrated-preview verification

Verify that explicit selection of each supported Stage 1–4 module builds a cloned preview using the same existing engine operation later invoked by Continue. Blue Collar, Stage 1 Back Woods, Stage 2 Back Woods, High School, Technical College with its displayed Skill Fields, and Agitator must preview deterministic full-value Attributes, Trait TP/XP, Skill XP, module-pool totals, preview-styled module history, pending/flexible XP rows, and prerequisite warnings where applicable. No preview may appear before explicit module selection. Continue commits the selected module and opens the unchanged pending-award resolution phase; unresolved awards continue to gate stage advancement. The original character, ledger, provenance, and selected modules must remain unchanged before Continue, and save/export must receive committed state only. Slice 43 Stage 0 progressive preview and Capellan theme, Slice 44 collapsed notice and redundant-label cleanup, the two-pane layout, four open summary sections, tracker, public title, URL, and 84-item equipment catalog must remain unchanged. Verify version `0.1.0-alpha.45` and successful `npm run check` plus a separate `npm run build`.

Slice 45 checkpoint result: lint passed; 27 test files and 224 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required second, explicit `npm run build` also passed. A local desktop browser walkthrough confirmed that Stage 1 Back Woods appears only after explicit Preview selection, projects full Attribute, Trait, Skill, module-pool, pending-choice, and prerequisite-warning results into the integrated summary, leaves the committed dashboard totals unchanged before Continue, and transfers the module into the existing pending-award resolution flow only after Continue. The Capellan theme remained active after the committed Capellan Stage 0 context. Focused coverage verifies all six supported Stage 1–4 modules, preview immutability, semantic parity with the commit operation, no silent module default, pending preview rows, absent row-level Preview labels, current version, and prior flow invariants. Existing engine, persistence, save/export, compatibility, public-title, and 84-item equipment-catalog coverage remained green. The equipment catalog and resource data have no diff.

## Alpha Slice 46 same-page choice-slot verification

Verify that every supported Stage 1–4 module stays selected and previewed while its required choices are filled on the same stage page. Fixed multi-grant awards must render one independently labeled slot per grant; pooled flexible XP must use explicit destination/amount allocation slots. Filled slots must replay the existing award resolver against the uncommitted clone, update Character Summary where knowable, and reduce its pending count without mutating the committed character. Normal stage slots must not show `Apply one grant` or `Allocate XP`; Continue must stay disabled until all selected-module slots are complete, then commit the module and resolved choices together and advance through existing progression. The generic resolver must remain available for legacy, unsupported, or already-committed pending state. Verify Stage 0 progressive preview, Capellan theme activation/reversion, committed-only save/export, empty defaults, compatibility, six-step tracker, public title and URL, exactly 84 equipment records with unchanged stable IDs/data, version `0.1.0-alpha.46`, `npm run check`, and a separate `npm run build`.

Slice 46 checkpoint result: lint passed; 28 test files and 230 tests passed; TypeScript compilation and the production build passed inside `npm run check`. A local desktop browser walkthrough confirmed seven distinct Blue Collar slots (Career, two Interest, and four Flexible XP), retained selected-module preview, decreasing preview pending count and live Attribute/Skill totals as slots were filled, disabled Continue until all slots were complete, no per-slot Apply action, and one Continue commit that wrote the module and all resolutions together before the existing Stage 1 partial stop. The same walkthrough confirmed the generic resolver remains available for an already-committed Stage 0 award and the Capellan theme remains active. Focused model coverage verifies Stage 1–4 batch resolution through the existing engine, multi-grant expansion, preview immutability, partial-slot preview persistence, and no silent module or slot default. Existing Stage 0, persistence, save/export, compatibility, Archetype, Point Buy, Final Touches, public-title, and 84-item equipment-catalog coverage remained green. The required separate `npm run build` is recorded after the final exact-tree verification.

## Alpha Slice 47 existing-pending-choice preservation verification

Verify that a Stage 1 draft retaining the Capellan/Commonality Federated Suns language award shows that award before module selection and continues showing it after Blue Collar or Back Woods is previewed. The visible workspace must separately label `Existing pending choices` and `Pending choices from [module]`, and its blockers must agree with both sections. Resolving an existing award must retain the selected module and all local slot values; filling a module slot must leave existing awards visible. Continue must remain disabled until both committed earlier awards and cloned module awards are resolved. Normal module slots retain no per-grant Apply buttons, while the generic resolver remains available for existing, legacy, or unsupported committed awards. Verify Stage 2–4 slots, Stage 0 progressive preview, Capellan theme activation/reversion, no silent defaults, committed-only save/export, compatibility, six-step tracker, public title and URL, exactly 84 equipment records with unchanged stable IDs/data, version `0.1.0-alpha.47`, `npm run check`, and a separate `npm run build`.

Slice 47 checkpoint result: lint passed; 28 test files and 231 tests passed; TypeScript compilation and the production build passed inside `npm run check`. A local desktop browser reproduction retained the unresolved Federated Suns language selector after Blue Collar preview, displayed `Existing pending choices` separately from `Pending choices from Blue Collar`, kept Continue disabled, retained the existing selector after filling Career/Soldier, and retained the selected Blue Collar preview plus Career/Soldier slot after resolving Language/French. The running summary and combined blocker list tracked the remaining module awards. Focused coverage verifies combined Continue gating and preview reconstruction after resolving an earlier committed award. Existing Stage 2–4 slots, Stage 0, Capellan theming, persistence, save/export, compatibility, Archetype, Point Buy, Final Touches, public-title, and 84-item equipment-catalog coverage remained green. The required separate `npm run build` is recorded after final exact-tree verification.

## Alpha Slice 48 flexible-XP slot usability verification

Verify that flexible-pool headings update from assigned slot values and display both assigned and remaining XP, including `0 remaining` at completion and an explicit `XP over limit` amount when over-allocated. Known destinations selected in one slot must be absent from sibling slots in the same award group while remaining visible in their own slot. Changing or clearing a selection must restore it to siblings, and filtering must not cross unrelated award groups. Verify this behavior for known Attribute, Trait, Skill/subskill, and language option identities. Selected-module preview, earlier pending choices, Continue gating and single commit, committed-only save/export, Stage 0 progressive preview, Capellan theme activation/reversion, no silent defaults, compatibility, six-step tracker, public title and URL, exactly 84 equipment records with unchanged stable IDs/data, version `0.1.0-alpha.48`, `npm run check`, and a separate `npm run build` must remain intact.

Slice 48 checkpoint result: lint passed; 28 test files and 235 tests passed; TypeScript compilation and the production build passed inside `npm run check`. A separate final `npm run build` also passed. A local desktop-browser walkthrough confirmed High School's flexible pool displayed `0 assigned · 185 remaining`, updated to `50 assigned · 135 remaining`, and surfaced `200 assigned · 15 XP over limit`. Selecting STR removed it from the sibling Attribute dropdown while preserving it in its own slot; clearing the original Back Woods STR selection restored it immediately. Focused coverage verifies progress calculations, overage wording, own-slot preservation, Attribute/Trait/parameterized Skill and language identity filtering, clearing restoration, same-Skill sibling grouping across High School's two Interest awards, and unrelated-award isolation. Selected-module preview, existing pending choices, Continue gating, committed-only save/export, Stage 0 progressive preview, Capellan theme behavior, compatibility, public title/URL, and 84-item equipment-catalog coverage remained green. No rules, award data, XP accounting, persistence, broad Life Module/affiliation data, random-name, or equipment changes were introduced.

## Alpha Slice 49 existing-choice slot-commit verification

Verify that supported existing pending awards inside an active Stage 1–4 module workspace render as required slot selectors without `Apply one grant`. Selecting one must update only the cloned preview; the committed character, save callback, and JSON export input remain unchanged before Continue. Continue must stay disabled until both existing and module-local slots are complete, then commit the selected module and both choice sets together through the established engine operations. The generic per-grant resolver must remain outside the normal slot transaction and for legacy or unsupported fallback awards. Verify selected-module persistence, separate existing/module headings, Slice 48 progress and duplicate filtering, Stage 0 progressive preview, Capellan theme activation/reversion, no silent defaults, compatibility, six-step tracker, public title and URL, exactly 84 equipment records with unchanged stable IDs/data, version `0.1.0-alpha.49`, `npm run check`, and a separate `npm run build`.

Slice 49 checkpoint result: lint passed; 28 test files and 235 tests passed; TypeScript compilation and the production build passed inside `npm run check`, and the required separate `npm run build` passed. A local desktop-browser walkthrough retained the generic `Apply one grant` resolver before module preview, then showed the same Federated Suns language award as a required selector under `Existing pending choices` with no Apply button after Blue Collar was selected. Choosing Language/French updated only the integrated preview while committed dashboard totals remained unchanged. Continue stayed disabled until the Career, two Interest, and four flexible slots were also complete; one Continue then committed the language, Blue Collar, and all module choices and reached the normal Stage 1 partial stop with no pending awards. Focused model coverage verifies original-character immutability and combined cloned resolution. Slice 48 progress/filtering, Stage 0, Capellan theme, persistence, save/export, compatibility, public title/URL, and the 84-item equipment catalog remained unchanged.

## Alpha Slice 51 integrated flexible-XP regression verification

Verify the real High School preview with both Interest choices, Language/Affiliation, Streetwise/Affiliation, and a legal complete 185-XP flexible allocation. The editor must report `185 assigned · 0 remaining`; the shared preview blocker list must be empty; Continue must enable; and committing that clone must record the module and all eight resolved award allocations while leaving the original committed character unchanged beforehand. Normal integrated Stage 1–4 status must omit `Resolve pending awards`, while the same status component retains that link for fallback contexts. Integrated slot markup must omit redundant visible `Selected: …` echoes while preserving native select values, labels, descriptions, focus, and keyboard operation. Reverify Slice 48–50 behavior, Stage 0, Capellan theme, committed-only save/export, version `0.1.0-alpha.51`, public title/URL, exactly 84 unchanged equipment records and stable IDs, `npm run check`, and a separate `npm run build`.

Slice 51 checkpoint result: lint passed; 28 test files and 237 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. A local Edge walkthrough selected the real Capellan High School path, filled both Interest choices, Language/Russian, Streetwise/Capellan, and four legal Attribute allocations totaling 185 XP. The integrated editor reported `185 assigned · 0 remaining`, the shared status reported `No unresolved award blockers`, Continue enabled, the generic resolver link and visible `Selected: …` echoes were absent, and native labeled selects remained keyboard-operable. Pressing Enter on Continue committed the module and all choices, then advanced through the normal Stage 2 transition into Stage 3. Before that commit, the integrated summary remained explicitly marked uncommitted; focused model coverage verifies original-character immutability and all eight resolved module awards. The fallback resolver remains covered separately. Existing Stage 0, Capellan theming, persistence, committed-only save/export, compatibility, public title/URL, and 84-item equipment-catalog coverage remained green. No domain, engine, persistence, equipment, or rules data changed.

## Alpha Slice 52 goal-guidance and Davion-theme verification

Verify that No goal preserves prior behavior; Basic Training, Technician/Civilian, and Technician/Vehicle can be selected as guidance-only goals; and goal selection grants no Field, XP, Attribute, Trait, Skill, or Stage 3 discount. Character Summary must distinguish satisfied and unmet Attribute, Trait, Skill, and prerequisite-Field requirements. Supported module cards must explain why a fixed award contributes toward a currently unmet requirement without changing selection or awards. Review must place unmet goal requirements before ordinary Optimization, use the established final-allocation operation only for legal existing-stat gaps, and expose structural requirements without fake XP controls. Verify Federated Suns / Crucis March source-backed Stage 0 choices, Davion-only activation and reversion, unchanged Capellan behavior, and the exact palette `#202B22`, `#2B3829`, `#687962`, `#D7B66A`, `#A7C979` with no Davion burgundy, red, or blue variables. Reverify Slice 48–51 behavior, version `0.1.0-alpha.52`, public title/URL, exactly 84 unique unchanged equipment IDs, `npm run check`, and a separate `npm run build`.

Slice 52 checkpoint result: lint passed; 30 test files and 244 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Focused coverage verifies the optional three-Field goal subset, absence of mechanical grants, typed requirement status, explanatory module contributions, existing final-allocation reuse, source-backed Federated Suns / Crucis March application, theme activation/reversion, exact Davion palette, unchanged Capellan behavior, and 84 unique equipment records. A local Edge walkthrough confirmed the default `No goal`, Basic Training summary status, uncommitted Federated Suns progressive preview, explicit language/Natural Aptitude/Art choices, olive/gold activation, Capellan jade reversion, the Blue Collar `Provides INT XP toward INT 3+` marker, and keyboard Continue as the sole Stage 0 commit. Review goal-gap behavior is covered by focused automated model and rendering checks; the full multi-stage path was not repeated manually for this checkpoint.

## Alpha Slice 53 Master Skill Field goal-catalog correction verification

Verify that the initial selector draws from the independent 56-entry corrected-printing pp. 92–95 reference catalog while `No goal` remains the default. MechWarrior must expose Basic Training Field, DEX 4+, and RFL 4+ as prerequisites separately from Gunnery/Mech, Piloting/Mech, Sensor Operations, Tactics/Land, and Technician/Any as Field Skills. Goal selection must grant no Field, Skill, XP, prerequisite, or discount; component Skills must not satisfy a prerequisite Field; `/Any` requirements must remain variable without a fabricated purchase target. Review may fund only legal existing destinations through the established final-allocation operation. The three-entry mechanically acquirable catalog, Davion and Capellan palettes, version `0.1.0-alpha.55`, public title/URL, and exactly 84 unique equipment IDs must remain unchanged. Run `npm run check` and a separate `npm run build`.

## Alpha Slice 54 — affiliation-bound subskills

Corrected Third Printing p. 62 distinguishes `/Affiliation`, whose concrete subskill follows the character's affiliation, from `/Any`, which remains a player choice. The current implemented catalog audit covered Language/Affiliation, Protocol/Affiliation, and Streetwise/Affiliation. Back Woods Stage 1 Language/Affiliation, Back Woods Stage 2 Protocol/Affiliation, High School Language/Affiliation and Streetwise/Affiliation, and Agitator Streetwise/Affiliation now resolve automatically from the durable final affiliation. The Universal Stage 0 Language/Affiliation primary-or-secondary selection remains an explicit constrained choice because that published package offers the character's selected affiliation language; concrete Protocol/Capellan and Protocol/FedSuns awards remain fixed. No unimplemented module was audited or expanded.

Verify both supported paths. Stage 2 Back Woods must preview and commit Protocol/Capellan −15 XP for a Capellan character and Protocol/FedSuns −15 XP for a Federated Suns character, without an affiliation-choice slot or cross-faction leakage. High School and Agitator affiliation-bound positive awards must resolve likewise, while Interest/Any and other variable awards remain pending. Before Continue the committed character, save, and export state must remain unchanged.

Corrected Third Printing p. 77 limits Stage 2 flexible XP to 35 XP per Skill and 200 XP per Attribute or Trait. Confirm those caps remain attached to Stage 2 pools only; later-stage pools must use only their own published restrictions.

## Alpha Slice 55 — automatic award delta verification

The Slice 54 checkpoint was traced through the complete automatic-award pipeline. The catalog award survives module retrieval; `applyModule` resolves the concrete destination from the character's durable final affiliation; `applyDestinationAward` applies the signed XP to the cloned character; Character Summary reads that clone; affiliation-bound awards create no blocker; and Continue commits that same completed clone. JSON export serializes only the committed character. No disappearing automatic award was reproduced. The regression risk was insufficiently causal verification: a pre-existing Protocol Skill could satisfy a presence or aggregate assertion without proving the Stage 2 award's contribution.

Run the exact-delta regression suite for both normal supported paths. Immediately before Stage 2 Back Woods, record the applicable Protocol XP. The base and completed previews must equal the committed value minus 15, while the original character remains byte-for-byte unchanged. The committed preview exported to JSON must retain that same delta. The opposite faction destination must not change, and no affiliation-bound pending slot may exist. Also verify Stage 1 Back Woods Language/Affiliation -5, High School Language/Affiliation +10 and Streetwise/Affiliation +20, and Agitator Streetwise/Affiliation +75 against their own before values. `/Any` awards must remain pending, and the Universal Stage 0 constrained affiliation-language selector remains intentional.

Slice 53 checkpoint result: lint passed; 31 test files and 248 tests passed; TypeScript compilation and the production build passed inside `npm run check`. Focused coverage verifies all 56 unique reference entries and category counts, the independent three-entry mechanical catalog, MechWarrior regression behavior, prerequisite/Field Skill separation, prerequisite-Field independence from component Skills, unresolved `/Any` destinations, no-goal rendering, legal final-allocation reuse, and unchanged theme palettes. A local Edge walkthrough confirmed the grouped selector, keyboard MechWarrior selection and draft creation, unchanged baseline XP/Skills, separately labeled prerequisite and Field Skill guidance, unresolved Technician/Any wording, and Davion-to-Capellan theme switching. The full multi-stage path to Review was not repeated manually; Review funding and structural-gap behavior remain covered by focused automated checks. The required separate final `npm run build` is recorded after exact-tree verification.

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

## Alpha Slice 56 — Stage 0 affiliation switching isolation

Audit the two supported Stage 0 affiliation packages against *A Time of War*, Corrected Third Printing, pp. 64–65. Capellan Confederation / Capellan Commonality must retain its printed Language/Any FedSuns +5 pending choice and explicit Protocol/FedSuns +5 award alongside Protocol/Capellan +10; Federated Suns / Crucis March must retain its Natural Aptitude choice, WIL +50, EDG -50, Art/Any +10, Interest/FedSuns History +15, and combined Protocol/FedSuns +25. Verify clean baselines, both pre-Continue switch directions, repeated switching, affiliation-specific Universal language validation, preview immutability, final-package-only Continue behavior, and committed-only JSON export. Abandoned package awards, choices, pending metadata, languages, and theme state must not accumulate. Confirm that later Protocol/Affiliation affects Protocol/Capellan for a Capellan character without altering Commonality's separate Protocol/FedSuns +5. Preserve Slice 55 exact deltas, `/Any`, Stage 2 caps, Master Skill Field goals, both faction themes, public title/URL, exactly 84 unique unchanged equipment IDs, and version `0.1.0-alpha.56`. Run `npm run check` and a separate `npm run build`.

Slice 56 checkpoint result: the source audit found both implemented package definitions faithful to the corrected-printing tables and did not reproduce a switching or state-isolation defect. Lint passed; 32 test files and 257 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Added regressions establish exact clean package signatures, both switch directions, repeated-switch non-accumulation, Universal-language rejection after context changes, committed-only export, and the distinct Protocol/FedSuns and Protocol/Capellan paths. A local Edge walkthrough confirmed both directions clear abandoned language and package-specific selectors/effects, restore the correct pending rows and faction presentation, and disable Continue until the newly selected package is complete. No production rules, engine, persistence, UI, equipment, or package data changed; the catalog remains exactly 84 unique stable IDs.

## Alpha Slice 58 — expandable prerequisite Fields and shared faction palettes

Verify that every prerequisite Field referenced by the existing 56-entry Master Skill Field goal catalog is available as a native, keyboard-operable `details` disclosure. Infantry - Anti-Mech must expose Infantry as not acquired when appropriate; Infantry must show Basic Training as a nested prerequisite; and each expanded Field must keep Prerequisites separate from Field Skills while showing current acquisition and Skill XP/level status. A second chain such as Anthropologist to General Studies must use the same generic path. Component Skills alone must never satisfy Field acquisition, `/Any` must remain a variable reference without a purchase destination, structural Field gaps must have no `Apply required XP` action, and recursive expansion must stop safely on a detected cycle. Review and legal final-allocation behavior remain unchanged.

Verify the Capellan Confederation and Federated Suns affiliation themes against `palettes/government-ui.yaml` at BattleTech Faction Colors commit `f5ce62194c57e28d3d8a7a31d69b01f901c0672f`. The consumed records are provisional `UI_ADAPTATION` government/faction palettes, not official BattleTech hexadecimal specifications and not military palettes. AToW maps shared primary, deep, surface, panel, alternate-panel, border, secondary, accent, foreground, and ink roles into local panel, border, emphasis, selected-state, and success semantics. Theme activation and reversion remain driven only by the selected Stage 0 affiliation context. No new affiliation is introduced.

Slice 58 checkpoint result: lint passed; 33 test files and 266 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Focused regressions cover Infantry - Anti-Mech → Infantry → Basic Training, the separate Anthropologist → General Studies chain, actual Field-grant ownership versus component Skills, unresolved `/Any`, cycle protection, native disclosure markup, structural no-purchase behavior, exact shared palette role values, removal of superseded local values, and existing affiliation-driven activation/switching. A local Edge walkthrough used Enter to expand both Field levels, exposed semantic expanded state and visible focus, retained unchanged XP/state, and confirmed computed Capellan and Federated Suns shared-role values replace one another cleanly. Slice 57 JSON round trips, Slice 55 `/Affiliation` deltas, Slice 56 switch isolation, Review behavior, and the unchanged 84-record/84-unique-ID equipment catalog remain green.

## Alpha Slice 59 — bounded Stage 3 Field acquisition expansion

Verify that the mechanically acquirable catalog remains separate from all 56 references and contains exactly eight audited Fields. Technical College must expose the two Basic options Technician/Civilian and Pilot/Exoskeleton plus the Advanced options Cartographer, Pilot/IndustrialMech, Technician/Aerospace, Technician/Mech, and Technician/Vehicle. Each selected Field grants exactly +30 XP to each source-listed Field Skill for 24 XP per Skill, uses the published category/year, and records exactly one durable Field grant. Attribute prerequisites and acquired-Field prerequisites must be evaluated from character state; component Skills and goal selection must not satisfy a Field prerequisite. Field selection and awards remain preview-only until Continue, while save/export remain committed-only. Infantry and MechWarrior must remain visibly reference-only with their exact blockers, and no `/Any` value may be invented. Reverify Slice 58 nested guidance and faction themes, Slice 57 JSON round trips, Slice 55 `/Affiliation`, Slice 56 switching isolation, the public title/version, and 84 unique unchanged equipment records.

## Alpha Slice 60 — Stage 3 military-schooling foundation

Verify Military Academy and Military Enlistment appear as distinct Stage 3 schools with their corrected-printing p. 83 base costs, automatic awards, flexible XP, Field lists, category limits, and time. Academy must apply the published WIL +100, EDG -100, Connections +200, Reputation -100, and Wealth -100 conditional adjustment when the Stage 2 history contains neither Preparatory School nor Military School. Both schools must reuse the existing Field transaction, offer mechanically supported Basic Training and Infantry, and display all other source-offered Fields as reference-only with reasons. Basic Training plus Infantry must cost 264 XP in Fields; Academy totals 1,094 XP and 2 years, while Enlistment totals 984 XP and 2 years (0.5 + 1.5). Infantry must grant +30 XP to each of its six p. 94 component Skills and require an actually acquired Basic Training Field; component Skills or a goal selection do not satisfy it. Preview must not mutate committed state; Continue commits school, Fields, awards, and filled choices together; save/export remains committed-only; JSON round trip preserves committed military schooling. MechWarrior remains reference-only solely because Technician/Any needs an explicit player-choice destination. Reverify the 56-entry reference catalog, nine mechanically acquirable Fields, faction themes, `/Affiliation`, affiliation switching, equipment count 84 with unique stable IDs, public title, Slice 60 version, `npm run check`, and a separate `npm run build`.

## Alpha Slice 61 — Technician/Any, MechWarrior, and Trait summary cleanup

Verify Military Academy exposes MechWarrior as an Advanced Field and Military Enlistment does not. MechWarrior must require an actually acquired Basic Training Field plus DEX 4+ and RFL 4+, grant +30 XP to its four fixed Skills and one explicitly chosen canonical Technician subskill, cost 120 XP by the ordinary five-Skill formula, and add one year. The integrated Technician choice must have no default, block Continue while unresolved, replace preview destinations without stale XP, add to an existing matching Skill without duplication, and persist on the Field grant through JSON round trip. Compact resolved Trait rows must render the full name plus stored rating on the left and XP alone on the right; pending Traits must not fabricate a rating. Reverify 56 reference goals, ten mechanically acquirable Fields, equipment count 84 with unique stable IDs, committed-only save/export, public title, Slice 61 version, `npm run check`, and a separate `npm run build`.

## Alpha Slice 62 — second bounded military Field expansion and repetition audit

Verify Basic Training (Naval), Marine, and Ship’s Crew are mechanically offered by Military Academy and Military Enlistment with their source-specific time, while Technician/Military is offered only by Enlistment. Verify exact p. 94 prerequisites and Skills; Field costs of 144, 120, 120, and 144 XP respectively; no-default Security Systems/Any and Technician/Any selection; durable choice provenance and JSON round trips; preview replacement without stale cost, Skills, choices, blockers, or provenance; and unchanged Continue/save/export boundaries. Cavalry and Scout remain reference-only for their documented variable-choice blockers. Confirm all three general schooling groups and secondary Officer Training classification from p. 81. Repeat execution remains unavailable, so no same-type repeat can occur and no unrelated school is added to exercise the still-deferred legal cross-type path. Reverify the 56-entry reference catalog, fourteen mechanically acquirable Fields, Slice 61 Trait and MechWarrior behavior, both faction themes, exactly 84 unique unchanged equipment records, public title, Slice 62 version, `npm run check`, and a separate `npm run build`.

Slice 62 checkpoint result: lint passed; 34 test files and 294 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Coverage verifies all five candidate classifications, exact new Field data, school authorization and time, actual Field prerequisites, bounded no-default choices, canonical identity, preview replacement, Continue semantics, durable choice provenance, JSON round trips, reference/mechanical separation, and the source repetition classifications. A local Edge walkthrough completed Stages 0–2, inspected both military schools, selected Basic Training (Naval) and Marine at Military Academy, confirmed the 144/120 XP costs and one-year timings, resolved Career/Pilot and Security Systems/Electronic, removed the prior Infantry preview without a crash or stale Skills, committed once through Continue, and produced no browser console errors. Reference catalog remains 56; mechanical catalog is 14; equipment remains 84 unique records with no equipment-file changes; faction-palette files are unchanged. Vite emitted only its non-blocking large-chunk advisory.

## Alpha Slice 63 — Cavalry and Scout choice governance

Verify Cavalry against corrected-printing pp. 83 and 94 plus the Driving, Gunnery, and Tactics definitions. It must require an actually acquired Basic Training Field and DEX 3+, contain exactly six Skills, charge 144 XP, grant +30 XP to every fixed or resolved Skill, and expose no-default canonical choices for Driving/Any, Gunnery/Any Vehicle, and Tactics/Land or Sea. Both Military Academy and Military Enlistment must use the same canonical Field with one-year and 1.5-year timing respectively. Choice replacement and Field deselection must remove stale XP, Skills, provenance, blockers, and choice state; Continue remains the only commit point; JSON export/import must preserve the Field, concrete destinations, XP, and provenance without duplication or reopened choices. Audit Scout against p. 94 and the Language, Security Systems, Streetwise, and Tracking definitions. Keep Scout reference-only if its genuinely unrestricted Language/Any cannot be represented without arbitrary subskill creation, and show the exact blocker. Reverify the prior governed Fields, 56 references, actual mechanical count, Stage 3 repeat behavior, Trait display, nested guidance, both faction themes, 84 unique unchanged equipment records, title/version, `npm run check`, and a separate `npm run build`.

Slice 63 checkpoint result: lint passed; 34 test files and 299 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Focused coverage verifies Cavalry's exact prerequisites, six-Skill/144-XP calculation, three canonical no-default choice sets, both school timings, invalid-choice rejection, actual-Field prerequisite, preview replacement, deselection cleanup, durable choice provenance, JSON round trip, and single-record/single-XP behavior. Scout remains reference-only because Language/Any permits any specific language and no complete governed general-language catalog exists; its school explanations identify that blocker. A local in-app-browser walkthrough completed Stages 0–2, inspected both military schools and Scout's explanation, selected/deselected/reselected Cavalry without stale state or error, changed Driving/Ground Vehicles to Driving/Sea Vehicles and confirmed replacement in Character Summary, resolved all choices, confirmed the 144-XP one-year Academy Field, and committed it once. Capellan presentation, Trait rating display, native labeled controls, keyboard focus, and console behavior remained sound. Reference catalog remains 56; mechanical catalog is 15; equipment remains 84 unique records with no equipment-file changes; faction-palette files are unchanged. Vite emitted only its non-blocking large-chunk advisory.

## Alpha Slice 64 — governed Language/Any and Scout

Verify the p. 148 Language semantics without claiming an exhaustive rules catalog. The shared governed source must contain exactly the ten concrete languages already modeled by current character-creation data, normalize Mandarin to Mandarin Chinese, and leave every existing affiliation-specific selector constrained to its established options. Scout must match corrected-printing pp. 83 and 94: actual Basic Training, INT 4+, WIL 3+, no Illiterate, seven Skills, 168-XP Field cost, +30 XP per Skill, four no-default governed choices, one Academy year, and 1.5 Enlistment years. Invalid choices must be rejected; existing Language XP must accumulate in one Skill record; preview replacement and deselection must remove stale XP and provenance; Continue must remain the commit boundary; and export/import must preserve the Field, language, XP, and choice provenance without duplication or reopening. Reverify Stage 0 language constraints, Cavalry and all earlier governed Fields, 56 references, 16 mechanical Fields, unchanged Stage 3 repetition, Trait presentation, faction themes, 84 unique unchanged equipment records, title/version, `npm run check`, and a separate `npm run build`.

Slice 64 checkpoint result: lint passed; 35 test files and 303 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Focused tests cover the explicit ten-language modeled subset, Mandarin normalization, unchanged affiliation selectors, Scout's exact prerequisites, seven-Skill/168-XP calculation, four no-default governed choices, invalid-choice rejection, both school timings, existing-Language XP accumulation, preview replacement, deselection cleanup, Continue-only commit, durable Field and choice provenance, and JSON round trips without duplication or reopened choices. A local in-app-browser walkthrough completed Stages 0–2, inspected Scout in both schools at one and 1.5 years, selected Academy Scout, confirmed all ten modeled language options and the non-exhaustive wording, replaced French with Japanese without stale preview XP, deselected and reselected Scout without stale state, resolved all four choices, accumulated the committed French award into one existing Language record, and committed Scout through Continue. Native labeled controls, keyboard focus, Character Summary, Trait display, Capellan theme, and console behavior remained sound. Reference catalog remains 56; mechanical catalog is 16; equipment remains 84 unique records with no equipment-file changes; faction-palette files are unchanged. Vite emitted only its non-blocking large-chunk advisory.

## Alpha Slice 65 — legal cross-family Stage 3 repetition

Verify the corrected-printing p. 81 family rule and pp. 82–83 memberships; canonical stable-ID family classification; secondary Officer Training compatibility; normal first-school selection; same-school and same-family rejection; legal unused-family selection; future third-family eligibility; optional direct Stage 4 continuation; transactional preview and Continue; cumulative school costs, Fields, awards, prerequisites, and chronology; committed-history family derivation after JSON round trip; and backward-compatible no-school, single-Military, and Slice 64 Scout saves without migration. Manually exercise the implemented Civilian↔Military path, Academy↔Enlistment rejection reasons, Stage 4 continuation after one and two schools, Character Summary, keyboard focus, Scout, Cavalry, MechWarrior, Trait display, both faction themes, and release metadata. Reverify 56 reference Fields, 16 mechanical Fields, exactly 84 unique unchanged equipment entries, unchanged faction palettes and language catalog, `npm run check`, and a separate `npm run build`.

Slice 65 checkpoint result: lint passed; 35 test files and 306 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Tests cover stable-ID family classification, all three future-capable general families, secondary Officer Training, first-school eligibility, same-school and same-family rejection in both Military directions, legal Civilian→Military accumulation, optional Stage 4 continuation, cumulative costs/Fields/awards/time, prerequisite retention, no award reapplication, JSON round trip without drift or reopened choices, and unchanged Slice 64 regressions. Manual in-app-browser verification completed a real Technical College→Military Academy journey, confirmed uncommitted preview and Continue-only commit, cumulative expected ages 19→21→25, a single Stage 4 transition, the accessible family-reuse reason, both Academy→Enlistment and Enlistment→Academy rejection, Character Summary, keyboard heading focus, Scout/Cavalry/MechWarrior availability, Trait presentation, Capellan and Federated Suns themes, current release display, and zero console errors. Reference catalog remains 56; mechanical catalog remains 16; equipment remains 84 unique records. Equipment, faction-palette, and governed-language files are unchanged. Vite emitted only its non-blocking large-chunk advisory.

## Alpha Slice 66 — Intelligence/Police Stage 3 foundation

Verify Police Academy and Intelligence Operative Training against corrected-printing pp. 82–83, their Intelligence/Police family identity, exact base costs, prerequisites, fixed awards, flexible XP, Field lists, school-specific category timing, and reference-only explanations. Verify Police Officer, Detective, and Intelligence against p. 93, including exact component Skills, governed choices, automatic Streetwise/Affiliation, Field costs of 168, 168, and 120 XP, and the Detective/Intelligence alternative prerequisite. Confirm existing canonical Fields are reused with each school's category and timing rather than duplicated.

Verify preview remains uncommitted; variable and fixed-grant choices begin unset; changing or removing a choice or Field removes stale awards, XP, provenance, blockers, and time; Continue commits the complete school transaction once; save/export remain committed-only; and JSON round trip preserves school history, Fields, choices, awards, XP, time, and family derivation without reapplication or reopened choices. Verify Intelligence/Police same-family rejection in both school orders, legal unused-family routes, optional Stage 4 continuation, and cumulative three-family behavior at model/engine level. Reverify Military and Civilian family governance, Technical College, both Military schools, Scout, Cavalry, MechWarrior, Trait display, both faction themes, 56 reference Fields, the actual mechanical count, 84 unique unchanged equipment records, unchanged faction and governed-language data, public title/version, `npm run check`, and a separate `npm run build`.

Slice 66 checkpoint result: lint passed; 35 test files and 314 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Coverage verifies the two schools' exact source data, three new canonical Fields, alternative and Trait prerequisites, governed and affiliation-bound Skills, school-specific category timing, transactional preview/commit behavior, same-family rejection in both directions, legal unused-family routes, cumulative three-family history and chronology, JSON round trips, and no award reapplication. A local in-app-browser walkthrough completed Police Academy with Police Officer, Technician/Military, and Detective; verified all no-default choices and final-validation warnings; committed once through Continue; confirmed Intelligence Operative Training is then unavailable as the same family; and completed a legal Police Academy→Military Academy cross-family route while leaving Technical College available as the third family. Capellan presentation, Character Summary, keyboard heading focus, release metadata, and the browser console remained sound. Reference catalog remains 56; mechanical catalog is 19; equipment remains 84 unique records. Equipment, faction-palette, and governed-language files are unchanged. Vite emitted only its non-blocking large-chunk advisory.

## Alpha Slice 67 — Officer Candidate School

Verify Officer Candidate School against corrected-printing pp. 80–83, the Officer Field on p. 94, and officer-grade Rank on p. 124. Confirm the secondary school classification, prior Intelligence/Police-or-Military-only entry rule, existing Basic-plus-Advanced Field requirement, exact 550-XP base cost, exact automatic awards, 115 flexible XP, required Officer Field, 120-XP Field cost, one-year time, and final Basic Training-or-Naval plus Rank O1 prerequisites. Confirm the complete transaction costs 670 XP before flexible allocations, begins with no silent flexible destination, and unlocks officer ranks through the Officer Field rather than XP arithmetic alone.

Verify that OCS is optional, cannot be selected without qualifying history, cannot follow a Civilian history at entry, cannot repeat, and does not create or consume a fourth normal family. Military→OCS and Intelligence/Police→OCS must work; an already-used normal family must remain blocked afterward; and a source-legal unused family must remain available. Preview and cancellation must leave committed state unchanged; Continue must commit OCS, Officer, awards, flexible resolution, cost, and time once; Stage 4 must remain reachable with or without OCS. JSON round trips must preserve history, Field, choices, XP, age, provenance, and normal-family derivation without reapplication or reopened choices. Reverify all Slice 66 Intelligence/Police behavior, Slice 65 family behavior, prior governed Fields and choices, Trait display, both faction themes, 56 reference Fields, 20 mechanical Fields, exactly 84 unique unchanged equipment records, public title/version, `npm run check`, and a separate `npm run build`.

Slice 67 checkpoint result: lint passed; 35 test files and 316 tests passed; TypeScript compilation and the production build passed inside `npm run check`. The required separate `npm run build` is recorded by the release completion report. Coverage verifies exact OCS and Officer data, both qualifying prior-family routes, nonqualifying and Civilian rejection, optional Stage 4 continuation, secondary-family isolation, same-family and duplicate rejection, exact 670-XP/+1-year transaction, fixed awards, unresolved 115-XP blocking allocation, Continue-only commit, preview immutability, durable round trip, and unchanged prior behavior. A local in-app-browser walkthrough completed Military Academy, kept Stage 4 available without OCS, opened OCS as an optional secondary school, confirmed its accessible 670-XP/+1-year preview and required Officer Field, switched previews without committing, resolved its 115 XP, committed once, and confirmed duplicate OCS and another Military school are blocked while Technical College remains available. Capellan presentation, Character Summary, keyboard heading focus, release metadata, and browser console remained sound. Reference catalog remains 56; mechanical catalog is 20; equipment remains 84 unique records. Equipment, faction-palette, and governed-language files are unchanged.

## Alpha Slice 68 — broader governed `/Any` support

Verification covers the central variable-choice registry, explicit exhaustive versus modeled-bounded classifications, ten promoted Fields and their calculated costs, updated source school offers, no-default pending awards, legal-option validation, distinct duplicate Language prevention within Analysis, existing accumulation/persistence behavior, 56 reference Fields, 30 mechanical Fields, and 84 unique equipment records. Final command results and deployment status are recorded in the completion report.

## Alpha Slice 69 — governed open Skill subjects

Verification covers the source classification of Career, Interest, Science, and Survival; empty and whitespace-only rejection; deterministic trimming and whitespace collapse; punctuation/case preservation; control, slash, and length rejection; fixed parent identity; no defaults; integrated preview replacement/deselection; Continue gating; canonical accumulation; durable Field/choice provenance and JSON round trip; exact Scientist and Special Forces data/offers/costs; unchanged bounded Language and Slice 68 selectors; unchanged OCS and Stage 3 families; 56 reference Fields; 32 mechanical Fields; and 84 unique equipment records. Final command and deployment results are recorded in the completion report.

## Alpha Slice 70 — University school expansion

Verify the remaining-school audit covers Trade School, University, Solaris Internship, and Family Training and records the absence of applicable v4.0 errata. University must use its exact 710-XP base package, INT 4+ prerequisite, conditional entry adjustment, automatic awards, open Interest subject, affiliation-bound Protocol, +50 Attribute choice, 220 flexible XP, Civilian family, and source Field categories/times. Manager, Planetary Surveyor, and Politician must use their exact prerequisites and Skills, +30 XP per Skill, and 24 XP cost per Skill. Planetary Surveyor must require Scientist and INT 6+, expose bounded Driving and open Survival choices without defaults, preview and deselect cleanly, and round-trip without XP, Field, choice, or provenance duplication. University must block other Civilian schools while leaving unused families available, Stage 3 finish optional, OCS unchanged, and save/export committed-only. Confirm 56 reference Fields, 35 mechanical Fields, 84 unique equipment records, unchanged equipment files, and successful `npm run check`, separate `npm run build`, browser smoke, deployment, and live metadata.

## Alpha Slice 71 — General Studies prerequisite semantics

Verify General Studies against corrected-printing pp. 82-83 and 92 plus v4.0 errata. Its INT 3 and source phrase "at least one other Skill related to those shown below" must be represented honestly as a no-default, zero-XP selection from concrete Skills already possessed before University preview, with a visible GM-approval caveat and durable canonical provenance. The selection must not create or award a Skill; replacement and deselection must remove stale preview state; Continue must remain the only commit point; and export/import must preserve legality without reopening choices.

Verify exact General Studies, Anthropologist, Archaeologist, and Lawyer prerequisites, Skills, category, time, 24-XP-per-Skill costs, and +30 XP awards. Dependent Fields must require actual General Studies acquisition. HPG Technician remains reference-only. Reverify University, Planetary Surveyor, open-subject governance, Stage 3 families and OCS, committed-only save/export, existing-save decoding, both faction themes, 56 reference Fields, 39 mechanical Fields, and exactly 84 unique unchanged equipment records.

Slice 71 checkpoint result: lint passed; 41 test files and 345 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Coverage verifies source-exact General Studies and dependent-Field data, no-default zero-XP related-Skill selection from actual trained concrete Skills, clean choice replacement and deselection, durable provenance and JSON round trip, Continue-only commit, existing-save decoding, and corrected goal guidance for trained concrete `/Any` and `/Affiliation` Skills. A local Edge walkthrough reached University, previewed General Studies, replaced its related Skill without changing XP, exercised Archaeologist, manually deselected the Planetary Surveyor regression preview before switching dependencies, committed the University transaction once, confirmed labeled keyboard focus, both faction themes, and zero console errors. Reference catalog remains 56; mechanical catalog is 39; equipment remains 84 unique records with no equipment-file changes. HPG Technician remains reference-only. Vite emitted only its non-blocking large-chunk advisory.

## Alpha Slice 72 — Trade School and governed any-three-Skills awards

Slice 72 checkpoint result: lint passed; 42 test files and 347 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Coverage verifies Trade School’s exact package, non-INT Attribute destination, three distinct governed Skill slots, closed-domain and validated open-subject resolution, existing-Skill accumulation, new governed Skills, replacement and deselection cleanup, separate Field and school-award provenance, unrestricted 200 flexible XP, Merchant and Journalist data/costs, Civilian family blocking, legal cross-family entry, transactional preview, JSON-safe state, and the prior Slice 71/70/69/68 paths. A local in-app-browser walkthrough completed Stage 0 through Trade School, verified that INT is absent only from the “other Attribute” selector, exercised an open Interest subject and Skill-slot replacement, confirmed Continue-only commit, and produced zero console warnings or errors. Reference catalog remains 56; mechanical catalog is 41; equipment remains 84 unique records with no equipment-file changes. HPG Technician remains reference-only. Vite emitted only its non-blocking large-chunk advisory.

Slice 59 checkpoint result: lint passed; 33 test files and 275 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Focused coverage verifies exact Field costs and Skills, +30 XP awards, actual Field ownership versus component Skills, duplicate rejection, explicit Field-set preview/commit equivalence, committed-state immutability during preview, reference/acquirable separation, and the distinction between final-validation Attribute requirements and an unavailable missing prerequisite Field. A local Edge walkthrough completed Stages 0–2, reached the keyboard-operable Stage 3 selector, confirmed available/unavailable and reference-only explanations, keyboard-selected Cartographer, observed its 144-XP cost and all six +30 XP Skill awards in preview, retained Continue as the commit boundary, then committed Cartographer and its awards exactly once. The Capellan theme and Slice 59 title/version remained active. The equipment catalog remains 84 records with 84 unique IDs and no equipment-file change.

## Alpha Slice 73 — Family Training

Verify the exact corrected-printing p. 83 Family Training package, 570-XP base cost, Military family, Preparatory/Military School **or** Connections +1 prerequisite, concrete named-homeworld Interest award, governed Driving, open Survival, affiliation-bound Protocol, 100 flexible XP, source Field categories/times, and OCS relationship. Verify each OR branch independently, both together without duplicate credit, and the understandable combined unmet state. Verify transactional homeworld preview, clean replacement/deselection, Continue-only commit, persistence/backward compatibility, same-family blocking, unused-family availability, 56 reference Fields, actual mechanical count, 84 unique unchanged equipment records, public metadata, `npm run check`, separate `npm run build`, and browser smoke.

Slice 73 browser checkpoint: a local in-app-browser walkthrough completed the Capellan Stage 0, Blue Collar, and High School path, then selected Family Training. The empty homeworld remained an ordinary visible blocker without crashing; `Sian` produced `Interest/Sian History`; governed Driving/Ground, open Survival/Desert, and 100 flexible XP resolved without defaults. Switching to Military Academy removed every Family Training preview effect, reselection restored the empty blocker without stale choices, and Continue committed the 834-XP Basic Training + Infantry transaction exactly once. Afterwards Military Academy, Military Enlistment, and Family Training were blocked; Technical College and Police Academy remained available; OCS was enabled. Capellan and Federated Suns themes, public Slice 73 metadata, labeled controls, heading focus, and a clean fresh-tab console were confirmed.

Slice 73 checkpoint result: lint passed; 43 test files and 351 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Reference Fields remain 56; mechanical Fields remain 41; equipment remains 84 records with 84 unique stable IDs and no equipment-file changes. Vite emitted only its non-blocking large-chunk advisory.

## Alpha Slice 74 — Solaris Internship

Verify corrected-printing pp. 80-82 and the v4.0 errata: exact 700-XP package, actual Solaris VII residence distinct from homeworld/affiliation, Connections +2 TP, no-default Attribute and Equipped-or-Vehicle choices, governed Streetwise/Any, 100 flexible XP, canonical two-year Basic/Advanced Fields, and the automatic acquisition-specific Cavalry/MechWarrior/Battle Armor prerequisite waivers. Prove that waiver provenance neither grants nor globally satisfies the missing prerequisite, preview remains isolated, replacement/deselection removes stale state, Continue commits exactly once, persistence is backward-compatible, Civilian-family governance and OCS remain correct, reference Fields remain 56, actual mechanical count is reported, and equipment remains 84 unique unchanged records. Run `npm run check`, a separate `npm run build`, and browser smoke.

Slice 74 checkpoint result: lint passed; 44 test files and 355 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Coverage verifies exact Solaris Internship source data, residence and Connections prerequisites, no-default fixed and flexible awards, governed Streetwise resolution, deterministic Cavalry and MechWarrior waiver scope and provenance, preview isolation, single Continue commit, JSON round trip, Civilian-family blocking, legal unused-family paths, and unchanged OCS qualification. A local in-app-browser walkthrough completed Stages 0–2, entered Solaris VII as a distinct unsaved residence, resolved the Attribute, Vehicle, Streetwise, flexible-XP, and Cavalry subskill choices, committed once, and confirmed the acquisition-specific Basic Training waiver in durable rule details. Other Civilian schools were then blocked; Military and Intelligence/Police remained available; OCS remained unavailable; the Capellan theme remained active; and the browser console contained no warnings or errors. Reference Fields remain 56; mechanical Fields remain 41; equipment remains 84 records with 84 unique stable IDs and no equipment-file changes. Vite emitted only its non-blocking large-chunk advisory.

## Alpha Slice 75 — Pilot/Battle Armor and remaining-Field audit

Verify Pilot/Battle Armor against corrected-printing pp. 83 and 94 and both Core and Companion errata: Infantry, STR 6+, BOD 5+; six fixed Skills; 144-XP cost; +30 XP per Skill; exact Solaris Advanced, Military Academy Special, and Family Training Special two-year offers; and no Military Enlistment offer. Solaris must waive only Infantry for that acquisition, without granting it or bypassing Attributes, and forged or cross-school waiver provenance must fail validation. Prove preview isolation, clean deselection/reselection, Continue-only commit, committed-only save/export, JSON-safe Field/Skill/provenance state, family/OCS regressions, faction themes, keyboard/focus behavior, and zero browser errors. Re-audit every remaining reference-only Field, report 56 references, 42 mechanical Fields, and 84 unique unchanged equipment records.

Slice 75 checkpoint result: lint passed; 45 test files and 359 tests passed; TypeScript compilation and the production build passed inside `npm run check`; and the required separate `npm run build` passed. Coverage verifies exact Pilot/Battle Armor prerequisites, cost, Skills, school offers and timing; Solaris-only Infantry-waiver scope and durable provenance; forged-waiver rejection; preview isolation; clean deselection; JSON round trip; and prior school, family, OCS, save/export, affiliation-theme, language, Trait-summary, and Stage 3 governance paths. A local in-app-browser walkthrough reached Solaris Internship, displayed Pilot/Battle Armor as a 144-XP two-year Advanced Field, previewed all six +30-XP Skills, removed them cleanly on deselection, restored them on reselection, retained explicit STR/BOD final warnings, and produced zero console warnings or errors. The Capellan theme remained active; Federated Suns switching remains covered by the full automated regression suite. Reference Fields remain 56; mechanical Fields are 42; equipment remains 84 records with 84 unique stable IDs and no equipment-file changes. Vite emitted only its existing non-blocking large-chunk advisory.

## Documentation/state review

At every material checkpoint, ensure status labels remain accurate. Designed or documented work must not be reported as implemented, and implemented work must not be reported as verified until its required checks have passed.
