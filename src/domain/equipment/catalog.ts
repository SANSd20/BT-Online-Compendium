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
  rawRatingStatus?: 'preserved' | 'not-supplied-in-audit'
  rawEquipmentRating?: string
  rawAvailabilityCodes?: [string, string, string]
  metadata: Record<string, string | number | boolean>
  notes: string[]
}

const CORE_SOURCE = 'atow-core-corrected-third'
const SOURCE_STATUSES: readonly EquipmentCatalogSourceStatus[] = ['audited-core', 'example-backed']
const CATALOG_ID_PATTERN = /^core\.[a-z][A-Za-z0-9]*(?:\.[a-z][A-Za-z0-9]*)+$/
const CATEGORY_SEGMENT_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 /&'()+-]*$/
const AFFILIATION_CODE_PATTERN = /^[A-Z][A-Z0-9-]*$/
const DOMAIN_CATEGORY: Readonly<Record<string, string>> = {
  personalWeapon: 'Weapon',
  meleeWeapon: 'Weapon',
  clothing: 'Clothing',
  electronics: 'Electronics',
  power: 'Power',
  fieldGear: 'Field Gear',
  medical: 'Medical',
  weaponAccessory: 'Weapon Accessory',
  armor: 'Armor',
  security: 'Security',
  espionage: 'Espionage',
  repair: 'Repair',
  remoteSensor: 'Electronics',
}
const ALLOWED_STABLE_ID_REPLACEMENTS = new Set([
  'core.medical.kit.standard',
  'core.medical.medipatch',
  'core.medical.stimpatch',
])

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

