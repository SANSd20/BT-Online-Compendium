import { describe, expect, it } from 'vitest'
import { createCharacterDraft } from '../engine/characterFactory'
import { clanIdentityState } from '../domain/character/clanIdentity'
import { validateCharacter } from './validateCharacter'

describe('Slice 120 Clan Phenotype eligibility', () => {
  it('rejects a Clan-only Phenotype without Clan identity', () => {
    const character = createCharacterDraft('life-modules', 'Phenotype eligibility')
    character.phenotypeId = 'phenotype.elemental'
    expect(validateCharacter(character).issues.some((item) => item.id === 'character.phenotype.clan-eligibility')).toBe(true)
  })

  it('retains source-backed Attribute legality and Exceptional Attribute interaction for Clan Phenotypes', () => {
    const character = createCharacterDraft('life-modules', 'Clan Phenotype legality')
    character.clanIdentity = clanIdentityState()
    character.phenotypeId = 'phenotype.elemental'
    character.attributes = [{ attributeId: 'STR', accumulatedXp: 800, purchasedLevel: 8, phenotypeModifier: 0, sourceAwards: [] }]
    expect(validateCharacter(character).issues.some((item) => item.id === 'character.phenotype.clan-eligibility')).toBe(false)
  })
})
