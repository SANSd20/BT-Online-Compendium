import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID } from './domain/lifeModules/catalog'
import { capellanCitizenshipEligibility } from './domain/lifeModules/capellanRestrictions'
import { applyCapellanCommonality, applyUniversalStage0, createLifeModuleCharacter } from './engine/lifeModuleEngine'
import { asCapellanCitizen } from './capellanFixture'

describe('Capellan test fixtures', () => {
  it('adds source-backed Citizenship without replacing Commonality state', () => {
    let character = applyUniversalStage0(createLifeModuleCharacter('Fixture'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
    character = applyCapellanCommonality(character, 'Russian')
    const before = structuredClone(character)
    character = asCapellanCitizen(character)
    expect(character.affiliations).toEqual(before.affiliations)
    expect(character.creation.lifeModules?.stage0SubAffiliation).toBe(before.creation.lifeModules?.stage0SubAffiliation)
    expect(character.skills).toEqual(expect.arrayContaining(before.skills))
    expect(character.traits.filter((entry) => entry.traitId === 'trait.citizenship')).toHaveLength(1)
    expect(character.traits.find((entry) => entry.traitId === 'trait.citizenship')).toMatchObject({ accumulatedXp: 50, attainedTp: 1, active: true, parameters: { subject: 'Capellan Confederation' } })
    expect(capellanCitizenshipEligibility(character, 3, 'stage3.university').eligible).toBe(true)
  })

  it('is idempotent and preserves existing Citizenship provenance', () => {
    const character = asCapellanCitizen(createLifeModuleCharacter('Fixture'))
    const once = structuredClone(character)
    const twice = asCapellanCitizen(character)
    expect(twice).toEqual(once)
  })
})
