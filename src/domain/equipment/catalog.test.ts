import { describe, expect, it } from 'vitest'
import {
  EQUIPMENT_CATALOG_CATEGORIES,
  filterEquipmentCatalog,
  getEquipmentCatalogItem,
  STARTER_EQUIPMENT_CATALOG,
  validateEquipmentCatalog,
} from './catalog'

describe('Alpha Slice 11 starter equipment catalog', () => {
  it('contains exactly the 17 audited starter entries with unique valid IDs', () => {
    expect(STARTER_EQUIPMENT_CATALOG).toHaveLength(17)
    expect(new Set(STARTER_EQUIPMENT_CATALOG.map((entry) => entry.id)).size).toBe(17)
    expect(validateEquipmentCatalog()).toEqual([])
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
