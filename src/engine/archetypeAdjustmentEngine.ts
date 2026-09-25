import { getCoreArchetype } from '../domain/archetypes/coreArchetypes'
import type { ArchetypeDefinition, ArchetypeSkill } from '../domain/archetypes/model'
import {
  archetypeSkillAddressId,
  findKnownSafeSkillSwapTarget,
  getKnownSafeSkillSwapTargets,
  isKnownSafeSkillSwapSource,
  type KnownSafeSkillSwapTarget,
} from '../domain/archetypes/skillSwapTargets'
import type {
  ArchetypeAdjustmentRecord,
  CharacterDefinition,
  SkillAddress,
  XpAward,
} from '../domain/character/model'
import { standardSkillXpCost } from '../domain/pointBuy/catalog'
import {
  calculateArchetypeAdjustmentNetXp,
  evaluateSharedXpAccounting,
  standardAttributeXpCost,
} from '../domain/pointBuy/calculations'

export interface ArchetypeAdjustmentDependencies {
  now: () => string
  id: () => string
}

export interface ArchetypeAdjustmentBalance {
  positiveXp: number
  negativeXp: number
  netXp: number
  balanced: boolean
}

export function getArchetypeAdjustmentBalance(character: CharacterDefinition): ArchetypeAdjustmentBalance {
  const ledger = requireArchetypeFoundation(character).adjustmentLedger
  const positiveXp = ledger.reduce((total, entry) => total + Math.max(0, entry.xpDelta), 0)
  const negativeXp = ledger.reduce((total, entry) => total + Math.min(0, entry.xpDelta), 0)
  const netXp = calculateArchetypeAdjustmentNetXp(character)
  return { positiveXp, negativeXp, netXp, balanced: netXp === 0 }
}

export function setArchetypeAttributeAdjustment(
  character: CharacterDefinition,
  attributeId: string,
  afterLevel: number,
  note?: string,
  dependencies: ArchetypeAdjustmentDependencies = defaultDependencies,
): CharacterDefinition {
  const state = requireArchetypeFoundation(character)
  const definition = getCoreArchetype(state.archetypeId)
  const source = definition.attributes.find((entry) => entry.attributeId === attributeId)
  if (!source) throw new Error(`Attribute is not part of the selected Archetype foundation: ${attributeId}`)
  if (!Number.isInteger(afterLevel) || afterLevel < 1 || afterLevel > 10) {
    throw new RangeError(`${attributeId} must be an integer from 1 through 10.`)
  }
  return setAdjustment(character, {
    targetType: 'attribute',
    targetId: attributeId,
    beforeValue: source.purchasedLevel,
    afterValue: afterLevel,
    beforeXp: standardAttributeXpCost(source.purchasedLevel),
    afterXp: standardAttributeXpCost(afterLevel),
    note,
  }, dependencies)
}

export function setArchetypeSkillAdjustment(
  character: CharacterDefinition,
  targetId: string,
  afterLevel: number,
  note?: string,
  dependencies: ArchetypeAdjustmentDependencies = defaultDependencies,
): CharacterDefinition {
  const state = requireArchetypeFoundation(character)
  const definition = getCoreArchetype(state.archetypeId)
  const source = definition.skills.find((entry) => archetypeSkillTargetId(entry.address) === targetId)
  if (!source) throw new Error(`Skill is not part of the selected Archetype foundation: ${targetId}`)
  if (state.adjustmentLedger.some((entry) => entry.operation === 'skill-swap' && entry.targetId === targetId)) {
    throw new Error('Remove the Skill swap before changing the source Skill level.')
  }
  if (!Number.isInteger(afterLevel) || afterLevel < 0 || afterLevel > 10) {
    throw new RangeError('Adjusted Skill level must be an integer from 0 through 10.')
  }
  return setAdjustment(character, {
    targetType: 'skill',
    targetId,
    beforeValue: source.level,
    afterValue: afterLevel,
    beforeXp: standardSkillXpCost(source.level),
    afterXp: standardSkillXpCost(afterLevel),
    note,
  }, dependencies)
}

