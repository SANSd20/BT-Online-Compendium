import type { EquipmentOwnership } from '../character/model'
import type {
  ArchetypeAttribute,
  ArchetypeCatalogIssue,
  ArchetypeDefinition,
  ArchetypeEquipment,
  ArchetypeSkill,
  ArchetypeTrait,
} from './model'

const ATTRIBUTE_IDS = ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG'] as const

function attribute(
  attributeId: string,
  purchasedLevel: number,
  xp: number,
  phenotypeModifier = 0,
): ArchetypeAttribute {
  return { attributeId, purchasedLevel, phenotypeModifier, xp }
}

function trait(
  traitId: string,
  displayName: string,
  tp: number,
  xp: number,
  options: Pick<ArchetypeTrait, 'identityBound' | 'parameters'> = {},
): ArchetypeTrait {
  return { traitId, displayName, tp, xp, ...options }
}

function skill(
  skillId: string,
  displayName: string,
  level: number,
  xp: number,
  options: { subskill?: string; specialty?: string; notes?: string[] } = {},
): ArchetypeSkill {
  return {
    address: {
      skillId,
      ...(options.subskill
        ? { parameter: { kind: 'subskill', value: options.subskill } }
        : {}),
    },
    displayName,
    level,
    xp,
    ...(options.specialty ? { specialty: options.specialty } : {}),
    ...(options.notes ? { notes: options.notes } : {}),
  }
}

function equipment(
  catalogItemId: string,
  displayName: string,
  costCBills: number,
  publishedWeightKg: number,
  rulesPages: number[],
  options: {
    quantity?: number
    ownership?: EquipmentOwnership
    publishedOwnershipLabel?: string
    additionalCostCBills?: number
    notes?: string[]
  } = {},
): ArchetypeEquipment {
  return {
    catalogItemId,
    displayName,
    quantity: options.quantity ?? 1,
    ownership: options.ownership ?? 'Owned',
    costCBills,
    publishedWeightKg,
    rulesPages,
    ...(options.publishedOwnershipLabel
      ? { publishedOwnershipLabel: options.publishedOwnershipLabel }
      : {}),
    ...(options.additionalCostCBills !== undefined
      ? { additionalCostCBills: options.additionalCostCBills }
      : {}),
    ...(options.notes ? { notes: options.notes } : {}),
  }
}

function source(page: number) {
  return {
    sourceId: 'atow-core-corrected-third',
    edition: 'Corrected Third Printing',
    page,
    ruleId: `core-archetype-page-${page}`,
  }
}

const mechWarrior: ArchetypeDefinition = {
  id: 'archetype.core.mechwarrior',
  displayName: 'MechWarrior',
  source: source(52),
  publishedXpTotal: 4500,
  phenotypeId: 'phenotype.normal-human',
  attributes: [
    attribute('STR', 4, 400), attribute('BOD', 5, 500),
    attribute('DEX', 5, 500), attribute('RFL', 6, 600),
    attribute('INT', 4, 400), attribute('WIL', 4, 400),
    attribute('CHA', 4, 400), attribute('EDG', 3, 300),
  ],
  traits: [
    trait('trait.dark-secret', 'Dark Secret', -2, -200),
    trait('trait.equipped', 'Equipped', 1, 100),
    trait('trait.in-for-life', 'In For Life', -3, -300),
    trait('trait.vehicle', 'Vehicle', 4, 400, { identityBound: true }),
  ],
  skills: [
    skill('skill.art', 'Art/Painting', 0, 20, { subskill: 'Painting' }),
    skill('skill.career', 'Career/Soldier', 3, 80, { subskill: 'Soldier' }),
    skill('skill.computers', 'Computers', 1, 30),
    skill('skill.gunnery', 'Gunnery/Mech', 3, 80, { subskill: 'Mech' }),
    skill('skill.interest', 'Interest/BattleMechs', 1, 30, { subskill: 'BattleMechs' }),
    skill('skill.language', 'Language/English', 1, 30, { subskill: 'English' }),
    skill('skill.language', 'Language/French', 0, 20, { subskill: 'French' }),
    skill('skill.leadership', 'Leadership', 1, 30),
    skill('skill.martial-arts', 'Martial Arts', 3, 80),
    skill('skill.medtech', 'MedTech', 2, 50),
    skill('skill.melee-weapons', 'Melee Weapons', 1, 30),
    skill('skill.navigation', 'Navigation/Ground', 2, 50, { subskill: 'Ground' }),
    skill('skill.perception', 'Perception', 2, 50),
    skill('skill.piloting', 'Piloting/Mech', 3, 80, { subskill: 'Mech' }),
    skill('skill.protocol', 'Protocol/FedSuns', 3, 80, { subskill: 'Federated Suns' }),
    skill('skill.sensor-operations', 'Sensor Operations', 2, 50),
    skill('skill.small-arms', 'Small Arms', 3, 80),
    skill('skill.streetwise', 'Streetwise/FedSuns', 2, 50, { subskill: 'Federated Suns' }),
    skill('skill.tactics', 'Tactics/Land', 2, 50, { subskill: 'Land' }),
    skill('skill.technician', 'Technician/Weapons', 1, 30, { subskill: 'Weapons' }),
  ],
  equipment: [
    equipment('equipment.magnum-auto-pistol', 'Magnum Auto Pistol', 50, 0.5, [265], { additionalCostCBills: 8, notes: ['Includes 2 clips.'] }),
    equipment('equipment.cooling-vest', 'Cooling Vest', 200, 4, [294]),
    equipment('equipment.neurohelmet', 'Neurohelmet', 0, 6, [294], { ownership: 'Issued', publishedOwnershipLabel: 'Assigned' }),
    equipment('equipment.shorts', 'Shorts', 9, 0.09, [299]),
    equipment('equipment.plasteel-boots', 'Plasteel Boots', 75, 3, [294]),
    equipment('equipment.military-communicator', 'Military Communicator', 50, 0.1, [301]),
    equipment('equipment.basic-field-kit', 'Basic Field Kit', 10, 5, [312]),
    equipment('equipment.medical-kit', 'Medical Kit', 10, 0.25, [313]),
    equipment('equipment.medipatch', 'Medipatch', 20, 0, [313], { quantity: 2 }),
    equipment('equipment.stimpatch', 'Stimpatch', 16, 0.1, [313], { quantity: 8 }),
  ],
  cBills: 552,
  notes: [],
}

