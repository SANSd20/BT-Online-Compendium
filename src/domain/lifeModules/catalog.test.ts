import { describe, expect, it } from 'vitest'
import {
  AGITATOR_ID,
  BACK_WOODS_ID,
  BLUE_COLLAR_ID,
  CAPELLAN_COMMONALITY_ID,
  FEDERATED_SUNS_CRUCIS_MARCH_ID,
  LIFE_MODULE_CATALOG,
  MILITARY_ACADEMY_ID,
  MILITARY_ENLISTMENT_ID,
  STAGE_2_BACK_WOODS_ID,
  STAGE_2_HIGH_SCHOOL_ID,
  TECHNICAL_COLLEGE_ID,
  UNIVERSAL_STAGE_0_ID,
  validateLifeModuleCatalog,
} from './catalog'
import { BASIC_TRAINING_NAVAL_FIELD_ID, CAVALRY_FIELD_ID, MARINE_FIELD_ID, SHIPS_CREW_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID } from '../skillFields/catalog'

describe('Life Module Alpha catalog', () => {
  it('contains the eleven audited Core entries through the minimal Stage 4 branch', () => {
    expect(LIFE_MODULE_CATALOG.map((entry) => entry.id)).toEqual([
      UNIVERSAL_STAGE_0_ID,
      CAPELLAN_COMMONALITY_ID,
      FEDERATED_SUNS_CRUCIS_MARCH_ID,
      BLUE_COLLAR_ID,
      BACK_WOODS_ID,
      STAGE_2_BACK_WOODS_ID,
      STAGE_2_HIGH_SCHOOL_ID,
      TECHNICAL_COLLEGE_ID,
      MILITARY_ACADEMY_ID,
      MILITARY_ENLISTMENT_ID,
      AGITATOR_ID,
    ])
    expect(validateLifeModuleCatalog()).toEqual([])
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ACADEMY_ID)).toMatchObject({ costXp: 830, skillFieldSelection: { exactlyBasic: 1, minimumAdvanced: 1, maximumTotal: 3 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ENLISTMENT_ID)).toMatchObject({ costXp: 720, skillFieldSelection: { exactlyBasic: 1, minimumAdvanced: 1, maximumTotal: 3 } })
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ACADEMY_ID)?.skillFieldSelection?.offers).toContainEqual(expect.objectContaining({ fieldId: 'field.mechwarrior', category: 'advanced', awardedXpPerSkill: 30, costXpPerSkill: 24, chronologyYears: 1 }))
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ACADEMY_ID)?.skillFieldSelection?.referenceOnlyOffers?.some((entry) => entry.displayName === 'MechWarrior')).toBe(false)
    expect(LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ENLISTMENT_ID)?.skillFieldSelection?.offers.some((entry) => entry.fieldId === 'field.mechwarrior')).toBe(false)
    const academyOffers = LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ACADEMY_ID)?.skillFieldSelection?.offers ?? []
    const enlistmentOffers = LIFE_MODULE_CATALOG.find((entry) => entry.id === MILITARY_ENLISTMENT_ID)?.skillFieldSelection?.offers ?? []
    expect(academyOffers).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldId: BASIC_TRAINING_NAVAL_FIELD_ID, category: 'basic', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: CAVALRY_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: MARINE_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
      expect.objectContaining({ fieldId: SHIPS_CREW_FIELD_ID, category: 'advanced', chronologyYears: 1 }),
    ]))
    expect(academyOffers.some((entry) => entry.fieldId === TECHNICIAN_MILITARY_FIELD_ID)).toBe(false)
    expect(enlistmentOffers).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldId: BASIC_TRAINING_NAVAL_FIELD_ID, category: 'basic', chronologyYears: 0.5 }),
      expect.objectContaining({ fieldId: CAVALRY_FIELD_ID, category: 'advanced', chronologyYears: 1.5 }),
      expect.objectContaining({ fieldId: MARINE_FIELD_ID, category: 'advanced', chronologyYears: 1.5 }),
      expect.objectContaining({ fieldId: SHIPS_CREW_FIELD_ID, category: 'advanced', chronologyYears: 1.5 }),
      expect.objectContaining({ fieldId: TECHNICIAN_MILITARY_FIELD_ID, category: 'advanced', chronologyYears: 1.5 }),
    ]))
    expect([academyOffers, enlistmentOffers].every((offers) => new Set(offers.map((entry) => entry.fieldId)).size === offers.length)).toBe(true)
    expect([MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID].every((id) => LIFE_MODULE_CATALOG.find((entry) => entry.id === id)?.skillFieldSelection?.referenceOnlyOffers?.some((entry) => entry.displayName === 'Cavalry') === false)).toBe(true)
    expect([MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID].every((id) => LIFE_MODULE_CATALOG.find((entry) => entry.id === id)?.skillFieldSelection?.referenceOnlyOffers?.find((entry) => entry.displayName === 'Scout')?.reason.includes('Language/Any'))).toBe(true)
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
    const duplicate = [LIFE_MODULE_CATALOG[0], structuredClone(LIFE_MODULE_CATALOG[0])]
    expect(validateLifeModuleCatalog(duplicate)).toEqual(expect.arrayContaining([
      expect.objectContaining({ moduleId: UNIVERSAL_STAGE_0_ID, message: expect.stringContaining('Duplicate') }),
    ]))
  })
})
