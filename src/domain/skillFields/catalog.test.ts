import { describe, expect, it } from 'vitest'
import { ANTHROPOLOGIST_FIELD_ID, ARCHAEOLOGIST_FIELD_ID, BASIC_TRAINING_FIELD_ID, BASIC_TRAINING_NAVAL_FIELD_ID, CARTOGRAPHER_FIELD_ID, CAVALRY_FIELD_ID, CAVALRY_TACTICS_SUBSKILLS, DETECTIVE_FIELD_ID, DRIVING_SUBSKILLS, GENERAL_STUDIES_FIELD_ID, INFANTRY_FIELD_ID, INTELLIGENCE_FIELD_ID, LAWYER_FIELD_ID, MANAGER_FIELD_ID, MARINE_FIELD_ID, MECHWARRIOR_FIELD_ID, NAVAL_CAREER_SUBSKILLS, OFFICER_FIELD_ID, PLANETARY_SURVEYOR_FIELD_ID, PILOT_EXOSKELETON_FIELD_ID, PILOT_INDUSTRIALMECH_FIELD_ID, POLICE_OFFICER_FIELD_ID, POLITICIAN_FIELD_ID, SCOUT_FIELD_ID, SCOUT_STREETWISE_SUBSKILLS, SECURITY_SYSTEMS_SUBSKILLS, SHIPS_CREW_FIELD_ID, SKILL_FIELD_CATALOG, skillFieldCost, TECHNICIAN_AEROSPACE_FIELD_ID, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_MECH_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID, TECHNICIAN_SUBSKILLS, TECHNICIAN_VEHICLE_FIELD_ID, TRACKING_SUBSKILLS, validateSkillFieldCatalog, VEHICLE_GUNNERY_SUBSKILLS } from './catalog'
import { MODELED_LANGUAGE_SUBSKILLS } from '../skills/languages'

