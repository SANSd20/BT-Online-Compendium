import { describe, expect, it } from 'vitest'
import { BASIC_TRAINING_FIELD_ID, BASIC_TRAINING_NAVAL_FIELD_ID, CARTOGRAPHER_FIELD_ID, CAVALRY_FIELD_ID, CAVALRY_TACTICS_SUBSKILLS, DRIVING_SUBSKILLS, INFANTRY_FIELD_ID, MARINE_FIELD_ID, MECHWARRIOR_FIELD_ID, NAVAL_CAREER_SUBSKILLS, PILOT_EXOSKELETON_FIELD_ID, PILOT_INDUSTRIALMECH_FIELD_ID, SECURITY_SYSTEMS_SUBSKILLS, SHIPS_CREW_FIELD_ID, SKILL_FIELD_CATALOG, skillFieldCost, TECHNICIAN_AEROSPACE_FIELD_ID, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_MECH_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID, TECHNICIAN_SUBSKILLS, TECHNICIAN_VEHICLE_FIELD_ID, validateSkillFieldCatalog, VEHICLE_GUNNERY_SUBSKILLS } from './catalog'

describe('bounded mechanically acquirable Stage 3 Skill Field catalog', () => {
  it('contains the fifteen source-audited Fields with calculated reduced costs', () => {
    expect(SKILL_FIELD_CATALOG.map((entry) => entry.id)).toEqual([
      BASIC_TRAINING_FIELD_ID,
      BASIC_TRAINING_NAVAL_FIELD_ID,
      TECHNICIAN_CIVILIAN_FIELD_ID,
      TECHNICIAN_VEHICLE_FIELD_ID,
      PILOT_EXOSKELETON_FIELD_ID,
      CARTOGRAPHER_FIELD_ID,
      PILOT_INDUSTRIALMECH_FIELD_ID,
      TECHNICIAN_AEROSPACE_FIELD_ID,
      TECHNICIAN_MECH_FIELD_ID,
      INFANTRY_FIELD_ID,
      CAVALRY_FIELD_ID,
      MECHWARRIOR_FIELD_ID,
      MARINE_FIELD_ID,
      SHIPS_CREW_FIELD_ID,
      TECHNICIAN_MILITARY_FIELD_ID,
    ])
    expect(Object.fromEntries(SKILL_FIELD_CATALOG.slice(1).map((field) => [field.id, skillFieldCost(field, 24)]))).toEqual({
      [BASIC_TRAINING_NAVAL_FIELD_ID]: 144,
      [TECHNICIAN_CIVILIAN_FIELD_ID]: 120,
      [TECHNICIAN_VEHICLE_FIELD_ID]: 96,
      [PILOT_EXOSKELETON_FIELD_ID]: 120,
      [CARTOGRAPHER_FIELD_ID]: 144,
      [PILOT_INDUSTRIALMECH_FIELD_ID]: 120,
      [TECHNICIAN_AEROSPACE_FIELD_ID]: 120,
      [TECHNICIAN_MECH_FIELD_ID]: 120,
      [INFANTRY_FIELD_ID]: 144,
      [CAVALRY_FIELD_ID]: 144,
      [MECHWARRIOR_FIELD_ID]: 120,
      [MARINE_FIELD_ID]: 120,
      [SHIPS_CREW_FIELD_ID]: 120,
      [TECHNICIAN_MILITARY_FIELD_ID]: 144,
    })
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === TECHNICIAN_AEROSPACE_FIELD_ID)?.prerequisites).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'skill-field', fieldIds: [TECHNICIAN_CIVILIAN_FIELD_ID, 'field.technician-military'] }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 4 }),
    ]))
    expect(Object.fromEntries(SKILL_FIELD_CATALOG.filter((field) => [PILOT_EXOSKELETON_FIELD_ID, CARTOGRAPHER_FIELD_ID, PILOT_INDUSTRIALMECH_FIELD_ID, TECHNICIAN_AEROSPACE_FIELD_ID, TECHNICIAN_MECH_FIELD_ID].includes(field.id)).map((field) => [field.id, field.componentSkills.map((entry) => entry.displayName)]))).toEqual({
      [PILOT_EXOSKELETON_FIELD_ID]: ['Piloting/Battlesuit', 'Sensor Operations', 'Technician/Electronic', 'Technician/Mechanical', 'Technician/Myomer'],
      [CARTOGRAPHER_FIELD_ID]: ['Career/Cartographer', 'Computers', 'Navigation/Air', 'Navigation/Ground', 'Perception', 'Sensor Operations'],
      [PILOT_INDUSTRIALMECH_FIELD_ID]: ['Piloting/Mech', 'Sensor Operations', 'Technician/Electronic', 'Technician/Mechanical', 'Technician/Myomer'],
      [TECHNICIAN_AEROSPACE_FIELD_ID]: ['Computers', 'Technician/Aeronautics', 'Technician/Nuclear', 'Technician/Jets', 'Zero-G Operations'],
      [TECHNICIAN_MECH_FIELD_ID]: ['Technician/Electronic', 'Technician/Jet', 'Technician/Mechanical', 'Technician/Myomer', 'Technician/Nuclear'],
    })
    expect(validateSkillFieldCatalog()).toEqual([])
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === INFANTRY_FIELD_ID)).toMatchObject({
      category: 'advanced',
      prerequisites: [expect.objectContaining({ kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID] })],
    })
    expect(skillFieldCost(SKILL_FIELD_CATALOG.find((entry) => entry.id === INFANTRY_FIELD_ID)!, 24)).toBe(144)
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === CAVALRY_FIELD_ID)).toMatchObject({
      category: 'advanced',
      prerequisites: [
        expect.objectContaining({ kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID] }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3 }),
      ],
      componentSkills: [
        expect.objectContaining({ displayName: 'Artillery' }),
        expect.objectContaining({ displayName: 'Sensor Operations' }),
        expect.objectContaining({ displayName: 'Technician/Mechanical' }),
      ],
      variableComponentSkills: [
        expect.objectContaining({ skillId: 'skill.driving', legalSubskills: [...DRIVING_SUBSKILLS] }),
        expect.objectContaining({ skillId: 'skill.gunnery', legalSubskills: [...VEHICLE_GUNNERY_SUBSKILLS] }),
        expect.objectContaining({ skillId: 'skill.tactics', legalSubskills: [...CAVALRY_TACTICS_SUBSKILLS] }),
      ],
    })
    expect(skillFieldCost(SKILL_FIELD_CATALOG.find((entry) => entry.id === CAVALRY_FIELD_ID)!, 24)).toBe(144)
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === MECHWARRIOR_FIELD_ID)).toMatchObject({
      category: 'advanced',
      prerequisites: [
        expect.objectContaining({ kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID] }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'DEX', minimum: 4 }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'RFL', minimum: 4 }),
      ],
      variableComponentSkills: [expect.objectContaining({ skillId: 'skill.technician', legalSubskills: [...TECHNICIAN_SUBSKILLS] })],
    })
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === BASIC_TRAINING_NAVAL_FIELD_ID)).toMatchObject({
      category: 'basic',
      prerequisites: expect.arrayContaining([
        expect.objectContaining({ kind: 'trait', traitId: 'trait.rank' }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 4 }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'RFL', minimum: 3 }),
        expect.objectContaining({ kind: 'trait-absent', traitId: 'trait.tds' }),
      ]),
      variableComponentSkills: [expect.objectContaining({ skillId: 'skill.career', legalSubskills: [...NAVAL_CAREER_SUBSKILLS] })],
    })
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === MARINE_FIELD_ID)).toMatchObject({
      category: 'advanced',
      prerequisites: expect.arrayContaining([
        expect.objectContaining({ kind: 'skill-field', fieldIds: [BASIC_TRAINING_NAVAL_FIELD_ID] }),
        expect.objectContaining({ kind: 'trait-absent', traitId: 'trait.tds' }),
      ]),
      variableComponentSkills: [expect.objectContaining({ skillId: 'skill.security-systems', legalSubskills: [...SECURITY_SYSTEMS_SUBSKILLS] })],
    })
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === SHIPS_CREW_FIELD_ID)).toMatchObject({
      category: 'advanced',
      prerequisites: expect.arrayContaining([
        expect.objectContaining({ kind: 'skill-field', fieldIds: [BASIC_TRAINING_NAVAL_FIELD_ID] }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'RFL', minimum: 3 }),
        expect.objectContaining({ kind: 'trait-absent', traitId: 'trait.tds' }),
      ]),
      variableComponentSkills: [expect.objectContaining({ skillId: 'skill.technician', legalSubskills: [...TECHNICIAN_SUBSKILLS] })],
    })
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === TECHNICIAN_MILITARY_FIELD_ID)?.componentSkills.map((entry) => entry.displayName)).toEqual([
      'Appraisal', 'Career/Technician', 'Technician/Electronic', 'Technician/Mechanical', 'Technician/Nuclear', 'Technician/Weapons',
    ])
  })

  it('detects duplicate Field IDs', () => {
    const duplicate = [SKILL_FIELD_CATALOG[0], structuredClone(SKILL_FIELD_CATALOG[0])]
    expect(validateSkillFieldCatalog(duplicate)).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldId: BASIC_TRAINING_FIELD_ID, message: expect.stringContaining('Duplicate') }),
    ]))
  })
})
