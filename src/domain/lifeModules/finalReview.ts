import type {
  CharacterDefinition,
  ResolvedLifeModuleDestination,
  SkillLedgerEntry,
  TraitLedgerEntry,
} from '../character/model'
import { POINT_BUY_TRAITS, STANDARD_SKILL_XP_COSTS } from '../pointBuy/catalog'
import { attributeLegality } from '../character/attributeLegality'
import type { SourceCitation } from '../rules/model'

export const FINAL_REVIEW_RULES_SOURCE: SourceCitation = {
  sourceId: 'atow-core-corrected-third',
  edition: 'Corrected Third Printing',
  ruleId: 'life-modules-final-validation-optimization',
}

export interface OptimizationOpportunity {
  id: string
  destination: ResolvedLifeModuleDestination
  beforeXp: number
  afterXp: number
  returnedXp: number
  reason: 'excess-xp' | 'modeled-maximum' | 'negative-trait-threshold' | 'negative-trait-positive-xp'
}

export interface OpposedTraitConflict {
  id: string
  positiveTraitId: string
  negativeTraitId: string
  description: string
}

export interface FinalReviewBlocker {
  id: string
  message: string
}

export const FAST_SKILL_XP_COSTS = [16, 24, 40, 64, 96, 136, 184, 240, 304, 376, 456] as const
export const SLOW_SKILL_XP_COSTS = [24, 36, 60, 96, 144, 204, 276, 360, 456, 564, 684] as const

const MODELED_OPPOSED_TRAIT_PAIRS = [
  ['trait.animal-empathy', 'trait.animal-antipathy', 'Animal Empathy and Animal Antipathy are opposed Traits.'],
  ['trait.attractive', 'trait.unattractive', 'Attractive and Unattractive are opposed Traits.'],
  ['trait.combat-sense', 'trait.combat-paralysis', 'Combat Sense and Combat Paralysis are opposed Traits.'],
  ['trait.fast-learner', 'trait.slow-learner', 'Fast Learner and Slow Learner are opposed Traits.'],
  ['trait.fit', 'trait.handicap', 'Fit and Handicap are opposed Traits.'],
  ['trait.good-hearing', 'trait.poor-hearing', 'Good Hearing and Poor Hearing are opposed Traits.'],
  ['trait.good-vision', 'trait.poor-vision', 'Good Vision and Poor Vision are opposed Traits.'],
  ['trait.gregarious', 'trait.introvert', 'Gregarious and Introvert are opposed Traits.'],
  ['trait.patient', 'trait.impatient', 'Patient and Impatient are opposed Traits.'],
  ['trait.tech-empathy', 'trait.gremlins', 'Tech Empathy and Gremlins are opposed Traits.'],
  ['trait.toughness', 'trait.glass-jaw', 'Toughness and Glass Jaw are opposed Traits.'],
] as const

const NEGATIVE_TRAIT_IDS = new Set([
  'trait.bloodmark',
  'trait.compulsion',
  'trait.illiterate',
  'trait.introvert',
  'trait.animal-antipathy',
  'trait.combat-paralysis',
  'trait.gremlins',
  'trait.handicap',
  'trait.impatient',
  'trait.poor-hearing',
  'trait.poor-vision',
  'trait.slow-learner',
  'trait.unattractive',
  'trait.glass-jaw',
])

const SIGNED_TRAIT_IDS = new Set(['trait.reputation'])

export function deriveAttributeLevel(xp: number): number | null {
  if (!Number.isFinite(xp) || xp < 0) return null
  return Math.floor(xp / 100)
}

export function deriveTraitPoints(xp: number): number | null {
  if (!Number.isFinite(xp)) return null
  const points = Math.trunc(xp / 100)
  return points === 0 ? null : points
}

export function deriveTraitPointsForTrait(traitId: string, xp: number): number | null {
  if (traitId === 'trait.exceptional-attribute' && xp < 200) return null
  return deriveTraitPoints(xp)
}

export type SkillProgression = 'standard' | 'fast' | 'slow'

export function skillXpCosts(progression: SkillProgression): readonly number[] {
  return progression === 'fast' ? FAST_SKILL_XP_COSTS : progression === 'slow' ? SLOW_SKILL_XP_COSTS : STANDARD_SKILL_XP_COSTS
}

export function characterSkillProgression(character: CharacterDefinition): SkillProgression {
  if (character.traits.some((entry) => entry.traitId === 'trait.fast-learner' && entry.active)) return 'fast'
  if (character.traits.some((entry) => entry.traitId === 'trait.slow-learner' && entry.active)) return 'slow'
  return 'standard'
}

