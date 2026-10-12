import { describe, expect, it } from 'vitest'
import { createClanSubAffiliationDraft, clanSubAffiliationPackageId, resolveClanChoiceDestination, validateClanSubAffiliationDraft } from './clanSubAffiliation'

describe('Alpha Slice 165-B1 specific Clan draft foundation', () => {
  it('creates canonical additive package state without applying awards', () => {
    const draft = createClanSubAffiliationDraft('cloud-cobra')
    expect(draft).toMatchObject({ clanId: 'cloud-cobra', category: 'homeworld-clan', packageId: clanSubAffiliationPackageId('cloud-cobra'), status: 'incomplete' })
    expect(draft.choices).toEqual([])
    expect(validateClanSubAffiliationDraft(draft)).toContain('Required Clan choice is unresolved: cloud-cobra.other-skill')
  })

  it('resolves only governed destinations and invalidates stale choices', () => {
    expect(resolveClanChoiceDestination('star-adder', 'star-adder.compulsion', 'Compulsion/Adder Arrogance')).toBe('Compulsion/Adder Arrogance')
    expect(() => resolveClanChoiceDestination('star-adder', 'star-adder.compulsion', 'Compulsion/Unknown')).toThrow('Unsupported or invalid')
    expect(validateClanSubAffiliationDraft({ ...createClanSubAffiliationDraft('star-adder'), clanId: 'cloud-cobra', packageId: clanSubAffiliationPackageId('star-adder') })).toContain('Specific Clan draft identity or package relationship is invalid.')
  })
})