const tanker: ArchetypeDefinition = {
  id: 'archetype.core.tanker',
  displayName: 'Tanker',
  source: source(53),
  publishedXpTotal: 4500,
  phenotypeId: 'phenotype.normal-human',
  attributes: [
    attribute('STR', 5, 400), attribute('BOD', 4, 500),
    attribute('DEX', 3, 500), attribute('RFL', 3, 600),
    attribute('INT', 4, 400), attribute('WIL', 5, 400),
    attribute('CHA', 3, 400), attribute('EDG', 4, 300),
  ],
  traits: [
    trait('trait.enemy', 'Enemy', -1, -100),
    trait('trait.equipped', 'Equipped', 1, 100),
    trait('trait.fit', 'Fit', 2, 200),
    trait('trait.poor-hearing', 'Poor Hearing', -2, -200),
    trait('trait.vehicle', 'Vehicle', 4, 400, { identityBound: true }),
  ],
  skills: [
    skill('skill.artillery', 'Artillery', 2, 50),
    skill('skill.career', 'Career/Soldier', 3, 80, { subskill: 'Soldier' }),
    skill('skill.driving', 'Driving/Ground', 3, 80, { subskill: 'Ground' }),
    skill('skill.gunnery', 'Gunnery/Ground', 3, 80, { subskill: 'Ground' }),
    skill('skill.language', 'Language/English', 1, 30, { subskill: 'English' }),
    skill('skill.language', 'Language/Romanian', 1, 30, { subskill: 'Romanian' }),
    skill('skill.leadership', 'Leadership', 0, 20),
    skill('skill.martial-arts', 'Martial Arts', 2, 50),
    skill('skill.medtech', 'MedTech/General', 2, 50, { subskill: 'General' }),
    skill('skill.melee-weapons', 'Melee Weapons', 2, 50),
    skill('skill.navigation', 'Navigation/Ground', 3, 80, { subskill: 'Ground' }),
    skill('skill.negotiation', 'Negotiation', 1, 30),
    skill('skill.perception', 'Perception', 2, 50),
    skill('skill.protocol', 'Protocol/Free Worlds', 1, 30, { subskill: 'Free Worlds League' }),
    skill('skill.running', 'Running', 1, 30),
    skill('skill.sensor-operations', 'Sensor Operations', 1, 30),
    skill('skill.small-arms', 'Small Arms', 2, 50),
    skill('skill.streetwise', 'Streetwise/Free Worlds', 2, 50, { subskill: 'Free Worlds League' }),
    skill('skill.survival', 'Survival/Forest', 1, 30, { subskill: 'Forest' }),
    skill('skill.swimming', 'Swimming', 0, 20),
    skill('skill.tactics', 'Tactics/Land', 1, 30, { subskill: 'Land' }),
    skill('skill.technician', 'Technician/Mechanical', 1, 30, { subskill: 'Mechanical' }),
    skill('skill.tracking', 'Tracking/Wilds', 0, 20, { subskill: 'Wilds' }),
  ],
  equipment: [
    equipment('equipment.submachine-gun', 'Submachine Gun', 80, 0.5, [265], { additionalCostCBills: 25, notes: ['Includes 5 clips.'] }),
    equipment('equipment.tankers-smock', "Tanker’s Smock", 0, 7.5, [295], { ownership: 'Issued', publishedOwnershipLabel: 'Assigned' }),
    equipment('equipment.helmet-fwl', 'Helmet (FWL)', 0, 1, [293], { ownership: 'Issued', publishedOwnershipLabel: 'Assigned' }),
    equipment('equipment.boots', 'Boots', 48, 3, [293]),
    equipment('equipment.gloves', 'Gloves', 30, 0.5, [293]),
    equipment('equipment.fatigues', 'Fatigues', 30, 0.5, [299]),
    equipment('equipment.military-communicator', 'Military Communicator', 50, 0.1, [301]),
    equipment('equipment.basic-field-kit', 'Basic Field Kit', 10, 5, [312]),
  ],
  cBills: 727,
  notes: [
    {
      code: 'published-attribute-score-xp-mismatch',
      message: 'The printed Attribute scores and XP values do not correspond arithmetically; both are preserved exactly as published.',
    },
    {
      code: 'published-xp-total-mismatch',
      message: 'Core page 51 describes Archetypes as 4,500 XP, but this sheet’s listed XP entries total 4,900. Both values are preserved.',
    },
  ],
}

