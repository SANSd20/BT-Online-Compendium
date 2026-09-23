import type { LifeModuleDestination, LifeModulePrerequisite } from '../lifeModules/model'
import type { SourceCitation } from '../rules/model'

export type SkillFieldCategory = 'basic' | 'advanced' | 'special'

export interface SkillFieldDefinition {
  id: string
  displayName: string
  category: SkillFieldCategory
  source: SourceCitation
  prerequisites: LifeModulePrerequisite[]
  componentSkills: Array<Extract<LifeModuleDestination, { type: 'skill' }>>
}

export interface SkillFieldCatalogValidationIssue {
  fieldId: string
  message: string
}
