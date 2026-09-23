import type {
  CharacterDefinition,
  ResolvedLifeModuleDestination,
  SkillAddress,
  XpAward,
} from '../domain/character/model'
import {
  deriveAttributeLevel,
  deriveStandardSkillLevel,
  deriveTraitPoints,
  FINAL_REVIEW_RULES_SOURCE,
  getFinalReviewBlockers,
  getModeledOpposedTraitConflicts,
  getOptimizationPreview,
  negativeTraitXpPurchaseCap,
  type OptimizationOpportunity,
} from '../domain/lifeModules/finalReview'
import { POINT_BUY_ATTRIBUTE_MAXIMUMS } from '../domain/pointBuy/catalog'
import { reevaluateLifeModulePrerequisites } from './lifeModuleEngine'

export function enterLifeModuleFinalReview(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  const hasStage4 = next.lifeModuleHistory.filter((entry) => entry.stage === 4).length === 1
  const resolvedStage4 = state.pendingAwards.length === 0 && (state.phase === 'alpha-stage-4-stop' || state.phase === 'stage-4-prerequisite-review')
  if (!hasStage4 || !resolvedStage4) {
    throw new Error('Final review requires one Stage 4 module with every pending module award resolved.')
  }
  if (state.finalReview) throw new Error('Life Module final review is already initialized.')
  const enteredAt = new Date().toISOString()
  state.finalReview = {
    version: 1,
    enteredAt,
    readiness: 'review-required',
    allocationPool: {
      starting: state.moduleXp.remaining,
      allocated: 0,
      optimizationReturned: 0,
      remaining: state.moduleXp.remaining,
    },
    allocations: [],
    optimizations: [],
    negativeTraitXpPurchase: {
      capXp: negativeTraitXpPurchaseCap(state.moduleXp.starting),
      purchasedXp: 0,
      uiStatus: 'deferred',
    },
  }
  state.stopState = 'not-eligible'
  next.xp.creation.remaining = state.finalReview.allocationPool.remaining
  next.updatedAt = enteredAt
  return refreshFinalReview(next)
}

export function allocateFinalReviewXp(
  character: CharacterDefinition,
  destination: ResolvedLifeModuleDestination,
  xp: number,
): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireFinalReview(next)
  if (!Number.isInteger(xp) || xp <= 0) throw new RangeError('Final allocation requires a positive whole XP amount.')
  if (xp > state.allocationPool.remaining) throw new RangeError('Final allocation would overspend the remaining XP pool.')
  const normalized = normalizeDestination(destination)
  const target = findLedgerTarget(next, normalized)
  const allocatedAt = new Date().toISOString()
  const provenanceId = makeId('final-allocation-provenance')
  next.provenance.push({
    id: provenanceId,
    kind: 'player-choice',
    description: `Life Module final allocation: ${normalized.displayName} +${xp} XP`,
    source: { ...FINAL_REVIEW_RULES_SOURCE },
  })
  applyLedgerDelta(target, xp, provenanceId)
  state.allocations.push({ id: makeId('final-allocation'), destination: normalized, xp, allocatedAt, provenanceId })
  state.allocationPool.allocated += xp
  state.allocationPool.remaining -= xp
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.xp.creation.remaining = state.allocationPool.remaining
  next.updatedAt = allocatedAt
  return refreshFinalReview(next)
}

export function previewLifeModuleOptimization(character: CharacterDefinition): OptimizationOpportunity[] {
  requireFinalReview(character)
  return getOptimizationPreview(character)
}

export function applyLifeModuleOptimization(character: CharacterDefinition, opportunityId: string): CharacterDefinition {
  const next = structuredClone(character)
  const review = requireFinalReview(next)
  if (getModeledOpposedTraitConflicts(next).length > 0) {
    throw new Error('Modeled opposed Trait conflicts must be resolved explicitly before Optimization.')
  }
  const opportunity = getOptimizationPreview(next).find((entry) => entry.id === opportunityId)
  if (!opportunity) throw new Error(`Unknown or stale Optimization opportunity: ${opportunityId}`)
  const target = findLedgerTarget(next, opportunity.destination)
  if (target.accumulatedXp !== opportunity.beforeXp) throw new Error('Optimization preview is stale; refresh it before applying.')
  const appliedAt = new Date().toISOString()
  const provenanceId = makeId('optimization-provenance')
  next.provenance.push({
    id: provenanceId,
    kind: 'derived',
    description: `Life Module Optimization: ${opportunity.destination.displayName} ${opportunity.beforeXp} → ${opportunity.afterXp} XP`,
    source: { ...FINAL_REVIEW_RULES_SOURCE },
  })
  applyLedgerDelta(target, opportunity.afterXp - opportunity.beforeXp, provenanceId)
  review.optimizations.push({
    id: makeId('optimization'),
    destination: structuredClone(opportunity.destination),
    beforeXp: opportunity.beforeXp,
    afterXp: opportunity.afterXp,
    returnedXp: opportunity.returnedXp,
    reason: opportunity.reason,
    appliedAt,
    provenanceId,
  })
  review.allocationPool.optimizationReturned += opportunity.returnedXp
  review.allocationPool.remaining += opportunity.returnedXp
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.xp.creation.remaining = review.allocationPool.remaining
  next.updatedAt = appliedAt
  return refreshFinalReview(next)
}