const aerospacePilot: ArchetypeDefinition = {
  id: 'archetype.core.aerospace-pilot',
  displayName: 'Aerospace Pilot',
  source: source(54),
  publishedXpTotal: 4500,
  phenotypeId: 'phenotype.normal-human',
  attributes: [
    attribute('STR', 2, 200), attribute('BOD', 3, 300),
    attribute('DEX', 5, 500), attribute('RFL', 5, 500),
    attribute('INT', 4, 400), attribute('WIL', 4, 400),
    attribute('CHA', 5, 500), attribute('EDG', 4, 400),
  ],
  traits: [
    trait('trait.compulsion', 'Compulsion/Vain', -1, -100, { parameters: { subtype: 'Vain' } }),
    trait('trait.connections', 'Connections', 1, 100),
    trait('trait.extra-income', 'Extra Income', -3, -300),
    trait('trait.g-tolerance', 'G-Tolerance', 1, 100),
    trait('trait.vehicle', 'Vehicle', 4, 400, { identityBound: true }),
  ],
  skills: [
    skill('skill.career', 'Career/Pilot', 3, 80, { subskill: 'Pilot' }),
    skill('skill.career', 'Career/Soldier', 2, 50, { subskill: 'Soldier' }),
    skill('skill.computers', 'Computers', 0, 20),
    skill('skill.gunnery', 'Gunnery/Aerospace', 3, 80, { subskill: 'Aerospace' }),
    skill('skill.interest', 'Interest/Modern Fashion', 1, 30, { subskill: 'Modern Fashion' }),
    skill('skill.interest', 'Interest/Music', 1, 30, { subskill: 'Music' }),
    skill('skill.language', 'Language/English', 1, 30, { subskill: 'English' }),
    skill('skill.language', 'Language/Japanese', 0, 20, { subskill: 'Japanese' }),
    skill('skill.leadership', 'Leadership', 0, 20),
    skill('skill.martial-arts', 'Martial Arts', 2, 50),
    skill('skill.medtech', 'MedTech/General', 1, 30, { subskill: 'General' }),
    skill('skill.melee-weapons', 'Melee Weapons', 0, 20),
    skill('skill.navigation', 'Navigation/Air', 2, 50, { subskill: 'Air' }),
    skill('skill.navigation', 'Navigation/Space', 3, 80, { subskill: 'Space' }),
    skill('skill.negotiation', 'Negotiation', 0, 20),
    skill('skill.perception', 'Perception', 3, 80),
    skill('skill.piloting', 'Piloting/Aerospace', 3, 80, { subskill: 'Aerospace' }),
    skill('skill.protocol', 'Protocol/Outworlds', 1, 30, { subskill: 'Outworlds Alliance' }),
    skill('skill.sensor-operations', 'Sensor Operations', 1, 30),
    skill('skill.small-arms', 'Small Arms', 2, 50),
    skill('skill.streetwise', 'Streetwise/Outworlds', 1, 30, { subskill: 'Outworlds Alliance' }),
    skill('skill.survival', 'Survival/Desert', 0, 20, { subskill: 'Desert' }),
    skill('skill.swimming', 'Swimming', 0, 20),
    skill('skill.tactics', 'Tactics/Space', 2, 50, { subskill: 'Space' }),
    skill('skill.zero-g-operations', 'Zero-G Operations', 3, 80),
  ],
  equipment: [
    equipment('equipment.needler-pistol', 'Needler Pistol', 50, 0.5, [268], { additionalCostCBills: 4, notes: ['Includes 2 clips.'] }),
    equipment('equipment.combat-flight-suit', 'Combat Flight Suit', 0, 7, [295], { ownership: 'Issued', publishedOwnershipLabel: 'Assigned' }),
    equipment('equipment.pilots-neurohelmet', "Pilot’s Neurohelmet", 0, 5, [295], { ownership: 'Issued', publishedOwnershipLabel: 'Assigned' }),
    equipment('equipment.flight-gloves', 'Flight Gloves', 20, 0.5, [295]),
    equipment('equipment.boots', 'Boots', 55, 3, [295]),
    equipment('equipment.jump-suit', 'Jump Suit', 24, 0.3, [299]),
    equipment('equipment.light-environmental-suit', 'Light Environmental Suit', 200, 5, [296]),
    equipment('equipment.leather-boots', 'Leather Boots', 25, 0.8, [299]),
    equipment('equipment.respirator', 'Respirator', 50, 2.5, [296]),
    equipment('equipment.military-communicator', 'Military Communicator', 50, 0.1, [301]),
    equipment('equipment.basic-field-kit', 'Basic Field Kit', 10, 5, [312]),
    equipment('equipment.medical-kit', 'Medical Kit', 10, 0.25, [313]),
    equipment('equipment.stimpatch', 'Stimpatch', 20, 0.1, [313], { quantity: 10 }),
  ],
  cBills: 482,
  notes: [
    {
      code: 'published-xp-total-mismatch',
      message: 'Core page 51 describes Archetypes as 4,500 XP, but this sheet’s listed XP entries total 4,480. Both values are preserved.',
    },
  ],
}

