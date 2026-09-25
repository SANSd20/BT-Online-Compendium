import {
  POINT_BUY_ATTRIBUTE_MAXIMUMS,
  POINT_BUY_RULES_SOURCE,
  XP_COST_TABLE_SOURCE,
  getPointBuySkill,
  getPointBuyTrait,
  standardSkillXpCost,
} from '../domain/pointBuy/catalog'
import { calculateNegativeTraitXp, calculatePointBuyAllocatedXp, standardAttributeXpCost } from '../domain/pointBuy/calculations'
import type { CharacterDefinition, SkillAddress, XpAward } from '../domain/character/model'
import { createCharacterDraft, type CharacterFactoryDependencies } from './characterFactory'

const ATTRIBUTE_IDS = Object.keys(POINT_BUY_ATTRIBUTE_MAXIMUMS)

export function createPointBuyCharacter(
  displayName: string,
  startingXp = 5000,
  dependencies?: CharacterFactoryDependencies,
): CharacterDefinition {
  if (!Number.isInteger(startingXp) || startingXp < ATTRIBUTE_IDS.length * 100) {
    throw new RangeError('Starting XP must be a whole number sufficient to purchase all eight Attributes at Level 1 (800 XP minimum).')
  }

  const character = createCharacterDraft('point-buy', displayName, dependencies)
  const rulesProvenanceId = dependencies?.id() ?? defaultId()
  const costProvenanceId = dependencies?.id() ?? defaultId()
  character.creation.pointBuy = {
    source: { ...POINT_BUY_RULES_SOURCE },
    costTableSource: { ...XP_COST_TABLE_SOURCE },
    rulesProvenanceId,
    costProvenanceId,
    startingAllotment: startingXp === 5000 ? 'standard' : 'gm-adjusted',
    limitations: [
      'Normal Human phenotype only in Point Buy v0.1.',
      'The Skill and Trait catalogs are deliberately limited in this slice.',
      'Partial XP allocation, multiple instances of one Trait, Fast/Slow Learner costs, specialties, equipment purchasing, and exhaustive legality checks are deferred.',
    ],
  }
  character.provenance.push(
    {
      id: rulesProvenanceId,
      kind: 'published',
      description: 'Point Buy character creation rules',
      source: { ...POINT_BUY_RULES_SOURCE },
    },
    {
      id: costProvenanceId,
      kind: 'published',
      description: 'Point Buy XP costs',
      source: { ...XP_COST_TABLE_SOURCE },
    },
  )
  character.attributes = ATTRIBUTE_IDS.map((attributeId) => ({
    attributeId,
    accumulatedXp: 100,
    purchasedLevel: 1,
    phenotypeModifier: 0,
    sourceAwards: [award(100, costProvenanceId, dependencies)],
  }))
  character.cBills = 1000
  character.xp.creation.starting = startingXp
  character.creation.status = 'draft'
  return synchronizePointBuyXp(character)
}

export function setPointBuyAttribute(
  character: CharacterDefinition,
  attributeId: string,
  level: number,
): CharacterDefinition {
  assertPointBuy(character)
  const maximum = POINT_BUY_ATTRIBUTE_MAXIMUMS[attributeId]
  if (maximum === undefined) throw new Error(`Unknown Attribute ID: ${attributeId}`)
  if (!Number.isInteger(level) || level < 1 || level > maximum) {
    throw new RangeError(`${attributeId} must be an integer from 1 through ${maximum} for a Normal Human.`)
  }
  const next = structuredClone(character)
  const entry = next.attributes.find((attribute) => attribute.attributeId === attributeId)
  if (!entry) throw new Error(`Point Buy character is missing Attribute: ${attributeId}`)
  entry.purchasedLevel = level
  entry.accumulatedXp = standardAttributeXpCost(level)
  entry.sourceAwards = [award(entry.accumulatedXp, requirePointBuy(next).costProvenanceId)]
  return enforceBudget(synchronizePointBuyXp(next))
}

