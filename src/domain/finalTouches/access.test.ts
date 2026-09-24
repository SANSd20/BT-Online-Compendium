import { describe, expect, it } from 'vitest'
import { adjustedOwnedEquipmentLimits, calculateEquipmentAccess } from './rules'

const rating = { tech: 'D' as const, availability: 'B' as const, legality: 'C' as const }

describe('Alpha Slice 12 equipment access calculator', () => {
  it('does not penalize neutral or native-affiliation items', () => {
    for (const itemAffiliationCode of [null, 'CC']) {
      const result = calculateEquipmentAccess({ equippedTp: 2, affiliationCategory: 'inner-sphere', nativeAffiliationCode: 'CC', itemAffiliationCode, itemRating: rating, ownership: 'Owned', issuedGearEnabled: false })
      expect(result.foreignAffiliation).toBe(false)
      expect(result.effectiveItemRating).toEqual(rating)
    }
  })

  it('raises foreign Availability and Legality one step', () => {
    const result = calculateEquipmentAccess({ equippedTp: 4, affiliationCategory: 'inner-sphere', nativeAffiliationCode: 'LA', itemAffiliationCode: 'CC', itemRating: rating, ownership: 'Owned', issuedGearEnabled: false })
    expect(result.foreignAffiliation).toBe(true)
    expect(result.effectiveItemRating).toEqual({ tech: 'D', availability: 'C', legality: 'D' })
  })

  it('adjusts the Owned Tech cap for Periphery and Clan characters', () => {
    expect(adjustedOwnedEquipmentLimits(-1, 'periphery').tech).toBe('B')
    expect(adjustedOwnedEquipmentLimits(1, 'periphery').tech).toBe('C')
    expect(adjustedOwnedEquipmentLimits(1, 'clan').tech).toBe('E')
    expect(adjustedOwnedEquipmentLimits(8, 'clan').tech).toBe('F')
  })

  it('blocks Owned items above effective limits with reason codes', () => {
    const result = calculateEquipmentAccess({ equippedTp: 0, affiliationCategory: 'inner-sphere', nativeAffiliationCode: 'CC', itemAffiliationCode: null, itemRating: rating, ownership: 'Owned', issuedGearEnabled: false })
    expect(result.allowed).toBe(false)
    expect(result.reasons).toContain('legality-exceeded')
  })

  it('requires Issued Gear and uses Inner Sphere E/D/D or Clan F/D/D', () => {
    const itemRating = { tech: 'F' as const, availability: 'D' as const, legality: 'D' as const }
    expect(calculateEquipmentAccess({ equippedTp: 0, affiliationCategory: 'clan', nativeAffiliationCode: 'CJF', itemAffiliationCode: null, itemRating, ownership: 'Issued', issuedGearEnabled: false })).toMatchObject({ allowed: false, reasons: ['issued-gear-disabled'] })
    expect(calculateEquipmentAccess({ equippedTp: 0, affiliationCategory: 'inner-sphere', nativeAffiliationCode: 'CC', itemAffiliationCode: null, itemRating, ownership: 'Issued', issuedGearEnabled: true })).toMatchObject({ allowed: false, characterLimits: { tech: 'E', availability: 'D', legality: 'D' } })
    expect(calculateEquipmentAccess({ equippedTp: 0, affiliationCategory: 'clan', nativeAffiliationCode: 'CJF', itemAffiliationCode: null, itemRating, ownership: 'Issued', issuedGearEnabled: true })).toMatchObject({ allowed: true, characterLimits: { tech: 'F', availability: 'D', legality: 'D' } })
  })
})
