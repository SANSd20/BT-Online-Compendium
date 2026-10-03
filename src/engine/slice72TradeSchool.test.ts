import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, TRADE_SCHOOL_ID } from '../domain/lifeModules/catalog'
import { modeledSkillChoiceOptions } from '../domain/lifeModules/awardOptions'
import { JOURNALIST_FIELD_ID, MERCHANT_FIELD_ID, skillFieldCost, getSkillField } from '../domain/skillFields/catalog'
import { applyCapellanCommonality, applyStage3School, applyUniversalStage0, createLifeModuleCharacter, resolvePendingLifeModuleAward } from './lifeModuleEngine'

function stage3Draft() {
  let character = createLifeModuleCharacter('Trade School')
  character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
  character.creation.lifeModules!.phase = 'stage-3-selection'
  character.creation.lifeModules!.currentStage = 3
  character.creation.lifeModules!.pendingAwards = []
  return character
}

function resolveAward(character: ReturnType<typeof stage3Draft>, awardId: string, targetId: string, displayName: string, parameter?: string, xp?: number) {
  const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === awardId)!
  return resolvePendingLifeModuleAward(character, pending.id, {
    type: targetId.startsWith('skill.') ? 'skill' : 'attribute', targetId, displayName,
    ...(parameter ? { parameter: { kind: 'subskill' as const, value: parameter } } : {}),
  }, xp)
}

describe('Alpha Slice 72 Trade School', () => {
  it('models the exact school, Field costs, three distinct governed Skills, and durable commit state', () => {
    const committed = stage3Draft()
    const before = structuredClone(committed)
    let trade = applyStage3School(committed, TRADE_SCHOOL_ID, [MERCHANT_FIELD_ID, JOURNALIST_FIELD_ID])

    expect(committed).toEqual(before)
    expect(trade.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: TRADE_SCHOOL_ID, baseCostXp: 560, fieldCostXp: 288, costXp: 848 })
    expect(skillFieldCost(getSkillField(MERCHANT_FIELD_ID), 24)).toBe(144)
    expect(skillFieldCost(getSkillField(JOURNALIST_FIELD_ID), 24)).toBe(144)
    expect(trade.creation.lifeModules!.pendingAwards).toEqual(expect.arrayContaining([
      expect.objectContaining({ awardId: 'trade-school.attribute.other', excludedTargetIds: ['INT'] }),
      expect.objectContaining({ awardId: 'trade-school.skills.any-three', kind: 'modeled-skill-choice', remainingGrants: 3, distinctDestinations: true }),
      expect.objectContaining({ awardId: 'trade-school.flexible', remainingXp: 200 }),
    ]))
    expect(modeledSkillChoiceOptions(trade)).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: 'skill.perception/' }),
      expect.objectContaining({ value: 'skill.interest/__open__', inputMode: 'open-subject' }),
    ]))

    const attribute = trade.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'trade-school.attribute.other')!
    expect(() => resolvePendingLifeModuleAward(trade, attribute.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' })).toThrow('not a legal destination')
    trade = resolvePendingLifeModuleAward(trade, attribute.id, { type: 'attribute', targetId: 'WIL', displayName: 'WIL' })

    trade = resolveAward(trade, 'trade-school.skills.any-three', 'skill.perception', 'Perception')
    expect(() => resolveAward(trade, 'trade-school.skills.any-three', 'skill.perception', 'Perception')).toThrow('already been selected')
    trade = resolveAward(trade, 'trade-school.skills.any-three', 'skill.acting', 'Acting')
    trade = resolveAward(trade, 'trade-school.skills.any-three', 'skill.interest', 'Interest/History', 'History')
    expect(trade.skills.find((entry) => entry.displayName === 'Perception')?.accumulatedXp).toBe(60)
    expect(trade.skills.find((entry) => entry.displayName === 'Acting')?.accumulatedXp).toBe(50)
    expect(trade.skills.find((entry) => entry.displayName === 'Interest/History')?.accumulatedXp).toBe(20)

    for (const pending of [...trade.creation.lifeModules!.pendingAwards].filter((entry) => entry.skillFieldChoice)) {
      const option = modeledSkillChoiceOptions(trade).find((entry) => entry.targetId === pending.requiredSkillId)!
      trade = resolvePendingLifeModuleAward(trade, pending.id, option)
    }
    trade = resolveAward(trade, 'trade-school.flexible', 'INT', 'INT', undefined, 200)

    expect(trade.creation.lifeModules!.pendingAwards).toEqual([])
    expect(trade.chronology.find((entry) => entry.eventId === `${TRADE_SCHOOL_ID}.complete`)?.date).toBe('age:19')
    expect(JSON.parse(JSON.stringify(trade))).toEqual(trade)
  })
})