export function swapArchetypeSkill(
  character: CharacterDefinition,
  sourceTargetId: string,
  replacementTargetId: string,
  note?: string,
  dependencies: ArchetypeAdjustmentDependencies = defaultDependencies,
): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireArchetypeFoundation(next)
  const definition = getCoreArchetype(state.archetypeId)
  const source = definition.skills.find((entry) => archetypeSkillTargetId(entry.address) === sourceTargetId)
  if (!source) throw new Error(`Skill is not part of the selected Archetype foundation: ${sourceTargetId}`)
  if (!isKnownSafeSkillSwapSource(definition.id, sourceTargetId)) {
    throw new Error('This source Skill is not eligible for a safe swap because its identity, specialty, subskill, or XP accounting is not unambiguous.')
  }
  if (state.adjustmentLedger.some((entry) => entry.targetId === sourceTargetId)) {
    throw new Error('Remove the existing adjustment for this source Skill before swapping it.')
  }
  const replacement = findKnownSafeSkillSwapTarget(definition.id, sourceTargetId, replacementTargetId)
  if (!replacement) {
    throw new Error('Replacement Skill is not an audited, unambiguous, XP-equivalent target for this source Skill.')
  }
  if (next.skills.some((entry) => archetypeSkillTargetId(entry.address) === replacement.targetId)) {
    throw new Error('The replacement Skill is already present in the character ledger.')
  }
  const sourceEntry = next.skills.find((entry) => archetypeSkillTargetId(entry.address) === sourceTargetId)
  const sourceAward = sourceEntry?.sourceAwards.find((award) => award.provenanceId === state.foundationProvenanceId && award.xp === source.xp)
  if (!sourceEntry || !sourceAward || sourceEntry.level !== source.level || sourceEntry.accumulatedXp !== source.xp) {
    throw new Error('The source Skill no longer matches its unchanged Archetype foundation allocation.')
  }

  const now = dependencies.now()
  const provenanceId = dependencies.id()
  const awardId = dependencies.id()
  const adjustment: ArchetypeAdjustmentRecord = {
    id: dependencies.id(),
    targetType: 'skill',
    targetId: sourceTargetId,
    operation: 'skill-swap',
    beforeValue: source.level,
    afterValue: replacement.level,
    beforeXp: standardSkillXpCost(source.level),
    afterXp: standardSkillXpCost(replacement.level),
    xpDelta: 0,
    sourceFoundationId: state.foundationProvenanceId,
    provenanceId,
    awardId,
    createdAt: now,
    modifiedAt: now,
    sourceSkill: {
      targetId: sourceTargetId,
      address: cloneSkillAddress(source.address),
      displayName: source.displayName,
      level: source.level,
      xp: source.xp,
      sourceAwardId: sourceAward.id,
    },
    replacementSkill: {
      targetId: replacement.targetId,
      address: cloneSkillAddress(replacement.address),
      displayName: replacement.displayName,
      level: replacement.level,
      xp: replacement.xp,
      catalogArchetypeId: replacement.catalogArchetypeId,
      catalogSource: { ...replacement.catalogSource },
    },
    ...(note?.trim() ? { note: note.trim() } : {}),
  }
  next.provenance.push({
    id: provenanceId,
    kind: 'player-choice',
    description: `Controlled Archetype Skill swap: ${source.displayName} → ${replacement.displayName}`,
    source: { ...state.source },
  })
  applyAdjustment(next, adjustment)
  state.adjustmentLedger.push(adjustment)
  return synchronize(next)
}

export function getArchetypeSkillSwapTargets(
  character: CharacterDefinition,
  sourceTargetId: string,
): KnownSafeSkillSwapTarget[] {
  const state = requireArchetypeFoundation(character)
  if (state.adjustmentLedger.some((entry) => entry.targetId === sourceTargetId)) return []
  const usedReplacementIds = new Set(state.adjustmentLedger
    .filter((entry) => entry.operation === 'skill-swap')
    .map((entry) => entry.replacementSkill.targetId))
  return getKnownSafeSkillSwapTargets(state.archetypeId, sourceTargetId)
    .filter((entry) => !usedReplacementIds.has(entry.targetId))
}