export const SLICE_12_EQUIPMENT_CATALOG: readonly EquipmentCatalogItem[] = [
  equipment('core.personalWeapon.laserPistol.standard', 'Laser Pistol', ['Weapon', 'Small Arms', 'Pistol', 'Energy'], 750, 'D/B-A-A/D', { tech: 'D', availability: 'A', legality: 'D' }, 267,
    { apBd: '4E/3', range: '15/35/80/225', powerUsePps: 2, massKg: 1, reload: 'Per power pack' }, ['Power consumption is not implemented.']),
  equipment('core.personalWeapon.laserPistol.pulse', 'Pulse Laser Pistol', ['Weapon', 'Small Arms', 'Pistol', 'Energy'], 1000, 'D/B-F-C/D', { tech: 'D', availability: 'C', legality: 'D' }, 267,
    { apBd: '3E/2B', range: '12/30/70/195', powerUsePps: 2, massKg: 1, burst: 5, recoil: 0 }, ['Power consumption is not implemented.']),
  equipment('core.personalWeapon.laserRifle.standard', 'Laser Rifle', ['Weapon', 'Small Arms', 'Rifle', 'Energy'], 1250, 'D/C-B-B/D', { tech: 'D', availability: 'B', legality: 'D' }, 267,
    { apBd: '4E/4', range: '60/205/465/1100', powerUsePps: 5, massKg: 5, reload: 'Per power pack' }, ['Power consumption is not implemented.']),
  equipment('core.personalWeapon.needlerPistol.standard', 'Needler Pistol', ['Weapon', 'Small Arms', 'Pistol', 'Flechette'], 50, 'D/A-A-A/D', { tech: 'D', availability: 'A', legality: 'D' }, 268,
    { apBd: '2B/5S', range: '2/6/12/20', shots: 10, reloadCostCBills: 1, massKg: 0.3, reloadMassKg: 0.07, needler: true }, ['Ammunition tracking is not implemented.']),
  equipment('core.personalWeapon.shotgun.combat', 'Combat Shotgun', ['Weapon', 'Small Arms', 'Rifle', 'Flechette'], 175, 'C/B-B-B/D', { tech: 'C', availability: 'B', legality: 'D' }, 268,
    { apBd: '3B/5S', range: '5/12/24/50', shots: 8, reloadCostCBills: 2, massKg: 4.5, reloadMassKg: 0.14 }, ['Ammunition tracking is not implemented.']),
  equipment('core.personalWeapon.shotgun.pump', 'Pump Shotgun', ['Weapon', 'Small Arms', 'Rifle', 'Flechette'], 40, 'B/A-A-A/B', { tech: 'B', availability: 'A', legality: 'B' }, 268,
    { apBd: '1B/6S', range: '4/10/20/45', shots: 6, reloadCostCBills: 1, massKg: 4, reloadMassKg: 0.12, recoil: -1 }, ['Ammunition tracking is not implemented.']),
  equipment('core.personalWeapon.flamerPistol.standard', 'Flamer Pistol', ['Weapon', 'Small Arms', 'Pistol', 'Miscellaneous'], 50, 'C/B-B-B/E', { tech: 'C', availability: 'B', legality: 'E' }, 269,
    { apBd: '3B/3CS', range: '5/15/25/40', shots: 10, reloadCostCBills: 1, massKg: 1.2, reloadMassKg: 0.8, incendiary: true }, ['Continuous, splash, fire, and ammunition runtime are not implemented.']),
  equipment('core.personalWeapon.dartGun.standard', 'Dart Gun', ['Weapon', 'Small Arms', 'Pistol', 'Miscellaneous'], 40, 'C/A-A-A/C', { tech: 'C', availability: 'A', legality: 'C' }, 269,
    { apBd: '1B/3D', range: '1/4/6/10', shots: 1, reloadCostCBills: 1, massKg: 0.65, reloadMassKg: 0.01 }, ['Drug and poison payload runtime is not implemented.']),
  equipment('core.weaponAccessory.sight.laserSight', 'Laser Sight', ['Weapon Accessory', 'Sight'], 25, 'C/A-A-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 286,
    { massKg: 0.1, attackModifier: 1, requiresMicroPowerPack: true, powerUsePph: 0.1 }, ['Attack and power effects are metadata only.']),
  equipment('core.weaponAccessory.scope.telescopic', 'Telescopic Scope', ['Weapon Accessory', 'Scope'], 30, 'C/A-A-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 286,
    { massKg: 0.2, attackModifier: 2, modifierRanges: 'Medium, long, extreme' }, ['Attack effects are metadata only.']),
  equipment('core.weaponAccessory.holster.standard', 'Holster', ['Weapon Accessory', 'General'], 20, 'B/A-A-A/A', { tech: 'B', availability: 'A', legality: 'A' }, 286,
    { massKg: 0.15, compatibleWeapons: 'Pistols and rifles only' }, ['Attachment compatibility is not implemented.']),
  equipment('core.weaponAccessory.suppressor.sound', 'Sound Suppressor', ['Weapon Accessory', 'Suppressor'], 50, 'C/B-B-B/D', { tech: 'C', availability: 'B', legality: 'D' }, 286,
    { massKg: 0.25, perceptionCheckModifier: -2, incompatibleWeapons: 'Gauss, gyrojet, plasma' }, ['Perception and attachment effects are metadata only.']),
  equipment('core.armor.flak.vest', 'Flak Vest', ['Armor', 'Personal', 'Flak'], 50, 'C/A-A-A/B', { tech: 'C', availability: 'A', legality: 'B' }, 288,
    { patchCostCBills: 10, bar: '1/5/1/3', massKg: 2.8, coverage: 'Torso' }, ['BAR, patch cost, and coverage are metadata only; armor protection and degradation are not implemented.']),
  equipment('core.armor.flak.jacket', 'Flak Jacket', ['Armor', 'Personal', 'Flak'], 100, 'C/A-A-A/B', { tech: 'C', availability: 'A', legality: 'B' }, 288,
    { patchCostCBills: 10, bar: '1/5/1/3', massKg: 3.5, coverage: 'Torso, arms' }, ['BAR, patch cost, and coverage are metadata only.']),
  equipment('core.armor.ablative.vest', 'Ablative Vest', ['Armor', 'Personal', 'Ablative'], 400, 'D/A-B-A/C', { tech: 'D', availability: 'B', legality: 'C' }, 288,
    { patchCostCBills: 20, bar: '3/1/6/1', massKg: 2.1, coverage: 'Torso' }, ['BAR, patch cost, and coverage are metadata only.']),
  equipment('core.armor.ballisticPlate.vest', 'Ballistic Plate Vest', ['Armor', 'Personal', 'Ballistic Plate'], 600, 'D/C-C-C/D', { tech: 'D', availability: 'C', legality: 'D' }, 288,
    { patchCostCBills: 50, bar: '4/6/5/4', massKg: 8.8, coverage: 'Torso', patchRestriction: 'Cannot be patched if any BAR is below half' }, ['BAR, patch cost, and the patch restriction are metadata only.']),
  equipment('core.armor.neoChain.vest', 'Neo-Chain Vest', ['Armor', 'Personal', 'Neo-Chain'], 375, 'D/X-X-C/D', { tech: 'D', availability: 'C', legality: 'D' }, 288,
    { patchCostCBills: 17, bar: '3/3/2/2', massKg: 1.7, coverage: 'Torso', concealable: true }, ['BAR, patch cost, coverage, and concealability are metadata only.']),
] as const

