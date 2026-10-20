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
