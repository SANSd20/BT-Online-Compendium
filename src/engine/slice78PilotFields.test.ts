import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, FAMILY_TRAINING_ID, MILITARY_ACADEMY_ID, TECHNICAL_COLLEGE_ID } from '../domain/lifeModules/catalog'
import { BASIC_TRAINING_FIELD_ID, CARTOGRAPHER_FIELD_ID, PILOT_AEROSPACE_CIVILIAN_FIELD_ID, PILOT_AEROSPACE_COMBAT_FIELD_ID, PILOT_AIRCRAFT_COMBAT_FIELD_ID, SKILL_FIELD_CATALOG, skillFieldCost } from '../domain/skillFields/catalog'
import { applyCapellanCommonality, applyStage3School, applyUniversalStage0, createLifeModuleCharacter } from './lifeModuleEngine'

function stage3Draft() {
  let character = createLifeModuleCharacter('Aerospace Pilot')
  character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
  character.creation.lifeModules!.phase = 'stage-3-selection'
  character.creation.lifeModules!.currentStage = 3
  character.creation.lifeModules!.pendingAwards = []
  for (const [attributeId, purchasedLevel] of Object.entries({ DEX: 5, RFL: 5, INT: 4, WIL: 4 })) {
    const attribute = character.attributes.find((entry) => entry.attributeId === attributeId)!
    attribute.purchasedLevel = purchasedLevel
    attribute.accumulatedXp = purchasedLevel * 100
  }
  character.traits.push({ traitId: 'trait.rank', displayName: 'Rank', accumulatedXp: 100, attainedTp: 1, active: true, parameters: {}, sourceAwards: [] })
  character.traits.push({ traitId: 'trait.connections', displayName: 'Connections', accumulatedXp: 200, attainedTp: 2, active: true, parameters: {}, sourceAwards: [] })
  return character
}