export const SLICE_13_EQUIPMENT_CATALOG: readonly EquipmentCatalogItem[] = [
  equipment('core.electronics.recorder.microRecorder', 'Micro-Recorder', ['Electronics', 'Audio-Video', 'Recording'], 100, 'C/A-B-B/A', { tech: 'C', availability: 'B', legality: 'A' }, 302,
    { massKg: 0.15, powerUsePph: 0.5, recordingType: 'Audio only', highQualityRecordingHours: 1, lowQualityRecordingHours: 10, size: 'Tiny' }, ['Recording limits and power use are metadata only.']),
  equipment('core.electronics.recorder.microCamcorder', 'Micro-Camcorder', ['Electronics', 'Audio-Video', 'Recording'], 1000, 'D/B-D-C/A', { tech: 'D', availability: 'C', legality: 'A' }, 302,
    { massKg: 0.4, powerUsePph: 1, recordingType: 'Audio-video', videoRecordingHours: 1, stillImageCapacity: 5000, size: 'Tiny' }, ['Recording limits and power use are metadata only.']),
  equipment('core.electronics.audio.personalMusicSet', 'Personal Music Set', ['Electronics', 'Audio-Video', 'Playback'], 20, 'C/A-B-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 302,
    { massKg: 2, powerUsePph: 1, media: 'Live and recorded audio only' }, ['Playback and power use are metadata only.']),
  equipment('core.electronics.computer.compad', 'Compad', ['Electronics', 'Computers', 'Personal Computing'], 150, 'D/A-C-B/A', { tech: 'D', availability: 'B', legality: 'A' }, 303,
    { massKg: 0.2, portable: true, requiresMicroPowerPack: true, powerUsePph: 0.1, textReaderOnly: true }, ['Computing and power-pack behavior are metadata only.']),
  equipment('core.electronics.computer.noteputer', 'Noteputer', ['Electronics', 'Computers', 'Personal Computing'], 500, 'C/A-B-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 303,
    { massKg: 0.5, portable: true, requiresMicroPowerPack: true, powerUsePph: 0.1 }, ['Computing and power-pack behavior are metadata only.']),
  equipment('core.electronics.computer.personalComputer', 'Personal Computer', ['Electronics', 'Computers', 'Personal Computing'], 250, 'C/A-B-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 303,
    { massKg: 3, desktop: true, powerSource: 'Power pack or plug', powerUsePph: 1 }, ['Computing and power behavior are metadata only.']),
  equipment('core.electronics.optics.micheauxElectronicBinoculars', 'Michaeaux Electronic Binoculars', ['Electronics', 'Optics'], 150, 'C/A-B-B/A', { tech: 'C', availability: 'B', legality: 'A' }, 304,
    { massKg: 0.75, powerUsePph: 0.1, magnification: '400x', perceptionModifier: 4, modifierRanges: 'Medium, long, extreme' }, ['Perception and power effects are metadata only.'], 'LA'),
  equipment('core.electronics.optics.irScanner', 'IR Scanner', ['Electronics', 'Optics'], 100, 'D/A-C-B/A', { tech: 'D', availability: 'B', legality: 'A' }, 304,
    { massKg: 0.4, powerUsePph: 0.1, detects: 'Heat signatures only', magnification: '300x', perceptionModifier: 3, modifierRanges: 'Medium, long, extreme', ignoresDarkness: true }, ['Perception and power effects are metadata only.']),
  equipment('core.electronics.optics.nightVisionGoggles', 'Night Vision Goggles', ['Electronics', 'Optics'], 220, 'D/A-C-B/A', { tech: 'D', availability: 'B', legality: 'A' }, 304,
    { massKg: 0.6, powerUsePph: 0.1, negatesDarknessModifiers: true, surfaceDetailPerceptionModifier: -1 }, ['Perception and power effects are metadata only.']),
  equipment('core.electronics.optics.circleVisionVisor', 'Circle-Vision Visor', ['Electronics', 'Optics'], 5000, 'D/D-F-E/B', { tech: 'D', availability: 'E', legality: 'B' }, 304,
    { massKg: 0.75, powerUsePph: 0.5, perceptionModifier: 4, rangefinder: true, preventsSurprise: true, flashBar: 10 }, ['Perception, surprise, BAR, and power effects are metadata only.'], 'DC'),
  equipment('core.electronics.optics.ultrasonicDetector', 'Ultrasonic Detector', ['Electronics', 'Optics'], 2500, 'E/D-F-E/B', { tech: 'E', availability: 'E', legality: 'B' }, 304,
    { massKg: 3, powerUsePpm: 0.1, perceptionModifier: 3, detectionRangeMeters: 10, barrierBarLimit: 3, ignoresDarkness: true, flashBar: 3 }, ['Perception, barrier, BAR, and power effects are metadata only.'], 'CS'),
  equipment('core.security.lockpick.basicSet', 'Basic Lock Pick Set', ['Security', 'Lock-Picks and Bypasses'], 100, 'B/A-A-A/C', { tech: 'B', availability: 'A', legality: 'C' }, 308,
    { massKg: 0.365, skill: 'Security Systems/Mechanical', skillModifier: 2, lockType: 'Mechanical only' }, ['Security-system effects are metadata only.']),
  equipment('core.security.bypass.electronicKit', 'Electronic Security Bypass Kit', ['Security', 'Lock-Picks and Bypasses'], 1200, 'C/C-D-D/E', { tech: 'C', availability: 'D', legality: 'E' }, 308,
    { massKg: 2, powerUsePph: 0.1, skill: 'Security Systems/Electronic', skillModifier: 2, lockType: 'Electronic only' }, ['Security-system and power effects are metadata only.']),
  equipment('core.espionage.disguise.makeupKit', 'Disguise/Make-Up Kit', ['Espionage', 'General'], 1000, 'C/A-B-B/A', { tech: 'C', availability: 'B', legality: 'A' }, 308,
    { massKg: 6.5, skill: 'Disguise', skillModifier: 1, uses: 5 }, ['Skill bonus and uses are metadata only.']),
  equipment('core.repair.toolkit.basic', 'Basic Toolkit', ['Repair', 'Toolkit'], 250, 'C/A-B-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 310,
    { massKg: 10, encumbering: true, repairRequirement: 'Required for repairs that require a Skill roll' }, ['Repair requirements and encumbrance are metadata only.']),
  equipment('core.repair.toolkit.deluxe', 'Deluxe Toolkit', ['Repair', 'Toolkit'], 750, 'D/A-B-A/A', { tech: 'D', availability: 'A', legality: 'A' }, 310,
    { massKg: 50, encumbering: true, skill: 'Technician', skillModifier: 1 }, ['Skill bonus and encumbrance are metadata only.']),
  equipment('core.repair.smallArms.energyWeaponKit', 'Energy Weapon Kit', ['Repair', 'Small Arms Maintenance'], 850, 'D/A-B-B/A', { tech: 'D', availability: 'B', legality: 'A' }, 310,
    { massKg: 2.5, weaponTypes: 'Energy-based small arms and support weapons', restockingCostCBills: 160, skill: 'Technician/Weapons', skillModifier: 1 }, ['Maintenance, restocking, and skill effects are metadata only.']),
  equipment('core.repair.smallArms.slugThrowerKit', 'Slug-Thrower Kit', ['Repair', 'Small Arms Maintenance'], 100, 'C/A-A-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 310,
    { massKg: 3, weaponTypes: 'Ballistic- and Gauss-based small arms and support weapons', restockingCostCBills: 20, skill: 'Technician/Weapons', skillModifier: 1 }, ['Maintenance, restocking, and skill effects are metadata only.']),
  equipment('core.medical.kit.standard', 'Medical Kit', ['Medical', 'Kit'], 10, 'C/A-A-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 313,
    { massKg: 0.25, uses: 1, skill: 'MedTech', skillModifier: 1 }, ['Use count and MedTech effects are metadata only.']),
  equipment('core.medical.medipatch', 'Medipatch', ['Medical', 'First Aid Consumable'], 10, 'D/A-B-A/B', { tech: 'D', availability: 'B', legality: 'B' }, 313,
    { massKg: 0.01, skill: 'MedTech', skillModifier: 1, multipleUseModifierCap: 1 }, ['MedTech effects are metadata only; healing automation is not implemented.']),
  equipment('core.medical.stimpatch', 'Stimpatch', ['Medical', 'First Aid Consumable'], 2, 'D/A-B-A/B', { tech: 'D', availability: 'B', legality: 'B' }, 313,
    { massKg: 0.009, fatigueRemoved: 2, minimumFatigue: 0, consciousnessCheckModifier: 1, addictive: true, drugStrength: 3 }, ['Fatigue, consciousness, addiction, and play-state automation are not implemented.']),
  equipment('core.medical.stimpatch.clan', 'Stimpatch, Clan', ['Medical', 'First Aid Consumable'], 5, 'D/X-X-B/B', { tech: 'D', availability: 'B', legality: 'B' }, 313,
    { massKg: 0.01, fatigueRemoved: 3, minimumFatigue: 0, removesStun: true, consciousnessCheckModifier: 2, addictive: true, drugStrength: 4, truebornAddictionDrugStrengthModifier: -2 }, ['Fatigue, Stun, consciousness, addiction, and play-state automation are not implemented.'], 'CLAN'),
  equipment('core.medical.monitor.portable', 'Portable Medical Monitor', ['Medical', 'Tool'], 2200, 'E/B-C-B/B', { tech: 'E', availability: 'B', legality: 'B' }, 313,
    { massKg: 13.3, powerUsePpm: 1, skill: 'MedTech', skillModifier: 1, withLifeSupportSkillModifier: 2 }, ['MedTech and power effects are metadata only.']),
  equipment('core.medical.lifeSupportUnit.standard', 'Life-Support Unit', ['Medical', 'Tool'], 8500, 'E/B-C-B/B', { tech: 'E', availability: 'B', legality: 'B' }, 313,
    { massKg: 22.5, powerUsePps: 3, stopsContinuousDamage: true, permitsCriticalPatientMovement: true, healingTimeReductionPercent: 20, withPortableMonitorSkillModifier: 2 }, ['Damage, healing, MedTech, and power effects are metadata only.'], 'CS'),
] as const

