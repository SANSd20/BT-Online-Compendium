import type { SourceCitation } from '../rules/model'
import { MODELED_LANGUAGE_SUBSKILLS } from '../skills/languages'

export const UNIVERSAL_STAGE_0_ID = 'stage0.universal-fixed-xp'
export const CAPELLAN_COMMONALITY_ID = 'stage0.capellan-confederation.capellan-commonality'
export const SIAN_COMMONALITY_ID = 'stage0.capellan-confederation.sian-commonality'
export const LIAO_COMMONALITY_ID = 'stage0.capellan-confederation.liao-commonality'
export const ST_IVES_COMMONALITY_ID = 'stage0.capellan-confederation.st-ives-commonality'
export const VICTORIA_COMMONALITY_ID = 'stage0.capellan-confederation.victoria-commonality'
export const FEDERATED_SUNS_CRUCIS_MARCH_ID = 'stage0.federated-suns.crucis-march'
export const FEDERATED_SUNS_CAPELLAN_MARCH_ID = 'stage0.federated-suns.capellan-march'
export const FEDERATED_SUNS_DRACONIS_MARCH_ID = 'stage0.federated-suns.draconis-march'
export const FEDERATED_SUNS_OUTBACK_ID = 'stage0.federated-suns.outback'
export const DRACONIS_COMBINE_ID = 'stage0.draconis-combine'
export const DRACONIS_AZAMI_ID = 'stage0.draconis-combine.azami'
export const DRACONIS_BENJAMIN_ID = 'stage0.draconis-combine.benjamin-district'
export const DRACONIS_DIERON_ID = 'stage0.draconis-combine.dieron-district'
export const DRACONIS_NEW_SAMARKAND_ID = 'stage0.draconis-combine.new-samarkand-galedon-district'
export const DRACONIS_PESHT_ID = 'stage0.draconis-combine.pesht-district'
export const COMSTAR_ORDER_ID = 'stage0.comstar-word-of-blake.comstar'
export const WORD_OF_BLAKE_ORDER_ID = 'stage0.comstar-word-of-blake.word-of-blake'
export type OrderAffiliationSelection = 'no' | 'comstar' | 'word-of-blake'
export type SubAffiliationSelection = 'no' | string

export type AffiliationLanguageSelectorGroupId =
  | 'affiliation-languages'
  | 'any-language'
  | 'capellan-secondary'
  | 'capellan-liao-language'
  | 'federated-suns-languages'
  | 'federated-suns-affiliation-languages'
  | 'draconis-languages'
  | 'capellan-march-languages'

export type AffiliationContextSupport = 'supported' | 'deferred'
export type ClanAffiliationCategory = 'invading-clan' | 'homeworld-clan'

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
  clanCategory?: ClanAffiliationCategory
  clanCasteIds?: readonly string[]
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
  'any-language': modeledLanguages('Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English'),
  'capellan-secondary': modeledLanguages('Russian', 'Cantonese', 'Vietnamese', 'English'),
  'capellan-liao-language': modeledLanguages('Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English', 'German'),
  'federated-suns-languages': modeledLanguages('English', 'French'),
  'federated-suns-affiliation-languages': modeledLanguages('English', 'French', 'German', 'Hindi', 'Russian'),
  'draconis-languages': modeledLanguages('Arabic', 'English', 'Japanese', 'Swedanese'),
  'capellan-march-languages': modeledLanguages('Cantonese', 'German', 'Mandarin Chinese', 'Russian', 'Spanish'),
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

export const SIAN_COMMONALITY_CONTEXT: LifeModuleAffiliationContext = {
  id: SIAN_COMMONALITY_ID,
  kind: 'affiliation',
  displayName: 'Capellan Confederation / Sian Commonality',
  isAffiliation: true,
  support: 'supported',
  affiliationId: 'affiliation.capellan-confederation',
  affiliationName: 'Capellan Confederation',
  subAffiliationName: 'Sian Commonality',
  primaryLanguage: 'Mandarin Chinese',
  secondaryLanguages: LIFE_MODULE_LANGUAGE_SELECTOR_GROUPS['capellan-secondary'],
  affiliationLanguageSelector: 'affiliation-languages',
  secondaryLanguageSelector: 'capellan-secondary',
  protocolContextLabel: 'Capellan',
  streetwiseContextLabel: 'Capellan',
  source: source(64, 'capellan-confederation-sian-commonality'),
}
const capellanSub = (id: string, name: string, ruleId: string): LifeModuleAffiliationContext => ({
  id, kind: 'affiliation', displayName: `Capellan Confederation / ${name}`, isAffiliation: true, support: 'supported',
  affiliationId: 'affiliation.capellan-confederation', affiliationName: 'Capellan Confederation', subAffiliationName: name,
  primaryLanguage: 'Mandarin Chinese', secondaryLanguages: LIFE_MODULE_LANGUAGE_SELECTOR_GROUPS['capellan-secondary'],
  affiliationLanguageSelector: 'affiliation-languages', secondaryLanguageSelector: 'capellan-secondary',
  protocolContextLabel: 'Capellan', streetwiseContextLabel: 'Capellan', source: source(64, ruleId),
})
export const LIAO_COMMONALITY_CONTEXT = capellanSub(LIAO_COMMONALITY_ID, 'Liao Commonality', 'capellan-confederation-liao-commonality')
export const ST_IVES_COMMONALITY_CONTEXT = capellanSub(ST_IVES_COMMONALITY_ID, 'St. Ives Commonality', 'capellan-confederation-st-ives-commonality')
export const VICTORIA_COMMONALITY_CONTEXT = capellanSub(VICTORIA_COMMONALITY_ID, 'Victoria Commonality', 'capellan-confederation-victoria-commonality')

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