export function removeArchetypeAdjustment(
  character: CharacterDefinition,
  adjustmentId: string,
): CharacterDefinition {
  const state = requireArchetypeFoundation(character)
  const adjustment = state.adjustmentLedger.find((entry) => entry.id === adjustmentId)
  if (!adjustment) throw new Error(`Unknown Archetype adjustment: ${adjustmentId}`)
  return removeAdjustment(structuredClone(character), adjustment)
}

export function archetypeSkillTargetId(address: SkillAddress): string {
  return archetypeSkillAddressId(address)
}

export function getArchetypeSkillDefinition(
  character: CharacterDefinition,
  targetId: string,
): ArchetypeSkill | undefined {
  const state = requireArchetypeFoundation(character)
  return getCoreArchetype(state.archetypeId).skills.find((entry) => archetypeSkillTargetId(entry.address) === targetId)
}

function setAdjustment(
  character: CharacterDefinition,
  values: Pick<ArchetypeAdjustmentRecord, 'targetType' | 'targetId' | 'beforeValue' | 'afterValue' | 'beforeXp' | 'afterXp'> & { note?: string },
  dependencies: ArchetypeAdjustmentDependencies,
): CharacterDefinition {
  let next = structuredClone(character)
  const state = requireArchetypeFoundation(next)
  const existing = state.adjustmentLedger.find((entry) => entry.targetType === values.targetType && entry.targetId === values.targetId)
  if (existing) next = removeAdjustment(next, existing)
  if (values.afterValue === values.beforeValue) return synchronize(next)

  const updatedState = requireArchetypeFoundation(next)
  const now = dependencies.now()
  const provenanceId = dependencies.id()
  const awardId = dependencies.id()
  const adjustment: ArchetypeAdjustmentRecord = {
    id: existing?.id ?? dependencies.id(),
    targetType: values.targetType,
    targetId: values.targetId,
    operation: values.afterValue > values.beforeValue ? 'increase' : 'decrease',
    beforeValue: values.beforeValue,
    afterValue: values.afterValue,
    beforeXp: values.beforeXp,
    afterXp: values.afterXp,
    xpDelta: values.afterXp - values.beforeXp,
    sourceFoundationId: updatedState.foundationProvenanceId,
    provenanceId,
    awardId,
    createdAt: existing?.createdAt ?? now,
    modifiedAt: now,
    ...(values.note?.trim() ? { note: values.note.trim() } : {}),
  }
  next.provenance.push({
    id: provenanceId,
    kind: 'player-choice',
    description: `Controlled Archetype ${adjustment.targetType} ${adjustment.operation}: ${adjustment.targetId}`,
    source: { ...updatedState.source },
  })
  applyAdjustment(next, adjustment)
  updatedState.adjustmentLedger.push(adjustment)
  return synchronize(next)
}

function applyAdjustment(character: CharacterDefinition, adjustment: ArchetypeAdjustmentRecord): void {
  if (adjustment.operation === 'skill-swap') {
    const index = character.skills.findIndex((candidate) => archetypeSkillTargetId(candidate.address) === adjustment.sourceSkill.targetId)
    if (index < 0) throw new Error(`Skill swap source is missing: ${adjustment.sourceSkill.targetId}`)
    character.skills[index] = {
      address: cloneSkillAddress(adjustment.replacementSkill.address),
      displayName: adjustment.replacementSkill.displayName,
      accumulatedXp: adjustment.replacementSkill.xp,
      level: adjustment.replacementSkill.level,
      sourceAwards: [{ id: adjustment.awardId, xp: adjustment.replacementSkill.xp, provenanceId: adjustment.provenanceId }],
    }
    return
  }
  const award: XpAward = { id: adjustment.awardId, xp: adjustment.xpDelta, provenanceId: adjustment.provenanceId }
  if (adjustment.targetType === 'attribute') {
    const entry = character.attributes.find((candidate) => candidate.attributeId === adjustment.targetId)
    if (!entry) throw new Error(`Adjusted Attribute is missing: ${adjustment.targetId}`)
    entry.purchasedLevel = adjustment.afterValue
    entry.accumulatedXp += adjustment.xpDelta
    entry.sourceAwards.push(award)
    return
  }
  const entry = character.skills.find((candidate) => archetypeSkillTargetId(candidate.address) === adjustment.targetId)
  if (!entry) throw new Error(`Adjusted Skill is missing: ${adjustment.targetId}`)
  entry.level = adjustment.afterValue
  entry.accumulatedXp += adjustment.xpDelta
  entry.sourceAwards.push(award)
}

