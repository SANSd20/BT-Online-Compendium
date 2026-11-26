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
export const FREE_WORLDS_LEAGUE_ID = 'stage0.free-worlds-league'
export const FWL_MARIK_COMMONWEALTH_ID = 'stage0.free-worlds-league.marik-commonwealth'
export const FWL_REGULUS_ID = 'stage0.free-worlds-league.principality-regulus'
export const FWL_ORIENTE_ID = 'stage0.free-worlds-league.duchy-oriente'
export const FWL_ANDURIEN_ID = 'stage0.free-worlds-league.duchy-andurien'
export const FWL_OTHER_WORLDS_ID = 'stage0.free-worlds-league.other-worlds'
export const DRACONIS_COMBINE_ID = 'stage0.draconis-combine'
export const DRACONIS_AZAMI_ID = 'stage0.draconis-combine.azami'
export const DRACONIS_BENJAMIN_ID = 'stage0.draconis-combine.benjamin-district'
export const DRACONIS_DIERON_ID = 'stage0.draconis-combine.dieron-district'
export const DRACONIS_NEW_SAMARKAND_ID = 'stage0.draconis-combine.new-samarkand-galedon-district'
export const DRACONIS_PESHT_ID = 'stage0.draconis-combine.pesht-district'
export const LYRAN_ALLIANCE_ID = 'stage0.lyran-alliance'
export const LYRAN_ALARION_ID = 'stage0.lyran-alliance.alarion'
export const LYRAN_BOLAN_ID = 'stage0.lyran-alliance.bolan'
export const LYRAN_COVENTRY_ID = 'stage0.lyran-alliance.coventry'
export const LYRAN_DONEGAL_ID = 'stage0.lyran-alliance.donegal'
export const LYRAN_SKYE_ID = 'stage0.lyran-alliance.skye'
export const FREE_RASALHAGUE_REPUBLIC_ID = 'stage0.free-rasalhague-republic'
export const RASALHAGUE_CLAN_WAR_EXPATRIATE_ID = 'stage0.free-rasalhague-republic.clan-war-expatriate'
export const RASALHAGUE_GHOST_BEAR_ID = 'stage0.free-rasalhague-republic.ghost-bear-dominion'
export const MINOR_PERIPHERY_ID = 'stage0.minor-periphery'
export const MINOR_PERIPHERY_RANDIS_ID = 'stage0.minor-periphery.fiefdom-randis'
export const MINOR_PERIPHERY_FRANKLIN_ID = 'stage0.minor-periphery.franklin-fiefs'
export const MINOR_PERIPHERY_MICA_ID = 'stage0.minor-periphery.mica-majority'
export const MINOR_PERIPHERY_NIOPS_ID = 'stage0.minor-periphery.niops-association'
export const MINOR_PERIPHERY_RIM_ID = 'stage0.minor-periphery.rim-collection'
export const DEEP_PERIPHERY_ID = 'stage0.deep-periphery'
export const DEEP_PERIPHERY_HANSEATIC_ID = 'stage0.deep-periphery.hanseatic-league'
export const DEEP_PERIPHERY_CASTILIAN_ID = 'stage0.deep-periphery.castilian-principalities'
export const DEEP_PERIPHERY_UMAYYAD_ID = 'stage0.deep-periphery.umayyad-caliphate'
export const DEEP_PERIPHERY_JARNFOLK_ID = 'stage0.deep-periphery.jarnfolk'
export const TERRAN_ID = 'stage0.terran'
export const TERRAN_BELTER_ID = 'stage0.terran.belter'
export const TERRAN_LUNAR_ID = 'stage0.terran.lunar-citizen'
export const TERRAN_MARTIAN_ID = 'stage0.terran.martian-citizen'
export const TERRAN_OUTER_SYSTEM_ID = 'stage0.terran.outer-system-citizen'
export const TERRAN_CITIZEN_ID = 'stage0.terran.terran-citizen'
export const TERRAN_VENUSIAN_ID = 'stage0.terran.venusian-citizen'
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
  | 'fwl-languages'
  | 'lyran-languages'
  | 'rasalhague-languages'
  | 'rasalhague-choice-languages'
  | 'minor-periphery-languages'
  | 'deep-periphery-languages'
  | 'terran-languages'

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
  'fwl-languages': modeledLanguages('English', 'Greek', 'Hindi', 'Italian', 'Mandarin Chinese', 'Mongolian', 'Romanian', 'Slovak', 'Spanish', 'Urdu'),
  'lyran-languages': modeledLanguages('German', 'English', 'Italian', 'Scots Gaelic', 'Swedish'),
  'rasalhague-languages': modeledLanguages('Swedish', 'English', 'Japanese', 'Swedanese', 'German'),
  'rasalhague-choice-languages': modeledLanguages('German', 'English', 'Italian', 'Scots Gaelic', 'Swedish', 'Japanese', 'Arabic', 'Swedanese'),
  'minor-periphery-languages': modeledLanguages('English', 'Japanese'),
  'deep-periphery-languages': modeledLanguages('Arabic', 'Danish', 'English', 'German', 'JàrnFòlk Norse', 'Spanish', 'Swedish'),
  'terran-languages': modeledLanguages('English', 'Mandarin Chinese', 'Russian', 'German', 'Japanese', 'Spanish', 'French'),
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

