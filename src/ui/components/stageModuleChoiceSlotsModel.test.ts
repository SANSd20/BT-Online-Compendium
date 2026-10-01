import { describe, expect, it } from 'vitest'
import { AGITATOR_ID, BLUE_COLLAR_ID, CAPELLAN_COMMONALITY_ID, STAGE_2_BACK_WOODS_ID, TECHNICAL_COLLEGE_ID } from '../../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyUniversalStage0, createLifeModuleCharacter, resolvePendingLifeModuleAward } from '../../engine/lifeModuleEngine'
import { previewSupportedStageModule } from './stageModulePreviewModel'
import { previewStageModuleChoiceSlots, stageChoiceSlotCount, stageSlotContinueEnabled, type StageChoiceSlotValue, type StageChoiceSlotValues } from './stageModuleChoiceSlotsModel'

function draftAt(phase: 'stage-1-selection' | 'stage-2-selection' | 'stage-3-selection' | 'stage-4-selection') {
  const character = createLifeModuleCharacter(`Slots ${phase}`)
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
      'stage2.back-woods.skill.protocol-affiliation': [value('skill', 'skill.protocol', 'Protocol/Capellan', -15, 'Capellan')],
      'stage2.back-woods.flexible': [value('attribute', 'STR', 'STR', 125)],
    }],
    ['stage-3-selection', TECHNICAL_COLLEGE_ID, {
      'technical-college.interest': [value('skill', 'skill.interest', 'Interest/Engineering', 30, 'Engineering')],
      'technical-college.flexible': [value('attribute', 'INT', 'INT', 200)],
    }],
    ['stage-4-selection', AGITATOR_ID, {
      'agitator.skill.driving': [value('skill', 'skill.driving', 'Driving/Ground Car', 65, 'Ground Car')],
      'agitator.skill.prestidigitation': [value('skill', 'skill.prestidigitation', 'Prestidigitation/Sleight of Hand', 100, 'Sleight of Hand')],
      'agitator.skill.streetwise-affiliation': [value('skill', 'skill.streetwise', 'Streetwise/Capellan', 75, 'Capellan')],
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

  it('keeps an earlier pending choice separate and gates Continue until it is resolved', () => {
    let character = createLifeModuleCharacter('Existing pending choice')
    character = applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
    character = applyCapellanCommonality(character, 'Russian')
    const existing = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'commonality.language.fedsuns')!
    const byAward = {
      'blue-collar.career': [value('skill', 'skill.career', 'Career/Soldier', 10, 'Soldier')],
      'blue-collar.interests': [value('skill', 'skill.interest', 'Interest/History', 5, 'History'), value('skill', 'skill.interest', 'Interest/Engineering', 5, 'Engineering')],
      'blue-collar.flexible': [value('attribute', 'STR', 'STR', 10), value('attribute', 'BOD', 'BOD', 10), value('attribute', 'DEX', 'DEX', 10), value('attribute', 'RFL', 'RFL', 10)],
    }
    const preview = previewStageModuleChoiceSlots(character, BLUE_COLLAR_ID, keyedValues(character, BLUE_COLLAR_ID, byAward))!

    expect(preview.complete).toBe(true)
    expect(preview.character.lifeModuleHistory.at(-1)?.moduleId).toBe(BLUE_COLLAR_ID)
    expect(stageSlotContinueEnabled(preview, [existing])).toBe(false)

    const resolvedCharacter = resolvePendingLifeModuleAward(character, existing.id, {
      type: 'skill', targetId: 'skill.language', displayName: 'Language/French', parameter: { kind: 'subskill', value: 'French' },
    })
    const refreshed = previewStageModuleChoiceSlots(resolvedCharacter, BLUE_COLLAR_ID, keyedValues(resolvedCharacter, BLUE_COLLAR_ID, byAward))!
    expect(refreshed.character.lifeModuleHistory.at(-1)?.moduleId).toBe(BLUE_COLLAR_ID)
    expect(stageSlotContinueEnabled(refreshed, [])).toBe(true)
  })
})
