# G1i Stage 0-B1 - Core Stage 0 Source Catalog

## Audit metadata

- Project: AToW Online Character Creator
- Workstream: G1i - Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-B1
- Source authority: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Errata: *A Time of War Errata v4.0*
- Printed-page coverage: 63-74
- Source verification status: **SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This catalog consolidates the twelve completed page-specific ledgers. Those ledgers remain the detailed award authorities; this document provides the single auditable inventory, stable-ID index, counting methodology, parent relationships, and errata map. It does not establish application implementation or authorize application changes.

## Source files and provenance

- Corrected Third Printing SHA-256: `32D9B06655D1A0A108CD7F6B6ED9EFDA41A9673671E9ADEB285A02A5B769EF37`
- v4.0 Errata SHA-256: `998141687F3F71F8347DA46FC4C2A87C9595CF37B75CAFDB0EEBB88301E453EF`
- Every record below retains its printed page and is detailed in the linked page ledger.

## Page coverage and record denominators

The itemized source-ID inventory contains **102 unique documentation records**:

| Printed page | Source ledger | Records | Scope |
| ---: | --- | ---: | --- |
| 63 | [Universal Stage 0](page-63-universal-stage0.md) | 6 | Universal XP, affiliation selection, sub-affiliation, and changing-affiliation rules |
| 64 | [Capellan / Draconis](page-64-capellan-draconis.md) | 12 | Two parent affiliations and ten sub-affiliations |
| 65 | [Federated Suns](page-65-federated-suns.md) | 5 | Parent affiliation and four sub-affiliations |
| 66 | [FWL / Lyran](page-66-fwl-lyran.md) | 12 | Two parent affiliations and ten sub-affiliations |
| 67 | [Rasalhague / Minor Periphery](page-67-rasalhague-minor-periphery.md) | 9 | Two parent affiliations and seven sub-affiliations |
| 68 | [Major / Deep Periphery](page-68-major-deep-periphery.md) | 11 | Two parent affiliations and nine sub-affiliations |
| 69 | [Invading Clans](page-69-invading-clans.md) | 8 | Parent affiliation and seven Clan identities |
| 70 | [Homeworld Clans](page-70-homeworld-clans.md) | 9 | Parent affiliation and eight Clan identities |
| 71 | [Clan Castes](page-71-clan-castes.md) | 12 | Caste awards and Clan-caste rules |
| 72 | [Terran](page-72-terran.md) | 7 | Parent affiliation and six sub-affiliations |
| 73 | [Independent](page-73-independent.md) | 8 | Parent affiliation and seven sub-affiliations |
| 74 | [ComStar / Word of Blake](page-74-comstar-word-of-blake.md) | 3 | Shared order package and two order choices |
| **Total** | 12 ledgers | **102** | No duplicate source IDs |

Counting rules:

- A record is counted once when it has a `Source ID` in a page ledger.
- Parent affiliations, sub-affiliations, Clan castes, order packages, order choices, and universal rules remain distinct records.
- A repeated award, inherited parent award, cross-reference, or erratum mention is not counted as a new source record.
- The six page-63 records are universal rule records, not affiliation packages.
- The page-74 count is three: one shared ComStar/Word of Blake package plus two order sub-affiliations.

## Stable-ID inventory

The following complete index is the consolidated source inventory. Each ID links to the page ledger containing the complete exact award, language, choice, restriction, and provenance fields.

### Page 63 - Universal rules

`CORE-STAGE0-UNIVERSAL-XP-DEDUCTION`, `CORE-STAGE0-RULE-AFFILIATION-BIRTH`, `CORE-STAGE0-RULE-SUBAFFILIATION-OPTIONAL`, `CORE-STAGE0-CHANGE-AFFILIATION-SELECTION`, `CORE-STAGE0-CHANGE-AFFILIATION-XP-DIVISION`, `CORE-STAGE0-CHANGE-AFFILIATION-RESTRICTIONS`

### Page 64 - Capellan Confederation and Draconis Combine

`CORE-STAGE0-AFF-CAPELLAN`, `CORE-STAGE0-SUB-CAPELLAN-COMMONALITY`, `CORE-STAGE0-SUB-CAPELLAN-LIAO-COMMONALITY`, `CORE-STAGE0-SUB-CAPELLAN-SIAN-COMMONALITY`, `CORE-STAGE0-SUB-CAPELLAN-ST-IVES-COMMONALITY`, `CORE-STAGE0-SUB-CAPELLAN-VICTORIA-COMMONALITY`, `CORE-STAGE0-AFF-DRACONIS`, `CORE-STAGE0-SUB-DRACONIS-AZAMI`, `CORE-STAGE0-SUB-DRACONIS-BENJAMIN-DISTRICT`, `CORE-STAGE0-SUB-DRACONIS-DIERON-DISTRICT`, `CORE-STAGE0-SUB-DRACONIS-NEW-SAMARKAND-GALEDON-DISTRICT`, `CORE-STAGE0-SUB-DRACONIS-PESHT-DISTRICT`

### Page 65 - Federated Suns

`CORE-STAGE0-AFF-FEDERATED-SUNS`, `CORE-STAGE0-SUB-FEDERATED-SUNS-CAPELLAN-MARCH`, `CORE-STAGE0-SUB-FEDERATED-SUNS-CRUCIS-MARCH`, `CORE-STAGE0-SUB-FEDERATED-SUNS-DRACONIS-MARCH`, `CORE-STAGE0-SUB-FEDERATED-SUNS-OUTBACK`

### Page 66 - Free Worlds League and Lyran Alliance

`CORE-STAGE0-AFF-FREE-WORLDS-LEAGUE`, `CORE-STAGE0-SUB-FWL-MARIK-COMMONWEALTH`, `CORE-STAGE0-SUB-FWL-PRINCIPALITY-REGULUS`, `CORE-STAGE0-SUB-FWL-DUCHY-ORIENTE`, `CORE-STAGE0-SUB-FWL-DUCHY-ANDURIEN`, `CORE-STAGE0-SUB-FWL-OTHER-WORLDS`, `CORE-STAGE0-AFF-LYRAN-ALLIANCE`, `CORE-STAGE0-SUB-LYRAN-ALARION-PROVINCE`, `CORE-STAGE0-SUB-LYRAN-BOLAN-PROVINCE`, `CORE-STAGE0-SUB-LYRAN-COVENTRY-PROVINCE`, `CORE-STAGE0-SUB-LYRAN-DONEGAL-PROVINCE`, `CORE-STAGE0-SUB-LYRAN-SKYE-PROVINCE`

### Page 67 - Free Rasalhague Republic and Minor Periphery

`CORE-STAGE0-AFF-FREE-RASALHAGUE-REPUBLIC`, `CORE-STAGE0-SUB-FREE-RASALHAGUE-CLAN-WAR-EXPATRIATE`, `CORE-STAGE0-SUB-FREE-RASALHAGUE-GHOST-BEAR-DOMINION`, `CORE-STAGE0-AFF-MINOR-PERIPHERY`, `CORE-STAGE0-SUB-MINOR-PERIPHERY-FIEFDOM-RANDIS`, `CORE-STAGE0-SUB-MINOR-PERIPHERY-FRANKLIN-FIEFS`, `CORE-STAGE0-SUB-MINOR-PERIPHERY-MICA-MAJORITY`, `CORE-STAGE0-SUB-MINOR-PERIPHERY-NIOPS-ASSOCIATION`, `CORE-STAGE0-SUB-MINOR-PERIPHERY-RIM-COLLECTION`

### Page 68 - Major and Deep Periphery

`CORE-STAGE0-AFF-MAJOR-PERIPHERY-STATE`, `CORE-STAGE0-SUB-MAJOR-PERIPHERY-CIRCINUS-FEDERATION`, `CORE-STAGE0-SUB-MAJOR-PERIPHERY-MAGISTRACY-CANOPUS`, `CORE-STAGE0-SUB-MAJOR-PERIPHERY-MARIAN-HEGEMONY`, `CORE-STAGE0-SUB-MAJOR-PERIPHERY-OUTWORLDS-ALLIANCE`, `CORE-STAGE0-SUB-MAJOR-PERIPHERY-TAURIAN-CONCORDAT`, `CORE-STAGE0-AFF-DEEP-PERIPHERY`, `CORE-STAGE0-SUB-DEEP-PERIPHERY-HANSEATIC-LEAGUE`, `CORE-STAGE0-SUB-DEEP-PERIPHERY-CASTILIAN-PRINCIPALITIES`, `CORE-STAGE0-SUB-DEEP-PERIPHERY-UMAYYAD-CALIPHATE`, `CORE-STAGE0-SUB-DEEP-PERIPHERY-JARNFOLK`

### Pages 69-70 - Clan affiliations

`CORE-STAGE0-AFF-INVADING-CLAN`, `CORE-STAGE0-SUB-INVADING-CLAN-DIAMOND-SHARK`, `CORE-STAGE0-SUB-INVADING-CLAN-GHOST-BEAR`, `CORE-STAGE0-SUB-INVADING-CLAN-HELLS-HORSES`, `CORE-STAGE0-SUB-INVADING-CLAN-JADE-FALCON`, `CORE-STAGE0-SUB-INVADING-CLAN-NOVA-CAT`, `CORE-STAGE0-SUB-INVADING-CLAN-SNOW-RAVEN`, `CORE-STAGE0-SUB-INVADING-CLAN-WOLF`, `CORE-STAGE0-AFF-HOMEWORLD-CLAN`, `CORE-STAGE0-SUB-HOMEWORLD-CLAN-BLOOD-SPIRIT`, `CORE-STAGE0-SUB-HOMEWORLD-CLAN-CLOUD-COBRA`, `CORE-STAGE0-SUB-HOMEWORLD-CLAN-COYOTE`, `CORE-STAGE0-SUB-HOMEWORLD-CLAN-FIRE-MANDRILL`, `CORE-STAGE0-SUB-HOMEWORLD-CLAN-GOLIATH-SCORPION`, `CORE-STAGE0-SUB-HOMEWORLD-CLAN-ICE-HELLION`, `CORE-STAGE0-SUB-HOMEWORLD-CLAN-STAR-ADDER`, `CORE-STAGE0-SUB-HOMEWORLD-CLAN-STEEL-VIPER`

### Page 71 - Clan castes

`CORE-STAGE0-CASTE-MECHWARRIOR`, `CORE-STAGE0-CASTE-ELEMENTAL`, `CORE-STAGE0-CASTE-ELEMENTAL-ADVANCED`, `CORE-STAGE0-CASTE-AEROSPACE-OR-PROTOMECH`, `CORE-STAGE0-CASTE-AEROSPACE-NAVAL`, `CORE-STAGE0-CASTE-WARRIOR-OTHER`, `CORE-STAGE0-CASTE-SCIENTIST`, `CORE-STAGE0-CASTE-TECHNICIAN`, `CORE-STAGE0-CASTE-MERCHANT`, `CORE-STAGE0-CASTE-LABORER`, `CORE-STAGE0-CASTE-RULE-AWARD-TABLE-SCOPE`, `CORE-STAGE0-CASTE-RULE-DARK-CASTE`

### Pages 72-74 - Terran, Independent, and orders

`CORE-STAGE0-AFFILIATION-TERRAN`, `CORE-STAGE0-SUBAFFILIATION-TERRAN-BELTER`, `CORE-STAGE0-SUBAFFILIATION-TERRAN-LUNAR-CITIZEN`, `CORE-STAGE0-SUBAFFILIATION-TERRAN-MARTIAN-CITIZEN`, `CORE-STAGE0-SUBAFFILIATION-TERRAN-OUTER-SYSTEM-CITIZEN`, `CORE-STAGE0-SUBAFFILIATION-TERRAN-TERRAN-CITIZEN`, `CORE-STAGE0-SUBAFFILIATION-TERRAN-VENUSIAN-CITIZEN`, `CORE-STAGE0-AFF-INDEPENDENT`, `CORE-STAGE0-SUB-INDEPENDENT-ANTALLOS`, `CORE-STAGE0-SUB-INDEPENDENT-ASTROKASZY`, `CORE-STAGE0-SUB-INDEPENDENT-GENERIC`, `CORE-STAGE0-SUB-INDEPENDENT-MERCENARY`, `CORE-STAGE0-SUB-INDEPENDENT-PIRATE`, `CORE-STAGE0-SUB-INDEPENDENT-SPACER`, `CORE-STAGE0-SUB-INDEPENDENT-TORTUGA`, `CORE-STAGE0-ORDER-COMSTAR-WORD-OF-BLAKE`, `CORE-STAGE0-ORDER-COMSTAR`, `CORE-STAGE0-ORDER-WORD-OF-BLAKE`

## Consolidated category denominators

These counts are reproducible from the 102 itemized source records and the detailed ledgers:

- Universal rule records: 6.
- Parent ordinary affiliation records: 20.
- Sub-affiliation records: 62 ordinary sub-affiliations plus 6 Terran sub-affiliations = 68.
- Clan affiliation identity records: 15 (seven Invading Clan and eight Homeworld Clan identities); these remain distinct from caste records.
- Clan caste and caste-rule records: 12.
- Order affiliation records: 3 (shared package plus two order choices).
- All source records: 102, with no duplicate Source ID.
- Fixed Attribute, Trait, Skill, flexible, conditional, required-choice, restriction, and language-award counts are defined by the award lines in the twelve detailed ledgers; they are not collapsed here because one source record may contain multiple awards and multiple choice packages. Their complete values remain preserved in the linked ledgers.
- Errata corrections represented in this Stage 0 inventory: the Independent/Astrokaszy `Streetwise/Periphery (+10 CP)` to `(+10 XP)` correction is reconciled once. Other errata notes are recorded in the affected page ledgers and are not double-counted as source records.

## Relationship and consistency checks

