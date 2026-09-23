import { describe, expect, it } from 'vitest'
import { SKILL_FIELD_CATALOG, skillFieldCost, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID, validateSkillFieldCatalog } from './catalog'

describe('minimal Stage 3 Skill Field catalog', () => {
  it('contains the audited Technician Fields with calculated costs', () => {
    expect(SKILL_FIELD_CATALOG.map((entry) => entry.id)).toEqual([TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID])
    expect(skillFieldCost(SKILL_FIELD_CATALOG[0], 24)).toBe(120)
    expect(skillFieldCost(SKILL_FIELD_CATALOG[1], 24)).toBe(96)
    expect(validateSkillFieldCatalog()).toEqual([])
  })

  it('detects duplicate Field IDs', () => {
    const duplicate = [SKILL_FIELD_CATALOG[0], structuredClone(SKILL_FIELD_CATALOG[0])]
    expect(validateSkillFieldCatalog(duplicate)).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldId: TECHNICIAN_CIVILIAN_FIELD_ID, message: expect.stringContaining('Duplicate') }),
    ]))
  })
})
