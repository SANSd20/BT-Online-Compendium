import { describe, expect, it } from 'vitest'
import { resolveAffiliationBoundLifeModuleDestination, createLifeModuleCharacter } from './lifeModuleEngine'

describe('internal Clan affiliation Skill context', () => {
  it('resolves Protocol/Affiliation to the canonical Clan subject through the existing engine', () => {
    const character = createLifeModuleCharacter('Clan context fixture')
    character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'final', provenanceId: 'test-clan-context' })

    expect(resolveAffiliationBoundLifeModuleDestination(character, 'skill.protocol', 'Protocol/Affiliation')).toEqual({
      type: 'skill',
      address: { skillId: 'skill.protocol', parameter: { kind: 'subskill', value: 'Clan' } },
      displayName: 'Protocol/Clan',
    })
  })
})
