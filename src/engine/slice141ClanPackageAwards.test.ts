import { describe, expect, it } from 'vitest'
import { clanCasteState, clanIdentityState } from '../domain/character/clanIdentity'
import { buildLifeModuleTransaction, commitLifeModuleTransaction, createLifeModuleCharacter, validateLifeModuleTransaction } from './lifeModuleEngine'

describe('Alpha Slice 141 internal Clan package awards', () => {
  function clanFixture() {
    const character = createLifeModuleCharacter('Clan package fixture')
    character.clanIdentity = clanIdentityState()
    character.clanCaste = clanCasteState('warrior')
    character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'final', provenanceId: 'fixture-clan' })
    return character
  }

  it('commits the exact Invading Clan fixed awards atomically and records package identity', () => {
    const transaction = buildLifeModuleTransaction(clanFixture(), [{ kind: 'grant-clan-package', awardId: 'stage0.invading-clan', packageId: 'invading-clan' }])
    validateLifeModuleTransaction(transaction)
    expect(transaction.status).toBe('validated')
    const committed = commitLifeModuleTransaction(transaction)
    expect(committed.clanAffiliationPackageId).toBe('invading-clan')
    expect(committed.xp.creation.allocated).toBeGreaterThan(0)
    expect(committed.traits.some((entry) => entry.traitId === 'trait.compulsion' && entry.parameters.compulsion === 'Arrogance')).toBe(true)
    expect(committed.skills.some((entry) => entry.address.skillId === 'skill.protocol' && entry.address.parameter?.value === 'Clan')).toBe(true)
  })

  it('rejects unsupported caste award bundles without mutating the base state', () => {
    const base = clanFixture()
    const transaction = buildLifeModuleTransaction(base, [{ kind: 'grant-clan-package', awardId: 'stage0.elemental', packageId: 'elemental' }])
    expect(transaction.status).toBe('failed')
    expect(transaction.prospectiveState).toBeNull()
    expect(transaction.baseState).toEqual(base)
  })
})
