import type { CharacterDefinition, LifeModuleOptimizationRecord } from '../domain/character/model'
import {
  POINT_BUY_ATTRIBUTE_MAXIMUMS,
  getPointBuySkill,
  getPointBuyTrait,
  standardSkillXpCost,
} from '../domain/pointBuy/catalog'
import { calculateNegativeTraitXp, calculatePointBuyAllocatedXp } from '../domain/pointBuy/calculations'
import type { ValidationIssue, ValidationResult } from './model'
import { getLifeModule } from '../domain/lifeModules/catalog'
import type { LifeModuleAward, LifeModuleDefinition, LifeModulePrerequisite } from '../domain/lifeModules/model'
import { getSkillField, skillFieldCost } from '../domain/skillFields/catalog'
import {
  deriveAttributeLevel,
  deriveStandardSkillLevel,
  deriveTraitPoints,
  finalReviewDestinationKey,
  getFinalReviewBlockers,
  getModeledOpposedTraitConflicts,
  getOptimizationPreview,
  isModeledNegativeTrait,
  negativeTraitXpPurchaseCap,
  traitModeledRange,
} from '../domain/lifeModules/finalReview'

function issue(
  id: string,
  path: string,
  message: string,
  options: Partial<Pick<ValidationIssue, 'severity' | 'kind' | 'gmOverrideAllowed'>> = {},
): ValidationIssue {
  return {
    id,
    path,
    message,
    severity: options.severity ?? 'error',
    kind: options.kind ?? 'hard-requirement',
    gmOverrideAllowed: options.gmOverrideAllowed ?? false,
  }
}

export function validateCharacter(character: CharacterDefinition): ValidationResult {
  const issues: ValidationIssue[] = []

  if (!character.id.trim()) {
    issues.push(issue('character.id.required', 'id', 'Character ID is required.'))
  }
  if (!character.displayName.trim()) {
    issues.push(issue('character.name.required', 'displayName', 'Character name is required.'))
  }
  if (character.creation.rulesSnapshot.sources.length === 0) {
    issues.push(issue('rules.sources.required', 'creation.rulesSnapshot.sources', 'At least one rules source is required.'))
  }

  if (character.creation.method === 'archetype') {
    if (!character.creation.archetype?.archetypeId || !character.creation.archetype.source.sourceId) {
      issues.push(issue('archetype.selection.required', 'creation.archetype', 'A published archetype selection and source are required.'))
    }
    if (
      character.attributes.length === 0 ||
      character.traits.length === 0 ||
      character.skills.length === 0
    ) {
      issues.push(issue('archetype.package.required', 'creation', 'Archetype Attributes, Traits, and Skills are required.'))
    }
  }

  if (character.creation.method === 'point-buy') {
    validatePointBuy(character, issues)
  }
  if (character.creation.method === 'life-modules') {
    validateLifeModules(character, issues)
  } else if (character.creation.lifeModules?.finalReview) {
    issues.push(issue('life-modules.optimization.method.invalid', 'creation.lifeModules.finalReview', 'Life Module final review and Optimization cannot be applied to a non-Life-Modules character.'))
  }

  const identityIds = new Set(character.identities.entries.map((identity) => identity.id))
  const primaryIdentities = character.identities.entries.filter((identity) => identity.kind === 'primary')
  if (primaryIdentities.length !== 1) {
    issues.push(issue('identity.primary.exactly-one', 'identities.entries', 'Exactly one primary identity is required.'))
  }
  if (!identityIds.has(character.identities.primaryIdentityId)) {
    issues.push(issue('identity.primary.reference', 'identities.primaryIdentityId', 'Primary identity reference is invalid.'))
  }

  if (
    character.xp.creation.starting < 0 ||
    character.xp.creation.remaining < 0 ||
    character.xp.creation.allocated < 0 ||
    character.xp.earnedGameplayUnspent < 0
  ) {
    issues.push(issue('xp.nonnegative', 'xp', 'XP pools cannot be negative.'))
  }

  character.traits.forEach((trait, index) => {
    if (trait.identityId && !identityIds.has(trait.identityId)) {
      issues.push(issue('trait.identity.reference', `traits.${index}.identityId`, 'Trait identity reference is invalid.'))
    }
  })

  character.skills.forEach((skill, index) => {
    if (skill.level !== null && (!Number.isInteger(skill.level) || skill.level < 0)) {
      issues.push(issue('skill.level.valid', `skills.${index}.level`, 'Skill level must be null or a non-negative integer.'))
    }
  })

  const provenanceIds = new Set(character.provenance.map((entry) => entry.id))
  if (character.creation.method === 'point-buy' && character.creation.pointBuy) {
    if (
      !provenanceIds.has(character.creation.pointBuy.rulesProvenanceId) ||
      !provenanceIds.has(character.creation.pointBuy.costProvenanceId)
    ) {
      issues.push(issue('point-buy.provenance.reference', 'creation.pointBuy', 'Point Buy provenance references are invalid.'))
    }
  }
  const validateAwards = (path: string, awards: Array<{ provenanceId: string }>) => {
    const requiresCreationProvenance = character.creation.method !== 'life-modules' || character.creation.lifeModules !== undefined
    if (requiresCreationProvenance && awards.length === 0) {
      issues.push(issue('creation.provenance.required', path, 'Creation-derived values require source awards.'))
    }
    awards.forEach((award, index) => {
      if (!provenanceIds.has(award.provenanceId)) {
        issues.push(issue('provenance.reference', `${path}.${index}.provenanceId`, 'Source-award provenance reference is invalid.'))
      }
    })
  }

  character.attributes.forEach((entry, index) => validateAwards(`attributes.${index}.sourceAwards`, entry.sourceAwards))
  character.traits.forEach((entry, index) => validateAwards(`traits.${index}.sourceAwards`, entry.sourceAwards))
  character.skills.forEach((entry, index) => validateAwards(`skills.${index}.sourceAwards`, entry.sourceAwards))
  character.inventory.forEach((entry, index) => {
    if (!provenanceIds.has(entry.provenanceId)) {
      issues.push(issue('provenance.reference', `inventory.${index}.provenanceId`, 'Equipment provenance reference is invalid.'))
    }
    if (character.creation.method === 'archetype' && !entry.source?.sourceId) {
      issues.push(issue('archetype.equipment.source.required', `inventory.${index}.source`, 'Archetype equipment requires a source.'))
    }
  })

  return {
    valid: !issues.some((item) => item.severity === 'error'),
    issues,
  }
}