export const SLICE_14_EQUIPMENT_CATALOG: readonly EquipmentCatalogItem[] = [
  equipment('core.electronics.communications.headset', 'Communications Headset', ['Electronics', 'Communications'], 50, 'D/A-C-C/A', { tech: 'D', availability: 'C', legality: 'A' }, 301,
    { massKg: 0.01, range: '100 m', powerUsePpw: 1 }, ['Range and power use are metadata only.']),
  equipment('core.electronics.communications.longRangeKit', 'Communications Kit, Long-Range', ['Electronics', 'Communications'], 400, 'D/B-D-C/B', { tech: 'D', availability: 'C', legality: 'B' }, 301,
    { massKg: 5, range: '50 km', satelliteRangeKm: 2500, powerUsePph: 3 }, ['Range, satellite access, and power use are metadata only.']),
  equipment('core.electronics.navigation.satNavReceiver', 'SatNav Receiver', ['Electronics', 'Navigation'], 75, 'C/A-E-C/A', { tech: 'C', availability: 'C', legality: 'A' }, 301,
    { massKg: 0.5, powerUsePph: 1, receiverOnly: true, requiresSatNavNetwork: true, navigationSkillModifier: 2 }, ['Network requirements and Navigation effects are metadata only.']),
  equipment('core.electronics.communications.vidPhone', 'Vid-Phone', ['Electronics', 'Communications'], 35, 'D/A-B-A/A', { tech: 'D', availability: 'A', legality: 'A' }, 301,
    { massKg: 0.4, powerUsePph: 0.1, networkType: 'Cordless land-line communicator tied into local networks' }, ['Network and power behavior are metadata only.']),
  equipment('core.electronics.communications.fieldCommunicator', 'Field Communicator', ['Electronics', 'Communications'], 200, 'D/A-A-A/B', { tech: 'D', availability: 'A', legality: 'B' }, 301,
    { massKg: 1, range: '25 km', powerUsePph: 1 }, ['Range and power use are metadata only.']),
  equipment('core.electronics.communications.militaryMicrocommunicator', 'Military Microcommunicator', ['Electronics', 'Communications'], 75, 'C/A-E-C/A', { tech: 'C', availability: 'C', legality: 'A' }, 301,
    { massKg: 0.001, range: '5 km', powerUsePph: 1, usesMicroPowerPacksOnly: true }, ['Range, power use, and power-pack requirements are metadata only.']),
  equipment('core.remoteSensor.heatSensor', 'Heat Sensor', ['Electronics', 'Remote Sensors'], 200, 'D/B-C-B/B', { tech: 'D', availability: 'B', legality: 'B' }, 305,
    { massKg: 0.5, range: '1 km', powerUsePph: 0.1, detectionMode: 'Heat only', affectedBy: 'IR stealth gear' }, ['Sensor detection behavior is metadata only.']),
  equipment('core.remoteSensor.motionSensor', 'Motion Sensor', ['Electronics', 'Remote Sensors'], 100, 'C/B-C-B/B', { tech: 'C', availability: 'B', legality: 'B' }, 305,
    { massKg: 0.25, range: '10 km', powerUsePph: 0.1, detectionMode: 'Motion only', affectedBy: 'Camo stealth gear' }, ['Sensor detection behavior is metadata only.']),
  equipment('core.remoteSensor.tripLine.laser', 'Trip-Line Sensor, Laser', ['Electronics', 'Remote Sensors'], 50, 'C/B-C-B/B', { tech: 'C', availability: 'B', legality: 'B' }, 305,
    { massKg: 1, range: '10 m', powerUsePph: 0.1, perceptionModifierToSpot: -4, maximumTripwireMeters: 10 }, ['Detection and tripwire behavior are metadata only.']),
  equipment('core.power.powerPack.clan', 'Power Pack, Clan', ['Power'], 25, 'F/X-D-B/A', { tech: 'F', availability: 'B', legality: 'A' }, 306,
    { massKg: 0.275, capacityPp: 30, quickCharge: true }, ['Power depletion and recharge mechanics are not implemented.'], 'CLAN'),
  equipment('core.power.microPowerPack.standard', 'Micro Power Pack', ['Power'], 10, 'C/A-B-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 306,
    { massKg: 0.015, capacityPp: 15 }, ['Power depletion and recharge mechanics are not implemented.']),
  equipment('core.power.microPowerPack.highCapacity', 'Micro Power Pack, High-Capacity', ['Power'], 30, 'E/B-C-C/A', { tech: 'E', availability: 'C', legality: 'A' }, 306,
    { massKg: 0.02, capacityPp: 20 }, ['Power depletion and recharge mechanics are not implemented.']),
  equipment('core.power.militaryPowerPack.standard', 'Military Power Pack', ['Power'], 40, 'D/A-B-A/B', { tech: 'D', availability: 'A', legality: 'B' }, 306,
    { massKg: 4, capacityPp: 200 }, ['Power depletion and recharge mechanics are not implemented.']),
  equipment('core.power.recharger.standardLocalGrid', 'Standard Recharger / Local Grid', ['Power', 'Recharger'], 10, 'C/A-A-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 306,
    { massKg: 0.15, powerGenerationPph: 50, plugIn: true }, ['Recharge and power-generation behavior are metadata only.']),
  equipment('core.power.recharger.solar', 'Solar Recharger', ['Power', 'Recharger'], 200, 'D/A-B-B/A', { tech: 'D', availability: 'B', legality: 'A' }, 306,
    { massKg: 1.5, powerGenerationPph: 45 }, ['Recharge and power-generation behavior are metadata only.']),
  equipment('core.fieldGear.navigation.compass', 'Compass', ['Field Gear', 'Navigation'], 10, 'B/A-A-A/A', { tech: 'B', availability: 'A', legality: 'A' }, 312,
    { massKg: 0.1, navigationGroundSkillModifier: 1 }, ['Navigation effects are metadata only.']),
  equipment('core.fieldGear.survival.emergencyFlares', 'Emergency Flares', ['Field Gear', 'Survival'], 10, 'B/A-A-A/A', { tech: 'B', availability: 'A', legality: 'A' }, 312,
    { massKg: 0.6, perceptionVisibilityRangeKm: 5, automaticVisibilityRangeKm: 1 }, ['Visibility and light or damage rules are metadata only.']),
  equipment('core.fieldGear.survival.emergencyRations', 'Emergency Rations', ['Field Gear', 'Survival'], 2, 'C/A-A-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 312,
    { massKg: 1, consumable: true }, ['Consumable tracking is not implemented.']),
  equipment('core.fieldGear.climbing.climbingRappellingKit', 'Climbing/Rappelling Kit', ['Field Gear', 'Climbing'], 150, 'C/A-A-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 312,
    { massKg: 10.3, climbingSkillModifier: 1 }, ['Climbing effects are metadata only.']),
  equipment('core.fieldGear.flight.parachute', 'Parachute', ['Field Gear', 'Flight'], 78, 'C/A-A-A/A', { tech: 'C', availability: 'A', legality: 'A' }, 312,
    { massKg: 8, encumbering: true, skill: 'Acrobatics/Free-Fall', skillModifier: 4 }, ['Landing, control, movement, and falling behavior are metadata only.']),
] as const

