import type { GmException, RulesSnapshot, SourceCitation } from '../rules/model'

export type CreationMethod = 'archetype' | 'point-buy' | 'life-modules'
export type CharacterStatus = 'draft' | 'ready-for-final-validation' | 'finalized'
export type ProvenanceKind =
  | 'published'
  | 'derived'
  | 'player-choice'
  | 'gm-override'
  | 'imported'

export interface ProvenanceRecord {
  id: string
  kind: ProvenanceKind
  description: string
  source?: SourceCitation
}

export interface XpAward {
  id: string
  xp: number
  provenanceId: string
}

export interface AttributeLedgerEntry {
  attributeId: string
  accumulatedXp: number
  purchasedLevel: number | null
  phenotypeModifier: number
  sourceAwards: XpAward[]
}

export interface TraitLedgerEntry {
  traitId: string
  displayName?: string
  accumulatedXp: number
  attainedTp: number | null
  active: boolean
  identityId?: string
  parameters: Record<string, string | number | boolean>
  sourceAwards: XpAward[]
}

export interface SkillAddress {
  skillId: string
  parameter?: {
    kind: string
    value: string
  }
}

export interface SkillLedgerEntry {
  address: SkillAddress
  displayName?: string
  accumulatedXp: number
  level: number | null
  specialty?: string
  notes?: string[]
  sourceAwards: XpAward[]
}

export interface Identity {
  id: string
  name: string
  kind: 'primary' | 'alternate'
}

export interface AffiliationHistoryEntry {
  affiliationId: string
  role: 'birth' | 'final' | 'historical'
  effectiveDate?: string
  provenanceId: string
}

export type EquipmentOwnership = 'Owned' | 'Issued'

export interface EquipmentItem {
  id: string
  catalogItemId?: string
  displayName: string
  quantity: number
  ownership: EquipmentOwnership
  entryKind?: 'published-package' | 'manual' | 'catalog'
  costPerItemCBills?: number
  totalCostCBills?: number
  equipmentRating?: {
    tech: EquipmentRatingCode | null
    availability: EquipmentRatingCode | null
    legality: EquipmentRatingCode | null
  }
  catalogSnapshot?: EquipmentCatalogSnapshot
  affiliationCode?: string
  personalProperty?: boolean
  issuerOrEmployer?: string
  reviewState?: 'recorded' | 'gm-review'
  publishedOwnershipLabel?: string
  publishedCostCBills?: number
  publishedAdditionalCostCBills?: number
  publishedWeightKg?: number
  rulesPages?: number[]
  source?: SourceCitation
  notes?: string[]
  location?: string
  carriedNote?: string
  carried: boolean | null
  provenanceId: string
}

export type EquipmentRatingCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export type EquipmentCatalogSourceStatus = 'audited-core' | 'example-backed'

export interface EquipmentCatalogSnapshot {
  categoryPath: string[]
  sourceKey: string
  sourceStatus: EquipmentCatalogSourceStatus
  rawEquipmentRating?: string
  rawAvailabilityCodes?: string[]
  normalizedEquipmentRating: {
    tech: EquipmentRatingCode | null
    availability: EquipmentRatingCode | null
    legality: EquipmentRatingCode | null
  }
  metadata: Record<string, string | number | boolean>
}

export type EquipmentAffiliationCategory = 'inner-sphere' | 'periphery' | 'clan'

export interface EquipmentAccessProfile {
  enabled: boolean
  affiliationCategory: EquipmentAffiliationCategory
  nativeAffiliationCode: string
}

export interface PersonalDescription {
  physicalDescription: string
  backgroundNotes: string
  homeworld: string
  heightCm?: number
  weightKg?: number
  hairColor?: string
  eyeColor?: string
}

