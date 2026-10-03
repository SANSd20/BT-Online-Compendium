import type { SourceCitation } from '../rules/model'
import type { LifeModuleDestination } from '../lifeModules/model'
import type { SkillFieldCatalogValidationIssue, SkillFieldDefinition } from './model'

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
export const PILOT_EXOSKELETON_FIELD_ID = 'field.pilot-exoskeleton'
export const CARTOGRAPHER_FIELD_ID = 'field.cartographer'
export const PILOT_INDUSTRIALMECH_FIELD_ID = 'field.pilot-industrialmech'
export const TECHNICIAN_AEROSPACE_FIELD_ID = 'field.technician-aerospace'
export const TECHNICIAN_MECH_FIELD_ID = 'field.technician-mech'

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
]

export function getSkillField(fieldId: string): SkillFieldDefinition {
  const field = SKILL_FIELD_CATALOG.find((entry) => entry.id === fieldId)
  if (!field) throw new Error(`Unknown Skill Field ID: ${fieldId}`)
  return field
}

export function skillFieldCost(field: SkillFieldDefinition, costXpPerSkill: number): number {
  return field.componentSkills.length * costXpPerSkill
}

export function validateSkillFieldCatalog(catalog: readonly SkillFieldDefinition[] = SKILL_FIELD_CATALOG): SkillFieldCatalogValidationIssue[] {
  const issues: SkillFieldCatalogValidationIssue[] = []
  const ids = new Set<string>()
  for (const field of catalog) {
    if (!field.id || ids.has(field.id)) issues.push({ fieldId: field.id, message: `Duplicate or missing Skill Field ID: ${field.id || '(missing)'}` })
    ids.add(field.id)
    if (!field.displayName || !field.source.sourceId || field.componentSkills.length === 0) issues.push({ fieldId: field.id, message: 'Skill Field name, source, and component Skills are required.' })
    const skills = new Set<string>()
    for (const component of field.componentSkills) {
      const key = `${component.address.skillId}/${component.address.parameter?.value ?? ''}`
      if (!component.address.skillId || skills.has(key)) issues.push({ fieldId: field.id, message: `Malformed or duplicate component Skill: ${key}` })
      skills.add(key)
    }
  }
  return issues
}
