import { describe, expect, it } from 'vitest'
import {
  AGITATOR_ID,
  BACK_WOODS_ID,
  BLUE_COLLAR_ID,
  CAPELLAN_COMMONALITY_ID,
  LIFE_MODULE_CATALOG,
  STAGE_2_BACK_WOODS_ID,
  STAGE_2_HIGH_SCHOOL_ID,
  TECHNICAL_COLLEGE_ID,
  UNIVERSAL_STAGE_0_ID,
  validateLifeModuleCatalog,
} from './catalog'

describe('Life Module Alpha catalog', () => {
  it('contains the eight audited Core entries through the minimal Stage 4 branch', () => {
    expect(LIFE_MODULE_CATALOG.map((entry) => entry.id)).toEqual([
      UNIVERSAL_STAGE_0_ID,
      CAPELLAN_COMMONALITY_ID,
      BLUE_COLLAR_ID,
      BACK_WOODS_ID,
      STAGE_2_BACK_WOODS_ID,
      STAGE_2_HIGH_SCHOOL_ID,
      TECHNICAL_COLLEGE_ID,
      AGITATOR_ID,
    ])
    expect(validateLifeModuleCatalog()).toEqual([])
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