- Every page 63-74 is represented exactly once in the page table.
- Every source ID extracted from the twelve ledgers is unique: 102 occurrences, 102 unique IDs.
- Parent affiliations, sub-affiliations, Clan caste records, and order records remain distinct.
- Universal rules are not duplicated as affiliation awards.
- ComStar/Word of Blake retains its shared order package and two distinct order choices rather than being flattened into ordinary sub-affiliations.
- Detailed parent relationships, exact signed awards, languages, required choices, restrictions, special rules, footnotes, and cross-references are preserved in the linked ledgers and remain the governing record text.

## Unresolved discrepancies

- No unresolved source conflict was identified during consolidation.
- The Independent/Astrokaszy erratum's `p. 63` reference versus the affected printed page-73 table is preserved as a documented errata-reference discrepancy; it is not silently rewritten or applied twice.

## Completion status

**SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**

The catalog was created from all twelve verified page-specific ledgers. No application implementation comparison was performed or authorized.

## Complete detailed ledger text

The following is the complete text of the twelve page-specific ledgers at the time of consolidation. It is retained here so the consolidated catalog contains the complete records, not only an index.


--- BEGIN page-63-universal-stage0.md ---

# G1i Stage 0-A14 - Universal Stage 0 Rules Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i - Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A14
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 63
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves the universal Stage 0 rules printed on page 63. It does not establish application implementation or authorize application changes.

## Source inventory

The complete page-63 inventory contains six rule records:

1. Universal Experience Points.
2. Stage 0 affiliation definition and selection.
3. Sub-affiliation award and optionality rule.
4. Changing Affiliations birth/final affiliation rule.
5. Affiliation XP division and application rule.
6. Changing Affiliations restriction and exception rule.

These are rule records, not additional application stable IDs.

## Universal Experience Points

### Universal fixed XP deduction

- Source ID: `CORE-STAGE0-UNIVERSAL-XP-DEDUCTION`
- Exact source heading: Universal Experience Points
- Printed page: 63
- Award destination: Starting XP Pool.
- Exact rule: In addition to the Experience Points provided by the affiliation and chosen module, the universal fixed Experience Points mentioned earlier in the chapter must be applied to the character at this stage; these universal XPs automatically subtract **850 XPs** from the character's starting XP Pool.
- Signed amount: **-850 XP from the starting XP Pool**.
- Attribute, Trait, Skill, and language destinations: None are specified on page 63; the page refers back to the universal fixed Experience Points mentioned earlier in the chapter.
- Required choice: None specified on page 63.
- Cross-reference: Printed page 62.
- Applicable errata: No erratum changes this universal deduction.

## Stage 0 affiliation selection

### Affiliation as birth identity

- Source ID: `CORE-STAGE0-RULE-AFFILIATION-BIRTH`
- Exact source heading: Stage 0 Modules: Affiliations
- Printed page: 63
- Rule: A character's affiliation identifies the realm of birth. It is not so much a stage of life as a factor that helps define the character's ethnic and cultural background.
- Required selection: Choosing an affiliation is referred to as Stage 0.
- Module cost: The page states that Stage 0 costs a relatively minimal amount of starting XP but does not specify a universal numeric cost; each affiliation table supplies its own module cost.
- Scope: The affiliations presented reflect the major realms, minor states, Clan and independent factions existing in the BattleTech universe as of the mid-3070s.
- Universal award: None beyond the separate universal XP rule above.
- Applicable errata: No erratum changes this definition or selection rule.

### Sub-affiliation awards and optional selection

- Source ID: `CORE-STAGE0-RULE-SUBAFFILIATION-OPTIONAL`
- Exact source heading: Sub-Affiliations
- Printed page: 63
- Rule: Each of the major affiliations presented in the Stage 0 tables includes sub-affiliations representing regional or cultural sub-sects of the main affiliation and a more specific heritage and political inclination.
- Award treatment: Sub-affiliation XPs are awarded **in addition to** those associated with the main affiliation.
- Cost treatment: Sub-affiliation XPs are accounted for in the module's total cost, so it is most efficient for a character to choose both a primary affiliation and a sub-affiliation for the Stage 0 module.
- Optionality: Sub-affiliations are ultimately optional. The gamemaster may permit a character to take a “vanilla” approach and ignore the sub-affiliation XPs.
- Cost exception: Ignoring the sub-affiliation does not affect the module's XP cost and therefore wastes potential character experience.
- Required choice: The source does not require a sub-affiliation for every Stage 0 selection; the primary affiliation remains the Stage 0 selection and the sub-affiliation is optional under the stated gamemaster permission.
- Applicable errata: No erratum changes this general sub-affiliation rule.

## Changing Affiliations

### Birth and final affiliation selections

- Source ID: `CORE-STAGE0-CHANGE-AFFILIATION-SELECTION`
- Exact source heading: Changing Affiliations
- Printed page: 63
- Default assumption: Most affiliations are presented with the presumption that the character retains his or her ethnic allegiance into adulthood.
- Triggering circumstances: Capture by a rival Clan or defection to another state are examples of circumstances that can prompt a change in the character's final allegiance.
- Required selections for a changed affiliation: A player wishing to incorporate such a change selects two affiliations rather than one.
- First affiliation: Must be the affiliation into which the character was born.
- Second affiliation: Must be the affiliation with which the character ends the creation process.
- Birth/final distinction: The first is the birth affiliation; the second is the final affiliation.
- Applicable errata: No erratum changes these selection requirements.

### XP division and application

- Source ID: `CORE-STAGE0-CHANGE-AFFILIATION-XP-DIVISION`
- Exact source heading: Changing Affiliations
- Printed page: 63
- XP treatment: Divide **all XP values**, including the purchase XP costs, for both affiliations by 2.
- Rounding: Round any half points down.
- Application: Apply the resulting XP values for both affiliations to all relevant Attributes, Traits, and Skills.
- Scope: The rule applies to both the birth affiliation and the final affiliation.
- Language implications: Page 63 does not state a separate language exception; language awards are part of the relevant affiliation awards and are subject to the same source-defined XP treatment where applicable.
- Trait implications: Trait awards are part of the relevant affiliation awards and are subject to the same division and rounding rule.
- Applicable errata: No erratum changes this division, rounding, or application rule.

### Restrictions and final-affiliation precedence

- Source ID: `CORE-STAGE0-CHANGE-AFFILIATION-RESTRICTIONS`
- Exact source heading: Changing Affiliations
- Printed page: 63
- Restriction treatment: If either affiliation has restrictions noted in its affiliation entry, only the restrictions of the **final affiliation** apply.
- Exception: This final-affiliation restriction rule is the stated exception to carrying both affiliations' restrictions; it does not erase the XP awards or purchase costs of either affiliation.
- Cross-reference: The relevant affiliation pages supply the individual restrictions. The ComStar/Word of Blake page-74 entry separately states that choosing that order affiliation does not reduce the XP costs or effects of the birth affiliation; page 74 is preserved as a cross-reference and is not rewritten here.
- Applicable errata: No erratum changes this final-affiliation restriction precedence.

## Universal award ledger summary

| Source ID | Destination | Exact signed value | Condition |
| --- | --- | --- | --- |
| `CORE-STAGE0-UNIVERSAL-XP-DEDUCTION` | Starting XP Pool | -850 XP | Applied at Stage 0 in addition to affiliation and chosen-module XP. |

No additional universal Attribute, Trait, Skill, language, flexible-XP, or module-cost value is printed on page 63. Affiliation-specific values remain in the individual page 64-74 ledgers.

## Errata reconciliation

- No v4.0 erratum changes the universal -850 XP deduction, Stage 0 birth-affiliation definition, optional sub-affiliation rule, or Changing Affiliations XP division, rounding, application, or restriction rule.
- The v4.0 errata contains an Independent/Astrokaszy correction identified as “Independent (p. 63), Under Sub-Affiliations, Astrokaszy”: `Streetwise/Periphery (+10 CP)` changes to `Streetwise/Periphery (+10 XP)`. This is an Independent sub-affiliation correction, not a Universal Stage 0 rule, and is already preserved in `page-73-independent.md`; it is not applied again here.
- The errata also contains a separate Notes (p. 63) extreme-gravity insertion. Page 63 itself does not print an extreme-gravity rule; the completed Independent ledger preserves the related Spacer cross-reference to printed pages 237-238. No universal Stage 0 award is changed by that insertion.
- The errata's page-63 reference for the Independent/Astrokaszy correction is preserved exactly even though the affected affiliation table is printed on page 73 in the corrected printing.

## Source verification notes

- The exact local source files and previously verified SHA-256 identities were used:
  - Corrected Third Printing: `32D9B06655D1A0A108CD7F6B6ED9EFDA41A9673671E9ADEB285A02A5B769EF37`.
  - v4.0 Errata: `998141687F3F71F8347DA46FC4C2A87C9595CF37B75CAFDB0EEBB88301E453EF`.
- The authoritative PDF was rendered with Poppler at 220 DPI using PDF page 65 for printed page 63 and visually inspected.
- The complete page-63 text blocks, Universal Experience Points, Changing Affiliations, Stage 0 Modules heading, affiliation definition, sub-affiliation rule, and adjacent cross-references match the ledger.
- Status: **SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**.


--- END page-63-universal-stage0.md ---


--- BEGIN page-64-capellan-draconis.md ---

# G1i Stage 0-A3 — Page 64 Capellan and Draconis Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i — Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A3
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 64
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED**
- Implementation assessment status: **NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves published Page 64 rules. It does not establish application implementation or authorize application changes.

## Capellan Confederation (House Liao)

- Source ID: `CORE-STAGE0-AFF-CAPELLAN`
- Page: 64; module cost: 150 XP
- Primary language: Mandarin Chinese
- Secondary languages: Russian, Cantonese, Vietnamese, English
- Attributes: WIL +50; Exceptional Attribute/EDG +100
- Traits: Compulsion/Paranoia −100
- Skills: Language/Any Capellan Secondary +10; Protocol/Capellan +10; Martial Arts +5
- Flexible XP: None
- Choices/conditional awards: None.
- Restrictions: Child labor is legal. Civilian Job may replace a Stage 2 module and advances the character immediately to age 18. Military School in Stage 2 and any Stage 3 module require Citizenship.
- Errata: No applicable v4.0 correction.

### Capellan Commonality

- Source ID: `CORE-STAGE0-SUB-CAPELLAN-COMMONALITY`; parent: Capellan Confederation; page: 64
- Attributes: EDG +50
- Traits: Wealth +15
- Skills: Language/Any FedSuns +5; Protocol/FedSuns +5
- Flexible XP: None. Choices, restrictions, and additional footnotes: None.
- Errata: None applicable.

### Liao Commonality

- Source ID: `CORE-STAGE0-SUB-CAPELLAN-LIAO-COMMONALITY`; parent: Capellan Confederation; page: 64
- Attributes: INT +50
- Traits: Reputation −25
- Skills: Language/Choose Any Capellan or Lyran +15; Protocol/Choose either FedSuns or Lyran +10; Art/Any +10; Martial Arts +15
- Flexible XP: None.
- Choices: one language destination, Capellan or Lyran; one Protocol destination, FedSuns or Lyran.
- Restrictions and footnotes: None additional. Errata: None applicable.

### Sian Commonality

- Source ID: `CORE-STAGE0-SUB-CAPELLAN-SIAN-COMMONALITY`; parent: Capellan Confederation; page: 64
- Attributes: WIL +75
- Traits: Compulsion/Hatred of Federated Suns −135; Citizenship +50; Connections +50
- Skills: Interest/Capellan History +10; Protocol/Capellan +15; Language/Any Capellan Secondary +10
- Flexible XP: None. Choice: Language/Any Capellan Secondary. Restrictions and footnotes: None additional. Errata: None applicable.

### St. Ives Commonality

- Source ID: `CORE-STAGE0-SUB-CAPELLAN-ST-IVES-COMMONALITY`; parent: Capellan Confederation; page: 64
- Attributes: WIL +50; EDG +50
- Traits: Reputation −100; Wealth +50
- Skills: Language/Any FedSuns +15; Protocol/Capellan −15; Protocol/FedSuns +10; Art/Any +5; Martial Arts +10
- Flexible XP: None. Choice: Language/Any FedSuns. Restrictions and footnotes: None additional. Errata: None applicable.

### Victoria Commonality

- Source ID: `CORE-STAGE0-SUB-CAPELLAN-VICTORIA-COMMONALITY`; parent: Capellan Confederation; page: 64
- Attributes: WIL +35
- Traits: Connections +50; Wealth −50
- Skills: Language/Any +15; Negotiation +10; Martial Arts +15
- Flexible XP: None. Choice: Language/Any. Restrictions and footnotes: None additional. Errata: None applicable.

## Draconis Combine (House Kurita)

- Source ID: `CORE-STAGE0-AFF-DRACONIS`
- Page: 64; module cost: 150 XP
- Primary language: Japanese
- Secondary languages: Arabic, English, Swedanese
- Attributes: WIL +50
- Traits: Compulsion/Xenophobia −100; Wealth −50
- Skills: Arts/Oral Tradition +15; Martial Arts +10; Protocol/Combine +15
- Flexible XP: +10 to one of Archery, Melee Weapons, or Thrown Weapons/Blade
- Choice: Pain Resistance or Combat Sense +100
- Restrictions: Child labor is legal. Civilian Job may replace a Stage 2 module and advances the character immediately to age 18.
- Errata: No applicable v4.0 correction.

### Azami

- Source ID: `CORE-STAGE0-SUB-DRACONIS-AZAMI`; parent: Draconis Combine; page: 64
- Attributes: WIL +190
- Traits: Compulsion/Xenophobia −50; Equipped −50; Wealth −25
- Skills: Language/Arabic +10; Language/Japanese −10; Martial Arts +10; Melee Weapons +10; Animal Handling/Riding +5; Survival/Any +10
- Flexible XP, choices, restrictions, and additional footnotes: None. Errata: None applicable.

