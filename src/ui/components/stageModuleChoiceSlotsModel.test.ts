import { describe, expect, it } from 'vitest'
import { AGITATOR_ID, BLUE_COLLAR_ID, CAPELLAN_COMMONALITY_ID, MILITARY_ACADEMY_ID, STAGE_2_BACK_WOODS_ID, STAGE_2_HIGH_SCHOOL_ID, TECHNICAL_COLLEGE_ID } from '../../domain/lifeModules/catalog'
import { BASIC_TRAINING_FIELD_ID, MECHWARRIOR_FIELD_ID } from '../../domain/skillFields/catalog'
import { applyCapellanCommonality, applyUniversalStage0, createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { previewSupportedStageModule } from './stageModulePreviewModel'
import { filterSiblingDestinationOptions, previewStageModuleChoiceSlots, relatedStageChoiceSlotValues, stageChoicePoolProgress, stageChoicePoolProgressLabel, stageChoiceSlotCount, stageSlotContinueEnabled, stageSlotPendingAwards, type StageChoiceSlotValue, type StageChoiceSlotValues } from './stageModuleChoiceSlotsModel'

function draftAt(phase: 'stage-1-selection' | 'stage-2-selection' | 'stage-3-selection' | 'stage-4-selection') {
  let character = createLifeModuleCharacter(`Slots ${phase}`)
  character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
  character.creation.lifeModules!.phase = phase
  character.creation.lifeModules!.currentStage = phase === 'stage-1-selection' ? 1 : phase === 'stage-2-selection' ? 2 : phase === 'stage-3-selection' ? 3 : 4
  character.creation.lifeModules!.pendingAwards = []
  return character
}

function value(type: StageChoiceSlotValue['targetType'], targetId: string, displayName: string, xpAmount: number, parameter = ''): StageChoiceSlotValue {
  return { targetType: type, targetId, displayName, xpAmount, parameter }
}

function keyedValues(character: ReturnType<typeof draftAt>, moduleId: Parameters<typeof previewSupportedStageModule>[1], byAward: Readonly<Record<string, readonly StageChoiceSlotValue[]>>): StageChoiceSlotValues {
  const preview = previewSupportedStageModule(character, moduleId)!
  return Object.fromEntries(preview.creation.lifeModules!.pendingAwards.filter((entry) => entry.moduleId === moduleId).map((entry) => [entry.awardId, [...(byAward[entry.awardId] ?? [])]]))
}

describe('Stage 1–4 choice slot preview and commit model', () => {
  it('expands Blue Collar multi-grant awards into separate slots and keeps committed state untouched', () => {
    const character = draftAt('stage-1-selection')
    const committed = JSON.stringify(character)
    const preview = previewSupportedStageModule(character, BLUE_COLLAR_ID)!
    const interests = preview.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'blue-collar.interests')!
    const flexible = preview.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'blue-collar.flexible')!

    expect(stageChoiceSlotCount(interests, {})).toBe(2)
    expect(stageChoiceSlotCount(flexible, {})).toBe(4)
    expect(previewStageModuleChoiceSlots(character, BLUE_COLLAR_ID, {})?.complete).toBe(false)
    expect(JSON.stringify(character)).toBe(committed)
  })

  it.each([
    ['stage-1-selection', BLUE_COLLAR_ID, {
      'blue-collar.career': [value('skill', 'skill.career', 'Career/Soldier', 10, 'Soldier')],
      'blue-collar.interests': [value('skill', 'skill.interest', 'Interest/History', 5, 'History'), value('skill', 'skill.interest', 'Interest/Engineering', 5, 'Engineering')],
      'blue-collar.flexible': [value('attribute', 'STR', 'STR', 10), value('attribute', 'BOD', 'BOD', 10), value('attribute', 'DEX', 'DEX', 10), value('attribute', 'RFL', 'RFL', 10)],
    }],
    ['stage-2-selection', STAGE_2_BACK_WOODS_ID, {
      'stage2.back-woods.flexible': [value('attribute', 'STR', 'STR', 125)],
    }],
    ['stage-3-selection', TECHNICAL_COLLEGE_ID, {
      'technical-college.interest': [value('skill', 'skill.interest', 'Interest/Engineering', 30, 'Engineering')],
      'technical-college.flexible': [value('attribute', 'INT', 'INT', 200)],
    }],
    ['stage-4-selection', AGITATOR_ID, {
      'agitator.skill.driving': [value('skill', 'skill.driving', 'Driving/Ground Car', 65, 'Ground Car')],
      'agitator.skill.prestidigitation': [value('skill', 'skill.prestidigitation', 'Prestidigitation/Sleight of Hand', 100, 'Sleight of Hand')],
      'agitator.flexible': [value('skill', 'skill.acting', 'Acting', 125)],
    }],
  ] as const)('resolves every %s module choice through existing engine behavior before Continue', (phase, moduleId, byAward) => {
    const character = draftAt(phase)
    const committed = JSON.stringify(character)
    const result = previewStageModuleChoiceSlots(character, moduleId, keyedValues(character, moduleId, byAward))!

    expect(result.error).toBeNull()
    expect(result.complete).toBe(true)
    expect(result.pendingAwards).toEqual([])
    expect(result.character.lifeModuleHistory.at(-1)?.moduleId).toBe(moduleId)
    expect(result.character.creation.lifeModules!.resolvedAwards.some((entry) => entry.moduleId === moduleId)).toBe(true)
    expect(JSON.stringify(character)).toBe(committed)
  })

  it('keeps a module preview active and updates it after one filled slot', () => {
    const character = draftAt('stage-1-selection')
    const base = previewSupportedStageModule(character, BLUE_COLLAR_ID)!
    const career = base.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'blue-collar.career')!
    const result = previewStageModuleChoiceSlots(character, BLUE_COLLAR_ID, {
      [career.awardId]: [value('skill', 'skill.career', 'Career/Soldier', 10, 'Soldier')],
    })!

    expect(result.character.lifeModuleHistory.at(-1)?.moduleId).toBe(BLUE_COLLAR_ID)
    expect(result.character.skills.find((entry) => entry.displayName === 'Career/Soldier')?.accumulatedXp).toBe(10)
    expect(result.pendingAwards.some((entry) => entry.awardId === 'blue-collar.career')).toBe(false)
    expect(result.complete).toBe(false)
  })

  it('replaces the MechWarrior Technician preview choice without stale XP or mutation', () => {
    const character = draftAt('stage-3-selection')
    const committed = JSON.stringify(character)
    const fields = [BASIC_TRAINING_FIELD_ID, MECHWARRIOR_FIELD_ID]
    const base = previewSupportedStageModule(character, MILITARY_ACADEMY_ID, fields)!
    const pending = base.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.fieldId === MECHWARRIOR_FIELD_ID)!

    const weapons = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, {
      [pending.awardId]: [value('skill', 'skill.technician', 'Technician/Weapons', 30, 'Weapons')],
    }, fields)!
    const electronic = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, {
      [pending.awardId]: [value('skill', 'skill.technician', 'Technician/Electronic', 30, 'Electronic')],
    }, fields)!

    expect(weapons.character.skills.find((entry) => entry.displayName === 'Technician/Weapons')?.accumulatedXp).toBe(30)
    expect(electronic.character.skills.some((entry) => entry.displayName === 'Technician/Weapons')).toBe(false)
    expect(electronic.character.skills.filter((entry) => entry.displayName === 'Technician/Electronic')).toHaveLength(1)
    expect(electronic.character.skills.find((entry) => entry.displayName === 'Technician/Electronic')?.accumulatedXp).toBe(30)
    expect(electronic.pendingAwards.some((entry) => entry.skillFieldChoice?.fieldId === MECHWARRIOR_FIELD_ID)).toBe(false)
    expect(JSON.stringify(character)).toBe(committed)
  })

  it('reports assigned, remaining, and over-limit flexible XP as slot amounts change', () => {
    const preview = previewSupportedStageModule(draftAt('stage-2-selection'), STAGE_2_HIGH_SCHOOL_ID)!
    const flexible = preview.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')!

    const partial = stageChoicePoolProgress(flexible, [
      value('trait', 'trait.ambidextrous', 'Ambidextrous', 20),
      value('attribute', 'STR', 'STR', 50),
    ])
    expect(partial).toEqual({ assigned: 70, remaining: 115, overage: 0 })
    expect(stageChoicePoolProgressLabel(partial)).toBe('70 assigned · 115 remaining')

    const complete = stageChoicePoolProgress(flexible, [value('attribute', 'STR', 'STR', 185)])
    expect(stageChoicePoolProgressLabel(complete)).toBe('185 assigned · 0 remaining')

    const over = stageChoicePoolProgress(flexible, [
      value('attribute', 'STR', 'STR', 150),
      value('attribute', 'BOD', 'BOD', 50),
    ])
    expect(over).toEqual({ assigned: 200, remaining: 0, overage: 15 })
    expect(stageChoicePoolProgressLabel(over)).toBe('200 assigned · 15 XP over limit')
  })

  it('resolves a complete legal High School 185 XP allocation in the integrated preview', () => {
    const character = draftAt('stage-2-selection')
    const committed = JSON.stringify(character)
    const values = keyedValues(character, STAGE_2_HIGH_SCHOOL_ID, {
      'high-school.interest-40': [value('skill', 'skill.interest', 'Interest/History', 40, 'History')],
      'high-school.interest-35': [value('skill', 'skill.interest', 'Interest/Engineering', 35, 'Engineering')],
      'high-school.flexible': [
        value('attribute', 'STR', 'STR', 50),
        value('attribute', 'BOD', 'BOD', 50),
        value('attribute', 'DEX', 'DEX', 50),
        value('attribute', 'RFL', 'RFL', 35),
      ],
    })
    const result = previewStageModuleChoiceSlots(character, STAGE_2_HIGH_SCHOOL_ID, values)!

    expect(stageChoicePoolProgress(
      previewSupportedStageModule(character, STAGE_2_HIGH_SCHOOL_ID)!.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')!,
      values['high-school.flexible'],
    )).toEqual({ assigned: 185, remaining: 0, overage: 0 })
    expect(result.error).toBeNull()
    expect(result.pendingAwards).toEqual([])
    expect(result.complete).toBe(true)
    expect(stageSlotPendingAwards(result)).toEqual([])
    expect(stageSlotContinueEnabled(result)).toBe(true)
    expect(result.character.lifeModuleHistory.at(-1)?.moduleId).toBe(STAGE_2_HIGH_SCHOOL_ID)
    expect(result.character.creation.lifeModules!.resolvedAwards.filter((entry) => entry.moduleId === STAGE_2_HIGH_SCHOOL_ID)).toHaveLength(6)
    expect(JSON.stringify(character)).toBe(committed)
  })

  it('filters sibling destinations within one award while preserving and restoring the current selection', () => {
    const options = [
      { value: 'STR', displayName: 'STR' },
      { value: 'trait.ambidextrous', displayName: 'Ambidextrous' },
      { value: 'skill.language/French', displayName: 'Language/French' },
    ]
    const values = [
      value('attribute', 'STR', 'STR', 50),
      value('trait', 'trait.ambidextrous', 'Ambidextrous', 20),
      value('skill', 'skill.language', 'Language/French', 35, 'French'),
    ]

    expect(filterSiblingDestinationOptions(options, values, 0).map((entry) => entry.value)).toEqual(['STR'])
    expect(filterSiblingDestinationOptions(options, values, 1).map((entry) => entry.value)).toEqual(['trait.ambidextrous'])
    expect(filterSiblingDestinationOptions(options, values, 2).map((entry) => entry.value)).toEqual(['skill.language/French'])

    const clearedSibling = [values[0], { ...values[1], targetId: '', displayName: '' }, values[2]]
    expect(filterSiblingDestinationOptions(options, clearedSibling, 0).map((entry) => entry.value)).toEqual(['STR', 'trait.ambidextrous'])
    expect(filterSiblingDestinationOptions(options, [], 0)).toEqual(options)
  })

  it('limits duplicate filtering to sibling slots in the same award group', () => {
    const options = [{ value: 'STR', displayName: 'STR' }, { value: 'BOD', displayName: 'BOD' }]
    const oneAwardValues = [value('attribute', 'STR', 'STR', 50)]

    expect(filterSiblingDestinationOptions(options, oneAwardValues, 1).map((entry) => entry.value)).toEqual(['BOD'])
    expect(filterSiblingDestinationOptions(options, [], 0).map((entry) => entry.value)).toEqual(['STR', 'BOD'])
  })

  it('groups separate same-module Interest awards without crossing unrelated award identities', () => {
    const character = draftAt('stage-2-selection')
    const preview = previewSupportedStageModule(character, STAGE_2_HIGH_SCHOOL_ID)!
    const pending = preview.creation.lifeModules!.pendingAwards.filter((entry) => entry.moduleId === STAGE_2_HIGH_SCHOOL_ID)
    const interest40 = pending.find((entry) => entry.awardId === 'high-school.interest-40')!
    const interest35 = pending.find((entry) => entry.awardId === 'high-school.interest-35')!
    const values = {
      [interest40.awardId]: [value('skill', 'skill.interest', 'Interest/History', 40, 'History')],
    }

    expect(relatedStageChoiceSlotValues(interest35, pending, values)).toEqual(values[interest40.awardId])

    const options = [
      { value: 'skill.interest/History', displayName: 'Interest/History' },
      { value: 'skill.interest/Engineering', displayName: 'Interest/Engineering' },
    ]
    const related = relatedStageChoiceSlotValues(interest35, pending, values)
    expect(filterSiblingDestinationOptions(options, [], 0, related).map((entry) => entry.value)).toEqual(['skill.interest/Engineering'])
  })

  it('keeps an earlier pending choice local and commits it with the selected module clone', () => {
    let character = createLifeModuleCharacter('Existing pending choice')
    character = applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
    character = applyCapellanCommonality(character, 'Russian')
    const existing = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'commonality.language.fedsuns')!
    const byAward = {
      'blue-collar.career': [value('skill', 'skill.career', 'Career/Soldier', 10, 'Soldier')],
      'blue-collar.interests': [value('skill', 'skill.interest', 'Interest/History', 5, 'History'), value('skill', 'skill.interest', 'Interest/Engineering', 5, 'Engineering')],
      'blue-collar.flexible': [value('attribute', 'STR', 'STR', 10), value('attribute', 'BOD', 'BOD', 10), value('attribute', 'DEX', 'DEX', 10), value('attribute', 'RFL', 'RFL', 10)],
    }
    const committed = JSON.stringify(character)
    const moduleValues = keyedValues(character, BLUE_COLLAR_ID, byAward)
    const preview = previewStageModuleChoiceSlots(character, BLUE_COLLAR_ID, moduleValues)!

    expect(preview.complete).toBe(false)
    expect(preview.existingPendingAwards.map((entry) => entry.id)).toContain(existing.id)
    expect(preview.character.lifeModuleHistory.at(-1)?.moduleId).toBe(BLUE_COLLAR_ID)
    expect(stageSlotPendingAwards(preview).map((entry) => entry.id)).toContain(existing.id)
    expect(stageSlotContinueEnabled(preview)).toBe(false)
    expect(JSON.stringify(character)).toBe(committed)

    const completed = previewStageModuleChoiceSlots(character, BLUE_COLLAR_ID, {
      ...moduleValues,
      [existing.awardId]: [value('skill', 'skill.language', 'Language/French', 5, 'French')],
    })!
    expect(completed.existingPendingAwards).toEqual([])
    expect(completed.pendingAwards).toEqual([])
    expect(completed.complete).toBe(true)
    expect(completed.character.creation.lifeModules!.resolvedAwards).toEqual(expect.arrayContaining([
      expect.objectContaining({ awardId: existing.awardId, destination: expect.objectContaining({ displayName: 'Language/French' }) }),
    ]))
    expect(completed.character.lifeModuleHistory.at(-1)?.moduleId).toBe(BLUE_COLLAR_ID)
    expect(stageSlotContinueEnabled(completed)).toBe(true)
    expect(JSON.stringify(character)).toBe(committed)
  })
})
