import { describe, expect, it } from 'vitest'
import { validateClanPackageHistory, type ClanPackageHistoryRecord } from './clanPackageHistory'
import { HOMEWORLD_CLAN_PACKAGES } from './clanPackages'

const source = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 70, ruleId: 'homeworld-clan-sub-affiliations' }
function record(overrides: Partial<ClanPackageHistoryRecord> = {}): ClanPackageHistoryRecord {
  return {
    version: 1, transactionId: 'txn.homeworld.star-adder.1', characterId: 'character-1', clanId: 'star-adder', parentAffiliationId: 'affiliation.clan', packageId: 'stage0.clan-sub-affiliation.star-adder', status: 'committed',
    awards: [{ id: 'star-adder.int', type: 'attribute-xp', destination: 'INT', amount: 50, packageId: 'stage0.clan-sub-affiliation.star-adder', source }], choices: [], source, committedAt: '3025-01-01T00:00:00.000Z', ...overrides,
  }
}

describe('specific Clan package history contract', () => {
  it('represents all eight canonical Homeworld Clan identities', () => {
    const ids = ['blood-spirit', 'cloud-cobra', 'coyote', 'fire-mandrill', 'goliath-scorpion', 'ice-hellion', 'star-adder', 'steel-viper'] as const
    for (const clanId of ids) {
      const award = HOMEWORLD_CLAN_PACKAGES.find((pkg) => pkg.identity.id === clanId)!.fixedAwards[0]
      expect(validateClanPackageHistory([record({ clanId, packageId: `stage0.clan-sub-affiliation.${clanId}`, transactionId: `txn.${clanId}`, awards: [{ id: award.id, type: award.kind === 'attribute' ? 'attribute-xp' : award.kind === 'trait' ? 'trait-xp' : 'skill-xp', destination: award.subject, amount: award.xp, packageId: `stage0.clan-sub-affiliation.${clanId}`, source: award.source }] })], 'character-1')).toEqual([])
    }
  })
  it('preserves signed awards and rejects forged package or destination identities', () => {
    expect(validateClanPackageHistory([record({ awards: [{ ...record().awards[0], amount: -50 }] })], 'character-1')).toEqual([])
    expect(validateClanPackageHistory([record({ awards: [{ ...record().awards[0], id: 'forged-award' }] })], 'character-1')).toContain('clanPackageHistory.0.awards.0 is not defined by the selected package.')
    expect(validateClanPackageHistory([record({ awards: [{ ...record().awards[0], destination: 'Unknown/Any' }] })], 'character-1')).toContain('clanPackageHistory.0.awards.0 has an unsupported destination.')
  })
  it('rejects duplicate transactions, duplicate awards, and inconsistent choices', () => {
    const first = record()
    const second = record({ transactionId: 'txn.homeworld.cloud-cobra.1', clanId: 'cloud-cobra', packageId: 'stage0.clan-sub-affiliation.cloud-cobra' })
    expect(validateClanPackageHistory([first, second], 'character-1')).toEqual(expect.arrayContaining([expect.stringContaining('Only one specific Homeworld Clan package')]))
    expect(validateClanPackageHistory([record({ awards: [record().awards[0], record().awards[0]] })], 'character-1')).toContain('clanPackageHistory.0.awards.1 has a duplicate award identity.')
    expect(validateClanPackageHistory([record({ choices: [{ id: 'choice-1', option: 'x', resolvedDestination: 'Interest/Clan History', awardId: 'missing', packageId: record().packageId, source }] })], 'character-1')).toContain('clanPackageHistory.0.choices.0 references an unknown award identity.')
  })
})
