import type { CharacterDefinition } from '../character/model'
import { CLAN_AFFILIATION_CONTEXTS, type ClanAffiliationCategory } from './affiliations'

export type ClanStage4EligibilityStatus = 'ELIGIBLE' | 'INELIGIBLE' | 'UNSUPPORTED_DEPENDENCY' | 'UNRESOLVED_REQUIRED_CHOICE'
export interface ClanStage4EligibilityResult {
  moduleId: string
  status: ClanStage4EligibilityStatus
  reasons: string[]
}

export interface ClanStage4EligibilityRule {
  moduleId: string
  displayName: string
  allowedCastes?: readonly string[]
  allowedCategories?: readonly ClanAffiliationCategory[]
  requiresClanDeparture?: boolean
  requiresPriorModuleIds?: readonly string[]
  requiresPhenotypeIds?: readonly string[]
  unsupportedDependencies?: readonly string[]
  unresolvedChoices?: readonly string[]
}

export const CLAN_STAGE4_ELIGIBILITY_RULES: readonly ClanStage4EligibilityRule[] = [
  { moduleId: 'stage4.clan-watch-operative', displayName: 'Clan Watch Operative', allowedCastes: ['warrior', 'scientist', 'technician'] },
  { moduleId: 'stage4.clan-warrior-washout', displayName: 'Clan Warrior Washout', allowedCastes: ['warrior'], requiresPriorModuleIds: ['stage1.trueborn-creche', 'stage2.clan-apprenticeship', 'stage2.trueborn-sibko'], unresolvedChoices: ['washout destination caste'] },
  { moduleId: 'stage4.dark-caste', displayName: 'Dark Caste', requiresClanDeparture: true },
  { moduleId: 'stage4.scientist-caste-service', displayName: 'Scientist Caste Service', allowedCastes: ['scientist'], unresolvedChoices: ['Trait pair and open Skills'] },
  { moduleId: 'stage4.civilian-job', displayName: 'Civilian Job', allowedCastes: ['merchant', 'technician', 'laborer'] },
  { moduleId: 'stage4.merchant', displayName: 'Merchant', allowedCastes: ['merchant'], unresolvedChoices: ['Merchant branch and Field Skill destinations'] },
  { moduleId: 'stage4.organized-crime', displayName: 'Organized Crime', requiresPriorModuleIds: ['stage4.dark-caste'], unsupportedDependencies: ['syndicate identity and GM adjudication'] },
  { moduleId: 'stage4.cloister-training', displayName: 'Cloister Training', allowedCastes: ['warrior'], unresolvedChoices: ['Connections and Clan Warrior Field Skills'] },
  { moduleId: 'stage4.goliath-scorpion-seeker', displayName: 'Goliath Scorpion Seeker', allowedCastes: ['warrior'], allowedCategories: ['homeworld-clan'] },
  { moduleId: 'stage4.protomech-pilot-training', displayName: 'ProtoMech Pilot Training', allowedCastes: ['warrior'], requiresPhenotypeIds: ['phenotype.aerospace'], unsupportedDependencies: ['EI Neural Implant', 'Chemical Addiction', 'ProtoMech Warrior Field'] },
]

function clanCategory(character: CharacterDefinition): ClanAffiliationCategory | undefined {
  const contextId = character.creation.lifeModules?.stage0AffiliationContext
  return CLAN_AFFILIATION_CONTEXTS.find((entry) => entry.id === contextId)?.clanCategory
}

export function evaluateClanStage4Eligibility(character: CharacterDefinition, rule: ClanStage4EligibilityRule): ClanStage4EligibilityResult {
  const reasons: string[] = []
  if (!character.affiliations.some((entry) => entry.affiliationId === 'affiliation.clan') && character.clanIdentity?.id !== 'affiliation.clan') reasons.push('Clan affiliation is required.')
  if (rule.allowedCastes && !rule.allowedCastes.includes(character.clanCaste?.id ?? '')) reasons.push('The selected Clan caste is not eligible.')
  if (rule.allowedCategories && !rule.allowedCategories.includes(clanCategory(character)!)) reasons.push('The Clan affiliation category is not eligible.')
  if (rule.requiresClanDeparture && character.clanCareerContext?.departureState !== 'left-clan' && character.clanCareerContext?.departureState !== 'dark-caste') reasons.push('A recorded Clan departure is required.')
  if (rule.requiresPriorModuleIds && !rule.requiresPriorModuleIds.some((id) => character.lifeModuleHistory.some((entry) => entry.moduleId === id))) reasons.push('Required prior Clan training history is missing.')
  if (rule.requiresPhenotypeIds && !rule.requiresPhenotypeIds.includes(character.phenotypeId)) reasons.push('The selected Phenotype is not eligible.')
  if (rule.unsupportedDependencies?.length) return { moduleId: rule.moduleId, status: 'UNSUPPORTED_DEPENDENCY', reasons: [...reasons, ...rule.unsupportedDependencies] }
  if (rule.unresolvedChoices?.length) return { moduleId: rule.moduleId, status: 'UNRESOLVED_REQUIRED_CHOICE', reasons: [...reasons, ...rule.unresolvedChoices] }
  return { moduleId: rule.moduleId, status: reasons.length ? 'INELIGIBLE' : 'ELIGIBLE', reasons }
}

export function getClanStage4Eligibility(character: CharacterDefinition): readonly ClanStage4EligibilityResult[] {
  return CLAN_STAGE4_ELIGIBILITY_RULES.map((rule) => evaluateClanStage4Eligibility(character, rule))
}

export function clanWarriorStage3Bypass(character: CharacterDefinition): boolean {
  const selected = character.lifeModuleHistory.map((entry) => entry.moduleId)
  return character.clanIdentity?.id === 'affiliation.clan' && character.clanCaste?.id === 'warrior' && selected.some((id) => id === 'stage2.clan-apprenticeship' || id === 'stage2.trueborn-sibko') && !character.lifeModuleHistory.some((entry) => entry.stage === 3)
}
