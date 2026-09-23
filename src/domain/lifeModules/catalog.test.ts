import { describe, expect, it } from 'vitest'
import {
  BACK_WOODS_ID,
  BLUE_COLLAR_ID,
  CAPELLAN_COMMONALITY_ID,
  LIFE_MODULE_CATALOG,
  STAGE_2_BACK_WOODS_ID,
  STAGE_2_HIGH_SCHOOL_ID,
  UNIVERSAL_STAGE_0_ID,
  validateLifeModuleCatalog,
} from './catalog'

describe('Life Module Alpha catalog', () => {
  it('contains the six audited Core entries through Stage 2', () => {
    expect(LIFE_MODULE_CATALOG.map((entry) => entry.id)).toEqual([
      UNIVERSAL_STAGE_0_ID,
      CAPELLAN_COMMONALITY_ID,
      BLUE_COLLAR_ID,
      BACK_WOODS_ID,
      STAGE_2_BACK_WOODS_ID,
      STAGE_2_HIGH_SCHOOL_ID,
    ])
    expect(validateLifeModuleCatalog()).toEqual([])
  })

  it('detects duplicate module IDs', () => {
    const duplicate = [LIFE_MODULE_CATALOG[0], structuredClone(LIFE_MODULE_CATALOG[0])]
    expect(validateLifeModuleCatalog(duplicate)).toEqual(expect.arrayContaining([
      expect.objectContaining({ moduleId: UNIVERSAL_STAGE_0_ID, message: expect.stringContaining('Duplicate') }),
    ]))
  })
})
