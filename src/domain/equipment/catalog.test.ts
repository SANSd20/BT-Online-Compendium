import { describe, expect, it } from 'vitest'
import {
  EQUIPMENT_CATALOG,
  EQUIPMENT_CATALOG_CATEGORIES,
  filterEquipmentCatalog,
  getEquipmentCatalogItem,
  STARTER_EQUIPMENT_CATALOG,
  SLICE_12_EQUIPMENT_CATALOG,
  SLICE_13_EQUIPMENT_CATALOG,
  SLICE_14_EQUIPMENT_CATALOG,
  SLICE_17_EQUIPMENT_CATALOG,
  SLICE_18_EQUIPMENT_CATALOG,
  parseRawEquipmentRating,
  validateEquipmentCatalog,
} from './catalog'

describe('Alpha equipment catalog', () => {
  it('contains exactly the 17 audited starter entries with unique valid IDs', () => {
    expect(STARTER_EQUIPMENT_CATALOG).toHaveLength(17)
    expect(new Set(STARTER_EQUIPMENT_CATALOG.map((entry) => entry.id)).size).toBe(17)
    expect(validateEquipmentCatalog()).toEqual([])
  })

  it('adds exactly 17 Slice 12 entries with raw and hand-audited normalized ratings', () => {
    expect(SLICE_12_EQUIPMENT_CATALOG).toHaveLength(17)
    expect(EQUIPMENT_CATALOG).toHaveLength(84)
    expect(new Set(EQUIPMENT_CATALOG.map((entry) => entry.id)).size).toBe(84)
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

  it('adds 24 Slice 13 records as 21 new items and three stable-ID upgrades', () => {
    expect(SLICE_13_EQUIPMENT_CATALOG).toHaveLength(24)
    expect(new Set(SLICE_13_EQUIPMENT_CATALOG.map((entry) => entry.id)).size).toBe(24)
    expect(EQUIPMENT_CATALOG).toHaveLength(84)
    for (const item of SLICE_13_EQUIPMENT_CATALOG) {
      expect(item.sourceStatus).toBe('audited-core')
      expect(item.sourceKey).toMatch(/^AToW-CTP-p(302|303|304|308|310|313)$/)
      expect(item.rawEquipmentRating).toBeTruthy()
      const parsed = parseRawEquipmentRating(item.rawEquipmentRating!)
      expect(parsed).not.toBeNull()
      expect(item.ratings.tech).toBe(parsed!.tech)
      expect(item.ratings.legality).toBe(parsed!.legality)
      expect(parsed!.availabilityCodes).toContain(item.ratings.availability)
    }
    expect(validateEquipmentCatalog()).toEqual([])
  })

  it('adds exactly 20 Slice 14 communications, sensors, power, and field-gear entries', () => {
    expect(SLICE_14_EQUIPMENT_CATALOG).toHaveLength(20)
    expect(new Set(SLICE_14_EQUIPMENT_CATALOG.map((entry) => entry.id)).size).toBe(20)
    expect(EQUIPMENT_CATALOG).toHaveLength(84)
    expect(new Set(EQUIPMENT_CATALOG.map((entry) => entry.id)).size).toBe(84)
    for (const item of SLICE_14_EQUIPMENT_CATALOG) {
      expect(item.sourceStatus).toBe('audited-core')
      expect(item.sourceKey).toMatch(/^AToW-CTP-p(301|305|306|312)$/)
      expect(item.rawEquipmentRating).toBeTruthy()
      const parsed = parseRawEquipmentRating(item.rawEquipmentRating!)
      expect(parsed).not.toBeNull()
      expect(item.ratings.tech).toBe(parsed!.tech)
      expect(item.ratings.legality).toBe(parsed!.legality)
      expect(parsed!.availabilityCodes).toContain(item.ratings.availability)
      expect(item.rawAvailabilityCodes).toEqual(parsed!.availabilityCodes)
    }
    expect(validateEquipmentCatalog()).toEqual([])
  })

  it('preserves Slice 14 affiliation and rule data as inert metadata', () => {
    expect(getEquipmentCatalogItem('core.power.clan.powerPack.standard')).toMatchObject({
      displayName: 'Power Pack, Clan',
      categoryPath: ['Power', 'Power Pack', 'Clan'],
      affiliationCode: 'CLAN',
      rawEquipmentRating: 'F/X-D-B/A',
      ratings: { tech: 'F', availability: 'B', legality: 'A' },
      metadata: { capacityPp: 30, quickCharge: true },
    })
    expect(getEquipmentCatalogItem('core.remoteSensor.heatSensor')).toMatchObject({ affiliationCode: null, metadata: { detectionMode: 'Heat only' } })
    expect(getEquipmentCatalogItem('core.electronics.communications.headset').metadata).toMatchObject({ powerUsePpw: 1, range: '100 m' })
    expect(getEquipmentCatalogItem('core.power.recharger.solar').metadata).toMatchObject({ powerGenerationPph: 45 })
    expect(getEquipmentCatalogItem('core.fieldGear.survival.emergencyRations').metadata).toMatchObject({ consumable: true })
    expect(getEquipmentCatalogItem('core.fieldGear.flight.parachute').metadata).toMatchObject({ encumbering: true, skillModifier: 4 })
  })

  it('adds exactly six Slice 17 Core clothing and leatherwear records', () => {
    const expected = [
      { id: 'core.clothing.workBoots', displayName: 'Work Boots', categoryPath: ['Clothing', 'Footwear', 'Work'], costCBills: 36, rawEquipmentRating: 'B/A-A-A/A', ratings: { tech: 'B', availability: 'A', legality: 'A' }, metadata: { massKg: 1.7, coverage: 'Feet', bar: '1/1/0/1' } },
      { id: 'core.clothing.leather.jacket', displayName: 'Leather Jacket', categoryPath: ['Clothing', 'Leatherwear'], costCBills: 50, rawEquipmentRating: 'A/A-A-A/A', ratings: { tech: 'A', availability: 'A', legality: 'A' }, metadata: { massKg: 2, coverage: 'Torso, Arms', bar: '1/1/0/1' } },
      { id: 'core.clothing.leather.gloves', displayName: 'Leather Gloves', categoryPath: ['Clothing', 'Leatherwear'], costCBills: 20, rawEquipmentRating: 'A/A-A-A/A', ratings: { tech: 'A', availability: 'A', legality: 'A' }, metadata: { massKg: 0.4, coverage: 'Hands', bar: '1/1/0/1', dexRelatedRollModifier: -1 } },
      { id: 'core.clothing.leather.pantsChaps', displayName: 'Leather Pants/Chaps', categoryPath: ['Clothing', 'Leatherwear'], costCBills: 35, rawEquipmentRating: 'A/A-A-A/A', ratings: { tech: 'A', availability: 'A', legality: 'A' }, metadata: { massKg: 3, coverage: 'Legs', bar: '1/1/0/1' } },
      { id: 'core.clothing.leather.shoes', displayName: 'Leather Shoes', categoryPath: ['Clothing', 'Leatherwear'], costCBills: 25, rawEquipmentRating: 'A/A-A-A/A', ratings: { tech: 'A', availability: 'A', legality: 'A' }, metadata: { massKg: 0.8, coverage: 'Feet', bar: '1/1/0/1' } },
      { id: 'core.clothing.leather.vestApron', displayName: 'Leather Vest/Apron', categoryPath: ['Clothing', 'Leatherwear'], costCBills: 25, rawEquipmentRating: 'A/A-A-A/A', ratings: { tech: 'A', availability: 'A', legality: 'A' }, metadata: { massKg: 1.2, coverage: 'Torso', bar: '1/1/0/1', apronFrontOnly: true } },
    ] as const
    expect(SLICE_17_EQUIPMENT_CATALOG).toHaveLength(6)
    expect(SLICE_17_EQUIPMENT_CATALOG.map((entry) => entry.id)).toEqual(expected.map((entry) => entry.id))
    for (const expectedItem of expected) {
      const item = getEquipmentCatalogItem(expectedItem.id)
      expect(item).toMatchObject({
        ...expectedItem,
        sourceKey: 'AToW-CTP-p299',
        sourceStatus: 'audited-core',
        rawRatingStatus: 'preserved',
        affiliationCode: null,
      })
      expect(item.rawEquipmentRating).toBeTruthy()
      const parsed = parseRawEquipmentRating(item.rawEquipmentRating!)
      expect(parsed).not.toBeNull()
      expect(item.rawAvailabilityCodes).toEqual(parsed!.availabilityCodes)
      expect(item.ratings.tech).toBe(parsed!.tech)
      expect(item.ratings.legality).toBe(parsed!.legality)
      expect(parsed!.availabilityCodes).toContain(item.ratings.availability)
      expect(item).not.toHaveProperty('bar')
      expect(item).not.toHaveProperty('coverage')
      expect(item).not.toHaveProperty('dexRelatedRollModifier')
    }
    expect(validateEquipmentCatalog()).toEqual([])
  })

  it('canonicalizes the existing Clan Power Pack ID and adds three Slice 18 Clan packs', () => {
    const expected = [
      { id: 'core.power.clan.powerPack.standard', displayName: 'Power Pack, Clan', categoryPath: ['Power', 'Power Pack', 'Clan'], costCBills: 25, rawEquipmentRating: 'F/X-D-B/A', rawAvailabilityCodes: ['X', 'D', 'B'], ratings: { tech: 'F', availability: 'B', legality: 'A' }, metadata: { massKg: 0.275, capacityPp: 30, quickCharge: true } },
      { id: 'core.power.clan.microPowerPack.standard', displayName: 'Micro Power Pack, Clan', categoryPath: ['Power', 'Micro Power Pack', 'Clan'], costCBills: 50, rawEquipmentRating: 'F/X-E-C/A', rawAvailabilityCodes: ['X', 'E', 'C'], ratings: { tech: 'F', availability: 'E', legality: 'A' }, metadata: { massKg: 0.015, capacityPp: 20, quickCharge: true } },
      { id: 'core.power.clan.militaryPowerPack.standard', displayName: 'Military Power Pack, Clan', categoryPath: ['Power', 'Military Power Pack', 'Clan'], costCBills: 200, rawEquipmentRating: 'F/X-E-C/B', rawAvailabilityCodes: ['X', 'E', 'C'], ratings: { tech: 'F', availability: 'E', legality: 'B' }, metadata: { massKg: 5, capacityPp: 300, quickCharge: true } },
      { id: 'core.power.clan.satchelBattery.standard', displayName: 'Satchel Battery, Clan', categoryPath: ['Power', 'Satchel Battery', 'Clan'], costCBills: 100, rawEquipmentRating: 'F/X-E-C/A', rawAvailabilityCodes: ['X', 'E', 'C'], ratings: { tech: 'F', availability: 'E', legality: 'A' }, metadata: { massKg: 2.5, capacityPp: 150, quickCharge: true } },
    ] as const

    expect(SLICE_18_EQUIPMENT_CATALOG).toHaveLength(3)
    expect(SLICE_18_EQUIPMENT_CATALOG.map((entry) => entry.id)).toEqual(expected.slice(1).map((entry) => entry.id))
    expect(EQUIPMENT_CATALOG.filter((entry) => entry.sourceKey === 'AToW-CTP-p306' && entry.affiliationCode === 'CLAN')).toHaveLength(4)
    expect(EQUIPMENT_CATALOG.filter((entry) => entry.id === 'core.power.clan.powerPack.standard')).toHaveLength(1)
    expect(EQUIPMENT_CATALOG.some((entry) => entry.id === 'core.power.powerPack.clan')).toBe(false)
    expect(() => getEquipmentCatalogItem('core.power.powerPack.clan')).toThrow('Unknown equipment catalog item')

    for (const expectedItem of expected) {
      const item = getEquipmentCatalogItem(expectedItem.id)
      expect(item).toMatchObject({
        ...expectedItem,
        sourceKey: 'AToW-CTP-p306',
        sourceStatus: 'audited-core',
        rawRatingStatus: 'preserved',
        affiliationCode: 'CLAN',
      })
      const parsed = parseRawEquipmentRating(item.rawEquipmentRating!)
      expect(parsed).not.toBeNull()
      expect(item.rawAvailabilityCodes).toEqual(parsed!.availabilityCodes)
      expect(item.ratings.tech).toBe(parsed!.tech)
      expect(item.ratings.legality).toBe(parsed!.legality)
      expect(parsed!.availabilityCodes).toContain(item.ratings.availability)
      expect(item).not.toHaveProperty('capacityPp')
      expect(item).not.toHaveProperty('quickCharge')
    }
    expect(validateEquipmentCatalog()).toEqual([])
  })

  it('keeps the existing page-299 clothing records unchanged', () => {
    expect(getEquipmentCatalogItem('core.clothing.fatigues')).toMatchObject({
      displayName: 'Fatigues', costCBills: 30, categoryPath: ['Clothing', 'Military-Work Attire'],
      rawEquipmentRating: 'B/A-A-A/A', rawAvailabilityCodes: ['A', 'A', 'A'],
      ratings: { tech: 'B', availability: 'A', legality: 'A' }, sourceKey: 'AToW-CTP-p299',
    })
    expect(getEquipmentCatalogItem('core.clothing.jumpSuit')).toMatchObject({
      displayName: 'Jump Suit', costCBills: 24, categoryPath: ['Clothing', 'Military-Work Attire'],
      rawEquipmentRating: 'B/A-A-A/A', rawAvailabilityCodes: ['A', 'A', 'A'],
      ratings: { tech: 'B', availability: 'A', legality: 'A' }, sourceKey: 'AToW-CTP-p299',
    })
    expect(getEquipmentCatalogItem('core.clothing.leatherBoots')).toMatchObject({
      displayName: 'Leather Boots', costCBills: 25, categoryPath: ['Clothing', 'Leatherwear'],
      rawEquipmentRating: 'A/A-A-A/A', rawAvailabilityCodes: ['A', 'A', 'A'],
      ratings: { tech: 'A', availability: 'A', legality: 'A' }, sourceKey: 'AToW-CTP-p299',
    })
  })

  it('preserves hand-audited availability without imposing a triplet position', () => {
    expect(getEquipmentCatalogItem('core.personalWeapon.laserPistol.pulse')).toMatchObject({ rawEquipmentRating: 'D/B-F-C/D', rawAvailabilityCodes: ['B', 'F', 'C'], ratings: { availability: 'C' } })
    expect(getEquipmentCatalogItem('core.armor.neoChain.vest')).toMatchObject({ rawEquipmentRating: 'D/X-X-C/D', rawAvailabilityCodes: ['X', 'X', 'C'], ratings: { availability: 'C' } })
    expect(getEquipmentCatalogItem('core.armor.ablative.vest')).toMatchObject({ rawEquipmentRating: 'D/A-B-A/C', rawAvailabilityCodes: ['A', 'B', 'A'], ratings: { availability: 'B' } })
    const rulesExample = {
      ...getEquipmentCatalogItem('core.personalWeapon.laserPistol.pulse'),
      id: 'core.test.rulesExample',
      rawEquipmentRating: 'C/X-F-D/D',
      rawAvailabilityCodes: ['X', 'F', 'D'] as [string, string, string],
      ratings: { tech: 'C' as const, availability: 'D' as const, legality: 'D' as const },
    }
    expect(validateEquipmentCatalog([rulesExample])).toEqual([])
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

  it('preserves the historical example-backed records while promoting their current stable IDs', () => {
    for (const id of ['core.medical.kit.standard', 'core.medical.medipatch', 'core.medical.stimpatch']) {
      expect(STARTER_EQUIPMENT_CATALOG.find((entry) => entry.id === id)).toMatchObject({
        ratings: { tech: null, availability: null, legality: null },
        sourceStatus: 'example-backed',
        sourceKey: 'AToW-CTP-example-final-touches',
      })
      expect(getEquipmentCatalogItem(id)).toMatchObject({
        sourceStatus: 'audited-core',
        sourceKey: 'AToW-CTP-p313',
      })
    }
  })

  it('preserves Batch 3 affiliation codes and inert rule metadata', () => {
    expect(getEquipmentCatalogItem('core.electronics.optics.micheauxElectronicBinoculars')).toMatchObject({ affiliationCode: 'LA' })
    expect(getEquipmentCatalogItem('core.electronics.optics.circleVisionVisor')).toMatchObject({ affiliationCode: 'DC' })
    expect(getEquipmentCatalogItem('core.electronics.optics.ultrasonicDetector')).toMatchObject({ affiliationCode: 'CS' })
    expect(getEquipmentCatalogItem('core.medical.stimpatch.clan')).toMatchObject({ affiliationCode: 'CLAN' })
    expect(getEquipmentCatalogItem('core.medical.stimpatch.clan').metadata).toMatchObject({ drugStrength: 4, truebornAddictionDrugStrengthModifier: -2 })
    expect(getEquipmentCatalogItem('core.medical.lifeSupportUnit.standard').metadata).toMatchObject({ healingTimeReductionPercent: 20 })
  })

  it('supports text, category, and source-status filtering', () => {
    expect(EQUIPMENT_CATALOG_CATEGORIES).toContain('Medical')
    expect(filterEquipmentCatalog({ search: 'magnum' }).map((entry) => entry.id)).toEqual(['core.personalWeapon.autoPistol.magnum'])
    expect(filterEquipmentCatalog({ category: 'Power' })).toHaveLength(11)
    expect(filterEquipmentCatalog({ search: 'ultrasonic' }).map((entry) => entry.id)).toEqual(['core.electronics.optics.ultrasonicDetector'])
    expect(filterEquipmentCatalog({ sourceStatus: 'example-backed' })).toHaveLength(0)
  })

  it('detects duplicate IDs and malformed source-rating combinations', () => {
    const item = getEquipmentCatalogItem('core.personalWeapon.autoPistol.standard')
    expect(validateEquipmentCatalog([item, item])).toContain(`Duplicate or missing equipment catalog ID: ${item.id}`)
    expect(validateEquipmentCatalog([{ ...item, ratings: { tech: null, availability: null, legality: null } }])).toContain(`Audited Core item requires complete ratings: ${item.id}`)
  })

  it('hardens all 84 current entries with the authorized Clan Power Pack ID canonicalization', () => {
    expect(EQUIPMENT_CATALOG).toHaveLength(84)
    expect(new Set(EQUIPMENT_CATALOG.map((entry) => entry.id)).size).toBe(84)
    expect(validateEquipmentCatalog()).toEqual([])
    for (const item of EQUIPMENT_CATALOG) {
      expect(item.id).toMatch(/^core\.[a-z][A-Za-z0-9]*(?:\.[a-z][A-Za-z0-9]*)+$/)
      expect(item.categoryPath.length).toBeGreaterThan(0)
      expect(item.sourceKey).toBeTruthy()
      expect(item.sourceStatus).toBe('audited-core')
      expect(item.source.ruleId).toBe(item.sourceKey)
      expect(item.metadata).toBeTypeOf('object')
      expect(Array.isArray(item.notes)).toBe(true)
      expect(item.rawRatingStatus).toBe('preserved')
    }
  })

  it('backfills the 14 legacy Slice 11 raw ratings without changing stable IDs or normalized ratings', () => {
    const expected = {
      'core.personalWeapon.autoPistol.standard': ['C/A-A-A/C', ['A', 'A', 'A'], ['C', 'A', 'C'], 'AToW-CTP-p265'],
      'core.personalWeapon.autoPistol.magnum': ['C/A-A-B/D', ['A', 'A', 'B'], ['C', 'B', 'D'], 'AToW-CTP-p265'],
      'core.meleeWeapon.vibroblade.vibrodagger': ['D/B-C-B/C', ['B', 'C', 'B'], ['D', 'C', 'C'], 'AToW-CTP-p265'],
      'core.clothing.fatigues': ['B/A-A-A/A', ['A', 'A', 'A'], ['B', 'A', 'A'], 'AToW-CTP-p299'],
      'core.clothing.jumpSuit': ['B/A-A-A/A', ['A', 'A', 'A'], ['B', 'A', 'A'], 'AToW-CTP-p299'],
      'core.clothing.leatherBoots': ['A/A-A-A/A', ['A', 'A', 'A'], ['A', 'A', 'A'], 'AToW-CTP-p299'],
      'core.electronics.communicator.civilian': ['C/A-A-A/A', ['A', 'A', 'A'], ['C', 'A', 'A'], 'AToW-CTP-p301'],
      'core.electronics.communicator.military': ['D/A-A-A/B', ['A', 'A', 'A'], ['D', 'A', 'B'], 'AToW-CTP-p301'],
      'core.electronics.optics.rangefinderBinoculars': ['D/A-C-B/A', ['A', 'C', 'B'], ['D', 'C', 'A'], 'AToW-CTP-p304'],
      'core.power.powerPack.standard': ['C/A-B-A/A', ['A', 'B', 'A'], ['C', 'B', 'A'], 'AToW-CTP-p306'],
      'core.power.powerPack.highCapacity': ['D/A-C-B/A', ['A', 'C', 'B'], ['D', 'C', 'A'], 'AToW-CTP-p306'],
      'core.fieldGear.survival.basicFieldKit': ['B/A-A-A/A', ['A', 'A', 'A'], ['B', 'A', 'A'], 'AToW-CTP-p311'],
      'core.fieldGear.survival.advancedFieldKit': ['C/A-A-A/A', ['A', 'A', 'A'], ['C', 'A', 'A'], 'AToW-CTP-p311'],
      'core.fieldGear.navigation.electronicCompass': ['C/A-A-A/A', ['A', 'A', 'A'], ['C', 'A', 'A'], 'AToW-CTP-p311'],
    } as const

    expect(Object.keys(expected)).toHaveLength(14)
    for (const [id, [rawEquipmentRating, rawAvailabilityCodes, normalized, sourceKey]] of Object.entries(expected)) {
      expect(getEquipmentCatalogItem(id)).toMatchObject({
        id,
        rawRatingStatus: 'preserved',
        rawEquipmentRating,
        rawAvailabilityCodes,
        ratings: { tech: normalized[0], availability: normalized[1], legality: normalized[2] },
        sourceKey,
        sourceStatus: 'audited-core',
      })
    }
    expect(EQUIPMENT_CATALOG.filter((item) => item.rawRatingStatus === 'not-supplied-in-audit')).toHaveLength(0)
    expect(EQUIPMENT_CATALOG.filter((item) => item.rawRatingStatus === 'preserved')).toHaveLength(84)
  })

  it('rejects unsafe IDs, categories, affiliation codes, source data, and raw-rating omissions', () => {
    const item = getEquipmentCatalogItem('core.personalWeapon.laserPistol.pulse')
    expect(validateEquipmentCatalog([{ ...item, id: 'Core.Bad ID' }])).toContain('Unsafe equipment catalog ID: Core.Bad ID')
    expect(validateEquipmentCatalog([{ ...item, categoryPath: [' Weapon'] }])).toContain(`Unsafe or missing equipment category: ${item.id}`)
    expect(validateEquipmentCatalog([{ ...item, affiliationCode: 'bad code' }])).toContain(`Unsafe equipment affiliation code: ${item.id}`)
    expect(validateEquipmentCatalog([{ ...item, sourceKey: '' }])).toContain(`Missing or inconsistent equipment source reference: ${item.id}`)
    expect(validateEquipmentCatalog([{ ...item, sourceStatus: 'unknown' as never }])).toContain(`Unknown equipment source status: ${item.id}`)
    expect(validateEquipmentCatalog([{ ...item, rawAvailabilityCodes: undefined }])).toContain(`Missing raw Availability triplet: ${item.id}`)
    expect(validateEquipmentCatalog([{ ...item, rawEquipmentRating: undefined }])).toContain(`Preserved raw equipment rating is missing: ${item.id}`)
    expect(validateEquipmentCatalog([{ ...item, rawRatingStatus: 'not-supplied-in-audit', rawEquipmentRating: undefined, rawAvailabilityCodes: undefined }])).toContain(`Current catalog raw equipment rating is not preserved: ${item.id}`)
  })

  it('preserves unknown but safe affiliation codes without requiring a faction registry', () => {
    const item = getEquipmentCatalogItem('core.personalWeapon.laserPistol.pulse')
    expect(validateEquipmentCatalog([{ ...item, affiliationCode: 'FUTURE-CODE' }])).toEqual([])
  })
})
