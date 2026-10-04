import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, FAMILY_TRAINING_ID, MILITARY_ACADEMY_ID, OFFICER_TRAINING_SCHOOL_ID } from '../domain/lifeModules/catalog'
import { stage3SchoolEligibility } from '../domain/lifeModules/stage3Schooling'
import { BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID } from '../domain/skillFields/catalog'
import { applyCapellanCommonality, applyStage3School, applyUniversalStage0, createLifeModuleCharacter, resolvePendingLifeModuleAward } from './lifeModuleEngine'
import { previewStageModuleChoiceSlots } from '../ui/components/stageModuleChoiceSlotsModel'

function stage3Draft() {
  let character = createLifeModuleCharacter('Family Training')
  character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
  character.creation.lifeModules!.phase = 'stage-3-selection'
  character.creation.lifeModules!.currentStage = 3
  character.creation.lifeModules!.pendingAwards = []
  return character
}

function addConnections(character: ReturnType<typeof stage3Draft>) {
  character.traits.push({ traitId: 'trait.connections', displayName: 'Connections', accumulatedXp: 100, attainedTp: 1, active: true, parameters: {}, sourceAwards: [] })
  return character
}

describe('Alpha Slice 73 Family Training', () => {
  it('keeps the preview UI usable while homeworld is unresolved', () => {
    const preview = previewStageModuleChoiceSlots(stage3Draft(), FAMILY_TRAINING_ID, {}, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID], '')
    expect(preview).toMatchObject({ complete: false, error: expect.stringContaining('concrete named homeworld') })
  })

  it('applies the exact package and binds Homeworld History to an explicit named planet without mutating preview input', () => {
    const committed = addConnections(stage3Draft())
    const before = structuredClone(committed)
    expect(() => applyStage3School(committed, FAMILY_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID])).toThrow('concrete named homeworld')

    const family = applyStage3School(committed, FAMILY_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID], '  Sian  ')
    expect(committed).toEqual(before)
    expect(family.personalDescription?.homeworld).toBe('Sian')
    expect(family.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: FAMILY_TRAINING_ID, baseCostXp: 570, fieldCostXp: 264, costXp: 834 })
    expect(family.attributes.find((entry) => entry.attributeId === 'STR')?.accumulatedXp).toBe(175)
    expect(family.attributes.find((entry) => entry.attributeId === 'BOD')?.accumulatedXp).toBe(175)
    expect(family.attributes.find((entry) => entry.attributeId === 'RFL')?.accumulatedXp).toBe(150)
    expect(family.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(200)
    expect(family.skills.find((entry) => entry.displayName === 'Interest/Sian History')?.accumulatedXp).toBe(20)
    expect(family.skills.some((entry) => entry.displayName === 'Interest/Homeworld History')).toBe(false)
    expect(family.creation.lifeModules!.pendingAwards).toEqual(expect.arrayContaining([
      expect.objectContaining({ awardId: 'family-training.skill.driving', requiredSkillId: 'skill.driving', remainingGrants: 1 }),
      expect.objectContaining({ awardId: 'family-training.skill.survival', requiredSkillId: 'skill.survival', remainingGrants: 1 }),
      expect.objectContaining({ awardId: 'family-training.flexible', remainingXp: 100 }),
    ]))
    expect(family.chronology.find((entry) => entry.eventId === `${FAMILY_TRAINING_ID}.complete`)?.date).toBe('age:18')
  })

  it('implements the source OR prerequisite with either branch, both branches, and no duplicate credit', () => {
    const neither = applyStage3School(stage3Draft(), FAMILY_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID], 'New Avalon')
    expect(neither.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'family-training.entry')).toMatchObject({ status: 'outstanding' })

    const connections = applyStage3School(addConnections(stage3Draft()), FAMILY_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID], 'Sian')
    expect(connections.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'family-training.entry')).toMatchObject({ status: 'satisfied' })

    const schooling = stage3Draft()
    schooling.lifeModuleHistory.push({ moduleId: 'stage2.preparatory-school', displayName: 'Preparatory School', stage: 2, costXp: 0, selectedAt: 'test', provenanceIds: [], source: { sourceId: 'test', edition: 'test' }, notes: [] })
    const priorSchool = applyStage3School(schooling, FAMILY_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID], 'Tharkad')
    expect(priorSchool.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'family-training.entry')).toMatchObject({ status: 'satisfied' })

    const both = addConnections(stage3Draft())
    both.lifeModuleHistory.push({ moduleId: 'stage2.military-school', displayName: 'Military School', stage: 2, costXp: 0, selectedAt: 'test', provenanceIds: [], source: { sourceId: 'test', edition: 'test' }, notes: [] })
    const bothApplied = applyStage3School(both, FAMILY_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID], 'Robinson')
    expect(bothApplied.creation.lifeModules!.prerequisiteIssues.filter((entry) => entry.prerequisiteId === 'family-training.entry')).toHaveLength(1)
    expect(bothApplied.traits.find((entry) => entry.traitId === 'trait.connections')?.accumulatedXp).toBe(100)
  })

  it('resolves choices, accumulates an existing concrete Interest Skill, round-trips, and follows Military-family/OCS governance', () => {
    const draft = addConnections(stage3Draft())
    draft.skills.push({ address: { skillId: 'skill.interest', parameter: { kind: 'subskill', value: 'Sian History' } }, displayName: 'Interest/Sian History', accumulatedXp: 30, level: 1, sourceAwards: [] })
    let family = applyStage3School(draft, FAMILY_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID], 'Sian')
    expect(family.skills.filter((entry) => entry.displayName === 'Interest/Sian History')).toHaveLength(1)
    expect(family.skills.find((entry) => entry.displayName === 'Interest/Sian History')?.accumulatedXp).toBe(50)

    const driving = family.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'family-training.skill.driving')!
    family = resolvePendingLifeModuleAward(family, driving.id, { type: 'skill', targetId: 'skill.driving', displayName: 'Driving/Ground', parameter: { kind: 'subskill', value: 'Ground' } })
    const survival = family.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'family-training.skill.survival')!
    family = resolvePendingLifeModuleAward(family, survival.id, { type: 'skill', targetId: 'skill.survival', displayName: 'Survival/Desert', parameter: { kind: 'subskill', value: 'Desert' } })
    const flexible = family.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'family-training.flexible')!
    family = resolvePendingLifeModuleAward(family, flexible.id, { type: 'attribute', targetId: 'DEX', displayName: 'DEX' }, 100)
    expect(family.creation.lifeModules!.pendingAwards).toEqual([])

    const restored = JSON.parse(JSON.stringify(family)) as typeof family
    expect(restored.personalDescription?.homeworld).toBe('Sian')
    expect(restored.skills.find((entry) => entry.displayName === 'Interest/Sian History')?.accumulatedXp).toBe(50)
    expect(restored.lifeModuleHistory.filter((entry) => entry.moduleId === FAMILY_TRAINING_ID)).toHaveLength(1)
    expect(stage3SchoolEligibility([FAMILY_TRAINING_ID], MILITARY_ACADEMY_ID).eligible).toBe(false)
    expect(stage3SchoolEligibility([FAMILY_TRAINING_ID], OFFICER_TRAINING_SCHOOL_ID, { completedFieldCategories: ['basic', 'advanced'] }).eligible).toBe(true)
  })
})
