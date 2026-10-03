import type { SourceCitation } from '../rules/model'
import type { LifeModuleDestination } from '../lifeModules/model'
import type { SkillFieldCatalogValidationIssue, SkillFieldDefinition } from './model'
import { MODELED_LANGUAGE_SUBSKILLS } from '../skills/languages'

const source = (ruleId: string): SourceCitation => ({
  sourceId: 'atow-core-corrected-third',
  edition: 'Corrected Third Printing',
  ruleId,
})

const skill = (skillId: string, displayName: string, parameter?: string): Extract<LifeModuleDestination, { type: 'skill' }> => ({
  type: 'skill',
  address: { skillId, ...(parameter ? { parameter: { kind: 'subskill', value: parameter } } : {}) },
  displayName,
})

export const TECHNICIAN_CIVILIAN_FIELD_ID = 'field.technician-civilian'
export const TECHNICIAN_VEHICLE_FIELD_ID = 'field.technician-vehicle'
export const BASIC_TRAINING_FIELD_ID = 'field.basic-training'
export const BASIC_TRAINING_NAVAL_FIELD_ID = 'field.basic-training-naval'
export const PILOT_EXOSKELETON_FIELD_ID = 'field.pilot-exoskeleton'
export const CARTOGRAPHER_FIELD_ID = 'field.cartographer'
export const PILOT_INDUSTRIALMECH_FIELD_ID = 'field.pilot-industrialmech'
export const TECHNICIAN_AEROSPACE_FIELD_ID = 'field.technician-aerospace'
export const TECHNICIAN_MECH_FIELD_ID = 'field.technician-mech'
export const INFANTRY_FIELD_ID = 'field.infantry'
export const MECHWARRIOR_FIELD_ID = 'field.mechwarrior'
export const MARINE_FIELD_ID = 'field.marine'
export const SHIPS_CREW_FIELD_ID = 'field.ships-crew'
export const TECHNICIAN_MILITARY_FIELD_ID = 'field.technician-military'
export const CAVALRY_FIELD_ID = 'field.cavalry'
export const SCOUT_FIELD_ID = 'field.scout'

export const SECURITY_SYSTEMS_SUBSKILLS = ['Electronic', 'Mechanical'] as const
export const NAVAL_CAREER_SUBSKILLS = ['Pilot', 'Ship’s Crew'] as const
export const DRIVING_SUBSKILLS = ['Ground Vehicles', 'Rail Vehicles', 'Sea Vehicles'] as const
export const VEHICLE_GUNNERY_SUBSKILLS = ['Air Vehicle', 'Ground Vehicle', 'Sea Vehicle'] as const
export const CAVALRY_TACTICS_SUBSKILLS = ['Land', 'Sea'] as const
export const SCOUT_STREETWISE_SUBSKILLS = ['Capellan', 'FedSuns'] as const
export const TRACKING_SUBSKILLS = ['Urban', 'Wilds'] as const

export const TECHNICIAN_SUBSKILLS = [
  'Aeronautics', 'Cybernetics', 'Electronic', 'Jets', 'Mechanics', 'Myomer', 'Nuclear', 'Weapons',
] as const