### Benjamin District

- Source ID: `CORE-STAGE0-SUB-DRACONIS-BENJAMIN-DISTRICT`; parent: Draconis Combine; page: 64
- Attributes: None
- Traits: Compulsion/Paranoid of Combine Government −50; Connections +50; Patient +25; Wealth +35
- Skills: Arts/Oral Tradition +5; Martial Arts +10; Protocol/Combine +15; Streetwise/Combine +10
- Flexible XP, choices, restrictions, and additional footnotes: None. Errata: None applicable.

### Dieron District

- Source ID: `CORE-STAGE0-SUB-DRACONIS-DIERON-DISTRICT`; parent: Draconis Combine; page: 64
- Attributes: INT +50; WIL −50
- Traits: Compulsion/Xenophobia +50; Connections +60; Enemy −100; Wealth +50
- Skills: Interest/Star League History +5; Language/Any +15; Negotiation +5; Art/Any +15
- Flexible XP, choices, restrictions, and additional footnotes: None. Errata: None applicable.

### New Samarkand (Galedon) District

- Source ID: `CORE-STAGE0-SUB-DRACONIS-NEW-SAMARKAND-GALEDON-DISTRICT`; parent: Draconis Combine; page: 64
- Attributes: WIL +100; CHA −50
- Traits: Compulsion/Hatred of Federated Suns −50; Connections +50
- Skills: Interest/Combine History +10; Melee Weapons +15; Negotiation +5; Protocol/Combine +10; Streetwise/Combine +10
- Flexible XP, choices, restrictions, and additional footnotes: None. The published “Galedon” designation is preserved. Errata: None applicable.

### Pesht District

- Source ID: `CORE-STAGE0-SUB-DRACONIS-PESHT-DISTRICT`; parent: Draconis Combine; page: 64
- Attributes: WIL +100; EDG −25
- Traits: Compulsion/Hatred of Clans −100; Connections +20; Wealth +50
- Skills: Martial Arts +10; Melee Weapons +15; Protocol/Combine +20; Streetwise/Combine +10
- Flexible XP, choices, restrictions, and additional footnotes: None. Errata: None applicable.

## Counts and reconciliation

- Parent affiliations: 2
- Capellan sub-affiliations: 5
- Draconis sub-affiliations: 5
- Total sub-affiliations: 10
- Total source records: 12
- Parent flexible-XP packages: 2
- Sub-affiliation flexible-XP packages: 0
- Parent conditional choices: 1
- Sub-affiliation conditional choices: 0

The complete v4.0 Errata contains no correction affecting printed page 64. The Independent/Astrokaszy correction belongs to printed page 63 and is not applied here.

## Source status and implementation boundary

**SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**

The rendered corrected-printing page was inspected directly. Positive and negative XP signs, trait subjects, Skill subjects, language destinations, choices, costs, footnotes, and parent/sub-affiliation distinctions were checked against the Page 64 ledger. This document is a source preservation record only; application catalogs, transactions, validation, persistence, and UI remain unassessed.

The next authorized comparison may map these twelve source records to application records without changing the published values or these source inventory IDs.

--- END page-64-capellan-draconis.md ---


--- BEGIN page-65-federated-suns.md ---

# G1i Stage 0-A4 — Federated Suns Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i — Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A4
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 65
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED**
- Implementation assessment status: **NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves the published Federated Suns Page 65 rules. It does not establish application implementation or authorize application changes.

## Federated Suns (House Davion)

- Source ID: `CORE-STAGE0-AFF-FEDERATED-SUNS`
- Exact published name: Federated Suns (House Davion)
- Printed page: 65
- Module cost: 150 XP
- Primary language: English
- Secondary languages: French, German, Hindi, Russian
- Attribute awards: None in the parent fixed-award row.
- Trait awards: Choose Natural Aptitude/Protocol or Natural Aptitude/Strategy +100 XP.
- Skill awards: Protocol/FedSuns +10 XP
- Flexible XP: None
- Required choice: Natural Aptitude/Protocol or Natural Aptitude/Strategy.
- Conditional award: The Natural Aptitude choice requires a minimum INT score of 4 at the end of character creation.
- Prerequisites: None stated for the parent affiliation beyond the conditional INT requirement attached to the Natural Aptitude choice.
- Restrictions and special rules: The parent record has no additional restriction beyond the Natural Aptitude/INT 4 note.
- Footnotes: A minimum INT score of 4 is required for any Federated Suns character selecting Natural Aptitude/Protocol or Natural Aptitude/Strategy in Stage 0.
- Errata status: No applicable v4.0 errata correction.

### Capellan March

- Source ID: `CORE-STAGE0-SUB-FEDERATED-SUNS-CAPELLAN-MARCH`
- Parent: Federated Suns (House Davion)
- Printed page: 65
- Attribute awards: WIL +40 XP
- Trait awards: Connections +25 XP; Compulsion/Hatred of Capellan Confederation −50 XP
- Skill awards: Protocol/FedSuns +10 XP; Interest/FedSuns History +10 XP; Language/Choose one from Cantonese, German, Mandarin, Spanish or Russian +5 XP
- Flexible XP: None
- Required choices: Choose one language from Cantonese, German, Mandarin, Spanish, or Russian.
- Conditional awards: None additional.
- Language choices: The listed five-language choice is the published destination.
- Restrictions and footnotes: None additional on this row.
- Errata status: No applicable v4.0 errata correction.

### Crucis March

- Source ID: `CORE-STAGE0-SUB-FEDERATED-SUNS-CRUCIS-MARCH`
- Parent: Federated Suns (House Davion)
- Printed page: 65
- Attribute awards: WIL +50 XP; EDG −50 XP
- Trait awards: None.
- Skill awards: Art/Any +10 XP; Interest/FedSuns History +15 XP; Protocol/FedSuns +15 XP
- Flexible XP: None
- Required choices: Art/Any is an open Art destination as published.
- Conditional awards: None additional.
- Restrictions and footnotes: None additional on this row.
- Errata status: No applicable v4.0 errata correction.

### Draconis March

- Source ID: `CORE-STAGE0-SUB-FEDERATED-SUNS-DRACONIS-MARCH`
- Parent: Federated Suns (House Davion)
- Printed page: 65
- Attribute awards: EDG +25 XP
- Trait awards: Connections +20 XP; Compulsion/Hatred of Draconis Combine −30 XP
- Skill awards: Art/Any +10 XP; Interest/FedSuns History +10 XP; Protocol/FedSuns +5 XP
- Flexible XP: None
- Required choices: Art/Any is an open Art destination as published.
- Conditional awards: None additional.
- Restrictions and footnotes: None additional on this row.
- Errata status: No applicable v4.0 errata correction.

### Outback

- Source ID: `CORE-STAGE0-SUB-FEDERATED-SUNS-OUTBACK`
- Parent: Federated Suns (House Davion)
- Printed page: 65
- Attribute awards: STR +50 XP; BOD +150 XP; WIL +100 XP; INT −100 XP
- Trait awards: Illiterate −50 XP; Reputation −50 XP; Wealth −100 XP
- Skill awards: Art/Any or Interest/Any +10 XP; Streetwise/FedSuns +10 XP; Survival/Any +20 XP
- Flexible XP: None
- Required choices: Choose Art/Any or Interest/Any for the +10 XP award.
- Conditional awards: None additional.
- Restrictions and footnotes: None additional on this row.
- Errata status: No applicable v4.0 errata correction.

## Counts and reconciliation

- Parent affiliations: 1
- Federated Suns sub-affiliations: 4
- Total source records: 5
- Parent flexible-XP packages: 0
- Sub-affiliation flexible-XP packages: 0
- Parent conditional choices: 1
- Sub-affiliation conditional choices: 2
- Additional conditional awards: 1 (INT 4 requirement for the parent Natural Aptitude choice)

The complete v4.0 Errata contains no correction affecting the Federated Suns Stage 0 entry on printed page 65. No errata value is applied to this ledger.

## Source verification notes

The rendered corrected-printing page was inspected directly at high resolution. The parent and all four sub-affiliation rows were checked for exact names, signed XP values, languages, choices, and the page footnote. The adjacent worked example confirms the Crucis March record and does not add a separate source entry.

## Implementation status

**SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**

This ledger preserves published source material only. It does not establish that the Federated Suns parent or any sub-affiliation is implemented correctly or completely in the application. Application catalogs, transactions, validation, persistence, and UI remain outside this document's authorization.

The next authorized comparison may map these five source records to application records without changing the published values or these source inventory IDs.

--- END page-65-federated-suns.md ---


--- BEGIN page-66-fwl-lyran.md ---

# G1i Stage 0-A5 — Free Worlds League and Lyran Alliance Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i — Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A5
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 66
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED**
- Implementation assessment status: **NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves the published Page 66 rules. It does not establish application implementation or authorize application changes.

## Free Worlds League (House Marik)

- Source ID: `CORE-STAGE0-AFF-FREE-WORLDS-LEAGUE`
- Printed page: 66; module cost: 150 XP
- Primary language: English
- Secondary languages: Greek, Hindi, Italian, Mandarin, Mongolian, Romanian, Slovak, Spanish, Urdu
- Attribute awards: None in the parent fixed-award row.
- Trait awards: None in the parent fixed-award row.
- Skill awards: Language/Any Secondary +15 XP; Art/Any +10 XP
- Flexible XP: None
- Choices, conditional awards, prerequisites, restrictions, and special rules: None in the parent record.
- Errata: No applicable v4.0 correction.

### Marik Commonwealth

- Source ID: `CORE-STAGE0-SUB-FWL-MARIK-COMMONWEALTH`
- Parent: Free Worlds League (House Marik); page: 66
- Attributes: None
- Traits: Wealth +100; Equipped +100; Reputation −100
- Skills: Appraisal +5; Negotiation +10; Protocol/Free Worlds +10
- Flexible XP: None. Choices, restrictions, and additional footnotes: None.
- Errata: None applicable.

### Principality of Regulus

- Source ID: `CORE-STAGE0-SUB-FWL-PRINCIPALITY-REGULUS`
- Parent: Free Worlds League (House Marik); page: 66
- Attributes: WIL +75
- Traits: Gregarious +75; Compulsion/Atrean Opponent −50; Reputation −50
- Skills: Interest/Regulan History +20; Negotiation +25; Perception +15; Protocol/Free Worlds +15
- Flexible XP: None. Choices, restrictions, and additional footnotes: None.
- Errata: None applicable.

### Duchy of Oriente

- Source ID: `CORE-STAGE0-SUB-FWL-DUCHY-ORIENTE`
- Parent: Free Worlds League (House Marik); page: 66
- Attributes: None
- Traits: Reputation +100
- Skills: Appraisal +5; Negotiation +15; Technician/Any +5
- Flexible XP: None. Choices, restrictions, and additional footnotes: None.
- Errata: None applicable.

### Duchy of Andurien

- Source ID: `CORE-STAGE0-SUB-FWL-DUCHY-ANDURIEN`
- Parent: Free Worlds League (House Marik); page: 66
- Attributes: WIL +50
- Traits: Combat Sense +215; Compulsion/Hatred of House Liao −100; Compulsion/Atrean Opponent −50; Reputation −30
- Skills: Negotiation +15; Perception +10; Protocol/Free Worlds +15
- Flexible XP: None. Choices, restrictions, and additional footnotes: None.
- Errata: None applicable.

### Other FWL Worlds

- Source ID: `CORE-STAGE0-SUB-FWL-OTHER-WORLDS`
- Parent: Free Worlds League (House Marik); page: 66
- Attributes: None
- Traits: Any one +35
- Skills: Appraisal +15; Language/Any +20; Protocol/Free Worlds +10; any two other Skills +10 each
- Flexible XP: +25 XP to any one Attribute, Trait, or Language Skill.
- Required choices: Choose one Trait for the +35 award; choose any two other Skills for +10 each; choose one Attribute, Trait, or Language Skill for the +25 award.
- Restrictions and footnotes: None additional on this row.
- Errata: None applicable.

### Free Worlds League note

Free Worlds characters who receive the Implant/Prosthetics Trait automatically receive Reputation −100 XP as well.

## Lyran Alliance (House Steiner)

- Source ID: `CORE-STAGE0-AFF-LYRAN-ALLIANCE`
- Printed page: 66; module cost: 150 XP
- Primary language: German
- Secondary languages: English, Italian, Scots Gaelic, Swedish
- Attribute awards: WIL −50; EDG −50
- Trait awards: Equipped +100; Extra Income +50; Wealth +100; choose either Combat Paralysis or Glass Jaw −100
- Skill awards: Negotiation +15; Appraisal +10; Protocol/Lyran +15
- Flexible XP: None
- Required choice: Combat Paralysis or Glass Jaw.
- Conditional awards, prerequisites, restrictions, and special rules: None additional in the parent record.
- Errata: No applicable v4.0 correction.

### Alarion Province

- Source ID: `CORE-STAGE0-SUB-LYRAN-ALARION-PROVINCE`
- Parent: Lyran Alliance (House Steiner); page: 66
- Attributes: CHA −50
- Traits: Wealth +70
- Skills: Administration +10; Interest/Any +10; Language/Any +10; Negotiation +10
- Flexible XP: None. Choices, restrictions, and additional footnotes: None.
- Errata: None applicable.

### Bolan Province

- Source ID: `CORE-STAGE0-SUB-LYRAN-BOLAN-PROVINCE`
- Parent: Lyran Alliance (House Steiner); page: 66
- Attributes: None
- Traits: Compulsion/Hatred of House Marik −50; Connections +50; Wealth +25
- Skills: Administration +5; Negotiation +15; Protocol/Lyran +10; Streetwise/Lyran +5
- Flexible XP: None. Choices, restrictions, and additional footnotes: None.
- Errata: None applicable.

