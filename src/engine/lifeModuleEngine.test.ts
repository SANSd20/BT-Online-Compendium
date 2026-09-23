import { describe, expect, it } from 'vitest'
import { BACK_WOODS_ID, BLUE_COLLAR_ID } from '../domain/lifeModules/catalog'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { validateCharacter } from '../validation/validateCharacter'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, createLifeModuleCharacter } from './lifeModuleEngine'

function completeStage0() {
  let character = createLifeModuleCharacter('Xiang', 5000)
  character = applyUniversalStage0(character, 'Mandarin Chinese')
  return applyCapellanCommonality(character, 'Russian')
}

describe('Life Module engine', () => {
  it('creates a sourced draft with a separate module-purchasing pool', () => {
    const character = createLifeModuleCharacter('Xiang')
    expect(character.creation.method).toBe('life-modules')
    expect(character.creation.lifeModules?.moduleXp).toEqual({ starting: 5000, spent: 0, remaining: 5000 })
    expect(character.creation.lifeModules?.phase).toBe('stage-0-universal')
    expect(character.provenance.some((entry) => entry.source?.ruleId === 'life-module-character-creation')).toBe(true)
  })

  it('applies the universal package and Capellan/Commonality without cross-financing the module pool', () => {
    const character = completeStage0()
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 1000, remaining: 4000 })
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(150)
    expect(character.attributes.find((entry) => entry.attributeId === 'EDG')?.accumulatedXp).toBe(150)
    expect(character.skills.find((entry) => entry.displayName === 'Language/Mandarin Chinese')?.accumulatedXp).toBe(20)
    expect(character.skills.find((entry) => entry.displayName === 'Language/Russian')?.accumulatedXp).toBe(10)
    expect(character.traits.find((entry) => entry.displayName === 'Compulsion/Paranoia')).toMatchObject({ accumulatedXp: -100, attainedTp: -1, active: true })
    expect(state.pendingAwards).toEqual(expect.arrayContaining([expect.objectContaining({ awardId: 'commonality.language.fedsuns', xpPerGrant: 5 })]))
    expect(character.affiliations.map((entry) => entry.role)).toEqual(['birth', 'final'])
  })

  it('applies Blue Collar fixed awards and retains every unresolved choice', () => {
    const character = applyStage1Module(completeStage0(), BLUE_COLLAR_ID)
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 1210, remaining: 3790 })
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')?.accumulatedXp).toBe(145)
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(140)
    expect(state.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining([
      'commonality.language.fedsuns', 'blue-collar.career', 'blue-collar.interests', 'blue-collar.flexible',
    ]))
    expect(state.pendingAwards.find((entry) => entry.awardId === 'blue-collar.flexible')?.remainingGrants).toBe(4)
    expect(state.phase).toBe('stage-1-resolution')
  })

  it('applies Back Woods while retaining its unmet end-of-creation prerequisites', () => {
    const character = applyStage1Module(completeStage0(), BACK_WOODS_ID)
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 1290, remaining: 3710 })
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')).toMatchObject({ accumulatedXp: 200, purchasedLevel: 2 })
    expect(character.traits.find((entry) => entry.traitId === 'trait.fit')).toMatchObject({ accumulatedXp: 100, attainedTp: 1, active: true })
    expect(character.traits.find((entry) => entry.traitId === 'trait.wealth')).toMatchObject({ accumulatedXp: -60, attainedTp: null, active: false })
    expect(character.skills.find((entry) => entry.displayName === 'Language/Mandarin Chinese')).toMatchObject({ accumulatedXp: 15, level: null })
    expect(state.prerequisiteIssues.filter((entry) => entry.status === 'outstanding').map((entry) => entry.prerequisiteId)).toEqual(['back-woods.str', 'back-woods.bod'])
    expect(state.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining(['back-woods.skill.survival', 'back-woods.flexible']))
  })

  it('rejects an unknown module request and overspending', () => {
    expect(() => applyStage1Module(completeStage0(), 'stage1.unknown' as typeof BLUE_COLLAR_ID)).toThrow('Unknown Slice 4 Stage 1 module')
    let character = createLifeModuleCharacter('Short Pool', 900)
    character = applyUniversalStage0(character, 'English')
    expect(() => applyCapellanCommonality(character, 'Russian')).toThrow('overspend')
  })

  it('round-trips a Life Module draft with provenance and unresolved awards intact', () => {
    const character = applyStage1Module(completeStage0(), BACK_WOODS_ID)
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-23T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(validateCharacter(decoded).valid).toBe(true)
    expect(decoded.creation.lifeModules?.pendingAwards.length).toBe(3)
    expect(decoded.lifeModuleHistory.every((entry) => entry.provenanceIds.length > 0)).toBe(true)
  })

  it('flags malformed Life Module spending', () => {
    const character = completeStage0()
    character.creation.lifeModules!.moduleXp.remaining = 4999
    const validation = validateCharacter(character)
    expect(validation.valid).toBe(false)
    expect(validation.issues.map((entry) => entry.id)).toContain('life-modules.xp.balance')
  })

  it('flags malformed pending awards and missing module provenance', () => {
    const character = applyStage1Module(completeStage0(), BLUE_COLLAR_ID)
    character.creation.lifeModules!.pendingAwards[0].remainingGrants = 0
    character.lifeModuleHistory[0].provenanceIds = ['missing-provenance']
    character.attributes[0].sourceAwards = []
    const ids = validateCharacter(character).issues.map((entry) => entry.id)
    expect(ids).toContain('life-modules.pending-award.malformed')
    expect(ids).toContain('life-modules.module.provenance')
    expect(ids).toContain('creation.provenance.required')
  })
})
