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
