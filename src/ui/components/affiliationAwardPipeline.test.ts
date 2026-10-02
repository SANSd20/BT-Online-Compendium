import { describe, expect, it } from 'vitest'
import {
  AGITATOR_ID,
  BACK_WOODS_ID,
  CAPELLAN_COMMONALITY_ID,
  FEDERATED_SUNS_CRUCIS_MARCH_ID,
  STAGE_2_BACK_WOODS_ID,
  STAGE_2_HIGH_SCHOOL_ID,
} from '../../domain/lifeModules/catalog'
import {
  applyCapellanCommonality,
  applyFederatedSunsCrucisMarch,
  applyStage1Module,
  applyStage4Module,
  applyUniversalStage0,
  continueToStage2,
  createLifeModuleCharacter,
  resolvePendingLifeModuleAward,
} from '../../engine/lifeModuleEngine'
import { encodeCharacter } from '../../persistence/characterCodec'
import { previewStageModuleChoiceSlots, type StageChoiceSlotValues } from './stageModuleChoiceSlotsModel'
import { previewSupportedStageModule } from './stageModulePreviewModel'

type SupportedFaction = 'capellan' | 'federated-suns'

function skillXp(character: ReturnType<typeof createLifeModuleCharacter>, displayName: string): number {
  return character.skills.find((entry) => entry.displayName === displayName)?.accumulatedXp ?? 0
}

function resolveAward(
  character: ReturnType<typeof createLifeModuleCharacter>,
  awardId: string,
  targetId: string,
  displayName: string,
  parameter?: string,
) {
  const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === awardId)
  if (!pending) throw new Error(`Missing pending test award: ${awardId}`)
  return resolvePendingLifeModuleAward(character, pending.id, {
    type: pending.allowedTargetTypes[0],
    targetId,
    displayName,
    ...(parameter ? { parameter: { kind: 'subskill' as const, value: parameter } } : {}),
  })
}

function stage2Ready(faction: SupportedFaction) {
  let character = createLifeModuleCharacter(`${faction} delta pipeline`)
  if (faction === 'capellan') {
    character = applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
    character = applyCapellanCommonality(character, 'Russian')
    character = resolveAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French')
  } else {
    character = applyUniversalStage0(character, FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English')
    character = applyFederatedSunsCrucisMarch(character, 'Strategy', 'Painting')
  }

  const languageName = faction === 'capellan' ? 'Language/Mandarin Chinese' : 'Language/English'
  const languageBefore = skillXp(character, languageName)
  character = applyStage1Module(character, BACK_WOODS_ID)
  expect(skillXp(character, languageName) - languageBefore).toBe(-5)
  expect(character.creation.lifeModules!.pendingAwards.some((entry) => entry.awardId === 'back-woods.language.affiliation')).toBe(false)

  character = resolveAward(character, 'back-woods.skill.survival', 'skill.survival', 'Survival/Forest', 'Forest')
  character = resolveAward(character, 'back-woods.flexible', 'STR', 'STR')
  character = resolveAward(character, 'back-woods.flexible', 'BOD', 'BOD')
  return continueToStage2(character)
}

function completeBackWoodsPreview(character: ReturnType<typeof stage2Ready>) {
  const values: StageChoiceSlotValues = {
    'stage2.back-woods.flexible': [{ targetType: 'attribute', targetId: 'STR', parameter: '', displayName: 'STR', xpAmount: 125 }],
  }
  const result = previewStageModuleChoiceSlots(character, STAGE_2_BACK_WOODS_ID, values)
  if (!result?.complete || result.error) throw new Error(result?.error ?? 'Stage 2 Back Woods preview did not complete.')
  return result.character
}

describe('automatic /Affiliation award application pipeline', () => {
  it.each([
    ['federated-suns', 'Protocol/FedSuns', 'Protocol/Capellan'],
    ['capellan', 'Protocol/Capellan', 'Protocol/FedSuns'],
  ] as const)('preserves the exact Stage 2 Back Woods delta through %s preview, Continue state, and serialization', (faction, protocolName, otherProtocolName) => {
    const committedBefore = stage2Ready(faction)
    const committedJson = JSON.stringify(committedBefore)
    const protocolBefore = skillXp(committedBefore, protocolName)

    const basePreview = previewSupportedStageModule(committedBefore, STAGE_2_BACK_WOODS_ID)!
    expect(skillXp(basePreview, protocolName)).toBe(protocolBefore - 15)
    expect(skillXp(basePreview, otherProtocolName)).toBe(skillXp(committedBefore, otherProtocolName))
    expect(basePreview.creation.lifeModules!.pendingAwards.some((entry) => entry.awardId === 'stage2.back-woods.skill.protocol-affiliation')).toBe(false)
    expect(JSON.stringify(committedBefore)).toBe(committedJson)

    const committedAfter = completeBackWoodsPreview(committedBefore)
    expect(skillXp(committedAfter, protocolName)).toBe(protocolBefore - 15)
    expect(skillXp(committedAfter, otherProtocolName)).toBe(skillXp(committedBefore, otherProtocolName))
    const exported = JSON.parse(encodeCharacter(committedAfter, '2026-10-02T00:00:00.000Z')) as { character: typeof committedAfter }
    expect(skillXp(exported.character, protocolName)).toBe(protocolBefore - 15)
  })

  it('applies both positive High School /Affiliation awards while preserving /Any choices and Stage 2 caps', () => {
    const committed = stage2Ready('capellan')
    const languageBefore = skillXp(committed, 'Language/Mandarin Chinese')
    const streetwiseBefore = skillXp(committed, 'Streetwise/Capellan')
    const preview = previewSupportedStageModule(committed, STAGE_2_HIGH_SCHOOL_ID)!

    expect(skillXp(preview, 'Language/Mandarin Chinese')).toBe(languageBefore + 10)
    expect(skillXp(preview, 'Streetwise/Capellan')).toBe(streetwiseBefore + 20)
    expect(preview.creation.lifeModules!.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining([
      'high-school.interest-40',
      'high-school.interest-35',
      'high-school.flexible',
    ]))
    expect(preview.creation.lifeModules!.pendingAwards.some((entry) => entry.awardId.includes('affiliation'))).toBe(false)
    expect(preview.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')?.maxXpPerTarget).toEqual({ attribute: 200, trait: 200, skill: 35 })
  })

  it('applies the positive Agitator Streetwise/Affiliation award to the established faction only', () => {
    const committed = stage2Ready('federated-suns')
    committed.creation.lifeModules!.phase = 'stage-4-selection'
    committed.creation.lifeModules!.currentStage = 4
    const streetwiseBefore = skillXp(committed, 'Streetwise/FedSuns')
    const preview = applyStage4Module(committed, AGITATOR_ID)

    expect(skillXp(preview, 'Streetwise/FedSuns')).toBe(streetwiseBefore + 75)
    expect(skillXp(preview, 'Streetwise/Capellan')).toBe(skillXp(committed, 'Streetwise/Capellan'))
    expect(preview.creation.lifeModules!.pendingAwards.some((entry) => entry.awardId === 'agitator.skill.streetwise-affiliation')).toBe(false)
  })
})