export const FEDERATED_SUNS_CAPELLAN_MARCH_CONTEXT: LifeModuleAffiliationContext = {
  id: FEDERATED_SUNS_CAPELLAN_MARCH_ID, kind: 'affiliation', displayName: 'Federated Suns / Capellan March', isAffiliation: true,
  support: 'supported', affiliationId: 'affiliation.federated-suns', affiliationName: 'Federated Suns', subAffiliationName: 'Capellan March',
  primaryLanguage: 'English', secondaryLanguages: ['French', 'German', 'Hindi', 'Russian'], affiliationLanguageSelector: 'federated-suns-affiliation-languages',
  secondaryLanguageSelector: 'federated-suns-languages', protocolContextLabel: 'FedSuns', streetwiseContextLabel: 'FedSuns', source: source(65, 'federated-suns-capellan-march'),
}

export const FEDERATED_SUNS_DRACONIS_MARCH_CONTEXT: LifeModuleAffiliationContext = {
  id: FEDERATED_SUNS_DRACONIS_MARCH_ID, kind: 'affiliation', displayName: 'Federated Suns / Draconis March', isAffiliation: true,
  support: 'supported', affiliationId: 'affiliation.federated-suns', affiliationName: 'Federated Suns', subAffiliationName: 'Draconis March',
  primaryLanguage: 'English', secondaryLanguages: ['French', 'German', 'Hindi', 'Russian'], affiliationLanguageSelector: 'federated-suns-affiliation-languages',
  secondaryLanguageSelector: 'federated-suns-languages', protocolContextLabel: 'FedSuns', streetwiseContextLabel: 'FedSuns', source: source(65, 'federated-suns-draconis-march'),
}
export const FEDERATED_SUNS_OUTBACK_CONTEXT: LifeModuleAffiliationContext = {
  id: FEDERATED_SUNS_OUTBACK_ID, kind: 'affiliation', displayName: 'Federated Suns / Outback', isAffiliation: true,
  support: 'supported', affiliationId: 'affiliation.federated-suns', affiliationName: 'Federated Suns', subAffiliationName: 'Outback',
  primaryLanguage: 'English', secondaryLanguages: ['French', 'German', 'Hindi', 'Russian'], affiliationLanguageSelector: 'federated-suns-affiliation-languages',
  secondaryLanguageSelector: 'federated-suns-languages', protocolContextLabel: 'FedSuns', streetwiseContextLabel: 'FedSuns', source: source(65, 'federated-suns-outback'),
}
export const DRACONIS_COMBINE_CONTEXT: LifeModuleAffiliationContext = {
  id: DRACONIS_COMBINE_ID, kind: 'affiliation', displayName: 'Draconis Combine / House Kurita', isAffiliation: true,
  support: 'supported', affiliationId: 'affiliation.draconis-combine', affiliationName: 'Draconis Combine', subAffiliationName: 'No sub-affiliation',
  primaryLanguage: 'Japanese', secondaryLanguages: ['Arabic', 'English', 'Swedanese'], affiliationLanguageSelector: 'draconis-languages', secondaryLanguageSelector: 'any-language',
  protocolContextLabel: 'Combine', streetwiseContextLabel: 'Combine', source: source(64, 'draconis-combine'),
}
const draconisSub = (id: string, name: string, ruleId: string): LifeModuleAffiliationContext => ({
  id, kind: 'affiliation', displayName: `Draconis Combine / ${name}`, isAffiliation: true, support: 'supported',
  affiliationId: 'affiliation.draconis-combine', affiliationName: 'Draconis Combine', subAffiliationName: name,
  primaryLanguage: 'Japanese', secondaryLanguages: ['Arabic', 'English', 'Swedanese'], affiliationLanguageSelector: 'draconis-languages', secondaryLanguageSelector: 'any-language',
  protocolContextLabel: 'Combine', streetwiseContextLabel: 'Combine', source: source(64, ruleId),
})
export const DRACONIS_SUB_AFFILIATION_CONTEXTS = [
  draconisSub(DRACONIS_AZAMI_ID, 'Azami', 'draconis-combine-azami'),
  draconisSub(DRACONIS_BENJAMIN_ID, 'Benjamin District', 'draconis-combine-benjamin-district'),
  draconisSub(DRACONIS_DIERON_ID, 'Dieron District', 'draconis-combine-dieron-district'),
  draconisSub(DRACONIS_NEW_SAMARKAND_ID, 'New Samarkand (Galedon) District', 'draconis-combine-new-samarkand-galedon-district'),
  draconisSub(DRACONIS_PESHT_ID, 'Pesht District', 'draconis-combine-pesht-district'),
] as const

