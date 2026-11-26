import type { CharacterDefinition, LifeModuleCreationState } from './model'
import type { SourceCitation } from '../rules/model'

export type DeferredEligibilityStatus = 'eligible' | 'ineligible' | 'pending'

export interface DeferredEligibilityRule {
  kind: 'numeric-cutoff'
  field: string
  maximum: number
}

export interface DeferredEligibilityRecord {
  id: string
  stage: 0 | 1 | 2 | 3 | 4
  subjectId: string
  requirementId: string
  dependencyKeys: string[]
  rule: DeferredEligibilityRule
  status: DeferredEligibilityStatus
  deferredResolutionAllowed: boolean
  requiredInformation: string
  source: SourceCitation
}

export function evaluateDeferredEligibility(record: DeferredEligibilityRecord, values: Record<string, number | undefined>): DeferredEligibilityStatus {
  const value = values[record.rule.field]
  if (value === undefined) return 'pending'
  return value <= record.rule.maximum ? 'eligible' : 'ineligible'
}

export function setDeferredEligibility(character: CharacterDefinition, record: DeferredEligibilityRecord): CharacterDefinition {
  const next = structuredClone(character)
  const state = next.creation.lifeModules
  if (!state) throw new Error('Deferred eligibility requires a Life Module character.')
  state.deferredEligibility = [...(state.deferredEligibility ?? []).filter((entry) => entry.id !== record.id), { ...record }]
  return next
}

export function reevaluateDeferredEligibility(character: CharacterDefinition, id: string, values: Record<string, number | undefined>): CharacterDefinition {
  const next = structuredClone(character)
  const state = next.creation.lifeModules
  const record = state?.deferredEligibility?.find((entry) => entry.id === id)
  if (!record) throw new Error(`Unknown deferred eligibility record: ${id}`)
  record.status = evaluateDeferredEligibility(record, values)
  return next
}

export function hasBlockingDeferredEligibility(state: LifeModuleCreationState): boolean {
  return (state.deferredEligibility ?? []).some((entry) => entry.status !== 'eligible')
}

export function hasIneligibleDeferredEligibility(state: LifeModuleCreationState): boolean {
  return (state.deferredEligibility ?? []).some((entry) => entry.status === 'ineligible')
}