export function deriveSkillLevel(xp: number, progression: SkillProgression = 'standard'): number | null {
  const costs = skillXpCosts(progression)
  if (!Number.isFinite(xp) || xp < costs[0]) return null
  let level = 0
  costs.forEach((threshold, index) => { if (xp >= threshold) level = index })
  return level
}

export const deriveStandardSkillLevel = (xp: number): number | null => deriveSkillLevel(xp, 'standard')

export function standardSkillThreshold(level: number | null): number {
  return level === null ? 0 : STANDARD_SKILL_XP_COSTS[level]
}

export function skillThreshold(level: number | null, progression: SkillProgression = 'standard'): number {
  return level === null ? 0 : skillXpCosts(progression)[level]
}

export function negativeTraitXpPurchaseCap(startingXp: number): number {
  return Math.floor(startingXp * 0.1)
}

export function getOptimizationPreview(character: CharacterDefinition): OptimizationOpportunity[] {
  if (character.creation.method !== 'life-modules') return []
  const opportunities: OptimizationOpportunity[] = []

  for (const attribute of character.attributes) {
    if (attribute.accumulatedXp <= 0) continue
    const legality = attributeLegality(character, attribute.attributeId)
    const attainedXp = deriveAttributeLevel(attribute.accumulatedXp)! * 100
    const targetXp = Math.min(attainedXp, legality.effectiveMaximum * 100)
    if (targetXp < attribute.accumulatedXp) opportunities.push(opportunity(
      { type: 'attribute', targetId: attribute.attributeId, displayName: attribute.attributeId },
      attribute.accumulatedXp,
      targetXp,
      attainedXp > legality.effectiveMaximum * 100 ? 'modeled-maximum' : 'excess-xp',
    ))
  }

  for (const trait of character.traits) {
    const target = optimizedTraitXp(trait)
    if (target === null || target === trait.accumulatedXp) continue
    opportunities.push(opportunity(
      { type: 'trait', targetId: trait.traitId, displayName: trait.displayName ?? trait.traitId, parameters: { ...trait.parameters } },
      trait.accumulatedXp,
      target,
      NEGATIVE_TRAIT_IDS.has(trait.traitId) && trait.accumulatedXp > 0
        ? 'negative-trait-positive-xp'
        : traitMaximumExceeded(trait)
          ? 'modeled-maximum'
          : trait.accumulatedXp < 0
            ? 'negative-trait-threshold'
            : 'excess-xp',
    ))
  }

  const progression = characterSkillProgression(character)
  for (const skill of character.skills) {
    if (skill.accumulatedXp <= 0) continue
    const targetXp = skillThreshold(deriveSkillLevel(skill.accumulatedXp, progression), progression)
    if (targetXp < skill.accumulatedXp) opportunities.push(opportunity(
      skillDestination(skill), skill.accumulatedXp, targetXp, 'excess-xp',
    ))
  }
  return opportunities
}

export function getModeledOpposedTraitConflicts(character: CharacterDefinition): OpposedTraitConflict[] {
  const conflicts: OpposedTraitConflict[] = MODELED_OPPOSED_TRAIT_PAIRS.flatMap(([positiveTraitId, negativeTraitId, description]) => {
    const positive = character.traits.some((entry) => entry.traitId === positiveTraitId && entry.accumulatedXp > 0)
    const negative = character.traits.some((entry) => entry.traitId === negativeTraitId && entry.accumulatedXp < 0)
    return positive && negative ? [{ id: `${positiveTraitId}/${negativeTraitId}`, positiveTraitId, negativeTraitId, description }] : []
  })
  const illiterate = character.traits.some((entry) => entry.traitId === 'trait.illiterate' && entry.active)
  const languageFour = character.skills.some((entry) => entry.address.skillId === 'skill.language' && (entry.level ?? -1) >= 4)
  if (illiterate && languageFour) conflicts.push({
    id: 'skill.language-4/trait.illiterate',
    positiveTraitId: 'skill.language-4',
    negativeTraitId: 'trait.illiterate',
    description: 'Illiterate conflicts with possessing any Language Skill at Level +4 or higher.',
  })
  return conflicts
}

export function traitModeledRange(traitId: string): { minimum: number; maximum: number } | null {
  const definition = POINT_BUY_TRAITS.find((entry) => entry.id === traitId)
  if (!definition) return null
  return { minimum: Math.min(...definition.allowedTp), maximum: Math.max(...definition.allowedTp) }
}