function removeAdjustment(character: CharacterDefinition, adjustment: ArchetypeAdjustmentRecord): CharacterDefinition {
  const state = requireArchetypeFoundation(character)
  const definition = getCoreArchetype(state.archetypeId)
  if (adjustment.operation === 'skill-swap') {
    const source = definition.skills.find((entry) => archetypeSkillTargetId(entry.address) === adjustment.sourceSkill.targetId)
    const index = character.skills.findIndex((candidate) => archetypeSkillTargetId(candidate.address) === adjustment.replacementSkill.targetId)
    if (!source || index < 0) throw new Error(`Skill swap is missing: ${adjustment.sourceSkill.targetId}`)
    character.skills[index] = {
      address: cloneSkillAddress(source.address),
      displayName: source.displayName,
      accumulatedXp: source.xp,
      level: source.level,
      ...(source.specialty ? { specialty: source.specialty } : {}),
      ...(source.notes ? { notes: [...source.notes] } : {}),
      sourceAwards: [{ id: adjustment.sourceSkill.sourceAwardId, xp: source.xp, provenanceId: state.foundationProvenanceId }],
    }
  } else if (adjustment.targetType === 'attribute') {
    const source = definition.attributes.find((entry) => entry.attributeId === adjustment.targetId)
    const entry = character.attributes.find((candidate) => candidate.attributeId === adjustment.targetId)
    if (!source || !entry) throw new Error(`Adjusted Attribute is missing: ${adjustment.targetId}`)
    entry.purchasedLevel = source.purchasedLevel
    entry.accumulatedXp = source.xp
    entry.sourceAwards = entry.sourceAwards.filter((award) => award.id !== adjustment.awardId)
  } else {
    const source = definition.skills.find((entry) => archetypeSkillTargetId(entry.address) === adjustment.targetId)
    const entry = character.skills.find((candidate) => archetypeSkillTargetId(candidate.address) === adjustment.targetId)
    if (!source || !entry) throw new Error(`Adjusted Skill is missing: ${adjustment.targetId}`)
    entry.level = source.level
    entry.accumulatedXp = source.xp
    entry.sourceAwards = entry.sourceAwards.filter((award) => award.id !== adjustment.awardId)
  }
  state.adjustmentLedger = state.adjustmentLedger.filter((entry) => entry.id !== adjustment.id)
  character.provenance = character.provenance.filter((entry) => entry.id !== adjustment.provenanceId)
  return synchronize(character)
}

function cloneSkillAddress(address: SkillAddress): SkillAddress {
  return {
    skillId: address.skillId,
    ...(address.parameter ? { parameter: { ...address.parameter } } : {}),
  }
}

function synchronize(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireArchetypeFoundation(next)
  const evaluation = evaluateSharedXpAccounting(next)
  state.accounting.evaluatedAllocation = evaluation
  state.accounting.differenceFromPublishedXp = evaluation.totalXp - state.accounting.publishedXpTotal
  state.customizationStatus = state.adjustmentLedger.length === 0 ? 'original-package' : 'controlled-adjustments'
  next.xp.creation.allocated = evaluation.totalXp
  next.xp.creation.remaining = 0
  next.creation.status = getArchetypeAdjustmentBalance(next).balanced ? 'ready-for-final-validation' : 'draft'
  next.updatedAt = new Date().toISOString()
  return next
}

function requireArchetypeFoundation(character: CharacterDefinition) {
  if (character.creation.method !== 'archetype' || !character.creation.archetype) {
    throw new Error('Controlled Archetype adjustments require an Archetype-derived character.')
  }
  return character.creation.archetype
}

function defaultId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `archetype-adjustment-${Date.now()}-${Math.random()}`
}

const defaultDependencies: ArchetypeAdjustmentDependencies = {
  now: () => new Date().toISOString(),
  id: defaultId,
}

export function getArchetypeDefinition(character: CharacterDefinition): ArchetypeDefinition {
  return getCoreArchetype(requireArchetypeFoundation(character).archetypeId)
}
