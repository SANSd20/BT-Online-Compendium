import { CLAN_AFFILIATION_PACKAGES, CLAN_CASTE_PACKAGES, isClanAffiliationPackageId, isClanCastePackageId } from './clanPackages'
import { describe, expect, it } from 'vitest'

describe('Slice 119 Clan package catalog', () => {
  it('records the two Core Clan affiliation packages without activating them', () => {
    expect(CLAN_AFFILIATION_PACKAGES.map((item) => [item.id, item.moduleCostXp])).toEqual([['invading-clan', 75], ['homeworld-clan', 50]])
    expect(CLAN_AFFILIATION_PACKAGES.every((item) => item.support === 'unsupported')).toBe(true)
  })
  it('records all ten printed Clan caste packages and source awards', () => {
    expect(CLAN_CASTE_PACKAGES).toHaveLength(10)
    expect(CLAN_CASTE_PACKAGES.find((item) => item.id === 'elemental-advanced')?.fixedAwardSummary).toContain('BOD +200')
    expect(CLAN_CASTE_PACKAGES.find((item) => item.id === 'merchant')?.fixedAwardSummary).toContain('Streetwise/Clan +15')
    expect(CLAN_CASTE_PACKAGES.every((item) => item.source.page === 71 && item.support === 'unsupported')).toBe(true)
  })
  it('guards package identifiers', () => {
    expect(isClanAffiliationPackageId('homeworld-clan')).toBe(true)
    expect(isClanCastePackageId('laborer')).toBe(true)
    expect(isClanCastePackageId('unknown')).toBe(false)
  })
})
