import type {
  CharacterDefinition,
  ResolvedLifeModuleDestination,
  SkillAddress,
  XpAward,
} from '../domain/character/model'
import {
  deriveAttributeLevel,
  deriveSkillLevel,
  deriveTraitPoints,
  deriveTraitPointsForTrait,
  FINAL_REVIEW_RULES_SOURCE,
  getFinalReviewBlockers,
  getModeledOpposedTraitConflicts,
  getOptimizationPreview,
  negativeTraitXpPurchaseCap,
  characterSkillProgression,
  skillXpCosts,
  traitModeledRange,
  type OptimizationOpportunity,
} from '../domain/lifeModules/finalReview'
import { POINT_BUY_ATTRIBUTE_MAXIMUMS } from '../domain/pointBuy/catalog'
import { attributeLegality } from '../domain/character/attributeLegality'
import { reevaluateLifeModulePrerequisites } from './lifeModuleEngine'

export function enterLifeModuleFinalReview(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  const hasStage4 = next.lifeModuleHistory.some((entry) => entry.stage === 4)
  const resolvedStage4 = state.pendingAwards.length === 0 && (state.phase === 'alpha-stage-4-stop' || state.phase === 'stage-4-prerequisite-review')
  if (!hasStage4 || !resolvedStage4) {
    throw new Error('Final review requires at least one Stage 4 module with every pending module award resolved.')
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
    opposedTraitResolutions: [],
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
  assertFinalAllocationWithinModeledMaximum(next, normalized, target.accumulatedXp + xp)
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

/** Remove one preview allocation and return its XP to the same finalization pool. */
export function removeFinalReviewAllocation(character: CharacterDefinition, allocationId: string): CharacterDefinition {
  const next = structuredClone(character)
  const review = requireFinalReview(next)
  const index = review.allocations.findIndex((entry) => entry.id === allocationId)
  if (index < 0) throw new Error(`Unknown final allocation: ${allocationId}`)
  const allocation = review.allocations[index]
  const target = findLedgerTarget(next, allocation.destination)
  if (target.accumulatedXp < allocation.xp) throw new Error('Final allocation ledger is inconsistent.')
  const provenanceId = makeId('final-allocation-reversal-provenance')
  next.provenance.push({ id: provenanceId, kind: 'derived', description: `Removed Life Module final allocation: ${allocation.destination.displayName} -${allocation.xp} XP`, source: { ...FINAL_REVIEW_RULES_SOURCE } })
  applyLedgerDelta(target, -allocation.xp, provenanceId)
  review.allocations.splice(index, 1)
  review.allocationPool.allocated -= allocation.xp
  review.allocationPool.remaining += allocation.xp
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.xp.creation.remaining = review.allocationPool.remaining
  next.updatedAt = new Date().toISOString()
  return refreshFinalReview(next)
}

export function purchaseAdditionalNegativeTraitXp(character: CharacterDefinition, traitId: string, targetNegativeTp: number, parameters: Record<string, string | number | boolean> = {}): CharacterDefinition {
  const next = structuredClone(character)
  const review = requireFinalReview(next)
  if (previewLifeModuleOptimization(next).length > 0) throw new Error('Additional Trait XP is available only after Optimization is complete.')
  if (getModeledOpposedTraitConflicts(next).length > 0) throw new Error('Resolve opposed Traits before purchasing Additional XP.')
  if (!Number.isInteger(targetNegativeTp) || targetNegativeTp >= 0) throw new RangeError('Additional XP requires a fully attained negative Trait level.')
  const definition = traitModeledRange(traitId)
  if (!definition) throw new Error('This Trait is not represented by the governed negative-Trait catalog.')
  if (definition.maximum >= 0 || targetNegativeTp < definition.minimum) throw new RangeError('Additional XP exceeds the legal negative Trait maximum.')
  const matches = next.traits.filter((entry) => entry.traitId === traitId && JSON.stringify(entry.parameters) === JSON.stringify(parameters))
  if (matches.length > 1) throw new Error('Additional XP requires one concrete Trait instance.')
  const existing = matches[0]
  const beforeXp = existing?.accumulatedXp ?? 0
  const afterXp = targetNegativeTp * 100
  if (afterXp >= beforeXp || afterXp % 100 !== 0) throw new RangeError('Additional XP requires an enhancement to a fully attained negative Trait level.')
  const gainedXp = beforeXp - afterXp
  const used = (review.additionalTraitXp ?? []).reduce((total, entry) => total + entry.gainedXp, 0)
  if (used + gainedXp > review.negativeTraitXpPurchase.capXp) throw new RangeError('Additional XP exceeds the aggregate 10% cap.')
  const appliedAt = new Date().toISOString()
  const provenanceId = makeId('additional-trait-xp-provenance')
  const displayName = existing?.displayName ?? traitId
  next.provenance.push({ id: provenanceId, kind: 'player-choice', description: `Optional Additional XP: ${displayName} ${beforeXp} → ${afterXp} XP; gained ${gainedXp} XP`, source: { ...FINAL_REVIEW_RULES_SOURCE } })
  if (existing) {
    applyLedgerDelta(existing, afterXp - beforeXp, provenanceId)
    existing.attainedTp = deriveTraitPoints(afterXp)
    existing.active = existing.attainedTp !== null
  } else {
    next.traits.push({ traitId, displayName, accumulatedXp: afterXp, attainedTp: deriveTraitPoints(afterXp), active: true, parameters: { ...parameters }, sourceAwards: [{ id: makeId('additional-trait-xp-award'), xp: afterXp, provenanceId }] })
  }
  review.additionalTraitXp ??= []
  review.additionalTraitXp.push({ id: makeId('additional-trait-xp'), traitId, displayName, parameters: { ...parameters }, beforeXp, afterXp, gainedXp, appliedAt, provenanceId })
  review.negativeTraitXpPurchase.purchasedXp = used + gainedXp
  review.negativeTraitXpPurchase.uiStatus = 'deferred'
  review.allocationPool.remaining += gainedXp
  next.xp.creation.remaining = review.allocationPool.remaining
  next.updatedAt = appliedAt
  return refreshFinalReview(next)
}

export function removeAdditionalNegativeTraitXp(character: CharacterDefinition, recordId: string): CharacterDefinition {
  const next = structuredClone(character)
  const review = requireFinalReview(next)
  const records = review.additionalTraitXp ?? []
  const index = records.findIndex((entry) => entry.id === recordId)
  if (index < 0) throw new Error(`Unknown Additional XP transaction: ${recordId}`)
  const record = records[index]
  const trait = next.traits.find((entry) => entry.traitId === record.traitId && JSON.stringify(entry.parameters) === JSON.stringify(record.parameters))
  if (!trait) throw new Error('Additional XP Trait ledger is missing.')
  const provenanceId = makeId('additional-trait-xp-reversal-provenance')
  next.provenance.push({ id: provenanceId, kind: 'derived', description: `Removed optional Additional XP: ${record.displayName} -${record.gainedXp} XP`, source: { ...FINAL_REVIEW_RULES_SOURCE } })
  if (record.beforeXp === 0) next.traits = next.traits.filter((entry) => entry !== trait)
  else {
    applyLedgerDelta(trait, record.beforeXp - record.afterXp, provenanceId)
    trait.attainedTp = deriveTraitPoints(record.beforeXp)
    trait.active = trait.attainedTp !== null
  }
  records.splice(index, 1)
  review.negativeTraitXpPurchase.purchasedXp -= record.gainedXp
  review.allocationPool.remaining -= record.gainedXp
  next.xp.creation.remaining = review.allocationPool.remaining
  next.updatedAt = new Date().toISOString()
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

export function resolveLifeModuleOpposedTraits(character: CharacterDefinition, conflictId: string): CharacterDefinition {
  const next = structuredClone(character)
  const review = requireFinalReview(next)
  const conflict = getModeledOpposedTraitConflicts(next).find((entry) => entry.id === conflictId)
  if (!conflict) throw new Error(`Unknown or stale opposed-Trait conflict: ${conflictId}`)
  if (conflict.positiveTraitId === 'skill.language-4') {
    const illiterate = next.traits.find((entry) => entry.traitId === conflict.negativeTraitId)
    if (!illiterate) throw new Error('Illiterate Trait is missing.')
    const before = illiterate.accumulatedXp
    recordTraitDelta(illiterate, -before, next, `Illiterate erased by Language Level +4`, 'opposed-trait')
    addOpposedResolution(review, next, conflict, 0, before, 0)
    return refreshFinalReview(next)
  }
  const positive = next.traits.find((entry) => entry.traitId === conflict.positiveTraitId && entry.accumulatedXp > 0)
  const negative = next.traits.find((entry) => entry.traitId === conflict.negativeTraitId && entry.accumulatedXp < 0)
  if (!positive || !negative) throw new Error('Opposed Trait ledgers are missing.')
  const positiveBefore = positive.accumulatedXp
  const negativeBefore = negative.accumulatedXp
  const remaining = positiveBefore + negativeBefore
  const resolvedAt = new Date().toISOString()
  const provenanceId = makeId('opposed-trait-provenance')
  next.provenance.push({ id: provenanceId, kind: 'derived', description: `Opposed Traits resolved: ${positive.displayName ?? positive.traitId} / ${negative.displayName ?? negative.traitId}`, source: { ...FINAL_REVIEW_RULES_SOURCE } })
  applyLedgerDelta(positive, (remaining > 0 ? remaining : 0) - positiveBefore, provenanceId)
  applyLedgerDelta(negative, (remaining < 0 ? remaining : 0) - negativeBefore, provenanceId)
  review.opposedTraitResolutions ??= []
  review.opposedTraitResolutions.push({ id: makeId('opposed-trait'), positiveTraitId: positive.traitId, negativeTraitId: negative.traitId, positiveBeforeXp: positiveBefore, negativeBeforeXp: negativeBefore, remainingXp: remaining, resolvedAt, provenanceId })
  next.updatedAt = resolvedAt
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

function assertFinalAllocationWithinModeledMaximum(character: CharacterDefinition, destination: ResolvedLifeModuleDestination, proposedXp: number): void {
  if (destination.type === 'attribute') {
    const legality = attributeLegality(character, destination.targetId)
    if (proposedXp > legality.effectiveMaximum * 100) throw new RangeError(`Final allocation exceeds the modeled Attribute maximum of ${legality.effectiveMaximum}.`)
    return
  }
  if (destination.type === 'trait') {
    const trait = character.traits.find((entry) => entry.traitId === destination.targetId && JSON.stringify(entry.parameters) === JSON.stringify(destination.parameters ?? {}))
    if (trait && proposedXp < trait.accumulatedXp) throw new RangeError('Positive final allocation cannot reduce a Trait.')
    const range = traitModeledRange(destination.targetId)
    if (range && proposedXp > Math.max(0, range.maximum) * 100) throw new RangeError(`Final allocation exceeds the modeled Trait maximum of ${range.maximum}.`)
    return
  }
  const progression = characterSkillProgression(character)
  const maximumXp = skillXpCosts(progression).at(-1)!
  if (proposedXp > maximumXp) throw new RangeError('Final allocation exceeds Skill Level +10 for the character’s learner progression.')
}

function recalculateDerivedLevels(character: CharacterDefinition): void {
  character.attributes.forEach((entry) => { entry.purchasedLevel = deriveAttributeLevel(entry.accumulatedXp) })
  character.traits.forEach((entry) => {
    entry.attainedTp = deriveTraitPointsForTrait(entry.traitId, entry.accumulatedXp)
    entry.active = entry.attainedTp !== null
  })
  const progression = characterSkillProgression(character)
  character.skills.forEach((entry) => { entry.level = deriveSkillLevel(entry.accumulatedXp, progression) })
}

function recordTraitDelta(target: { accumulatedXp: number; sourceAwards: XpAward[] }, delta: number, character: CharacterDefinition, description: string, prefix: string): void {
  const provenanceId = makeId(`${prefix}-provenance`)
  character.provenance.push({ id: provenanceId, kind: 'derived', description, source: { ...FINAL_REVIEW_RULES_SOURCE } })
  applyLedgerDelta(target, delta, provenanceId)
}

function addOpposedResolution(review: ReturnType<typeof requireFinalReview>, character: CharacterDefinition, conflict: { positiveTraitId: string; negativeTraitId: string }, positiveBeforeXp: number, negativeBeforeXp: number, remainingXp: number): void {
  const resolvedAt = new Date().toISOString()
  const provenance = character.provenance.at(-1)!
  review.opposedTraitResolutions ??= []
  review.opposedTraitResolutions.push({ id: makeId('opposed-trait'), positiveTraitId: conflict.positiveTraitId, negativeTraitId: conflict.negativeTraitId, positiveBeforeXp, negativeBeforeXp, remainingXp, resolvedAt, provenanceId: provenance.id })
  character.updatedAt = resolvedAt
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
