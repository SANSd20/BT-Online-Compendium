import type {
  EquipmentCatalogSourceStatus,
  EquipmentRatingCode,
} from '../character/model'
import type { SourceCitation } from '../rules/model'

export interface EquipmentCatalogItem {
  id: string
  displayName: string
  categoryPath: string[]
  costCBills: number
  ratings: {
    tech: EquipmentRatingCode | null
    availability: EquipmentRatingCode | null
    legality: EquipmentRatingCode | null
  }
  affiliationCode: string | null
  sourceKey: string
  source: SourceCitation
  sourceStatus: EquipmentCatalogSourceStatus
  metadata: Record<string, string | number | boolean>
  notes: string[]
}

const CORE_SOURCE = 'atow-core-corrected-third'

function source(sourceKey: string, page?: number): SourceCitation {
  return {
    sourceId: CORE_SOURCE,
    edition: 'Corrected Third Printing',
    ...(page ? { page } : {}),
    ruleId: sourceKey,
  }
}

export const STARTER_EQUIPMENT_CATALOG: readonly EquipmentCatalogItem[] = [
  {
    id: 'core.personalWeapon.autoPistol.standard', displayName: 'Auto-Pistol', categoryPath: ['Weapon', 'Small Arms', 'Pistol'], costCBills: 50,
    ratings: { tech: 'C', availability: 'A', legality: 'C' }, affiliationCode: null, sourceKey: 'AToW-CTP-p265', source: source('AToW-CTP-p265', 265), sourceStatus: 'audited-core',
    metadata: { apBd: '3B/4', range: '5/20/45/105', shots: 10, reloadCostCBills: 2, massKg: 0.5, reloadMassKg: 0.14, jamOnFumble: true },
    notes: ['Reload and jam data are metadata only; Slice 11 does not track ammunition or weapon runtime state.'],
  },
  {
    id: 'core.personalWeapon.autoPistol.magnum', displayName: 'Auto-Pistol, Magnum', categoryPath: ['Weapon', 'Small Arms', 'Pistol'], costCBills: 75,
    ratings: { tech: 'C', availability: 'B', legality: 'D' }, affiliationCode: null, sourceKey: 'AToW-CTP-p265', source: source('AToW-CTP-p265', 265), sourceStatus: 'audited-core',
    metadata: { apBd: '3B/5', range: '5/20/50/120', shots: 10, reloadCostCBills: 4, massKg: 0.5, reloadMassKg: 0.14, attackModifier: -1, jamOnFumble: true },
    notes: ['Reload, attack, and jam data are metadata only; Slice 11 does not automate combat or ammunition.'],
  },
  {
    id: 'core.meleeWeapon.vibroblade.vibrodagger', displayName: 'Vibroblade / Vibrodagger', categoryPath: ['Weapon', 'Melee'], costCBills: 100,
    ratings: { tech: 'D', availability: 'C', legality: 'C' }, affiliationCode: 'CC', sourceKey: 'AToW-CTP-p265', source: source('AToW-CTP-p265', 265), sourceStatus: 'audited-core',
    metadata: { apBd: '6M/2', range: '1M', powerUsePps: 1, massKg: 0.35, usesPowerPacks: true },
    notes: ['Power-pack consumption is metadata only.'],
  },
  {
    id: 'core.clothing.fatigues', displayName: 'Fatigues', categoryPath: ['Clothing', 'Military-Work Attire'], costCBills: 30,
    ratings: { tech: 'B', availability: 'A', legality: 'A' }, affiliationCode: null, sourceKey: 'AToW-CTP-p299', source: source('AToW-CTP-p299', 299), sourceStatus: 'audited-core',
    metadata: { massKg: 0.5, coverage: 'Torso, arms, legs' }, notes: [],
  },
  {
    id: 'core.clothing.jumpSuit', displayName: 'Jump Suit', categoryPath: ['Clothing', 'Military-Work Attire'], costCBills: 24,
    ratings: { tech: 'B', availability: 'A', legality: 'A' }, affiliationCode: null, sourceKey: 'AToW-CTP-p299', source: source('AToW-CTP-p299', 299), sourceStatus: 'audited-core',
    metadata: { massKg: 0.5, coverage: 'Torso, arms, legs' }, notes: [],
  },
  {
    id: 'core.clothing.leatherBoots', displayName: 'Leather Boots', categoryPath: ['Clothing', 'Leatherwear'], costCBills: 25,
    ratings: { tech: 'A', availability: 'A', legality: 'A' }, affiliationCode: null, sourceKey: 'AToW-CTP-p299', source: source('AToW-CTP-p299', 299), sourceStatus: 'audited-core',
    metadata: { bar: '1/1/0/1', massKg: 0.8, coverage: 'Feet' }, notes: ['BAR is metadata only; armor effects are not implemented.'],
  },
  {
    id: 'core.electronics.communicator.civilian', displayName: 'Civilian Communicator', categoryPath: ['Electronics', 'Communications'], costCBills: 45,
    ratings: { tech: 'C', availability: 'A', legality: 'A' }, affiliationCode: null, sourceKey: 'AToW-CTP-p301', source: source('AToW-CTP-p301', 301), sourceStatus: 'audited-core',
    metadata: { massKg: 0.1, range: '10 km LOS', powerUsePph: 0.2 }, notes: ['Range and power use are metadata only.'],
  },
  {
    id: 'core.electronics.communicator.military', displayName: 'Military Communicator', categoryPath: ['Electronics', 'Communications'], costCBills: 50,
    ratings: { tech: 'D', availability: 'A', legality: 'B' }, affiliationCode: null, sourceKey: 'AToW-CTP-p301', source: source('AToW-CTP-p301', 301), sourceStatus: 'audited-core',
    metadata: { massKg: 0.1, range: '10 km', powerUsePph: 1 }, notes: ['Range and power use are metadata only.'],
  },
  {
    id: 'core.electronics.optics.rangefinderBinoculars', displayName: 'Rangefinder Binoculars', categoryPath: ['Electronics', 'Optics'], costCBills: 200,
    ratings: { tech: 'D', availability: 'C', legality: 'A' }, affiliationCode: null, sourceKey: 'AToW-CTP-p304', source: source('AToW-CTP-p304', 304), sourceStatus: 'audited-core',
    metadata: { massKg: 0.5, powerUsePph: 0.1, magnification: '400x', perceptionModifier: 4, nightVision: true }, notes: ['Perception, night-vision, and power effects are metadata only.'],
  },
  {
    id: 'core.power.powerPack.standard', displayName: 'Power Pack', categoryPath: ['Power'], costCBills: 5,
    ratings: { tech: 'C', availability: 'B', legality: 'A' }, affiliationCode: null, sourceKey: 'AToW-CTP-p305', source: source('AToW-CTP-p305', 305), sourceStatus: 'audited-core',
    metadata: { massKg: 0.25, capacityPp: 20, rechargeable: true }, notes: ['Power depletion and recharge are not implemented.'],
  },
  {
    id: 'core.power.powerPack.highCapacity', displayName: 'Power Pack, High-Capacity', categoryPath: ['Power'], costCBills: 15,
    ratings: { tech: 'D', availability: 'C', legality: 'A' }, affiliationCode: null, sourceKey: 'AToW-CTP-p305', source: source('AToW-CTP-p305', 305), sourceStatus: 'audited-core',
    metadata: { massKg: 0.3, capacityPp: 30, rechargeable: true }, notes: ['Power depletion and recharge are not implemented.'],
  },
  {
    id: 'core.fieldGear.survival.basicFieldKit', displayName: 'Basic Field Kit', categoryPath: ['Field Gear', 'Survival'], costCBills: 10,
    ratings: { tech: 'B', availability: 'A', legality: 'A' }, affiliationCode: null, sourceKey: 'AToW-CTP-p311', source: source('AToW-CTP-p311', 311), sourceStatus: 'audited-core',
    metadata: { massKg: 5, survivalModifier: 1, kitContents: 'Knife, sleeping bag, lantern, canteen, basic medical kit' }, notes: ['This kit remains one inventory item; contents are not exploded.'],
  },
  {
    id: 'core.fieldGear.survival.advancedFieldKit', displayName: 'Advanced Field Kit', categoryPath: ['Field Gear', 'Survival'], costCBills: 100,
    ratings: { tech: 'C', availability: 'A', legality: 'A' }, affiliationCode: null, sourceKey: 'AToW-CTP-p311', source: source('AToW-CTP-p311', 311), sourceStatus: 'audited-core',
    metadata: { massKg: 15, powerUsePph: 1, survivalModifier: 2, kitContents: 'Knife, multi-tool, inflatable mattress, thermal blankets, heating plate, lantern, 2 emergency flares, 5 campfire-igniters, canteen, basic medical kit' }, notes: ['This kit remains one inventory item; contents are not exploded.'],
  },
  {
    id: 'core.fieldGear.navigation.electronicCompass', displayName: 'Electronic Compass', categoryPath: ['Field Gear', 'Navigation'], costCBills: 30,
    ratings: { tech: 'C', availability: 'A', legality: 'A' }, affiliationCode: null, sourceKey: 'AToW-CTP-p311', source: source('AToW-CTP-p311', 311), sourceStatus: 'audited-core',
    metadata: { massKg: 0.1, powerUsePph: 0.1, navigationGroundModifier: 2, satNavCapable: true }, notes: ['Navigation and SatNav effects are metadata only.'],
  },
  {
    id: 'core.medical.kit.standard', displayName: 'Medical Kit', categoryPath: ['Medical'], costCBills: 10,
    ratings: { tech: null, availability: null, legality: null }, affiliationCode: null, sourceKey: 'AToW-CTP-example-final-touches', source: source('AToW-CTP-example-final-touches'), sourceStatus: 'example-backed',
    metadata: { massKg: 0.25, exampleQuantity: 1, exampleTotalCostCBills: 10, exampleBacked: true }, notes: ['Final Touches example-backed item; medical-equipment text describes medical kits as common first-aid gear. Exact equipment-table ratings were not included in the audit.'],
  },
  {
    id: 'core.medical.medipatch', displayName: 'Medipatch', categoryPath: ['Medical'], costCBills: 10,
    ratings: { tech: null, availability: null, legality: null }, affiliationCode: null, sourceKey: 'AToW-CTP-example-final-touches', source: source('AToW-CTP-example-final-touches'), sourceStatus: 'example-backed',
    metadata: { massKg: 0, exampleQuantity: 2, exampleTotalCostCBills: 20, exampleBacked: true }, notes: ['Text describes medipatches as helping staunch blood loss and render injured soldiers safe for transport. Healing automation is not implemented.'],
  },
  {
    id: 'core.medical.stimpatch', displayName: 'Stimpatch', categoryPath: ['Medical'], costCBills: 2,
    ratings: { tech: null, availability: null, legality: null }, affiliationCode: null, sourceKey: 'AToW-CTP-example-final-touches', source: source('AToW-CTP-example-final-touches'), sourceStatus: 'example-backed',
    metadata: { exampleQuantities: '8 or 10', exampleTotalsCBills: '16 or 20', exampleBacked: true }, notes: ['Text describes stimpatches as able to rouse an unconscious person or chemically reduce fatigue. Fatigue, consciousness, and play-state automation are not implemented.'],
  },
] as const