export function getFinalReviewBlockers(character: CharacterDefinition): FinalReviewBlocker[] {
  const state = character.creation.lifeModules
  const review = state?.finalReview
  if (character.creation.method !== 'life-modules' || !state || !review) return [{ id: 'final-review.required', message: 'Life Module final review has not been initialized.' }]
  const blockers: FinalReviewBlocker[] = []
  if (state.pendingAwards.length > 0) blockers.push({ id: 'pending-awards', message: 'All pending module awards must be resolved.' })
  if (review.allocationPool.remaining !== 0) blockers.push({ id: 'unallocated-xp', message: `${review.allocationPool.remaining} final-allocation XP remains unspent.` })
  if (state.prerequisiteIssues.some((entry) => entry.status === 'outstanding')) blockers.push({ id: 'prerequisites', message: 'One or more final prerequisites remain outstanding.' })
  if (getOptimizationPreview(character).length > 0) blockers.push({ id: 'optimization', message: 'Optimization opportunities remain unresolved.' })
  if (getModeledOpposedTraitConflicts(character).length > 0) blockers.push({ id: 'opposed-traits', message: 'Modeled opposed Traits must be resolved before Optimization is complete.' })
  if (character.attributes.some((entry) => (deriveAttributeLevel(entry.accumulatedXp) ?? 0) < 1)) blockers.push({ id: 'attribute-minimum', message: 'Every Attribute must attain a score of at least 1.' })
  if (character.attributes.some((entry) => !attributeLegality(character, entry.attributeId).legal)) blockers.push({ id: 'attribute-legality', message: 'One or more Attributes exceed the legal phenotype or Exceptional Attribute maximum.' })
  if (character.traits.some((entry) => isModeledNegativeTrait(entry.traitId) && entry.accumulatedXp > 0)) blockers.push({ id: 'negative-trait-positive-xp', message: 'A modeled negative Trait has positive XP and must be removed through explicit Optimization.' })
  if ((review.specialties ?? []).some((entry) => entry.state === 'proposed' && entry.gmApproval === 'required')) blockers.push({ id: 'specialty-gm-approval', message: 'One or more proposed Skill specialties require explicit GM approval.' })
  return blockers
}

export function isModeledNegativeTrait(traitId: string): boolean {
  return NEGATIVE_TRAIT_IDS.has(traitId)
}

export function finalReviewDestinationKey(destination: ResolvedLifeModuleDestination): string {
  return `${destination.type}/${destination.targetId}/${destination.parameter?.kind ?? ''}/${destination.parameter?.value.toLowerCase() ?? ''}/${JSON.stringify(destination.parameters ?? {})}`
}

function optimizedTraitXp(trait: TraitLedgerEntry): number | null {
  const xp = trait.accumulatedXp
  if (NEGATIVE_TRAIT_IDS.has(trait.traitId)) {
    if (xp > 0) return 0
    if (xp < 0) return -Math.ceil(Math.abs(xp) / 100) * 100
    return null
  }
  if (SIGNED_TRAIT_IDS.has(trait.traitId)) {
    if (xp < 0) return -Math.ceil(Math.abs(xp) / 100) * 100
    return cappedPositiveTraitXp(trait)
  }
  if (xp > 0) return cappedPositiveTraitXp(trait)
  return null
}

function cappedPositiveTraitXp(trait: TraitLedgerEntry): number {
  const fullyAttained = Math.floor(trait.accumulatedXp / 100) * 100
  const range = traitModeledRange(trait.traitId)
  return range ? Math.min(fullyAttained, Math.max(0, range.maximum) * 100) : fullyAttained
}

function traitMaximumExceeded(trait: TraitLedgerEntry): boolean {
  const range = traitModeledRange(trait.traitId)
  return range !== null && trait.accumulatedXp > Math.max(0, range.maximum) * 100
}

function skillDestination(skill: SkillLedgerEntry): ResolvedLifeModuleDestination {
  return {
    type: 'skill',
    targetId: skill.address.skillId,
    displayName: skill.displayName ?? skill.address.skillId,
    ...(skill.address.parameter ? { parameter: { ...skill.address.parameter } } : {}),
  }
}

function opportunity(
  destination: ResolvedLifeModuleDestination,
  beforeXp: number,
  afterXp: number,
  reason: OptimizationOpportunity['reason'],
): OptimizationOpportunity {
  return {
    id: finalReviewDestinationKey(destination),
    destination,
    beforeXp,
    afterXp,
    returnedXp: Math.abs(beforeXp - afterXp),
    reason,
  }
}
