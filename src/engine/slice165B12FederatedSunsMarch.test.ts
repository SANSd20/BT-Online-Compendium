import { describe, expect, it } from 'vitest'
import { FEDERATED_SUNS_CAPELLAN_MARCH_ID, FEDERATED_SUNS_DRACONIS_MARCH_ID } from '../domain/lifeModules/catalog'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { applyStage0Affiliation, createLifeModuleCharacter, resolvePendingLifeModuleAward } from './lifeModuleEngine'

describe('Alpha Slice 165-B12 Federated Suns March expansion', () => {
  it('applies Capellan March fixed awards and the closed five-language choice', () => {
    const character = applyStage0Affiliation(createLifeModuleCharacter('Capellan March'), FEDERATED_SUNS_CAPELLAN_MARCH_ID, 'English', undefined, 'Strategy', 'Spanish', 'no', undefined, undefined, undefined, FEDERATED_SUNS_CAPELLAN_MARCH_ID)
    expect(character.creation.lifeModules?.moduleXp).toMatchObject({ spent: 1000, remaining: 4000 })
    expect(character.attributes).toContainEqual(expect.objectContaining({ attributeId: 'WIL', accumulatedXp: 140 }))
    expect(character.traits).toContainEqual(expect.objectContaining({ displayName: 'Compulsion/Hatred of Capellan Confederation', accumulatedXp: -50, parameters: { compulsion: 'Hatred of Capellan Confederation' } }))
    expect(character.skills).toContainEqual(expect.objectContaining({ displayName: 'Language/Spanish', accumulatedXp: 5 }))
    expect(character.creation.lifeModules?.pendingAwards).toHaveLength(0)
    expect(decodeCharacter(encodeCharacter(character, '2026-10-12T00:00:00.000Z'))).toEqual(character)
  })

  it('keeps Draconis Art/Any pending until an explicit open subject is resolved', () => {
    const pending = applyStage0Affiliation(createLifeModuleCharacter('Draconis March'), FEDERATED_SUNS_DRACONIS_MARCH_ID, 'English', undefined, 'Protocol', undefined, 'no', undefined, undefined, undefined, FEDERATED_SUNS_DRACONIS_MARCH_ID)
    expect(pending.creation.lifeModules?.pendingAwards.some((award) => award.awardId === 'draconis-march.skill.art')).toBe(true)
    expect(pending.attributes).toContainEqual(expect.objectContaining({ attributeId: 'EDG', accumulatedXp: 125 }))
    const award = pending.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'draconis-march.skill.art')!
    const resolved = resolvePendingLifeModuleAward(pending, award.id, { type: 'skill', targetId: 'skill.art', displayName: 'Art/Sculpture', parameter: { kind: 'subskill', value: 'Sculpture' } })
    expect(resolved.creation.lifeModules?.pendingAwards.some((entry) => entry.awardId === 'draconis-march.skill.art')).toBe(false)
    expect(resolved.skills).toContainEqual(expect.objectContaining({ displayName: 'Art/Sculpture', accumulatedXp: 10 }))
    expect(decodeCharacter(encodeCharacter(resolved, '2026-10-12T00:00:00.000Z'))).toEqual(resolved)
  })

  it('persists a resolved Draconis Art/Any grant with exactly one grant record', () => {
    const character = applyStage0Affiliation(createLifeModuleCharacter('Draconis Sculpture'), FEDERATED_SUNS_DRACONIS_MARCH_ID, 'English', undefined, 'Protocol', 'Sculpture', 'no', undefined, undefined, undefined, FEDERATED_SUNS_DRACONIS_MARCH_ID)
    const state = character.creation.lifeModules!
    expect(state.pendingAwards.some((entry) => entry.awardId === 'draconis-march.skill.art')).toBe(false)
    expect(state.choiceGrantRequirements.filter((entry) => entry.awardId === 'draconis-march.skill.art')).toHaveLength(1)
    expect(state.resolvedAwards.filter((entry) => entry.awardId === 'draconis-march.skill.art')).toHaveLength(1)
    expect(character.skills).toContainEqual(expect.objectContaining({ displayName: 'Art/Sculpture', accumulatedXp: 10 }))
    expect(decodeCharacter(encodeCharacter(character, '2026-10-12T00:00:00.000Z'))).toEqual(character)
  })

  it('does not apply March awards for a parent-only selection', () => {
    const character = applyStage0Affiliation(createLifeModuleCharacter('Parent only'), FEDERATED_SUNS_CAPELLAN_MARCH_ID, 'English', undefined, 'Protocol', undefined, 'no', undefined, undefined, undefined, 'no')
    expect(character.creation.lifeModules?.stage0SubAffiliation).toBe('no')
    expect(character.traits.some((entry) => entry.displayName?.includes('Hatred of Capellan'))).toBe(false)
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(100)
  })
})