const elemental: ArchetypeDefinition = {
  id: 'archetype.core.elemental',
  displayName: 'Elemental',
  source: source(55),
  publishedXpTotal: 4500,
  phenotypeId: 'phenotype.elemental',
  attributes: [
    attribute('STR', 7, 700, 2), attribute('BOD', 6, 600, 1),
    attribute('DEX', 4, 400, -1), attribute('RFL', 5, 500),
    attribute('INT', 3, 300), attribute('WIL', 4, 400),
    attribute('CHA', 2, 200), attribute('EDG', 3, 300),
  ],
  traits: [
    trait('trait.compulsion', 'Compulsion/Clan Honor', -2, -200, { parameters: { subtype: 'Clan Honor' } }),
    trait('trait.compulsion', 'Compulsion/Distrust Inner Sphere', -1, -100, { parameters: { subtype: 'Distrust Inner Sphere' } }),
    trait('trait.compulsion', "Compulsion/Hate Hell’s Horses", -2, -200, { parameters: { subtype: "Hate Hell’s Horses" } }),
    trait('trait.phenotype', 'Phenotype/Elemental', 0, 0, { parameters: { phenotype: 'Elemental' } }),
    trait('trait.toughness', 'Toughness', 0, 0),
    trait('trait.trueborn', 'Trueborn', 2, 200, { identityBound: true }),
    trait('trait.vehicle', 'Vehicle', 3, 300, { identityBound: true }),
  ],
  skills: [
    skill('skill.career', 'Career/Soldier', 2, 50, { subskill: 'Soldier' }),
    skill('skill.climbing', 'Climbing', 3, 20, { notes: ['Published level reflects Clan Elemental Field Aptitude.'] }),
    skill('skill.gunnery', 'Gunnery/Battlesuit', 4, 80, { subskill: 'Battlesuit', notes: ['Published level reflects Clan Elemental Field Aptitude.'] }),
    skill('skill.interest', 'Interest/Clan Remembrance', 2, 50, { subskill: 'Clan Remembrance' }),
    skill('skill.language', 'Language/English', 2, 50, { subskill: 'English' }),
    skill('skill.martial-arts', 'Martial Arts', 3, 80),
    skill('skill.medtech', 'MedTech/General', 2, 50, { subskill: 'General' }),
    skill('skill.melee-weapons', 'Melee Weapons', 3, 80, { notes: ['Published level reflects Clan Elemental Field Aptitude.'] }),
    skill('skill.navigation', 'Navigation/Ground', 2, 50, { subskill: 'Ground' }),
    skill('skill.perception', 'Perception', 1, 30),
    skill('skill.piloting', 'Piloting/Battlesuit', 4, 80, { subskill: 'Battlesuit', notes: ['Published level reflects Clan Elemental Field Aptitude.'] }),
    skill('skill.protocol', 'Protocol/Clan Ghost Bear', 1, 30, { subskill: 'Clan Ghost Bear' }),
    skill('skill.sensor-operations', 'Sensor Operations', 2, 50, { notes: ['Published level reflects Clan Elemental Field Aptitude.'] }),
    skill('skill.small-arms', 'Small Arms', 3, 50, { notes: ['Published level reflects Clan Elemental Field Aptitude.'] }),
    skill('skill.tactics', 'Tactics/Infantry', 3, 50, { subskill: 'Infantry', notes: ['Published level reflects Clan Elemental Field Aptitude.'] }),
  ],
  equipment: [
    equipment('equipment.combat-shotgun', 'Combat Shotgun', 175, 4.5, [268], { additionalCostCBills: 10, notes: ['Includes 5 clips.'] }),
    equipment('equipment.fatigues', 'Fatigues', 30, 0.5, [299]),
    equipment('equipment.military-communicator', 'Military Communicator', 50, 0.1, [301]),
  ],
  cBills: 735,
  notes: [
    {
      code: 'field-aptitude-applied',
      message: 'Asterisks on the published sheet identify Skill values modified by Clan Elemental Field Aptitude; published levels and XP are retained separately.',
    },
    {
      code: 'published-xp-total-mismatch',
      message: 'Core page 51 describes Archetypes as 4,500 XP, but this sheet’s listed XP entries total 4,200. Both values are preserved.',
    },
  ],
}