export interface FinalTouchesState {
  version: 1
  enteredAt: string
  startingCBillSource: 'wealth-trait'
  startingCBillTotal: number
  spentCBillTotal: number
  remainingCBillTotal: number
  wealthTpUsed: number
  equippedTpUsed: number
  maxTechRating: EquipmentRatingCode
  maxAvailabilityRating: EquipmentRatingCode
  maxLegalityRating: EquipmentRatingCode
  issuedGearEnabled: boolean
  equipmentAccessProfile?: EquipmentAccessProfile
  equipmentReviewState: 'equipment-draft' | 'ready-for-equipment-review'
  provenanceId: string
}

export type VehicleOwnership = 'Assigned' | 'Owned'

export interface VehicleEntry {
  id: string
  catalogVehicleId?: string
  vehicleLevelTraitId: string
  identityId: string
  ownership: VehicleOwnership
  customVehicleTraitId?: string
  provenanceId: string
}

export interface CreationXpState {
  starting: number
  remaining: number
  allocated: number
}

export interface LifeModuleXpPool {
  starting: number
  spent: number
  remaining: number
}

export type LifeModulePhase =
  | 'stage-0-universal'
  | 'stage-0-affiliation'
  | 'stage-1-selection'
  | 'stage-1-resolution'
  | 'stage-1-prerequisite-review'
  | 'alpha-partial-stop'
  | 'stage-2-selection'
  | 'stage-2-resolution'
  | 'stage-2-prerequisite-review'
  | 'alpha-stage-2-stop'
  | 'stage-3-selection'
  | 'stage-3-resolution'
  | 'stage-3-prerequisite-review'
  | 'alpha-stage-3-stop'
  | 'stage-4-selection'
  | 'stage-4-resolution'
  | 'stage-4-prerequisite-review'
  | 'alpha-stage-4-stop'
  | 'alpha-final-review'
  | 'ready-for-final-touches'

export interface ResolvedLifeModuleDestination {
  type: 'attribute' | 'trait' | 'skill'
  targetId: string
  displayName: string
  parameter?: {
    kind: string
    value: string
  }
  parameters?: Record<string, string | number | boolean>
}

export interface PendingLifeModuleAward {
  id: string
  moduleId: string
  awardId: string
  kind: 'language-choice' | 'affiliation-skill-choice' | 'any-skill-choice' | 'multi-skill-choice' | 'flexible-xp'
  description: string
  xpPerGrant: number
  remainingGrants: number
  allocationMode?: 'fixed-grants' | 'pool'
  remainingXp?: number
  maxXpPerTarget?: Partial<Record<'attribute' | 'trait' | 'skill', number>>
  allowedTargetTypes: Array<'attribute' | 'trait' | 'skill'>
  choiceSource?: 'affiliation-languages' | 'capellan-secondary' | 'federated-suns-languages'
  requiredSkillId?: string
  source: SourceCitation
}

export interface ResolvedLifeModuleAward {
  id: string
  moduleId: string
  awardId: string
  kind: PendingLifeModuleAward['kind']
  xp: number
  destination: ResolvedLifeModuleDestination
  provenanceId: string
  resolvedAt: string
  source: SourceCitation
}

export interface LifeModuleChoiceGrantRequirement {
  moduleId: string
  awardId: string
  requiredGrants: number
  requiredXp?: number
  allocationMode?: 'fixed-grants' | 'pool'
}

export interface LifeModulePrerequisiteIssue {
  id: string
  moduleId: string
  prerequisiteId: string
  description: string
  status: 'outstanding' | 'satisfied' | 'gm-override'
  finalValidationRequired: boolean
}

export interface SkillFieldGrantRecord {
  id: string
  schoolModuleId: string
  fieldId: string
  displayName: string
  category: 'basic' | 'advanced' | 'special'
  purchaseCostXp: number
  xpPerSkill: number
  chronologyYears: number
  selectedAt: string
  provenanceId: string
  source: SourceCitation
}

export interface LifeModuleFinalAllocationRecord {
  id: string
  destination: ResolvedLifeModuleDestination
  xp: number
  allocatedAt: string
  provenanceId: string
}

