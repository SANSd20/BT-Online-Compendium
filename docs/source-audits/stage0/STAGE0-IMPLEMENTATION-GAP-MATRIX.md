# Stage 0 Implementation Gap Matrix

Status: **STATIC COMPARISON — NOT FRESHLY TEST-VERIFIED**

This document preserves the complete G1i Stage 0-B2 comparison of the 102
source records in `STAGE0-CORE-SOURCE-CATALOG.md` against the implementation at
commit `028c7741ba54d554aa7db439db0a66b8f1ca45a8`.

The comparison is not a claim that all listed behavior is complete. It
distinguishes catalog identity from executable awards, choices, restrictions,
validation, UI, persistence, and tests. B2's automated-suite limitation is
preserved: Vitest was unavailable in that environment. This B3 environment
also could not restore dependencies because `npm ci` ended with network
`ECONNRESET`; therefore this matrix remains a static implementation comparison.

## Classification key

For each record the columns are:

`C/A/Ch/R/V/UI/P/T` = catalog, awards, choices, restrictions, validation,
player UI, persistence, and tests.

- `S`: executable or substantially executable support.
- `P`: partial or internal-only support; not a complete player-facing source path.
- `I`: identity/context metadata only.
- `D`: deferred or unsupported.
- `inherit`: supplied by the parent or shared rule rather than a distinct record.
- `preserved`: schema can preserve a value, but no executable behavior exists.
- `covered*`: static/test references were found; not freshly re-run for B3.

## Complete 102-record comparison

### Page 63

| Source ID | Status | C/A/Ch/R/V/UI/P/T |
|---|---|---|
| CORE-STAGE0-UNIVERSAL-XP-DEDUCTION | S | S/S/S/P/S/S/S/covered* |
| CORE-STAGE0-RULE-AFFILIATION-BIRTH | S | S/P/S/P/S/S/S/covered* |
| CORE-STAGE0-RULE-SUBAFFILIATION-OPTIONAL | P | P/P/S/P/S/S/S/covered* |
| CORE-STAGE0-CHANGE-AFFILIATION-SELECTION | P | P/P/S/P/S/S/S/covered* |
| CORE-STAGE0-CHANGE-AFFILIATION-XP-DIVISION | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-CHANGE-AFFILIATION-RESTRICTIONS | D | D/D/D/D/D/D/D/D |

### Page 64

| Source ID | Status | C/A/Ch/R/V/UI/P/T |
|---|---|---|
| CORE-STAGE0-AFF-CAPELLAN | P | P/inherit/inherit/P/S/S/S/covered* |
| CORE-STAGE0-SUB-CAPELLAN-COMMONALITY | S | S/S/S/P/S/S/S/covered* |
| CORE-STAGE0-SUB-CAPELLAN-LIAO-COMMONALITY | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-CAPELLAN-SIAN-COMMONALITY | S | S/S/S/P/S/S/S/covered* |
| CORE-STAGE0-SUB-CAPELLAN-ST-IVES-COMMONALITY | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-CAPELLAN-VICTORIA-COMMONALITY | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-AFF-DRACONIS | I | I/D/D/D/D/D/preserved/D |
| CORE-STAGE0-SUB-DRACONIS-AZAMI | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-DRACONIS-BENJAMIN-DISTRICT | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-DRACONIS-DIERON-DISTRICT | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-DRACONIS-NEW-SAMARKAND-GALEDON-DISTRICT | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-DRACONIS-PESHT-DISTRICT | D | D/D/D/D/D/D/D/D |

### Page 65

| Source ID | Status | C/A/Ch/R/V/UI/P/T |
|---|---|---|
| CORE-STAGE0-AFF-FEDERATED-SUNS | P | P/inherit/inherit/P/S/S/S/covered* |
| CORE-STAGE0-SUB-FEDERATED-SUNS-CAPELLAN-MARCH | S | S/S/S/P/S/S/S/covered* |
| CORE-STAGE0-SUB-FEDERATED-SUNS-CRUCIS-MARCH | S | S/S/S/S/S/S/S/covered* |
| CORE-STAGE0-SUB-FEDERATED-SUNS-DRACONIS-MARCH | S | S/S/S/P/S/S/S/covered* |
| CORE-STAGE0-SUB-FEDERATED-SUNS-OUTBACK | S | S/S/S/S/S/S/S/covered* |

### Page 66

| Source ID | Status | C/A/Ch/R/V/UI/P/T |
|---|---|---|
| CORE-STAGE0-AFF-FREE-WORLDS-LEAGUE | D | D/D/D/D/D/D/preserved/D |
| CORE-STAGE0-SUB-FWL-MARIK-COMMONWEALTH | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-FWL-PRINCIPALITY-REGULUS | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-FWL-DUCHY-ORIENTE | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-FWL-DUCHY-ANDURIEN | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-FWL-OTHER-WORLDS | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-AFF-LYRAN-ALLIANCE | D | D/D/D/D/D/D/preserved/D |
| CORE-STAGE0-SUB-LYRAN-ALARION-PROVINCE | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-LYRAN-BOLAN-PROVINCE | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-LYRAN-COVENTRY-PROVINCE | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-LYRAN-DONEGAL-PROVINCE | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-LYRAN-SKYE-PROVINCE | D | D/D/D/D/D/D/D/D |