### Coventry Province

- Source ID: `CORE-STAGE0-SUB-LYRAN-COVENTRY-PROVINCE`
- Parent: Lyran Alliance (House Steiner); page: 66
- Attributes: WIL +100
- Traits: Compulsion/Hatred of Clans −95; Wealth +25
- Skills: Administration +10; Negotiation +10; Protocol/Lyran +10
- Flexible XP: None. Choices, restrictions, and additional footnotes: None.
- Errata: None applicable.

### Donegal Province

- Source ID: `CORE-STAGE0-SUB-LYRAN-DONEGAL-PROVINCE`
- Parent: Lyran Alliance (House Steiner); page: 66
- Attributes: WIL +50
- Traits: Compulsion/Greedy −75; Connections +50; Reputation −50; Wealth +50
- Skills: Appraisal +10; Negotiation +10; Protocol/Lyran +15
- Flexible XP: None. Choices, restrictions, and additional footnotes: None.
- Errata: None applicable.

### Skye Province

- Source ID: `CORE-STAGE0-SUB-LYRAN-SKYE-PROVINCE`
- Parent: Lyran Alliance (House Steiner); page: 66
- Attributes: WIL +100
- Traits: Connections +85; Reputation −150
- Skills: Language/Scots Gaelic +10; Negotiation +15; Protocol/Lyran −15; Streetwise/Lyran +15
- Flexible XP: None. Choices, restrictions, and additional footnotes: None.
- Errata: None applicable.

## Counts and reconciliation

- Parent affiliations: 2
- Free Worlds League sub-affiliations: 5
- Lyran Alliance sub-affiliations: 5
- Total sub-affiliations: 10
- Total source records: 12
- Parent flexible-XP packages: 0
- Sub-affiliation flexible-XP packages: 1
- Parent conditional choices: 1
- Sub-affiliation conditional choices: 3 (Other FWL Worlds Trait, two Skills, and flexible destination)
- Lyran parent choice: 1 (Combat Paralysis or Glass Jaw)

The complete v4.0 Errata contains no correction affecting the Free Worlds League or Lyran Alliance Stage 0 entries on printed page 66. No errata value is applied to this ledger.

## Source verification notes

The rendered corrected-printing page was inspected directly at high resolution. Both parent tables and all ten sub-affiliation rows were checked for exact names, signed XP values, languages, choices, and the Free Worlds Implant/Prosthetics footnote.

## Implementation status

**SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**

This ledger preserves published source material only. It does not establish that the Free Worlds League, Lyran Alliance, or any sub-affiliation is implemented correctly or completely in the application. Application catalogs, transactions, validation, persistence, and UI remain outside this document's authorization.

The next authorized comparison may map these twelve source records to application records without changing the published values or these source inventory IDs.

--- END page-66-fwl-lyran.md ---


--- BEGIN page-67-rasalhague-minor-periphery.md ---

# G1i Stage 0-A6 — Free Rasalhague Republic and Minor Periphery Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i — Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A6
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 67
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED**
- Implementation assessment status: **NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves the published Page 67 rules. It does not establish application implementation or authorize application changes.

## Free Rasalhague Republic

- Source ID: `CORE-STAGE0-AFF-FREE-RASALHAGUE-REPUBLIC`
- Exact published name: Free Rasalhague Republic
- Printed page: 67; module cost: 100 XP
- Primary language: Swedish
- Secondary languages: English, Japanese, Swedanese, German
- Attribute awards: WIL +25; EDG −25
- Trait awards: None in the parent fixed-award row.
- Skill awards: Negotiation +15; Interest/Any +10
- Flexible XP: None
- Choices, conditional awards, and prerequisites: None in the parent record.
- Restrictions and special rules: Rasalhague-born characters who join a mercenary command automatically receive Reputation −100. Characters with the Ghost Bear sub-affiliation reflect native non-Clan Rasalhagians within the Ghost Bear Dominion and may take only those Stage 1 and Stage 2 modules permitted to Clan freeborns.
- Errata: No applicable v4.0 correction.

### Clan War Expatriate

- Source ID: `CORE-STAGE0-SUB-FREE-RASALHAGUE-CLAN-WAR-EXPATRIATE`
- Parent: Free Rasalhague Republic; printed page: 67
- Attributes: WIL +125; EDG +100
- Traits: Compulsion/Hatred of Clans −150; Compulsion/Hatred of Draconis −50
- Skills: Language/Choose Any Lyran or Draconis +15; Martial Arts +10; Protocol/Choose either Lyran or Draconis +10; Small Arms +15
- Flexible XP: None
- Required choices: Choose one language destination, Lyran or Draconis; choose one Protocol destination, Lyran or Draconis.
- Conditional awards, restrictions, and additional footnotes: None on this row beyond the parent notes.
- Errata: None applicable.

### Ghost Bear Dominion

- Source ID: `CORE-STAGE0-SUB-FREE-RASALHAGUE-GHOST-BEAR-DOMINION`
- Parent: Free Rasalhague Republic; printed page: 67
- Attributes: None
- Traits: Equipped +50; Introvert −25; Reputation −25
- Skills: Protocol/Clan (Ghost Bear) +20; Interest/Any +10; Interest/Clan Remembrance +10; Negotiation +10; Martial Arts +15; Melee Weapons +15
- Flexible XP: None
- Choices, restrictions, and additional footnotes: None on this row beyond the parent Ghost Bear Dominion limitation.
- Errata: None applicable.

## Minor Periphery

- Source ID: `CORE-STAGE0-AFF-MINOR-PERIPHERY`
- Exact published name: Minor Periphery
- Printed page: 67; module cost: 75 XP
- Primary language: English
- Secondary language: Any
- Attribute awards: None in the parent fixed-award row.
- Trait awards: Equipped −150
- Skill awards: Perception +15; Survival/Any +20
- Flexible XP: +25 XP each to any three Attributes or Traits, or combination thereof.
- Choices, conditional awards, and prerequisites: None in the parent record.
- Restrictions and special rules: Unless otherwise specified, characters from any listed Minor Periphery realm may not take Preparatory School or Military School in Stage 2, University or Military Academy in Stage 3, or Postgraduate Study in Stage 4.
- Errata: No applicable v4.0 correction.

### Fiefdom of Randis

- Source ID: `CORE-STAGE0-SUB-MINOR-PERIPHERY-FIEFDOM-RANDIS`
- Parent: Minor Periphery; printed page: 67
- Attributes: BOD +125; EDG +50
- Traits: Illiterate −75; Wealth −50
- Skills: Martial Arts +10; Melee Weapons +10; Negotiation +10; Streetwise/Periphery +15; Survival/Any +20
- Flexible XP: None
- Choices, restrictions, and additional footnotes: None on this row beyond the parent restrictions.
- Errata: None applicable.

### Franklin Fiefs

- Source ID: `CORE-STAGE0-SUB-MINOR-PERIPHERY-FRANKLIN-FIEFS`
- Parent: Minor Periphery; printed page: 67
- Attributes: BOD +150; INT −100; WIL +50
- Traits: Equipped −60; Illiterate −90; Toughness +100
- Skills: Martial Arts +15; MedTech/Any +10; Protocol/Novo Franklin +10; Streetwise/Periphery +10; Survival/Any +10
- Flexible XP: None
- Required choice: Choose one of Archery, Melee Weapons, or Negotiation for +10 XP.
- Restrictions: Characters with the Franklin Fiefs sub-affiliation who do not purchase the Citizen Trait may not receive the Title or Property Traits and may not undergo military training other than Basic Training, Infantry, or Cavalry.
- Additional footnotes: The source uses the Skill destination `Protocol/Novo Franklin`.
- Errata: None applicable.

### Mica Majority

- Source ID: `CORE-STAGE0-SUB-MINOR-PERIPHERY-MICA-MAJORITY`
- Parent: Minor Periphery; printed page: 67
- Attributes: BOD +100; RFL +100; EDG −100
- Traits: Equipped −25; Toughness +100; Wealth −100
- Skills: Career/Mining +10; Language/Japanese +10; Negotiation +10; Survival/Arctic +10
- Flexible XP: None
- Choices, restrictions, and additional footnotes: Characters from the Mica Majority may not take Nobility Life Modules in Stage 1 or 2, nor may they hold titles within their respective realms.
- Errata: None applicable.

### Niops Association

- Source ID: `CORE-STAGE0-SUB-MINOR-PERIPHERY-NIOPS-ASSOCIATION`
- Parent: Minor Periphery; printed page: 67
- Attributes: INT +125; WIL −110
- Traits: Equipped +200; Introvert −125
- Skills: Interest/Any +10; Technician/Any +15
- Flexible XP: None
- Choices, restrictions, and additional footnotes: None on this row beyond the parent restrictions.
- Errata: None applicable.

### Rim Collection

- Source ID: `CORE-STAGE0-SUB-MINOR-PERIPHERY-RIM-COLLECTION`
- Parent: Minor Periphery; printed page: 67
- Attributes: CHA −50; EDG +100
- Traits: Fit +75; Wealth −50
- Skills: Negotiation +15; Small Arms +5; choose two of Animal Handling/Any, Archery, Martial Arts, Melee Weapons, Streetwise/Rim Collection, or Survival/Any +10 each
- Flexible XP: None
- Required choice: Choose two listed Skills for +10 XP each.
- Restrictions: Characters from the Rim Collection may not take Nobility Life Modules in Stage 1 or 2, nor may they hold titles within their respective realms.
- Conditional awards and additional footnotes: None beyond the parent restrictions.
- Errata: None applicable.

## Counts and reconciliation

- Parent affiliations: 2
- Free Rasalhague Republic sub-affiliations: 2
- Minor Periphery sub-affiliations: 5
- Total sub-affiliations: 7
- Total source records: 9
- Parent flexible-XP packages: 1
- Sub-affiliation flexible-XP packages: 0
- Parent conditional choices: 0
- Sub-affiliation conditional choices: 3 (Clan War Expatriate language and Protocol; Franklin Fiefs Skill; Rim Collection two Skills)

The complete v4.0 Errata contains no correction affecting the Free Rasalhague Republic or Minor Periphery entries on printed page 67. No errata value is applied to this ledger.

## Source verification notes

The rendered corrected-printing page was inspected directly at high resolution, with the Rasalhague and Minor Periphery columns read independently. The rendered page is authoritative where it differs from the prior A2 transcription: Franklin Fiefs uses MedTech/Any and Protocol/Novo Franklin, its choice is Archery, Melee Weapons, or Negotiation, Ghost Bear Dominion includes Reputation −25, and Rim Collection includes CHA −50.

## Implementation status

**SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**

This ledger preserves published source material only. It does not establish that either parent affiliation or any sub-affiliation is implemented correctly or completely in the application. Application catalogs, transactions, validation, persistence, and UI remain outside this document's authorization.

The next authorized comparison may map these nine source records to application records without changing the published values or these source inventory IDs.

--- END page-67-rasalhague-minor-periphery.md ---


--- BEGIN page-68-major-deep-periphery.md ---

# G1i Stage 0-A7 — Major Periphery State and Deep Periphery Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i — Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A7
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 68
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED**
- Implementation assessment status: **NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves the published Page 68 rules. It does not establish application implementation or authorize application changes.

## Major Periphery State

- Source ID: `CORE-STAGE0-AFF-MAJOR-PERIPHERY-STATE`
- Exact published name: Major Periphery State
- Printed page: 68; module cost: 100 XP
- Primary language: English
- Secondary language: See sub-affiliation
- Attribute awards: None in the parent fixed-award row.
- Trait awards: Equipped −50
- Skill awards: None in the parent fixed-award row.
- Flexible XP: +15 XP each to any three Attributes, Traits, Skills, or a combination thereof.
- Choices, conditional awards, and prerequisites: None in the parent record.
- Restrictions and special rules: The parent flexible award is available to the listed Attributes, Traits, and Skills as one combined choice domain.
- Errata: No applicable v4.0 correction.

### Circinus Federation

- Source ID: `CORE-STAGE0-SUB-MAJOR-PERIPHERY-CIRCINUS-FEDERATION`
- Parent: Major Periphery State; printed page: 68
- Languages: Secondary languages German and Spanish
- Attributes: STR +100; BOD +75; INT −100; WIL +70
- Traits: Illiterate −75; Reputation −200; Toughness +50
- Skills: Choose three of Animal Handling/Any, Martial Arts, MedTech/Any, Small Arms, Streetwise/Periphery, Survival/Any, or Tracking/Any for +20 XP each
- Flexible XP: None.
- Required choice: Three Skills from the published list.
- Restrictions, prerequisites, and footnotes: None additional on this row.
- Errata: None applicable.

### Magistracy of Canopus

- Source ID: `CORE-STAGE0-SUB-MAJOR-PERIPHERY-MAGISTRACY-CANOPUS`
- Parent: Major Periphery State; printed page: 68
- Languages: Secondary languages Greek, Romanian, Spanish, and Urdu
- Attributes: CHA +100; EDG +50
- Traits: Gregarious +50; Reputation −125; Wealth +25
- Skills: Streetwise/Magistracy +15; choose Acting or MedTech/General +15
- Flexible XP: None.
- Required choice: Acting or MedTech/General for +15 XP.
- Special rule: The Magistracy of Canopus sub-affiliation includes the Fronc Reaches.
- Restrictions and footnotes: None additional on this row.
- Errata: None applicable.

### Marian Hegemony

