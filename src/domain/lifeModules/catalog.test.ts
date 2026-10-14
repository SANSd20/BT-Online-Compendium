import { describe, expect, it } from 'vitest'
import { INFANTRY_ANTI_MECH_FIELD_ID } from '../skillFields/catalog'
import {
  AGITATOR_ID,
  CLAN_CIVILIAN_JOB_ID,
  CLAN_SCIENTIST_CASTE_SERVICE_ID,
  CLAN_WATCH_OPERATIVE_ID,
  BACK_WOODS_ID,
  BLUE_COLLAR_ID,
  TRUEBORN_CRECHE_ID,
  CLAN_APPRENTICESHIP_ID,
  TRUEBORN_SIBKO_ID,
  FARM_ID,
  CAPELLAN_COMMONALITY_ID,
  COMSTAR_ORDER_ID,
  COMSTAR_WOB_SERVICE_ID,
  TRAVEL_ID,
  FEDERATED_SUNS_CRUCIS_MARCH_ID,
  FEDERATED_SUNS_CAPELLAN_MARCH_ID,
  FEDERATED_SUNS_DRACONIS_MARCH_ID,
  FEDERATED_SUNS_OUTBACK_ID,
  FAMILY_TRAINING_ID,
  INTELLIGENCE_OPERATIVE_TRAINING_ID,
  LIFE_MODULE_CATALOG,
  MILITARY_ACADEMY_ID,
  MILITARY_SCHOOL_ID,
  MILITARY_ENLISTMENT_ID,
  OFFICER_TRAINING_SCHOOL_ID,
  POLICE_ACADEMY_ID,
  SOLARIS_INTERNSHIP_ID,
  STAGE_2_BACK_WOODS_ID,
  STAGE_2_HIGH_SCHOOL_ID,
  WAR_ORPHAN_ID,
  TECHNICAL_COLLEGE_ID,
  TRADE_SCHOOL_ID,
  UNIVERSITY_ID,
  UNIVERSAL_STAGE_0_ID,
  WORD_OF_BLAKE_ORDER_ID,
  validateLifeModuleCatalog,
  CONDITIONAL_LIFE_MODULE_PACKAGE_CATALOG,
} from './catalog'
import { BASIC_TRAINING_FIELD_ID, BASIC_TRAINING_NAVAL_FIELD_ID, CAVALRY_FIELD_ID, DETECTIVE_FIELD_ID, INTELLIGENCE_FIELD_ID, MARINE_FIELD_ID, OFFICER_FIELD_ID, POLICE_OFFICER_FIELD_ID, SCOUT_FIELD_ID, SHIPS_CREW_FIELD_ID, TECHNICIAN_AEROSPACE_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID } from '../skillFields/catalog'