### Page 67

| Source ID | Status | C/A/Ch/R/V/UI/P/T |
|---|---|---|
| CORE-STAGE0-AFF-FREE-RASALHAGUE-REPUBLIC | D | D/D/D/D/D/D/preserved/D |
| CORE-STAGE0-SUB-FREE-RASALHAGUE-CLAN-WAR-EXPATRIATE | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-FREE-RASALHAGUE-GHOST-BEAR-DOMINION | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-AFF-MINOR-PERIPHERY | D | D/D/D/D/D/D/preserved/D |
| CORE-STAGE0-SUB-MINOR-PERIPHERY-FIEFDOM-RANDIS | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-MINOR-PERIPHERY-FRANKLIN-FIEFS | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-MINOR-PERIPHERY-MICA-MAJORITY | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-MINOR-PERIPHERY-NIOPS-ASSOCIATION | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-MINOR-PERIPHERY-RIM-COLLECTION | D | D/D/D/D/D/D/D/D |

### Page 68

| Source ID | Status | C/A/Ch/R/V/UI/P/T |
|---|---|---|
| CORE-STAGE0-AFF-MAJOR-PERIPHERY-STATE | D | D/D/D/D/D/D/preserved/D |
| CORE-STAGE0-SUB-MAJOR-PERIPHERY-CIRCINUS-FEDERATION | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-MAJOR-PERIPHERY-MAGISTRACY-CANOPUS | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-MAJOR-PERIPHERY-MARIAN-HEGEMONY | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-MAJOR-PERIPHERY-OUTWORLDS-ALLIANCE | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-MAJOR-PERIPHERY-TAURIAN-CONCORDAT | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-AFF-DEEP-PERIPHERY | D | D/D/D/D/D/D/preserved/D |
| CORE-STAGE0-SUB-DEEP-PERIPHERY-HANSEATIC-LEAGUE | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-DEEP-PERIPHERY-CASTILIAN-PRINCIPALITIES | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-DEEP-PERIPHERY-UMAYYAD-CALIPHATE | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-DEEP-PERIPHERY-JARNFOLK | D | D/D/D/D/D/D/D/D |

### Pages 69–70

| Source ID | Status | C/A/Ch/R/V/UI/P/T |
|---|---|---|
| CORE-STAGE0-AFF-INVADING-CLAN | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-SUB-INVADING-CLAN-DIAMOND-SHARK | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-INVADING-CLAN-GHOST-BEAR | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-INVADING-CLAN-HELLS-HORSES | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-INVADING-CLAN-JADE-FALCON | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-INVADING-CLAN-NOVA-CAT | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-INVADING-CLAN-SNOW-RAVEN | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-INVADING-CLAN-WOLF | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-AFF-HOMEWORLD-CLAN | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-SUB-HOMEWORLD-CLAN-BLOOD-SPIRIT | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-HOMEWORLD-CLAN-CLOUD-COBRA | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-HOMEWORLD-CLAN-COYOTE | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-HOMEWORLD-CLAN-FIRE-MANDRILL | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-HOMEWORLD-CLAN-GOLIATH-SCORPION | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-HOMEWORLD-CLAN-ICE-HELLION | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-HOMEWORLD-CLAN-STAR-ADDER | I | I/D/D/D/P/D/preserved/D |
| CORE-STAGE0-SUB-HOMEWORLD-CLAN-STEEL-VIPER | I | I/D/D/D/P/D/preserved/D |

### Page 71

| Source ID | Status | C/A/Ch/R/V/UI/P/T |
|---|---|---|
| CORE-STAGE0-CASTE-MECHWARRIOR | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-CASTE-ELEMENTAL | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-CASTE-ELEMENTAL-ADVANCED | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-CASTE-AEROSPACE-OR-PROTOMECH | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-CASTE-AEROSPACE-NAVAL | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-CASTE-WARRIOR-OTHER | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-CASTE-SCIENTIST | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-CASTE-TECHNICIAN | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-CASTE-MERCHANT | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-CASTE-LABORER | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-CASTE-RULE-AWARD-TABLE-SCOPE | P | P/P/P/P/P/D/S/covered* |
| CORE-STAGE0-CASTE-RULE-DARK-CASTE | D | D/D/D/D/P/D/preserved/D |

### Page 72

| Source ID | Status | C/A/Ch/R/V/UI/P/T |
|---|---|---|
| CORE-STAGE0-AFFILIATION-TERRAN | D | D/D/D/D/D/D/preserved/D |
| CORE-STAGE0-SUBAFFILIATION-TERRAN-BELTER | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUBAFFILIATION-TERRAN-LUNAR-CITIZEN | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUBAFFILIATION-TERRAN-MARTIAN-CITIZEN | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUBAFFILIATION-TERRAN-OUTER-SYSTEM-CITIZEN | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUBAFFILIATION-TERRAN-TERRAN-CITIZEN | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUBAFFILIATION-TERRAN-VENUSIAN-CITIZEN | D | D/D/D/D/D/D/D/D |

