import { describe, expect, it } from 'vitest'
import { clanBirthOriginState, clanCasteState, clanIdentityState } from '../domain/character/clanIdentity'
import { applyUniversalStage0, buildLifeModuleTransaction, commitLifeModuleTransaction, createLifeModuleCharacter, validateLifeModuleTransaction } from './lifeModuleEngine'

function clanFixture() {
  const character = createLifeModuleCharacter('Slice 153 disposable')
  character.clanIdentity = clanIdentityState()
  character.clanCaste = clanCasteState('warrior')
  character.clanBirthOrigin = clanBirthOriginState('trueborn')
  character.phenotypeId = 'phenotype.mechwarrior'
  character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'final', provenanceId: 'slice153-test' })
  return character
}

describe('Alpha Slice 153 Universal Stage 0 Clan integration', () => {
  it.each(['stage0.clan.homeworld-clan', 'stage0.clan.invading-clan'])('resolves %s through the public Universal API', (contextId) => {
    const resolved = applyUniversalStage0(clanFixture(), contextId, 'Mandarin Chinese')
    expect(resolved.creation.lifeModules?.stage0AffiliationContext).toBe(contextId)
    expect(resolved.creation.lifeModules?.affiliationLanguage).toBe('Mandarin Chinese')
    expect(resolved.skills).toEqual(expect.arrayContaining([
      expect.objectContaining({ address: { skillId: 'skill.language', parameter: { kind: 'subskill', value: 'Mandarin Chinese' } }, accumulatedXp: 20 }),
    ]))
    expect(resolved.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: 'stage0.universal-fixed-xp', costXp: 850 })
    expect(resolved.provenance.at(-1)?.source).toMatchObject({ page: 62 })
  })

  it('rejects missing and invalid language choices without mutation', () => {
    const base = clanFixture()
    expect(() => applyUniversalStage0(base, 'stage0.clan.homeworld-clan', '')).toThrow('listed primary or secondary language')
    expect(() => applyUniversalStage0(base, 'stage0.clan.homeworld-clan', 'Klingon')).toThrow('listed primary or secondary language')
    expect(base.creation.lifeModules?.stage0AffiliationContext).toBeUndefined()
  })

  it('continues into the real Clan package transaction and Crèche transaction', () => {
    let character = applyUniversalStage0(clanFixture(), 'stage0.clan.homeworld-clan', 'Mandarin Chinese')
    const transaction = buildLifeModuleTransaction(character, [
      { kind: 'grant-clan-package', awardId: 'stage0.homeworld-clan', packageId: 'homeworld-clan' },
      { kind: 'grant-clan-package', awardId: 'stage0.mechwarrior', packageId: 'mechwarrior' },
      {
        kind: 'grant-trueborn-creche',
        choices: [
          { type: 'attribute', targetId: 'BOD', displayName: 'BOD' },
          { type: 'attribute', targetId: 'DEX', displayName: 'DEX' },
          { type: 'attribute', targetId: 'RFL', displayName: 'RFL' },
          { type: 'attribute', targetId: 'WIL', displayName: 'WIL' },
          { type: 'trait', targetId: 'trait.fit', displayName: 'Fit' },
        ],
      },
    ])
    validateLifeModuleTransaction(transaction)
    expect(transaction.errors).toEqual([])
    character = commitLifeModuleTransaction(transaction)
    expect(character.lifeModuleHistory.map((entry) => entry.moduleId)).toEqual([
      'stage0.universal-fixed-xp',
      'stage0.clan-package.homeworld-clan',
      'stage0.clan-package.mechwarrior',
      'stage1.trueborn-creche',
    ])
    expect(character.creation.lifeModules?.resolvedAwards.filter((award) => award.awardId === 'creche.flexible')).toHaveLength(5)
    expect(character.creation.lifeModules?.stage0AffiliationContext).toBe('stage0.clan.homeworld-clan')
  })
})