export const EQUIPMENT_CATALOG: readonly EquipmentCatalogItem[] = mergeEquipmentCatalogBatches(
  STARTER_EQUIPMENT_CATALOG,
  SLICE_12_EQUIPMENT_CATALOG,
  SLICE_13_EQUIPMENT_CATALOG,
  SLICE_14_EQUIPMENT_CATALOG,
)

export const EQUIPMENT_CATALOG_CATEGORIES = [...new Set(EQUIPMENT_CATALOG.map((entry) => entry.categoryPath[0]))].sort()

export function getEquipmentCatalogItem(itemId: string): EquipmentCatalogItem {
  const item = EQUIPMENT_CATALOG.find((entry) => entry.id === itemId)
  if (!item) throw new Error(`Unknown equipment catalog item: ${itemId}`)
  return item
}

export function filterEquipmentCatalog(options: { search?: string; category?: string; sourceStatus?: EquipmentCatalogSourceStatus | 'all' } = {}): EquipmentCatalogItem[] {
  const search = options.search?.trim().toLowerCase() ?? ''
  return EQUIPMENT_CATALOG.filter((entry) => {
    if (options.category && options.category !== 'all' && entry.categoryPath[0] !== options.category) return false
    if (options.sourceStatus && options.sourceStatus !== 'all' && entry.sourceStatus !== options.sourceStatus) return false
    if (!search) return true
    const haystack = [entry.displayName, entry.id, entry.categoryPath.join(' '), entry.affiliationCode ?? '', entry.sourceKey, ...entry.notes].join(' ').toLowerCase()
    return haystack.includes(search)
  })
}