function validateLifeModules(character: CharacterDefinition, issues: ValidationIssue[]): void {
  const state = character.creation.lifeModules
  if (!state?.source.sourceId) {
    const isUninitializedFoundation = character.lifeModuleHistory.length === 0 && character.xp.creation.starting === 0
    if (!isUninitializedFoundation) {
      issues.push(issue('life-modules.state.required', 'creation.lifeModules', 'Life Module creation state and source are required.'))
    }
    return
  }
  const { starting, spent, remaining } = state.moduleXp
  if (!Array.isArray(state.selectedSkillFields)) {
    issues.push(issue('life-modules.skill-fields.state.malformed', 'creation.lifeModules.selectedSkillFields', 'Durable Skill Field records are required.'))
    return
  }
  if (!Number.isInteger(starting) || starting <= 0 || !Number.isInteger(spent) || spent < 0 || !Number.isInteger(remaining) || remaining < 0) {
    issues.push(issue('life-modules.xp.valid', 'creation.lifeModules.moduleXp', 'Life Module XP values must be non-negative whole numbers with a positive starting pool.'))
  }
  const expectedCreationRemaining = state.finalReview?.allocationPool.remaining ?? remaining
  if (remaining !== starting - spent || character.xp.creation.remaining !== expectedCreationRemaining) {
    issues.push(issue('life-modules.xp.balance', 'creation.lifeModules.moduleXp', 'Life Module spending and remaining XP do not reconcile.'))
  }
  const selectedIds = new Set<string>()
  const provenanceIds = new Set(character.provenance.map((entry) => entry.id))
  let calculatedCost = 0
  for (const [index, entry] of character.lifeModuleHistory.entries()) {
    if (selectedIds.has(entry.moduleId)) issues.push(issue('life-modules.module.duplicate', `lifeModuleHistory.${index}.moduleId`, 'A Life Module cannot be selected more than once in the current Alpha catalog.'))
    selectedIds.add(entry.moduleId)
    try {
      const definition = getLifeModule(entry.moduleId)
      const selectedFieldCost = state.selectedSkillFields.filter((grant) => grant.schoolModuleId === entry.moduleId).reduce((total, grant) => total + grant.purchaseCostXp, 0)
      const expectedCost = definition.skillFieldSelection ? definition.costXp + selectedFieldCost : definition.costXp
      calculatedCost += expectedCost
      if (
        entry.costXp !== expectedCost ||
        entry.stage !== definition.stage ||
        !entry.source.sourceId ||
        (definition.chronologyYears !== undefined && entry.chronologyYears !== definition.chronologyYears) ||
        JSON.stringify(entry.repeatPolicy ?? null) !== JSON.stringify(definition.repeatPolicy ?? null) ||
        (definition.skillFieldSelection && (entry.baseCostXp !== definition.costXp || entry.fieldCostXp !== selectedFieldCost))
      ) {
        issues.push(issue('life-modules.module.malformed', `lifeModuleHistory.${index}`, 'Life Module history does not match its catalog definition.'))
      }
    } catch (error) {
      issues.push(issue('life-modules.module.unknown', `lifeModuleHistory.${index}.moduleId`, error instanceof Error ? error.message : 'Unknown Life Module.'))
    }
    if (entry.provenanceIds.length === 0 || entry.provenanceIds.some((id) => !provenanceIds.has(id))) {
      issues.push(issue('life-modules.module.provenance', `lifeModuleHistory.${index}.provenanceIds`, 'Selected Life Modules require valid provenance references.'))
    }
  }
  if (calculatedCost !== spent) issues.push(issue('life-modules.cost.balance', 'creation.lifeModules.moduleXp.spent', 'Selected module costs do not match recorded Life Module spending.'))
  if (state.selectedModuleIds.length !== character.lifeModuleHistory.length || state.selectedModuleIds.some((id) => !selectedIds.has(id))) {
    issues.push(issue('life-modules.selection.balance', 'creation.lifeModules.selectedModuleIds', 'Selected module state does not match module history.'))
  }
  const hasUniversal = selectedIds.has('stage0.universal-fixed-xp')
  const hasAffiliation = selectedIds.has('stage0.capellan-confederation.capellan-commonality')
  const stage1Count = character.lifeModuleHistory.filter((entry) => entry.stage === 1).length
  const stage2Count = character.lifeModuleHistory.filter((entry) => entry.stage === 2).length
  const stage3Count = character.lifeModuleHistory.filter((entry) => entry.stage === 3).length
  const stage4Entries = character.lifeModuleHistory.filter((entry) => entry.stage === 4)
  const stage4Count = stage4Entries.length
  if (!hasUniversal) issues.push(issue('life-modules.universal.outstanding', 'lifeModuleHistory', 'The universal Stage 0 package is still required.', { severity: 'warning' }))
  if (!hasAffiliation) issues.push(issue('life-modules.affiliation.outstanding', 'lifeModuleHistory', 'A Stage 0 affiliation is still required.', { severity: 'warning' }))
  if (stage1Count !== 1) issues.push(issue('life-modules.stage-1.outstanding', 'lifeModuleHistory', 'Exactly one Stage 1 module is required.', { severity: stage1Count === 0 ? 'warning' : 'error' }))
  if (stage2Count > 1) issues.push(issue('life-modules.stage-2.multiple', 'lifeModuleHistory', 'No more than one Stage 2 module may be selected.'))
  if (state.currentStage === 2 && stage2Count === 0 && state.phase !== 'stage-2-selection') issues.push(issue('life-modules.stage-2.outstanding', 'lifeModuleHistory', 'Stage 2 has not been selected for this continuation.', { severity: 'warning' }))
  if (stage3Count > 1) issues.push(issue('life-modules.stage-3.multiple', 'lifeModuleHistory', 'Repeated Stage 3 schooling is not supported.'))
  if (state.currentStage === 3 && stage3Count === 0) issues.push(issue('life-modules.stage-3.outstanding', 'lifeModuleHistory', 'A Stage 3 school has not yet been selected for this continuation.', { severity: 'warning' }))
  validateSkillFieldGrants(character, issues, provenanceIds, stage3Count)
  if (stage4Count > 1) issues.push(issue('life-modules.stage-4.multiple', 'lifeModuleHistory', 'Multiple Stage 4 modules are not supported in Alpha Slice 9.'))
  if (new Set(stage4Entries.map((entry) => entry.moduleId)).size !== stage4Count) issues.push(issue('life-modules.stage-4.repeat.unsupported', 'lifeModuleHistory', 'Repeated Stage 4 execution is not supported in Alpha Slice 9.'))
  if (state.currentStage === 4 && stage4Count === 0 && state.phase !== 'stage-4-selection') issues.push(issue('life-modules.stage-4.outstanding', 'lifeModuleHistory', 'A Stage 4 module has not yet been selected for this continuation.', { severity: 'warning' }))
  validateStage4(character, issues, provenanceIds, stage4Entries)
  validateFinalReview(character, issues, stage4Count)
  if (!Array.isArray(state.pendingAwards) || !Array.isArray(state.resolvedAwards) || !Array.isArray(state.choiceGrantRequirements)) {
    issues.push(issue('life-modules.award-state.malformed', 'creation.lifeModules', 'Pending and resolved Life Module award collections are required.'))
    return
  }
  state.pendingAwards.forEach((award, index) => {
    let catalogAward: LifeModuleAward | undefined
    try { catalogAward = getLifeModule(award.moduleId).awards.find((entry) => entry.id === award.awardId) } catch { /* malformed below */ }
    const poolAward = catalogAward?.kind === 'flexible-xp' && catalogAward.allocationMode === 'pool' ? catalogAward : undefined
    const isPool = poolAward !== undefined
    const expectedXp = catalogAward?.kind === 'flexible-xp' ? (catalogAward.allocationMode === 'pool' ? 0 : catalogAward.xpPerGrant) : catalogAward && 'xp' in catalogAward ? catalogAward.xp : undefined
    const expectedTypes = catalogAward?.kind === 'flexible-xp' ? catalogAward.allowedTargetTypes : catalogAward && ['language-choice', 'affiliation-skill-choice', 'any-skill-choice', 'multi-skill-choice'].includes(catalogAward.kind) ? ['skill'] : []
    const expectedSkill = catalogAward?.kind === 'language-choice' ? 'skill.language' : catalogAward?.kind === 'affiliation-skill-choice' || catalogAward?.kind === 'any-skill-choice' || catalogAward?.kind === 'multi-skill-choice' ? catalogAward.skillId : undefined
    if (
      !selectedIds.has(award.moduleId) ||
      !award.awardId ||
      !Number.isFinite(award.xpPerGrant) ||
      !Number.isInteger(award.remainingGrants) ||
      (isPool ? award.remainingGrants !== 0 || !Number.isInteger(award.remainingXp) || award.remainingXp! <= 0 || award.remainingXp! > poolAward.totalXp : award.remainingGrants <= 0) ||
      award.allowedTargetTypes.length === 0 ||
      !award.source.sourceId ||
      !catalogAward ||
      catalogAward.kind !== award.kind ||
      expectedXp !== award.xpPerGrant ||
      expectedTypes.length !== award.allowedTargetTypes.length ||
      expectedTypes.some((type) => !award.allowedTargetTypes.includes(type as 'attribute' | 'trait' | 'skill')) ||
      expectedSkill !== award.requiredSkillId ||
      (isPool && (award.allocationMode !== 'pool' || JSON.stringify(award.maxXpPerTarget ?? {}) !== JSON.stringify(poolAward.maxXpPerTarget ?? {})))
    ) {
      issues.push(issue('life-modules.pending-award.malformed', `creation.lifeModules.pendingAwards.${index}`, 'Pending Life Module award state is malformed.'))
    }
  })
  validateResolvedLifeModuleAwards(character, issues, selectedIds)
  validateChoiceGrantBalance(character, issues)
  if (state.pendingAwards.length > 0) issues.push(issue('life-modules.awards.unresolved', 'creation.lifeModules.pendingAwards', `${state.pendingAwards.length} source-bound award allocation${state.pendingAwards.length === 1 ? ' remains' : 's remain'} unresolved.`, { severity: 'warning' }))
  const hasOutstandingPrerequisite = state.prerequisiteIssues.some((entry) => entry.status === 'outstanding')
  if (hasOutstandingPrerequisite) {
    issues.push(issue('life-modules.prerequisites.outstanding', 'creation.lifeModules.prerequisiteIssues', 'One or more Life Module prerequisites remain outstanding for final validation.', { severity: 'warning', kind: 'prerequisite', gmOverrideAllowed: true }))
  }
  if (stage1Count === 1) {
    const expectedPhase = state.finalReview
      ? getFinalReviewBlockers(character).length === 0 ? 'ready-for-final-touches' : 'alpha-final-review'
      : state.phase === 'stage-4-selection' && stage4Count === 0 && stage3Count === 1 && state.pendingAwards.length === 0 && !hasOutstandingPrerequisite
      ? 'stage-4-selection'
      : stage4Count === 1
        ? state.pendingAwards.length > 0
          ? 'stage-4-resolution'
          : hasOutstandingPrerequisite
            ? 'stage-4-prerequisite-review'
            : 'alpha-stage-4-stop'
      : state.phase === 'stage-3-selection' && stage3Count === 0 && stage2Count === 1 && state.pendingAwards.length === 0 && !hasOutstandingPrerequisite
      ? 'stage-3-selection'
      : stage3Count === 1
        ? state.pendingAwards.length > 0
          ? 'stage-3-resolution'
          : hasOutstandingPrerequisite
            ? 'stage-3-prerequisite-review'
            : 'alpha-stage-3-stop'
        : state.phase === 'stage-2-selection' && stage2Count === 0 && state.pendingAwards.length === 0 && !hasOutstandingPrerequisite
          ? 'stage-2-selection'
          : stage2Count === 1
            ? state.pendingAwards.length > 0
              ? 'stage-2-resolution'
              : hasOutstandingPrerequisite
                ? 'stage-2-prerequisite-review'
                : 'alpha-stage-2-stop'
            : state.pendingAwards.length > 0
              ? 'stage-1-resolution'
              : hasOutstandingPrerequisite
                ? 'stage-1-prerequisite-review'
                : 'alpha-partial-stop'
    if (state.phase !== expectedPhase) issues.push(issue('life-modules.phase.malformed', 'creation.lifeModules.phase', `Life Module phase should be ${expectedPhase}.`))
    if (expectedPhase === 'alpha-partial-stop' || expectedPhase === 'alpha-stage-2-stop' || expectedPhase === 'alpha-stage-3-stop' || expectedPhase === 'alpha-stage-4-stop') {
      if (state.stopState !== expectedPhase) issues.push(issue('life-modules.stop-state.malformed', 'creation.lifeModules.stopState', 'Completed Life Module award resolution requires the matching Alpha partial-stop state.'))
      const message = expectedPhase === 'alpha-stage-4-stop'
        ? 'Stage 0 through the minimal Stage 4 branch are complete; repeated Stage 4 execution and finalization remain unsupported.'
        : expectedPhase === 'alpha-stage-3-stop'
        ? 'Stage 0 through the minimal Stage 3 branch are complete; the draft may explicitly continue to the minimal Stage 4 branch.'
        : expectedPhase === 'alpha-stage-2-stop'
          ? 'Stage 0 through Stage 2 are complete; the draft may stop here or explicitly continue to the minimal Stage 3 branch.'
          : 'Stage 0 and Stage 1 are complete; the draft may stop here or explicitly continue to Stage 2.'
      issues.push(issue('life-modules.alpha-stop.valid', 'creation.lifeModules.stopState', message, { severity: 'information', kind: 'availability' }))
    } else if (state.stopState !== 'not-eligible') {
      issues.push(issue('life-modules.stop-state.malformed', 'creation.lifeModules.stopState', 'This draft is not eligible for an Alpha partial stop.'))
    }
  }
  if (character.creation.status === 'finalized') {
    issues.push(issue('life-modules.finalization.unsupported', 'creation.status', 'Full Life Module finalization is not implemented in Alpha Slice 9.'))
  }
}

