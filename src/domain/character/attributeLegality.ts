import type { CharacterDefinition } from './model'
import { phenotypeForCharacter } from './phenotypes'

export interface AttributeLegality {
  attributeId: string
  baseXp: number
  baseScore: number
  phenotypeModifier: number
  effectiveScore: number
  phenotypeMaximum: number
  exceptionalAttributeCount: number
  effectiveMaximum: number
  legal: boolean
}

export function attributeLegality(character: CharacterDefinition, attributeId: string): AttributeLegality {
  const entry = character.attributes.find((item) => item.attributeId === attributeId)
  const baseXp = entry?.accumulatedXp ?? 0
  const baseScore = Math.max(0, Math.floor(baseXp / 100))
  const phenotype = phenotypeForCharacter(character)
  const phenotypeModifier = phenotype.modifiers[attributeId] ?? entry?.phenotypeModifier ?? 0
  const phenotypeMaximum = phenotype.maximums[attributeId] ?? 0
  const exceptionalAttributeCount = character.traits.filter((item) => item.traitId === 'trait.exceptional-attribute' && item.parameters.attribute === attributeId && item.active).length
  const effectiveMaximum = phenotypeMaximum + Math.min(1, exceptionalAttributeCount)
  const effectiveScore = baseScore + phenotypeModifier
  return { attributeId, baseXp, baseScore, phenotypeModifier, effectiveScore, phenotypeMaximum, exceptionalAttributeCount, effectiveMaximum, legal: baseScore >= 1 && effectiveScore <= effectiveMaximum }
}

export function characterAttributeLegality(character: CharacterDefinition): AttributeLegality[] {
  return character.attributes.map((entry) => attributeLegality(character, entry.attributeId))
}
