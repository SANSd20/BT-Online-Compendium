import { describe, expect, it } from 'vitest'
import {
  EQUIPMENT_CATALOG,
  EQUIPMENT_CATALOG_CATEGORIES,
  filterEquipmentCatalog,
  getEquipmentCatalogItem,
  STARTER_EQUIPMENT_CATALOG,
  SLICE_12_EQUIPMENT_CATALOG,
  parseRawEquipmentRating,
  validateEquipmentCatalog,
} from './catalog'

describe('Alpha Slice 11 starter equipment catalog', () => {
  it('contains exactly the 17 audited starter entries with unique valid IDs', () => {
    expect(STARTER_EQUIPMENT_CATALOG).toHaveLength(17)
    expect(new Set(STARTER_EQUIPMENT_CATALOG.map((entry) => entry.id)).size).toBe(17)
    expect(validateEquipmentCatalog()).toEqual([])
  })

  it('adds exactly 17 Slice 12 entries with raw and hand-audited normalized ratings', () => {
    expect(SLICE_12_EQUIPMENT_CATALOG).toHaveLength(17)
    expect(EQUIPMENT_CATALOG).toHaveLength(34)
    expect(new Set(EQUIPMENT_CATALOG.map((entry) => entry.id)).size).toBe(34)
    for (const item of SLICE_12_EQUIPMENT_CATALOG) {
      expect(item.sourceStatus).toBe('audited-core')
      expect(item.sourceKey).toMatch(/^AToW-CTP-p(267|268|269|286|288)$/)
      expect(item.rawEquipmentRating).toBeTruthy()
      const parsed = parseRawEquipmentRating(item.rawEquipmentRating!)
      expect(parsed).not.toBeNull()
      expect(item.ratings.tech).toBe(parsed!.tech)
      expect(item.ratings.legality).toBe(parsed!.legality)
      expect(parsed!.availabilityCodes).toContain(item.ratings.availability)
    }
    expect(validateEquipmentCatalog()).toEqual([])
  })

  it('preserves hand-audited availability without imposing a triplet position', () => {
    expect(getEquipmentCatalogItem('core.personalWeapon.laserPistol.pulse')).toMatchObject({ rawEquipmentRating: 'D/B-F-C/D', rawAvailabilityCodes: ['B', 'F', 'C'], ratings: { availability: 'C' } })
    expect(getEquipmentCatalogItem('core.armor.neoChain.vest')).toMatchObject({ rawEquipmentRating: 'D/X-X-C/D', rawAvailabilityCodes: ['X', 'X', 'C'], ratings: { availability: 'C' } })
    expect(getEquipmentCatalogItem('core.armor.ablative.vest')).toMatchObject({ rawEquipmentRating: 'D/A-B-A/C', rawAvailabilityCodes: ['A', 'B', 'A'], ratings: { availability: 'B' } })
  })

  it('validates malformed raw ratings and normalized mismatches', () => {
    const item = getEquipmentCatalogItem('core.personalWeapon.laserPistol.pulse')
    expect(validateEquipmentCatalog([{ ...item, rawEquipmentRating: 'D/invalid/D' }])).toContain(`Malformed raw equipment rating: ${item.id}`)
    expect(validateEquipmentCatalog([{ ...item, ratings: { ...item.ratings, tech: 'C' } }])).toContain(`Normalized Tech does not match raw rating: ${item.id}`)
    expect(validateEquipmentCatalog([{ ...item, ratings: { ...item.ratings, availability: 'A' } }])).toContain(`Normalized Availability does not appear in raw rating: ${item.id}`)
  })

  it('retains weapon and armor data as inert metadata', () => {
    expect(getEquipmentCatalogItem('core.personalWeapon.laserPistol.standard').metadata).toMatchObject({ apBd: '4E/3' })
    expect(getEquipmentCatalogItem('core.armor.ballisticPlate.vest').metadata).toMatchObject({ bar: '4/6/5/4', patchCostCBills: 50 })
  })

  it('preserves audited costs, ratings, affiliation, metadata, and source labels', () => {
    expect(getEquipmentCatalogItem('core.personalWeapon.autoPistol.standard')).toMatchObject({
      costCBills: 50,
      ratings: { tech: 'C', availability: 'A', legality: 'C' },
      sourceKey: 'AToW-CTP-p265',
      sourceStatus: 'audited-core',
      metadata: { shots: 10, reloadCostCBills: 2 },
    })
    expect(getEquipmentCatalogItem('core.meleeWeapon.vibroblade.vibrodagger')).toMatchObject({ affiliationCode: 'CC' })
    expect(getEquipmentCatalogItem('core.clothing.leatherBoots').metadata).toMatchObject({ bar: '1/1/0/1' })
  })

  it('preserves example-backed medical ratings as null', () => {
    for (const id of ['core.medical.kit.standard', 'core.medical.medipatch', 'core.medical.stimpatch']) {
      expect(getEquipmentCatalogItem(id)).toMatchObject({
        ratings: { tech: null, availability: null, legality: null },
        sourceStatus: 'example-backed',
        sourceKey: 'AToW-CTP-example-final-touches',
      })
    }
  })

  it('supports text, category, and source-status filtering', () => {
    expect(EQUIPMENT_CATALOG_CATEGORIES).toContain('Medical')
    expect(filterEquipmentCatalog({ search: 'magnum' }).map((entry) => entry.id)).toEqual(['core.personalWeapon.autoPistol.magnum'])
    expect(filterEquipmentCatalog({ category: 'Power' })).toHaveLength(2)
    expect(filterEquipmentCatalog({ sourceStatus: 'example-backed' })).toHaveLength(3)
  })

  it('detects duplicate IDs and malformed source-rating combinations', () => {
    const item = getEquipmentCatalogItem('core.personalWeapon.autoPistol.standard')
    expect(validateEquipmentCatalog([item, item])).toContain(`Duplicate or missing equipment catalog ID: ${item.id}`)
    expect(validateEquipmentCatalog([{ ...item, ratings: { tech: null, availability: null, legality: null } }])).toContain(`Audited Core item requires complete ratings: ${item.id}`)
  })
})
