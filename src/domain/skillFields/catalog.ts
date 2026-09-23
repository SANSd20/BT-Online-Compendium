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

export const SKILL_FIELD_CATALOG: readonly SkillFieldDefinition[] = [
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