function validateFinalReview(
  character: CharacterDefinition,
  issues: ValidationIssue[],
  stage4Count: number,
): void {
  const state = character.creation.lifeModules!
  const review = state.finalReview
  if (!review) return
  const pool = review.allocationPool
  if (
    review.version !== 1 ||
    !review.enteredAt ||
    stage4Count !== 1 ||
    !Array.isArray(review.allocations) ||
    !Array.isArray(review.optimizations) ||
    !Number.isInteger(pool.starting) || pool.starting < 0 ||
    !Number.isInteger(pool.allocated) || pool.allocated < 0 ||
    !Number.isInteger(pool.optimizationReturned) || pool.optimizationReturned < 0 ||
    !Number.isInteger(pool.remaining) || pool.remaining < 0 ||
    pool.starting !== state.moduleXp.remaining ||
    pool.remaining !== pool.starting + pool.optimizationReturned - pool.allocated
  ) issues.push(issue('life-modules.final-review.pool.malformed', 'creation.lifeModules.finalReview', 'Final-review state and allocation-pool accounting are malformed.'))
  if (pool.remaining > 0) issues.push(issue('life-modules.final-review.xp.unallocated', 'creation.lifeModules.finalReview.allocationPool.remaining', `${pool.remaining} XP remains for final allocation.`, { severity: 'warning' }))

  for (const [index, allocation] of review.allocations.entries()) {
    const provenance = character.provenance.find((entry) => entry.id === allocation.provenanceId)
    if (!allocation.id || !allocation.allocatedAt || !Number.isInteger(allocation.xp) || allocation.xp <= 0 || provenance?.kind !== 'player-choice' || !provenance.source?.sourceId || !finalReviewTargetExists(character, allocation.destination)) {
      issues.push(issue('life-modules.final-allocation.malformed', `creation.lifeModules.finalReview.allocations.${index}`, 'Final-allocation entry has an invalid amount, target, timestamp, or provenance.'))
    }
  }
  if (review.allocations.reduce((total, entry) => total + entry.xp, 0) !== pool.allocated) {
    issues.push(issue('life-modules.final-allocation.balance', 'creation.lifeModules.finalReview.allocations', 'Final-allocation records do not match the allocated XP total.'))
  }

  for (const [index, optimization] of review.optimizations.entries()) {
    const provenance = character.provenance.find((entry) => entry.id === optimization.provenanceId)
    if (
      !optimization.id || !optimization.appliedAt ||
      !Number.isInteger(optimization.beforeXp) || !Number.isInteger(optimization.afterXp) ||
      !Number.isInteger(optimization.returnedXp) || optimization.returnedXp <= 0 ||
      optimization.returnedXp !== Math.abs(optimization.beforeXp - optimization.afterXp) ||
      provenance?.kind !== 'derived' || !provenance.source?.sourceId ||
      !optimizationRecordTargetsFullyAttained(optimization) ||
      !finalReviewTargetExists(character, optimization.destination)
    ) issues.push(issue('life-modules.optimization.malformed', `creation.lifeModules.finalReview.optimizations.${index}`, 'Optimization record has invalid XP, target, timestamp, or provenance.'))
  }
  if (review.optimizations.reduce((total, entry) => total + entry.returnedXp, 0) !== pool.optimizationReturned) {
    issues.push(issue('life-modules.optimization.balance', 'creation.lifeModules.finalReview.optimizations', 'Optimization records do not match the XP returned to the final-allocation pool.'))
  }

  character.attributes.forEach((entry, index) => {
    const derived = deriveAttributeLevel(entry.accumulatedXp)
    if (entry.purchasedLevel !== derived) issues.push(issue('life-modules.final-level.attribute.malformed', `attributes.${index}.purchasedLevel`, 'Attribute score does not match its fully attained XP threshold.'))
    if ((derived ?? 0) < 1) issues.push(issue('life-modules.final-level.attribute.minimum', `attributes.${index}`, `${entry.attributeId} must attain score 1 before Final Touches.`))
    const maximum = POINT_BUY_ATTRIBUTE_MAXIMUMS[entry.attributeId]
    if (maximum !== undefined && (derived ?? 0) > maximum) issues.push(issue('life-modules.final-level.attribute.maximum', `attributes.${index}`, `${entry.attributeId} exceeds the modeled Normal Human maximum of ${maximum}.`))
  })
  character.skills.forEach((entry, index) => {
    const derived = deriveStandardSkillLevel(entry.accumulatedXp)
    if (entry.level !== derived) issues.push(issue('life-modules.final-level.skill.malformed', `skills.${index}.level`, 'Skill level does not match its highest fully attained Standard threshold.'))
    if (entry.accumulatedXp > 570) issues.push(issue('life-modules.final-level.skill.maximum', `skills.${index}.accumulatedXp`, 'Skill XP exceeds the modeled Standard Level +10 maximum and must be optimized.'))
  })
  character.traits.forEach((entry, index) => {
    const derived = deriveTraitPoints(entry.accumulatedXp)
    if (entry.attainedTp !== derived || entry.active !== (derived !== null)) issues.push(issue('life-modules.final-level.trait.malformed', `traits.${index}`, 'Trait TP/active state does not match its fully attained XP threshold.'))
    const range = traitModeledRange(entry.traitId)
    if (range && derived !== null && (derived < range.minimum || derived > range.maximum)) issues.push(issue('life-modules.final-level.trait.range', `traits.${index}`, `${entry.displayName ?? entry.traitId} is outside its modeled TP range.`))
    if (isModeledNegativeTrait(entry.traitId) && entry.accumulatedXp > 0) issues.push(issue('life-modules.negative-trait.positive-xp', `traits.${index}`, `${entry.displayName ?? entry.traitId} is a modeled negative Trait with positive XP and requires explicit Optimization.`))
  })

  for (const conflict of getModeledOpposedTraitConflicts(character)) {
    issues.push(issue('life-modules.opposed-traits.conflict', 'traits', conflict.description))
  }
  if (getOptimizationPreview(character).length > 0) issues.push(issue('life-modules.optimization.outstanding', 'creation.lifeModules.finalReview', 'One or more explicit Optimization opportunities remain.', { severity: 'warning' }))
  validateConflictingPrerequisites(character, issues)

  const cap = negativeTraitXpPurchaseCap(state.moduleXp.starting)
  if (
    review.negativeTraitXpPurchase.capXp !== cap ||
    review.negativeTraitXpPurchase.purchasedXp !== 0 ||
    review.negativeTraitXpPurchase.uiStatus !== 'deferred'
  ) issues.push(issue('life-modules.negative-trait-xp.malformed', 'creation.lifeModules.finalReview.negativeTraitXpPurchase', 'Negative-Trait XP purchase metadata is malformed or unsupported.'))
  issues.push(issue('life-modules.negative-trait-xp.deferred', 'creation.lifeModules.finalReview.negativeTraitXpPurchase', `Up to ${cap} XP may eventually be purchased through fully attained negative Traits; the purchase UI is deferred.`, { severity: 'information', kind: 'availability' }))

  const blockers = getFinalReviewBlockers(character)
  const expectedReadiness = blockers.length === 0 ? 'ready-for-final-touches' : 'review-required'
  if (review.readiness !== expectedReadiness) issues.push(issue('life-modules.final-review.readiness.malformed', 'creation.lifeModules.finalReview.readiness', `Final-review readiness should be ${expectedReadiness}.`))
  if (expectedReadiness === 'ready-for-final-touches') {
    issues.push(issue('life-modules.final-touches.ready', 'creation.lifeModules.finalReview.readiness', 'Character is ready for Final Touches; equipment purchasing, PDF export, and full finalization remain unsupported.', { severity: 'information', kind: 'availability' }))
  } else {
    blockers.forEach((blocker) => issues.push(issue(`life-modules.final-review.blocked.${blocker.id}`, 'creation.lifeModules.finalReview', blocker.message, { severity: 'warning' })))
  }
}