describe('Life Module Alpha catalog', () => {
  it('contains the audited Core entries through the minimal Stage 4 branch', () => {
    expect(LIFE_MODULE_CATALOG.map((entry) => entry.id)).toEqual([
      FEDERATED_SUNS_CAPELLAN_MARCH_ID,
      FEDERATED_SUNS_DRACONIS_MARCH_ID,
      UNIVERSAL_STAGE_0_ID,
      FEDERATED_SUNS_OUTBACK_ID,
      CAPELLAN_COMMONALITY_ID,
      FEDERATED_SUNS_CRUCIS_MARCH_ID,
      COMSTAR_ORDER_ID,
      WORD_OF_BLAKE_ORDER_ID,
      BLUE_COLLAR_ID,
      BACK_WOODS_ID,
      FARM_ID,
      WAR_ORPHAN_ID,
      STAGE_2_BACK_WOODS_ID,
      STAGE_2_HIGH_SCHOOL_ID,
      MILITARY_SCHOOL_ID,
      TECHNICAL_COLLEGE_ID,
      TRADE_SCHOOL_ID,
      UNIVERSITY_ID,
      SOLARIS_INTERNSHIP_ID,
      POLICE_ACADEMY_ID,
      INTELLIGENCE_OPERATIVE_TRAINING_ID,
      MILITARY_ACADEMY_ID,
      MILITARY_ENLISTMENT_ID,
      FAMILY_TRAINING_ID,
      OFFICER_TRAINING_SCHOOL_ID,
      COMSTAR_WOB_SERVICE_ID,
      TRAVEL_ID,
      AGITATOR_ID,
      TRUEBORN_CRECHE_ID,
      CLAN_APPRENTICESHIP_ID,
      TRUEBORN_SIBKO_ID,
      CLAN_CIVILIAN_JOB_ID,
      CLAN_WATCH_OPERATIVE_ID,
      CLAN_SCIENTIST_CASTE_SERVICE_ID,
    ])
    expect(validateLifeModuleCatalog()).toEqual([])
    expect(LIFE_MODULE_CATALOG.filter((entry) => entry.stage === 1)).toHaveLength(5)
    expect(LIFE_MODULE_CATALOG.filter((entry) => entry.stage === 2)).toHaveLength(5)
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === FARM_ID)).toMatchObject({ costXp: 275, chronologyYears: 10, source: { page: 77 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === WAR_ORPHAN_ID)).toMatchObject({ costXp: 170, chronologyYears: 10, source: { page: 78 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === TRUEBORN_CRECHE_ID)).toMatchObject({ displayName: 'Trueborn Crèche', stage: 1, costXp: 300, chronologyYears: 10, source: { page: 76 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === CLAN_APPRENTICESHIP_ID)).toMatchObject({ displayName: 'Clan Apprenticeship', stage: 2, costXp: 500, chronologyYears: 16, source: { page: 77 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === TRUEBORN_SIBKO_ID)).toMatchObject({ displayName: 'Trueborn Sibko', stage: 2, costXp: 1600, chronologyYears: 16, source: { page: 79 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_SCHOOL_ID)).toMatchObject({ costXp: 500, chronologyYears: 16, source: { page: 80 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === TECHNICAL_COLLEGE_ID)).toMatchObject({ stage3School: { classification: 'general', family: 'civilian' } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === TRADE_SCHOOL_ID)).toMatchObject({ costXp: 560, stage3School: { classification: 'general', family: 'civilian' } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === UNIVERSITY_ID)).toMatchObject({ costXp: 710, stage3School: { classification: 'general', family: 'civilian' } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === SOLARIS_INTERNSHIP_ID)).toMatchObject({ costXp: 700, stage3School: { classification: 'general', family: 'civilian' }, skillFieldSelection: { exactlyBasic: 1, minimumAdvanced: 1, maximumTotal: 3 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === POLICE_ACADEMY_ID)).toMatchObject({ costXp: 680, stage3School: { classification: 'general', family: 'intelligence-police' } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === INTELLIGENCE_OPERATIVE_TRAINING_ID)).toMatchObject({
      costXp: 760,
      stage3School: { classification: 'general', family: 'intelligence-police' },
      prerequisites: expect.arrayContaining([
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 4 }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'WIL', minimum: 5 }),
        expect.objectContaining({ kind: 'trait-minimum', traitId: 'trait.connections', minimum: 2 }),
      ]),
    })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ACADEMY_ID)).toMatchObject({ costXp: 830, stage3School: { classification: 'general', family: 'military' }, skillFieldSelection: { exactlyBasic: 1, minimumAdvanced: 1, maximumTotal: 3 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ENLISTMENT_ID)).toMatchObject({ costXp: 720, stage3School: { classification: 'general', family: 'military' }, skillFieldSelection: { exactlyBasic: 1, minimumAdvanced: 1, maximumTotal: 3 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === FAMILY_TRAINING_ID)).toMatchObject({ costXp: 570, stage3School: { classification: 'general', family: 'military' }, skillFieldSelection: { exactlyBasic: 1, minimumAdvanced: 1, maximumTotal: 3 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === OFFICER_TRAINING_SCHOOL_ID)).toMatchObject({
      displayName: 'Officer Candidate School', costXp: 550,
      stage3School: { classification: 'secondary' },
      skillFieldSelection: { exactlyBasic: 1, minimumAdvanced: 0, maximumTotal: 1, offers: [{ fieldId: OFFICER_FIELD_ID, category: 'basic', chronologyYears: 1 }] },
      awards: expect.arrayContaining([
        expect.objectContaining({ id: 'officer-candidate-school.attribute.cha', xp: 100 }),
        expect.objectContaining({ id: 'officer-candidate-school.attribute.edg', xp: -200 }),
        expect.objectContaining({ id: 'officer-candidate-school.trait.rank', xp: 250 }),
        expect.objectContaining({ id: 'officer-candidate-school.skill.protocol-affiliation', xp: 25 }),
        expect.objectContaining({ id: 'officer-candidate-school.flexible', totalXp: 115 }),
      ]),
    })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === TRAVEL_ID)).toMatchObject({ costXp: 700, chronologyYears: 6, source: { page: 91 }, awards: expect.arrayContaining([
      expect.objectContaining({ id: 'travel.attribute.int', xp: 45 }),
      expect.objectContaining({ id: 'travel.flexible', totalXp: 110 }),
    ]) })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ACADEMY_ID)?.skillFieldSelection?.offers).toContainEqual(expect.objectContaining({ fieldId: 'field.mechwarrior', category: 'advanced', awardedXpPerSkill: 30, costXpPerSkill: 24, chronologyYears: 1 }))
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ACADEMY_ID)?.skillFieldSelection?.referenceOnlyOffers?.some((entry) => entry.displayName === 'MechWarrior')).toBe(false)
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ENLISTMENT_ID)?.skillFieldSelection?.offers.some((entry) => entry.fieldId === 'field.mechwarrior')).toBe(false)
    const academyOffers = LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ACADEMY_ID)?.skillFieldSelection?.offers ?? []
    const enlistmentOffers = LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ENLISTMENT_ID)?.skillFieldSelection?.offers ?? []
    expect(academyOffers).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldId: INFANTRY_ANTI_MECH_FIELD_ID, category: 'special', chronologyYears: 2 }),
      expect.objectContaining({ fieldId: BASIC_TRAINING_NAVAL_FIELD_ID, category: 'basic', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: CAVALRY_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: MARINE_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: SHIPS_CREW_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: SCOUT_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
    ]))
    expect(academyOffers.some((entry) => entry.fieldId === TECHNICIAN_MILITARY_FIELD_ID)).toBe(false)
    expect(enlistmentOffers).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldId: INFANTRY_ANTI_MECH_FIELD_ID, category: 'special', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: BASIC_TRAINING_NAVAL_FIELD_ID, category: 'basic', chronologyYears: 0.5 }),
      expect.objectContaining({ fieldId: CAVALRY_FIELD_ID, category: 'advanced', chronologyYears: 1.5 }),
      expect.objectContaining({ fieldId: MARINE_FIELD_ID, category: 'advanced', chronologyYears: 1.5 }),
      expect.objectContaining({ fieldId: SHIPS_CREW_FIELD_ID, category: 'advanced', chronologyYears: 1.5 }),
      expect.objectContaining({ fieldId: TECHNICIAN_MILITARY_FIELD_ID, category: 'advanced', chronologyYears: 1.5 }),
      expect.objectContaining({ fieldId: SCOUT_FIELD_ID, category: 'advanced', chronologyYears: 1.5 }),
    ]))
    expect([academyOffers, enlistmentOffers].every((offers) => new Set(offers.map((entry) => entry.fieldId)).size === offers.length)).toBe(true)
    expect([MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID].every((id) => LIFE_MODULE_CATALOG.find((entry) => entry.id === id)?.skillFieldSelection?.referenceOnlyOffers?.some((entry) => entry.displayName === 'Cavalry') === false)).toBe(true)
    expect([MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID].every((id) => LIFE_MODULE_CATALOG.find((entry) => entry.id === id)?.skillFieldSelection?.referenceOnlyOffers?.some((entry) => entry.displayName === 'Scout') === false)).toBe(true)
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === POLICE_ACADEMY_ID)?.skillFieldSelection?.offers).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldId: POLICE_OFFICER_FIELD_ID, category: 'basic', chronologyYears: 0.5 }),
      expect.objectContaining({ fieldId: DETECTIVE_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: INTELLIGENCE_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: TECHNICIAN_MILITARY_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: TECHNICIAN_AEROSPACE_FIELD_ID, category: 'special', chronologyYears: 2 }),
      expect.objectContaining({ fieldId: TECHNICIAN_VEHICLE_FIELD_ID, category: 'special', chronologyYears: 2 }),
    ]))
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === INTELLIGENCE_OPERATIVE_TRAINING_ID)?.skillFieldSelection?.offers).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldId: BASIC_TRAINING_FIELD_ID, category: 'basic', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: POLICE_OFFICER_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: SCOUT_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
    ]))
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === AGITATOR_ID)).toMatchObject({
      stage: 4,
      costXp: 900,
      chronologyYears: 4,
      repeatPolicy: {
        sameModuleRepeat: 'deferred',
        repeatCost: 'full-module-cost',
        repeatAwards: {
          skills: 'repeat',
          flexibleXp: 'repeat',
          attributes: 'first-occurrence-only',
          traits: 'first-occurrence-only',
        },
      },
    })
  })

  it('detects duplicate module IDs', () => {
    const universal = LIFE_MODULE_CATALOG.find((entry) => entry.id === UNIVERSAL_STAGE_0_ID)!
    const duplicate = [universal, structuredClone(universal)]
    expect(validateLifeModuleCatalog(duplicate)).toEqual(expect.arrayContaining([
      expect.objectContaining({ moduleId: UNIVERSAL_STAGE_0_ID, message: expect.stringContaining('Duplicate') }),
    ]))
  })

  it('keeps Clan branches atomic and unsupported branches deferred', () => {
    expect(CONDITIONAL_LIFE_MODULE_PACKAGE_CATALOG).toHaveLength(4)
    const apprenticeship = CONDITIONAL_LIFE_MODULE_PACKAGE_CATALOG.find((entry) => entry.id === 'package.clan-apprenticeship-branch')!
    expect(apprenticeship.choices.map((entry) => entry.id)).toEqual(['branch.aerospace', 'branch.elemental', 'branch.mechwarrior'])
    expect(apprenticeship.choices.find((entry) => entry.id === 'branch.aerospace')?.awards).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'field-grant', fieldId: 'field.clan-aerospace-warrior', purchaseCostXp: 200 }),
    ]))
    expect(apprenticeship.choices.map((entry) => entry.displayName)).not.toContain('Cavalry')
    expect(apprenticeship.choices.map((entry) => entry.displayName)).not.toContain('ProtoMech')
  })
})