const scout: ArchetypeDefinition = {
  id: 'archetype.core.scout',
  displayName: 'Scout',
  source: source(56),
  publishedXpTotal: 4500,
  phenotypeId: 'phenotype.normal-human',
  attributes: [
    attribute('STR', 3, 300), attribute('BOD', 4, 400),
    attribute('DEX', 3, 300), attribute('RFL', 4, 400),
    attribute('INT', 4, 400), attribute('WIL', 5, 500),
    attribute('CHA', 4, 400), attribute('EDG', 3, 300),
  ],
  traits: [
    trait('trait.compulsion', 'Compulsion/Paranoid', -1, -100, { parameters: { subtype: 'Paranoid' } }),
    trait('trait.connections', 'Connections', 3, 300),
    trait('trait.enemy', 'Enemy/ComStar', -1, -100, { parameters: { enemy: 'ComStar' } }),
    trait('trait.equipped', 'Equipped', 2, 300),
    trait('trait.in-for-life', 'In For Life', -3, -300),
  ],
  skills: [
    skill('skill.acrobatics', 'Acrobatics/Free-Fall', 1, 30, { subskill: 'Free-Fall' }),
    skill('skill.acting', 'Acting', 2, 50),
    skill('skill.administration', 'Administration', 1, 30),
    skill('skill.career', 'Career/Soldier', 1, 30, { subskill: 'Soldier' }),
    skill('skill.comms', 'Comms/Conventional', 3, 80, { subskill: 'Conventional' }),
    skill('skill.comms', 'Comms/HPG', 2, 50, { subskill: 'HPG' }),
    skill('skill.computers', 'Computers', 3, 80),
    skill('skill.cryptography', 'Cryptography', 2, 50),
    skill('skill.disguise', 'Disguise', 1, 30),
    skill('skill.interrogation', 'Interrogation', 1, 30),
    skill('skill.language', 'Language/English', 2, 50, { subskill: 'English' }),
    skill('skill.language', 'Language/Mandarin', 2, 50, { subskill: 'Mandarin' }),
    skill('skill.language', 'Language/Russian', 1, 30, { subskill: 'Russian' }),
    skill('skill.leadership', 'Leadership', 0, 20),
    skill('skill.martial-arts', 'Martial Arts', 3, 80),
    skill('skill.medtech', 'MedTech/General', 2, 50, { subskill: 'General' }),
    skill('skill.melee-weapons', 'Melee Weapons', 1, 30),
    skill('skill.navigation', 'Navigation/Ground', 1, 30, { subskill: 'Ground' }),
    skill('skill.negotiation', 'Negotiation', 1, 30),
    skill('skill.perception', 'Perception', 2, 50),
    skill('skill.protocol', 'Protocol/Capellan Confederation', 1, 30, { subskill: 'Capellan Confederation' }),
    skill('skill.protocol', 'Protocol/Word of Blake', 1, 30, { subskill: 'Word of Blake' }),
    skill('skill.running', 'Running', 1, 30),
    skill('skill.security-systems', 'Security Systems', 2, 50),
    skill('skill.small-arms', 'Small Arms', 3, 80),
    skill('skill.stealth', 'Stealth', 4, 120),
    skill('skill.streetwise', 'Streetwise/Capellan Confederation', 3, 80, { subskill: 'Capellan Confederation' }),
    skill('skill.survival', 'Survival/Badlands', 2, 50, { subskill: 'Badlands' }),
    skill('skill.tracking', 'Tracking/Urban', 2, 50, { subskill: 'Urban' }),
  ],
  equipment: [
    equipment('equipment.pulse-laser-pistol', 'Pulse Laser Pistol', 0, 1, [267], { ownership: 'Issued', publishedOwnershipLabel: 'Assigned' }),
    equipment('equipment.power-pack-hc', 'Power Pack (HC)', 15, 0.3, [306]),
    equipment('equipment.sneaksuit-camo', 'Sneaksuit Camo', 0, 4, [297], { ownership: 'Issued', publishedOwnershipLabel: 'Assigned' }),
    equipment('equipment.fatigues', 'Fatigues', 30, 0.5, [299]),
    equipment('equipment.leather-boots', 'Leather Boots', 25, 0.8, [299]),
    equipment('equipment.load-bearing-vest', 'Load Bearing Vest', 20, 0.4, [290]),
    equipment('equipment.filter-mask', 'Filter Mask', 5, 0.4, [296]),
    equipment('equipment.military-microcommunicator', 'Military Microcommunicator', 200, 0, [301]),
    equipment('equipment.noteputer', 'Noteputer', 0, 0.5, [303], { ownership: 'Issued', publishedOwnershipLabel: 'Assigned' }),
    equipment('equipment.rangefinder-binoculars', 'Rangefinder Binoculars', 200, 0.5, [304]),
    equipment('equipment.advanced-field-kit', 'Advanced Field Kit', 100, 15, [312]),
    equipment('equipment.electronic-compass', 'Electronic Compass', 30, 0.1, [312]),
    equipment('equipment.emergency-rations', 'Emergency Rations', 40, 20, [312], { quantity: 20 }),
    equipment('equipment.bubble-tent', 'Bubble Tent', 200, 3, [312]),
    equipment('equipment.medical-kit', 'Medical Kit', 10, 0.25, [313]),
    equipment('equipment.medipatch', 'Medipatch', 20, 0, [313], { quantity: 2 }),
    equipment('equipment.stimpatch', 'Stimpatch', 20, 0.1, [313], { quantity: 10 }),
  ],
  cBills: 85,
  notes: [],
}

