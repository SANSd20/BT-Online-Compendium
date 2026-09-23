import type { EquipmentOwnership, SkillAddress } from '../character/model'
import type { SourceCitation } from '../rules/model'

export interface ArchetypeAttribute {
  attributeId: string
  purchasedLevel: number
  phenotypeModifier: number
  xp: number
}

export interface ArchetypeTrait {
  traitId: string
  displayName: string
  tp: number
  xp: number
  identityBound?: boolean
  parameters?: Record<string, string | number | boolean>
}

export interface ArchetypeSkill {
  address: SkillAddress
  displayName: string
  level: number
  xp: number
  specialty?: string
  notes?: string[]
}

export interface ArchetypeEquipment {
  catalogItemId: string
  displayName: string
  quantity: number
  ownership: EquipmentOwnership
  publishedOwnershipLabel?: string
  costCBills: number
  additionalCostCBills?: number
  publishedWeightKg: number
  rulesPages: number[]
  notes?: string[]
}

export interface ArchetypeNote {
  code: string
  message: string
}

export interface ArchetypeDefinition {
  id: string
  displayName: string
  source: SourceCitation
  publishedXpTotal: number
  phenotypeId: string
  attributes: ArchetypeAttribute[]
  traits: ArchetypeTrait[]
  skills: ArchetypeSkill[]
  equipment: ArchetypeEquipment[]
  cBills: number
  notes: ArchetypeNote[]
}

export interface ArchetypeCatalogIssue {
  path: string
  message: string
}
