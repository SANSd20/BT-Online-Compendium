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
  accumulatedXp: number
  level: number | null
  specialty?: string
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
  catalogItemId: string
  ownership: EquipmentOwnership
  location?: string
  carried: boolean
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
}

export interface LifeModuleHistoryEntry {
  moduleId: string
  stage: number
  selectedAt: string
  provenanceIds: string[]
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
  playState?: PlayStateFoundation
}

