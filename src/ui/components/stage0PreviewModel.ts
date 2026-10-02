import type { CharacterDefinition } from '../../domain/character/model'
import { CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID } from '../../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyStage0Affiliation, previewFederatedSunsCrucisMarch } from '../../engine/lifeModuleEngine'

export function lifeModulesAffiliationTheme(affiliationContext: string): 'capellan-theme' | 'davion-theme' | '' {
  if (affiliationContext === CAPELLAN_COMMONALITY_ID) return 'capellan-theme'
  if (affiliationContext === FEDERATED_SUNS_CRUCIS_MARCH_ID) return 'davion-theme'
  return ''
}

export function previewStage0Affiliation(
  character: CharacterDefinition,
  affiliationContext: string,
  affiliationLanguage: string,
  secondaryLanguage: string,
  davionNaturalAptitude = '',
  davionArt = '',
): CharacterDefinition | null {
  if (!affiliationContext) return null
  try {
    if (affiliationLanguage) {
      return applyStage0Affiliation(
        character,
        affiliationContext,
        affiliationLanguage,
        secondaryLanguage || undefined,
        davionNaturalAptitude ? davionNaturalAptitude as 'Protocol' | 'Strategy' : undefined,
        davionArt || undefined,
      )
    }
    if (affiliationContext === FEDERATED_SUNS_CRUCIS_MARCH_ID) return previewFederatedSunsCrucisMarch(character)
    if (affiliationContext !== CAPELLAN_COMMONALITY_ID) return null
    const preview = structuredClone(character)
    preview.creation.lifeModules!.stage0AffiliationContext = affiliationContext
    return applyCapellanCommonality(preview)
  } catch {
    return null
  }
}