export interface LifeModuleOptimizationRecord {
  id: string
  destination: ResolvedLifeModuleDestination
  beforeXp: number
  afterXp: number
  returnedXp: number
  reason: 'excess-xp' | 'modeled-maximum' | 'negative-trait-threshold' | 'negative-trait-positive-xp'
  appliedAt: string
  provenanceId: string
}

export interface LifeModuleFinalReviewState {
  version: 1
  enteredAt: string
  readiness: 'review-required' | 'ready-for-final-touches'
  allocationPool: {
    starting: number
    allocated: number
    optimizationReturned: number
    remaining: number
  }
  allocations: LifeModuleFinalAllocationRecord[]
  optimizations: LifeModuleOptimizationRecord[]
  negativeTraitXpPurchase: {
    capXp: number
    purchasedXp: number
    uiStatus: 'deferred'
  }
}

export interface LifeModuleCreationState {
  awardResolutionVersion: 0 | 1
  source: SourceCitation
  startingAllotment: 'standard' | 'gm-adjusted'
  phase: LifeModulePhase
  currentStage: 0 | 1 | 2 | 3 | 4
  moduleXp: LifeModuleXpPool
  selectedModuleIds: string[]
  selectedSkillFields: SkillFieldGrantRecord[]
  affiliationLanguage?: string
  pendingAwards: PendingLifeModuleAward[]
  resolvedAwards: ResolvedLifeModuleAward[]
  choiceGrantRequirements: LifeModuleChoiceGrantRequirement[]
  prerequisiteIssues: LifeModulePrerequisiteIssue[]
  stopState: 'not-eligible' | 'alpha-partial-stop' | 'alpha-stage-2-stop' | 'alpha-stage-3-stop' | 'alpha-stage-4-stop'
  finalReview?: LifeModuleFinalReviewState
  limitations: string[]
}

export interface CharacterXpState {
  creation: CreationXpState
  earnedGameplayUnspent: number
}

export interface CreationState {
  method: CreationMethod
  status: CharacterStatus
  rulesSnapshot: RulesSnapshot
  resolvedChoiceIds: string[]
  gmExceptions: GmException[]
  archetype?: {
    archetypeId: string
    displayName: string
    source: SourceCitation
    notes: Array<{ code: string; message: string }>
  }
  pointBuy?: {
    source: SourceCitation
    costTableSource: SourceCitation
    rulesProvenanceId: string
    costProvenanceId: string
    startingAllotment: 'standard' | 'gm-adjusted'
    limitations: string[]
  }
  lifeModules?: LifeModuleCreationState
  finalTouches?: FinalTouchesState
}

export interface LifeModuleHistoryEntry {
  moduleId: string
  displayName: string
  stage: 0 | 1 | 2 | 3 | 4
  costXp: number
  baseCostXp?: number
  fieldCostXp?: number
  chronologyYears?: number
  repeatPolicy?: {
    sameModuleRepeat: 'deferred'
    repeatCost: 'full-module-cost'
    repeatAwards: {
      skills: 'repeat'
      flexibleXp: 'repeat'
      attributes: 'first-occurrence-only'
      traits: 'first-occurrence-only'
    }
  }
  selectedAt: string
  provenanceIds: string[]
  source: SourceCitation
  notes: string[]
}

export interface PlayStateFoundation {
  schemaVersion: 1
  initializedAt: string
}

export interface CharacterDefinition {
  id: string
  displayName: string
  createdAt: string
  updatedAt: string
  creation: CreationState
  xp: CharacterXpState
  attributes: AttributeLedgerEntry[]
  traits: TraitLedgerEntry[]
  skills: SkillLedgerEntry[]
  identities: {
    primaryIdentityId: string
    entries: Identity[]
  }
  affiliations: AffiliationHistoryEntry[]
  phenotypeId: string
  lifeModuleHistory: LifeModuleHistoryEntry[]
  chronology: Array<{ date: string; eventId: string; provenanceId: string }>
  inventory: EquipmentItem[]
  cBills: number
  vehicles: VehicleEntry[]
  provenance: ProvenanceRecord[]
  personalDescription?: PersonalDescription
  playState?: PlayStateFoundation
}