export const SKILL_FIELD_CATALOG: readonly SkillFieldDefinition[] = [
  {
    id: BASIC_TRAINING_FIELD_ID,
    displayName: 'Basic Training',
    category: 'basic',
    source: { ...source('skill-field-basic-training'), page: 94 },
    prerequisites: [
      { id: 'basic-training.rank', kind: 'trait', traitId: 'trait.rank', description: 'Rank Trait' },
      { id: 'basic-training.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' },
      { id: 'basic-training.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 3, description: 'WIL 3+' },
    ],
    componentSkills: [
      skill('skill.career', 'Career/Soldier', 'Soldier'),
      skill('skill.martial-arts', 'Martial Arts'),
      skill('skill.medtech', 'MedTech/General', 'General'),
      skill('skill.navigation', 'Navigation/Ground', 'Ground'),
      skill('skill.small-arms', 'Small Arms'),
    ],
  },
  {
    id: BASIC_TRAINING_NAVAL_FIELD_ID,
    displayName: 'Basic Training (Naval)',
    category: 'basic',
    source: { ...source('skill-field-basic-training-naval'), page: 94 },
    prerequisites: [
      { id: 'basic-training-naval.rank', kind: 'trait', traitId: 'trait.rank', description: 'Rank Trait' },
      { id: 'basic-training-naval.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
      { id: 'basic-training-naval.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 3, description: 'RFL 3+' },
      { id: 'basic-training-naval.tds', kind: 'trait-absent', traitId: 'trait.tds', description: 'Cannot have TDS Trait' },
    ],
    componentSkills: [
      skill('skill.martial-arts', 'Martial Arts'),
      skill('skill.medtech', 'MedTech/General', 'General'),
      skill('skill.navigation', 'Navigation/Space', 'Space'),
      skill('skill.small-arms', 'Small Arms'),
      skill('skill.zero-g-operations', 'Zero-G Operations'),
    ],
    variableComponentSkills: [{
      id: 'basic-training-naval.career',
      displayName: 'Naval Career subskill',
      skillId: 'skill.career',
      legalSubskills: [...NAVAL_CAREER_SUBSKILLS],
    }],
  },
  {
    id: TECHNICIAN_CIVILIAN_FIELD_ID,
    displayName: 'Technician/Civilian',
    category: 'basic',
    source: source('skill-field-technician-civilian'),
    prerequisites: [
      { id: 'technician-civilian.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' },
      { id: 'technician-civilian.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3, description: 'DEX 3+' },
    ],
    componentSkills: [
      skill('skill.appraisal', 'Appraisal'),
      skill('skill.career', 'Career/Technician', 'Technician'),
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Nuclear', 'Nuclear'),
    ],
  },
  {
    id: TECHNICIAN_VEHICLE_FIELD_ID,
    displayName: 'Technician/Vehicle',
    category: 'advanced',
    source: source('skill-field-technician-vehicle'),
    prerequisites: [
      { id: 'technician-vehicle.prior-field', kind: 'skill-field', fieldIds: [TECHNICIAN_CIVILIAN_FIELD_ID, 'field.technician-military'], description: 'Technician/Civilian or Technician/Military Field' },
      { id: 'technician-vehicle.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
    ],
    componentSkills: [
      skill('skill.computers', 'Computers'),
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Nuclear', 'Nuclear'),
    ],
  },
  {
    id: PILOT_EXOSKELETON_FIELD_ID,
    displayName: 'Pilot/Exoskeleton',
    category: 'basic',
    source: { ...source('skill-field-pilot-exoskeleton'), page: 93 },
    prerequisites: [
      { id: 'pilot-exoskeleton.str', kind: 'attribute-minimum', attributeId: 'STR', minimum: 5, description: 'STR 5+' },
      { id: 'pilot-exoskeleton.bod', kind: 'attribute-minimum', attributeId: 'BOD', minimum: 5, description: 'BOD 5+' },
    ],
    componentSkills: [
      skill('skill.piloting', 'Piloting/Battlesuit', 'Battlesuit'),
      skill('skill.sensor-operations', 'Sensor Operations'),
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Myomer', 'Myomer'),
    ],
  },
  {
    id: CARTOGRAPHER_FIELD_ID,
    displayName: 'Cartographer',
    category: 'advanced',
    source: { ...source('skill-field-cartographer'), page: 92 },
    prerequisites: [{ id: 'cartographer.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' }],
    componentSkills: [
      skill('skill.career', 'Career/Cartographer', 'Cartographer'),
      skill('skill.computers', 'Computers'),
      skill('skill.navigation', 'Navigation/Air', 'Air'),
      skill('skill.navigation', 'Navigation/Ground', 'Ground'),
      skill('skill.perception', 'Perception'),
      skill('skill.sensor-operations', 'Sensor Operations'),
    ],
  },
  {
    id: PILOT_INDUSTRIALMECH_FIELD_ID,
    displayName: 'Pilot/IndustrialMech',
    category: 'advanced',
    source: { ...source('skill-field-pilot-industrialmech'), page: 93 },
    prerequisites: [
      { id: 'pilot-industrialmech.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3, description: 'DEX 3+' },
      { id: 'pilot-industrialmech.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 3, description: 'RFL 3+' },
    ],
    componentSkills: [
      skill('skill.piloting', 'Piloting/Mech', 'Mech'),
      skill('skill.sensor-operations', 'Sensor Operations'),
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Myomer', 'Myomer'),
    ],
  },
  {
    id: TECHNICIAN_AEROSPACE_FIELD_ID,
    displayName: 'Technician/Aerospace',
    category: 'advanced',
    source: { ...source('skill-field-technician-aerospace'), page: 93 },
    prerequisites: [
      { id: 'technician-aerospace.prior-field', kind: 'skill-field', fieldIds: [TECHNICIAN_CIVILIAN_FIELD_ID, 'field.technician-military'], description: 'Technician/Civilian or Technician/Military Field' },
      { id: 'technician-aerospace.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
    ],
    componentSkills: [
      skill('skill.computers', 'Computers'),
      skill('skill.technician', 'Technician/Aeronautics', 'Aeronautics'),
      skill('skill.technician', 'Technician/Nuclear', 'Nuclear'),
      skill('skill.technician', 'Technician/Jets', 'Jets'),
      skill('skill.zero-g-operations', 'Zero-G Operations'),
    ],
  },
  {
    id: TECHNICIAN_MECH_FIELD_ID,
    displayName: 'Technician/Mech',
    category: 'advanced',
    source: { ...source('skill-field-technician-mech'), page: 93 },
    prerequisites: [
      { id: 'technician-mech.prior-field', kind: 'skill-field', fieldIds: [TECHNICIAN_CIVILIAN_FIELD_ID, 'field.technician-military'], description: 'Technician/Civilian or Technician/Military Field' },
      { id: 'technician-mech.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
    ],
    componentSkills: [
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Jet', 'Jet'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Myomer', 'Myomer'),
      skill('skill.technician', 'Technician/Nuclear', 'Nuclear'),
    ],
  },
  {
    id: INFANTRY_FIELD_ID,
    displayName: 'Infantry',
    category: 'advanced',
    source: { ...source('skill-field-infantry'), page: 94 },
    prerequisites: [
      { id: 'infantry.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID], description: 'Basic Training Field' },
    ],
    componentSkills: [
      skill('skill.acrobatics', 'Acrobatics/Free-Fall', 'Free-Fall'),
      skill('skill.artillery', 'Artillery'),
      skill('skill.climbing', 'Climbing'),
      skill('skill.communications', 'Comms/Conventional', 'Conventional'),
      skill('skill.support-weapons', 'Support Weapons'),
      skill('skill.tactics', 'Tactics/Infantry', 'Infantry'),
    ],
  },
  {
    id: CAVALRY_FIELD_ID,
    displayName: 'Cavalry',
    category: 'advanced',
    source: { ...source('skill-field-cavalry'), page: 94 },
    prerequisites: [
      { id: 'cavalry.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID], description: 'Basic Training Field' },
      { id: 'cavalry.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3, description: 'DEX 3+' },
    ],
    componentSkills: [
      skill('skill.artillery', 'Artillery'),
      skill('skill.sensor-operations', 'Sensor Operations'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
    ],
    variableComponentSkills: [
      {
        id: 'cavalry.driving-any',
        displayName: 'Driving subskill',
        skillId: 'skill.driving',
        legalSubskills: [...DRIVING_SUBSKILLS],
      },
      {
        id: 'cavalry.gunnery-any-vehicle',
        displayName: 'Vehicle Gunnery subskill',
        skillId: 'skill.gunnery',
        legalSubskills: [...VEHICLE_GUNNERY_SUBSKILLS],
      },
      {
        id: 'cavalry.tactics-land-or-sea',
        displayName: 'Cavalry Tactics subskill',
        skillId: 'skill.tactics',
        legalSubskills: [...CAVALRY_TACTICS_SUBSKILLS],
      },
    ],
  },
  {
    id: MECHWARRIOR_FIELD_ID,
    displayName: 'MechWarrior',
    category: 'advanced',
    source: { ...source('skill-field-mechwarrior'), page: 94 },
    prerequisites: [
      { id: 'mechwarrior.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID], description: 'Basic Training Field' },
      { id: 'mechwarrior.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 4, description: 'DEX 4+' },
      { id: 'mechwarrior.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 4, description: 'RFL 4+' },
    ],
    componentSkills: [
      skill('skill.gunnery', 'Gunnery/Mech', 'Mech'),
      skill('skill.piloting', 'Piloting/Mech', 'Mech'),
      skill('skill.sensor-operations', 'Sensor Operations'),
      skill('skill.tactics', 'Tactics/Land', 'Land'),
    ],
    variableComponentSkills: [{
      id: 'mechwarrior.technician-any',
      displayName: 'Technician Field Skill',
      skillId: 'skill.technician',
      legalSubskills: [...TECHNICIAN_SUBSKILLS],
    }],
  },
  {
    id: SCOUT_FIELD_ID,
    displayName: 'Scout',
    category: 'advanced',
    source: { ...source('skill-field-scout'), page: 94 },
    prerequisites: [
      { id: 'scout.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID], description: 'Basic Training Field' },
      { id: 'scout.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
      { id: 'scout.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 3, description: 'WIL 3+' },
      { id: 'scout.illiterate', kind: 'trait-absent', traitId: 'trait.illiterate', description: 'Cannot have Illiterate Trait' },
    ],
    componentSkills: [
      skill('skill.communications', 'Comms/Conventional', 'Conventional'),
      skill('skill.disguise', 'Disguise'),
      skill('skill.stealth', 'Stealth'),
    ],
    variableComponentSkills: [
      {
        id: 'scout.language-any',
        displayName: 'Language (currently modeled choices)',
        skillId: 'skill.language',
        legalSubskills: [...MODELED_LANGUAGE_SUBSKILLS],
      },
      {
        id: 'scout.security-systems-any',
        displayName: 'Security Systems subskill',
        skillId: 'skill.security-systems',
        legalSubskills: [...SECURITY_SYSTEMS_SUBSKILLS],
      },
      {
        id: 'scout.streetwise-any',
        displayName: 'Streetwise affiliation',
        skillId: 'skill.streetwise',
        legalSubskills: [...SCOUT_STREETWISE_SUBSKILLS],
      },
      {
        id: 'scout.tracking-any',
        displayName: 'Tracking subskill',
        skillId: 'skill.tracking',
        legalSubskills: [...TRACKING_SUBSKILLS],
      },
    ],
  },
  {
    id: MARINE_FIELD_ID,
    displayName: 'Marine',
    category: 'advanced',
    source: { ...source('skill-field-marine'), page: 94 },
    prerequisites: [
      { id: 'marine.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_NAVAL_FIELD_ID], description: 'Basic Training (Naval) Field' },
      { id: 'marine.tds', kind: 'trait-absent', traitId: 'trait.tds', description: 'Cannot have TDS Trait' },
    ],
    componentSkills: [
      skill('skill.acrobatics', 'Acrobatics/Free-Fall', 'Free-Fall'),
      skill('skill.demolitions', 'Demolitions'),
      skill('skill.gunnery', 'Gunnery/Spacecraft', 'Spacecraft'),
      skill('skill.zero-g-operations', 'Zero-G Operations'),
    ],
    variableComponentSkills: [{
      id: 'marine.security-systems-any',
      displayName: 'Security Systems subskill',
      skillId: 'skill.security-systems',
      legalSubskills: [...SECURITY_SYSTEMS_SUBSKILLS],
    }],
  },
  {
    id: SHIPS_CREW_FIELD_ID,
    displayName: 'Ship’s Crew',
    category: 'advanced',
    source: { ...source('skill-field-ships-crew'), page: 94 },
    prerequisites: [
      { id: 'ships-crew.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_NAVAL_FIELD_ID], description: 'Basic Training (Naval) Field' },
      { id: 'ships-crew.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 3, description: 'RFL 3+' },
      { id: 'ships-crew.tds', kind: 'trait-absent', traitId: 'trait.tds', description: 'Cannot have TDS Trait' },
    ],
    componentSkills: [
      skill('skill.career', 'Career/Ship’s Crew', 'Ship’s Crew'),
      skill('skill.computers', 'Computers'),
      skill('skill.gunnery', 'Gunnery/Spacecraft', 'Spacecraft'),
      skill('skill.zero-g-operations', 'Zero-G Operations'),
    ],
    variableComponentSkills: [{
      id: 'ships-crew.technician-any',
      displayName: 'Technician subskill',
      skillId: 'skill.technician',
      legalSubskills: [...TECHNICIAN_SUBSKILLS],
    }],
  },
  {
    id: TECHNICIAN_MILITARY_FIELD_ID,
    displayName: 'Technician/Military',
    category: 'advanced',
    source: { ...source('skill-field-technician-military'), page: 94 },
    prerequisites: [
      { id: 'technician-military.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' },
      { id: 'technician-military.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3, description: 'DEX 3+' },
    ],
    componentSkills: [
      skill('skill.appraisal', 'Appraisal'),
      skill('skill.career', 'Career/Technician', 'Technician'),
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Nuclear', 'Nuclear'),
      skill('skill.technician', 'Technician/Weapons', 'Weapons'),
    ],
  },
]

export function getSkillField(fieldId: string): SkillFieldDefinition {
  const field = SKILL_FIELD_CATALOG.find((entry) => entry.id === fieldId)
  if (!field) throw new Error(`Unknown Skill Field ID: ${fieldId}`)
  return field
}

export function skillFieldCost(field: SkillFieldDefinition, costXpPerSkill: number): number {
  return (field.componentSkills.length + (field.variableComponentSkills?.length ?? 0)) * costXpPerSkill
}

export function validateSkillFieldCatalog(catalog: readonly SkillFieldDefinition[] = SKILL_FIELD_CATALOG): SkillFieldCatalogValidationIssue[] {
  const issues: SkillFieldCatalogValidationIssue[] = []
  const ids = new Set<string>()
  for (const field of catalog) {
    if (!field.id || ids.has(field.id)) issues.push({ fieldId: field.id, message: `Duplicate or missing Skill Field ID: ${field.id || '(missing)'}` })
    ids.add(field.id)
    if (!field.displayName || !field.source.sourceId || field.componentSkills.length + (field.variableComponentSkills?.length ?? 0) === 0) issues.push({ fieldId: field.id, message: 'Skill Field name, source, and component Skills are required.' })
    const skills = new Set<string>()
    for (const component of field.componentSkills) {
      const key = `${component.address.skillId}/${component.address.parameter?.value ?? ''}`
      if (!component.address.skillId || skills.has(key)) issues.push({ fieldId: field.id, message: `Malformed or duplicate component Skill: ${key}` })
      skills.add(key)
    }
    for (const component of field.variableComponentSkills ?? []) {
      if (!component.id || !component.displayName || !component.skillId || component.legalSubskills.length === 0 || new Set(component.legalSubskills).size !== component.legalSubskills.length) {
        issues.push({ fieldId: field.id, message: `Malformed variable component Skill: ${component.id || '(missing)'}` })
      }
    }
  }
  return issues
}
