import type { CharacterDefinition } from '../character/model'

export function calculatePointBuyAllocatedXp(character: CharacterDefinition): number {
  return [...character.attributes, ...character.traits, ...character.skills]
    .reduce((total, entry) => total + entry.accumulatedXp, 0)
}

export function calculateNegativeTraitXp(character: CharacterDefinition): number {
  return character.traits.reduce((total, entry) => total + Math.max(0, -entry.accumulatedXp), 0)
}