export function setPointBuySkill(
  character: CharacterDefinition,
  skillId: string,
  level: number | null,
  subskill?: string,
): CharacterDefinition {
  assertPointBuy(character)
  const definition = getPointBuySkill(skillId)
  const normalizedSubskill = subskill?.trim()
  if (definition.parameter?.required && !normalizedSubskill) {
    throw new Error(`${definition.displayName} requires a concrete subskill.`)
  }
  if (!definition.parameter && normalizedSubskill) {
    throw new Error(`${definition.displayName} does not accept a subskill.`)
  }
  const next = structuredClone(character)
  const address: SkillAddress = {
    skillId,
    ...(normalizedSubskill ? { parameter: { kind: 'subskill', value: normalizedSubskill } } : {}),
  }
  const key = skillKey(address)
  const existingIndex = next.skills.findIndex((entry) => skillKey(entry.address) === key)
  if (level === null) {
    const entry = {
      address,
      displayName: normalizedSubskill ? `${definition.displayName}/${normalizedSubskill}` : definition.displayName,
      accumulatedXp: 0,
      level: null,
      sourceAwards: [award(0, requirePointBuy(next).costProvenanceId)],
    }
    if (existingIndex >= 0) next.skills[existingIndex] = entry
    else next.skills.push(entry)
    return synchronizePointBuyXp(next)
  }
  const xp = standardSkillXpCost(level)
  const entry = {
    address,
    displayName: normalizedSubskill ? `${definition.displayName}/${normalizedSubskill}` : definition.displayName,
    accumulatedXp: xp,
    level,
    sourceAwards: [award(xp, requirePointBuy(next).costProvenanceId)],
  }
  if (existingIndex >= 0) next.skills[existingIndex] = entry
  else next.skills.push(entry)
  return enforceBudget(synchronizePointBuyXp(next))
}

export function setPointBuyTrait(
  character: CharacterDefinition,
  traitId: string,
  tp: number | null,
  parameter?: string,
): CharacterDefinition {
  assertPointBuy(character)
  const definition = getPointBuyTrait(traitId)
  const next = structuredClone(character)
  const existingIndex = next.traits.findIndex((entry) => entry.traitId === traitId)
  if (tp === null) {
    if (existingIndex >= 0) next.traits.splice(existingIndex, 1)
    return synchronizePointBuyXp(next)
  }
  if (!definition.allowedTp.includes(tp)) {
    throw new RangeError(`${definition.displayName} does not allow ${tp} TP in the Point Buy v0.1 catalog.`)
  }
  const normalizedParameter = parameter?.trim()
  if (definition.parameter?.required && !normalizedParameter) {
    throw new Error(`${definition.displayName} requires a concrete ${definition.parameter.label.toLowerCase()}.`)
  }
  const xp = tp * 100
  const entry = {
    traitId,
    displayName: definition.displayName,
    accumulatedXp: xp,
    attainedTp: tp,
    active: true,
    ...(definition.identityBound ? { identityId: next.identities.primaryIdentityId } : {}),
    parameters: definition.parameter && normalizedParameter
      ? { [definition.parameter.key]: normalizedParameter }
      : {},
    sourceAwards: [award(xp, requirePointBuy(next).costProvenanceId)],
  }
  if (existingIndex >= 0) next.traits[existingIndex] = entry
  else next.traits.push(entry)

  const negativeXp = calculateNegativeTraitXp(next)
  const ceiling = Math.floor(next.xp.creation.starting * 0.1)
  if (negativeXp > ceiling) {
    throw new RangeError(`Negative Traits may generate at most ${ceiling} XP for this starting allotment.`)
  }
  return enforceBudget(synchronizePointBuyXp(next))
}

function synchronizePointBuyXp(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  next.xp.creation.allocated = calculatePointBuyAllocatedXp(next)
  next.xp.creation.remaining = next.xp.creation.starting - next.xp.creation.allocated
  return next
}

function enforceBudget(character: CharacterDefinition): CharacterDefinition {
  if (character.xp.creation.remaining < 0) {
    throw new RangeError('This purchase would overspend the remaining creation XP.')
  }
  return character
}

function assertPointBuy(character: CharacterDefinition): void {
  requirePointBuy(character)
}

function requirePointBuy(character: CharacterDefinition) {
  if (character.creation.method !== 'point-buy' || !character.creation.pointBuy) {
    throw new Error('Point Buy operations require a Point Buy character.')
  }
  return character.creation.pointBuy
}

function skillKey(address: SkillAddress): string {
  return `${address.skillId}/${address.parameter?.kind ?? ''}/${address.parameter?.value.toLowerCase() ?? ''}`
}

function award(xp: number, provenanceId: string, dependencies?: CharacterFactoryDependencies): XpAward {
  return { id: dependencies?.id() ?? defaultId(), xp, provenanceId }
}

function defaultId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `point-buy-${Date.now()}-${Math.random()}`
}
