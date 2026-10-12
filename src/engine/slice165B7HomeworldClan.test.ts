import { describe, expect, it } from 'vitest'
import { clanIdentityState, clanCasteState } from '../domain/character/clanIdentity'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
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

  it('commits Blood Spirit Exceptional Attribute to the canonical Trait identity and WIL parameter', () => {
    const transaction = buildLifeModuleTransaction(fixture(), [{ kind: 'grant-homeworld-clan-package', clanId: 'blood-spirit' }])
    validateLifeModuleTransaction(transaction)
    const committed = commitLifeModuleTransaction(transaction)
    const trait = committed.traits.find((entry) => entry.traitId === 'trait.exceptional-attribute')
    expect(trait).toMatchObject({ accumulatedXp: 200, attainedTp: 2, active: true, parameters: { attribute: 'WIL' } })
    expect(trait?.sourceAwards).toContainEqual(expect.objectContaining({ xp: 200 }))
    expect(committed.traits.some((entry) => entry.traitId === 'trait.exceptional-attribute/wil')).toBe(false)
    expect(committed.clanPackageHistory?.[0].awards).toContainEqual(expect.objectContaining({ id: 'blood-spirit.exceptional-wil', amount: 200 }))

    const restored = decodeCharacter(encodeCharacter(committed), { allowInternalClanRecord: true })
    expect(restored.traits.find((entry) => entry.traitId === 'trait.exceptional-attribute')).toEqual(trait)
    expect(restored.clanPackageHistory).toEqual(committed.clanPackageHistory)
  })

  it('commits Ice Hellion Arctic Survival to the canonical Skill address and preserves Homeworld accumulation', () => {
    const transaction = buildLifeModuleTransaction(fixture(), [{ kind: 'grant-homeworld-clan-package', clanId: 'ice-hellion' }])
    validateLifeModuleTransaction(transaction)
    const committed = commitLifeModuleTransaction(transaction)
    const survival = committed.skills.find((entry) => entry.address.skillId === 'skill.survival' && entry.address.parameter?.value === 'Arctic')
    expect(survival).toMatchObject({ accumulatedXp: 10, address: { skillId: 'skill.survival', parameter: { kind: 'subskill', value: 'Arctic' } } })
    expect(survival?.sourceAwards).toContainEqual(expect.objectContaining({ xp: 10 }))
    expect(committed.skills.some((entry) => entry.address.skillId === 'skill.survival/arctic')).toBe(false)
    expect(committed.skills.find((entry) => entry.address.skillId === 'skill.interest' && entry.address.parameter?.value === 'Clan Remembrance')).toMatchObject({ accumulatedXp: 40, sourceAwards: [{ xp: 25 }, { xp: 15 }] })
    expect(committed.clanPackageHistory?.[0].awards).toContainEqual(expect.objectContaining({ id: 'ice-hellion.survival', amount: 10 }))

    const restored = decodeCharacter(encodeCharacter(committed), { allowInternalClanRecord: true })
    expect(restored.skills.find((entry) => entry.address.skillId === 'skill.survival' && entry.address.parameter?.value === 'Arctic')).toEqual(survival)
    expect(restored.clanPackageHistory).toEqual(committed.clanPackageHistory)
  })
})