- Source ID: `CORE-STAGE0-SUB-MAJOR-PERIPHERY-MARIAN-HEGEMONY`
- Parent: Major Periphery State; printed page: 68
- Primary language: Latin
- Secondary languages: French, German, Greek, Spanish, and Swedish
- Attributes: STR +125; WIL −50
- Traits: Compulsion/Paranoid −50; Connections +25; Reputation −150; Toughness +125
- Skills: Interest/Marian History +15; Interest/Roman History +10; Language/Latin +15; Protocol/Marian +10; Strategy +5
- Flexible XP: None.
- Required choices: None.
- Restrictions: Marian Hegemony characters must purchase the Citizen Trait or take the Slave Life Module for Stage 1. Marian characters without the Citizen Trait may not select Social or Preparatory School in Stage 2 and may not take any Stage 3 module.
- Errata: None applicable.

### Outworlds Alliance

- Source ID: `CORE-STAGE0-SUB-MAJOR-PERIPHERY-OUTWORLDS-ALLIANCE`
- Parent: Major Periphery State; printed page: 68
- Languages: Secondary languages French and Japanese
- Attributes: EDG +75; WIL −55
- Traits: G-Tolerance +125; Wealth −75
- Skills: Streetwise/Outworlds +10; Survival/Any +10; choose Martial Arts, MedTech/Any, or Small Arms +15
- Flexible XP: None.
- Required choice: Martial Arts, MedTech/Any, or Small Arms for +15 XP.
- Restrictions, prerequisites, and footnotes: None additional on this row.
- Errata: None applicable.

### Taurian Concordat

- Source ID: `CORE-STAGE0-SUB-MAJOR-PERIPHERY-TAURIAN-CONCORDAT`
- Parent: Major Periphery State; printed page: 68
- Languages: No additional language row is printed for this sub-affiliation; the parent Major Periphery State language fields apply.
- Attributes: WIL +150; EDG +50
- Traits: Compulsion/Distrust of Federated Suns −75; Compulsion/Distrust of Sphere −75
- Skills: Martial Arts +10; Negotiation +10; Small Arms +15; Streetwise/Taurian +15; Survival/Any +5
- Flexible XP: None.
- Required choices: None.
- Special rule: The Taurian Concordat sub-affiliation includes the Calderon Protectorate.
- Restrictions and footnotes: None additional on this row.
- Errata: None applicable.

### Major Periphery State notes

The parent notes identify the Magistracy of Canopus as including the Fronc Reaches and the Taurian Concordat as including the Calderon Protectorate. Marian Hegemony restrictions are recorded with that sub-affiliation above.

## Deep Periphery

- Source ID: `CORE-STAGE0-AFF-DEEP-PERIPHERY`
- Exact published name: Deep Periphery
- Printed page: 68; module cost: 50 XP
- Primary language: See sub-affiliation
- Secondary language: See sub-affiliation
- Attribute awards: WIL +60
- Trait awards: Equipped −80
- Skill awards: None in the parent fixed-award row.
- Flexible XP: +10 XP each to any two Attributes, Traits, Skills, or a combination thereof.
- Choices, conditional awards, and prerequisites: None in the parent record.
- Restrictions and special rules: The parent languages are supplied by the selected sub-affiliation.
- Errata: No applicable v4.0 correction.

### Hanseatic League

- Source ID: `CORE-STAGE0-SUB-DEEP-PERIPHERY-HANSEATIC-LEAGUE`
- Parent: Deep Periphery; printed page: 68
- Primary language: German
- Secondary language: English
- Attributes: None beyond parent awards.
- Traits: Citizenship +30; Compulsion/Distrust Lyrans −20
- Skills: Appraisal +10; Negotiation +20; Protocol/Hanseatic +10
- Flexible XP: None.
- Required choices: None.
- Restrictions: Characters with a Hanseatic League sub-affiliation whose Wealth Trait is reduced to 0 or less lose the Citizenship Trait and become serfs, receiving Reputation −20 and In For Life −40.
- Errata: None applicable.

### Castilian Principalities

- Source ID: `CORE-STAGE0-SUB-DEEP-PERIPHERY-CASTILIAN-PRINCIPALITIES`
- Parent: Deep Periphery; printed page: 68
- Primary language: Spanish
- Secondary language: English
- Attributes: DEX +25
- Traits: Compulsion/Castilian Honor Code −20; Compulsion/Hatred of Umayyads −20
- Skills: Martial Arts +15; Melee Weapons +15; Negotiation +10; Protocol/Castilian +25
- Flexible XP: None.
- Required choices: None.
- Restrictions: Castilian Principalities characters may not receive a Rank level higher than Title level one, may not receive a Wealth level higher than Title level one, and may not take any University Life Modules.
- Errata: None applicable.

### Umayyad Caliphate

- Source ID: `CORE-STAGE0-SUB-DEEP-PERIPHERY-UMAYYAD-CALIPHATE`
- Parent: Deep Periphery; printed page: 68
- Primary language: Arabic
- Secondary language: English
- Attributes: DEX +20; RFL +25
- Traits: Compulsion/Xenophobic −10
- Skills: Art/Any +10; Protocol/Umayyad +20
- Flexible XP: None.
- Required choices: None.
- Restrictions: Characters with an Umayyad Caliphate sub-affiliation who choose to be warriors may not take a Stage 1 Life Module and may not take Officer or MechWarrior Skill Fields without first purchasing at least one level of Title or Rank. A character who receives Combat Paralysis also receives Reputation −10.
- Errata: None applicable.

### JärnFolk

- Source ID: `CORE-STAGE0-SUB-DEEP-PERIPHERY-JARNFOLK`
- Parent: Deep Periphery; printed page: 68
- Exact published spelling: JärnFolk
- Primary language: JärnFolk Norse
- Secondary languages: Danish, English, German, Swedish
- Attributes: RFL +20
- Traits: Compulsion/Xenophobic −10; Natural Aptitude/Martial Arts +20
- Skills: Perception +10; Protocol/JärnFolk Families +15; choose Art/Any, Interest/Any, or Technician/Any +10
- Flexible XP: None.
- Required choice: Art/Any, Interest/Any, or Technician/Any for +10 XP.
- Restrictions: JärnFolk characters may not select White Collar, Preparatory School, Military School, or Undergraduate Studies; they may not select any Stage 3 module except Family Training. JärnFolk characters may not become MechWarriors or use battle armor unless they first leave the JärnFolk.
- Special rule: A JärnFolk character may not become a MechWarrior or use battle armor while remaining JärnFolk.
- Errata: None applicable.

## Counts and reconciliation

- Parent affiliations: 2
- Major Periphery State sub-affiliations: 5
- Deep Periphery sub-affiliations: 4
- Total sub-affiliations: 9
- Total source records: 11
- Parent flexible-XP packages: 2
- Sub-affiliation flexible-XP packages: 0
- Parent conditional choices: 0
- Sub-affiliation conditional choices: 4 (Circinus Federation three Skills; Magistracy of Canopus one Skill; Outworlds Alliance one Skill; JärnFolk one Skill)

The complete v4.0 Errata contains no correction affecting the Major Periphery State or Deep Periphery entries on printed page 68. No errata value is applied to this ledger.

## Source verification notes

The rendered corrected-printing page was inspected directly at high resolution, with both columns read independently. The parent tables, all nine sub-affiliation rows, language destinations, flexible-XP placement, conditional choices, and the page footnotes were checked against the rendered source.

## Implementation status

**SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**

This ledger preserves published source material only. It does not establish that either parent affiliation or any sub-affiliation is implemented correctly or completely in the application. Application catalogs, transactions, validation, persistence, and UI remain outside this document's authorization.

The next authorized comparison may map these eleven source records to application records without changing the published values or these source inventory IDs.

--- END page-68-major-deep-periphery.md ---


--- BEGIN page-69-invading-clans.md ---

# G1i Stage 0-A8 — Invading Clan Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i — Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A8
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 69
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED**
- Implementation assessment status: **NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves the published Page 69 rules. It does not establish application implementation or authorize application changes.

## Invading Clan

- Source ID: `CORE-STAGE0-AFF-INVADING-CLAN`
- Exact published name: Invading Clan
- Printed page: 69; module cost: 75 XP
- Primary language: English
- Secondary language: None
- Attribute awards: None in the parent fixed-award row.
- Trait awards: Compulsion/Arrogance −50; Compulsion/Distrust of Inner Sphere −100
- Skill awards: Interest/Clan Remembrance +25; Protocol/Clan +25
- Flexible XP: None.
- Choices and prerequisites: None in the parent fixed-award row.
- Conditional source rule: Clan characters who fall into the castes or sub-castes described on printed p.71 receive the fixed XP listed on that caste table. A Clan-born character who does not fit one of those listed castes is Dark Caste and must choose Pirate as the sub-affiliation under Independent, using the Changing Affiliation rule on printed p.63.
- Restrictions and special rules: The parent Clan notes below apply to all Invading Clan characters unless a more specific row states otherwise.
- Errata: No applicable v4.0 correction.

### Diamond Shark

- Source ID: `CORE-STAGE0-SUB-INVADING-CLAN-DIAMOND-SHARK`
- Parent: Invading Clan; printed page: 69
- Attributes: STR −45; INT +25; EDG −50
- Traits: Connections +25; Equipped +25; Wealth +30
- Skills: Negotiation +20; Technician/Any +10; Protocol/Diamond Shark +10
- Flexible XP: None.
- Choices, prerequisites, restrictions, and additional footnotes: None on this row beyond the parent Clan notes.
- Errata: None applicable.

### Ghost Bear

- Source ID: `CORE-STAGE0-SUB-INVADING-CLAN-GHOST-BEAR`
- Parent: Invading Clan; printed page: 69
- Attributes: STR +25; BOD +25
- Traits: Compulsion/Hate Hell's Horses −25; Exceptional Attribute/Strength +50; Slow Learner −50
- Skills: Art/Any +10; Protocol/Ghost Bear +10; Streetwise/Rasalhague +5
- Flexible XP: None.
- Choices, prerequisites, restrictions, and additional footnotes: None on this row beyond the parent Clan notes.
- Errata: None applicable.

### Hell's Horses

- Source ID: `CORE-STAGE0-SUB-INVADING-CLAN-HELLS-HORSES`
- Parent: Invading Clan; printed page: 69
- Attributes: STR +25; BOD +25
- Traits: Compulsion/Hate Ghost Bears −25; Introvert −30
- Skills: Melee Weapons +10; Navigation/Ground +15; Protocol/Hell's Horses +15; Survival/Desert +15
- Flexible XP: None.
- Choices, prerequisites, restrictions, and additional footnotes: None on this row beyond the parent Clan notes.
- Errata: None applicable.

### Jade Falcon

- Source ID: `CORE-STAGE0-SUB-INVADING-CLAN-JADE-FALCON`
- Parent: Invading Clan; printed page: 69
- Attributes: WIL +25
- Traits: Compulsion/Falcon Pride −75; Compulsion/Hate Steel Vipers −50; Reputation +100
- Skills: Acting +10; Martial Arts +15; Protocol/Jade Falcon +15; Survival/Forests +10
- Flexible XP: None.
- Choices, prerequisites, restrictions, and additional footnotes: None on this row beyond the parent Clan notes.
- Errata: None applicable.

### Nova Cat

- Source ID: `CORE-STAGE0-SUB-INVADING-CLAN-NOVA-CAT`
- Parent: Invading Clan; printed page: 69
- Attributes: EDG +120
- Traits: Enemy/The Clans −100; Enemy/Draconis Combine −50; Equipped +50; Reputation −100; Sixth Sense +100
- Skills: Interest/Nova Cat Vision Quest +10; Language/Japanese +5; Protocol/Draconis Combine +5; Protocol/Nova Cat +10
- Flexible XP: None.
- Choices, prerequisites, restrictions, and additional footnotes: None on this row beyond the parent Clan notes.
- Errata: None applicable.

### Snow Raven

- Source ID: `CORE-STAGE0-SUB-INVADING-CLAN-SNOW-RAVEN`
- Parent: Invading Clan; printed page: 69
- Attributes: INT +20
- Traits: Compulsion/Raven Pride −50; Connections +50
- Skills: Negotiation +10; Protocol/Snow Raven +10; Zero-G Operations +10
- Flexible XP: None.
- Choices, prerequisites, restrictions, and additional footnotes: None on this row beyond the parent Clan notes.
- Errata: None applicable.

### Wolf

- Source ID: `CORE-STAGE0-SUB-INVADING-CLAN-WOLF`
- Parent: Invading Clan; printed page: 69
- Attributes: INT +25; WIL +25
- Traits: Compulsion/Wolf Pride −50; Equipped +50; Enemy −100; Reputation +70
- Skills: Protocol/Wolf +10; choose two of Interest/Any, Leadership, Negotiation, Perception, or Strategy +10 each
- Flexible XP: None.
- Required choice: Choose two Skills from the published list for +10 XP each.
- Prerequisites, restrictions, and additional footnotes: None on this row beyond the parent Clan notes.
- Errata: None applicable.

## Clan restrictions and dependencies

The Page 69 notes establish the following source dependencies and restrictions:

1. Characters may not take the Property or Extra Income Traits.
2. The Title Trait, representing a Bloodname in Clan society, is unavailable to a Clan character who does not also take the Trueborn Trait.
3. The Clan Wolf sub-affiliation includes Clan Wolf (in-Exile).
4. Ghost Bear sub-affiliation characters cannot choose the Aerospace Phenotype and must select the MechWarrior Phenotype instead, substituting the MechWarrior Field Aptitude with a Field Aptitude in any one Fighter Pilot Field Skill.
5. Only Ghost Bear and Hell's Horses sub-affiliation characters have access to Elemental-Advanced training.
6. Only Snow Raven characters with the Aerospace Phenotype have access to the Aerospace-Naval sub-caste.
7. The ProtoMech Warrior sub-caste is unavailable to any Clan character entering game play before 3062 and to any Invading Clan character entering service after 3075.
8. Diamond Shark, Ghost Bear, Steel Viper, and Wolf characters, excluding Wolf (in-Exile), may not choose the ProtoMech Warrior sub-caste when entering service between 3062 and 3075.
9. Jade Falcon characters may choose the ProtoMech Warrior sub-caste only for characters entering service from 3062 to 3068.
10. None of the Warrior sub-castes are available to Steel Viper characters who do not take the Trueborn Trait.
11. Freeborn Clan characters do not require a Phenotype Trait and use the Normal Human Phenotype if none is selected.

