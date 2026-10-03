import { describe, expect, it } from 'vitest'
import { BASIC_TRAINING_FIELD_ID, CARTOGRAPHER_FIELD_ID, PILOT_EXOSKELETON_FIELD_ID, PILOT_INDUSTRIALMECH_FIELD_ID, SKILL_FIELD_CATALOG, skillFieldCost, TECHNICIAN_AEROSPACE_FIELD_ID, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_MECH_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID, validateSkillFieldCatalog } from './catalog'

describe('bounded mechanically acquirable Stage 3 Skill Field catalog', () => {
  it('contains the eight source-audited Fields with calculated reduced costs', () => {
    expect(SKILL_FIELD_CATALOG.map((entry) => entry.id)).toEqual([
      BASIC_TRAINING_FIELD_ID,
      TECHNICIAN_CIVILIAN_FIELD_ID,
      TECHNICIAN_VEHICLE_FIELD_ID,
      PILOT_EXOSKELETON_FIELD_ID,
      CARTOGRAPHER_FIELD_ID,
      PILOT_INDUSTRIALMECH_FIELD_ID,
      TECHNICIAN_AEROSPACE_FIELD_ID,
      TECHNICIAN_MECH_FIELD_ID,
    ])
    expect(Object.fromEntries(SKILL_FIELD_CATALOG.slice(1).map((field) => [field.id, skillFieldCost(field, 24)]))).toEqual({
      [TECHNICIAN_CIVILIAN_FIELD_ID]: 120,
      [TECHNICIAN_VEHICLE_FIELD_ID]: 96,
      [PILOT_EXOSKELETON_FIELD_ID]: 120,
      [CARTOGRAPHER_FIELD_ID]: 144,
      [PILOT_INDUSTRIALMECH_FIELD_ID]: 120,
      [TECHNICIAN_AEROSPACE_FIELD_ID]: 120,
      [TECHNICIAN_MECH_FIELD_ID]: 120,
    })
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === TECHNICIAN_AEROSPACE_FIELD_ID)?.prerequisites).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'skill-field', fieldIds: [TECHNICIAN_CIVILIAN_FIELD_ID, 'field.technician-military'] }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 4 }),
    ]))
    expect(validateSkillFieldCatalog()).toEqual([])
  })

  it('detects duplicate Field IDs', () => {
    const duplicate = [SKILL_FIELD_CATALOG[0], structuredClone(SKILL_FIELD_CATALOG[0])]
    expect(validateSkillFieldCatalog(duplicate)).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldId: BASIC_TRAINING_FIELD_ID, message: expect.stringContaining('Duplicate') }),
    ]))
  })
})
