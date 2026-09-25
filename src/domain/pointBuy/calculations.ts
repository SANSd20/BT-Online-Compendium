import type { ArchetypeAllocationSnapshot, CharacterDefinition } from '../character/model'

export function standardAttributeXpCost(level: number): number {
  if (!Number.isInteger(level) || level < 1) {
    throw new RangeError('Attribute level must be a positive integer.')
  }
  return level * 100
}

export function calculateArchetypeAdjustmentNetXp(character: CharacterDefinition): number {
  return character.creation.archetype?.adjustmentLedger.reduce((total, entry) => total + entry.xpDelta, 0) ?? 0
}

export function evaluateSharedXpAccounting(character: CharacterDefinition): ArchetypeAllocationSnapshot {
  const attributeXp = character.attributes.reduce((total, entry) => total + entry.accumulatedXp, 0)
  const traitXp = character.traits.reduce((total, entry) => total + entry.accumulatedXp, 0)
  const skillXp = character.skills.reduce((total, entry) => total + entry.accumulatedXp, 0)
  return {
    attributeXp,
    traitXp,
    skillXp,
    totalXp: attributeXp + traitXp + skillXp,
  }
}

export function calculatePointBuyAllocatedXp(character: CharacterDefinition): number {
  return evaluateSharedXpAccounting(character).totalXp
}

export function calculateNegativeTraitXp(character: CharacterDefinition): number {
  return character.traits.reduce((total, entry) => total + Math.max(0, -entry.accumulatedXp), 0)
}