describe('bounded mechanically acquirable Stage 3 Skill Field catalog', () => {
  it('contains the thirty-nine source-audited Fields with calculated reduced costs', () => {
    expect(SKILL_FIELD_CATALOG.map((entry) => entry.id)).toEqual([
      BASIC_TRAINING_FIELD_ID,
      BASIC_TRAINING_NAVAL_FIELD_ID,
      POLICE_OFFICER_FIELD_ID,
      DETECTIVE_FIELD_ID,
      INTELLIGENCE_FIELD_ID,
      TECHNICIAN_CIVILIAN_FIELD_ID,
      OFFICER_FIELD_ID,
      TECHNICIAN_VEHICLE_FIELD_ID,
      PILOT_EXOSKELETON_FIELD_ID,
      CARTOGRAPHER_FIELD_ID,
      PILOT_INDUSTRIALMECH_FIELD_ID,
      TECHNICIAN_AEROSPACE_FIELD_ID,
      TECHNICIAN_MECH_FIELD_ID,
      INFANTRY_FIELD_ID,
      CAVALRY_FIELD_ID,
      MECHWARRIOR_FIELD_ID,
      SCOUT_FIELD_ID,
      MARINE_FIELD_ID,
      SHIPS_CREW_FIELD_ID,
      TECHNICIAN_MILITARY_FIELD_ID,
      'field.communications',
      'field.engineer',
      'field.merchant-marine',
      'field.pilot-aircraft-civilian',
      'field.medical-assistant',
      'field.doctor',
      'field.analysis',
      'field.covert-operations',
      'field.police-tactical-officer',
      'field.military-scientist',
      'field.scientist',
      'field.special-forces',
      MANAGER_FIELD_ID,
      PLANETARY_SURVEYOR_FIELD_ID,
      POLITICIAN_FIELD_ID,
      GENERAL_STUDIES_FIELD_ID,
      ANTHROPOLOGIST_FIELD_ID,
      ARCHAEOLOGIST_FIELD_ID,
      LAWYER_FIELD_ID,
    ])
    expect(Object.fromEntries(SKILL_FIELD_CATALOG.slice(1).map((field) => [field.id, skillFieldCost(field, 24)]))).toEqual({
      [BASIC_TRAINING_NAVAL_FIELD_ID]: 144,
      [POLICE_OFFICER_FIELD_ID]: 168,
      [DETECTIVE_FIELD_ID]: 168,
      [INTELLIGENCE_FIELD_ID]: 120,
      [TECHNICIAN_CIVILIAN_FIELD_ID]: 120,
      [OFFICER_FIELD_ID]: 120,
      [TECHNICIAN_VEHICLE_FIELD_ID]: 96,
      [PILOT_EXOSKELETON_FIELD_ID]: 120,
      [CARTOGRAPHER_FIELD_ID]: 144,
      [PILOT_INDUSTRIALMECH_FIELD_ID]: 120,
      [TECHNICIAN_AEROSPACE_FIELD_ID]: 120,
      [TECHNICIAN_MECH_FIELD_ID]: 120,
      [INFANTRY_FIELD_ID]: 144,
      [CAVALRY_FIELD_ID]: 144,
      [MECHWARRIOR_FIELD_ID]: 120,
      [SCOUT_FIELD_ID]: 168,
      [MARINE_FIELD_ID]: 120,
      [SHIPS_CREW_FIELD_ID]: 120,
      [TECHNICIAN_MILITARY_FIELD_ID]: 144,
      'field.communications': 144,
      'field.engineer': 120,
      'field.merchant-marine': 120,
      'field.pilot-aircraft-civilian': 120,
      'field.medical-assistant': 120,
      'field.doctor': 120,
      'field.analysis': 168,
      'field.covert-operations': 168,
      'field.police-tactical-officer': 168,
      'field.military-scientist': 144,
      'field.scientist': 168,
      'field.special-forces': 144,
      [MANAGER_FIELD_ID]: 144,
      [PLANETARY_SURVEYOR_FIELD_ID]: 120,
      [POLITICIAN_FIELD_ID]: 120,
      [GENERAL_STUDIES_FIELD_ID]: 120,
      [ANTHROPOLOGIST_FIELD_ID]: 144,
      [ARCHAEOLOGIST_FIELD_ID]: 144,
      [LAWYER_FIELD_ID]: 144,
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
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === OFFICER_FIELD_ID)).toMatchObject({
      displayName: 'Officer', category: 'basic',
      prerequisites: [
        expect.objectContaining({ kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID, BASIC_TRAINING_NAVAL_FIELD_ID] }),
        expect.objectContaining({ kind: 'trait-minimum', traitId: 'trait.rank', minimum: 4 }),
      ],
      componentSkills: [
        expect.objectContaining({ displayName: 'Administration' }),
        expect.objectContaining({ displayName: 'Leadership' }),
        expect.objectContaining({ displayName: 'Melee Weapons' }),
        expect.objectContaining({ displayName: 'Training' }),
      ],
      affiliationBoundComponentSkills: [{ skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' }],
    })
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
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === SCOUT_FIELD_ID)).toMatchObject({
      category: 'advanced',
      prerequisites: expect.arrayContaining([
        expect.objectContaining({ kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID] }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 4 }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'WIL', minimum: 3 }),
        expect.objectContaining({ kind: 'trait-absent', traitId: 'trait.illiterate' }),
      ]),
      componentSkills: [
        expect.objectContaining({ displayName: 'Comms/Conventional' }),
        expect.objectContaining({ displayName: 'Disguise' }),
        expect.objectContaining({ displayName: 'Stealth' }),
      ],
      variableComponentSkills: [
        expect.objectContaining({ skillId: 'skill.language', legalSubskills: [...MODELED_LANGUAGE_SUBSKILLS] }),
        expect.objectContaining({ skillId: 'skill.security-systems', legalSubskills: [...SECURITY_SYSTEMS_SUBSKILLS] }),
        expect.objectContaining({ skillId: 'skill.streetwise', legalSubskills: [...SCOUT_STREETWISE_SUBSKILLS] }),
        expect.objectContaining({ skillId: 'skill.tracking', legalSubskills: [...TRACKING_SUBSKILLS] }),
      ],
    })
    expect(skillFieldCost(SKILL_FIELD_CATALOG.find((entry) => entry.id === SCOUT_FIELD_ID)!, 24)).toBe(168)
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
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === POLICE_OFFICER_FIELD_ID)).toMatchObject({
      category: 'basic',
      variableComponentSkills: [expect.objectContaining({ skillId: 'skill.driving', legalSubskills: [...DRIVING_SUBSKILLS] })],
      affiliationBoundComponentSkills: [expect.objectContaining({ skillId: 'skill.streetwise' })],
    })
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === DETECTIVE_FIELD_ID)).toMatchObject({
      category: 'advanced',
      variableComponentSkills: [expect.objectContaining({ skillId: 'skill.security-systems', legalSubskills: [...SECURITY_SYSTEMS_SUBSKILLS] })],
      affiliationBoundComponentSkills: [expect.objectContaining({ skillId: 'skill.streetwise' })],
    })
    expect(SKILL_FIELD_CATALOG.find((entry) => entry.id === INTELLIGENCE_FIELD_ID)).toMatchObject({
      category: 'advanced',
      variableComponentSkills: [expect.objectContaining({ skillId: 'skill.language', legalSubskills: [...MODELED_LANGUAGE_SUBSKILLS] })],
    })
  })

  it('detects duplicate Field IDs', () => {
    const duplicate = [SKILL_FIELD_CATALOG[0], structuredClone(SKILL_FIELD_CATALOG[0])]
    expect(validateSkillFieldCatalog(duplicate)).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldId: BASIC_TRAINING_FIELD_ID, message: expect.stringContaining('Duplicate') }),
    ]))
  })
})
