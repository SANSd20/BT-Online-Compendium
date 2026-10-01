import type { CharacterDefinition } from '../../domain/character/model'
import { applyStage0Affiliation } from '../../engine/lifeModuleEngine'

export function previewStage0Affiliation(
  character: CharacterDefinition,
  affiliationContext: string,
  affiliationLanguage: string,
  secondaryLanguage: string,
): CharacterDefinition | null {
  if (!affiliationContext || !affiliationLanguage || !secondaryLanguage) return null
  try {
    return applyStage0Affiliation(character, affiliationContext, affiliationLanguage, secondaryLanguage)
  } catch {
    return null
  }
}
