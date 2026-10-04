import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, FAMILY_TRAINING_ID, MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID } from '../domain/lifeModules/catalog'
import { BASIC_TRAINING_FIELD_ID, CAVALRY_FIELD_ID, INFANTRY_ANTI_MECH_FIELD_ID, INFANTRY_FIELD_ID, SKILL_FIELD_CATALOG, skillFieldCost } from '../domain/skillFields/catalog'
import { applyCapellanCommonality, applyStage3School, applyUniversalStage0, createLifeModuleCharacter, reevaluateLifeModulePrerequisites } from './lifeModuleEngine'

function stage3Draft() {
  let character = createLifeModuleCharacter('Anti-Mech Infantry')
  character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
  character.creation.lifeModules!.phase = 'stage-3-selection'
  character.creation.lifeModules!.currentStage = 3
  character.creation.lifeModules!.pendingAwards = []
  const wil = character.attributes.find((entry) => entry.attributeId === 'WIL')!
  wil.purchasedLevel = 5
  wil.accumulatedXp = 500
  character.traits.push({ traitId: 'trait.connections', displayName: 'Connections', accumulatedXp: 200, attainedTp: 2, active: true, parameters: {}, sourceAwards: [] })
  return character
}

describe('Alpha Slice 77 Infantry/Anti-Mech', () => {
  it('models the exact acquisition prerequisites, fixed Skills, and 144-XP cost', () => {
    const field = SKILL_FIELD_CATALOG.find((entry) => entry.id === INFANTRY_ANTI_MECH_FIELD_ID)!
    expect(field).toMatchObject({ displayName: 'Infantry/Anti-Mech', category: 'special' })
    expect(field.prerequisites).toEqual([
      expect.objectContaining({ kind: 'skill-field', fieldIds: [INFANTRY_FIELD_ID] }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'WIL', minimum: 5 }),
    ])
    expect(field.componentSkills.map((entry) => entry.displayName)).toEqual([
      'Acrobatics/Gymnastics',
      'Demolitions',
      'Perception',
      'Security Systems/Electronic',
      'Technician/Mechanical',
      'Technician/Myomer',
    ])
    expect(field.variableComponentSkills).toBeUndefined()
    expect(skillFieldCost(field, 24)).toBe(144)
  })

  it('uses every source-authorized implemented school with exact category and time', () => {
    const academy = applyStage3School(stage3Draft(), MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID, INFANTRY_ANTI_MECH_FIELD_ID])
    const enlistment = applyStage3School(stage3Draft(), MILITARY_ENLISTMENT_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID, INFANTRY_ANTI_MECH_FIELD_ID])
    const family = applyStage3School(stage3Draft(), FAMILY_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID, INFANTRY_ANTI_MECH_FIELD_ID], 'Sian')
    expect(academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === INFANTRY_ANTI_MECH_FIELD_ID)).toMatchObject({ category: 'special', chronologyYears: 2, purchaseCostXp: 144, xpPerSkill: 30 })
    expect(enlistment.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === INFANTRY_ANTI_MECH_FIELD_ID)).toMatchObject({ category: 'special', chronologyYears: 1 })
    expect(family.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === INFANTRY_ANTI_MECH_FIELD_ID)).toMatchObject({ category: 'special', chronologyYears: 2 })
  })

  it('accepts same-school Infantry ownership but rejects component Skills or a Field goal as substitutes', () => {
    const chained = applyStage3School(stage3Draft(), MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID, INFANTRY_ANTI_MECH_FIELD_ID])
    expect(chained.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.moduleId === INFANTRY_ANTI_MECH_FIELD_ID && entry.prerequisiteId === 'infantry-anti-mech.field')).toMatchObject({ status: 'satisfied' })

    const substitute = stage3Draft()
    substitute.creation.lifeModules!.masterSkillFieldGoalId = INFANTRY_FIELD_ID
    substitute.skills.push(...SKILL_FIELD_CATALOG.find((entry) => entry.id === INFANTRY_FIELD_ID)!.componentSkills.map((entry) => ({ address: entry.address, displayName: entry.displayName, accumulatedXp: 30, level: 1, sourceAwards: [] })))
    const invalid = reevaluateLifeModulePrerequisites(applyStage3School(substitute, MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, CAVALRY_FIELD_ID, INFANTRY_ANTI_MECH_FIELD_ID]))
    expect(invalid.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.moduleId === INFANTRY_ANTI_MECH_FIELD_ID && entry.prerequisiteId === 'infantry-anti-mech.field')).toMatchObject({ status: 'outstanding' })
  })

  it('keeps preview input uncommitted, cleans deselection, and round-trips without duplicate awards', () => {
    const input = stage3Draft()
    const before = JSON.stringify(input)
    const selected = applyStage3School(input, MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID, INFANTRY_ANTI_MECH_FIELD_ID])
    expect(JSON.stringify(input)).toBe(before)
    expect(selected.skills.find((entry) => entry.displayName === 'Technician/Mechanical')?.accumulatedXp).toBe(30)

    const deselected = applyStage3School(input, MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID, CAVALRY_FIELD_ID])
    expect(deselected.creation.lifeModules!.selectedSkillFields.some((entry) => entry.fieldId === INFANTRY_ANTI_MECH_FIELD_ID)).toBe(false)
    expect(deselected.skills.some((entry) => entry.displayName === 'Acrobatics/Gymnastics')).toBe(false)

    const restored = JSON.parse(JSON.stringify(selected)) as typeof selected
    expect(restored).toEqual(selected)
    expect(restored.creation.lifeModules!.selectedSkillFields.filter((entry) => entry.fieldId === INFANTRY_ANTI_MECH_FIELD_ID)).toHaveLength(1)
    expect(restored.skills.filter((entry) => entry.displayName === 'Acrobatics/Gymnastics')).toHaveLength(1)
  })
})
