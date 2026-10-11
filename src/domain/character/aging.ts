import type { CharacterDefinition, TraitLedgerEntry } from './model'
import { deriveAttributeLevel } from '../lifeModules/finalReview'
import { deriveStasisBiologicalAgeYears, deriveStasisChronologicalYears } from './stasis'

export const AGING_SOURCE = 'AToW Corrected Third Printing pp. 332-333'
export const AGING_THRESHOLDS = [25, 31, 41, 51, 61, 71, 81, 91, 101] as const

type AttributeId = 'STR' | 'BOD' | 'DEX' | 'RFL' | 'INT' | 'WIL' | 'CHA'
export interface AgingBracket {
  age: number
  attributeXp: Partial<Record<AttributeId, number>>
  traitEffects: Array<{ traitId: string; displayName: string; xp: number; condition?: 'clan' }>
}

export interface AgingDerivation {
  age: number
  brackets: AgingBracket[]
  attributeXpAdjustments: Record<string, number>
  traitXpAdjustments: Record<string, number>
  traits: Array<{ traitId: string; displayName: string; xp: number; condition?: 'clan' }>
  unsupported: string[]
  legal: boolean
}

const brackets: AgingBracket[] = [
  { age: 25, attributeXp: { STR: 50, BOD: 50, RFL: 50, INT: 50, WIL: 50, CHA: 50 }, traitEffects: [] },
  { age: 31, attributeXp: { STR: 50, BOD: 50, RFL: 50, INT: 50 }, traitEffects: [{ traitId: 'trait.reputation', displayName: 'Reputation', xp: -150, condition: 'clan' }] },
  { age: 41, attributeXp: { DEX: -50, WIL: 25, CHA: -25 }, traitEffects: [] },
  { age: 51, attributeXp: { BOD: -100, RFL: -100, CHA: -50 }, traitEffects: [{ traitId: 'trait.reputation', displayName: 'Reputation', xp: -300, condition: 'clan' }] },
  { age: 61, attributeXp: { STR: -100, BOD: -100, DEX: -100, INT: 50, CHA: -50 }, traitEffects: [{ traitId: 'trait.slow-learner', displayName: 'Slow Learner', xp: -300 }] },
  { age: 71, attributeXp: { STR: -100, BOD: -125, RFL: -100, WIL: -50, CHA: -75 }, traitEffects: [{ traitId: 'trait.glass-jaw', displayName: 'Glass Jaw', xp: -300 }] },
  { age: 81, attributeXp: { STR: -150, BOD: -150, DEX: -100, RFL: -100, INT: -100, WIL: -50, CHA: -100 }, traitEffects: [] },
  { age: 91, attributeXp: { STR: -150, BOD: -175, DEX: -150, RFL: -125, INT: -150, WIL: -100, CHA: -100 }, traitEffects: [] },
  { age: 101, attributeXp: { STR: -200, BOD: -200, DEX: -200, RFL: -150, INT: -200, WIL: -100, CHA: -150 }, traitEffects: [] },
]

export function deriveCharacterAge(character: CharacterDefinition): number {
  const ages = character.chronology.map((entry) => /^age:(\d+(?:\.\d+)?)$/.exec(entry.date)?.[1]).filter(Boolean).map(Number)
  return (ages.length ? Math.max(...ages) : 16) + deriveStasisChronologicalYears(character)
}

export function deriveBiologicalAge(character: CharacterDefinition): number {
  const ages = character.chronology.map((entry) => /^age:(\d+(?:\.\d+)?)$/.exec(entry.date)?.[1]).filter(Boolean).map(Number)
  return (ages.length ? Math.max(...ages) : 16) + deriveStasisBiologicalAgeYears(character)
}

function isClan(character: CharacterDefinition): boolean {
  return character.affiliations.some((entry) => entry.affiliationId.toLowerCase().includes('clan'))
    || character.phenotypeId.toLowerCase().includes('clan')
}

export function deriveAging(character: CharacterDefinition, age = deriveBiologicalAge(character)): AgingDerivation {
  const applicable = brackets.filter((entry) => age >= entry.age)
  const attributeXpAdjustments: Record<string, number> = {}
  const traitXpAdjustments: Record<string, number> = {}
  const traits: AgingDerivation['traits'] = []
  for (const bracket of applicable) {
    for (const [id, xp] of Object.entries(bracket.attributeXp)) attributeXpAdjustments[id] = (attributeXpAdjustments[id] ?? 0) + (xp ?? 0)
    for (const effect of bracket.traitEffects) {
      if (effect.condition === 'clan' && !isClan(character)) continue
      traitXpAdjustments[effect.traitId] = (traitXpAdjustments[effect.traitId] ?? 0) + effect.xp
      traits.push(effect)
    }
  }
  const legal = character.attributes.every((entry) => {
    const level = deriveAttributeLevel(entry.accumulatedXp + (attributeXpAdjustments[entry.attributeId] ?? 0)) ?? 0
    return level >= 1
  })
  return { age, brackets: applicable, attributeXpAdjustments, traitXpAdjustments, traits, unsupported: age > 101 ? ['Ages beyond the published 101-year table have no source-defined effects.'] : [], legal }
}

export function agingAttributeXp(character: CharacterDefinition, attributeId: string): number {
  return character.attributes.find((entry) => entry.attributeId === attributeId)?.accumulatedXp ?? 0
    + (deriveAging(character).attributeXpAdjustments[attributeId] ?? 0)
}

export function agingTraitXp(character: CharacterDefinition, entry: TraitLedgerEntry): number {
  return entry.accumulatedXp + (deriveAging(character).traitXpAdjustments[entry.traitId] ?? 0)
}
