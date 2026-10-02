import type { SourceCitation } from '../rules/model'

export type MasterSkillFieldGoalCategory = 'civilian' | 'intelligence-police' | 'military' | 'clan-military'

export const MASTER_SKILL_FIELD_GOAL_CATEGORY_LABELS: Record<MasterSkillFieldGoalCategory, string> = {
  civilian: 'Civilian Skill Fields',
  'intelligence-police': 'Intelligence/Police Fields',
  military: 'Military Skill Fields',
  'clan-military': 'Clan Military Skill Fields',
}

export type MasterSkillFieldGoalPrerequisite =
  | { id: string; kind: 'attribute-minimum'; attributeId: string; minimum: number; label: string }
  | { id: string; kind: 'trait'; traitId: string; label: string }
  | { id: string; kind: 'trait-absent'; traitId: string; label: string }
  | { id: string; kind: 'skill-field'; fieldIds: string[]; label: string }
  | { id: string; kind: 'affiliation'; affiliationIds?: string[]; label: string }
  | { id: string; kind: 'phenotype'; phenotype: string; label: string }
  | { id: string; kind: 'alternative'; options: MasterSkillFieldGoalPrerequisite[][]; label: string }
  | { id: string; kind: 'structural'; label: string }

export interface MasterSkillFieldGoalSkill {
  id: string
  displayName: string
  skillId: string
  parameter?: string
  variable: boolean
}

export interface MasterSkillFieldGoalDefinition {
  id: string
  displayName: string
  category: MasterSkillFieldGoalCategory
  source: SourceCitation
  prerequisites: MasterSkillFieldGoalPrerequisite[]
  fieldSkills: MasterSkillFieldGoalSkill[]
}