const faceman: ArchetypeDefinition = {
  id: 'archetype.core.faceman',
  displayName: 'Faceman',
  source: source(57),
  publishedXpTotal: 4500,
  phenotypeId: 'phenotype.normal-human',
  attributes: [
    attribute('STR', 3, 300), attribute('BOD', 3, 300),
    attribute('DEX', 3, 300), attribute('RFL', 4, 400),
    attribute('INT', 6, 600), attribute('WIL', 3, 300),
    attribute('CHA', 6, 600), attribute('EDG', 3, 300),
  ],
  traits: [
    trait('trait.connections', 'Connections', 4, 400),
    trait('trait.gregarious', 'Gregarious', 1, 100),
    trait('trait.extra-income', 'Extra Income', 3, 300),
    trait('trait.reputation', 'Reputation', 1, 100),
  ],
  skills: [
    skill('skill.acting', 'Acting (Deception)', 1, 30, { specialty: 'Deception' }),
    skill('skill.art', 'Art/Writing', 3, 80, { subskill: 'Writing' }),
    skill('skill.career', 'Career/Journalist', 2, 50, { subskill: 'Journalist' }),
    skill('skill.career', 'Career/Lawyer', 2, 50, { subskill: 'Lawyer' }),
    skill('skill.computers', 'Computers', 2, 50),
    skill('skill.disguise', 'Disguise', 1, 30),
    skill('skill.interest', 'Interest/Law', 4, 120, { subskill: 'Law' }),
    skill('skill.investigation', 'Investigation', 3, 80),
    skill('skill.language', 'Language/English', 3, 80, { subskill: 'English' }),
    skill('skill.language', 'Language/German', 2, 50, { subskill: 'German' }),
    skill('skill.martial-arts', 'Martial Arts', 0, 20),
    skill('skill.negotiation', 'Negotiation', 4, 120),
    skill('skill.perception', 'Perception', 4, 120),
    skill('skill.protocol', 'Protocol/Lyran Alliance', 2, 50, { subskill: 'Lyran Alliance' }),
    skill('skill.protocol', 'Protocol/Mercenary', 3, 80, { subskill: 'Mercenary' }),
    skill('skill.small-arms', 'Small Arms', 0, 20),
  ],
  equipment: [
    equipment('equipment.hold-out-pistol', 'Hold-Out Pistol', 20, 0.2, [265], { additionalCostCBills: 4, notes: ['Includes 4 clips.'] }),
    equipment('equipment.flak-vest', 'Flak Vest', 50, 2.8, [288]),
    equipment('equipment.coat', 'Coat', 55, 1.1, [299]),
    equipment('equipment.jacket', 'Jacket', 36, 1.5, [299]),
    equipment('equipment.shirt', 'Shirt', 15, 0.5, [299]),
    equipment('equipment.pants', 'Pants', 23, 1, [299]),
    equipment('equipment.footwear', 'Footwear', 50, 0.8, [299]),
    equipment('equipment.noteputer', 'Noteputer', 200, 0.5, [303]),
    equipment('equipment.micro-recorder', 'Micro-recorder', 100, 0.2, [302]),
    equipment('equipment.civilian-communicator', 'Civilian Communicator', 45, 0.1, [301]),
  ],
  cBills: 402,
  notes: [
    {
      code: 'published-xp-total-mismatch',
      message: 'Core page 51 describes Archetypes as 4,500 XP, but this sheet’s listed XP entries total 5,030. Both values are preserved.',
    },
  ],
}

