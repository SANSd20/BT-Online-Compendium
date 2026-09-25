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