export function refreshFinalReview(character: CharacterDefinition): CharacterDefinition {
  const state = requireLifeModules(character)
  const review = state.finalReview
  if (!review) return character
  recalculateDerivedLevels(character)
  reevaluateLifeModulePrerequisites(character)
  const ready = getFinalReviewBlockers(character).length === 0
  review.readiness = ready ? 'ready-for-final-touches' : 'review-required'
  state.phase = ready ? 'ready-for-final-touches' : 'alpha-final-review'
  state.stopState = 'not-eligible'
  return character
}

function findLedgerTarget(character: CharacterDefinition, destination: ResolvedLifeModuleDestination) {
  if (destination.type === 'attribute') {
    if (!(destination.targetId in POINT_BUY_ATTRIBUTE_MAXIMUMS)) throw new Error(`Unknown Attribute final-allocation target: ${destination.targetId}`)
    const entry = character.attributes.find((item) => item.attributeId === destination.targetId)
    if (!entry) throw new Error(`Character is missing Attribute final-allocation target: ${destination.targetId}`)
    return entry
  }
  if (destination.type === 'trait') {
    const matches = character.traits.filter((item) => item.traitId === destination.targetId && JSON.stringify(item.parameters) === JSON.stringify(destination.parameters ?? {}))
    if (matches.length !== 1) throw new Error('Final allocation requires one existing, concrete modeled Trait instance.')
    return matches[0]
  }
  const address: SkillAddress = { skillId: destination.targetId, ...(destination.parameter ? { parameter: { ...destination.parameter } } : {}) }
  const matches = character.skills.filter((item) => skillKey(item.address) === skillKey(address))
  if (matches.length !== 1) throw new Error('Final allocation requires one existing, concrete Skill or subskill instance.')
  return matches[0]
}

function applyLedgerDelta(target: { accumulatedXp: number; sourceAwards: XpAward[] }, delta: number, provenanceId: string): void {
  target.accumulatedXp += delta
  target.sourceAwards.push({ id: makeId('final-review-award'), xp: delta, provenanceId })
}

function recalculateDerivedLevels(character: CharacterDefinition): void {
  character.attributes.forEach((entry) => { entry.purchasedLevel = deriveAttributeLevel(entry.accumulatedXp) })
  character.traits.forEach((entry) => {
    entry.attainedTp = deriveTraitPoints(entry.accumulatedXp)
    entry.active = entry.attainedTp !== null
  })
  character.skills.forEach((entry) => { entry.level = deriveStandardSkillLevel(entry.accumulatedXp) })
}

function normalizeDestination(destination: ResolvedLifeModuleDestination): ResolvedLifeModuleDestination {
  const targetId = destination.targetId.trim()
  const displayName = destination.displayName.trim()
  const parameter = destination.parameter ? { kind: destination.parameter.kind.trim(), value: destination.parameter.value.trim() } : undefined
  if (!targetId || !displayName || (parameter && (!parameter.kind || !parameter.value))) throw new Error('Final-allocation destination must have a stable ID, display name, and complete parameter.')
  return { ...destination, targetId, displayName, ...(parameter ? { parameter } : {}) }
}

function requireLifeModules(character: CharacterDefinition) {
  if (character.creation.method !== 'life-modules' || !character.creation.lifeModules) throw new Error('Life Module final review is available only to Life Module characters.')
  return character.creation.lifeModules
}

function requireFinalReview(character: CharacterDefinition) {
  const state = requireLifeModules(character)
  if (!state.finalReview) throw new Error('Life Module final review has not been initialized.')
  return state.finalReview
}

function calculateLedgerXp(character: CharacterDefinition): number {
  return [...character.attributes, ...character.traits, ...character.skills].reduce((total, entry) => total + entry.accumulatedXp, 0)
}

function skillKey(address: SkillAddress): string {
  return `${address.skillId}/${address.parameter?.kind ?? ''}/${address.parameter?.value.toLowerCase() ?? ''}`
}

function makeId(prefix: string): string {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random()}`
}