These rules cross-reference printed pp.63, 70, and 71. They are recorded here as source dependencies and are not expanded into later-page implementations.

## Counts and reconciliation

- Parent affiliations: 1
- Invading Clan sub-affiliations: 7
- Total source records: 8
- Parent flexible-XP packages: 0
- Sub-affiliation flexible-XP packages: 0
- Parent conditional source rules: 1 caste/Dark Caste rule
- Sub-affiliation conditional choices: 1 (Wolf, two Skills)
- Clan restriction/dependency notes: 11

The complete v4.0 Errata contains no correction affecting the Invading Clan entry on printed page 69. No errata value is applied to this ledger.

## Source verification notes

The rendered corrected-printing page was inspected directly at high resolution. The parent record and all seven Clan rows were read from the printed table, including the separate caste/Dark Caste paragraph and the full notes block. The source table contains no additional Invading Clan sub-affiliation beyond the seven listed here.

## Implementation status

**SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**

This ledger preserves published source material only. It does not establish that Invading Clan or any Clan identity is implemented correctly or completely in the application. Public Clan creation remains outside this task and must remain disabled.

--- END page-69-invading-clans.md ---


--- BEGIN page-70-homeworld-clans.md ---

# G1i Stage 0-A9 — Homeworld Clan Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i — Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A9
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 70
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED**
- Implementation assessment status: **NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves the published Page 70 rules. It does not establish application implementation or authorize application changes.

## Homeworld Clan

- Source ID: `CORE-STAGE0-AFF-HOMEWORLD-CLAN`
- Exact published name: Homeworld Clan
- Printed page: 70; module cost: 50 XP
- Primary language: English
- Secondary language: None
- Attribute awards: None in the parent fixed-award row.
- Trait awards: Compulsion/Distrust of Inner Sphere −100; Compulsion/Hate Invading Clans −100
- Skill awards: Interest/Clan Remembrance +25; Protocol/Clan +25
- Flexible XP: None.
- Choices and prerequisites: None in the parent fixed-award row.
- Conditional source rule: Clan characters who fall into the castes or sub-castes described on printed p.71 receive the same fixed XP identified there. A Clan-born character that does not fit any listed caste is Dark Caste and must choose the Pirate sub-affiliation under Affiliation: Independent on printed p.73, using the Changing Affiliations rule on printed p.63.
- Restrictions and special rules: The Homeworld Clan entry refers to the Invading Clan notes for its Clan-wide restrictions and special rules.
- Errata: No applicable v4.0 correction.

### Blood Spirit

- Source ID: `CORE-STAGE0-SUB-HOMEWORLD-CLAN-BLOOD-SPIRIT`
- Parent: Homeworld Clan; printed page: 70
- Attributes: BOD +25; WIL +100; CHA −50
- Traits: Combat Sense +100; Compulsion/Blood Spirit Fanaticism −100; Compulsion/Hate Star Adder −100; Equipped −65; Exceptional Attribute/WIL +200; Introvert −50; Reputation −50
- Skills: Interest/Clan History +25; Martial Arts +15; Small Arms +15; Protocol/Blood Spirit +10
- Flexible XP: None.
- Choices, prerequisites, restrictions, and additional footnotes: None on this row beyond the parent Homeworld Clan and cross-referenced Invading Clan notes.
- Errata: None applicable.

### Cloud Cobra

- Source ID: `CORE-STAGE0-SUB-HOMEWORLD-CLAN-CLOUD-COBRA`
- Parent: Homeworld Clan; printed page: 70
- Attributes: INT +50; WIL +50
- Traits: Compulsion/Religious Faith −75; Equipped −25; Patient +100; Reputation −75
- Skills: Interest/Theology/Any +20; Protocol/Cloud Cobra +20; +10 XP to any one other Skill
- Flexible XP: None.
- Required choice: Choose any one other Skill for +10 XP.
- Restrictions and footnotes: None additional on this row.
- Errata: None applicable.

### Coyote

- Source ID: `CORE-STAGE0-SUB-HOMEWORLD-CLAN-COYOTE`
- Parent: Homeworld Clan; printed page: 70
- Attributes: INT +100; WIL −60; EDG +25
- Traits: Equipped +25; Reputation −60; choose one of Custom Vehicle, Natural Aptitude/Computers, Natural Aptitude/Technician/Any, or Vehicle Level +10
- Skills: Interest/Coyote Rituals +15; Protocol/Coyote +10; Survival/Any +10
- Flexible XP: None.
- Required choice: Choose one listed Trait for +10 XP.
- Restrictions and footnotes: None additional on this row.
- Errata: None applicable.

### Fire Mandrill

- Source ID: `CORE-STAGE0-SUB-HOMEWORLD-CLAN-FIRE-MANDRILL`
- Parent: Homeworld Clan; printed page: 70
- Secondary languages: Chinese, French, German, Japanese, Russian, Spanish
- Attributes: WIL +25; +75 XP to any one other Attribute; −20 XP to any one other Attribute
- Traits: Compulsion/Fire Mandrill Fanaticism −100; Compulsion/Kindraa Fanaticism −100; Enemy/Rival Kindraa −25; Reputation −25; choose one of Combat Sense, Exceptional Attribute/Any, Fast Learner, Natural Aptitude/Any, or Sixth Sense +150
- Skills: Language/Secondary +20; Martial Arts +15; Protocol/Fire Mandrill +15; Protocol/Kindraa +25; choose two of Leadership, Melee Weapons, Negotiation, Perception, or Tactics/Any +10 each
- Flexible XP: None.
- Required choices: Choose one listed Attribute destination for +75; choose one other Attribute destination for −20; choose one listed Trait for +150; choose two listed Skills for +10 each.
- Restrictions and footnotes: None additional on this row.
- Errata: None applicable.

### Goliath Scorpion

- Source ID: `CORE-STAGE0-SUB-HOMEWORLD-CLAN-GOLIATH-SCORPION`
- Parent: Homeworld Clan; printed page: 70
- Secondary languages: Goliath Scorpion Battle Language (warrior caste only), Russian
- Attributes: DEX +50; INT +50; WIL −50; EDG −50
- Traits: Compulsion/Necrosia Addiction −50; Compulsion/Nostalgic −50; Fit +55; Reputation −25; choose one of Exceptional Attribute/INT, Natural Aptitude/Gunnery/Any, Natural Aptitude/Melee Weapons, or Natural Aptitude/Interest/Any +100
- Skills: Interest/Star League History +20; Melee Weapons +15; Protocol/Goliath Scorpion +10
- Flexible XP: None.
- Required choice: Choose one listed Trait for +100 XP.
- Conditional language rule: Goliath Scorpion Battle Language is available to the warrior caste only.
- Restrictions and footnotes: None additional on this row.
- Errata: None applicable.

### Ice Hellion

- Source ID: `CORE-STAGE0-SUB-HOMEWORLD-CLAN-ICE-HELLION`
- Parent: Homeworld Clan; printed page: 70
- Attributes: DEX +75; RFL +100; WIL +50; CHA −75
- Traits: Combat Sense +50; Impatient −100; Reputation −95
- Skills: Interest/Clan Remembrance +15; Martial Arts +10; Negotiation +15; Protocol/Ice Hellion +10; Swimming +10; Survival/Arctic +10
- Flexible XP: None.
- Choices, restrictions, and footnotes: None additional on this row.
- Errata: None applicable.

### Star Adder

- Source ID: `CORE-STAGE0-SUB-HOMEWORLD-CLAN-STAR-ADDER`
- Parent: Homeworld Clan; printed page: 70
- Attributes: INT +50; WIL +75; CHA −70
- Traits: Combat Sense +50; Compulsion/Clan Honor −50; Equipped +25; Reputation +25; choose one of Compulsion/Adder Arrogance or Compulsion/Burrock Forever! −60
- Skills: Leadership +10; Perception +10; Protocol/Star Adder +10
- Flexible XP: None.
- Required choice: Choose Compulsion/Adder Arrogance or Compulsion/Burrock Forever! for −60 XP.
- Restrictions and footnotes: None additional on this row.
- Errata: None applicable.

### Steel Viper

- Source ID: `CORE-STAGE0-SUB-HOMEWORLD-CLAN-STEEL-VIPER`
- Parent: Homeworld Clan; printed page: 70
- Attributes: INT +75; WIL +100; CHA −50
- Traits: Compulsion/Clan Honor −100; Compulsion/Hate Jade Falcons −100; Compulsion/Hate Snow Ravens −50; Connections +50; Equipped +50; Reputation +50
- Skills: Negotiation +15; Protocol/Steel Viper +15; Survival/Any +20
- Flexible XP: None.
- Choices, restrictions, and footnotes: None additional on this row beyond the parent and cross-referenced Invading Clan notes.
- Errata: None applicable.

## Clan restrictions and dependencies

The Homeworld Clan parent explicitly cross-references the Invading Clan notes on printed p.69. The Page 70-specific dependencies are:

1. Caste and sub-caste fixed XP comes from the Clan Castes table on printed p.71.
2. A Clan-born character outside the listed castes is Dark Caste and must use the Pirate sub-affiliation under Independent on printed p.73, applying the Changing Affiliations rule on printed p.63.
3. Goliath Scorpion Battle Language is limited to the warrior caste.
4. The Homeworld Clan parent has no flexible XP package; all listed Clan-specific choices are recorded on their individual rows.

The Invading Clan notes on printed p.69 remain applicable by the parent cross-reference, including Clan Trait restrictions, Trueborn/Title interaction, Phenotype and caste dependencies, and other Clan-specific limitations. Public Clan creation remains disabled and later-page behavior is not inferred here.

## Counts and reconciliation

- Parent affiliations: 1
- Homeworld Clan sub-affiliations: 8
- Total source records: 9
- Parent flexible-XP packages: 0
- Sub-affiliation flexible-XP packages: 0
- Parent conditional source rules: 1 caste/Dark Caste cross-reference
- Sub-affiliation conditional choices: 6 (Cloud Cobra, Coyote, Fire Mandrill four choice domains, Goliath Scorpion, and Star Adder)

The complete v4.0 Errata contains no correction affecting the Homeworld Clan entry on printed page 70. No errata value is applied to this ledger.

## Source verification notes

The rendered corrected-printing page was inspected directly at high resolution. The parent record and all eight Clan rows were read from the printed table, including language restrictions, choice alternatives, the caste cross-reference, the Dark Caste rule, and the Page 70 footnote referring to the Invading Clan notes.

## Implementation status

**SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**

This ledger preserves published source material only. It does not establish that Homeworld Clan or any Clan identity is implemented correctly or completely in the application. Public Clan creation remains outside this task and must remain disabled.

--- END page-70-homeworld-clans.md ---


--- BEGIN page-71-clan-castes.md ---

# G1i Stage 0-A10 — Clan Castes Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i — Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A10
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 71
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED**
- Implementation assessment status: **NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves the published Page 71 Clan Castes award table. It does not establish application implementation or authorize application changes.

## Table scope

Printed page 71 defines caste and sub-caste fixed XP awards. It does not print a module XP cost, a separate purchase transaction, a complete eligibility algorithm, a flexible-XP package, or a Dark Caste row. Fields not stated on this page remain **not specified on Page 71** and are not inferred here.

## Caste records

### MechWarrior

- Source ID: `CORE-STAGE0-CASTE-MECHWARRIOR`
- Exact published name: MechWarrior
- Printed page: 71
- Attributes: DEX +75; RFL +75; WIL +75; CHA −25; EDG −50
- Traits: Fit +25; Impatient −50
- Skills: None.
- Flexible XP: None specified.
- Module cost, prerequisites, language requirements, Phenotype requirements, and Trueborn/Freeborn restrictions: Not specified on Page 71.

### Elemental

- Source ID: `CORE-STAGE0-CASTE-ELEMENTAL`
- Exact published name: Elemental
- Printed page: 71
- Attributes: BOD +125; STR +125; DEX −75; CHA −75
- Traits: None.
- Skills: Martial Arts +25
- Flexible XP: None specified.
- Module cost, prerequisites, language requirements, Phenotype requirements, and Trueborn/Freeborn restrictions: Not specified on Page 71.

### Elemental-Advanced

- Source ID: `CORE-STAGE0-CASTE-ELEMENTAL-ADVANCED`
- Exact published name: Elemental-Advanced
- Printed page: 71
- Attributes: BOD +200; STR +175; DEX −100; RFL −75; CHA −100; EDG −100
- Traits: Patient +25; Reputation +100
- Skills: None.
- Flexible XP: None specified.
- Module cost, prerequisites, language requirements, Phenotype requirements, and Trueborn/Freeborn restrictions: Not specified on Page 71.

### Aerospace or ProtoMech

- Source ID: `CORE-STAGE0-CASTE-AEROSPACE-OR-PROTOMECH`
- Exact published name: Aerospace or ProtoMech
- Printed page: 71
- Attributes: BOD −50; STR −50; DEX +150; RFL +150; CHA −25; EDG −25
- Traits: Fit +25; Impatient −50
- Skills: None.
- Flexible XP: None specified.
- Module cost, prerequisites, language requirements, Phenotype requirements, and Trueborn/Freeborn restrictions: Not specified on Page 71.

