import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, FAMILY_TRAINING_ID, MILITARY_ACADEMY_ID, TECHNICAL_COLLEGE_ID } from '../domain/lifeModules/catalog'
import { ANALYSIS_FIELD_ID, BASIC_TRAINING_FIELD_ID, PILOT_DROPSHIP_FIELD_ID, PILOT_JUMPSHIP_FIELD_ID, PILOT_WARSHIP_FIELD_ID, SKILL_FIELD_CATALOG, skillFieldCost } from '../domain/skillFields/catalog'
import { applyCapellanCommonality, applyStage3School, applyUniversalStage0, createLifeModuleCharacter, reevaluateLifeModulePrerequisites } from './lifeModuleEngine'

function stage3Draft() {
  let character = createLifeModuleCharacter('Spacecraft Pilot')
  character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
  character.creation.lifeModules!.phase = 'stage-3-selection'
  character.creation.lifeModules!.currentStage = 3
  character.creation.lifeModules!.pendingAwards = []
  for (const [attributeId, purchasedLevel] of Object.entries({ DEX: 6, INT: 6, WIL: 5 })) {
    const attribute = character.attributes.find((entry) => entry.attributeId === attributeId)!
    attribute.purchasedLevel = purchasedLevel
    attribute.accumulatedXp = purchasedLevel * 100
  }
  character.traits.push({ traitId: 'trait.connections', displayName: 'Connections', accumulatedXp: 200, attainedTp: 2, active: true, parameters: {}, sourceAwards: [] })
  return character
}