export function validateEquipmentCatalog(catalog: readonly EquipmentCatalogItem[] = EQUIPMENT_CATALOG): string[] {
  const issues: string[] = []
  const ids = new Set<string>()
  for (const item of catalog) {
    if (!item.id || ids.has(item.id)) issues.push(`Duplicate or missing equipment catalog ID: ${item.id || '(missing)'}`)
    ids.add(item.id)
    if (item.id && !CATALOG_ID_PATTERN.test(item.id)) issues.push(`Unsafe equipment catalog ID: ${item.id}`)
    if (!item.displayName.trim() || !Number.isInteger(item.costCBills) || item.costCBills < 0) issues.push(`Malformed equipment catalog item: ${item.id}`)
    if (!Array.isArray(item.categoryPath) || item.categoryPath.length === 0 || item.categoryPath.some((segment) => !segment || segment !== segment.trim() || !CATEGORY_SEGMENT_PATTERN.test(segment))) {
      issues.push(`Unsafe or missing equipment category: ${item.id}`)
    } else {
      const domain = item.id.split('.')[1]
      if (DOMAIN_CATEGORY[domain] && DOMAIN_CATEGORY[domain] !== item.categoryPath[0]) issues.push(`Equipment ID domain does not match category: ${item.id}`)
    }
    if (item.affiliationCode !== null && (!item.affiliationCode || !AFFILIATION_CODE_PATTERN.test(item.affiliationCode))) issues.push(`Unsafe equipment affiliation code: ${item.id}`)
    if (!item.sourceKey || !item.source?.sourceId || !item.source.edition || item.source.ruleId !== item.sourceKey) issues.push(`Missing or inconsistent equipment source reference: ${item.id}`)
    if (!SOURCE_STATUSES.includes(item.sourceStatus as EquipmentCatalogSourceStatus)) issues.push(`Unknown equipment source status: ${item.id}`)
    if (!item.metadata || typeof item.metadata !== 'object' || Array.isArray(item.metadata) || !Array.isArray(item.notes) || item.notes.some((note) => typeof note !== 'string')) issues.push(`Malformed equipment metadata or notes: ${item.id}`)
    const ratingValues = Object.values(item.ratings)
    if (item.sourceStatus === 'audited-core' && ratingValues.some((value) => value === null)) issues.push(`Audited Core item requires complete ratings: ${item.id}`)
    if (item.sourceStatus === 'example-backed' && ratingValues.some((value) => value !== null)) issues.push(`Example-backed item must preserve unaudited ratings as null: ${item.id}`)
    if (item.rawRatingStatus === 'preserved' && !item.rawEquipmentRating) issues.push(`Preserved raw equipment rating is missing: ${item.id}`)
    if (item.rawRatingStatus === 'not-supplied-in-audit' && item.rawEquipmentRating) issues.push(`Legacy raw-rating status conflicts with preserved rating: ${item.id}`)
    if (!item.rawEquipmentRating && item.rawRatingStatus !== 'not-supplied-in-audit') issues.push(`Missing raw equipment rating status: ${item.id}`)
    if (item.rawEquipmentRating) {
      const parsed = parseRawEquipmentRating(item.rawEquipmentRating)
      if (!parsed) issues.push(`Malformed raw equipment rating: ${item.id}`)
      else {
        if (item.ratings.tech !== parsed.tech) issues.push(`Normalized Tech does not match raw rating: ${item.id}`)
        if (item.ratings.legality !== parsed.legality) issues.push(`Normalized Legality does not match raw rating: ${item.id}`)
        if (!item.ratings.availability || !parsed.availabilityCodes.includes(item.ratings.availability)) issues.push(`Normalized Availability does not appear in raw rating: ${item.id}`)
        if (!item.rawAvailabilityCodes || item.rawAvailabilityCodes.length !== 3) issues.push(`Missing raw Availability triplet: ${item.id}`)
        else if (item.rawAvailabilityCodes.some((value, index) => value !== parsed.availabilityCodes[index])) issues.push(`Stored availability triplet does not match raw rating: ${item.id}`)
      }
    }
  }
  return issues
}