const renegadeWarrior: ArchetypeDefinition = {
  id: 'archetype.core.renegade-warrior',
  displayName: 'Renegade Warrior',
  source: source(58),
  publishedXpTotal: 4500,
  phenotypeId: 'phenotype.normal-human',
  attributes: [
    attribute('STR', 5, 500), attribute('BOD', 5, 500),
    attribute('DEX', 4, 400), attribute('RFL', 5, 500),
    attribute('INT', 4, 400), attribute('WIL', 6, 600),
    attribute('CHA', 3, 300), attribute('EDG', 4, 400),
  ],
  traits: [
    trait('trait.equipped', 'Equipped', 1, 100),
    trait('trait.patient', 'Patient', 1, 100),
    trait('trait.wealth', 'Wealth', 2, 200, { identityBound: true }),
  ],
  skills: [
    skill('skill.acrobatics', 'Acrobatics/Free-Fall', 1, 30, { subskill: 'Free-Fall' }),
    skill('skill.artillery', 'Artillery', 3, 80),
    skill('skill.career', 'Career/Soldier', 2, 50, { subskill: 'Soldier' }),
    skill('skill.climbing', 'Climbing', 1, 30),
    skill('skill.comms', 'Comms/Conventional', 2, 50, { subskill: 'Conventional' }),
    skill('skill.language', 'Language/English', 2, 50, { subskill: 'English' }),
    skill('skill.language', 'Language/German', 3, 80, { subskill: 'German' }),
    skill('skill.martial-arts', 'Martial Arts', 3, 80),
    skill('skill.medtech', 'MedTech/General', 2, 50, { subskill: 'General' }),
    skill('skill.melee-weapons', 'Melee Weapons', 2, 50),
    skill('skill.navigation', 'Navigation/Ground', 3, 80, { subskill: 'Ground' }),
    skill('skill.perception', 'Perception', 2, 50),
    skill('skill.running', 'Running', 1, 30),
    skill('skill.small-arms', 'Small Arms (Rifles)', 3, 80, { specialty: 'Rifles' }),
    skill('skill.support-weapons', 'Support Weapons', 3, 80),
    skill('skill.tactics', 'Tactics/Infantry', 3, 80, { subskill: 'Infantry' }),
    skill('skill.thrown-weapons', 'Thrown Weapons/Blunt', 2, 50, { subskill: 'Blunt' }),
  ],
  equipment: [
    equipment('equipment.vibroblade', 'Vibroblade', 200, 0.7, [264], { quantity: 2 }),
    equipment('equipment.auto-pistol', 'Auto-Pistol', 50, 0.5, [265], { additionalCostCBills: 4, notes: ['Includes 2 clips.'] }),
    equipment('equipment.imperator-ax-22', 'Imperator AX-22', 200, 3.5, [266], { additionalCostCBills: 12, notes: ['Includes 4 clips.'] }),
    equipment('equipment.grenade-smoke', 'Grenade, Smoke', 32, 4.8, [278, 284], { quantity: 8 }),
    equipment('equipment.helmet', 'Helmet', 180, 1.8, [294]),
    equipment('equipment.jacket', 'Jacket', 100, 5.5, [294]),
    equipment('equipment.combat-boots', 'Combat Boots', 48, 2, [294]),
    equipment('equipment.fatigues', 'Fatigues', 30, 0.5, [299]),
    equipment('equipment.military-communicator', 'Military Communicator', 50, 0.1, [301]),
    equipment('equipment.basic-field-kit', 'Basic Field Kit', 10, 5, [313]),
    equipment('equipment.medical-kit', 'Medical Kit', 10, 0.25, [313]),
  ],
  cBills: 4074,
  notes: [
    {
      code: 'published-xp-total-mismatch',
      message: 'Core page 51 describes Archetypes as 4,500 XP, but this sheet’s listed XP entries total 5,000. Both values are preserved.',
    },
  ],
}