function optimizationRecordTargetsFullyAttained(record: LifeModuleOptimizationRecord): boolean {
  if (record.reason === 'negative-trait-positive-xp') return record.beforeXp > 0 && record.afterXp === 0
  if (record.reason === 'negative-trait-threshold') return record.beforeXp < 0 && record.afterXp < record.beforeXp && Math.abs(record.afterXp) % 100 === 0
  if (record.afterXp < 0 || record.afterXp >= record.beforeXp) return false
  if (record.destination.type === 'attribute' || record.destination.type === 'trait') return record.afterXp % 100 === 0
  if (record.afterXp === 0) return record.beforeXp < standardSkillXpCost(0)
  return deriveStandardSkillLevel(record.afterXp) !== null && record.afterXp === standardSkillXpCost(deriveStandardSkillLevel(record.afterXp))
}

function finalReviewTargetExists(character: CharacterDefinition, destination: { type: string; targetId: string; parameter?: { kind: string; value: string }; parameters?: Record<string, string | number | boolean> }): boolean {
  if (destination.type === 'attribute') return character.attributes.some((entry) => entry.attributeId === destination.targetId)
  if (destination.type === 'trait') return character.traits.some((entry) => entry.traitId === destination.targetId && JSON.stringify(entry.parameters) === JSON.stringify(destination.parameters ?? {}))
  if (destination.type === 'skill') return character.skills.some((entry) => finalReviewDestinationKey({ type: 'skill', targetId: entry.address.skillId, displayName: entry.displayName ?? entry.address.skillId, parameter: entry.address.parameter }) === finalReviewDestinationKey({ ...destination, type: 'skill', displayName: destination.targetId }))
  return false
}

