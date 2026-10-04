import type { CharacterDefinition } from '../../domain/character/model'
import { CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID } from '../../domain/lifeModules/catalog'
import type { OrderAffiliationSelection } from '../../domain/lifeModules/affiliations'
import { applyCapellanCommonality, applyFederatedSunsCrucisMarch, applyUniversalStage0, previewFederatedSunsCrucisMarch, previewOrderAffiliation } from '../../engine/lifeModuleEngine'

export type LifeModulesThemeIdentity = {
  className: string
  dominantLabel: string
  birthLabel: string
}

export function lifeModulesThemeIdentity(affiliationContext: string, orderAffiliation: OrderAffiliationSelection = 'no'): LifeModulesThemeIdentity {
  const birth = affiliationContext === CAPELLAN_COMMONALITY_ID
    ? { className: 'capellan-theme', secondaryClass: 'birth-capellan', label: 'Capellan Confederation' }
    : affiliationContext === FEDERATED_SUNS_CRUCIS_MARCH_ID
      ? { className: 'davion-theme', secondaryClass: 'birth-davion', label: 'Federated Suns' }
      : { className: '', secondaryClass: '', label: '' }
  if (orderAffiliation === 'comstar') return { className: `order-theme comstar-theme ${birth.secondaryClass}`.trim(), dominantLabel: 'ComStar', birthLabel: birth.label }
  if (orderAffiliation === 'word-of-blake') return { className: `order-theme wob-theme ${birth.secondaryClass}`.trim(), dominantLabel: 'Word of Blake', birthLabel: birth.label }
  return { className: birth.className, dominantLabel: birth.label, birthLabel: birth.label }
}

export function lifeModulesAffiliationTheme(affiliationContext: string, orderAffiliation: OrderAffiliationSelection = 'no'): string {
  return lifeModulesThemeIdentity(affiliationContext, orderAffiliation).className
}

export function committedLifeModulesThemeIdentity(character: CharacterDefinition): LifeModulesThemeIdentity {
  const state = character.creation.lifeModules
  return lifeModulesThemeIdentity(state?.stage0AffiliationContext ?? '', state?.orderAffiliation ?? 'no')
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