export const TERRAN_CONTEXT: LifeModuleAffiliationContext = {
  id: TERRAN_ID, kind: 'affiliation', displayName: 'Terran', isAffiliation: true, support: 'supported',
  affiliationId: 'affiliation.terran', affiliationName: 'Terran', subAffiliationName: 'No sub-affiliation',
  primaryLanguage: 'Any', secondaryLanguages: LIFE_MODULE_LANGUAGE_SELECTOR_GROUPS['terran-languages'],
  affiliationLanguageSelector: 'terran-languages', secondaryLanguageSelector: 'terran-languages',
  protocolContextLabel: 'Terran', streetwiseContextLabel: 'Terran', source: source(72, 'terran-affiliation'),
}
const terranSub = (id: string, name: string, ruleId: string): LifeModuleAffiliationContext => ({ ...TERRAN_CONTEXT, id, displayName: `Terran / ${name}`, subAffiliationName: name, source: source(72, ruleId) })
export const TERRAN_SUB_AFFILIATION_CONTEXTS = [
  terranSub(TERRAN_BELTER_ID, 'Belter', 'terran-belter'), terranSub(TERRAN_LUNAR_ID, 'Lunar Citizen', 'terran-lunar-citizen'),
  terranSub(TERRAN_MARTIAN_ID, 'Martian Citizen', 'terran-martian-citizen'), terranSub(TERRAN_OUTER_SYSTEM_ID, 'Outer System Citizen', 'terran-outer-system-citizen'),
  terranSub(TERRAN_CITIZEN_ID, 'Terran Citizen', 'terran-terran-citizen'), terranSub(TERRAN_VENUSIAN_ID, 'Venusian Citizen', 'terran-venusian-citizen'),
]

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
const fwlSub = (id: string, name: string, ruleId: string): LifeModuleAffiliationContext => ({
  id, kind: 'affiliation', displayName: `Free Worlds League / ${name}`, isAffiliation: true, support: 'supported',
  affiliationId: 'affiliation.free-worlds-league', affiliationName: 'Free Worlds League', subAffiliationName: name,
  primaryLanguage: 'English', secondaryLanguages: LIFE_MODULE_LANGUAGE_SELECTOR_GROUPS['fwl-languages'], affiliationLanguageSelector: 'fwl-languages', secondaryLanguageSelector: 'fwl-languages',
  protocolContextLabel: 'Free Worlds', streetwiseContextLabel: 'Free Worlds', source: source(66, ruleId),
})
export const FREE_WORLDS_LEAGUE_CONTEXT: LifeModuleAffiliationContext = { ...fwlSub(FREE_WORLDS_LEAGUE_ID, 'Free Worlds League', 'free-worlds-league'), subAffiliationName: 'No sub-affiliation' }
export const FWL_SUB_AFFILIATION_CONTEXTS = [
  fwlSub(FWL_MARIK_COMMONWEALTH_ID, 'Marik Commonwealth', 'free-worlds-league-marik-commonwealth'),
  fwlSub(FWL_REGULUS_ID, 'Principality of Regulus', 'free-worlds-league-principality-regulus'),
  fwlSub(FWL_ORIENTE_ID, 'Duchy of Oriente', 'free-worlds-league-duchy-oriente'),
  fwlSub(FWL_ANDURIEN_ID, 'Duchy of Andurien', 'free-worlds-league-duchy-andurien'),
  fwlSub(FWL_OTHER_WORLDS_ID, 'Other FWL Worlds', 'free-worlds-league-other-worlds'),
] as const
const deepPeripherySub = (id: string, name: string, ruleId: string, primaryLanguage: string, secondaryLanguages: readonly string[]): LifeModuleAffiliationContext => ({
  id, kind: 'affiliation', displayName: `Deep Periphery / ${name}`, isAffiliation: true, support: 'supported', affiliationId: 'affiliation.deep-periphery', affiliationName: 'Deep Periphery', subAffiliationName: name,
  primaryLanguage, secondaryLanguages, affiliationLanguageSelector: 'deep-periphery-languages', secondaryLanguageSelector: 'deep-periphery-languages', protocolContextLabel: name, streetwiseContextLabel: 'Deep Periphery', source: source(68, ruleId),
})
export const DEEP_PERIPHERY_CONTEXT = { ...deepPeripherySub(DEEP_PERIPHERY_ID, 'Deep Periphery', 'deep-periphery', 'English', []), subAffiliationName: 'No sub-affiliation' }
export const DEEP_PERIPHERY_SUB_AFFILIATION_CONTEXTS = [
  deepPeripherySub(DEEP_PERIPHERY_HANSEATIC_ID, 'Hanseatic League', 'deep-periphery-hanseatic-league', 'German', ['English']),
  deepPeripherySub(DEEP_PERIPHERY_CASTILIAN_ID, 'Castilian Principalities', 'deep-periphery-castilian-principalities', 'Spanish', ['German']),
  deepPeripherySub(DEEP_PERIPHERY_UMAYYAD_ID, 'Umayyad Caliphate', 'deep-periphery-umayyad-caliphate', 'Arabic', ['English']),
  deepPeripherySub(DEEP_PERIPHERY_JARNFOLK_ID, 'JàrnFòlk', 'deep-periphery-jarnfolk', 'JàrnFòlk Norse', ['Danish', 'English', 'German', 'Swedish']),
] as const
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
const lyranSub = (id: string, name: string, ruleId: string): LifeModuleAffiliationContext => ({
  id, kind: 'affiliation', displayName: `Lyran Alliance / ${name}`, isAffiliation: true, support: 'supported',
  affiliationId: 'affiliation.lyran-alliance', affiliationName: 'Lyran Alliance', subAffiliationName: name,
  primaryLanguage: 'German', secondaryLanguages: LIFE_MODULE_LANGUAGE_SELECTOR_GROUPS['lyran-languages'], affiliationLanguageSelector: 'lyran-languages', secondaryLanguageSelector: 'lyran-languages',
  protocolContextLabel: 'Lyran', streetwiseContextLabel: 'Lyran', source: source(66, ruleId),
})
export const LYRAN_ALLIANCE_CONTEXT: LifeModuleAffiliationContext = { ...lyranSub(LYRAN_ALLIANCE_ID, 'Lyran Alliance', 'lyran-alliance'), subAffiliationName: 'No sub-affiliation' }
export const LYRAN_SUB_AFFILIATION_CONTEXTS = [
  lyranSub(LYRAN_ALARION_ID, 'Alarion', 'lyran-alliance-alarion'),
  lyranSub(LYRAN_BOLAN_ID, 'Bolan', 'lyran-alliance-bolan'),
  lyranSub(LYRAN_COVENTRY_ID, 'Coventry', 'lyran-alliance-coventry'),
  lyranSub(LYRAN_DONEGAL_ID, 'Donegal', 'lyran-alliance-donegal'),
  lyranSub(LYRAN_SKYE_ID, 'Skye', 'lyran-alliance-skye'),
] as const
const rasalhagueSub = (id: string, name: string, ruleId: string): LifeModuleAffiliationContext => ({
  id, kind: 'affiliation', displayName: `Free Rasalhague Republic / ${name}`, isAffiliation: true, support: 'supported',
  affiliationId: 'affiliation.free-rasalhague-republic', affiliationName: 'Free Rasalhague Republic', subAffiliationName: name,
  primaryLanguage: 'Swedish', secondaryLanguages: LIFE_MODULE_LANGUAGE_SELECTOR_GROUPS['rasalhague-languages'], affiliationLanguageSelector: 'rasalhague-languages', secondaryLanguageSelector: 'rasalhague-choice-languages',
  protocolContextLabel: 'Lyran or Draconis', streetwiseContextLabel: 'Rasalhague', source: source(67, ruleId),
})
export const FREE_RASALHAGUE_REPUBLIC_CONTEXT: LifeModuleAffiliationContext = { ...rasalhagueSub(FREE_RASALHAGUE_REPUBLIC_ID, 'Free Rasalhague Republic', 'free-rasalhague-republic'), subAffiliationName: 'No sub-affiliation' }
export const RASALHAGUE_SUB_AFFILIATION_CONTEXTS = [
  rasalhagueSub(RASALHAGUE_CLAN_WAR_EXPATRIATE_ID, 'Clan War Expatriate', 'free-rasalhague-republic-clan-war-expatriate'),
  rasalhagueSub(RASALHAGUE_GHOST_BEAR_ID, 'Ghost Bear Dominion', 'free-rasalhague-republic-ghost-bear-dominion'),
] as const
const minorPeripherySub = (id: string, name: string, ruleId: string): LifeModuleAffiliationContext => ({
  id, kind: 'affiliation', displayName: `Minor Periphery / ${name}`, isAffiliation: true, support: 'supported',
  affiliationId: 'affiliation.minor-periphery', affiliationName: 'Minor Periphery', subAffiliationName: name,
  primaryLanguage: 'English', secondaryLanguages: LIFE_MODULE_LANGUAGE_SELECTOR_GROUPS['minor-periphery-languages'], affiliationLanguageSelector: 'minor-periphery-languages', secondaryLanguageSelector: 'minor-periphery-languages',
  protocolContextLabel: 'Periphery', streetwiseContextLabel: 'Periphery', source: source(67, ruleId),
})
export const MINOR_PERIPHERY_CONTEXT: LifeModuleAffiliationContext = { ...minorPeripherySub(MINOR_PERIPHERY_ID, 'Minor Periphery', 'minor-periphery'), subAffiliationName: 'No sub-affiliation' }
export const MINOR_PERIPHERY_SUB_AFFILIATION_CONTEXTS = [
  minorPeripherySub(MINOR_PERIPHERY_RANDIS_ID, 'Fiefdom of Randis', 'minor-periphery-fiefdom-randis'),
  minorPeripherySub(MINOR_PERIPHERY_FRANKLIN_ID, 'Franklin Fiefs', 'minor-periphery-franklin-fiefs'),
  minorPeripherySub(MINOR_PERIPHERY_MICA_ID, 'Mica Majority', 'minor-periphery-mica-majority'),
  minorPeripherySub(MINOR_PERIPHERY_NIOPS_ID, 'Niops Association', 'minor-periphery-niops-association'),
  minorPeripherySub(MINOR_PERIPHERY_RIM_ID, 'Rim Collection', 'minor-periphery-rim-collection'),
] as const
export const MAJOR_PERIPHERY_ID = 'stage0.major-periphery'
export const MAJOR_PERIPHERY_CIRCINUS_ID = 'stage0.major-periphery.circinus-federation'
export const MAJOR_PERIPHERY_CANOPUS_ID = 'stage0.major-periphery.magistracy-of-canopus'
export const MAJOR_PERIPHERY_MARIAN_ID = 'stage0.major-periphery.marian-hegemony'
export const MAJOR_PERIPHERY_OUTWORLDS_ID = 'stage0.major-periphery.outworlds-alliance'
export const MAJOR_PERIPHERY_TAURIAN_ID = 'stage0.major-periphery.taurian-concordat'
const majorPeripherySub = (id: string, name: string, ruleId: string): LifeModuleAffiliationContext => ({
  id, kind: 'affiliation', displayName: `Major Periphery / ${name}`, isAffiliation: true, support: 'supported',
  affiliationId: 'affiliation.major-periphery', affiliationName: 'Major Periphery State', subAffiliationName: name,
  primaryLanguage: 'English', secondaryLanguages: ['German', 'Spanish'], affiliationLanguageSelector: 'affiliation-languages', secondaryLanguageSelector: 'any-language',
  protocolContextLabel: name, streetwiseContextLabel: 'Periphery', source: source(68, ruleId),
})
export const MAJOR_PERIPHERY_CONTEXT = { ...majorPeripherySub(MAJOR_PERIPHERY_ID, 'Major Periphery State', 'major-periphery'), subAffiliationName: 'No sub-affiliation' }
export const MAJOR_PERIPHERY_SUB_AFFILIATION_CONTEXTS = [
  majorPeripherySub(MAJOR_PERIPHERY_CIRCINUS_ID, 'Circinus Federation', 'major-periphery-circinus-federation'),
  majorPeripherySub(MAJOR_PERIPHERY_CANOPUS_ID, 'Magistracy of Canopus', 'major-periphery-magistracy-of-canopus'),
  majorPeripherySub(MAJOR_PERIPHERY_MARIAN_ID, 'Marian Hegemony', 'major-periphery-marian-hegemony'),
  majorPeripherySub(MAJOR_PERIPHERY_OUTWORLDS_ID, 'Outworlds Alliance', 'major-periphery-outworlds-alliance'),
  majorPeripherySub(MAJOR_PERIPHERY_TAURIAN_ID, 'Taurian Concordat', 'major-periphery-taurian-concordat'),
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

export const SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS: readonly LifeModuleAffiliationContext[] = [CAPELLAN_COMMONALITY_CONTEXT, LIAO_COMMONALITY_CONTEXT, SIAN_COMMONALITY_CONTEXT, ST_IVES_COMMONALITY_CONTEXT, VICTORIA_COMMONALITY_CONTEXT, FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT, FEDERATED_SUNS_CAPELLAN_MARCH_CONTEXT, FEDERATED_SUNS_DRACONIS_MARCH_CONTEXT, FEDERATED_SUNS_OUTBACK_CONTEXT, FREE_WORLDS_LEAGUE_CONTEXT, ...FWL_SUB_AFFILIATION_CONTEXTS, DRACONIS_COMBINE_CONTEXT, ...DRACONIS_SUB_AFFILIATION_CONTEXTS, LYRAN_ALLIANCE_CONTEXT, ...LYRAN_SUB_AFFILIATION_CONTEXTS, FREE_RASALHAGUE_REPUBLIC_CONTEXT, ...RASALHAGUE_SUB_AFFILIATION_CONTEXTS, MINOR_PERIPHERY_CONTEXT, ...MINOR_PERIPHERY_SUB_AFFILIATION_CONTEXTS, MAJOR_PERIPHERY_CONTEXT, ...MAJOR_PERIPHERY_SUB_AFFILIATION_CONTEXTS, DEEP_PERIPHERY_CONTEXT, ...DEEP_PERIPHERY_SUB_AFFILIATION_CONTEXTS, TERRAN_CONTEXT, ...TERRAN_SUB_AFFILIATION_CONTEXTS]

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