describe('Alpha Slice 76 spacecraft Pilot Fields', () => {
  it('models the exact corrected Field prerequisites, Skills, and costs', () => {
    const dropShip = SKILL_FIELD_CATALOG.find((entry) => entry.id === PILOT_DROPSHIP_FIELD_ID)!
    const jumpShip = SKILL_FIELD_CATALOG.find((entry) => entry.id === PILOT_JUMPSHIP_FIELD_ID)!
    const warShip = SKILL_FIELD_CATALOG.find((entry) => entry.id === PILOT_WARSHIP_FIELD_ID)!

    expect(dropShip.prerequisites).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'DEX', minimum: 4 }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 3 }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'WIL', minimum: 3 }),
      expect.objectContaining({ kind: 'trait-absent', traitId: 'trait.tds' }),
    ]))
    expect(dropShip.componentSkills.map((entry) => entry.displayName)).toEqual(['Career/DropShip Pilot', 'Comms/Conventional', 'Navigation/Space', 'Piloting/Spacecraft', 'Sensor Operations', 'Zero-G Operations'])
    expect(skillFieldCost(dropShip, 24)).toBe(144)

    expect(jumpShip.prerequisites).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'skill-field', fieldIds: [PILOT_DROPSHIP_FIELD_ID] }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 5 }),
      expect.objectContaining({ kind: 'trait-absent', traitId: 'trait.tds' }),
    ]))
    expect(jumpShip.componentSkills.map((entry) => entry.displayName)).toEqual(['Administration', 'Computers', 'Navigation/K-F Jump', 'Navigation/Space', 'Piloting/Spacecraft'])
    expect(skillFieldCost(jumpShip, 24)).toBe(120)

    expect(warShip.prerequisites).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'skill-field', fieldIds: [PILOT_DROPSHIP_FIELD_ID] }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'DEX', minimum: 4 }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 6 }),
      expect.objectContaining({ kind: 'trait-absent', traitId: 'trait.tds' }),
    ]))
    expect(warShip.componentSkills.map((entry) => entry.displayName)).toEqual(['Computers', 'Leadership', 'Navigation/K-F Jump', 'Navigation/Space', 'Strategy', 'Tactics/Space'])
    expect(warShip.affiliationBoundComponentSkills).toEqual([{ skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' }])
    expect(skillFieldCost(warShip, 24)).toBe(168)
  })

  it('uses exact school categories and times, including the corrected WarShip Academy offer', () => {
    const technical = applyStage3School(stage3Draft(), TECHNICAL_COLLEGE_ID, [PILOT_DROPSHIP_FIELD_ID, PILOT_JUMPSHIP_FIELD_ID])
    expect(technical.creation.lifeModules!.selectedSkillFields.map(({ fieldId, category, chronologyYears }) => ({ fieldId, category, chronologyYears }))).toEqual([
      { fieldId: PILOT_DROPSHIP_FIELD_ID, category: 'basic', chronologyYears: 1 },
      { fieldId: PILOT_JUMPSHIP_FIELD_ID, category: 'advanced', chronologyYears: 2 },
    ])

    const academy = applyStage3School(stage3Draft(), MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, PILOT_DROPSHIP_FIELD_ID, PILOT_WARSHIP_FIELD_ID])
    expect(academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_DROPSHIP_FIELD_ID)).toMatchObject({ category: 'advanced', chronologyYears: 1, purchaseCostXp: 144 })
    expect(academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_WARSHIP_FIELD_ID)).toMatchObject({ category: 'special', chronologyYears: 2, purchaseCostXp: 168 })

    const family = applyStage3School(stage3Draft(), FAMILY_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, PILOT_DROPSHIP_FIELD_ID, PILOT_JUMPSHIP_FIELD_ID], 'Sian')
    expect(family.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_DROPSHIP_FIELD_ID)).toMatchObject({ category: 'advanced', chronologyYears: 1.5 })
    expect(family.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_JUMPSHIP_FIELD_ID)).toMatchObject({ category: 'special', chronologyYears: 2 })
  })

  it('accepts same-school DropShip ownership, but not component Skills or a Field goal as a substitute', () => {
    const chained = applyStage3School(stage3Draft(), MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, PILOT_DROPSHIP_FIELD_ID, PILOT_WARSHIP_FIELD_ID])
    expect(chained.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.moduleId === PILOT_WARSHIP_FIELD_ID && entry.prerequisiteId === 'pilot-warship.field')).toMatchObject({ status: 'satisfied' })

    const withoutDropShip = stage3Draft()
    withoutDropShip.skills.push(...['Career/DropShip Pilot', 'Piloting/Spacecraft'].map((displayName) => ({ address: { skillId: displayName === 'Career/DropShip Pilot' ? 'skill.career' : 'skill.piloting' }, displayName, accumulatedXp: 30, level: 1, sourceAwards: [] })))
    withoutDropShip.creation.lifeModules!.masterSkillFieldGoalId = PILOT_DROPSHIP_FIELD_ID
    const invalid = reevaluateLifeModulePrerequisites(applyStage3School(withoutDropShip, MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, ANALYSIS_FIELD_ID, PILOT_WARSHIP_FIELD_ID]))
    expect(invalid.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.moduleId === PILOT_WARSHIP_FIELD_ID && entry.prerequisiteId === 'pilot-warship.field')).toMatchObject({ status: 'outstanding' })
  })

  it('keeps preview input unchanged, cleans deselection, enforces TDS, and round-trips without duplicates', () => {
    const input = stage3Draft()
    const before = JSON.stringify(input)
    const selected = applyStage3School(input, TECHNICAL_COLLEGE_ID, [PILOT_DROPSHIP_FIELD_ID, PILOT_JUMPSHIP_FIELD_ID])
    expect(JSON.stringify(input)).toBe(before)
    expect(selected.skills.find((entry) => entry.displayName === 'Navigation/Space')?.accumulatedXp).toBe(60)

    const deselected = applyStage3School(input, TECHNICAL_COLLEGE_ID, ['field.technician-civilian', 'field.technician-vehicle'])
    expect(deselected.creation.lifeModules!.selectedSkillFields.some((entry) => entry.fieldId === PILOT_DROPSHIP_FIELD_ID)).toBe(false)
    expect(deselected.skills.some((entry) => entry.displayName === 'Career/DropShip Pilot')).toBe(false)

    const tds = stage3Draft()
    tds.traits.push({ traitId: 'trait.tds', displayName: 'TDS', accumulatedXp: -100, attainedTp: -1, active: true, parameters: {}, sourceAwards: [] })
    const blocked = applyStage3School(tds, TECHNICAL_COLLEGE_ID, [PILOT_DROPSHIP_FIELD_ID, PILOT_JUMPSHIP_FIELD_ID])
    expect(blocked.creation.lifeModules!.prerequisiteIssues.filter((entry) => entry.prerequisiteId.endsWith('.tds'))).toEqual([
      expect.objectContaining({ moduleId: PILOT_DROPSHIP_FIELD_ID, status: 'outstanding' }),
      expect.objectContaining({ moduleId: PILOT_JUMPSHIP_FIELD_ID, status: 'outstanding' }),
    ])

    const restored = JSON.parse(JSON.stringify(selected)) as typeof selected
    expect(restored).toEqual(selected)
    expect(restored.creation.lifeModules!.selectedSkillFields.filter((entry) => entry.fieldId === PILOT_DROPSHIP_FIELD_ID)).toHaveLength(1)
    expect(restored.creation.lifeModules!.selectedSkillFields.filter((entry) => entry.fieldId === PILOT_JUMPSHIP_FIELD_ID)).toHaveLength(1)
    expect(restored.skills.filter((entry) => entry.displayName === 'Navigation/Space')).toHaveLength(1)
  })
})