function validateConflictingPrerequisites(character: CharacterDefinition, issues: ValidationIssue[]): void {
  const selected = character.creation.lifeModules?.selectedModuleIds ?? []
  const prerequisites = selected.flatMap((moduleId) => {
    try { return getLifeModule(moduleId).prerequisites.map((entry) => ({ moduleId, entry })) } catch { return [] }
  })
  for (const required of prerequisites) {
    if (required.entry.kind !== 'trait') continue
    const traitId = required.entry.traitId
    const conflict = prerequisites.find((item) => item.entry.kind === 'trait-absent' && item.entry.traitId === traitId)
    if (conflict) issues.push(issue('life-modules.prerequisites.conflict', 'creation.lifeModules.prerequisiteIssues', `Conflicting prerequisites for ${traitId} affect ${required.moduleId} and ${conflict.moduleId}.`, { kind: 'prerequisite', gmOverrideAllowed: true }))
  }
}

function validateStage4(
  character: CharacterDefinition,
  issues: ValidationIssue[],
  provenanceIds: Set<string>,
  stage4Entries: CharacterDefinition['lifeModuleHistory'],
): void {
  if (stage4Entries.length !== 1) return
  const entry = stage4Entries[0]
  let definition: LifeModuleDefinition
  try { definition = getLifeModule(entry.moduleId) } catch { return }
  if (definition.stage !== 4) return
  const expectedAge = 16 + (character.creation.lifeModules?.selectedSkillFields.reduce((total, grant) => total + grant.chronologyYears, 0) ?? 0) + (definition.chronologyYears ?? 0)
  const chronology = character.chronology.find((item) => item.eventId === `${entry.moduleId}.complete`)
  if (!chronology || chronology.date !== `age:${expectedAge}` || !provenanceIds.has(chronology.provenanceId)) {
    issues.push(issue('life-modules.stage-4.age.malformed', 'chronology', 'Stage 4 chronology must equal age 16 plus Stage 3 and Stage 4 time and retain valid provenance.'))
  }
  if (!definition.repeatPolicy || JSON.stringify(entry.repeatPolicy) !== JSON.stringify(definition.repeatPolicy)) {
    issues.push(issue('life-modules.stage-4.repeat-policy.malformed', 'lifeModuleHistory', 'Stage 4 history must preserve the published repeat-policy metadata for future implementation.'))
  }
}