const slug = (value: string) => value.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const fieldId = (name: string) => `field.${slug(name)}`
const source = (name: string, page: number): SourceCitation => ({ sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', ruleId: `master-skill-field-${slug(name)}`, page })

const SKILL_IDS: Record<string, string> = {
  Acting: 'skill.acting', Administration: 'skill.administration', Appraisal: 'skill.appraisal', Art: 'skill.art', Artillery: 'skill.artillery',
  Climbing: 'skill.climbing', Comms: 'skill.comms', Computers: 'skill.computers', Cryptography: 'skill.cryptography', Demolitions: 'skill.demolitions',
  Disguise: 'skill.disguise', Driving: 'skill.driving', 'Escape Artist': 'skill.escape-artist', Gunnery: 'skill.gunnery', Interest: 'skill.interest',
  Interrogation: 'skill.interrogation', Investigation: 'skill.investigation', Language: 'skill.language', Leadership: 'skill.leadership', 'Martial Arts': 'skill.martial-arts',
  MedTech: 'skill.medtech', 'Melee Weapons': 'skill.melee-weapons', Navigation: 'skill.navigation', Negotiation: 'skill.negotiation', Perception: 'skill.perception',
  Piloting: 'skill.piloting', Protocol: 'skill.protocol', Running: 'skill.running', 'Security Systems': 'skill.security-systems', 'Sensor Operations': 'skill.sensor-operations',
  'Small Arms': 'skill.small-arms', Stealth: 'skill.stealth', Strategy: 'skill.strategy', Streetwise: 'skill.streetwise', 'Support Weapons': 'skill.support-weapons',
  Surgery: 'skill.surgery', Survival: 'skill.survival', Tactics: 'skill.tactics', Technician: 'skill.technician', Thrown: 'skill.thrown-weapons',
  'Thrown Weapons': 'skill.thrown-weapons', Tracking: 'skill.tracking', Training: 'skill.training', 'Zero-G Operations': 'skill.zero-g-operations', Career: 'skill.career',
}

function goalSkill(displayName: string): MasterSkillFieldGoalSkill {
  const [base, ...rest] = displayName.split('/')
  const parameter = rest.join('/') || undefined
  const variable = /\bAny\b|any one| or |Land, Sea, or Air Vehicle/i.test(parameter ?? '')
  return { id: `goal-skill.${slug(displayName)}`, displayName, skillId: SKILL_IDS[base] ?? `skill.${slug(base)}`, ...(parameter ? { parameter } : {}), variable }
}

const attr = (id: string, attributeId: string, minimum: number): MasterSkillFieldGoalPrerequisite => ({ id, kind: 'attribute-minimum', attributeId, minimum, label: `${attributeId} ${minimum}+` })
const trait = (id: string, traitId: string, label: string): MasterSkillFieldGoalPrerequisite => ({ id, kind: 'trait', traitId, label })
const absent = (id: string, traitId: string, label: string): MasterSkillFieldGoalPrerequisite => ({ id, kind: 'trait-absent', traitId, label })
const fields = (id: string, names: string[], label: string): MasterSkillFieldGoalPrerequisite => ({ id, kind: 'skill-field', fieldIds: names.map(fieldId), label })
const affiliation = (id: string, label: string, affiliationIds?: string[]): MasterSkillFieldGoalPrerequisite => ({ id, kind: 'affiliation', label, ...(affiliationIds ? { affiliationIds } : {}) })
const phenotype = (id: string, value: string): MasterSkillFieldGoalPrerequisite => ({ id, kind: 'phenotype', phenotype: value, label: `${value} Phenotype` })
const alternative = (id: string, label: string, options: MasterSkillFieldGoalPrerequisite[][]): MasterSkillFieldGoalPrerequisite => ({ id, kind: 'alternative', label, options })
const structural = (id: string, label: string): MasterSkillFieldGoalPrerequisite => ({ id, kind: 'structural', label })
const f = (displayName: string, category: MasterSkillFieldGoalCategory, page: number, prerequisites: MasterSkillFieldGoalPrerequisite[], skills: string[]): MasterSkillFieldGoalDefinition => ({ id: fieldId(displayName), displayName, category, source: source(displayName, page), prerequisites, fieldSkills: skills.map((name, index) => ({ ...goalSkill(name), id: `goal-skill.${slug(name)}.${index + 1}` })) })

const civ = 'civilian' as const
const intel = 'intelligence-police' as const
const mil = 'military' as const
const clan = 'clan-military' as const

export const MASTER_SKILL_FIELD_GOAL_CATALOG: readonly MasterSkillFieldGoalDefinition[] = [
  f('Anthropologist', civ, 92, [fields('anthropologist.field', ['General Studies'], 'General Studies Field'), attr('anthropologist.int', 'INT', 4)], ['Career/Anthropologist', 'Interest/History (Any one culture)', 'Investigation', 'Language/Any', 'Language/Any', 'Protocol/Any']),
  f('Archaeologist', civ, 92, [fields('archaeologist.field', ['General Studies'], 'General Studies Field'), attr('archaeologist.int', 'INT', 4)], ['Career/Archaeologist', 'Appraisal', 'Interest/Geology', 'Interest/History (any)', 'Navigation/Ground', 'Perception']),
  f('Cartographer', civ, 92, [attr('cartographer.int', 'INT', 4)], ['Career/Cartographer', 'Computers', 'Navigation/Air', 'Navigation/Ground', 'Perception', 'Sensor Operations']),
  f('Communications', civ, 92, [attr('communications.int', 'INT', 4)], ['Acting', 'Career/Communications', 'Comms/Conventional', 'Computers', 'Protocol/Any', 'Sensor Operations']),
  f('Doctor', civ, 92, [fields('doctor.field', ['Medical Assistant', 'Scientist'], 'Medical Assistant or Scientist Field'), attr('doctor.dex', 'DEX', 4), attr('doctor.int', 'INT', 5), attr('doctor.wil', 'WIL', 3)], ['Administration', 'Career/Doctor', 'MedTech/Any', 'Protocol/Affiliation', 'Surgery/Any']),
  f('Engineer', civ, 92, [fields('engineer.field', ['Technician - Civilian', 'Technician - Military'], 'Technician - Civilian or Military Field'), attr('engineer.int', 'INT', 4)], ['Appraisal', 'Career/Engineer', 'Perception', 'Technician/Nuclear', 'Technician/Any']),
  f('General Studies', civ, 92, [attr('general-studies.int', 'INT', 3), structural('general-studies.related-skill', 'At least one other Skill related to the listed Field Skills')], ['Career/Any', 'Computers', 'Interest/Any', 'Perception', 'Protocol/Affiliation']),
  f('HPG Technician', civ, 92, [affiliation('hpg.affiliation', 'ComStar, Word of Blake, or Clan Affiliation'), fields('hpg.field', ['Communications'], 'Communications Field')], ['Administration', 'Comms/Conventional', 'Comms/HPG', 'Computers', 'Cryptography']),
  f('Journalist', civ, 92, [attr('journalist.int', 'INT', 3), attr('journalist.cha', 'CHA', 4), attr('journalist.wil', 'WIL', 4)], ['Acting', 'Art/Writing', 'Career/Journalist', 'Computers', 'Investigation', 'Perception']),
  f('Lawyer', civ, 92, [fields('lawyer.field', ['General Studies'], 'General Studies Field'), attr('lawyer.int', 'INT', 4), attr('lawyer.cha', 'CHA', 4), attr('lawyer.wil', 'WIL', 5)], ['Acting', 'Administration', 'Career/Lawyer', 'Interest/Law', 'Negotiation', 'Protocol/Any']),
  f('Manager', civ, 92, [attr('manager.int', 'INT', 5), attr('manager.cha', 'CHA', 5)], ['Administration', 'Career/Management', 'Leadership', 'Negotiation', 'Protocol/Affiliation', 'Training']),
  f('Medical Assistant', civ, 92, [attr('medical-assistant.dex', 'DEX', 3), attr('medical-assistant.int', 'INT', 4)], ['Career/MedTech', 'Computers', 'Interest/Pharmacology', 'MedTech/Any', 'Perception']),
  f('Merchant', civ, 92, [attr('merchant.cha', 'CHA', 3), attr('merchant.wil', 'WIL', 3)], ['Administration', 'Appraisal', 'Career/Merchant', 'Negotiation', 'Protocol/Any', 'Streetwise/Any']),
  f('Merchant Marine', civ, 92, [attr('merchant-marine.rfl', 'RFL', 3), absent('merchant-marine.tds', 'trait.tds', 'Cannot have TDS Trait')], ['Career/Merchant Marine', 'Protocol/Any', 'Technician/Aeronautics', 'Technician/Any', 'Zero-G Operations']),
  f('Pilot - Aerospace (Civilian)', civ, 92, [attr('pilot-aerospace-civilian.dex', 'DEX', 3), attr('pilot-aerospace-civilian.rfl', 'RFL', 4), attr('pilot-aerospace-civilian.int', 'INT', 3)], ['Career/Aerospace Pilot', 'Comms/Conventional', 'Navigation/Air', 'Navigation/Space', 'Piloting/Aerospace', 'Sensor Operations']),
  f('Pilot - Aircraft (Civilian)', civ, 93, [attr('pilot-aircraft-civilian.dex', 'DEX', 3), attr('pilot-aircraft-civilian.rfl', 'RFL', 3)], ['Career/Aircraft Pilot', 'Comms/Conventional', 'Navigation/Air', 'Piloting/Air Vehicle or VTOL', 'Sensor Operations']),
  f('Pilot - DropShip', civ, 93, [attr('pilot-dropship.dex', 'DEX', 4), attr('pilot-dropship.int', 'INT', 3), attr('pilot-dropship.wil', 'WIL', 3), absent('pilot-dropship.tds', 'trait.tds', 'Cannot have TDS Trait')], ['Career/DropShip Pilot', 'Comms/Conventional', 'Navigation/Space', 'Piloting/Spacecraft', 'Sensor Operations', 'Zero-G Operations']),
  f('Pilot - Exoskeleton', civ, 93, [attr('pilot-exoskeleton.str', 'STR', 5), attr('pilot-exoskeleton.bod', 'BOD', 5)], ['Piloting/Battlesuit', 'Sensor Operations', 'Technician/Electronic', 'Technician/Mechanical', 'Technician/Myomer']),
  f('Pilot - IndustrialMech', civ, 93, [attr('pilot-industrialmech.dex', 'DEX', 3), attr('pilot-industrialmech.rfl', 'RFL', 3)], ['Piloting/Mech', 'Sensor Operations', 'Technician/Electronic', 'Technician/Mechanical', 'Technician/Myomer']),
  f('Pilot - JumpShip', civ, 93, [fields('pilot-jumpship.field', ['Pilot - DropShip'], 'DropShip Pilot Field'), attr('pilot-jumpship.int', 'INT', 5), absent('pilot-jumpship.tds', 'trait.tds', 'Cannot have TDS Trait')], ['Administration', 'Computers', 'Navigation/K-F Jump', 'Navigation/Space', 'Piloting/Spacecraft']),
  f('Planetary Surveyor', civ, 93, [fields('planetary-surveyor.field', ['Scientist'], 'Scientist Field'), attr('planetary-surveyor.int', 'INT', 6)], ['Appraisal', 'Driving/Any', 'Navigation/Ground', 'Survival/Any', 'Tracking/Wilds']),
  f('Politician', civ, 93, [fields('politician.field', ['Manager'], 'Manager Field'), attr('politician.cha', 'CHA', 4)], ['Acting', 'Career/Politician', 'Leadership', 'Negotiation', 'Protocol/Affiliation']),
  f('Scientist', civ, 93, [attr('scientist.int', 'INT', 4)], ['Career/Scientist', 'Computers', 'Interest/Any', 'Investigation', 'Perception', 'Science/Any', 'Training']),
  f('Technician - Aerospace', civ, 93, [fields('technician-aerospace.field', ['Technician - Civilian', 'Technician - Military'], 'Technician - Civilian or Military Field'), attr('technician-aerospace.int', 'INT', 4)], ['Computers', 'Technician/Aeronautics', 'Technician/Nuclear', 'Technician/Jets', 'Zero-G Operations']),
  f('Technician - Civilian', civ, 93, [attr('technician-civilian.int', 'INT', 3), attr('technician-civilian.dex', 'DEX', 3)], ['Appraisal', 'Career/Technician', 'Technician/Electronic', 'Technician/Mechanical', 'Technician/Nuclear']),
  f('Technician - Mech', civ, 93, [fields('technician-mech.field', ['Technician - Civilian', 'Technician - Military'], 'Technician - Civilian or Military Field'), attr('technician-mech.int', 'INT', 4)], ['Technician/Electronic', 'Technician/Jet', 'Technician/Mechanical', 'Technician/Myomer', 'Technician/Nuclear']),
  f('Technician - Vehicle', civ, 93, [fields('technician-vehicle.field', ['Technician - Civilian', 'Technician - Military'], 'Technician - Civilian or Military Field'), attr('technician-vehicle.int', 'INT', 4)], ['Computers', 'Technician/Electronic', 'Technician/Mechanical', 'Technician/Nuclear']),
  f('Analysis', intel, 93, [alternative('analysis.requirement', 'INT 4 and WIL 4, or INT 3 and WIL 4 with Police Officer Field', [[attr('analysis.int4', 'INT', 4), attr('analysis.wil4a', 'WIL', 4)], [attr('analysis.int3', 'INT', 3), attr('analysis.wil4b', 'WIL', 4), fields('analysis.police', ['Police Officer'], 'Police Officer Field')]])], ['Computers', 'Investigation', 'Language/Any one', 'Language/Any one', 'Sensor Operations', 'Strategy', 'Tactics/Any']),
  f('Covert Operations', intel, 93, [alternative('covert-operations.requirement', 'INT 4 and WIL 4, or INT 3 and WIL 4 with Police Officer Field', [[attr('covert.int4', 'INT', 4), attr('covert.wil4a', 'WIL', 4)], [attr('covert.int3', 'INT', 3), attr('covert.wil4b', 'WIL', 4), fields('covert.police', ['Police Officer'], 'Police Officer Field')]])], ['Acting', 'Escape Artist', 'Language/Any one', 'Perception', 'Protocol/Any', 'Streetwise/Any', 'Tracking/Any']),
  f('Detective', intel, 93, [alternative('detective.requirement', 'INT 4 and WIL 4, or INT 3 and WIL 4 with Police Officer Field', [[attr('detective.int4', 'INT', 4), attr('detective.wil4a', 'WIL', 4)], [attr('detective.int3', 'INT', 3), attr('detective.wil4b', 'WIL', 4), fields('detective.police', ['Police Officer'], 'Police Officer Field')]])], ['Career/Detective', 'Computers', 'Interrogation', 'Investigation', 'Perception', 'Security Systems/Any', 'Streetwise/Affiliation']),
  f('Intelligence', intel, 93, [alternative('intelligence.requirement', 'INT 4 and WIL 4, or INT 3 and WIL 4 with Police Officer Field', [[attr('intelligence.int4', 'INT', 4), attr('intelligence.wil4a', 'WIL', 4)], [attr('intelligence.int3', 'INT', 3), attr('intelligence.wil4b', 'WIL', 4), fields('intelligence.police', ['Police Officer'], 'Police Officer Field')]])], ['Comms/Conventional', 'Computers', 'Cryptography', 'Language/Any', 'Sensor Operations']),
  f('Police Officer', intel, 93, [attr('police-officer.wil', 'WIL', 3)], ['Acting', 'Career/Police', 'Driving/Any', 'Martial Arts', 'MedTech/General', 'Small Arms', 'Streetwise/Affiliation']),
  f('Police Tactical Officer', intel, 93, [fields('police-tactical-officer.field', ['Police Officer'], 'Police Officer Field'), attr('police-tactical-officer.rfl', 'RFL', 4)], ['Climbing', 'Demolitions', 'Running', 'Support Weapons', 'Tactics/Infantry', 'Thrown Weapons/Any', 'Tracking/Urban']),
  f('Basic Training', mil, 94, [trait('basic-training.rank', 'trait.rank', 'Rank Trait'), attr('basic-training.int', 'INT', 3), attr('basic-training.wil', 'WIL', 3)], ['Career/Soldier', 'Martial Arts', 'MedTech/General', 'Navigation/Ground', 'Small Arms']),
  f('Basic Training (Naval)', mil, 94, [trait('basic-training-naval.rank', 'trait.rank', 'Rank Trait'), attr('basic-training-naval.int', 'INT', 4), attr('basic-training-naval.rfl', 'RFL', 3), absent('basic-training-naval.tds', 'trait.tds', 'Cannot have TDS Trait')], ['Career/Pilot or Ship’s Crew', 'Martial Arts', 'MedTech/General', 'Navigation/Space', 'Small Arms', 'Zero-G Operations']),
  f('Cavalry', mil, 94, [fields('cavalry.field', ['Basic Training'], 'Basic Training Field'), attr('cavalry.dex', 'DEX', 3)], ['Artillery', 'Driving/Any', 'Gunnery/Any Vehicle', 'Sensor Operations', 'Tactics/Land or Sea', 'Technician/Mechanical']),
  f('Infantry', mil, 94, [fields('infantry.field', ['Basic Training'], 'Basic Training Field')], ['Acrobatics/Free-Fall', 'Artillery', 'Climbing', 'Comms/Conventional', 'Support Weapons', 'Tactics/Infantry']),
  f('Infantry - Anti-Mech', mil, 94, [fields('infantry-anti-mech.field', ['Infantry'], 'Infantry Field'), attr('infantry-anti-mech.wil', 'WIL', 5)], ['Acrobatics/Gymnastics', 'Demolitions', 'Perception', 'Security Systems/Electronic', 'Technician/Mechanical', 'Technician/Myomer']),
  f('Marine', mil, 94, [fields('marine.field', ['Basic Training (Naval)'], 'Basic Training (Naval) Field'), absent('marine.tds', 'trait.tds', 'Cannot have TDS Trait')], ['Acrobatics/Free-Fall', 'Demolitions', 'Gunnery/Spacecraft', 'Security Systems/Any', 'Zero-G Operations']),
  f('MechWarrior', mil, 94, [fields('mechwarrior.field', ['Basic Training'], 'Basic Training Field'), attr('mechwarrior.dex', 'DEX', 4), attr('mechwarrior.rfl', 'RFL', 4)], ['Gunnery/Mech', 'Piloting/Mech', 'Sensor Operations', 'Tactics/Land', 'Technician/Any']),
  f('Military Scientist', mil, 94, [fields('military-scientist.field', ['Analysis'], 'Analysis Field'), attr('military-scientist.int', 'INT', 5)], ['Career/Military Scientist', 'Computers', 'Cryptography', 'Interest/Military History', 'Strategy', 'Tactics/Any']),
  f('Officer', mil, 94, [fields('officer.field', ['Basic Training', 'Basic Training (Naval)'], 'Basic Training or Basic Training (Naval) Field'), structural('officer.rank', 'Rank O1 or higher')], ['Administration', 'Leadership', 'Melee Weapons', 'Protocol/Affiliation', 'Training']),
  f('Pilot - Aerospace (Combat)', mil, 94, [fields('pilot-aerospace-combat.field', ['Basic Training', 'Basic Training (Naval)'], 'Basic Training or Basic Training (Naval) Field'), attr('pilot-aerospace-combat.dex', 'DEX', 4), attr('pilot-aerospace-combat.rfl', 'RFL', 4)], ['Gunnery/Aerospace', 'Navigation/Air', 'Navigation/Space', 'Piloting/Aerospace', 'Sensor Operations', 'Tactics/Space', 'Zero-G Operations']),
  f('Pilot - Aircraft (Combat)', mil, 94, [fields('pilot-aircraft-combat.field', ['Basic Training', 'Basic Training (Naval)'], 'Basic Training or Basic Training (Naval) Field'), attr('pilot-aircraft-combat.dex', 'DEX', 4), attr('pilot-aircraft-combat.rfl', 'RFL', 3)], ['Gunnery/Air Vehicle', 'Navigation/Air', 'Piloting/Air Vehicle', 'Sensor Operations', 'Tactics/Air']),
  f('Pilot - Battle Armor', mil, 94, [fields('pilot-battle-armor.field', ['Infantry'], 'Infantry Field'), attr('pilot-battle-armor.str', 'STR', 6), attr('pilot-battle-armor.bod', 'BOD', 5)], ['Climbing', 'Gunnery/Battlesuit', 'Martial Arts', 'Piloting/Battlesuit', 'Sensor Operations', 'Tactics/Land']),
  f('Pilot - WarShip', mil, 94, [fields('pilot-warship.field', ['Pilot - DropShip'], 'Pilot - DropShip Field'), attr('pilot-warship.dex', 'DEX', 4), attr('pilot-warship.int', 'INT', 6), absent('pilot-warship.tds', 'trait.tds', 'Cannot have TDS Trait')], ['Computers', 'Leadership', 'Navigation/K-F Jump', 'Navigation/Space', 'Protocol/Affiliation', 'Strategy', 'Tactics/Space']),
  f('Scout', mil, 94, [fields('scout.field', ['Basic Training'], 'Basic Training Field'), attr('scout.int', 'INT', 4), attr('scout.wil', 'WIL', 3), absent('scout.illiterate', 'trait.illiterate', 'Cannot have Illiterate Trait')], ['Comms/Conventional', 'Disguise', 'Language/Any', 'Security Systems/Any', 'Stealth', 'Streetwise/Any', 'Tracking/Any']),
  f('Ship’s Crew', mil, 94, [fields('ships-crew.field', ['Basic Training (Naval)'], 'Basic Training (Naval) Field'), attr('ships-crew.rfl', 'RFL', 3), absent('ships-crew.tds', 'trait.tds', 'Cannot have TDS Trait')], ['Career/Ship’s Crew', 'Computers', 'Gunnery/Spacecraft', 'Technician/Any', 'Zero-G Operations']),
  f('Special Forces', mil, 94, [fields('special-forces.field', ['Infantry', 'MechWarrior', 'Scout'], 'Infantry, MechWarrior, or Scout Field'), attr('special-forces.bod', 'BOD', 4), attr('special-forces.rfl', 'RFL', 4), attr('special-forces.wil', 'WIL', 5)], ['Acrobatics/Free-Fall', 'Demolitions', 'Small Arms', 'Stealth', 'Survival/Any', 'Tracking/Any']),
  f('Technician - Military', mil, 94, [attr('technician-military.int', 'INT', 3), attr('technician-military.dex', 'DEX', 3)], ['Appraisal', 'Career/Technician', 'Technician/Electronics', 'Technician/Mechanical', 'Technician/Nuclear', 'Technician/Weapons']),
  f('Clan Aerospace Warrior', clan, 95, [affiliation('clan-aerospace.affiliation', 'Clan Affiliation', ['affiliation.clan']), phenotype('clan-aerospace.phenotype', 'Aerospace'), attr('clan-aerospace.dex', 'DEX', 5), attr('clan-aerospace.rfl', 'RFL', 5), attr('clan-aerospace.wil', 'WIL', 4)], ['Gunnery/Aerospace', 'Navigation/Space', 'Piloting/Aerospace', 'Sensor Operations', 'Tactics/Space']),
  f('Clan Basic Training', clan, 95, [affiliation('clan-basic.affiliation', 'Clan Affiliation', ['affiliation.clan'])], ['Martial Arts', 'MedTech/General', 'Melee Weapons', 'Navigation/Ground', 'Protocol/Affiliation', 'Small Arms']),
  f('Clan Cavalry', clan, 95, [affiliation('clan-cavalry.affiliation', 'Clan Affiliation', ['affiliation.clan']), fields('clan-cavalry.field', ['Basic Training'], 'Basic Training Field')], ['Artillery', 'Driving/Any (or Piloting/Air Vehicle)', 'Gunnery/Land, Sea, or Air Vehicle', 'Sensor Operations', 'Tactics/Land (or Air)']),
  f('Clan Elemental', clan, 95, [affiliation('clan-elemental.affiliation', 'Clan Affiliation', ['affiliation.clan']), phenotype('clan-elemental.phenotype', 'Elemental'), attr('clan-elemental.bod', 'BOD', 5), attr('clan-elemental.dex', 'DEX', 3), attr('clan-elemental.rfl', 'RFL', 3), attr('clan-elemental.wil', 'WIL', 4)], ['Climbing', 'Gunnery/Battlesuit', 'Melee Weapons', 'Piloting/Battlesuit', 'Sensor Operations', 'Small Arms', 'Tactics/Infantry']),
  f('Clan MechWarrior', clan, 95, [affiliation('clan-mechwarrior.affiliation', 'Clan Affiliation', ['affiliation.clan']), phenotype('clan-mechwarrior.phenotype', 'MechWarrior'), attr('clan-mechwarrior.bod', 'BOD', 4), attr('clan-mechwarrior.dex', 'DEX', 3), attr('clan-mechwarrior.rfl', 'RFL', 4), attr('clan-mechwarrior.wil', 'WIL', 5)], ['Gunnery/Mech', 'Leadership', 'Navigation/Ground', 'Piloting/Mech', 'Sensor Operations', 'Tactics/Land']),
  f('Clan ProtoMech Warrior', clan, 95, [affiliation('clan-protomech.affiliation', 'Clan Affiliation', ['affiliation.clan']), phenotype('clan-protomech.phenotype', 'Aerospace'), trait('clan-protomech.implant', 'trait.implant-el-neural-implant', 'Implant/EL Neural Implant'), attr('clan-protomech.dex', 'DEX', 3), attr('clan-protomech.rfl', 'RFL', 4), attr('clan-protomech.wil', 'WIL', 4)], ['Gunnery/ProtoMech', 'Navigation/Ground', 'Piloting/ProtoMech', 'Sensor Operations', 'Tactics/Land']),
]

export const MECHWARRIOR_GOAL_ID = 'field.mechwarrior'

export function getMasterSkillFieldGoal(fieldIdValue: string): MasterSkillFieldGoalDefinition {
  const field = MASTER_SKILL_FIELD_GOAL_CATALOG.find((entry) => entry.id === fieldIdValue)
  if (!field) throw new Error(`Unknown Master Skill Field goal ID: ${fieldIdValue}`)
  return field
}
