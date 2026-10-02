import { describe, expect, it } from 'vitest'
import {
  AGITATOR_ID,
  BACK_WOODS_ID,
  BLUE_COLLAR_ID,
  CAPELLAN_COMMONALITY_ID,
  STAGE_2_BACK_WOODS_ID,
  STAGE_2_HIGH_SCHOOL_ID,
  TECHNICAL_COLLEGE_ID,
} from '../../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyUniversalStage0, createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { applySupportedStageModule, previewSupportedStageModule, type SupportedStageModuleId } from './stageModulePreviewModel'

function draftAt(phase: 'stage-1-selection' | 'stage-2-selection' | 'stage-3-selection' | 'stage-4-selection') {
  let character = createLifeModuleCharacter(`Preview ${phase}`)
  character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
  character.creation.lifeModules!.phase = phase
  character.creation.lifeModules!.currentStage = phase === 'stage-1-selection' ? 1 : phase === 'stage-2-selection' ? 2 : phase === 'stage-3-selection' ? 3 : 4
  return character
}

describe('supported Stage 1–4 module preview model', () => {
  it.each([
    ['stage-1-selection', BLUE_COLLAR_ID, 'STR', 145, 'blue-collar.career'],
    ['stage-1-selection', BACK_WOODS_ID, 'BOD', 200, 'back-woods.skill.survival'],
    ['stage-2-selection', STAGE_2_BACK_WOODS_ID, 'WIL', 220, 'stage2.back-woods.flexible'],
    ['stage-2-selection', STAGE_2_HIGH_SCHOOL_ID, 'CHA', 125, 'high-school.interest-40'],
    ['stage-3-selection', TECHNICAL_COLLEGE_ID, 'DEX', 200, 'technical-college.flexible'],
    ['stage-4-selection', AGITATOR_ID, 'WIL', 225, 'agitator.skill.driving'],
  ] as const)('previews %s module %s without mutating committed state', (phase, moduleId, attributeId, expectedXp, pendingAwardId) => {
    const character = draftAt(phase)
    const committedJson = JSON.stringify(character)
    const preview = previewSupportedStageModule(character, moduleId)

    expect(preview?.lifeModuleHistory.at(-1)?.moduleId).toBe(moduleId)
    expect(preview?.attributes.find((entry) => entry.attributeId === attributeId)?.accumulatedXp).toBe(expectedXp)
    expect(preview?.creation.lifeModules?.pendingAwards.some((entry) => entry.awardId === pendingAwardId)).toBe(true)
    expect(JSON.stringify(character)).toBe(committedJson)
    expect(character.lifeModuleHistory.some((entry) => entry.moduleId === moduleId)).toBe(false)
  })

  it('uses the same engine operation for preview and Continue commit', () => {
    const character = draftAt('stage-1-selection')
    const moduleId: SupportedStageModuleId = BLUE_COLLAR_ID
    const preview = previewSupportedStageModule(character, moduleId)!
    const committed = applySupportedStageModule(character, moduleId)
    expect(preview.creation.lifeModules?.phase).toBe(committed.creation.lifeModules?.phase)
    expect(preview.creation.lifeModules?.moduleXp).toEqual(committed.creation.lifeModules?.moduleXp)
    expect(preview.xp.creation).toEqual(committed.xp.creation)
    expect(preview.lifeModuleHistory.at(-1)?.moduleId).toBe(committed.lifeModuleHistory.at(-1)?.moduleId)
    expect(preview.creation.lifeModules?.pendingAwards.map((entry) => entry.awardId)).toEqual(committed.creation.lifeModules?.pendingAwards.map((entry) => entry.awardId))
  })

  it('does not invent a module preview before explicit selection', () => {
    expect(previewSupportedStageModule(draftAt('stage-1-selection'), '')).toBeNull()
  })
})
