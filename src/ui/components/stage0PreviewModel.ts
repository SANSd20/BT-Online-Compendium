import type { CharacterDefinition, ResolvedLifeModuleDestination } from '../../domain/character/model'
import { CAPELLAN_COMMONALITY_ID, DRACONIS_COMBINE_ID, FEDERATED_SUNS_CAPELLAN_MARCH_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID, FEDERATED_SUNS_DRACONIS_MARCH_ID, FEDERATED_SUNS_OUTBACK_ID } from '../../domain/lifeModules/catalog'
import { type OrderAffiliationSelection, resolveLifeModuleAffiliationContext } from '../../domain/lifeModules/affiliations'
import { applyCapellanCommonality, applyDraconisCombine, applyFederatedSunsMarch, applyFederatedSunsCrucisMarch, applyUniversalStage0, previewFederatedSunsCrucisMarch, previewOrderAffiliation, resolvePendingLifeModuleAward } from '../../engine/lifeModuleEngine'

export type LifeModulesThemeIdentity = {
  className: string
  dominantLabel: string
  birthLabel: string
}

export function lifeModulesThemeIdentity(affiliationContext: string, orderAffiliation: OrderAffiliationSelection = 'no'): LifeModulesThemeIdentity {
  const resolved = resolveLifeModuleAffiliationContext(affiliationContext)
  const parentAffiliationId = resolved.support === 'supported' ? resolved.context.affiliationId : affiliationContext
  const birth = parentAffiliationId === 'affiliation.capellan-confederation'
    ? { className: 'capellan-theme', secondaryClass: 'birth-capellan', label: 'Capellan Confederation' }
    : parentAffiliationId === 'affiliation.draconis-combine'
      ? { className: 'draconis-theme', secondaryClass: 'birth-draconis', label: 'Draconis Combine' }
      : [FEDERATED_SUNS_CRUCIS_MARCH_ID, FEDERATED_SUNS_CAPELLAN_MARCH_ID, FEDERATED_SUNS_DRACONIS_MARCH_ID, FEDERATED_SUNS_OUTBACK_ID].includes(affiliationContext)
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
  survivalSubject = '',
  draconisTraitChoice = 'Pain Resistance',
  draconisWeaponChoice = 'Melee Weapons',
  draconisChoices: Record<string, string> = {},
): CharacterDefinition | null {
  if (!affiliationContext) return null
  try {
    const withUniversal = affiliationLanguage && affiliationContext !== 'affiliation.federated-suns'
      ? applyUniversalStage0(character, affiliationContext, affiliationLanguage)
      : character
    if (affiliationContext === DRACONIS_COMBINE_ID) {
      const draconisBase = structuredClone(withUniversal)
      if (!affiliationLanguage) {
        draconisBase.creation.lifeModules!.stage0AffiliationContext = DRACONIS_COMBINE_ID
        draconisBase.creation.lifeModules!.phase = 'stage-0-affiliation'
      }
      const preview = applyDraconisCombine(draconisBase, subAffiliationSelection === 'no' ? 'no' : subAffiliationSelection as Parameters<typeof applyDraconisCombine>[1], draconisTraitChoice as 'Pain Resistance' | 'Combat Sense' | undefined, draconisWeaponChoice as 'Archery' | 'Melee Weapons' | 'Thrown Weapons/Blade' | undefined, affiliationLanguage || undefined, draconisChoices, true)
      return previewOrderAffiliation(preview, orderAffiliation, orderNearestStateContext, orderSecondaryLanguage, orderTechnicianSubskill)
    }
    if (affiliationContext === 'affiliation.federated-suns') {
      const federatedSunsBase = structuredClone(affiliationLanguage
        ? applyUniversalStage0(character, FEDERATED_SUNS_CRUCIS_MARCH_ID, affiliationLanguage)
        : character)
      federatedSunsBase.creation.lifeModules!.stage0AffiliationContext = FEDERATED_SUNS_CRUCIS_MARCH_ID
      const preview = previewFederatedSunsCrucisMarch(federatedSunsBase, false)
      preview.creation.lifeModules!.stage0AffiliationContext = affiliationContext
      if (davionNaturalAptitude === 'Protocol' || davionNaturalAptitude === 'Strategy') {
        const pending = preview.creation.lifeModules!.pendingAwards.find((award) => award.awardId === 'fedsuns.trait.natural-aptitude')
        if (!pending) throw new Error('Federated Suns Natural Aptitude preview award was not recorded.')
        pending.provenanceId = preview.lifeModuleHistory.at(-1)?.provenanceIds[0]
        const destination: ResolvedLifeModuleDestination = {
          type: 'trait',
          targetId: 'trait.natural-aptitude',
          displayName: `Natural Aptitude/${davionNaturalAptitude}`,
          parameters: { skill: davionNaturalAptitude },
        }
        return previewOrderAffiliation(resolvePendingLifeModuleAward(preview, pending.id, destination), orderAffiliation, orderNearestStateContext, orderSecondaryLanguage, orderTechnicianSubskill)
      }
      return previewOrderAffiliation(preview, orderAffiliation, orderNearestStateContext, orderSecondaryLanguage, orderTechnicianSubskill)
    }
    if (affiliationContext === FEDERATED_SUNS_CRUCIS_MARCH_ID) {
      const includeSub = !subAffiliationSelection || subAffiliationSelection === affiliationContext
      const federatedSunsBase = structuredClone(withUniversal)
      federatedSunsBase.creation.lifeModules!.stage0AffiliationContext = FEDERATED_SUNS_CRUCIS_MARCH_ID
      let birthPreview = davionNaturalAptitude && (!includeSub || davionArt)
        ? applyFederatedSunsCrucisMarch(federatedSunsBase, davionNaturalAptitude as 'Protocol' | 'Strategy', davionArt, includeSub)
        : previewFederatedSunsCrucisMarch(federatedSunsBase, includeSub)
      if (davionNaturalAptitude && birthPreview.creation.lifeModules) {
        const pending = birthPreview.creation.lifeModules.pendingAwards.find((award) => award.awardId === 'fedsuns.trait.natural-aptitude')
        if (pending) birthPreview = resolvePendingLifeModuleAward(birthPreview, pending.id, {
          type: 'trait', targetId: 'trait.natural-aptitude', displayName: `Natural Aptitude/${davionNaturalAptitude}`,
          parameters: { skill: davionNaturalAptitude },
        })
      }
      if (includeSub && davionArt && birthPreview.creation.lifeModules) {
        const pending = birthPreview.creation.lifeModules.pendingAwards.find((award) => award.awardId === 'crucis.skill.art')
        if (pending) birthPreview = resolvePendingLifeModuleAward(birthPreview, pending.id, {
          type: 'skill', targetId: 'skill.art', displayName: `Art/${davionArt}`, parameter: { kind: 'subskill', value: davionArt },
        })
      }
      birthPreview.creation.lifeModules!.stage0SubAffiliation = includeSub ? affiliationContext : 'no'
      return previewOrderAffiliation(birthPreview, orderAffiliation, orderNearestStateContext, orderSecondaryLanguage, orderTechnicianSubskill)
    }
    if (affiliationContext === FEDERATED_SUNS_CAPELLAN_MARCH_ID || affiliationContext === FEDERATED_SUNS_DRACONIS_MARCH_ID || affiliationContext === FEDERATED_SUNS_OUTBACK_ID) {
      const includeSub = !subAffiliationSelection || subAffiliationSelection === affiliationContext
      const preview = structuredClone(withUniversal)
      preview.creation.lifeModules!.stage0AffiliationContext = affiliationContext
      const ready = davionNaturalAptitude && (!includeSub || davionArt)
      const birthPreview = ready
        ? applyFederatedSunsMarch(preview, affiliationContext, davionNaturalAptitude as 'Protocol' | 'Strategy', davionArt, includeSub, survivalSubject)
        : preview
      birthPreview.creation.lifeModules!.stage0SubAffiliation = includeSub ? affiliationContext : 'no'
      return previewOrderAffiliation(birthPreview, orderAffiliation, orderNearestStateContext, orderSecondaryLanguage, orderTechnicianSubskill)
    }
    const capellanContext = resolveLifeModuleAffiliationContext(affiliationContext)
    if (capellanContext.support !== 'supported' || capellanContext.context.affiliationId !== 'affiliation.capellan-confederation') return null
    const preview = structuredClone(withUniversal)
    preview.creation.lifeModules!.stage0AffiliationContext = CAPELLAN_COMMONALITY_ID
    const includeSub = !subAffiliationSelection || subAffiliationSelection === affiliationContext
    const birthPreview = applyCapellanCommonality(preview, secondaryLanguage || undefined, includeSub, subAffiliationSelection || undefined, draconisChoices)
    birthPreview.creation.lifeModules!.stage0AffiliationContext = affiliationContext
    birthPreview.creation.lifeModules!.stage0SubAffiliation = includeSub ? (subAffiliationSelection || affiliationContext) : 'no'
    return previewOrderAffiliation(birthPreview, orderAffiliation, orderNearestStateContext, orderSecondaryLanguage, orderTechnicianSubskill)
  } catch {
    return null
  }
}