### Page 73

| Source ID | Status | C/A/Ch/R/V/UI/P/T |
|---|---|---|
| CORE-STAGE0-AFF-INDEPENDENT | D | D/D/D/D/D/D/preserved/D |
| CORE-STAGE0-SUB-INDEPENDENT-ANTALLOS | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-INDEPENDENT-ASTROKASZY | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-INDEPENDENT-GENERIC | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-INDEPENDENT-MERCENARY | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-INDEPENDENT-PIRATE | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-INDEPENDENT-SPACER | D | D/D/D/D/D/D/D/D |
| CORE-STAGE0-SUB-INDEPENDENT-TORTUGA | D | D/D/D/D/D/D/D/D |

### Page 74

| Source ID | Status | C/A/Ch/R/V/UI/P/T |
|---|---|---|
| CORE-STAGE0-ORDER-COMSTAR-WORD-OF-BLAKE | P | P/P/S/P/S/S/S/covered* |
| CORE-STAGE0-ORDER-COMSTAR | S | S/S/S/P/S/S/S/covered* |
| CORE-STAGE0-ORDER-WORD-OF-BLAKE | S | S/S/S/P/S/S/S/covered* |

## Aggregate B2 result

B2 reported 19 executable/substantially executable records, 18 partial or
internal-only records, 8 identity/context-only records, and 57 deferred or
unsupported records. These are static-analysis classifications, not verified
implementation percentages.

Confirmed gaps are Changing Affiliations, most non-modeled affiliation
families, incomplete Clan-specific awards, disabled public Clan creation, and
phenotype-aware final-level Attribute validation. Clan internal support must
not be represented as public availability.

## Draconis Combine implementation plan

### Source scope

The Page 64 ledger is authoritative for Draconis Combine and its five
sub-affiliations: Azami, Benjamin District, Dieron District, New Samarkand
(Galedon) District, and Pesht District. The implementation slice should add
only the source-backed package data and behavior for those records; it should
not expose other unsupported Stage 0 families.

### Reusable architecture

Reuse the existing `LifeModuleAffiliationContext` registry and
`LIFE_MODULE_CATALOG`, `applyUniversalStage0`, `applyStage0Affiliation`,
`applyModule`, pending-award resolution, provenance creation, and the existing
Stage 0 preview/Continue transaction in `stage0PreviewModel.ts`,
`LifeModulesWizard.tsx`, and `LifeModulesScreen.tsx`. Reuse the shared fixed,
language-choice, flexible, `/Any`, and choice-package award machinery rather
than adding a Draconis-specific engine.

Persistence and export/import should require no schema change: affiliation
context, selected module history, resolved awards, pending choices, source
citations, and provenance already round-trip through the character codec. Add
regression coverage for those existing fields when Draconis is implemented.

### Required Draconis work

1. Add a canonical Draconis parent/context and five source-cited sub-affiliation
   contexts with exact Page 64 source IDs.
2. Add the printed fixed Attribute, Trait, Skill, language, and flexible awards
   for each sub-affiliation, preserving signed XP and parameterized subjects.
3. Encode optional-sub-affiliation semantics without charging a second parent
   cost or silently granting omitted sub-affiliation awards.
4. Add all source-required language and `/Any` choices as governed pending
   awards. Do not create free-text parent Skill identities or invented language
   options.
5. Add restrictions and prerequisite validation from the ledger, including
   any affiliation-specific Trait, Skill, language, or sub-affiliation limits.
6. Extend Stage 0 preview and Continue so switching between supported contexts
   removes abandoned awards, pending state, provenance, and theme state before
   committing the new choice.
7. Expose only the five source-backed Draconis choices in the UI. Keep all
   unsupported families unavailable.
8. Add catalog, engine, preview isolation, validation, persistence, and
   integration regression tests for every Draconis record and every required
   choice.

### Dependencies and decisions

- The exact Page 64 ledger values must be copied into the catalog before any
  implementation is considered source-complete.
- Any open `/Any` subject must remain a governed unresolved choice unless the
  existing canonical bounded-choice model supports it.
- The source does not authorize inferred geographic or language behavior;
  those choices require explicit source-backed modeling.
- The phenotype-aware final-level Attribute defect is independent of Draconis
  package data. It should remain a separate tracked correction unless a
  Draconis award cannot be validated without it.
- Clan public creation and Clan activation remain disabled.

## Verification record

- Repository and source hashes matched the B3 handoff.
- `git diff --check` passed before the documentation write.
- `npm ci` was attempted without changing package manifests; it failed with
  network `ECONNRESET` and an ignored `node_modules` cleanup `EPERM`.
- Full unit, `npm run check`, build, and integration verification could not be
  rerun because dependency restoration did not complete.
- No application, test, fixture, configuration, dependency-definition, or
  version files were modified.
- This document is intentionally left uncommitted.
