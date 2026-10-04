import type { SkillAddress } from '../character/model'
import type { SourceCitation } from '../rules/model'
import type { AffiliationLanguageSelectorGroupId } from './affiliations'
import type { Stage3SchoolClassification } from './stage3Schooling'

export type LifeModuleStage = 0 | 1 | 2 | 3 | 4
export type LifeModuleKind = 'universal' | 'affiliation' | 'early-childhood' | 'late-childhood' | 'higher-education' | 'real-life'
export type AwardTargetType = 'attribute' | 'trait' | 'skill'

export type LifeModuleDestination =
  | { type: 'attribute'; attributeId: string }
  | { type: 'trait'; traitId: string; displayName: string; parameters?: Record<string, string | number | boolean> }
  | { type: 'skill'; address: SkillAddress; displayName: string }

export type LifeModuleAward =
  | { id: string; kind: 'fixed'; xp: number; destination: LifeModuleDestination }
  | { id: string; kind: 'affiliation-bound-skill'; xp: number; skillId: 'skill.language' | 'skill.protocol' | 'skill.streetwise'; displayName: string }
  | { id: string; kind: 'language-choice'; xp: number; choicesFrom: AffiliationLanguageSelectorGroupId; description: string }
  | { id: string; kind: 'affiliation-skill-choice'; xp: number; skillId: string; displayName: string; description: string }
  | { id: string; kind: 'any-skill-choice'; xp: number; skillId: string; displayName: string; count: number }
  | { id: string; kind: 'multi-skill-choice'; xp: number; skillId: string; displayName: string; count: number }
  | { id: string; kind: 'modeled-skill-choice'; xp: number; count: number; displayName: string; distinct: true; allowedDestinationKeys?: string[] }
  | { id: string; kind: 'flexible-xp'; xpPerGrant: number; count: number; allowedTargetTypes: AwardTargetType[]; allocationMode?: 'fixed-grants'; excludedTargetIds?: string[]; allowedTargetIds?: string[] }
  | { id: string; kind: 'flexible-xp'; totalXp: number; allowedTargetTypes: AwardTargetType[]; allocationMode: 'pool'; maxXpPerTarget?: Partial<Record<AwardTargetType, number>> }
  | { id: string; kind: 'choice-package'; description: string; options: LifeModuleDestination[][] }
  | { id: string; kind: 'conditional'; description: string; awards: LifeModuleAward[] }
  | { id: string; kind: 'field-grant'; description: string; fieldId: string; xpPerSkill: number; purchaseCostXp: number }

export type LifeModulePrerequisite =
  | { id: string; kind: 'affiliation'; affiliationId?: string; classification?: 'any' | 'non-clan'; description: string }
  | { id: string; kind: 'attribute-minimum'; attributeId: string; minimum: number; description: string }
  | { id: string; kind: 'trait'; traitId: string; description: string }
  | { id: string; kind: 'trait-minimum'; traitId: string; minimum: number; description: string }
  | { id: string; kind: 'trait-absent'; traitId: string; description: string }
  | { id: string; kind: 'trait-level-maximum'; traitId: string; maximumMagnitude: number; description: string }
  | { id: string; kind: 'skill-field'; fieldIds: string[]; description: string }
  | { id: string; kind: 'module-history'; moduleIds: string[]; description: string }
  | { id: string; kind: 'residence'; location: string; description: string }
  | { id: string; kind: 'any-of'; options: Array<Exclude<LifeModulePrerequisite, { kind: 'any-of' }>>; description: string }
  | { id: string; kind: 'path'; description: string }

export interface LifeModuleDefinition {
  id: string
  displayName: string
  stage: LifeModuleStage
  kind: LifeModuleKind
  stage3School?: Stage3SchoolClassification
  source: SourceCitation
  costXp: number
  chronologyYears?: number
  repeatPolicy?: {
    sameModuleRepeat: 'allowed' | 'deferred'
    repeatCost: 'full-module-cost'
    repeatAwards: {
      skills: 'repeat'
      flexibleXp: 'repeat'
      attributes: 'first-occurrence-only'
      traits: 'first-occurrence-only'
    }
  }
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
    referenceOnlyOffers?: Array<{
      displayName: string
      category: 'basic' | 'advanced' | 'special'
      chronologyYears: number
      reason: string
    }>
  }
  conditionalPriorModuleAwards?: {
    absentModuleIds: string[]
    description: string
    awards: LifeModuleAward[]
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