function validateResolvedLifeModuleAwards(character: CharacterDefinition, issues: ValidationIssue[], selectedIds: Set<string>): void {
  const state = character.creation.lifeModules!
  const provenanceIds = new Set(character.provenance.map((entry) => entry.id))
  const seen = new Set<string>()
  state.resolvedAwards.forEach((resolved, index) => {
    let module: LifeModuleDefinition | undefined
    try { module = getLifeModule(resolved.moduleId) } catch { /* reported below */ }
    const award = module?.awards.find((entry) => entry.id === resolved.awardId)
    const key = `${resolved.moduleId}/${resolved.awardId}/${lifeModuleDestinationKey(resolved.destination)}`
    if (seen.has(key) && !(award?.kind === 'flexible-xp' && award.allocationMode === 'pool')) issues.push(issue('life-modules.resolution.duplicate', `creation.lifeModules.resolvedAwards.${index}`, 'A required choice cannot use the same destination more than once.'))
    seen.add(key)
    if (!selectedIds.has(resolved.moduleId) || !award || award.kind === 'fixed' || award.kind === 'choice-package' || award.kind === 'conditional' || award.kind === 'field-grant') {
      issues.push(issue('life-modules.resolution.unknown', `creation.lifeModules.resolvedAwards.${index}`, 'Resolved award does not identify a selectable award on a selected module.'))
      return
    }
    const expectedXp = award.kind === 'flexible-xp' ? (award.allocationMode === 'pool' ? null : award.xpPerGrant) : award.xp
    const allowedTypes = award.kind === 'flexible-xp' ? award.allowedTargetTypes : ['skill']
    const requiredSkillId = award.kind === 'affiliation-skill-choice' || award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice' ? award.skillId : award.kind === 'language-choice' ? 'skill.language' : undefined
    const targetIdValid = resolved.destination.type === 'attribute'
      ? LIFE_MODULE_ATTRIBUTE_IDS.includes(resolved.destination.targetId)
      : resolved.destination.targetId.startsWith(resolved.destination.type === 'trait' ? 'trait.' : 'skill.')
    const languageValid = award.kind !== 'language-choice' || award.choicesFrom === 'federated-suns-languages' || (
      award.choicesFrom === 'capellan-secondary'
        ? CAPELLAN_SECONDARY_LANGUAGE_IDS.includes(resolved.destination.parameter?.value ?? '')
        : CAPELLAN_AFFILIATION_LANGUAGE_IDS.includes(resolved.destination.parameter?.value ?? '')
    )
    if (
      resolved.kind !== award.kind ||
      (expectedXp === null ? !Number.isInteger(resolved.xp) || resolved.xp <= 0 : resolved.xp !== expectedXp) ||
      !allowedTypes.includes(resolved.destination.type) ||
      (requiredSkillId && resolved.destination.targetId !== requiredSkillId) ||
      ((award.kind === 'language-choice' || award.kind === 'affiliation-skill-choice' || award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice') && !resolved.destination.parameter?.value) ||
      !targetIdValid ||
      !languageValid ||
      !resolved.source.sourceId ||
      !provenanceIds.has(resolved.provenanceId)
    ) {
      issues.push(issue('life-modules.resolution.malformed', `creation.lifeModules.resolvedAwards.${index}`, 'Resolved Life Module award violates its source award structure or provenance.'))
    }
  })
  for (const moduleId of selectedIds) {
    let module: LifeModuleDefinition | undefined
    try { module = getLifeModule(moduleId) } catch { continue }
    for (const award of module.awards) {
      if (award.kind !== 'flexible-xp' || award.allocationMode !== 'pool') continue
      const resolved = state.resolvedAwards.filter((entry) => entry.moduleId === moduleId && entry.awardId === award.id)
      for (const target of resolved) {
        const total = resolved.filter((entry) => lifeModuleDestinationKey(entry.destination) === lifeModuleDestinationKey(target.destination)).reduce((sum, entry) => sum + entry.xp, 0)
        const cap = award.maxXpPerTarget?.[target.destination.type]
        if (cap !== undefined && total > cap) issues.push(issue('life-modules.flexible-cap.exceeded', 'creation.lifeModules.resolvedAwards', `${module.displayName} flexible XP exceeds the ${cap} XP cap for one ${target.destination.type}.`))
      }
    }
  }
}

function validateSkillFieldGrants(character: CharacterDefinition, issues: ValidationIssue[], provenanceIds: Set<string>, stage3Count: number): void {
  const state = character.creation.lifeModules!
  const seen = new Set<string>()
  for (const [index, grant] of state.selectedSkillFields.entries()) {
    let field
    try { field = getSkillField(grant.fieldId) } catch (error) {
      issues.push(issue('life-modules.skill-field.unknown', `creation.lifeModules.selectedSkillFields.${index}.fieldId`, error instanceof Error ? error.message : 'Unknown Skill Field.'))
      continue
    }
    if (seen.has(grant.fieldId)) issues.push(issue('life-modules.skill-field.duplicate', `creation.lifeModules.selectedSkillFields.${index}.fieldId`, 'A Skill Field may not be selected more than once in Alpha Slice 9.'))
    seen.add(grant.fieldId)
    const school = character.lifeModuleHistory.find((entry) => entry.moduleId === grant.schoolModuleId && entry.stage === 3)
    let schoolDefinition: LifeModuleDefinition | undefined
    try { schoolDefinition = school ? getLifeModule(school.moduleId) : undefined } catch { /* school validation reports this */ }
    const offer = schoolDefinition?.skillFieldSelection?.offers.find((entry) => entry.fieldId === grant.fieldId)
    if (
      !grant.id ||
      !school ||
      !offer ||
      grant.displayName !== field.displayName ||
      grant.category !== offer?.category ||
      grant.purchaseCostXp !== skillFieldCost(field, offer?.costXpPerSkill ?? 0) ||
      grant.xpPerSkill !== offer?.awardedXpPerSkill ||
      grant.chronologyYears !== offer?.chronologyYears ||
      !grant.selectedAt ||
      !grant.source.sourceId ||
      !provenanceIds.has(grant.provenanceId)
    ) {
      issues.push(issue('life-modules.skill-field.malformed', `creation.lifeModules.selectedSkillFields.${index}`, 'Durable Skill Field record does not match its catalog definition, school, cost, chronology, or provenance.'))
    }
    for (const prerequisite of field.prerequisites) {
      const tracked = state.prerequisiteIssues.find((entry) => entry.moduleId === field.id && entry.prerequisiteId === prerequisite.id)
      if (!tracked || tracked.description !== prerequisite.description) {
        issues.push(issue('life-modules.skill-field.prerequisite.missing', 'creation.lifeModules.prerequisiteIssues', `${field.displayName} prerequisite ${prerequisite.description} is not tracked durably.`))
      } else if (tracked.status !== 'gm-override' && tracked.status !== (skillFieldPrerequisiteSatisfied(character, prerequisite) ? 'satisfied' : 'outstanding')) {
        issues.push(issue('life-modules.skill-field.prerequisite.malformed', 'creation.lifeModules.prerequisiteIssues', `${field.displayName} prerequisite ${prerequisite.description} has an incorrect status.`))
      }
    }
  }

  const stage3 = character.lifeModuleHistory.find((entry) => entry.stage === 3)
  if (!stage3) {
    if (state.selectedSkillFields.length > 0) issues.push(issue('life-modules.skill-field.without-school', 'creation.lifeModules.selectedSkillFields', 'Skill Fields require a selected Stage 3 school.'))
    return
  }
  let school: LifeModuleDefinition | undefined
  try { school = getLifeModule(stage3.moduleId) } catch { return }
  const policy = school.skillFieldSelection
  if (!policy) {
    issues.push(issue('life-modules.skill-field.policy.missing', 'lifeModuleHistory', 'Selected Stage 3 school has no Skill Field policy.'))
    return
  }
  const grants = state.selectedSkillFields.filter((grant) => grant.schoolModuleId === stage3.moduleId)
  const basicCount = grants.filter((grant) => grant.category === 'basic').length
  const advancedCount = grants.filter((grant) => grant.category === 'advanced').length
  if (basicCount !== policy.exactlyBasic) issues.push(issue('life-modules.skill-field.basic.required', 'creation.lifeModules.selectedSkillFields', 'Technical College requires exactly one Basic Skill Field.'))
  if (advancedCount < policy.minimumAdvanced) issues.push(issue('life-modules.skill-field.advanced.required', 'creation.lifeModules.selectedSkillFields', 'Technical College requires at least one Advanced Skill Field.'))
  if (grants.length > policy.maximumTotal) issues.push(issue('life-modules.skill-field.maximum', 'creation.lifeModules.selectedSkillFields', `Technical College permits no more than ${policy.maximumTotal} Skill Fields.`))
  if (stage3Count === 1) {
    const expectedAge = 16 + grants.reduce((total, grant) => total + grant.chronologyYears, 0)
    const chronology = character.chronology.find((entry) => entry.eventId === `${stage3.moduleId}.complete`)
    if (!chronology || chronology.date !== `age:${expectedAge}` || !provenanceIds.has(chronology.provenanceId)) {
      issues.push(issue('life-modules.stage-3.age.malformed', 'chronology', 'Stage 3 chronology must equal age 16 plus the selected Skill Field time and retain valid provenance.'))
    }
  }
}

function skillFieldPrerequisiteSatisfied(character: CharacterDefinition, prerequisite: LifeModulePrerequisite): boolean {
  if (prerequisite.kind === 'attribute-minimum') return (character.attributes.find((entry) => entry.attributeId === prerequisite.attributeId)?.purchasedLevel ?? 0) >= prerequisite.minimum
  if (prerequisite.kind === 'skill-field') return prerequisite.fieldIds.some((fieldId) => character.creation.lifeModules?.selectedSkillFields.some((grant) => grant.fieldId === fieldId))
  if (prerequisite.kind === 'trait') return character.traits.some((entry) => entry.traitId === prerequisite.traitId && entry.active)
  if (prerequisite.kind === 'trait-absent') return !character.traits.some((entry) => entry.traitId === prerequisite.traitId && entry.active)
  if (prerequisite.kind === 'affiliation') return character.affiliations.length > 0 && (prerequisite.classification !== 'non-clan' || character.affiliations.every((entry) => !entry.affiliationId.startsWith('affiliation.clan')))
  return false
}

const LIFE_MODULE_ATTRIBUTE_IDS = ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG']
const CAPELLAN_AFFILIATION_LANGUAGE_IDS = ['Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English']
const CAPELLAN_SECONDARY_LANGUAGE_IDS = ['Russian', 'Cantonese', 'Vietnamese', 'English']

function validateChoiceGrantBalance(character: CharacterDefinition, issues: ValidationIssue[]): void {
  const state = character.creation.lifeModules!
  const seen = new Set<string>()
  for (const requirement of state.choiceGrantRequirements) {
    const key = `${requirement.moduleId}/${requirement.awardId}`
    let module: LifeModuleDefinition | undefined
    try { module = getLifeModule(requirement.moduleId) } catch { /* handled below */ }
    const award = module?.awards.find((entry) => entry.id === requirement.awardId)
    const catalogCount = award ? lifeModuleAwardGrantCount(award) : null
    if (seen.has(key) || !state.selectedModuleIds.includes(requirement.moduleId) || catalogCount === null || requirement.requiredGrants !== catalogCount) {
      issues.push(issue('life-modules.choice-requirement.malformed', 'creation.lifeModules.choiceGrantRequirements', 'Choice grant requirements must uniquely match selected catalog awards.'))
      continue
    }
    seen.add(key)
    const matchingResolved = state.resolvedAwards.filter((entry) => entry.moduleId === requirement.moduleId && entry.awardId === requirement.awardId)
    const resolved = matchingResolved.length
    const matchingPending = state.pendingAwards.filter((entry) => entry.moduleId === requirement.moduleId && entry.awardId === requirement.awardId)
    const pending = matchingPending.reduce((total, entry) => total + entry.remainingGrants, 0)
    const poolBalanced = requirement.allocationMode === 'pool'
      ? matchingResolved.reduce((total, entry) => total + entry.xp, 0) + matchingPending.reduce((total, entry) => total + (entry.remainingXp ?? 0), 0) === requirement.requiredXp
      : resolved + pending === requirement.requiredGrants
    if (!poolBalanced || matchingPending.length > 1) {
      issues.push(issue('life-modules.choice-count.malformed', 'creation.lifeModules', `${module?.displayName ?? requirement.moduleId}: ${requirement.awardId} does not preserve its required choice count.`))
    }
  }
  if (state.awardResolutionVersion === 1) {
    for (const moduleId of state.selectedModuleIds) {
      let module: LifeModuleDefinition | undefined
      try { module = getLifeModule(moduleId) } catch { continue }
      for (const award of module.awards) {
        if (lifeModuleAwardGrantCount(award) !== null && !seen.has(`${moduleId}/${award.id}`)) {
          issues.push(issue('life-modules.choice-requirement.missing', 'creation.lifeModules.choiceGrantRequirements', `${module.displayName}: ${award.id} is missing its required grant record.`))
        }
      }
    }
  } else if (state.awardResolutionVersion !== 0) {
    issues.push(issue('life-modules.award-resolution-version.unsupported', 'creation.lifeModules.awardResolutionVersion', 'Life Module award-resolution state version is unsupported.'))
  }
}

function lifeModuleAwardGrantCount(award: LifeModuleAward): number | null {
  if (award.kind === 'language-choice' || award.kind === 'affiliation-skill-choice') return 1
  if (award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice') return award.count
  if (award.kind === 'flexible-xp') return award.allocationMode === 'pool' ? 0 : award.count
  return null
}

function lifeModuleDestinationKey(destination: { type: string; targetId: string; parameter?: { kind: string; value: string }; parameters?: Record<string, string | number | boolean> }): string {
  return `${destination.type}/${destination.targetId.toLowerCase()}/${destination.parameter?.kind.toLowerCase() ?? ''}/${destination.parameter?.value.toLowerCase() ?? ''}/${JSON.stringify(destination.parameters ?? {})}`
}

function validatePointBuy(character: CharacterDefinition, issues: ValidationIssue[]): void {
  const pointBuy = character.creation.pointBuy
  if (!pointBuy?.source.sourceId || !pointBuy.costTableSource.sourceId) {
    issues.push(issue('point-buy.source.required', 'creation.pointBuy', 'Point Buy rules and XP-cost sources are required.'))
  }
  const { starting, remaining, allocated } = character.xp.creation
  if (!Number.isInteger(starting) || starting < 800) {
    issues.push(issue('point-buy.starting-xp.valid', 'xp.creation.starting', 'Point Buy starting XP must be a whole number of at least 800.'))
  }
  const attributeIds = new Set<string>()
  if (character.attributes.length !== 8) {
    issues.push(issue('point-buy.attributes.complete', 'attributes', 'Point Buy requires all eight Attributes.'))
  }
  character.attributes.forEach((entry, index) => {
    const maximum = POINT_BUY_ATTRIBUTE_MAXIMUMS[entry.attributeId]
    if (attributeIds.has(entry.attributeId)) {
      issues.push(issue('point-buy.attribute.duplicate', `attributes.${index}.attributeId`, 'Point Buy Attribute IDs must be unique.'))
    }
    attributeIds.add(entry.attributeId)
    if (
      maximum === undefined ||
      !Number.isInteger(entry.purchasedLevel) ||
      (entry.purchasedLevel ?? 0) < 1 ||
      (entry.purchasedLevel ?? 0) > maximum ||
      entry.accumulatedXp !== (entry.purchasedLevel ?? 0) * 100
    ) {
      issues.push(issue('point-buy.attribute.valid', `attributes.${index}`, 'Point Buy Attribute level or XP is malformed.'))
    }
  })
  character.skills.forEach((entry, index) => {
    if (!entry.address.skillId || (entry.address.parameter && !entry.address.parameter.value.trim())) {
      issues.push(issue('point-buy.skill.address.valid', `skills.${index}.address`, 'Point Buy Skill/subskill address is malformed.'))
    }
    try {
      const definition = getPointBuySkill(entry.address.skillId)
      if (definition.parameter?.required && !entry.address.parameter?.value.trim()) {
        issues.push(issue('point-buy.skill.subskill.required', `skills.${index}.address.parameter`, `${definition.displayName} requires a concrete subskill.`))
      }
      if (!definition.parameter && entry.address.parameter) {
        issues.push(issue('point-buy.skill.subskill.prohibited', `skills.${index}.address.parameter`, `${definition.displayName} does not accept a subskill.`))
      }
      if (entry.accumulatedXp !== standardSkillXpCost(entry.level)) {
        issues.push(issue('point-buy.skill.xp.valid', `skills.${index}.accumulatedXp`, 'Point Buy Skill XP does not match its standard level cost.'))
      }
    } catch (error) {
      issues.push(issue('point-buy.skill.valid', `skills.${index}`, error instanceof Error ? error.message : 'Point Buy Skill is malformed.'))
    }
  })
  character.traits.forEach((entry, index) => {
    if (
      !entry.traitId ||
      !Number.isInteger(entry.attainedTp) ||
      entry.attainedTp === 0 ||
      entry.accumulatedXp !== (entry.attainedTp ?? 0) * 100 ||
      !entry.active
    ) {
      issues.push(issue('point-buy.trait.valid', `traits.${index}`, 'Point Buy Trait purchase is malformed.'))
    }
    try {
      const definition = getPointBuyTrait(entry.traitId)
      if (!definition.allowedTp.includes(entry.attainedTp ?? 0)) {
        issues.push(issue('point-buy.trait.tp.valid', `traits.${index}.attainedTp`, `${definition.displayName} TP is outside the Point Buy v0.1 catalog range.`))
      }
      if (definition.parameter?.required) {
        const value = entry.parameters[definition.parameter.key]
        if (typeof value !== 'string' || !value.trim()) {
          issues.push(issue('point-buy.trait.parameter.required', `traits.${index}.parameters`, `${definition.displayName} requires a concrete ${definition.parameter.label.toLowerCase()}.`))
        }
      }
    } catch (error) {
      issues.push(issue('point-buy.trait.catalog.valid', `traits.${index}.traitId`, error instanceof Error ? error.message : 'Point Buy Trait is malformed.'))
    }
  })
  const calculatedAllocated = calculatePointBuyAllocatedXp(character)
  if (allocated !== calculatedAllocated || remaining !== starting - calculatedAllocated) {
    issues.push(issue('point-buy.xp.balance', 'xp.creation', 'Point Buy allocated and remaining XP do not reconcile with the ledgers.'))
  }
  if (remaining < 0) {
    issues.push(issue('point-buy.xp.overspent', 'xp.creation.remaining', 'Point Buy creation XP cannot be overspent.'))
  }
  const negativeCeiling = Math.floor(starting * 0.1)
  if (calculateNegativeTraitXp(character) > negativeCeiling) {
    issues.push(issue('point-buy.negative-trait-xp.limit', 'traits', `Negative Traits may generate at most ${negativeCeiling} XP.`))
  }
  if (remaining > 0) {
    issues.push(issue('point-buy.xp.unspent', 'xp.creation.remaining', 'Creation XP remains unspent; the character is a draft and cannot enter play.', { severity: 'warning' }))
  }
  if (character.creation.status === 'finalized' && remaining !== 0) {
    issues.push(issue('point-buy.finalization.xp', 'creation.status', 'A finalized Point Buy character must have no unspent creation XP.'))
  }
  const hasPerception = character.skills.some((entry) => entry.address.skillId === 'skill.perception' && entry.level !== null)
  const languages = character.skills.filter((entry) => entry.address.skillId === 'skill.language' && entry.level !== null)
  const hasEnglish = languages.some((entry) => entry.address.parameter?.value.toLowerCase() === 'english')
  if (!hasPerception || !hasEnglish || languages.length < 2) {
    issues.push(issue('point-buy.required-skills.outstanding', 'skills', 'Required Skills remain outstanding: Perception +0, Language/English +0, and another affiliation language +0.', { severity: 'warning' }))
  }
}
