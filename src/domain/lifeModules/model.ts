import type { SkillAddress } from '../character/model'
import type { SourceCitation } from '../rules/model'

export type LifeModuleStage = 0 | 1 | 2 | 3 | 4
export type LifeModuleKind = 'universal' | 'affiliation' | 'early-childhood' | 'late-childhood' | 'higher-education' | 'real-life'
export type AwardTargetType = 'attribute' | 'trait' | 'skill'

export type LifeModuleDestination =
  | { type: 'attribute'; attributeId: string }
  | { type: 'trait'; traitId: string; displayName: string; parameters?: Record<string, string | number | boolean> }
  | { type: 'skill'; address: SkillAddress; displayName: string }

export type LifeModuleAward =
  | { id: string; kind: 'fixed'; xp: number; destination: LifeModuleDestination }
  | { id: string; kind: 'language-choice'; xp: number; choicesFrom: 'affiliation-languages' | 'capellan-secondary' | 'federated-suns-languages'; description: string }
  | { id: string; kind: 'affiliation-skill-choice'; xp: number; skillId: string; displayName: string; description: string }
  | { id: string; kind: 'any-skill-choice'; xp: number; skillId: string; displayName: string; count: number }
  | { id: string; kind: 'multi-skill-choice'; xp: number; skillId: string; displayName: string; count: number }
  | { id: string; kind: 'flexible-xp'; xpPerGrant: number; count: number; allowedTargetTypes: AwardTargetType[]; allocationMode?: 'fixed-grants' }
  | { id: string; kind: 'flexible-xp'; totalXp: number; allowedTargetTypes: AwardTargetType[]; allocationMode: 'pool'; maxXpPerTarget?: Partial<Record<AwardTargetType, number>> }
  | { id: string; kind: 'choice-package'; description: string; options: LifeModuleDestination[][] }
  | { id: string; kind: 'conditional'; description: string; awards: LifeModuleAward[] }
  | { id: string; kind: 'field-grant'; description: string; fieldId: string; xpPerSkill: number; purchaseCostXp: number }

export type LifeModulePrerequisite =
  | { id: string; kind: 'affiliation'; affiliationId?: string; classification?: 'any' | 'non-clan'; description: string }
  | { id: string; kind: 'attribute-minimum'; attributeId: string; minimum: number; description: string }
  | { id: string; kind: 'trait'; traitId: string; description: string }
  | { id: string; kind: 'trait-absent'; traitId: string; description: string }
  | { id: string; kind: 'skill-field'; fieldIds: string[]; description: string }
  | { id: string; kind: 'path'; description: string }

export interface LifeModuleDefinition {
  id: string
  displayName: string
  stage: LifeModuleStage
  kind: LifeModuleKind
  source: SourceCitation
  costXp: number
  chronologyYears?: number
  primaryLanguage?: string
  secondaryLanguages?: string[]
  skillFieldSelection?: {
    offers: Array<{
      fieldId: string
      category: 'basic' | 'advanced' | 'special'
      costXpPerSkill: number
      awardedXpPerSkill: number
      chronologyYears: number
    }>
    exactlyBasic: number
    minimumAdvanced: number
    maximumTotal: number
  }
  prerequisites: LifeModulePrerequisite[]
  awards: LifeModuleAward[]
  notes: string[]
  deferredRules: string[]
}

export interface LifeModuleCatalogValidationIssue {
  moduleId: string
  message: string
}
