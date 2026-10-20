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
