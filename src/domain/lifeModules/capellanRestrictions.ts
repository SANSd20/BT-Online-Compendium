import type { CharacterDefinition } from '../character/model'

export const CAPELLAN_AFFILIATION_ID = 'affiliation.capellan-confederation'
export const CITIZENSHIP_TRAIT_ID = 'trait.citizenship'
export const CAPELLAN_STAGE_2_MILITARY_RESTRICTION_ID = 'restriction.scope.capellan-stage-2-military'
export const CAPELLAN_STAGE_3_RESTRICTION_ID = 'restriction.scope.capellan-stage-3'
export const CITIZENSHIP_REQUIRED_REASON = 'Requires Capellan Citizenship.'

export function isCapellanCitizen(character: CharacterDefinition): boolean {
  return character.traits.some((entry) => entry.active && entry.traitId === CITIZENSHIP_TRAIT_ID && typeof entry.parameters.subject === 'string' && entry.parameters.subject.trim().length > 0)
}

export function capellanCitizenshipEligibility(character: CharacterDefinition, stage: 2 | 3, moduleId: string): { eligible: boolean; reason?: string; restrictionId?: string } {
  if (!character.affiliations.some((entry) => entry.affiliationId === CAPELLAN_AFFILIATION_ID)) return { eligible: true }
  if (stage === 2 && moduleId !== 'stage2.military-school') return { eligible: true }
  const restrictionId = stage === 2 ? CAPELLAN_STAGE_2_MILITARY_RESTRICTION_ID : CAPELLAN_STAGE_3_RESTRICTION_ID
  return isCapellanCitizen(character) ? { eligible: true, restrictionId } : { eligible: false, reason: CITIZENSHIP_REQUIRED_REASON, restrictionId }
}