const battlefieldTech: ArchetypeDefinition = {
  id: 'archetype.core.battlefield-tech',
  displayName: 'Battlefield Tech',
  source: source(59),
  publishedXpTotal: 4500,
  phenotypeId: 'phenotype.normal-human',
  attributes: [
    attribute('STR', 5, 500), attribute('BOD', 4, 400),
    attribute('DEX', 3, 300), attribute('RFL', 3, 300),
    attribute('INT', 5, 500), attribute('WIL', 4, 400),
    attribute('CHA', 3, 300), attribute('EDG', 5, 500),
  ],
  traits: [
    trait('trait.equipped', 'Equipped', 2, 200),
    trait('trait.tech-empathy', 'Tech Empathy', 2, 200),
    trait('trait.wealth', 'Wealth', 3, 300, { identityBound: true }),
  ],
  skills: [
    skill('skill.administration', 'Administration', 2, 50),
    skill('skill.appraisal', 'Appraisal', 2, 50),
    skill('skill.career', 'Career/Soldier', 1, 30, { subskill: 'Soldier' }),
    skill('skill.career', 'Career/Technician', 3, 80, { subskill: 'Technician' }),
    skill('skill.language', 'Language/English', 3, 80, { subskill: 'English' }),
    skill('skill.martial-arts', 'Martial Arts', 1, 30),
    skill('skill.medtech', 'MedTech/General', 2, 50, { subskill: 'General' }),
    skill('skill.melee-weapons', 'Melee Weapons', 1, 30),
    skill('skill.navigation', 'Navigation/Ground', 0, 20, { subskill: 'Ground' }),
    skill('skill.perception', 'Perception', 2, 50),
    skill('skill.small-arms', 'Small Arms', 2, 50),
    skill('skill.technician', 'Technician/Electronic', 4, 120, { subskill: 'Electronic' }),
    skill('skill.technician', 'Technician/Mechanical', 4, 120, { subskill: 'Mechanical' }),
    skill('skill.technician', 'Technician/Nuclear', 4, 120, { subskill: 'Nuclear' }),
    skill('skill.technician', 'Technician/Weapons', 4, 120, { subskill: 'Weapons' }),
  ],
  equipment: [
    equipment('equipment.revolver', 'Revolver', 40, 0.5, [265], { additionalCostCBills: 2, notes: ['Includes 2 reloads.'] }),
    equipment('equipment.flak-jacket', 'Flak Jacket', 75, 3.2, [288]),
    equipment('equipment.fatigues', 'Fatigues', 30, 0.5, [299]),
    equipment('equipment.jump-suit', 'Jump Suit', 24, 0.5, [299]),
    equipment('equipment.work-boots', 'Work Boots', 36, 1.7, [299]),
    equipment('equipment.leather-gloves', 'Leather Gloves', 20, 0.4, [299]),
    equipment('equipment.filter-mask', 'Filter Mask', 5, 0.4, [296]),
    equipment('equipment.satchel-battery', 'Satchel Battery', 20, 2, [306]),
    equipment('equipment.descartes-mk-xxi', 'Descartes Mk. XXI', 1000, 7, [303]),
    equipment('equipment.deluxe-tool-kit', 'Deluxe Tool Kit', 750, 50, [310]),
    equipment('equipment.handheld-laser-torch', 'Handheld Laser Torch', 40, 1, [310]),
    equipment('equipment.military-communicator', 'Military Communicator', 50, 0.1, [301]),
    equipment('equipment.basic-field-kit', 'Basic Field Kit', 10, 5, [312]),
  ],
  cBills: 7898,
  notes: [
    {
      code: 'published-xp-total-mismatch',
      message: 'Core page 51 describes Archetypes as 4,500 XP, but this sheet’s listed XP entries total 4,900. Both values are preserved.',
    },
  ],
}

export const CORE_ARCHETYPES: readonly ArchetypeDefinition[] = [
  mechWarrior,
  tanker,
  aerospacePilot,
  elemental,
  scout,
  faceman,
  renegadeWarrior,
  battlefieldTech,
]

export function calculateArchetypeXp(archetype: ArchetypeDefinition): number {
  return [...archetype.attributes, ...archetype.traits, ...archetype.skills]
    .reduce((total, entry) => total + entry.xp, 0)
}

export function validateArchetypeCatalog(
  archetypes: readonly ArchetypeDefinition[],
): ArchetypeCatalogIssue[] {
  const issues: ArchetypeCatalogIssue[] = []
  const ids = new Set<string>()

  archetypes.forEach((archetype, index) => {
    const path = `archetypes.${index}`
    if (!archetype.id.trim()) issues.push({ path: `${path}.id`, message: 'Archetype ID is required.' })
    if (ids.has(archetype.id)) issues.push({ path: `${path}.id`, message: `Duplicate archetype ID: ${archetype.id}` })
    ids.add(archetype.id)
    if (!archetype.displayName.trim()) issues.push({ path: `${path}.displayName`, message: 'Display name is required.' })
    if (!archetype.source.sourceId || !archetype.source.page) issues.push({ path: `${path}.source`, message: 'Source ID and page are required.' })
    if (archetype.attributes.length !== ATTRIBUTE_IDS.length) issues.push({ path: `${path}.attributes`, message: 'All eight Attributes are required.' })
    const attributeIds = new Set(archetype.attributes.map((entry) => entry.attributeId))
    ATTRIBUTE_IDS.forEach((attributeId) => {
      if (!attributeIds.has(attributeId)) issues.push({ path: `${path}.attributes`, message: `Missing Attribute: ${attributeId}` })
    })
    if (archetype.traits.length === 0) issues.push({ path: `${path}.traits`, message: 'At least one Trait is required.' })
    if (archetype.skills.length === 0) issues.push({ path: `${path}.skills`, message: 'At least one Skill is required.' })
    if (
      calculateArchetypeXp(archetype) !== archetype.publishedXpTotal &&
      !archetype.notes.some((note) => note.code === 'published-xp-total-mismatch')
    ) {
      issues.push({ path, message: `XP entries total ${calculateArchetypeXp(archetype)}, not ${archetype.publishedXpTotal}, without a source-mismatch note.` })
    }
  })

  return issues
}

const catalogIssues = validateArchetypeCatalog(CORE_ARCHETYPES)
if (catalogIssues.length > 0) {
  throw new Error(`Core archetype catalog is invalid: ${catalogIssues.map((entry) => `${entry.path}: ${entry.message}`).join(' ')}`)
}

const archetypeById = new Map(CORE_ARCHETYPES.map((archetype) => [archetype.id, archetype]))

export function getCoreArchetype(archetypeId: string): ArchetypeDefinition {
  const archetype = archetypeById.get(archetypeId)
  if (!archetype) throw new Error(`Unknown Core archetype ID: ${archetypeId}`)
  return archetype
}