### Aerospace-Naval

- Source ID: `CORE-STAGE0-CASTE-AEROSPACE-NAVAL`
- Exact published name: Aerospace-Naval
- Printed page: 71
- Attributes: BOD −50; STR −50; DEX +125; RFL +125; INT +50; CHA −25; EDG −100
- Traits: Compulsion/Arrogance −100; Patient +75; Reputation +75
- Skills: None.
- Flexible XP: None specified.
- Module cost, prerequisites, language requirements, Phenotype requirements, and Trueborn/Freeborn restrictions: Not specified on Page 71.

### Warrior Caste (Other)

- Source ID: `CORE-STAGE0-CASTE-WARRIOR-OTHER`
- Exact published name: Warrior Caste (Other)
- Printed page: 71
- Attributes: BOD +75; STR +50; DEX +50; RFL +50; CHA −25
- Traits: Reputation −75
- Skills: None.
- Flexible XP: None specified.
- Module cost, prerequisites, language requirements, Phenotype requirements, and Trueborn/Freeborn restrictions: Not specified on Page 71.

### Scientist Caste

- Source ID: `CORE-STAGE0-CASTE-SCIENTIST`
- Exact published name: Scientist Caste
- Printed page: 71
- Attributes: STR −50; INT +100
- Traits: Compulsion/Arrogance −25; Patient +100; Reputation −25
- Skills: Interest/Any +10; Science/Any +15
- Flexible XP: None specified.
- Module cost, prerequisites, language requirements, Phenotype requirements, and Trueborn/Freeborn restrictions: Not specified on Page 71.

### Technician Caste

- Source ID: `CORE-STAGE0-CASTE-TECHNICIAN`
- Exact published name: Technician Caste
- Printed page: 71
- Attributes: DEX +100; INT +20; CHA −50
- Traits: Patient +100; Reputation −75
- Skills: Interest/Any +15; Technician/Any +15
- Flexible XP: None specified.
- Module cost, prerequisites, language requirements, Phenotype requirements, and Trueborn/Freeborn restrictions: Not specified on Page 71.

### Merchant Caste

- Source ID: `CORE-STAGE0-CASTE-MERCHANT`
- Exact published name: Merchant Caste
- Printed page: 71
- Attributes: BOD −50; INT +25; CHA +75
- Traits: Gregarious +100; Reputation −75
- Skills: Appraisal +10; Negotiation +15; Protocol/Any +10; Streetwise/Clan +15
- Flexible XP: None specified.
- Module cost, prerequisites, language requirements, Phenotype requirements, and Trueborn/Freeborn restrictions: Not specified on Page 71.

### Laborer Caste

- Source ID: `CORE-STAGE0-CASTE-LABORER`
- Exact published name: Laborer Caste
- Printed page: 71
- Attributes: BOD +100; STR +125; DEX +50; RFL +50; INT −50; CHA −50
- Traits: Reputation −125
- Skills: Career/Any +15; Interest/Any +10
- Flexible XP: None specified.
- Module cost, prerequisites, language requirements, Phenotype requirements, and Trueborn/Freeborn restrictions: Not specified on Page 71.

## Shared rules and cross-references

- Source ID: `CORE-STAGE0-CASTE-RULE-AWARD-TABLE-SCOPE`
- Printed page: 71
- The table is the published source for fixed Attribute, Trait, and Skill XP associated with the listed castes and sub-castes.
- No module cost is printed for any caste row.
- No flexible XP award is printed for any caste row.
- The table does not state a complete caste eligibility or selection procedure.

Page 69 and Page 70 cross-reference this table: Clan characters who fall into the listed castes or sub-castes receive the fixed XP identified here. Those pages also define the Dark Caste outcome for a Clan-born character outside the listed castes, the Pirate/Independent handling, and additional Clan/Phenotype restrictions. Those rules are preserved as cross-references rather than duplicated as Page 71 rows.

The Page 69 and Page 70 source audits identify further restrictions involving Trueborn status, Phenotype, Clan identity, Clan-specific training, and entry-era limits. Page 71 itself does not add separate wording for those conditions.

## Dark Caste

- Source ID: `CORE-STAGE0-CASTE-RULE-DARK-CASTE`
- Printed page reference: The Dark Caste rule is stated on printed pages 69–70, not as a row in the Page 71 caste table.
- Rule: A Clan-born character who does not fit any listed caste is considered Dark Caste and must choose the Pirate sub-affiliation under Independent, applying the Changing Affiliation rule.
- Page 71 award record: None; Page 71 does not assign a separate Dark Caste award package.

## Counts and reconciliation

- Caste/sub-caste award rows: 10
- Shared Page 71 scope rules: 1
- Dark Caste cross-reference rule: 1
- Total documentation records: 12
- Rows with explicit module cost: 0
- Rows with explicit flexible XP: 0
- Rows with Attribute awards: 10
- Rows with Trait awards: 9
- Rows with Skill awards: 6

The complete v4.0 Errata contains no correction affecting the Clan Castes table on printed page 71. No errata value is applied to this ledger.

## Source verification notes

The rendered corrected-printing page was inspected directly at high resolution. All ten table rows were read from the printed table, including every signed Attribute, Trait, and Skill value. The page contains no additional caste row below Laborer Caste and no separate Dark Caste award row.

## Implementation status

**SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**

This ledger preserves published source material only. It does not establish that caste awards, eligibility, Phenotype handling, Clan training, or public Clan creation are implemented correctly or completely in the application. Public Clan creation remains outside this task and must remain disabled.

--- END page-71-clan-castes.md ---


--- BEGIN page-72-terran.md ---

# G1i Stage 0-A11 - Terran Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i - Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A11
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 72
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED — IMPLEMENTATION NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves the published Terran affiliation table. It does not establish application implementation or authorize application changes.

## Parent affiliation

### Terran

- Source ID: `CORE-STAGE0-AFFILIATION-TERRAN`
- Exact published name: Terran
- Printed page: 72
- Module cost: 240 XP
- Primary Language: Any
- Secondary Language: Any
- Fixed XPs:
  - Attributes: INT +100 XP; EDG -150 XP; +50 XP each to any two other Attributes.
  - Traits: Compulsion/Distrust of Non-Terrans -75 XP; Reputation +100 XP.
  - Skills: Language/English +25 XP; +15 XP to any two other Language Skills.
- Flexible XP: None.
- Choice restrictions: The parent row requires choices of any two other Attributes and any two other Language Skills, as stated above.

## Sub-affiliations

### Belter

- Source ID: `CORE-STAGE0-SUBAFFILIATION-TERRAN-BELTER`
- Exact published name: Belter
- Printed page: 72
- Fixed XPs:
  - Attributes: STR -25 XP; BOD -25 XP; +100 XP to any one Attribute except CHA and EDG.
  - Traits: Compulsion/Xenophobia -100 XP; Reputation -50 XP; Wealth +50 XP; choose two of Ambidextrous, Attractive, Exceptional Attribute/Any, Fast Learner, G-Tolerance, Good Hearing, Good Vision, Implant/Prosthetics, Pain Resistance, or Toughness at +50 XP each.
  - Skills: Navigation/Space +15 XP; Survival/Asteroids +10 XP; Zero-G Operations +15 XP; choose two of Driving/Any, Interest/Any, Language/Any, MedTech/General, Piloting/Any, Sensor Operations, or Technician/Any at +10 XP each.

### Lunar Citizen

- Source ID: `CORE-STAGE0-SUBAFFILIATION-TERRAN-LUNAR-CITIZEN`
- Exact published name: Lunar Citizen
- Printed page: 72
- Fixed XPs:
  - Attributes: STR -20 XP; BOD -25 XP; INT +50 XP; WIL +65 XP; EDG -25 XP.
  - Traits: Equipped +25 XP; Poor Vision -25 XP; Wealth +50 XP.
  - Skills: Technician/Any +5 XP; choose one of Art/Any, Computers, Interest/Any, Survival/Any, or Zero-G Operations at +10 XP.

### Martian Citizen

- Source ID: `CORE-STAGE0-SUBAFFILIATION-TERRAN-MARTIAN-CITIZEN`
- Exact published name: Martian Citizen
- Printed page: 72
- Fixed XPs:
  - Attributes: STR -15 XP; WIL +75 XP.
  - Traits: Equipped +65 XP; Introvert -25 XP; Poor Vision -25 XP; Reputation -25 XP; Wealth +35 XP.
  - Skills: Language/Any one previously chosen secondary Language Skill -10 XP; Negotiation +10 XP; Survival/Martian Desert +10 XP; choose one of Art/Any, Computers, Interest/Any, Martial Arts, MedTech/General, Melee Weapons, or Small Arms at +15 XP.

### Outer System Citizen

- Source ID: `CORE-STAGE0-SUBAFFILIATION-TERRAN-OUTER-SYSTEM-CITIZEN`
- Exact published name: Outer System Citizen
- Printed page: 72
- Fixed XPs:
  - Attributes: STR -15 XP; BOD -15 XP; RFL +20 XP.
  - Traits: Equipped +75 XP; Reputation -20 XP; Wealth +25 XP.
  - Skills: Negotiation +10 XP; Technician/Any +10 XP; choose two of Art/Any, Computers, Driving/Any, Interest/Any, Martial Arts, Survival/Any, or Zero-G Operations at +10 XP each.

### Terran Citizen

- Source ID: `CORE-STAGE0-SUBAFFILIATION-TERRAN-TERRAN-CITIZEN`
- Exact published name: Terran Citizen
- Printed page: 72
- Fixed XPs:
  - Attributes: EDG -100 XP.
  - Traits: Compulsion/Distrust of Non-Terrans -75 XP; Connections +100 XP; Equipped +100 XP; Impatient -50 XP; Wealth +110 XP.
  - Skills: Interest/Terran History +10 XP; Perception -5 XP; +5 XP to any four other Skills.
- Choice restrictions: The four additional Skills are any four other Skills, as stated in the table.

### Venusian Citizen

- Source ID: `CORE-STAGE0-SUBAFFILIATION-TERRAN-VENUSIAN-CITIZEN`
- Exact published name: Venusian Citizen
- Printed page: 72
- Fixed XPs:
  - Attributes: BOD +35 XP; INT -25 XP; WIL +110 XP.
  - Traits: Equipped +25 XP; Introvert -50 XP; Reputation -25 XP; Wealth +15 XP.
  - Skills: Language/Any one previously chosen secondary Language Skill -10 XP; Survival/Any +20 XP; choose one of Art/Any, Computers, Interest/Any, Martial Arts, MedTech/General, Melee Weapons, or Technician/Any at +15 XP.
- Restriction: After 3059, when Venus' last cities effectively closed or collapsed, Venusian characters are considered expatriates; no Terran characters born after 3059 may choose the Venusian sub-affiliation.

## Source and errata reconciliation

- The complete parent Terran row and all six printed sub-affiliations are preserved above from printed page 72.
- The v4.0 errata was searched for Terran, Venusian, Belter, Lunar Citizen, Martian Citizen, and Outer System Citizen entries. No applicable correction to this page-72 table was found.
- No unprinted prerequisites, costs, flexible XP, language defaults, or implementation behavior are inferred here.


--- END page-72-terran.md ---


--- BEGIN page-73-independent.md ---

# G1i Stage 0-A12 - Independent Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i - Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A12
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 73
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves the published Independent affiliation table. It does not establish application implementation or authorize application changes.

## Parent affiliation

### Independent

- Source ID: `CORE-STAGE0-AFF-INDEPENDENT`
- Exact published name: Independent
- Parent affiliation: None; this is a Stage 0 parent affiliation.
- Printed page: 73
- Module cost: 50 XP
- Primary Language: See sub-affiliation.
- Secondary Language: See sub-affiliation.
- Fixed XPs: WIL +20 XP; EDG +20 XP; Equipped -20 XP; Reputation -10 XP; Wealth -10 XP.
- Flexible XP: None.
- Conditional awards and choices: The language and additional award choices are defined by the selected sub-affiliation below.
- Prerequisites and restrictions: None stated for the parent row on page 73.

## Sub-affiliations

### Antallos

- Source ID: `CORE-STAGE0-SUB-INDEPENDENT-ANTALLOS`
- Exact published name: Antallos
- Parent affiliation: Independent
- Printed page: 73
- Additional awards:
  - Primary Language: English.
  - Secondary Languages: Any.
  - Attributes: BOD +20 XP; WIL +10 (printed without an XP suffix); CHA -10 XP.
  - Traits: Illiterate -20 XP; Pain Resistance +10 XP; Reputation -20 XP; Toughness +10 XP.
  - Skills: Language/Japanese +10 XP; Perception +10 XP; Streetwise/Periphery +10 XP; choose two of Acting, Escape Artist, Martial Arts, Melee Weapons, Small Arms, or Survival/Desert at +10 XP each.
- Flexible XP: None specified.
- Restrictions: Antallos characters may not take the Title Trait; they may not take Nobility, Preparatory School, or Military School.

### Astrokaszy

- Source ID: `CORE-STAGE0-SUB-INDEPENDENT-ASTROKASZY`
- Exact published name: Astrokaszy
- Parent affiliation: Independent
- Printed page: 73
- Additional awards:
  - Primary Language: Arabic.
  - Secondary Languages: English, German, Greek.
  - Attributes: BOD +15 XP; WIL +25 XP; CHA -10 XP; EDG -10 XP.
  - Traits: Fit +20 XP; Compulsion/Xenophobic -20 XP; Illiterate -20 XP; Reputation -10 XP.
  - Skills: Perception +10 XP; Protocol/Astrokaszy +10 XP; Streetwise/Periphery +10 XP; choose two of Acting, Martial Arts, Melee Weapons, Small Arms, Survival/Desert, or Thrown Weapons/Any at +15 XP each.
