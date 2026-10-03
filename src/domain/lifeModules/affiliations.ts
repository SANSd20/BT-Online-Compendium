import type { SourceCitation } from '../rules/model'
import { MODELED_LANGUAGE_SUBSKILLS } from '../skills/languages'

export const UNIVERSAL_STAGE_0_ID = 'stage0.universal-fixed-xp'
export const CAPELLAN_COMMONALITY_ID = 'stage0.capellan-confederation.capellan-commonality'
export const FEDERATED_SUNS_CRUCIS_MARCH_ID = 'stage0.federated-suns.crucis-march'

export type AffiliationLanguageSelectorGroupId =
  | 'affiliation-languages'
  | 'capellan-secondary'
  | 'federated-suns-languages'
  | 'federated-suns-affiliation-languages'

export type AffiliationContextSupport = 'supported' | 'deferred'

export interface UniversalLifeModuleContext {
  id: typeof UNIVERSAL_STAGE_0_ID
  kind: 'universal'
  displayName: string
  isAffiliation: false
  support: 'supported'
  source: SourceCitation
}

export interface LifeModuleAffiliationContext {
  id: string
  kind: 'affiliation'
  displayName: string
  isAffiliation: true
  support: 'supported'
  affiliationId: string
  affiliationName: string
  subAffiliationName: string
  primaryLanguage: string
  secondaryLanguages: readonly string[]
  affiliationLanguageSelector: AffiliationLanguageSelectorGroupId
  secondaryLanguageSelector: AffiliationLanguageSelectorGroupId
  protocolContextLabel: string
  streetwiseContextLabel: string
  source: SourceCitation
}

const source = (page: number, ruleId: string): SourceCitation => ({
  sourceId: 'atow-core-corrected-third',
  edition: 'Corrected Third Printing',
  page,
  ruleId,
})

export const LIFE_MODULE_LANGUAGE_SELECTOR_GROUPS: Readonly<Record<AffiliationLanguageSelectorGroupId, readonly string[]>> = {
  'affiliation-languages': modeledLanguages('Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English'),
  'capellan-secondary': modeledLanguages('Russian', 'Cantonese', 'Vietnamese', 'English'),
  'federated-suns-languages': modeledLanguages('English', 'French'),
  'federated-suns-affiliation-languages': modeledLanguages('English', 'French', 'German', 'Hindi', 'Russian'),
}

function modeledLanguages(...languages: Array<(typeof MODELED_LANGUAGE_SUBSKILLS)[number]>): readonly string[] {
  return languages
}

export const UNIVERSAL_LIFE_MODULE_CONTEXT: UniversalLifeModuleContext = {
  id: UNIVERSAL_STAGE_0_ID,
  kind: 'universal',
  displayName: 'Universal Fixed Experience Points',
  isAffiliation: false,
  support: 'supported',
  source: source(62, 'stage-0-universal-fixed-experience-points'),
}

export const CAPELLAN_COMMONALITY_CONTEXT: LifeModuleAffiliationContext = {
  id: CAPELLAN_COMMONALITY_ID,
  kind: 'affiliation',
  displayName: 'Capellan Confederation / Capellan Commonality',
  isAffiliation: true,
  support: 'supported',
  affiliationId: 'affiliation.capellan-confederation',
  affiliationName: 'Capellan Confederation',
  subAffiliationName: 'Capellan Commonality',
  primaryLanguage: 'Mandarin Chinese',
  secondaryLanguages: LIFE_MODULE_LANGUAGE_SELECTOR_GROUPS['capellan-secondary'],
  affiliationLanguageSelector: 'affiliation-languages',
  secondaryLanguageSelector: 'capellan-secondary',
  protocolContextLabel: 'Capellan',
  streetwiseContextLabel: 'Capellan',
  source: source(64, 'capellan-confederation-capellan-commonality'),
}

export const FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT: LifeModuleAffiliationContext = {
  id: FEDERATED_SUNS_CRUCIS_MARCH_ID,
  kind: 'affiliation',
  displayName: 'Federated Suns / Crucis March',
  isAffiliation: true,
  support: 'supported',
  affiliationId: 'affiliation.federated-suns',
  affiliationName: 'Federated Suns',
  subAffiliationName: 'Crucis March',
  primaryLanguage: 'English',
  secondaryLanguages: ['French', 'German', 'Hindi', 'Russian'],
  affiliationLanguageSelector: 'federated-suns-affiliation-languages',
  secondaryLanguageSelector: 'federated-suns-languages',
  protocolContextLabel: 'FedSuns',
  streetwiseContextLabel: 'FedSuns',
  source: source(65, 'federated-suns-crucis-march'),
}

export const SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS: readonly LifeModuleAffiliationContext[] = [CAPELLAN_COMMONALITY_CONTEXT, FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT]

export type AffiliationContextResolution =
  | { support: 'supported'; context: LifeModuleAffiliationContext }
  | { support: 'deferred'; contextId: string }

export function resolveLifeModuleAffiliationContext(contextId: string): AffiliationContextResolution {
  const context = SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.find((entry) => entry.id === contextId)
  return context ? { support: 'supported', context } : { support: 'deferred', contextId }
}

export function getLifeModuleAffiliationContextByAffiliationId(affiliationId: string): LifeModuleAffiliationContext | undefined {
  return SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.find((entry) => entry.affiliationId === affiliationId)
}

export function getLifeModuleLanguageSelectorOptions(groupId: AffiliationLanguageSelectorGroupId): readonly string[] {
  return LIFE_MODULE_LANGUAGE_SELECTOR_GROUPS[groupId]
}