/** Internal-only Clan context. It is deliberately excluded from player-facing birth-affiliation options. */
export const CLAN_AFFILIATION_CONTEXTS: readonly LifeModuleAffiliationContext[] = [
  {
    id: 'stage0.clan.invading-clan', kind: 'affiliation', support: 'supported', displayName: 'Invading Clan', isAffiliation: true,
    affiliationId: 'affiliation.clan', affiliationName: 'Clan', subAffiliationName: 'Invading Clan',
    primaryLanguage: 'English', secondaryLanguages: [], affiliationLanguageSelector: 'affiliation-languages',
    secondaryLanguageSelector: 'affiliation-languages', protocolContextLabel: 'Clan', streetwiseContextLabel: 'Clan',
    clanCategory: 'invading-clan', clanCasteIds: ['warrior', 'scientist', 'merchant', 'technician', 'laborer'],
    source: source(69, 'stage-0-invading-clan'),
  },
  {
    id: 'stage0.clan.homeworld-clan', kind: 'affiliation', support: 'supported', displayName: 'Homeworld Clan', isAffiliation: true,
    affiliationId: 'affiliation.clan', affiliationName: 'Clan', subAffiliationName: 'Homeworld Clan',
    primaryLanguage: 'English', secondaryLanguages: [], affiliationLanguageSelector: 'affiliation-languages',
    secondaryLanguageSelector: 'affiliation-languages', protocolContextLabel: 'Clan', streetwiseContextLabel: 'Clan',
    clanCategory: 'homeworld-clan', clanCasteIds: ['warrior', 'scientist', 'merchant', 'technician', 'laborer'],
    source: source(70, 'stage-0-homeworld-clan'),
  },
]

export const SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS: readonly LifeModuleAffiliationContext[] = [CAPELLAN_COMMONALITY_CONTEXT, LIAO_COMMONALITY_CONTEXT, SIAN_COMMONALITY_CONTEXT, ST_IVES_COMMONALITY_CONTEXT, VICTORIA_COMMONALITY_CONTEXT, FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT, FEDERATED_SUNS_CAPELLAN_MARCH_CONTEXT, FEDERATED_SUNS_DRACONIS_MARCH_CONTEXT, FEDERATED_SUNS_OUTBACK_CONTEXT, DRACONIS_COMBINE_CONTEXT, ...DRACONIS_SUB_AFFILIATION_CONTEXTS]

export const ORDER_AFFILIATION_IDS = {
  comstar: 'affiliation.comstar',
  'word-of-blake': 'affiliation.word-of-blake',
} as const

export function getBirthAffiliationOptions(): readonly { id: string; name: string }[] {
  return [...new Map(SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.map((entry) => [entry.affiliationId, { id: entry.affiliationId, name: entry.affiliationName }])).values()]
}

export function getBirthSubAffiliationOptions(affiliationId: string): readonly LifeModuleAffiliationContext[] {
  return SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.filter((entry) => entry.affiliationId === affiliationId)
}

export function getNearestStateOptions(): readonly LifeModuleAffiliationContext[] {
  return SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS
}

export type AffiliationContextResolution =
  | { support: 'supported'; context: LifeModuleAffiliationContext }
  | { support: 'deferred'; contextId: string }

export function resolveLifeModuleAffiliationContext(contextId: string): AffiliationContextResolution {
  const context = [...SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS, ...CLAN_AFFILIATION_CONTEXTS].find((entry) => entry.id === contextId)
  return context ? { support: 'supported', context } : { support: 'deferred', contextId }
}

export function getLifeModuleAffiliationContextByAffiliationId(affiliationId: string): LifeModuleAffiliationContext | undefined {
  return [...SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS, ...CLAN_AFFILIATION_CONTEXTS].find((entry) => entry.affiliationId === affiliationId)
}

export function getClanAffiliationContext(category: ClanAffiliationCategory): LifeModuleAffiliationContext {
  return CLAN_AFFILIATION_CONTEXTS.find((entry) => entry.clanCategory === category)!
}

export function getLifeModuleLanguageSelectorOptions(groupId: AffiliationLanguageSelectorGroupId): readonly string[] {
  return LIFE_MODULE_LANGUAGE_SELECTOR_GROUPS[groupId]
}