- Flexible XP: None specified.
- Restrictions: No additional Astrokaszy-specific restriction is stated in the page-73 Notes paragraph.

### Generic

- Source ID: `CORE-STAGE0-SUB-INDEPENDENT-GENERIC`
- Exact published name: Generic
- Parent affiliation: Independent
- Printed page: 73
- Additional awards:
  - Primary Language: Any.
  - Secondary Languages: Any from nearest state.
  - Traits: Introvert -10 XP.
  - Skills: Interest/Any +10 XP; Negotiation +10 XP; +10 XP to any four other Skills.
- Flexible XP: None specified.
- Choice restrictions: The secondary language is any from the nearest state; the four additional Skill destinations are any four other Skills.

### Mercenary

- Source ID: `CORE-STAGE0-SUB-INDEPENDENT-MERCENARY`
- Exact published name: Mercenary
- Parent affiliation: Independent
- Printed page: 73
- Additional awards:
  - Primary Language: English.
  - Secondary Languages: Any.
  - Attributes: CHA -20 XP.
  - Traits: Equipped +20 XP; Rank +20 XP.
  - Skills: Negotiation +10 XP; Protocol/Mercenary +10 XP; +10 XP to any one other Skill.
- Flexible XP: None specified.
- Restriction: Mercenary characters may not take the Title Trait.
- Special rule: A character taking Mercenary for Stage 0 is born into the mercenary life. A character not born to the mercenary life who turns mercenary later must choose another affiliation.

### Pirate

- Source ID: `CORE-STAGE0-SUB-INDEPENDENT-PIRATE`
- Exact published name: Pirate
- Parent affiliation: Independent
- Printed page: 73
- Additional awards:
  - Primary Language: Any.
  - Secondary Languages: Any from nearest state.
  - Attributes: BOD +20 XP; WIL +10 XP; CHA -30 XP.
  - Traits: Pain Resistance +10 XP; Reputation -30 XP; Toughness +10 XP.
  - Skills: Language/Any +10 XP; Negotiation +5 XP; Perception +15 XP; choose three of Acting, Escape Artist, Martial Arts, Melee Weapons, Small Arms, or Survival/Any at +10 XP each.
- Flexible XP: None specified.
- Restrictions: Pirate characters may not take the Title Trait; they may not take Nobility, Preparatory School, or Military School.

### Spacer

- Source ID: `CORE-STAGE0-SUB-INDEPENDENT-SPACER`
- Exact published name: Spacer
- Parent affiliation: Independent
- Printed page: 73
- Additional awards:
  - Primary Language: English.
  - Secondary Language: Any from nearest state.
  - Attributes: BOD -20 XP; STR -10 XP; DEX +10 XP; RFL +10 XP.
  - Traits: Equipped +10 XP; G-Tolerance +20 XP; Introvert -20 XP; Natural Aptitude/Zero-G Operations +20 XP.
  - Skills: Career/Ship's Crew +10 XP; Zero-G Operations +10 XP; choose one of Appraisal, Interest/Any, Navigation/Space, Negotiation, or Sensor Operations at +10 XP.
- Flexible XP: None specified.
- Restrictions: Spacer characters may not take the Title Trait or the TDS (Transit Disorientation Syndrome) Trait.
- Special rule: If the extreme-gravity rules are used, other effects on the character's Attribute maximums and costs apply in character creation as noted on pages 237-238.

### Tortuga

- Source ID: `CORE-STAGE0-SUB-INDEPENDENT-TORTUGA`
- Exact published name: Tortuga
- Parent affiliation: Independent
- Printed page: 73
- Additional awards:
  - Primary Language: English.
  - Secondary Languages: Any Taurian or FedSuns Primary or Secondary Language.
  - Attributes: BOD +10 XP; STR +10 XP; WIL +20 XP; CHA -40 XP.
  - Traits: Pain Resistance +10 XP; Reputation -50 XP; Toughness +10 XP.
  - Skills: Language/Any +10 XP; Martial Arts +10 XP; Negotiation +10 XP; Perception +10 XP; Streetwise/Periphery +10 XP; choose three of Acting, Escape Artist, Melee Weapons, Small Arms, or Survival/Any at +10 XP each.
- Flexible XP: None specified.
- Restrictions: Tortuga characters may not take the Title Trait; they may not take Nobility, Preparatory School, or Military School.

## Independent-wide notes and cross-references

- Characters with Antallos, Mercenary, Pirate, Spacer, or Tortuga sub-affiliations may not take Title Traits.
- Characters with Antallos, Pirate, or Tortuga sub-affiliations may not take the Nobility, Preparatory School, or Military School modules.
- The Mercenary Stage 0 birth rule is distinct from becoming a mercenary later; later mercenary characters must choose another affiliation.
- Spacer characters cannot take TDS. The extreme-gravity effects are cross-referenced to printed pages 237-238 and are not expanded here.
- The page-73 table contains exactly eight source records: one parent affiliation and seven sub-affiliations.

## Errata reconciliation

- Errata location: *A Time of War Errata v4.0*, page 2 of 9, entry “Independent (p. 63), Under Sub-Affiliations, Astrokaszy.”
- Original rule/value: `Streetwise/Periphery (+10 CP)`.
- Corrected rule/value: `Streetwise/Periphery (+10 XP)`.
- Affected source ID: `CORE-STAGE0-SUB-INDEPENDENT-ASTROKASZY`.
- Corrected-printing status: The corrected third printing page-73 extraction shows `Streetwise/Periphery (+10 XP)`; the correction is therefore already reflected in the authoritative corrected printing and must not be applied twice.
- Reference discrepancy: The errata labels the Independent entry “p. 63,” while the Independent affiliation table is printed on page 73 in the corrected printing. This ledger preserves the errata's exact location/reference and records the page-73 table as the affected target by content, without silently changing the errata citation.
- The same errata page adds a separate extreme-gravity note under “Notes (p. 63).” The page-73 Spacer note already cross-references pages 237-238; no additional award correction is applied.

## Source verification notes

- Authenticated Box retrieval was used because the local Windows Box path remained inaccessible.
- The exact file identity was verified as *1 A Time of War-The BattleTech RPG — Corrected Third Printing.pdf*.
- Printed page 73 was extracted from the authoritative PDF and the table's headings, award rows, signs, language destinations, choices, notes, and adjacent cross-references were checked against the extracted page content.
- The v4.0 errata was extracted and checked for the Astrokaszy correction and the extreme-gravity note.
- The authoritative local PDF was rendered with Poppler at 220 DPI, using PDF page 75 for printed page 73, and visually inspected. The complete eight-record table, signs, language rows, choices, Flexible XPs row, and Notes block match the ledger. The local PDF SHA-256 was independently verified before inspection. The Astrokaszy erratum is recorded once, with its p. 63 versus printed p. 73 reference discrepancy preserved.
- Status: **SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**.


--- END page-73-independent.md ---


--- BEGIN page-74-comstar-word-of-blake.md ---

# G1i Stage 0-A13 - ComStar / Word of Blake Source Ledger

## Audit identification

- Project: AToW Online Character Creator
- Workstream: G1i - Life Modules Stage-by-Stage Completion
- Audit ID: G1i Stage 0-A13
- Source: *A Time of War: The BattleTech RPG*, Corrected Third Printing
- Printed page: 74
- Applicable errata: *A Time of War Errata v4.0*
- Source verification status: **SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**
- Repository checkpoint: `2cfd8c5d0ade2f65f331bdf7a2c16fd552ff4ca2`
- Version: `0.1.0-alpha.165-b14`

This document preserves the published ComStar / Word of Blake affiliation table. It does not establish application implementation or authorize application changes.

## Source-record classification

Printed page 74 presents one shared affiliation package headed **COMSTAR/WORD OF BLAKE**, followed by two sub-affiliation choices: **ComStar** and **Word of Blake**. The source does not present ComStar and Word of Blake as two independent parent affiliations on this page.

The complete page-74 inventory therefore contains three records:

1. One shared order-affiliation package.
2. One ComStar sub-affiliation record.
3. One Word of Blake sub-affiliation record.

## Shared order-affiliation package

### ComStar / Word of Blake

- Source ID: `CORE-STAGE0-ORDER-COMSTAR-WORD-OF-BLAKE`
- Exact published name: ComStar/Word of Blake
- Printed page: 74
- Source-defined affiliation type: Order affiliation with ComStar or Word of Blake sub-affiliation choices.
- Module cost: 50 XP + XP cost of “birth” Affiliation.
- Primary Language: English.
- Secondary Language: Any from nearest state.
- Fixed XPs:
  - Traits: Enemy -100 XP; Equipped +100 XP; Rank +50 XP; Reputation -50 XP.
  - Skills: Communications/Conventional +10 XP; Interest/Writings of Jerome Blake +10 XP; Negotiation +10 XP.
- Flexible XP: None.
- Required choice: Select ComStar or Word of Blake as the order sub-affiliation, and select a second “birth” affiliation.
- Birth-affiliation requirement: The character must also select a second “birth” affiliation because few people are born to either order.
- Restrictions: Characters with a ComStar/Word of Blake affiliation may not possess the Extra Income or Property Traits.
- Special rule: Unlike normal Affiliation changes, selecting a ComStar or Word of Blake affiliation does not reduce the XP costs or effects of the character’s “birth” affiliation.
- Cross-reference: The page-74 rule refers to the character’s birth affiliation and normal Affiliation changes; no separate page reference is printed in this table.

## Order sub-affiliations

### ComStar

- Source ID: `CORE-STAGE0-ORDER-COMSTAR`
- Exact published name: ComStar
- Parent/order package: ComStar/Word of Blake
- Printed page: 74
- Source-defined affiliation type: ComStar order sub-affiliation.
- Additional awards:
  - Attributes: INT +25 XP; WIL -15 XP.
  - Traits: Connections +50 XP; Enemy/Word of Blake -100 XP; Reputation +20 XP.
  - Skills: Protocol/Nearest state +15 XP; Protocol/ComStar +15 XP; Technician/Any +10 XP.
- Primary and secondary language: Inherited from the shared order package: English primary; any language from the nearest state as secondary.
- Flexible XP: None separately specified.
- Required choices: Select the nearest-state destination for Protocol/Nearest state and the concrete Technician/Any destination.
- Birth-affiliation requirement: The shared order package requires a second birth affiliation; this sub-affiliation does not remove or replace that requirement.
- Restrictions and special rules: Shared ComStar/Word of Blake restrictions and birth-affiliation rule apply.

### Word of Blake

- Source ID: `CORE-STAGE0-ORDER-WORD-OF-BLAKE`
- Exact published name: Word of Blake
- Parent/order package: ComStar/Word of Blake
- Printed page: 74
- Source-defined affiliation type: Word of Blake order sub-affiliation.
- Additional awards:
  - Attributes: WIL +50 XP; CHA -50 XP.
  - Traits: Compulsion/Paranoid -50 XP; Connections +75 XP; Enemy/ComStar -100 XP; Equipped +30 XP.
  - Skills: Interest/Writings of Jerome Blake +15 XP; Interest/Writings of the Master +15 XP; Negotiation +10 XP; Protocol/Nearest state +5 XP; Protocol/Word of Blake +10 XP; Technician/Any +10 XP.
- Primary and secondary language: Inherited from the shared order package: English primary; any language from the nearest state as secondary.
- Flexible XP: None separately specified.
- Required choices: Select the nearest-state destination for Protocol/Nearest state and the concrete Technician/Any destination.
- Birth-affiliation requirement: The shared order package requires a second birth affiliation; this sub-affiliation does not remove or replace that requirement.
- Restrictions and special rules: Shared ComStar/Word of Blake restrictions and birth-affiliation rule apply.

## Shared rules and cross-references

- The order affiliation costs 50 XP plus the XP cost of the character’s birth affiliation.
- The character must select a second birth affiliation when choosing this affiliation.
- The order package preserves the full XP costs and effects of the selected birth affiliation; it does not apply the normal reduction associated with an Affiliation change.
- The published text states that few people are born to either order, distinguishing the order affiliation from the birth affiliation.
- Extra Income and Property are prohibited for characters with a ComStar/Word of Blake affiliation.
- The shared package grants English as primary language and permits any language from the nearest state as secondary language.
- ComStar and Word of Blake have distinct sub-affiliation awards and opposed Enemy subjects: Enemy/Word of Blake for ComStar and Enemy/ComStar for Word of Blake.
- No flexible XP is printed for the shared package or either order sub-affiliation.

## Errata reconciliation

- The v4.0 errata was checked for page-74 affiliation corrections.
- No erratum changes the ComStar/Word of Blake module cost, languages, fixed XP, sub-affiliation awards, order-selection rule, birth-affiliation requirement, or Extra Income/Property restriction.
- The errata contains a separate “Under ComStar/Word of Blake” entry for equipment ratings, changing the Helmet rating from `F/D-D-D/F` to `F/X-D-D/F` and the Suit rating from `D/E-E-E/E` to `E/X-E-D/E`. That correction is outside the page-74 affiliation table and is not applied to this source ledger.

## Source verification notes

- The exact local source files and previously verified SHA-256 identities were used:
  - Corrected Third Printing: `32D9B06655D1A0A108CD7F6B6ED9EFDA41A9673671E9ADEB285A02A5B769EF37`.
  - v4.0 Errata: `998141687F3F71F8347DA46FC4C2A87C9595CF37B75CAFDB0EEBB88301E453EF`.
- The authoritative PDF was rendered with Poppler at 220 DPI using PDF page 76 for printed page 74 and visually inspected.
- The complete shared package, both sub-affiliation rows, the Flexible XPs row, and the Notes block match the ledger.
- Status: **SOURCE VERIFIED - IMPLEMENTATION NOT ASSESSED**.


--- END page-74-comstar-word-of-blake.md ---
