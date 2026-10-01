import type { CharacterDefinition } from '../../domain/character/model'
import { CAPELLAN_COMMONALITY_ID } from '../../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyStage0Affiliation } from '../../engine/lifeModuleEngine'

export function lifeModulesAffiliationTheme(affiliationContext: string): 'capellan-theme' | '' {
  return affiliationContext === CAPELLAN_COMMONALITY_ID ? 'capellan-theme' : ''
}

export function previewStage0Affiliation(
  character: CharacterDefinition,
  affiliationContext: string,
  affiliationLanguage: string,
  secondaryLanguage: string,
): CharacterDefinition | null {
  if (!affiliationContext) return null
  try {
    if (affiliationLanguage) {
      return applyStage0Affiliation(character, affiliationContext, affiliationLanguage, secondaryLanguage || undefined)
    }
    if (affiliationContext !== CAPELLAN_COMMONALITY_ID) return null
    const preview = structuredClone(character)
    preview.creation.lifeModules!.stage0AffiliationContext = affiliationContext
    return applyCapellanCommonality(preview)
  } catch {
    return null
  }
}