export const EQUIPMENT_CATALOG_CATEGORIES = [...new Set(STARTER_EQUIPMENT_CATALOG.map((entry) => entry.categoryPath[0]))].sort()

export function getEquipmentCatalogItem(itemId: string): EquipmentCatalogItem {
  const item = STARTER_EQUIPMENT_CATALOG.find((entry) => entry.id === itemId)
  if (!item) throw new Error(`Unknown equipment catalog item: ${itemId}`)
  return item
}

export function filterEquipmentCatalog(options: { search?: string; category?: string; sourceStatus?: EquipmentCatalogSourceStatus | 'all' } = {}): EquipmentCatalogItem[] {
  const search = options.search?.trim().toLowerCase() ?? ''
  return STARTER_EQUIPMENT_CATALOG.filter((entry) => {
    if (options.category && options.category !== 'all' && entry.categoryPath[0] !== options.category) return false
    if (options.sourceStatus && options.sourceStatus !== 'all' && entry.sourceStatus !== options.sourceStatus) return false
    if (!search) return true
    const haystack = [entry.displayName, entry.id, entry.categoryPath.join(' '), entry.affiliationCode ?? '', entry.sourceKey, ...entry.notes].join(' ').toLowerCase()
    return haystack.includes(search)
  })
}

export function validateEquipmentCatalog(catalog: readonly EquipmentCatalogItem[] = STARTER_EQUIPMENT_CATALOG): string[] {
  const issues: string[] = []
  const ids = new Set<string>()
  for (const item of catalog) {
    if (!item.id || ids.has(item.id)) issues.push(`Duplicate or missing equipment catalog ID: ${item.id || '(missing)'}`)
    ids.add(item.id)
    if (!item.displayName || item.categoryPath.length === 0 || !Number.isInteger(item.costCBills) || item.costCBills < 0 || !item.sourceKey || !item.source.sourceId) issues.push(`Malformed equipment catalog item: ${item.id}`)
    const ratingValues = Object.values(item.ratings)
    if (item.sourceStatus === 'audited-core' && ratingValues.some((value) => value === null)) issues.push(`Audited Core item requires complete ratings: ${item.id}`)
    if (item.sourceStatus === 'example-backed' && ratingValues.some((value) => value !== null)) issues.push(`Example-backed item must preserve unaudited ratings as null: ${item.id}`)
  }
  return issues
}
