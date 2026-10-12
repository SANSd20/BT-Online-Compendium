import { describe, expect, it } from 'vitest'
import { HOMEWORLD_CLAN_IDS, isHomeworldClanId } from './clanIdentity'
import { HOMEWORLD_CLAN_PACKAGES, validateHomeworldClanPackages } from './clanPackages'

describe('Alpha Slice 165-A Homeworld Clan catalog foundation', () => {
  it('represents all eight source-defined identities', () => {
    expect(HOMEWORLD_CLAN_PACKAGES.map((entry) => entry.identity.id)).toEqual([...HOMEWORLD_CLAN_IDS])
    expect(HOMEWORLD_CLAN_PACKAGES.map((entry) => entry.identity.displayName)).toEqual(['Blood Spirit', 'Cloud Cobra', 'Coyote', 'Fire Mandrill', 'Goliath Scorpion', 'Ice Hellion', 'Star Adder', 'Steel Viper'])
    expect(HOMEWORLD_CLAN_PACKAGES.every((entry) => entry.identity.category === 'homeworld-clan' && entry.identity.parentAffiliationId === 'affiliation.clan')).toBe(true)
  })

  it('preserves awards, negative awards, choices, and provenance', () => {
    expect(validateHomeworldClanPackages()).toEqual([])
    expect(HOMEWORLD_CLAN_PACKAGES.every((entry) => entry.support === 'unsupported' && entry.unsupportedDependencies.length > 0)).toBe(true)
    expect(HOMEWORLD_CLAN_PACKAGES.flatMap((entry) => entry.fixedAwards).some((award) => award.xp < 0)).toBe(true)
    expect(HOMEWORLD_CLAN_PACKAGES.find((entry) => entry.identity.id === 'cloud-cobra')?.choices[0]).toMatchObject({ id: 'cloud-cobra.other-skill', requiredCount: 1, xp: 10 })
    expect(HOMEWORLD_CLAN_PACKAGES.find((entry) => entry.identity.id === 'fire-mandrill')?.choices).toHaveLength(3)
    expect(HOMEWORLD_CLAN_PACKAGES.find((entry) => entry.identity.id === 'star-adder')?.choices[0].allowedSubjects).toEqual(['Compulsion/Adder Arrogance', 'Compulsion/Burrock Forever!'])
    expect(HOMEWORLD_CLAN_PACKAGES.flatMap((entry) => [...entry.fixedAwards, ...entry.choices]).every((item) => item.source.page === 70)).toBe(true)
  })

  it('rejects non-canonical identities without enabling a player path', () => {
    expect(isHomeworldClanId('blood-spirit')).toBe(true)
    expect(isHomeworldClanId('homeworld-clan')).toBe(false)
    expect(HOMEWORLD_CLAN_PACKAGES.every((entry) => entry.support === 'unsupported')).toBe(true)
  })
})
