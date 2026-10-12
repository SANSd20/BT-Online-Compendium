import { describe, expect, it } from 'vitest'
import { clanIdentityState, clanCasteState } from '../domain/character/clanIdentity'
import { buildLifeModuleTransaction, commitLifeModuleTransaction, createLifeModuleCharacter, validateLifeModuleTransaction } from './lifeModuleEngine'

function fixture() {
  const value = createLifeModuleCharacter('B7 fixture')
  value.clanIdentity = clanIdentityState()
  value.clanCaste = clanCasteState('warrior')
  value.affiliations.push({ affiliationId: 'affiliation.clan', role: 'final', provenanceId: 'fixture-clan' })
  const generic = buildLifeModuleTransaction(value, [{ kind: 'grant-clan-package', awardId: 'stage0.homeworld-clan', packageId: 'homeworld-clan' }])
  validateLifeModuleTransaction(generic)
  return commitLifeModuleTransaction(generic)
}

describe('Alpha Slice 165-B7 atomic Homeworld Clan packages', () => {
  it.each(['blood-spirit', 'ice-hellion'] as const)('commits the complete %s fixed package once', (clanId) => {
    const base = fixture()
    const transaction = buildLifeModuleTransaction(base, [{ kind: 'grant-homeworld-clan-package', clanId }])
    validateLifeModuleTransaction(transaction)
    expect(transaction.status).toBe('validated')
    const committed = commitLifeModuleTransaction(transaction)
    expect(committed.clanSubAffiliationId).toBe(clanId)
    expect(committed.clanPackageHistory).toHaveLength(1)
    expect(committed.clanPackageHistory?.[0].awards.length).toBeGreaterThan(0)
    expect(committed.lifeModuleHistory.at(-1)?.costXp).toBe(0)
  })

  it('does not mutate the base state or create history when duplicate commitment fails', () => {
    const base = fixture()
    const first = buildLifeModuleTransaction(base, [{ kind: 'grant-homeworld-clan-package', clanId: 'blood-spirit' }])
    validateLifeModuleTransaction(first)
    const committed = commitLifeModuleTransaction(first)
    const before = structuredClone(committed)
    const duplicate = buildLifeModuleTransaction(committed, [{ kind: 'grant-homeworld-clan-package', clanId: 'ice-hellion' }])
    expect(duplicate.status).toBe('failed')
    expect(duplicate.prospectiveState).toBeNull()
    expect(duplicate.baseState).toEqual(before)
  })

  it('does not activate the other six Homeworld Clan packages', () => {
    const transaction = buildLifeModuleTransaction(fixture(), [{ kind: 'grant-homeworld-clan-package', clanId: 'star-adder' }])
    expect(transaction.status).toBe('failed')
    expect(transaction.prospectiveState).toBeNull()
  })
})
