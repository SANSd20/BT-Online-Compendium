import type { CharacterDefinition } from '../../domain/character/model'
import { CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID } from '../../domain/lifeModules/catalog'
import type { OrderAffiliationSelection } from '../../domain/lifeModules/affiliations'
import { applyCapellanCommonality, applyFederatedSunsCrucisMarch, applyUniversalStage0, previewFederatedSunsCrucisMarch, previewOrderAffiliation } from '../../engine/lifeModuleEngine'

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
  orderAffiliation: OrderAffiliationSelection = 'no',
  orderNearestStateContext = '',
  orderSecondaryLanguage = '',
  orderTechnicianSubskill = '',
  subAffiliationSelection = '',
): CharacterDefinition | null {
  if (!affiliationContext) return null
  try {
    const withUniversal = affiliationLanguage
      ? applyUniversalStage0(character, affiliationContext, affiliationLanguage)
      : character
    if (affiliationContext === FEDERATED_SUNS_CRUCIS_MARCH_ID) {
      const includeSub = !subAffiliationSelection || subAffiliationSelection === affiliationContext
      const birthPreview = davionNaturalAptitude && (!includeSub || davionArt)
        ? applyFederatedSunsCrucisMarch(withUniversal, davionNaturalAptitude as 'Protocol' | 'Strategy', davionArt, includeSub)
        : previewFederatedSunsCrucisMarch(withUniversal, includeSub)
      birthPreview.creation.lifeModules!.stage0SubAffiliation = includeSub ? affiliationContext : 'no'
      return previewOrderAffiliation(birthPreview, orderAffiliation, orderNearestStateContext, orderSecondaryLanguage, orderTechnicianSubskill)
    }
    if (affiliationContext !== CAPELLAN_COMMONALITY_ID) return null
    const preview = structuredClone(withUniversal)
    preview.creation.lifeModules!.stage0AffiliationContext = affiliationContext
    const includeSub = !subAffiliationSelection || subAffiliationSelection === affiliationContext
    const birthPreview = applyCapellanCommonality(preview, secondaryLanguage || undefined, includeSub)
    birthPreview.creation.lifeModules!.stage0SubAffiliation = includeSub ? affiliationContext : 'no'
    return previewOrderAffiliation(birthPreview, orderAffiliation, orderNearestStateContext, orderSecondaryLanguage, orderTechnicianSubskill)
  } catch {
    return null
  }
}