export function parseRawEquipmentRating(raw: string): { tech: EquipmentRatingCode; availabilityCodes: [string, string, string]; legality: EquipmentRatingCode } | null {
  const match = raw.match(/^([A-F])\/([A-FX])-([A-FX])-([A-FX])\/([A-F])$/)
  if (!match) return null
  return { tech: match[1] as EquipmentRatingCode, availabilityCodes: [match[2], match[3], match[4]], legality: match[5] as EquipmentRatingCode }
}

function equipment(
  id: string,
  displayName: string,
  categoryPath: string[],
  costCBills: number,
  rawEquipmentRating: string,
  ratings: EquipmentCatalogItem['ratings'],
  page: number,
  metadata: Record<string, string | number | boolean>,
  notes: string[],
  affiliationCode: string | null = null,
): EquipmentCatalogItem {
  const sourceKey = `AToW-CTP-p${page}`
  const parsed = parseRawEquipmentRating(rawEquipmentRating)
  if (!parsed) throw new Error(`Invalid embedded raw equipment rating: ${rawEquipmentRating}`)
  return {
    id, displayName, categoryPath, costCBills, rawRatingStatus: 'preserved', rawEquipmentRating, rawAvailabilityCodes: parsed.availabilityCodes,
    ratings, affiliationCode, sourceKey, source: source(sourceKey, page), sourceStatus: 'audited-core', metadata, notes,
  }
}

function mergeEquipmentCatalogBatches(...batches: readonly (readonly EquipmentCatalogItem[])[]): EquipmentCatalogItem[] {
  const merged = new Map<string, EquipmentCatalogItem>()
  for (const batch of batches) {
    for (const item of batch) {
      const previous = merged.get(item.id)
      if (previous && (!ALLOWED_STABLE_ID_REPLACEMENTS.has(item.id) || previous.sourceStatus !== 'example-backed' || item.sourceStatus !== 'audited-core')) {
        throw new Error(`Unexpected duplicate equipment catalog ID across batches: ${item.id}`)
      }
      merged.set(item.id, {
        ...item,
        rawRatingStatus: item.rawEquipmentRating ? 'preserved' : 'not-supplied-in-audit',
      })
    }
  }
  return [...merged.values()]
}