describe('Alpha Slice 78 civilian and combat Pilot Fields', () => {
  it('models Civilian Aerospace exactly, without a source-invented TDS conflict', () => {
    const field = SKILL_FIELD_CATALOG.find((entry) => entry.id === PILOT_AEROSPACE_CIVILIAN_FIELD_ID)!
    expect(field).toMatchObject({ displayName: 'Pilot/Aerospace (Civilian)', category: 'basic' })
    expect(field.prerequisites).toEqual([
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3 }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'RFL', minimum: 4 }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 3 }),
    ])
    expect(field.prerequisites.some((entry) => entry.kind === 'trait-absent')).toBe(false)
    expect(field.componentSkills.map((entry) => entry.displayName)).toEqual(['Career/Aerospace Pilot', 'Comms/Conventional', 'Navigation/Air', 'Navigation/Space', 'Piloting/Aerospace', 'Sensor Operations'])
    expect(skillFieldCost(field, 24)).toBe(144)
  })

  it('models both Combat Fields independently from Civilian pilot Fields', () => {
    const aerospace = SKILL_FIELD_CATALOG.find((entry) => entry.id === PILOT_AEROSPACE_COMBAT_FIELD_ID)!
    const aircraft = SKILL_FIELD_CATALOG.find((entry) => entry.id === PILOT_AIRCRAFT_COMBAT_FIELD_ID)!
    for (const field of [aerospace, aircraft]) {
      expect(field.prerequisites[0]).toMatchObject({ kind: 'skill-field', fieldIds: ['field.basic-training', 'field.basic-training-naval'] })
      expect(field.prerequisites.some((entry) => entry.kind === 'trait-absent')).toBe(false)
      expect(field.prerequisites.some((entry) => entry.kind === 'skill-field' && entry.fieldIds?.includes(PILOT_AEROSPACE_CIVILIAN_FIELD_ID))).toBe(false)
    }
    expect(aerospace.componentSkills.map((entry) => entry.displayName)).toEqual(['Gunnery/Aerospace', 'Navigation/Air', 'Navigation/Space', 'Piloting/Aerospace', 'Sensor Operations', 'Tactics/Space', 'Zero-G Operations'])
    expect(aircraft.componentSkills.map((entry) => entry.displayName)).toEqual(['Gunnery/Air Vehicle', 'Navigation/Air', 'Piloting/Air Vehicle', 'Sensor Operations', 'Tactics/Air'])
    expect(skillFieldCost(aerospace, 24)).toBe(168)
    expect(skillFieldCost(aircraft, 24)).toBe(120)
  })

  it('uses exact school categories and times and satisfies combat prerequisites transactionally', () => {
    const technical = applyStage3School(stage3Draft(), TECHNICAL_COLLEGE_ID, [PILOT_AEROSPACE_CIVILIAN_FIELD_ID, CARTOGRAPHER_FIELD_ID])
    expect(technical.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_AEROSPACE_CIVILIAN_FIELD_ID)).toMatchObject({ category: 'basic', chronologyYears: 1, purchaseCostXp: 144, xpPerSkill: 30 })

    const academy = applyStage3School(stage3Draft(), MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, PILOT_AEROSPACE_COMBAT_FIELD_ID, PILOT_AIRCRAFT_COMBAT_FIELD_ID])
    expect(academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_AEROSPACE_COMBAT_FIELD_ID)).toMatchObject({ category: 'advanced', chronologyYears: 1, purchaseCostXp: 168 })
    expect(academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_AIRCRAFT_COMBAT_FIELD_ID)).toMatchObject({ category: 'advanced', chronologyYears: 1, purchaseCostXp: 120 })
    expect(academy.creation.lifeModules!.prerequisiteIssues.filter((entry) => [PILOT_AEROSPACE_COMBAT_FIELD_ID, PILOT_AIRCRAFT_COMBAT_FIELD_ID].includes(entry.moduleId) && entry.prerequisiteId.endsWith('.field'))).toEqual([
      expect.objectContaining({ moduleId: PILOT_AEROSPACE_COMBAT_FIELD_ID, status: 'satisfied' }),
      expect.objectContaining({ moduleId: PILOT_AIRCRAFT_COMBAT_FIELD_ID, status: 'satisfied' }),
    ])

    const family = applyStage3School(stage3Draft(), FAMILY_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, PILOT_AEROSPACE_COMBAT_FIELD_ID, PILOT_AIRCRAFT_COMBAT_FIELD_ID], 'Sian')
    expect(family.creation.lifeModules!.selectedSkillFields.filter((entry) => [PILOT_AEROSPACE_COMBAT_FIELD_ID, PILOT_AIRCRAFT_COMBAT_FIELD_ID].includes(entry.fieldId)).map((entry) => entry.chronologyYears)).toEqual([1.5, 1.5])
  })

  it('keeps preview input unchanged, cleans deselection, permits TDS, and round-trips without duplicates', () => {
    const input = stage3Draft()
    input.traits.push({ traitId: 'trait.tds', displayName: 'TDS', accumulatedXp: -100, attainedTp: -1, active: true, parameters: {}, sourceAwards: [] })
    const before = JSON.stringify(input)
    const selected = applyStage3School(input, MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, PILOT_AEROSPACE_COMBAT_FIELD_ID, PILOT_AIRCRAFT_COMBAT_FIELD_ID])
    expect(JSON.stringify(input)).toBe(before)
    expect(selected.creation.lifeModules!.prerequisiteIssues.some((entry) => entry.prerequisiteId.endsWith('.tds'))).toBe(false)
    expect(selected.skills.find((entry) => entry.displayName === 'Navigation/Air')?.accumulatedXp).toBe(60)

    const deselected = applyStage3School(input, MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, 'field.infantry'])
    expect(deselected.creation.lifeModules!.selectedSkillFields.some((entry) => [PILOT_AEROSPACE_COMBAT_FIELD_ID, PILOT_AIRCRAFT_COMBAT_FIELD_ID].includes(entry.fieldId))).toBe(false)
    expect(deselected.skills.some((entry) => entry.displayName === 'Gunnery/Aerospace')).toBe(false)

    const restored = JSON.parse(JSON.stringify(selected)) as typeof selected
    expect(restored).toEqual(selected)
    for (const fieldId of [PILOT_AEROSPACE_COMBAT_FIELD_ID, PILOT_AIRCRAFT_COMBAT_FIELD_ID]) {
      expect(restored.creation.lifeModules!.selectedSkillFields.filter((entry) => entry.fieldId === fieldId)).toHaveLength(1)
    }
    expect(restored.skills.filter((entry) => entry.displayName === 'Navigation/Air')).toHaveLength(1)
  })
})
