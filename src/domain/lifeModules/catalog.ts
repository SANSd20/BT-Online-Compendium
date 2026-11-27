import type { SourceCitation } from '../rules/model'
import { TERRAN_CONTEXT, TERRAN_ID, TERRAN_BELTER_ID, TERRAN_LUNAR_ID, TERRAN_MARTIAN_ID, TERRAN_OUTER_SYSTEM_ID, TERRAN_CITIZEN_ID, TERRAN_VENUSIAN_ID } from './affiliations'
import type { ConditionalLifeModulePackageDefinition, LifeModuleAward, LifeModuleCatalogValidationIssue, LifeModuleDefinition, LifeModuleDestination, LifeModulePrerequisite } from './model'
 import { CAPELLAN_COMMONALITY_CONTEXT, CAPELLAN_COMMONALITY_ID, COMSTAR_ORDER_ID, DRACONIS_AZAMI_ID, DRACONIS_BENJAMIN_ID, DRACONIS_COMBINE_CONTEXT, DRACONIS_COMBINE_ID, DRACONIS_DIERON_ID, DRACONIS_NEW_SAMARKAND_ID, DRACONIS_PESHT_ID, FEDERATED_SUNS_CAPELLAN_MARCH_CONTEXT, FEDERATED_SUNS_CAPELLAN_MARCH_ID, FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT, FEDERATED_SUNS_CRUCIS_MARCH_ID, FEDERATED_SUNS_DRACONIS_MARCH_CONTEXT, FEDERATED_SUNS_DRACONIS_MARCH_ID, FEDERATED_SUNS_OUTBACK_CONTEXT, FEDERATED_SUNS_OUTBACK_ID, FWL_ANDURIEN_ID, FWL_MARIK_COMMONWEALTH_ID, FWL_ORIENTE_ID, FWL_OTHER_WORLDS_ID, FWL_REGULUS_ID, FREE_RASALHAGUE_REPUBLIC_CONTEXT, FREE_RASALHAGUE_REPUBLIC_ID, RASALHAGUE_CLAN_WAR_EXPATRIATE_ID, RASALHAGUE_GHOST_BEAR_ID, FREE_WORLDS_LEAGUE_CONTEXT, FREE_WORLDS_LEAGUE_ID, LIAO_COMMONALITY_CONTEXT, LIAO_COMMONALITY_ID, LYRAN_ALLIANCE_CONTEXT, LYRAN_ALLIANCE_ID, LYRAN_ALARION_ID, LYRAN_BOLAN_ID, LYRAN_COVENTRY_ID, LYRAN_DONEGAL_ID, LYRAN_SKYE_ID, ST_IVES_COMMONALITY_CONTEXT, ST_IVES_COMMONALITY_ID, UNIVERSAL_LIFE_MODULE_CONTEXT, UNIVERSAL_STAGE_0_ID, VICTORIA_COMMONALITY_CONTEXT, VICTORIA_COMMONALITY_ID, WORD_OF_BLAKE_ORDER_ID } from './affiliations'
import { ANALYSIS_FIELD_ID, ANTHROPOLOGIST_FIELD_ID, ARCHAEOLOGIST_FIELD_ID, BASIC_TRAINING_FIELD_ID, BASIC_TRAINING_NAVAL_FIELD_ID, CARTOGRAPHER_FIELD_ID, CAVALRY_FIELD_ID, COMMUNICATIONS_FIELD_ID, COVERT_OPERATIONS_FIELD_ID, DETECTIVE_FIELD_ID, DOCTOR_FIELD_ID, ENGINEER_FIELD_ID, GENERAL_STUDIES_FIELD_ID, INFANTRY_FIELD_ID, INTELLIGENCE_FIELD_ID, JOURNALIST_FIELD_ID, LAWYER_FIELD_ID, MANAGER_FIELD_ID, MARINE_FIELD_ID, MECHWARRIOR_FIELD_ID, MEDICAL_ASSISTANT_FIELD_ID, MERCHANT_FIELD_ID, MERCHANT_MARINE_FIELD_ID, MILITARY_SCIENTIST_FIELD_ID, OFFICER_FIELD_ID, PLANETARY_SURVEYOR_FIELD_ID, PILOT_AIRCRAFT_CIVILIAN_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID, PILOT_DROPSHIP_FIELD_ID, PILOT_JUMPSHIP_FIELD_ID, PILOT_WARSHIP_FIELD_ID, POLICE_OFFICER_FIELD_ID, POLICE_TACTICAL_OFFICER_FIELD_ID, POLITICIAN_FIELD_ID, SCIENTIST_FIELD_ID, SCOUT_FIELD_ID, SHIPS_CREW_FIELD_ID, SPECIAL_FORCES_FIELD_ID, TECHNICIAN_AEROSPACE_FIELD_ID, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_MECH_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID } from '../skillFields/catalog'
import { OFFICER_TRAINING_SCHOOL_ID, stage3SchoolClassification } from './stage3Schooling'
import { INFANTRY_ANTI_MECH_FIELD_ID } from '../skillFields/catalog'
import { PILOT_AEROSPACE_CIVILIAN_FIELD_ID, PILOT_AEROSPACE_COMBAT_FIELD_ID, PILOT_AIRCRAFT_COMBAT_FIELD_ID } from '../skillFields/catalog'
import { HPG_TECHNICIAN_FIELD_ID } from '../skillFields/catalog'
import { CLAN_AEROSPACE_WARRIOR_FIELD_ID, CLAN_BASIC_TRAINING_FIELD_ID, CLAN_ELEMENTAL_FIELD_ID, CLAN_MECHWARRIOR_FIELD_ID } from '../skillFields/catalog'
import { DEEP_PERIPHERY_CASTILIAN_ID, DEEP_PERIPHERY_CONTEXT, DEEP_PERIPHERY_HANSEATIC_ID, DEEP_PERIPHERY_ID, DEEP_PERIPHERY_JARNFOLK_ID, DEEP_PERIPHERY_UMAYYAD_ID, MAJOR_PERIPHERY_CANOPUS_ID, MAJOR_PERIPHERY_CIRCINUS_ID, MAJOR_PERIPHERY_CONTEXT, MAJOR_PERIPHERY_ID, MAJOR_PERIPHERY_MARIAN_ID, MAJOR_PERIPHERY_OUTWORLDS_ID, MAJOR_PERIPHERY_TAURIAN_ID, MINOR_PERIPHERY_CONTEXT, MINOR_PERIPHERY_FRANKLIN_ID, MINOR_PERIPHERY_ID, MINOR_PERIPHERY_MICA_ID, MINOR_PERIPHERY_NIOPS_ID, MINOR_PERIPHERY_RANDIS_ID, MINOR_PERIPHERY_RIM_ID } from './affiliations'

export { CAPELLAN_COMMONALITY_ID, COMSTAR_ORDER_ID, DRACONIS_AZAMI_ID, DRACONIS_BENJAMIN_ID, DRACONIS_COMBINE_ID, DRACONIS_DIERON_ID, DRACONIS_NEW_SAMARKAND_ID, DRACONIS_PESHT_ID, FEDERATED_SUNS_CAPELLAN_MARCH_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID, FEDERATED_SUNS_DRACONIS_MARCH_ID, FEDERATED_SUNS_OUTBACK_ID, LIAO_COMMONALITY_ID, SIAN_COMMONALITY_ID, ST_IVES_COMMONALITY_ID, UNIVERSAL_STAGE_0_ID, VICTORIA_COMMONALITY_ID, WORD_OF_BLAKE_ORDER_ID } from './affiliations'
export { FWL_ANDURIEN_ID, FWL_MARIK_COMMONWEALTH_ID, FWL_ORIENTE_ID, FWL_OTHER_WORLDS_ID, FWL_REGULUS_ID, FREE_WORLDS_LEAGUE_ID, LYRAN_ALLIANCE_ID, LYRAN_ALARION_ID, LYRAN_BOLAN_ID, LYRAN_COVENTRY_ID, LYRAN_DONEGAL_ID, LYRAN_SKYE_ID } from './affiliations'
export { FREE_RASALHAGUE_REPUBLIC_ID, RASALHAGUE_CLAN_WAR_EXPATRIATE_ID, RASALHAGUE_GHOST_BEAR_ID } from './affiliations'
export { MAJOR_PERIPHERY_ID, MAJOR_PERIPHERY_CIRCINUS_ID, MAJOR_PERIPHERY_CANOPUS_ID, MAJOR_PERIPHERY_MARIAN_ID, MAJOR_PERIPHERY_OUTWORLDS_ID, MAJOR_PERIPHERY_TAURIAN_ID } from './affiliations'
export { DEEP_PERIPHERY_ID, DEEP_PERIPHERY_HANSEATIC_ID, DEEP_PERIPHERY_CASTILIAN_ID, DEEP_PERIPHERY_UMAYYAD_ID, DEEP_PERIPHERY_JARNFOLK_ID, TERRAN_ID, TERRAN_BELTER_ID, TERRAN_LUNAR_ID, TERRAN_MARTIAN_ID, TERRAN_OUTER_SYSTEM_ID, TERRAN_CITIZEN_ID, TERRAN_VENUSIAN_ID } from './affiliations'
export { OFFICER_TRAINING_SCHOOL_ID } from './stage3Schooling'

export interface ConditionalPackageCatalogValidationIssue {
  packageId: string
  message: string
}

export function validateConditionalPackageCatalog(catalog: readonly ConditionalLifeModulePackageDefinition[] = CONDITIONAL_LIFE_MODULE_PACKAGE_CATALOG): ConditionalPackageCatalogValidationIssue[] {
  const issues: ConditionalPackageCatalogValidationIssue[] = []
  const packageIds = new Set<string>()
  for (const packageDefinition of catalog) {
    if (!packageDefinition.id || packageIds.has(packageDefinition.id)) issues.push({ packageId: packageDefinition.id, message: 'Package IDs must be present and unique.' })
    packageIds.add(packageDefinition.id)
    if (!packageDefinition.displayName || !packageDefinition.source.sourceId || packageDefinition.choices.length === 0) issues.push({ packageId: packageDefinition.id, message: 'Package display name, source provenance, and at least one option are required.' })
    const optionIds = new Set<string>()
    for (const option of packageDefinition.choices) {
      if (!option.id || optionIds.has(option.id)) issues.push({ packageId: packageDefinition.id, message: 'Option IDs must be present and unique within a package.' })
      optionIds.add(option.id)
      if (!option.displayName || option.awards.length === 0) issues.push({ packageId: packageDefinition.id, message: `Option ${option.id} requires a display name and complete award bundle.` })
      for (const nested of option.nestedChoices ?? []) {
        if (!nested.id || nested.required !== true || nested.validOptionIds.length === 0 || !nested.awardId || !nested.source.sourceId) issues.push({ packageId: packageDefinition.id, message: `Nested choice ${nested.id} is incomplete.` })
        if (!option.awards.some((award) => award.id === nested.awardId)) issues.push({ packageId: packageDefinition.id, message: `Nested choice ${nested.id} references a missing award.` })
      }
    }
  }
  return issues
}

export function getConditionalLifeModulePackage(packageId: string): ConditionalLifeModulePackageDefinition {
  const packageDefinition = CONDITIONAL_LIFE_MODULE_PACKAGE_CATALOG.find((entry) => entry.id === packageId)
  if (!packageDefinition) throw new Error(`Unknown conditional Life Module package: ${packageId}`)
  return packageDefinition
}

export const LIFE_MODULE_RULES_SOURCE: SourceCitation = {
  sourceId: 'atow-core-corrected-third',
  edition: 'Corrected Third Printing',
  page: 61,
  ruleId: 'life-module-character-creation',
}

const source = (page: number, ruleId: string): SourceCitation => ({
  sourceId: 'atow-core-corrected-third',
  edition: 'Corrected Third Printing',
  page,
  ruleId,
})
const sourceWithoutPage = (ruleId: string): SourceCitation => ({
  sourceId: 'atow-core-corrected-third',
  edition: 'Corrected Third Printing',
  ruleId,
})

const attribute = (attributeId: string): LifeModuleDestination => ({ type: 'attribute', attributeId })
const trait = (traitId: string, displayName: string, parameters?: Record<string, string | number | boolean>): LifeModuleDestination => ({
  type: 'trait', traitId, displayName, ...(parameters ? { parameters } : {}),
})
const skill = (skillId: string, displayName: string, parameter?: string): LifeModuleDestination => ({
  type: 'skill',
  address: { skillId, ...(parameter ? { parameter: { kind: 'subskill', value: parameter } } : {}) },
  displayName,
})
const fixed = (id: string, xp: number, destination: LifeModuleDestination): LifeModuleAward => ({ id, kind: 'fixed', xp, destination })
const resolveLyranSource = (id: string): SourceCitation => {
  const context = [LYRAN_ALARION_ID, LYRAN_BOLAN_ID, LYRAN_COVENTRY_ID, LYRAN_DONEGAL_ID, LYRAN_SKYE_ID].find((entry) => entry === id)
  return { ...LYRAN_ALLIANCE_CONTEXT.source, ruleId: context ? `lyran-alliance-${id.split('.').at(-1)}` : 'lyran-alliance' }
}

export const BLUE_COLLAR_ID = 'stage1.blue-collar'
export const BACK_WOODS_ID = 'stage1.back-woods'
export const FARM_ID = 'stage1.farm'
export const WAR_ORPHAN_ID = 'stage1.war-orphan'
export const STAGE_2_BACK_WOODS_ID = 'stage2.back-woods'
export const STAGE_2_HIGH_SCHOOL_ID = 'stage2.high-school'
export const MILITARY_SCHOOL_ID = 'stage2.military-school'
export const TECHNICAL_COLLEGE_ID = 'stage3.technical-college'
export const UNIVERSITY_ID = 'stage3.university'
export const TRADE_SCHOOL_ID = 'stage3.trade-school'
export const POLICE_ACADEMY_ID = 'stage3.police-academy'
export const INTELLIGENCE_OPERATIVE_TRAINING_ID = 'stage3.intelligence-operative-training'
export const MILITARY_ACADEMY_ID = 'stage3.military-academy'
export const MILITARY_ENLISTMENT_ID = 'stage3.military-enlistment'
export const FAMILY_TRAINING_ID = 'stage3.family-training'
export const SOLARIS_INTERNSHIP_ID = 'stage3.solaris-internship'
export const AGITATOR_ID = 'stage4.agitator'
export const COMSTAR_WOB_SERVICE_ID = 'stage4.comstar-word-of-blake-service'
export const TRAVEL_ID = 'stage4.travel'
export const CLAN_WATCH_OPERATIVE_ID = 'stage4.clan-watch-operative'
export const CLAN_CIVILIAN_JOB_ID = 'stage4.civilian-job'
export const CLAN_SCIENTIST_CASTE_SERVICE_ID = 'stage4.scientist-caste-service'
export const CLAN_WATCH_OPERATIVE_BRANCH_PACKAGE_ID = 'package.clan-watch-operative-branch'
export const CLAN_SCIENTIST_CASTE_SERVICE_TRAIT_PACKAGE_ID = 'package.scientist-caste-service-trait-pair'
export const TRUEBORN_CRECHE_ID = 'stage1.trueborn-creche'
export const CLAN_APPRENTICESHIP_ID = 'stage2.clan-apprenticeship'
export const TRUEBORN_SIBKO_ID = 'stage2.trueborn-sibko'

const clanAffiliation = (id: string): LifeModulePrerequisite => ({ id, kind: 'affiliation', affiliationId: 'affiliation.clan', description: 'Clan affiliation' })
const trueborn = (id: string): LifeModulePrerequisite => ({ id, kind: 'birth-origin', birthOrigin: 'trueborn', description: 'Trueborn birth origin' })
const phenotype = (id: string, phenotypeId: string): Exclude<LifeModulePrerequisite, { kind: 'any-of' }> => ({ id, kind: 'phenotype', phenotypeId, description: `${phenotypeId} Phenotype` })
const attributeMinimum = (id: string, attributeId: string, minimum: number): LifeModulePrerequisite => ({ id, kind: 'attribute-minimum', attributeId, minimum, description: `${attributeId} ${minimum}+` })
const clanFieldGrant = (id: string, fieldId: string, purchaseCostXp: number, xpPerSkill: number, category: 'basic' | 'advanced'): LifeModuleAward => ({ id, kind: 'field-grant', description: `${fieldId} governed Clan training Field`, fieldId, xpPerSkill, purchaseCostXp, schoolModuleId: id.startsWith('sibko') ? TRUEBORN_SIBKO_ID : CLAN_APPRENTICESHIP_ID, offerId: `${id.startsWith('sibko') ? TRUEBORN_SIBKO_ID : CLAN_APPRENTICESHIP_ID}/${fieldId}`, chronologyYears: category === 'basic' ? 1 : 2, category })

const terranFixed = (id: string, xp: number, destination: LifeModuleDestination): LifeModuleAward => fixed(id, xp, destination)
const terranChoice = (id: string, skillId: string, displayName: string, xp: number, count: number): LifeModuleAward => ({ id, kind: count === 1 ? 'any-skill-choice' : 'multi-skill-choice', xp, skillId, displayName, count, ...(count > 1 ? { distinct: true } : {}) } as LifeModuleAward)
const terranSource = (ruleId: string): SourceCitation => source(72, ruleId)

const TERRAN_LIFE_MODULES: readonly LifeModuleDefinition[] = [
  { id: TERRAN_ID, displayName: 'Terran', stage: 0, kind: 'affiliation', source: terranSource('terran-affiliation'), costXp: 240, primaryLanguage: 'Any', secondaryLanguages: [...TERRAN_CONTEXT.secondaryLanguages], prerequisites: [], awards: [terranFixed('terran.int', 100, attribute('INT')), terranFixed('terran.edg', -150, attribute('EDG')), { id: 'terran.attributes', kind: 'flexible-xp', xpPerGrant: 50, count: 2, allowedTargetTypes: ['attribute'], excludedTargetIds: ['INT', 'EDG'] }, terranFixed('terran.compulsion', -75, trait('trait.compulsion', 'Compulsion/Distrust of Non-Terrans')), terranFixed('terran.reputation', 100, trait('trait.reputation', 'Reputation')), terranFixed('terran.language.english', 25, skill('skill.language', 'Language/English', 'English')), terranChoice('terran.languages', 'skill.language', 'Language/Any', 15, 2)], notes: ['Source: Corrected Third Printing p. 72.'], deferredRules: [] },
  { id: TERRAN_BELTER_ID, displayName: 'Terran / Belter', stage: 0, kind: 'affiliation', source: terranSource('terran-belter'), costXp: 0, primaryLanguage: 'Any', secondaryLanguages: [], prerequisites: [], awards: [terranFixed('belter.str', -25, attribute('STR')), terranFixed('belter.bod', -25, attribute('BOD')), { id: 'belter.attribute', kind: 'flexible-xp', xpPerGrant: 100, count: 1, allowedTargetTypes: ['attribute'], excludedTargetIds: ['CHA', 'EDG'] }, { id: 'belter.trait.one', kind: 'flexible-xp', xpPerGrant: 50, count: 1, allowedTargetTypes: ['trait'] }, { id: 'belter.trait.two', kind: 'flexible-xp', xpPerGrant: 50, count: 1, allowedTargetTypes: ['trait'] }, terranFixed('belter.compulsion', -100, trait('trait.compulsion', 'Compulsion/Xenophobia')), terranFixed('belter.reputation', -50, trait('trait.reputation', 'Reputation')), terranFixed('belter.wealth', 50, trait('trait.wealth', 'Wealth')), terranChoice('belter.skills', 'skill.any', 'Choose two Belter Skills', 10, 2), terranFixed('belter.navigation', 15, skill('skill.navigation', 'Navigation/Space', 'Space')), terranFixed('belter.survival', 10, skill('skill.survival', 'Survival/Asteroids', 'Asteroids')), terranFixed('belter.zero-g', 15, skill('skill.zero-g-operations', 'Zero-G Operations'))], notes: ['Source: Corrected Third Printing p. 72.'], deferredRules: [] },
  { id: TERRAN_LUNAR_ID, displayName: 'Terran / Lunar Citizen', stage: 0, kind: 'affiliation', source: terranSource('terran-lunar-citizen'), costXp: 0, primaryLanguage: 'Any', secondaryLanguages: [], prerequisites: [], awards: [terranFixed('lunar.str', -20, attribute('STR')), terranFixed('lunar.bod', -25, attribute('BOD')), terranFixed('lunar.int', 50, attribute('INT')), terranFixed('lunar.wil', 65, attribute('WIL')), terranFixed('lunar.edg', -25, attribute('EDG')), terranFixed('lunar.equipped', 25, trait('trait.equipped', 'Equipped')), terranFixed('lunar.poor-vision', -25, trait('trait.poor-vision', 'Poor Vision')), terranFixed('lunar.wealth', 50, trait('trait.wealth', 'Wealth')), terranFixed('lunar.technician', 5, skill('skill.technician', 'Technician/Any', 'Any')), terranChoice('lunar.skill', 'skill.any', 'Choose one Lunar Skill', 10, 1)], notes: ['Source: Corrected Third Printing p. 72.'], deferredRules: [] },
  { id: TERRAN_MARTIAN_ID, displayName: 'Terran / Martian Citizen', stage: 0, kind: 'affiliation', source: terranSource('terran-martian-citizen'), costXp: 0, primaryLanguage: 'Any', secondaryLanguages: [], prerequisites: [], awards: [terranFixed('martian.str', -15, attribute('STR')), terranFixed('martian.wil', 75, attribute('WIL')), terranFixed('martian.equipped', 65, trait('trait.equipped', 'Equipped')), terranFixed('martian.introvert', -25, trait('trait.introvert', 'Introvert')), terranFixed('martian.poor-vision', -25, trait('trait.poor-vision', 'Poor Vision')), terranFixed('martian.reputation', -25, trait('trait.reputation', 'Reputation')), terranFixed('martian.wealth', 35, trait('trait.wealth', 'Wealth')), terranFixed('martian.language-secondary', -10, skill('skill.language', 'Language/Secondary', 'Secondary')), terranFixed('martian.negotiation', 10, skill('skill.negotiation', 'Negotiation')), terranFixed('martian.survival', 10, skill('skill.survival', 'Survival/Martian Desert', 'Martian Desert')), terranChoice('martian.skill', 'skill.any', 'Choose one Martian Skill', 15, 1)], notes: ['Source: Corrected Third Printing p. 72.'], deferredRules: [] },
  { id: TERRAN_OUTER_SYSTEM_ID, displayName: 'Terran / Outer System Citizen', stage: 0, kind: 'affiliation', source: terranSource('terran-outer-system-citizen'), costXp: 0, primaryLanguage: 'Any', secondaryLanguages: [], prerequisites: [], awards: [terranFixed('outer.str', -15, attribute('STR')), terranFixed('outer.bod', -15, attribute('BOD')), terranFixed('outer.rfl', 20, attribute('RFL')), terranFixed('outer.equipped', 75, trait('trait.equipped', 'Equipped')), terranFixed('outer.reputation', -20, trait('trait.reputation', 'Reputation')), terranFixed('outer.wealth', 25, trait('trait.wealth', 'Wealth')), terranFixed('outer.negotiation', 10, skill('skill.negotiation', 'Negotiation')), terranFixed('outer.technician', 10, skill('skill.technician', 'Technician/Any', 'Any')), terranChoice('outer.skills', 'skill.any', 'Choose two Outer System Skills', 10, 2)], notes: ['Source: Corrected Third Printing p. 72.'], deferredRules: [] },
  { id: TERRAN_CITIZEN_ID, displayName: 'Terran / Terran Citizen', stage: 0, kind: 'affiliation', source: terranSource('terran-terran-citizen'), costXp: 0, primaryLanguage: 'Any', secondaryLanguages: [], prerequisites: [], awards: [terranFixed('citizen.edg', -100, attribute('EDG')), terranFixed('citizen.compulsion', -75, trait('trait.compulsion', 'Compulsion/Distrust of Non-Terrans')), terranFixed('citizen.connections', 100, trait('trait.connections', 'Connections')), terranFixed('citizen.equipped', 100, trait('trait.equipped', 'Equipped')), terranFixed('citizen.impatient', -50, trait('trait.impatient', 'Impatient')), terranFixed('citizen.wealth', 110, trait('trait.wealth', 'Wealth')), terranFixed('citizen.history', 10, skill('skill.interest', 'Interest/Terran History', 'Terran History')), terranFixed('citizen.perception', -5, skill('skill.perception', 'Perception')), terranChoice('citizen.skills', 'skill.any', 'Choose four other Skills', 5, 4)], notes: ['Source: Corrected Third Printing p. 72.'], deferredRules: [] },
  { id: TERRAN_VENUSIAN_ID, displayName: 'Terran / Venusian Citizen', stage: 0, kind: 'affiliation', source: terranSource('terran-venusian-citizen'), costXp: 0, primaryLanguage: 'Any', secondaryLanguages: [], prerequisites: [], awards: [terranFixed('venusian.bod', 35, attribute('BOD')), terranFixed('venusian.int', -25, attribute('INT')), terranFixed('venusian.wil', 110, attribute('WIL')), terranFixed('venusian.equipped', 25, trait('trait.equipped', 'Equipped')), terranFixed('venusian.introvert', -50, trait('trait.introvert', 'Introvert')), terranFixed('venusian.reputation', -25, trait('trait.reputation', 'Reputation')), terranFixed('venusian.wealth', 15, trait('trait.wealth', 'Wealth')), terranFixed('venusian.language-secondary', -10, skill('skill.language', 'Language/Secondary', 'Secondary')), terranFixed('venusian.survival', 20, skill('skill.survival', 'Survival/Any', 'Any')), terranChoice('venusian.skill', 'skill.any', 'Choose one Venusian Skill', 15, 1)], notes: ['Source: Corrected Third Printing p. 72.'], deferredRules: ['Characters born after 3059 are ineligible.'], },
]

export const LIFE_MODULE_CATALOG: readonly LifeModuleDefinition[] = [
  ...TERRAN_LIFE_MODULES,
  {
    id: FREE_WORLDS_LEAGUE_ID, displayName: 'Free Worlds League', stage: 0, kind: 'affiliation', source: FREE_WORLDS_LEAGUE_CONTEXT.source, costXp: 150,
    primaryLanguage: 'English', secondaryLanguages: ['Greek', 'Hindi', 'Italian', 'Mandarin Chinese', 'Mongolian', 'Romanian', 'Slovak', 'Spanish', 'Urdu'], prerequisites: [],
    awards: [
      { id: 'fwl.language.secondary', kind: 'language-choice', xp: 15, choicesFrom: 'fwl-languages', description: 'Choose one Free Worlds secondary language.' },
      fixed('fwl.skill.art', 10, skill('skill.art', 'Art/Any')),
    ], notes: ['Source: Corrected Third Printing p. 66.'], deferredRules: [],
  },
  {
    id: FWL_MARIK_COMMONWEALTH_ID, displayName: 'Free Worlds League / Marik Commonwealth', stage: 0, kind: 'affiliation', source: FREE_WORLDS_LEAGUE_CONTEXT.source, costXp: 0, primaryLanguage: 'English', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('marik.wealth', 100, trait('trait.wealth', 'Wealth')), fixed('marik.equipped', 100, trait('trait.equipped', 'Equipped')), fixed('marik.reputation', -100, trait('trait.reputation', 'Reputation')), fixed('marik.appraisal', 5, skill('skill.appraisal', 'Appraisal')), fixed('marik.negotiation', 10, skill('skill.negotiation', 'Negotiation')), fixed('marik.protocol', 10, skill('skill.protocol', 'Protocol/Free Worlds', 'Free Worlds'))], notes: ['Source: Corrected Third Printing p. 66.'], deferredRules: [],
  },
  {
    id: FWL_REGULUS_ID, displayName: 'Free Worlds League / Principality of Regulus', stage: 0, kind: 'affiliation', source: FREE_WORLDS_LEAGUE_CONTEXT.source, costXp: 0, primaryLanguage: 'English', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('regulus.wil', 75, attribute('WIL')), fixed('regulus.gregarious', 75, trait('trait.gregarious', 'Gregarious')), fixed('regulus.atrean', -50, trait('trait.compulsion', 'Compulsion/Atrean Opponent', { compulsion: 'Atrean Opponent' })), fixed('regulus.reputation', -50, trait('trait.reputation', 'Reputation')), fixed('regulus.history', 20, skill('skill.interest', 'Interest/Regulan History', 'Regulan History')), fixed('regulus.negotiation', 25, skill('skill.negotiation', 'Negotiation')), fixed('regulus.perception', 15, skill('skill.perception', 'Perception')), fixed('regulus.protocol', 15, skill('skill.protocol', 'Protocol/Free Worlds', 'Free Worlds'))], notes: ['Source: Corrected Third Printing p. 66.'], deferredRules: [],
  },
  {
    id: FWL_ORIENTE_ID, displayName: 'Free Worlds League / Duchy of Oriente', stage: 0, kind: 'affiliation', source: FREE_WORLDS_LEAGUE_CONTEXT.source, costXp: 0, primaryLanguage: 'English', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('oriente.reputation', 100, trait('trait.reputation', 'Reputation')), fixed('oriente.appraisal', 5, skill('skill.appraisal', 'Appraisal')), fixed('oriente.negotiation', 15, skill('skill.negotiation', 'Negotiation')), fixed('oriente.technician', 5, skill('skill.technician', 'Technician/Any'))], notes: ['Source: Corrected Third Printing p. 66.'], deferredRules: [],
  },
  {
    id: FWL_ANDURIEN_ID, displayName: 'Free Worlds League / Duchy of Andurien', stage: 0, kind: 'affiliation', source: FREE_WORLDS_LEAGUE_CONTEXT.source, costXp: 0, primaryLanguage: 'English', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('andurien.wil', 50, attribute('WIL')), fixed('andurien.combat-sense', 215, trait('trait.combat-sense', 'Combat Sense')), fixed('andurien.liao', -100, trait('trait.compulsion', 'Compulsion/Hatred of House Liao', { compulsion: 'Hatred of House Liao' })), fixed('andurien.atrean', -50, trait('trait.compulsion', 'Compulsion/Atrean Opponent', { compulsion: 'Atrean Opponent' })), fixed('andurien.reputation', -30, trait('trait.reputation', 'Reputation')), fixed('andurien.negotiation', 15, skill('skill.negotiation', 'Negotiation')), fixed('andurien.perception', 10, skill('skill.perception', 'Perception')), fixed('andurien.protocol', 15, skill('skill.protocol', 'Protocol/Free Worlds', 'Free Worlds'))], notes: ['Source: Corrected Third Printing p. 66.'], deferredRules: [],
  },
  {
    id: FWL_OTHER_WORLDS_ID, displayName: 'Free Worlds League / Other FWL Worlds', stage: 0, kind: 'affiliation', source: FREE_WORLDS_LEAGUE_CONTEXT.source, costXp: 0, primaryLanguage: 'English', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('other-fwl.appraisal', 15, skill('skill.appraisal', 'Appraisal')), fixed('other-fwl.protocol', 10, skill('skill.protocol', 'Protocol/Free Worlds', 'Free Worlds')), { id: 'other-fwl.language', kind: 'language-choice', xp: 20, choicesFrom: 'fwl-languages', description: 'Choose one Language/Any.' }, { id: 'other-fwl.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 25, allowedTargetTypes: ['attribute', 'trait', 'skill'] }, { id: 'other-fwl.trait', kind: 'flexible-xp', xpPerGrant: 35, count: 1, allowedTargetTypes: ['trait'] }, { id: 'other-fwl.skills', kind: 'modeled-skill-choice', xp: 10, displayName: 'Choose two other Skills', count: 2, distinct: true }], notes: ['Source: Corrected Third Printing p. 66.'], deferredRules: [],
  },
  {
    id: LYRAN_ALLIANCE_ID, displayName: 'Lyran Alliance', stage: 0, kind: 'affiliation', source: LYRAN_ALLIANCE_CONTEXT.source, costXp: 150,
    primaryLanguage: 'German', secondaryLanguages: [...LYRAN_ALLIANCE_CONTEXT.secondaryLanguages], prerequisites: [],
    awards: [fixed('lyran.attribute.wil', -50, attribute('WIL')), fixed('lyran.attribute.edg', -50, attribute('EDG')), fixed('lyran.trait.equipped', 100, trait('trait.equipped', 'Equipped')), fixed('lyran.trait.extra-income', 50, trait('trait.extra-income', 'Extra Income')), fixed('lyran.trait.wealth', 100, trait('trait.wealth', 'Wealth')), { id: 'lyran.trait.choice', kind: 'choice-package', description: 'Choose Combat Paralysis or Glass Jaw.', options: [[trait('trait.combat-paralysis', 'Combat Paralysis')], [trait('trait.glass-jaw', 'Glass Jaw')]] }, fixed('lyran.skill.negotiation', 15, skill('skill.negotiation', 'Negotiation')), fixed('lyran.skill.appraisal', 10, skill('skill.appraisal', 'Appraisal')), fixed('lyran.skill.protocol', 15, skill('skill.protocol', 'Protocol/Lyran', 'Lyran'))],
    notes: ['Source: Corrected Third Printing p. 66.'], deferredRules: [],
  },
  ...[
    [LYRAN_ALARION_ID, 'Alarion', [fixed('alarion.attribute.cha', -50, attribute('CHA')), fixed('alarion.trait.wealth', 70, trait('trait.wealth', 'Wealth')), fixed('alarion.skill.administration', 10, skill('skill.administration', 'Administration')), { id: 'alarion.skill.interest', kind: 'any-skill-choice', xp: 10, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 }, { id: 'alarion.language.any', kind: 'language-choice', xp: 10, choicesFrom: 'any-language', description: 'Language/Any' }, fixed('alarion.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation'))]],
    [LYRAN_BOLAN_ID, 'Bolan', [fixed('bolan.trait.hatred-marik', -50, trait('trait.compulsion', 'Compulsion/Hatred of House Marik', { compulsion: 'Hatred of House Marik' })), fixed('bolan.trait.connections', 50, trait('trait.connections', 'Connections')), fixed('bolan.trait.wealth', 25, trait('trait.wealth', 'Wealth')), fixed('bolan.skill.administration', 5, skill('skill.administration', 'Administration')), fixed('bolan.skill.negotiation', 15, skill('skill.negotiation', 'Negotiation')), fixed('bolan.skill.protocol', 10, skill('skill.protocol', 'Protocol/Lyran', 'Lyran')), fixed('bolan.skill.streetwise', 5, skill('skill.streetwise', 'Streetwise/Lyran', 'Lyran'))]],
    [LYRAN_COVENTRY_ID, 'Coventry', [fixed('coventry.attribute.wil', 100, attribute('WIL')), fixed('coventry.trait.hatred-clans', -95, trait('trait.compulsion', 'Compulsion/Hatred of Clans', { compulsion: 'Hatred of Clans' })), fixed('coventry.trait.wealth', 25, trait('trait.wealth', 'Wealth')), fixed('coventry.skill.administration', 10, skill('skill.administration', 'Administration')), fixed('coventry.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation')), fixed('coventry.skill.protocol', 10, skill('skill.protocol', 'Protocol/Lyran', 'Lyran'))]],
    [LYRAN_DONEGAL_ID, 'Donegal', [fixed('donegal.attribute.wil', 50, attribute('WIL')), fixed('donegal.trait.greedy', -75, trait('trait.compulsion', 'Compulsion/Greedy', { compulsion: 'Greedy' })), fixed('donegal.trait.connections', 50, trait('trait.connections', 'Connections')), fixed('donegal.trait.reputation', -50, trait('trait.reputation', 'Reputation')), fixed('donegal.trait.wealth', 50, trait('trait.wealth', 'Wealth')), fixed('donegal.skill.appraisal', 10, skill('skill.appraisal', 'Appraisal')), fixed('donegal.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation')), fixed('donegal.skill.protocol', 15, skill('skill.protocol', 'Protocol/Lyran', 'Lyran'))]],
    [LYRAN_SKYE_ID, 'Skye', [fixed('skye.attribute.wil', 100, attribute('WIL')), fixed('skye.trait.connections', 85, trait('trait.connections', 'Connections')), fixed('skye.trait.reputation', -150, trait('trait.reputation', 'Reputation')), fixed('skye.language.gaelic', 10, skill('skill.language', 'Language/Scots Gaelic', 'Scots Gaelic')), fixed('skye.skill.negotiation', 15, skill('skill.negotiation', 'Negotiation')), fixed('skye.skill.protocol', -15, skill('skill.protocol', 'Protocol/Lyran', 'Lyran')), fixed('skye.skill.streetwise', 15, skill('skill.streetwise', 'Streetwise/Lyran', 'Lyran'))]],
  ].map(([id, name, awards]) => ({ id: id as string, displayName: `Lyran Alliance / ${name}`, stage: 0 as const, kind: 'affiliation' as const, source: resolveLyranSource(id as string), costXp: 0, primaryLanguage: 'German', secondaryLanguages: [], prerequisites: [], awards: awards as LifeModuleAward[], notes: ['Source: Corrected Third Printing p. 66.'], deferredRules: [] })),
  {
    id: FREE_RASALHAGUE_REPUBLIC_ID, displayName: 'Free Rasalhague Republic', stage: 0, kind: 'affiliation', source: FREE_RASALHAGUE_REPUBLIC_CONTEXT.source, costXp: 100,
    primaryLanguage: 'Swedish', secondaryLanguages: [...FREE_RASALHAGUE_REPUBLIC_CONTEXT.secondaryLanguages], prerequisites: [],
    awards: [fixed('rasalhague.attribute.wil', 25, attribute('WIL')), fixed('rasalhague.attribute.edg', -25, attribute('EDG')), fixed('rasalhague.skill.negotiation', 15, skill('skill.negotiation', 'Negotiation')), { id: 'rasalhague.skill.interest', kind: 'any-skill-choice', xp: 10, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 }],
    notes: ['Source: Corrected Third Printing p. 67. Rasalhague-born mercenary Reputation and Ghost Bear Stage 1/2 restrictions remain deferred to their governing systems.'], deferredRules: [],
  },
  {
    id: RASALHAGUE_CLAN_WAR_EXPATRIATE_ID, displayName: 'Free Rasalhague Republic / Clan War Expatriate', stage: 0, kind: 'affiliation', source: { ...FREE_RASALHAGUE_REPUBLIC_CONTEXT.source, ruleId: 'free-rasalhague-republic-clan-war-expatriate' }, costXp: 0,
    primaryLanguage: 'Swedish', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('rasalhague-expatriate.attribute.wil', 125, attribute('WIL')), fixed('rasalhague-expatriate.attribute.edg', 100, attribute('EDG')), fixed('rasalhague-expatriate.trait.clan-hatred', -150, trait('trait.compulsion', 'Compulsion/Hatred of Clans', { compulsion: 'Hatred of Clans' })), fixed('rasalhague-expatriate.trait.draconis-hatred', -50, trait('trait.compulsion', 'Compulsion/Hatred of Draconis', { compulsion: 'Hatred of Draconis' })), { id: 'rasalhague-expatriate.language.choice', kind: 'language-choice', xp: 15, choicesFrom: 'rasalhague-choice-languages', description: 'Choose one Lyran or Draconis language.' }, fixed('rasalhague-expatriate.skill.martial-arts', 10, skill('skill.martial-arts', 'Martial Arts')), { id: 'rasalhague-expatriate.protocol.choice', kind: 'choice-package', description: 'Choose Protocol/Lyran or Protocol/Draconis.', options: [[skill('skill.protocol', 'Protocol/Lyran', 'Lyran')], [skill('skill.protocol', 'Protocol/Draconis', 'Combine')]] }, fixed('rasalhague-expatriate.skill.small-arms', 15, skill('skill.small-arms', 'Small Arms'))],
    notes: ['Source: Corrected Third Printing p. 67.'], deferredRules: [],
  },
  {
    id: RASALHAGUE_GHOST_BEAR_ID, displayName: 'Free Rasalhague Republic / Ghost Bear Dominion', stage: 0, kind: 'affiliation', source: { ...FREE_RASALHAGUE_REPUBLIC_CONTEXT.source, ruleId: 'free-rasalhague-republic-ghost-bear-dominion' }, costXp: 0,
    primaryLanguage: 'Swedish', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('ghost-bear.trait.equipped', 50, trait('trait.equipped', 'Equipped')), fixed('ghost-bear.trait.introvert', -25, trait('trait.introvert', 'Introvert')), fixed('ghost-bear.trait.reputation', -25, trait('trait.reputation', 'Reputation')), fixed('ghost-bear.skill.protocol', 20, skill('skill.protocol', 'Protocol/Clan Ghost Bear', 'Clan Ghost Bear')), { id: 'ghost-bear.skill.interest', kind: 'any-skill-choice', xp: 10, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 }, fixed('ghost-bear.skill.remembrance', 10, skill('skill.interest', 'Interest/Clan Remembrance', 'Clan Remembrance')), fixed('ghost-bear.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation')), fixed('ghost-bear.skill.martial-arts', 15, skill('skill.martial-arts', 'Martial Arts')), fixed('ghost-bear.skill.melee-weapons', 15, skill('skill.melee-weapons', 'Melee Weapons'))],
    notes: ['Source: Corrected Third Printing p. 67. Ghost Bear characters are subject to the source-defined Clan freeborn Stage 1/2 limitation.'], deferredRules: [],
  },
  {
    id: MINOR_PERIPHERY_ID, displayName: 'Minor Periphery', stage: 0, kind: 'affiliation', source: MINOR_PERIPHERY_CONTEXT.source, costXp: 75,
    primaryLanguage: 'English', secondaryLanguages: [...MINOR_PERIPHERY_CONTEXT.secondaryLanguages], prerequisites: [],
    awards: [fixed('minor-periphery.trait.equipped', -150, trait('trait.equipped', 'Equipped')), fixed('minor-periphery.skill.perception', 15, skill('skill.perception', 'Perception')), { id: 'minor-periphery.skill.survival', kind: 'any-skill-choice', xp: 20, skillId: 'skill.survival', displayName: 'Survival/Any', count: 1 }, { id: 'minor-periphery.flexible', kind: 'flexible-xp', xpPerGrant: 25, count: 3, allowedTargetTypes: ['attribute', 'trait'] }],
    notes: ['Source: Corrected Third Printing p. 67.'], deferredRules: ['Minor Periphery educational restrictions remain governed by later-stage systems.'],
  },
  {
    id: DEEP_PERIPHERY_ID, displayName: 'Deep Periphery', stage: 0, kind: 'affiliation', source: DEEP_PERIPHERY_CONTEXT.source, costXp: 50,
    primaryLanguage: 'English', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('deep-periphery.attribute.wil', 60, attribute('WIL')), fixed('deep-periphery.trait.equipped', -80, trait('trait.equipped', 'Equipped')), { id: 'deep-periphery.flexible', kind: 'flexible-xp', xpPerGrant: 10, count: 2, allowedTargetTypes: ['attribute', 'trait', 'skill'] }], notes: ['Source: Corrected Third Printing p. 68.'], deferredRules: [],
  },
  {
    id: DEEP_PERIPHERY_HANSEATIC_ID, displayName: 'Deep Periphery / Hanseatic League', stage: 0, kind: 'affiliation', source: DEEP_PERIPHERY_CONTEXT.source, costXp: 0, primaryLanguage: 'German', secondaryLanguages: ['English'], prerequisites: [],
    awards: [fixed('hanseatic.trait.citizenship', 30, trait('trait.citizenship', 'Citizenship')), fixed('hanseatic.trait.distrust', -20, trait('trait.compulsion', 'Compulsion/Distrust Lyrans', { compulsion: 'Distrust Lyrans' })), fixed('hanseatic.skill.appraisal', 10, skill('skill.appraisal', 'Appraisal')), fixed('hanseatic.skill.negotiation', 20, skill('skill.negotiation', 'Negotiation')), fixed('hanseatic.skill.protocol', 10, skill('skill.protocol', 'Protocol/Hanseatic', 'Hanseatic'))], notes: ['Source: Corrected Third Printing p. 68.'], deferredRules: ['Hanseatic serf transformation at Wealth <= 0 remains deferred.'],
  },
  {
    id: DEEP_PERIPHERY_CASTILIAN_ID, displayName: 'Deep Periphery / Castilian Principalities', stage: 0, kind: 'affiliation', source: DEEP_PERIPHERY_CONTEXT.source, costXp: 0, primaryLanguage: 'Spanish', secondaryLanguages: ['German'], prerequisites: [],
    awards: [fixed('castilian.attribute.dex', 25, attribute('DEX')), fixed('castilian.trait.honor', -20, trait('trait.compulsion', 'Compulsion/Castilian Honor Code', { compulsion: 'Castilian Honor Code' })), fixed('castilian.trait.umayyad-hatred', -20, trait('trait.compulsion', 'Compulsion/Hatred of Umayyads', { compulsion: 'Hatred of Umayyads' })), fixed('castilian.skill.martial-arts', 15, skill('skill.martial-arts', 'Martial Arts')), fixed('castilian.skill.melee', 15, skill('skill.melee-weapons', 'Melee Weapons')), fixed('castilian.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation')), fixed('castilian.skill.protocol', 25, skill('skill.protocol', 'Protocol/Castilian', 'Castilian'))], notes: ['Source: Corrected Third Printing p. 68.'], deferredRules: ['Castilian Rank/Title and University restrictions remain deferred.'],
  },
  {
    id: DEEP_PERIPHERY_UMAYYAD_ID, displayName: 'Deep Periphery / Umayyad Caliphate', stage: 0, kind: 'affiliation', source: DEEP_PERIPHERY_CONTEXT.source, costXp: 0, primaryLanguage: 'Arabic', secondaryLanguages: ['English'], prerequisites: [],
    awards: [fixed('umayyad.attribute.dex', 20, attribute('DEX')), fixed('umayyad.trait.xenophobic', -10, trait('trait.compulsion', 'Compulsion/Xenophobic', { compulsion: 'Xenophobic' })), fixed('umayyad.skill.art', 10, skill('skill.art', 'Art/Any')), fixed('umayyad.skill.interest', 10, skill('skill.interest', 'Interest/Any')), fixed('umayyad.skill.protocol', 20, skill('skill.protocol', 'Protocol/Umayyad', 'Umayyad'))], notes: ['Source: Corrected Third Printing p. 68.'], deferredRules: ['Umayyad warrior, Title, Combat Paralysis, and Officer/MechWarrior restrictions remain deferred.'],
  },
  {
    id: DEEP_PERIPHERY_JARNFOLK_ID, displayName: 'Deep Periphery / JàrnFòlk', stage: 0, kind: 'affiliation', source: DEEP_PERIPHERY_CONTEXT.source, costXp: 0, primaryLanguage: 'JàrnFòlk Norse', secondaryLanguages: ['Danish', 'English', 'German', 'Swedish'], prerequisites: [],
    awards: [fixed('jarnfolk.attribute.rfl', 20, attribute('RFL')), fixed('jarnfolk.trait.xenophobic', -10, trait('trait.compulsion', 'Compulsion/Xenophobic', { compulsion: 'Xenophobic' })), fixed('jarnfolk.trait.natural-aptitude', 10, trait('trait.natural-aptitude', 'Natural Aptitude/Martial Arts')), fixed('jarnfolk.trait.wealth', -10, trait('trait.wealth', 'Wealth')), fixed('jarnfolk.skill.negotiation', 15, skill('skill.negotiation', 'Negotiation')), fixed('jarnfolk.skill.protocol', 15, skill('skill.protocol', 'Protocol/JàrnFòlk Families', 'JàrnFòlk Families')), { id: 'jarnfolk.skill.choice', kind: 'choice-package', description: 'Choose Art/Any, Interest/Any, or Technician/Any.', options: [[skill('skill.art', 'Art/Any')], [skill('skill.interest', 'Interest/Any')], [skill('skill.technician', 'Technician/Any')]] }], notes: ['Source: Corrected Third Printing p. 68.'], deferredRules: ['JàrnFòlk educational and MechWarrior restrictions remain deferred.'],
  },
  {
    id: MAJOR_PERIPHERY_ID, displayName: 'Major Periphery State', stage: 0, kind: 'affiliation', source: MAJOR_PERIPHERY_CONTEXT.source, costXp: 100,
    primaryLanguage: 'English', secondaryLanguages: ['German', 'Spanish'], prerequisites: [],
    awards: [fixed('major-periphery.trait.equipped', -50, trait('trait.equipped', 'Equipped')), { id: 'major-periphery.flexible', kind: 'flexible-xp', xpPerGrant: 15, count: 3, allowedTargetTypes: ['attribute', 'trait', 'skill'] }], notes: ['Source: Corrected Third Printing p. 68.'], deferredRules: [],
  },
  ...[
    [MAJOR_PERIPHERY_CIRCINUS_ID, 'Circinus Federation', [fixed('circinus.attribute.str', 100, attribute('STR')), fixed('circinus.attribute.bod', 75, attribute('BOD')), fixed('circinus.attribute.int', -100, attribute('INT')), fixed('circinus.attribute.wil', 70, attribute('WIL')), fixed('circinus.trait.illiterate', -75, trait('trait.illiterate', 'Illiterate')), fixed('circinus.trait.reputation', -200, trait('trait.reputation', 'Reputation')), fixed('circinus.trait.toughness', 300, trait('trait.toughness', 'Toughness')), fixed('circinus.trait.wealth', -125, trait('trait.wealth', 'Wealth')), { id: 'circinus.skills', kind: 'multi-skill-choice', xp: 20, displayName: 'Choose three Circinus Skills', count: 3, distinct: true }]],
    [MAJOR_PERIPHERY_CANOPUS_ID, 'Magistracy of Canopus', [fixed('canopus.attribute.cha', 100, attribute('CHA')), fixed('canopus.attribute.edg', 50, attribute('EDG')), fixed('canopus.trait.gregarious', 50, trait('trait.gregarious', 'Gregarious')), fixed('canopus.trait.illiterate', -25, trait('trait.illiterate', 'Illiterate')), fixed('canopus.trait.reputation', -125, trait('trait.reputation', 'Reputation')), fixed('canopus.trait.wealth', 25, trait('trait.wealth', 'Wealth')), fixed('canopus.skill.streetwise', 15, skill('skill.streetwise', 'Streetwise/Magistracy', 'Magistracy')), { id: 'canopus.skill.choice', kind: 'choice-package', description: 'Choose Acting or MedTech/General.', options: [[skill('skill.acting', 'Acting')], [skill('skill.medtech', 'MedTech/General', 'General')]] }]],
    [MAJOR_PERIPHERY_MARIAN_ID, 'Marian Hegemony', [fixed('marian.attribute.wil', 100, attribute('WIL')), fixed('marian.trait.connections', 25, trait('trait.connections', 'Connections')), fixed('marian.trait.reputation', -150, trait('trait.reputation', 'Reputation')), fixed('marian.trait.toughness', 125, trait('trait.toughness', 'Toughness')), fixed('marian.skill.interest-history', 15, skill('skill.interest', 'Interest/Marian History', 'Marian History')), fixed('marian.skill.interest-roman', 10, skill('skill.interest', 'Interest/Roman History', 'Roman History')), fixed('marian.skill.language', 15, skill('skill.language', 'Language/Latin', 'Latin')), fixed('marian.skill.protocol', 10, skill('skill.protocol', 'Protocol/Marian', 'Marian')), fixed('marian.skill.strategy', 5, skill('skill.strategy', 'Strategy'))]],
    [MAJOR_PERIPHERY_OUTWORLDS_ID, 'Outworlds Alliance', [fixed('outworlds.attribute.edg', 75, attribute('EDG')), fixed('outworlds.trait.equipped', -55, trait('trait.equipped', 'Equipped')), fixed('outworlds.trait.g-tolerance', 125, trait('trait.g-tolerance', 'G-Tolerance')), fixed('outworlds.trait.wealth', -75, trait('trait.wealth', 'Wealth')), fixed('outworlds.skill.streetwise', 10, skill('skill.streetwise', 'Streetwise/Outworlds', 'Outworlds')), fixed('outworlds.skill.survival', 10, skill('skill.survival', 'Survival/Any')), { id: 'outworlds.skill.choice', kind: 'choice-package', description: 'Choose Martial Arts, MedTech/Any, or Small Arms.', options: [[skill('skill.martial-arts', 'Martial Arts')], [skill('skill.medtech', 'MedTech/Any', 'Any')], [skill('skill.small-arms', 'Small Arms')]] }]],
    [MAJOR_PERIPHERY_TAURIAN_ID, 'Taurian Concordat', [fixed('taurian.attribute.wil', 150, attribute('WIL')), fixed('taurian.attribute.edg', 50, attribute('EDG')), fixed('taurian.skill.martial-arts', 10, skill('skill.martial-arts', 'Martial Arts')), fixed('taurian.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation')), fixed('taurian.skill.small-arms', 15, skill('skill.small-arms', 'Small Arms')), fixed('taurian.skill.streetwise', 15, skill('skill.streetwise', 'Streetwise/Taurian', 'Taurian')), fixed('taurian.skill.survival', 5, skill('skill.survival', 'Survival/Any')), { id: 'taurian.flexible', kind: 'flexible-xp', xpPerGrant: 15, count: 2, allowedTargetTypes: ['attribute', 'trait', 'skill'] }]],
  ].map(([id, name, awards]) => ({ id: id as string, displayName: `Major Periphery / ${name as string}`, stage: 0 as const, kind: 'affiliation' as const, source: { ...MAJOR_PERIPHERY_CONTEXT.source, ruleId: id as string }, costXp: 0, primaryLanguage: 'English', secondaryLanguages: ['German', 'Spanish'], prerequisites: [], awards: awards as LifeModuleAward[], notes: ['Source: Corrected Third Printing p. 68.'], deferredRules: [] })),
  {
    id: MINOR_PERIPHERY_RANDIS_ID, displayName: 'Minor Periphery / Fiefdom of Randis', stage: 0, kind: 'affiliation', source: MINOR_PERIPHERY_CONTEXT.source, costXp: 0, primaryLanguage: 'English', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('randis.attribute.bod', 125, attribute('BOD')), fixed('randis.attribute.edg', 50, attribute('EDG')), fixed('randis.trait.illiterate', -75, trait('trait.illiterate', 'Illiterate')), fixed('randis.trait.wealth', -50, trait('trait.wealth', 'Wealth')), fixed('randis.skill.martial-arts', 10, skill('skill.martial-arts', 'Martial Arts')), fixed('randis.skill.melee-weapons', 10, skill('skill.melee-weapons', 'Melee Weapons')), fixed('randis.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation')), fixed('randis.skill.streetwise', 15, skill('skill.streetwise', 'Streetwise/Periphery', 'Periphery')), fixed('randis.skill.survival', 20, skill('skill.survival', 'Survival/Any'))], notes: ['Source: Corrected Third Printing p. 67.'], deferredRules: [],
  },
  {
    id: MINOR_PERIPHERY_FRANKLIN_ID, displayName: 'Minor Periphery / Franklin Fiefs', stage: 0, kind: 'affiliation', source: MINOR_PERIPHERY_CONTEXT.source, costXp: 0, primaryLanguage: 'English', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('franklin.attribute.bod', 150, attribute('BOD')), fixed('franklin.attribute.int', -100, attribute('INT')), fixed('franklin.attribute.wil', 50, attribute('WIL')), fixed('franklin.trait.equipped', -60, trait('trait.equipped', 'Equipped')), fixed('franklin.trait.illiterate', -90, trait('trait.illiterate', 'Illiterate')), fixed('franklin.trait.toughness', 100, trait('trait.toughness', 'Toughness')), fixed('franklin.skill.martial-arts', 15, skill('skill.martial-arts', 'Martial Arts')), { id: 'franklin.skill.medtech', kind: 'any-skill-choice', xp: 10, skillId: 'skill.medtech', displayName: 'MedTech/Any', count: 1 }, fixed('franklin.skill.protocol', 10, skill('skill.protocol', 'Protocol/Novo Franklin', 'Novo Franklin')), fixed('franklin.skill.streetwise', 10, skill('skill.streetwise', 'Streetwise/Periphery', 'Periphery')), fixed('franklin.skill.survival', 10, skill('skill.survival', 'Survival/Any')), { id: 'franklin.skill.choice', kind: 'modeled-skill-choice', xp: 10, displayName: 'Choose Archery, Melee Weapons, or Negotiation', count: 1, distinct: true, allowedDestinationKeys: ['skill.archery/','skill.melee-weapons/','skill.negotiation/'] }], notes: ['Source: Corrected Third Printing p. 67.'], deferredRules: ['Without Citizen, Title/Property and advanced military training are restricted.'],
  },
  {
    id: MINOR_PERIPHERY_MICA_ID, displayName: 'Minor Periphery / Mica Majority', stage: 0, kind: 'affiliation', source: MINOR_PERIPHERY_CONTEXT.source, costXp: 0, primaryLanguage: 'English', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('mica.attribute.bod', 100, attribute('BOD')), fixed('mica.attribute.rfl', 100, attribute('RFL')), fixed('mica.attribute.edg', -100, attribute('EDG')), fixed('mica.trait.equipped', -25, trait('trait.equipped', 'Equipped')), fixed('mica.trait.toughness', 100, trait('trait.toughness', 'Toughness')), fixed('mica.trait.wealth', -100, trait('trait.wealth', 'Wealth')), fixed('mica.skill.career', 10, skill('skill.career', 'Career/Mining', 'Mining')), fixed('mica.skill.language', 10, skill('skill.language', 'Language/Japanese', 'Japanese')), fixed('mica.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation')), fixed('mica.skill.survival', 10, skill('skill.survival', 'Survival/Arctic', 'Arctic'))], notes: ['Source: Corrected Third Printing p. 67.'], deferredRules: ['Nobility and titles are restricted.'],
  },
  {
    id: MINOR_PERIPHERY_NIOPS_ID, displayName: 'Minor Periphery / Niops Association', stage: 0, kind: 'affiliation', source: MINOR_PERIPHERY_CONTEXT.source, costXp: 0, primaryLanguage: 'English', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('niops.attribute.int', 125, attribute('INT')), fixed('niops.attribute.wil', -110, attribute('WIL')), fixed('niops.trait.equipped', 200, trait('trait.equipped', 'Equipped')), fixed('niops.trait.introvert', -125, trait('trait.introvert', 'Introvert')), { id: 'niops.skill.interest', kind: 'any-skill-choice', xp: 10, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 }, { id: 'niops.skill.technician', kind: 'any-skill-choice', xp: 15, skillId: 'skill.technician', displayName: 'Technician/Any', count: 1 }], notes: ['Source: Corrected Third Printing p. 67.'], deferredRules: [],
  },
  {
    id: MINOR_PERIPHERY_RIM_ID, displayName: 'Minor Periphery / Rim Collection', stage: 0, kind: 'affiliation', source: MINOR_PERIPHERY_CONTEXT.source, costXp: 0, primaryLanguage: 'English', secondaryLanguages: [], prerequisites: [],
    awards: [fixed('rim.attribute.cha', -50, attribute('CHA')), fixed('rim.attribute.edg', 100, attribute('EDG')), fixed('rim.trait.fit', 75, trait('trait.fit', 'Fit')), fixed('rim.trait.wealth', -50, trait('trait.wealth', 'Wealth')), fixed('rim.skill.negotiation', 15, skill('skill.negotiation', 'Negotiation')), fixed('rim.skill.small-arms', 5, skill('skill.small-arms', 'Small Arms')), { id: 'rim.skill.choice', kind: 'modeled-skill-choice', xp: 10, displayName: 'Choose two Rim Collection Skills', count: 2, distinct: true, allowedDestinationKeys: ['skill.animal-handling/Riding','skill.archery/','skill.martial-arts/','skill.melee-weapons/','skill.streetwise/Rim Collection','skill.survival/'] }], notes: ['Source: Corrected Third Printing p. 67.'], deferredRules: ['Nobility and titles are restricted.'],
  },
  {
    id: DRACONIS_COMBINE_ID, displayName: DRACONIS_COMBINE_CONTEXT.displayName, stage: 0, kind: 'affiliation', source: DRACONIS_COMBINE_CONTEXT.source, costXp: 150,
    primaryLanguage: DRACONIS_COMBINE_CONTEXT.primaryLanguage, secondaryLanguages: [...DRACONIS_COMBINE_CONTEXT.secondaryLanguages], prerequisites: [],
    awards: [fixed('draconis.attribute.wil', 50, attribute('WIL')), fixed('draconis.trait.xenophobia', -100, trait('trait.compulsion', 'Compulsion/Xenophobia', { compulsion: 'Xenophobia' })), fixed('draconis.trait.wealth', -50, trait('trait.wealth', 'Wealth')), fixed('draconis.skill.oral-tradition', 15, skill('skill.art', 'Arts/Oral Tradition', 'Oral Tradition')), fixed('draconis.skill.martial-arts', 10, skill('skill.martial-arts', 'Martial Arts')), fixed('draconis.skill.protocol', 15, skill('skill.protocol', 'Protocol/Combine', 'Combine')), { id: 'draconis.trait.choice', kind: 'choice-package', description: 'Choose Pain Resistance or Combat Sense.', options: [[trait('trait.pain-resistance', 'Pain Resistance')], [trait('trait.combat-sense', 'Combat Sense')]] }, fixed('draconis.skill.weapon-choice', 10, skill('skill.melee-weapons', 'Melee Weapons'))],
    notes: ['The primary language is selected through the Universal Stage 0 language award. The bounded transaction requires the source-defined Trait and Skill choices.'], deferredRules: [],
  },
  ...[
    [DRACONIS_AZAMI_ID, 'Azami', [fixed('azami.attribute.wil', 190, attribute('WIL')), fixed('azami.trait.xenophobia', -50, trait('trait.compulsion', 'Compulsion/Xenophobia', { compulsion: 'Xenophobia' })), fixed('azami.trait.equipped', -50, trait('trait.equipped', 'Equipped')), fixed('azami.trait.wealth', -25, trait('trait.wealth', 'Wealth')), fixed('azami.language.arabic', 10, skill('skill.language', 'Language/Arabic', 'Arabic')), fixed('azami.language.japanese', -10, skill('skill.language', 'Language/Japanese', 'Japanese')), fixed('azami.skill.martial-arts', 10, skill('skill.martial-arts', 'Martial Arts')), fixed('azami.skill.melee-weapons', 10, skill('skill.melee-weapons', 'Melee Weapons')), fixed('azami.skill.animal-handling', 5, skill('skill.animal-handling', 'Animal Handling/Riding', 'Riding')), { id: 'azami.skill.survival', kind: 'any-skill-choice', xp: 10, skillId: 'skill.survival', displayName: 'Survival/Any', count: 1 }]],
    [DRACONIS_BENJAMIN_ID, 'Benjamin District', [fixed('benjamin.trait.paranoid', -50, trait('trait.compulsion', 'Compulsion/Paranoid of Combine Government', { compulsion: 'Paranoid of Combine Government' })), fixed('benjamin.trait.connections', 50, trait('trait.connections', 'Connections')), fixed('benjamin.trait.patient', 25, trait('trait.patient', 'Patient')), fixed('benjamin.trait.wealth', 35, trait('trait.wealth', 'Wealth')), fixed('benjamin.skill.oral-tradition', 5, skill('skill.art', 'Arts/Oral Tradition', 'Oral Tradition')), fixed('benjamin.skill.martial-arts', 10, skill('skill.martial-arts', 'Martial Arts')), fixed('benjamin.skill.protocol', 15, skill('skill.protocol', 'Protocol/Combine', 'Combine')), fixed('benjamin.skill.streetwise', 10, skill('skill.streetwise', 'Streetwise/Combine', 'Combine'))]],
    [DRACONIS_DIERON_ID, 'Dieron District', [fixed('dieron.attribute.int', 50, attribute('INT')), fixed('dieron.attribute.wil', -50, attribute('WIL')), fixed('dieron.trait.xenophobia', 50, trait('trait.compulsion', 'Compulsion/Xenophobia', { compulsion: 'Xenophobia' })), fixed('dieron.trait.connections', 60, trait('trait.connections', 'Connections')), fixed('dieron.trait.enemy', -100, trait('trait.enemy', 'Enemy')), fixed('dieron.trait.wealth', 50, trait('trait.wealth', 'Wealth')), fixed('dieron.skill.history', 5, skill('skill.interest', 'Interest/Star League History', 'Star League History')), { id: 'dieron.language.any', kind: 'language-choice', xp: 15, choicesFrom: 'any-language', description: 'Language/Any' }, fixed('dieron.skill.negotiation', 5, skill('skill.negotiation', 'Negotiation')), { id: 'dieron.skill.art', kind: 'any-skill-choice', xp: 15, skillId: 'skill.art', displayName: 'Art/Any', count: 1 }]],
    [DRACONIS_NEW_SAMARKAND_ID, 'New Samarkand (Galedon) District', [fixed('samarkand.attribute.wil', 100, attribute('WIL')), fixed('samarkand.attribute.cha', -50, attribute('CHA')), fixed('samarkand.trait.hatred', -50, trait('trait.compulsion', 'Compulsion/Hatred of Federated Suns', { compulsion: 'Hatred of Federated Suns' })), fixed('samarkand.trait.connections', 50, trait('trait.connections', 'Connections')), fixed('samarkand.skill.history', 10, skill('skill.interest', 'Interest/Combine History', 'Combine History')), fixed('samarkand.skill.melee', 15, skill('skill.melee-weapons', 'Melee Weapons')), fixed('samarkand.skill.negotiation', 5, skill('skill.negotiation', 'Negotiation')), fixed('samarkand.skill.protocol', 10, skill('skill.protocol', 'Protocol/Combine', 'Combine')), fixed('samarkand.skill.streetwise', 10, skill('skill.streetwise', 'Streetwise/Combine', 'Combine'))]],
    [DRACONIS_PESHT_ID, 'Pesht District', [fixed('pesht.attribute.wil', 100, attribute('WIL')), fixed('pesht.attribute.edg', -25, attribute('EDG')), fixed('pesht.trait.clan-hatred', -100, trait('trait.compulsion', 'Compulsion/Hatred of Clans', { compulsion: 'Hatred of Clans' })), fixed('pesht.trait.connections', 20, trait('trait.connections', 'Connections')), fixed('pesht.trait.wealth', 50, trait('trait.wealth', 'Wealth')), fixed('pesht.skill.martial-arts', 10, skill('skill.martial-arts', 'Martial Arts')), fixed('pesht.skill.melee', 15, skill('skill.melee-weapons', 'Melee Weapons')), fixed('pesht.skill.protocol', 20, skill('skill.protocol', 'Protocol/Combine', 'Combine')), fixed('pesht.skill.streetwise', 10, skill('skill.streetwise', 'Streetwise/Combine', 'Combine'))]],
  ].map(([id, name, awards]) => ({ id: id as string, displayName: `Draconis Combine / ${name as string}`, stage: 0 as const, kind: 'affiliation' as const, source: { ...DRACONIS_COMBINE_CONTEXT.source, ruleId: id as string }, costXp: 0, primaryLanguage: 'Japanese', secondaryLanguages: ['Arabic', 'English', 'Swedanese'], prerequisites: [], awards: awards as LifeModuleAward[], notes: ['Sub-affiliation awards are applied by the governed Draconis Stage 0 transaction.'], deferredRules: [] })),
  {
    id: FEDERATED_SUNS_CAPELLAN_MARCH_ID,
    displayName: 'Federated Suns / Capellan March', stage: 0, kind: 'affiliation', source: FEDERATED_SUNS_CAPELLAN_MARCH_CONTEXT.source, costXp: 150,
    primaryLanguage: FEDERATED_SUNS_CAPELLAN_MARCH_CONTEXT.primaryLanguage, secondaryLanguages: [...FEDERATED_SUNS_CAPELLAN_MARCH_CONTEXT.secondaryLanguages], prerequisites: [],
    awards: [fixed('capellan-march.attribute.wil', 40, attribute('WIL')), fixed('capellan-march.trait.connections', 25, trait('trait.connections', 'Connections')), fixed('capellan-march.trait.hatred', -50, trait('trait.compulsion', 'Compulsion/Hatred of Capellan Confederation', { compulsion: 'Hatred of Capellan Confederation' })), fixed('capellan-march.skill.protocol', 10, skill('skill.protocol', 'Protocol/FedSuns', 'FedSuns')), fixed('capellan-march.skill.interest-history', 10, skill('skill.interest', 'Interest/FedSuns History', 'FedSuns History')), { id: 'capellan-march.language', kind: 'language-choice', xp: 5, choicesFrom: 'capellan-march-languages', description: 'Choose one Capellan March language.' }],
    notes: ['Federated Suns sub-affiliation; no additional module cost.'], deferredRules: [],
  },
  {
    id: FEDERATED_SUNS_DRACONIS_MARCH_ID,
    displayName: 'Federated Suns / Draconis March', stage: 0, kind: 'affiliation', source: FEDERATED_SUNS_DRACONIS_MARCH_CONTEXT.source, costXp: 150,
    primaryLanguage: FEDERATED_SUNS_DRACONIS_MARCH_CONTEXT.primaryLanguage, secondaryLanguages: [...FEDERATED_SUNS_DRACONIS_MARCH_CONTEXT.secondaryLanguages], prerequisites: [],
    awards: [fixed('draconis-march.attribute.edg', 25, attribute('EDG')), fixed('draconis-march.trait.connections', 20, trait('trait.connections', 'Connections')), fixed('draconis-march.trait.hatred', -30, trait('trait.compulsion', 'Compulsion/Hatred of Draconis Combine', { compulsion: 'Hatred of Draconis Combine' })), { id: 'draconis-march.skill.art', kind: 'any-skill-choice', xp: 10, skillId: 'skill.art', displayName: 'Art/Any', count: 1 }, fixed('draconis-march.skill.interest-history', 10, skill('skill.interest', 'Interest/FedSuns History', 'FedSuns History')), fixed('draconis-march.skill.protocol', 5, skill('skill.protocol', 'Protocol/FedSuns', 'FedSuns'))],
    notes: ['Federated Suns sub-affiliation; no additional module cost. Art/Any remains an open subject.'], deferredRules: [],
  },
  {
    id: UNIVERSAL_STAGE_0_ID,
    displayName: 'Universal Fixed Experience Points',
    stage: 0,
    kind: 'universal',
    source: UNIVERSAL_LIFE_MODULE_CONTEXT.source,
    costXp: 850,
    prerequisites: [],
    awards: [
      ...['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG'].map((id) => fixed(`universal.attribute.${id.toLowerCase()}`, 100, attribute(id))),
      { id: 'universal.language.affiliation', kind: 'language-choice', xp: 20, choicesFrom: 'affiliation-languages', description: 'Choose an affiliation primary or secondary language.' },
      fixed('universal.language.english', 20, skill('skill.language', 'Language/English', 'English')),
      fixed('universal.perception', 10, skill('skill.perception', 'Perception')),
    ],
    notes: ['Mandatory for every Life Module character.'],
    deferredRules: [],
  },
  {
    id: FEDERATED_SUNS_OUTBACK_ID, displayName: 'Federated Suns / Outback', stage: 0, kind: 'affiliation', source: FEDERATED_SUNS_OUTBACK_CONTEXT.source, costXp: 150,
    primaryLanguage: FEDERATED_SUNS_OUTBACK_CONTEXT.primaryLanguage, secondaryLanguages: [...FEDERATED_SUNS_OUTBACK_CONTEXT.secondaryLanguages], prerequisites: [{ id: 'fedsuns.natural-aptitude.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'Federated Suns Natural Aptitude choice: INT 4+' }],
    awards: [fixed('outback.attribute.str', 50, attribute('STR')), fixed('outback.attribute.bod', 150, attribute('BOD')), fixed('outback.attribute.wil', 100, attribute('WIL')), fixed('outback.attribute.int', -100, attribute('INT')), fixed('outback.trait.illiterate', -50, trait('trait.illiterate', 'Illiterate')), fixed('outback.trait.reputation', -50, trait('trait.reputation', 'Reputation')), fixed('outback.trait.wealth', -100, trait('trait.wealth', 'Wealth')), { id: 'outback.skill.art-or-interest', kind: 'any-skill-choice', xp: 10, skillId: 'skill.art', displayName: 'Art/Any or Interest/Any', count: 1 }, fixed('outback.skill.streetwise', 10, skill('skill.streetwise', 'Streetwise/FedSuns', 'FedSuns')), { id: 'outback.skill.survival', kind: 'any-skill-choice', xp: 20, skillId: 'skill.survival', displayName: 'Survival/Any', count: 1 }],
    notes: ['Federated Suns sub-affiliation; no additional module cost. Choose exactly one Art/Any or Interest/Any subject.'], deferredRules: [],
  },
  {
    id: CAPELLAN_COMMONALITY_ID,
    displayName: 'Capellan Confederation / Capellan Commonality',
    stage: 0,
    kind: 'affiliation',
    source: CAPELLAN_COMMONALITY_CONTEXT.source,
    costXp: 150,
    primaryLanguage: CAPELLAN_COMMONALITY_CONTEXT.primaryLanguage,
    secondaryLanguages: [...CAPELLAN_COMMONALITY_CONTEXT.secondaryLanguages],
    prerequisites: [],
    awards: [
      fixed('capellan.attribute.wil', 50, attribute('WIL')),
      fixed('capellan.trait.exceptional-attribute-edg', 100, trait('trait.exceptional-attribute', 'Exceptional Attribute/EDG', { attribute: 'EDG' })),
      fixed('capellan.trait.compulsion-paranoia', -100, trait('trait.compulsion', 'Compulsion/Paranoia', { compulsion: 'Paranoia' })),
      { id: 'capellan.language.secondary', kind: 'language-choice', xp: 10, choicesFrom: 'capellan-secondary', description: 'Choose any Capellan secondary language.' },
      fixed('capellan.skill.protocol-capellan', 10, skill('skill.protocol', 'Protocol/Capellan', 'Capellan')),
      fixed('capellan.skill.martial-arts', 5, skill('skill.martial-arts', 'Martial Arts')),
      fixed('commonality.attribute.edg', 50, attribute('EDG')),
      fixed('commonality.trait.wealth', 15, trait('trait.wealth', 'Wealth')),
      { id: 'commonality.language.fedsuns', kind: 'language-choice', xp: 5, choicesFrom: 'federated-suns-languages', description: 'Choose any Federated Suns language.' },
      fixed('commonality.skill.protocol-fedsuns', 5, skill('skill.protocol', 'Protocol/FedSuns', 'FedSuns')),
    ],
    notes: ['Child labor is legal in the Confederation.'],
    deferredRules: [
      'Civilian Job Stage 4 may replace Stage 2 and advances the character immediately to age 18.',
      'Military School Stage 2 and all Stage 3 modules require Citizenship.',
    ],
  },
  {
    id: LIAO_COMMONALITY_ID, displayName: LIAO_COMMONALITY_CONTEXT.displayName, stage: 0, kind: 'affiliation', source: LIAO_COMMONALITY_CONTEXT.source, costXp: 0,
    primaryLanguage: 'Mandarin Chinese', secondaryLanguages: [...LIAO_COMMONALITY_CONTEXT.secondaryLanguages], prerequisites: [],
    awards: [fixed('liao.attribute.int', 50, attribute('INT')), fixed('liao.trait.reputation', -25, trait('trait.reputation', 'Reputation')), { id: 'liao.language.choice', kind: 'language-choice', xp: 15, choicesFrom: 'capellan-liao-language', description: 'Choose a Capellan or Lyran language.' }, { id: 'liao.protocol.choice', kind: 'choice-package', description: 'Choose Protocol/FedSuns or Protocol/Lyran.', options: [[skill('skill.protocol', 'Protocol/FedSuns', 'FedSuns')], [skill('skill.protocol', 'Protocol/Lyran', 'Lyran')]] }, { id: 'liao.skill.art', kind: 'any-skill-choice', xp: 10, skillId: 'skill.art', displayName: 'Art/Any', count: 1 }, fixed('liao.skill.martial-arts', 15, skill('skill.martial-arts', 'Martial Arts'))], notes: ['Capellan Confederation sub-affiliation; no additional module cost.'], deferredRules: [],
  },
  {
    id: ST_IVES_COMMONALITY_ID, displayName: ST_IVES_COMMONALITY_CONTEXT.displayName, stage: 0, kind: 'affiliation', source: ST_IVES_COMMONALITY_CONTEXT.source, costXp: 0,
    primaryLanguage: 'Mandarin Chinese', secondaryLanguages: [...ST_IVES_COMMONALITY_CONTEXT.secondaryLanguages], prerequisites: [],
    awards: [fixed('st-ives.attribute.wil', 50, attribute('WIL')), fixed('st-ives.attribute.edg', 50, attribute('EDG')), fixed('st-ives.trait.reputation', -100, trait('trait.reputation', 'Reputation')), fixed('st-ives.trait.wealth', 50, trait('trait.wealth', 'Wealth')), { id: 'st-ives.language.choice', kind: 'language-choice', xp: 15, choicesFrom: 'federated-suns-languages', description: 'Choose a Federated Suns language.' }, fixed('st-ives.skill.protocol-capellan', -15, skill('skill.protocol', 'Protocol/Capellan', 'Capellan')), fixed('st-ives.skill.protocol-fedsuns', 10, skill('skill.protocol', 'Protocol/FedSuns', 'FedSuns')), { id: 'st-ives.skill.art', kind: 'any-skill-choice', xp: 5, skillId: 'skill.art', displayName: 'Art/Any', count: 1 }, fixed('st-ives.skill.martial-arts', 10, skill('skill.martial-arts', 'Martial Arts'))], notes: ['Capellan Confederation sub-affiliation; no additional module cost.'], deferredRules: [],
  },
  {
    id: VICTORIA_COMMONALITY_ID, displayName: VICTORIA_COMMONALITY_CONTEXT.displayName, stage: 0, kind: 'affiliation', source: VICTORIA_COMMONALITY_CONTEXT.source, costXp: 0,
    primaryLanguage: 'Mandarin Chinese', secondaryLanguages: [...VICTORIA_COMMONALITY_CONTEXT.secondaryLanguages], prerequisites: [],
    awards: [fixed('victoria.attribute.wil', 35, attribute('WIL')), fixed('victoria.trait.connections', 50, trait('trait.connections', 'Connections')), fixed('victoria.trait.wealth', -50, trait('trait.wealth', 'Wealth')), { id: 'victoria.language.choice', kind: 'language-choice', xp: 15, choicesFrom: 'any-language', description: 'Choose any language.' }, fixed('victoria.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation')), fixed('victoria.skill.martial-arts', 15, skill('skill.martial-arts', 'Martial Arts'))], notes: ['Capellan Confederation sub-affiliation; no additional module cost.'], deferredRules: [],
  },
  {
    id: FEDERATED_SUNS_CRUCIS_MARCH_ID,
    displayName: 'Federated Suns / Crucis March',
    stage: 0,
    kind: 'affiliation',
    source: FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.source,
    costXp: 150,
    primaryLanguage: FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.primaryLanguage,
    secondaryLanguages: [...FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.secondaryLanguages],
    prerequisites: [{ id: 'fedsuns.natural-aptitude.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'Federated Suns Natural Aptitude choice: INT 4+' }],
    awards: [
      { id: 'fedsuns.trait.natural-aptitude', kind: 'choice-package', description: 'Choose Natural Aptitude/Protocol or Natural Aptitude/Strategy.', options: [
        [trait('trait.natural-aptitude', 'Natural Aptitude/Protocol', { skill: 'Protocol' })],
        [trait('trait.natural-aptitude', 'Natural Aptitude/Strategy', { skill: 'Strategy' })],
      ] },
      fixed('fedsuns.skill.protocol', 10, skill('skill.protocol', 'Protocol/FedSuns', 'FedSuns')),
      fixed('crucis.attribute.wil', 50, attribute('WIL')),
      fixed('crucis.attribute.edg', -50, attribute('EDG')),
      { id: 'crucis.skill.art', kind: 'any-skill-choice', xp: 10, skillId: 'skill.art', displayName: 'Art/Any', count: 1 },
      fixed('crucis.skill.interest-history', 15, skill('skill.interest', 'Interest/FedSuns History', 'FedSuns History')),
      fixed('crucis.skill.protocol', 15, skill('skill.protocol', 'Protocol/FedSuns', 'FedSuns')),
    ],
    notes: ['Natural Aptitude requires INT 4 at final validation.'],
    deferredRules: [],
  },
  {
    id: COMSTAR_ORDER_ID,
    displayName: 'ComStar affiliation layer',
    stage: 0,
    kind: 'affiliation',
    source: source(74, 'stage-0-comstar-word-of-blake-comstar'),
    costXp: 50,
    primaryLanguage: 'English',
    prerequisites: [],
    awards: [
      fixed('order.shared.trait.enemy', -100, trait('trait.enemy', 'Enemy', { enemy: 'Order opposition' })),
      fixed('order.shared.trait.equipped', 100, trait('trait.equipped', 'Equipped')),
      fixed('order.shared.trait.rank', 50, trait('trait.rank', 'Rank')),
      fixed('order.shared.trait.reputation', -50, trait('trait.reputation', 'Reputation')),
      fixed('order.shared.skill.communications-conventional', 10, skill('skill.communications', 'Communications/Conventional', 'Conventional')),
      fixed('order.shared.skill.interest-jerome-blake', 10, skill('skill.interest', 'Interest/Writings of Jerome Blake', 'Writings of Jerome Blake')),
      fixed('order.shared.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation')),
      fixed('comstar.attribute.int', 25, attribute('INT')),
      fixed('comstar.attribute.wil', -15, attribute('WIL')),
      fixed('comstar.trait.connections', 50, trait('trait.connections', 'Connections')),
      fixed('comstar.trait.enemy-word-of-blake', -100, trait('trait.enemy', 'Enemy/Word of Blake', { enemy: 'Word of Blake' })),
      fixed('comstar.trait.reputation', 20, trait('trait.reputation', 'Reputation')),
      fixed('comstar.skill.protocol', 15, skill('skill.protocol', 'Protocol/ComStar', 'ComStar')),
    ],
    notes: ['Optional order affiliation layered over the full birth affiliation. Primary language is English.'],
    deferredRules: ['Nearest-state language and Protocol plus Technician/Any require explicit governed choices.'],
  },
  {
    id: WORD_OF_BLAKE_ORDER_ID,
    displayName: 'Word of Blake affiliation layer',
    stage: 0,
    kind: 'affiliation',
    source: source(74, 'stage-0-comstar-word-of-blake-word-of-blake'),
    costXp: 50,
    primaryLanguage: 'English',
    prerequisites: [],
    awards: [
      fixed('order.shared.trait.enemy', -100, trait('trait.enemy', 'Enemy', { enemy: 'Order opposition' })),
      fixed('order.shared.trait.equipped', 100, trait('trait.equipped', 'Equipped')),
      fixed('order.shared.trait.rank', 50, trait('trait.rank', 'Rank')),
      fixed('order.shared.trait.reputation', -50, trait('trait.reputation', 'Reputation')),
      fixed('order.shared.skill.communications-conventional', 10, skill('skill.communications', 'Communications/Conventional', 'Conventional')),
      fixed('order.shared.skill.interest-jerome-blake', 10, skill('skill.interest', 'Interest/Writings of Jerome Blake', 'Writings of Jerome Blake')),
      fixed('order.shared.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation')),
      fixed('wob.attribute.wil', 50, attribute('WIL')),
      fixed('wob.attribute.cha', -50, attribute('CHA')),
      fixed('wob.trait.compulsion-paranoid', -50, trait('trait.compulsion', 'Compulsion/Paranoid', { compulsion: 'Paranoid' })),
      fixed('wob.trait.connections', 75, trait('trait.connections', 'Connections')),
      fixed('wob.trait.enemy-comstar', -100, trait('trait.enemy', 'Enemy/ComStar', { enemy: 'ComStar' })),
      fixed('wob.trait.equipped', 30, trait('trait.equipped', 'Equipped')),
      fixed('wob.skill.interest-jerome-blake', 15, skill('skill.interest', 'Interest/Writings of Jerome Blake', 'Writings of Jerome Blake')),
      fixed('wob.skill.interest-master', 15, skill('skill.interest', 'Interest/Writings of the Master', 'Writings of the Master')),
      fixed('wob.skill.negotiation', 10, skill('skill.negotiation', 'Negotiation')),
      fixed('wob.skill.protocol', 10, skill('skill.protocol', 'Protocol/Word of Blake', 'Word of Blake')),
    ],
    notes: ['Optional order affiliation layered over the full birth affiliation. Primary language is English.'],
    deferredRules: ['Nearest-state language and Protocol plus Technician/Any require explicit governed choices.'],
  },
  {
    id: BLUE_COLLAR_ID,
    displayName: 'Blue Collar',
    stage: 1,
    kind: 'early-childhood',
    source: source(75, 'stage-1-blue-collar'),
    costXp: 210,
    chronologyYears: 10,
    prerequisites: [{ id: 'blue-collar.affiliation', kind: 'affiliation', description: 'Any affiliation' }],
    awards: [
      fixed('blue-collar.attribute.str', 45, attribute('STR')),
      fixed('blue-collar.attribute.bod', 50, attribute('BOD')),
      fixed('blue-collar.attribute.dex', 50, attribute('DEX')),
      fixed('blue-collar.attribute.int', 25, attribute('INT')),
      fixed('blue-collar.attribute.wil', -10, attribute('WIL')),
      fixed('blue-collar.attribute.cha', -10, attribute('CHA')),
      { id: 'blue-collar.career', kind: 'any-skill-choice', xp: 10, skillId: 'skill.career', displayName: 'Career/Any', count: 1 },
      { id: 'blue-collar.interests', kind: 'multi-skill-choice', xp: 5, skillId: 'skill.interest', displayName: 'Interest/Any', count: 2 },
      { id: 'blue-collar.flexible', kind: 'flexible-xp', xpPerGrant: 10, count: 4, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: [],
    deferredRules: [],
  },
  {
    id: BACK_WOODS_ID,
    displayName: 'Back Woods',
    stage: 1,
    kind: 'early-childhood',
    source: source(75, 'stage-1-back-woods'),
    costXp: 290,
    chronologyYears: 10,
    prerequisites: [
      { id: 'back-woods.affiliation', kind: 'affiliation', description: 'Any affiliation' },
      { id: 'back-woods.str', kind: 'attribute-minimum', attributeId: 'STR', minimum: 4, description: 'STR 4+' },
      { id: 'back-woods.bod', kind: 'attribute-minimum', attributeId: 'BOD', minimum: 5, description: 'BOD 5+' },
    ],
    awards: [
      fixed('back-woods.attribute.str', 100, attribute('STR')),
      fixed('back-woods.attribute.bod', 100, attribute('BOD')),
      fixed('back-woods.attribute.rfl', 75, attribute('RFL')),
      fixed('back-woods.attribute.int', -25, attribute('INT')),
      fixed('back-woods.attribute.cha', -50, attribute('CHA')),
      fixed('back-woods.trait.equipped', -50, trait('trait.equipped', 'Equipped')),
      fixed('back-woods.trait.fit', 100, trait('trait.fit', 'Fit')),
      fixed('back-woods.trait.illiterate', -75, trait('trait.illiterate', 'Illiterate')),
      fixed('back-woods.trait.toughness', 75, trait('trait.toughness', 'Toughness')),
      fixed('back-woods.trait.wealth', -75, trait('trait.wealth', 'Wealth')),
      { id: 'back-woods.language.affiliation', kind: 'affiliation-bound-skill', xp: -5, skillId: 'skill.language', displayName: 'Language/Affiliation' },
      fixed('back-woods.skill.martial-arts', 10, skill('skill.martial-arts', 'Martial Arts')),
      fixed('back-woods.skill.melee-weapons', 10, skill('skill.melee-weapons', 'Melee Weapons')),
      fixed('back-woods.skill.navigation-ground', 10, skill('skill.navigation', 'Navigation/Ground', 'Ground')),
      fixed('back-woods.skill.perception', 5, skill('skill.perception', 'Perception')),
      fixed('back-woods.skill.running', 10, skill('skill.running', 'Running')),
      { id: 'back-woods.skill.survival', kind: 'any-skill-choice', xp: 15, skillId: 'skill.survival', displayName: 'Survival/Any', count: 1 },
      fixed('back-woods.skill.tracking-wilds', 10, skill('skill.tracking', 'Tracking/Wilds', 'Wilds')),
      { id: 'back-woods.flexible', kind: 'flexible-xp', xpPerGrant: 25, count: 2, allowedTargetTypes: ['attribute', 'trait'] },
    ],
    notes: [],
    deferredRules: [],
  },
  {
    id: FARM_ID,
    displayName: 'Farm',
    stage: 1,
    kind: 'early-childhood',
    source: source(77, 'stage-1-farm'),
    costXp: 275,
    chronologyYears: 10,
    prerequisites: [{ id: 'farm.affiliation', kind: 'affiliation', description: 'Any affiliation' }],
    awards: [
      fixed('farm.attribute.str', 100, attribute('STR')),
      fixed('farm.attribute.bod', 100, attribute('BOD')),
      fixed('farm.attribute.dex', 25, attribute('DEX')),
      fixed('farm.attribute.cha', -50, attribute('CHA')),
      fixed('farm.trait.animal-empathy', 25, trait('trait.animal-empathy', 'Animal Empathy')),
      fixed('farm.trait.illiterate', -25, trait('trait.illiterate', 'Illiterate')),
      fixed('farm.trait.toughness', 50, trait('trait.toughness', 'Toughness')),
      fixed('farm.trait.wealth', -25, trait('trait.wealth', 'Wealth')),
      fixed('farm.skill.career-agriculture', 10, skill('skill.career', 'Career/Agriculture', 'Agriculture')),
      { id: 'farm.skill.animal-handling', kind: 'any-skill-choice', xp: 15, skillId: 'skill.animal-handling', displayName: 'Animal Handling/Any', count: 1 },
      { id: 'farm.interests', kind: 'multi-skill-choice', xp: 5, skillId: 'skill.interest', displayName: 'Interest/Any', count: 2 },
      { id: 'farm.flexible', kind: 'flexible-xp', xpPerGrant: 10, count: 4, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: [],
    deferredRules: [],
  },
  {
    id: WAR_ORPHAN_ID,
    displayName: 'War Orphan',
    stage: 1,
    kind: 'early-childhood',
    source: source(78, 'stage-1-war-orphan'),
    costXp: 170,
    chronologyYears: 10,
    prerequisites: [{ id: 'war-orphan.affiliation', kind: 'affiliation', description: 'Any affiliation' }],
    awards: [
      fixed('war-orphan.attribute.int', 50, attribute('INT')),
      fixed('war-orphan.attribute.wil', 100, attribute('WIL')),
      fixed('war-orphan.attribute.edg', 100, attribute('EDG')),
      fixed('war-orphan.trait.compulsion', -100, trait('trait.compulsion', 'Compulsion/Traumatic Memories', { compulsion: 'Traumatic Memories' })),
      fixed('war-orphan.trait.illiterate', -25, trait('trait.illiterate', 'Illiterate')),
      fixed('war-orphan.trait.introvert', -50, trait('trait.introvert', 'Introvert')),
      fixed('war-orphan.trait.reputation', -50, trait('trait.reputation', 'Reputation')),
      fixed('war-orphan.trait.sixth-sense', 150, trait('trait.sixth-sense', 'Sixth Sense')),
      fixed('war-orphan.trait.wealth', -100, trait('trait.wealth', 'Wealth')),
      fixed('war-orphan.skill.language-affiliation', -5, skill('skill.language', 'Language/Affiliation', 'Affiliation')),
      fixed('war-orphan.skill.perception', 10, skill('skill.perception', 'Perception')),
      fixed('war-orphan.skill.stealth', 5, skill('skill.stealth', 'Stealth')),
      fixed('war-orphan.skill.streetwise-affiliation', 10, skill('skill.streetwise', 'Streetwise/Affiliation', 'Affiliation')),
      { id: 'war-orphan.flexible', kind: 'flexible-xp', xpPerGrant: 25, count: 3, allowedTargetTypes: ['attribute', 'trait'] },
    ],
    notes: [],
    deferredRules: [],
  },
  {
    id: STAGE_2_BACK_WOODS_ID,
    displayName: 'Back Woods',
    stage: 2,
    kind: 'late-childhood',
    source: source(77, 'stage-2-back-woods'),
    costXp: 500,
    chronologyYears: 16,
    prerequisites: [],
    awards: [
      fixed('stage2.back-woods.attribute.bod', 60, attribute('BOD')),
      fixed('stage2.back-woods.attribute.wil', 70, attribute('WIL')),
      fixed('stage2.back-woods.attribute.int', -20, attribute('INT')),
      fixed('stage2.back-woods.trait.animal-empathy', 50, trait('trait.animal-empathy', 'Animal Empathy')),
      fixed('stage2.back-woods.trait.good-hearing', 40, trait('trait.good-hearing', 'Good Hearing')),
      fixed('stage2.back-woods.trait.introvert', -20, trait('trait.introvert', 'Introvert')),
      fixed('stage2.back-woods.trait.wealth', -20, trait('trait.wealth', 'Wealth')),
      fixed('stage2.back-woods.skill.climbing', 30, skill('skill.climbing', 'Climbing')),
      fixed('stage2.back-woods.skill.medtech-general', 20, skill('skill.medtech', 'MedTech/General', 'General')),
      fixed('stage2.back-woods.skill.melee-weapons', 20, skill('skill.melee-weapons', 'Melee Weapons')),
      fixed('stage2.back-woods.skill.perception', 45, skill('skill.perception', 'Perception')),
      { id: 'stage2.back-woods.skill.protocol-affiliation', kind: 'affiliation-bound-skill', xp: -15, skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' },
      fixed('stage2.back-woods.skill.small-arms', 20, skill('skill.small-arms', 'Small Arms')),
      fixed('stage2.back-woods.skill.stealth', 40, skill('skill.stealth', 'Stealth')),
      fixed('stage2.back-woods.skill.survival-forest', 25, skill('skill.survival', 'Survival/Forest', 'Forest')),
      fixed('stage2.back-woods.skill.tracking-wilds', 30, skill('skill.tracking', 'Tracking/Wilds', 'Wilds')),
      { id: 'stage2.back-woods.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 125, allowedTargetTypes: ['attribute', 'trait', 'skill'], maxXpPerTarget: { attribute: 200, trait: 200, skill: 35 } },
    ],
    notes: ['Stage 2 represents Late Childhood; completing it advances chronology to age 16.'],
    deferredRules: [],
  },
  {
    id: STAGE_2_HIGH_SCHOOL_ID,
    displayName: 'High School',
    stage: 2,
    kind: 'late-childhood',
    source: source(77, 'stage-2-high-school'),
    costXp: 400,
    chronologyYears: 16,
    prerequisites: [
      { id: 'high-school.non-clan', kind: 'affiliation', classification: 'non-clan', description: 'Any non-Clan affiliation' },
      { id: 'high-school.not-illiterate', kind: 'trait-absent', traitId: 'trait.illiterate', description: 'May not have the Illiterate Trait' },
    ],
    awards: [
      fixed('high-school.attribute.cha', 25, attribute('CHA')),
      fixed('high-school.attribute.int', 25, attribute('INT')),
      fixed('high-school.trait.connections', 20, trait('trait.connections', 'Connections')),
      fixed('high-school.skill.computers', 20, skill('skill.computers', 'Computers')),
      { id: 'high-school.interest-40', kind: 'any-skill-choice', xp: 40, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 },
      { id: 'high-school.interest-35', kind: 'any-skill-choice', xp: 35, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 },
      { id: 'high-school.language-affiliation', kind: 'affiliation-bound-skill', xp: 10, skillId: 'skill.language', displayName: 'Language/Affiliation' },
      { id: 'high-school.streetwise-affiliation', kind: 'affiliation-bound-skill', xp: 20, skillId: 'skill.streetwise', displayName: 'Streetwise/Affiliation' },
      fixed('high-school.skill.swimming', 20, skill('skill.swimming', 'Swimming')),
      { id: 'high-school.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 185, allowedTargetTypes: ['attribute', 'trait', 'skill'], maxXpPerTarget: { attribute: 200, trait: 200, skill: 35 } },
    ],
    notes: ['Stage 2 represents Late Childhood; completing it advances chronology to age 16.'],
    deferredRules: [],
  },
  {
    id: MILITARY_SCHOOL_ID,
    displayName: 'Military School',
    stage: 2,
    kind: 'late-childhood',
    source: source(80, 'stage-2-military-school'),
    costXp: 500,
    chronologyYears: 16,
    prerequisites: [{ id: 'military-school.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 3, description: 'WIL 3+' }],
    awards: [
      fixed('military-school.attribute.cha', 50, attribute('CHA')),
      fixed('military-school.trait.connections', 15, trait('trait.connections', 'Connections')),
      fixed('military-school.trait.fit', 15, trait('trait.fit', 'Fit')),
      fixed('military-school.trait.rank', 20, trait('trait.rank', 'Rank')),
      fixed('military-school.skill.career-soldier', 25, skill('skill.career', 'Career/Soldier', 'Soldier')),
      fixed('military-school.skill.computers', 35, skill('skill.computers', 'Computers')),
      { id: 'military-school.interest', kind: 'any-skill-choice', xp: 30, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 },
      fixed('military-school.skill.interest-military-history', 40, skill('skill.interest', 'Interest/Military History', 'Military History')),
      fixed('military-school.skill.leadership', 20, skill('skill.leadership', 'Leadership')),
      fixed('military-school.skill.martial-arts', 30, skill('skill.martial-arts', 'Martial Arts')),
      fixed('military-school.skill.medtech-general', 10, skill('skill.medtech', 'MedTech/General', 'General')),
      fixed('military-school.skill.melee-weapons', 20, skill('skill.melee-weapons', 'Melee Weapons')),
      fixed('military-school.skill.protocol-affiliation', 30, skill('skill.protocol', 'Protocol/Affiliation', 'Affiliation')),
      fixed('military-school.skill.running', 30, skill('skill.running', 'Running')),
      fixed('military-school.skill.small-arms', 50, skill('skill.small-arms', 'Small Arms')),
      fixed('military-school.skill.strategy', 10, skill('skill.strategy', 'Strategy')),
      fixed('military-school.skill.swimming', 30, skill('skill.swimming', 'Swimming')),
      { id: 'military-school.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 40, allowedTargetTypes: ['skill'] },
    ],
    notes: [],
    deferredRules: [],
  },
  {
    id: TECHNICAL_COLLEGE_ID,
    displayName: 'Technical College',
    stage: 3,
    kind: 'higher-education',
    stage3School: stage3SchoolClassification(TECHNICAL_COLLEGE_ID),
    source: sourceWithoutPage('stage-3-technical-college'),
    costXp: 600,
    prerequisites: [],
    skillFieldSelection: {
      offers: [
        { fieldId: COMMUNICATIONS_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: PILOT_AIRCRAFT_CIVILIAN_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: PILOT_AEROSPACE_CIVILIAN_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: PILOT_DROPSHIP_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: 'field.technician-civilian', category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: 'field.pilot-exoskeleton', category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: 'field.cartographer', category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: 'field.pilot-industrialmech', category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: 'field.technician-aerospace', category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: 'field.technician-mech', category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: 'field.technician-vehicle', category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: ENGINEER_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: MERCHANT_MARINE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: PILOT_JUMPSHIP_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
      ],
      exactlyBasic: 1,
      minimumAdvanced: 1,
      maximumTotal: 3,
      referenceOnlyOffers: [],
    },
    awards: [
      fixed('technical-college.attribute.dex', 100, attribute('DEX')),
      fixed('technical-college.attribute.int', 100, attribute('INT')),
      fixed('technical-college.trait.equipped', 150, trait('trait.equipped', 'Equipped')),
      fixed('technical-college.skill.computers', 20, skill('skill.computers', 'Computers')),
      { id: 'technical-college.interest', kind: 'any-skill-choice', xp: 30, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 },
      { id: 'technical-college.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 200, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Civilian Stage 3 school. Base cost is 600 XP plus selected Skill Field costs.', 'Alpha Slice 59 exposes only source-audited Fields whose requirements can be represented without unresolved /Any choices.'],
    deferredRules: [],
  },
  {
    id: TRADE_SCHOOL_ID,
    displayName: 'Trade School',
    stage: 3,
    kind: 'higher-education',
    stage3School: stage3SchoolClassification(TRADE_SCHOOL_ID),
    source: source(82, 'stage-3-trade-school'),
    costXp: 560,
    prerequisites: [],
    skillFieldSelection: {
      offers: [
        { fieldId: GENERAL_STUDIES_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: MERCHANT_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: ANALYSIS_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: ANTHROPOLOGIST_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: ARCHAEOLOGIST_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: CARTOGRAPHER_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: COMMUNICATIONS_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: HPG_TECHNICIAN_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: JOURNALIST_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: MANAGER_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: MEDICAL_ASSISTANT_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: MERCHANT_MARINE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
      ],
      exactlyBasic: 1, minimumAdvanced: 1, maximumTotal: 3,
      referenceOnlyOffers: [],
    },
    awards: [
      fixed('trade-school.attribute.int', 50, attribute('INT')),
      { id: 'trade-school.attribute.other', kind: 'flexible-xp', xpPerGrant: 100, count: 1, allowedTargetTypes: ['attribute'], excludedTargetIds: ['INT'] },
      fixed('trade-school.trait.connections', 50, trait('trait.connections', 'Connections')),
      fixed('trade-school.trait.equipped', 100, trait('trait.equipped', 'Equipped')),
      { id: 'trade-school.skills.any-three', kind: 'modeled-skill-choice', xp: 20, count: 3, displayName: 'Any three Skills', distinct: true },
      { id: 'trade-school.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 200, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Civilian Stage 3 school. Base cost is 560 XP plus selected Skill Field costs.', 'Any three Skills are limited to currently modeled governed Skill destinations; this is not the setting-wide Skill universe.'],
    deferredRules: [],
  },
  {
    id: UNIVERSITY_ID,
    displayName: 'University',
    stage: 3,
    kind: 'higher-education',
    stage3School: stage3SchoolClassification(UNIVERSITY_ID),
    source: source(82, 'stage-3-university'),
    costXp: 710,
    prerequisites: [
      { id: 'university.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
    ],
    conditionalPriorModuleAwards: {
      absentModuleIds: ['stage2.preparatory-school', 'stage1.nobility', 'stage1.white-collar'],
      description: 'Applies when the character did not take Preparatory School in Stage 2 or Nobility or White Collar in Stage 1.',
      awards: [
        fixed('university.entry.wil', 100, attribute('WIL')),
        fixed('university.entry.edg', -100, attribute('EDG')),
        fixed('university.entry.connections', 200, trait('trait.connections', 'Connections')),
        fixed('university.entry.reputation', -100, trait('trait.reputation', 'Reputation')),
        fixed('university.entry.wealth', -100, trait('trait.wealth', 'Wealth')),
      ],
    },
    skillFieldSelection: {
      offers: [
        { fieldId: CARTOGRAPHER_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: COMMUNICATIONS_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: GENERAL_STUDIES_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: MANAGER_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: SCIENTIST_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: TECHNICIAN_CIVILIAN_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: ANALYSIS_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: ANTHROPOLOGIST_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: ARCHAEOLOGIST_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: DETECTIVE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: ENGINEER_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: HPG_TECHNICIAN_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: PLANETARY_SURVEYOR_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: MEDICAL_ASSISTANT_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: POLITICIAN_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: TECHNICIAN_AEROSPACE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: TECHNICIAN_VEHICLE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: DOCTOR_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: LAWYER_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: MILITARY_SCIENTIST_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: TECHNICIAN_MECH_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: TECHNICIAN_MILITARY_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
      ],
      exactlyBasic: 1,
      minimumAdvanced: 1,
      maximumTotal: 3,
      referenceOnlyOffers: [],
    },
    awards: [
      fixed('university.attribute.int', 150, attribute('INT')),
      fixed('university.attribute.wil', 75, attribute('WIL')),
      fixed('university.attribute.cha', 25, attribute('CHA')),
      fixed('university.attribute.edg', 25, attribute('EDG')),
      fixed('university.trait.connections', 200, trait('trait.connections', 'Connections')),
      fixed('university.trait.equipped', 50, trait('trait.equipped', 'Equipped')),
      fixed('university.trait.reputation', 75, trait('trait.reputation', 'Reputation')),
      fixed('university.trait.wealth', -200, trait('trait.wealth', 'Wealth')),
      fixed('university.skill.computers', 25, skill('skill.computers', 'Computers')),
      { id: 'university.skill.interest', kind: 'any-skill-choice', xp: 20, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 },
      fixed('university.skill.perception', 25, skill('skill.perception', 'Perception')),
      { id: 'university.skill.protocol-affiliation', kind: 'affiliation-bound-skill', xp: 20, skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' },
      { id: 'university.attribute.any', kind: 'flexible-xp', xpPerGrant: 50, count: 1, allowedTargetTypes: ['attribute'] },
      { id: 'university.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 220, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Civilian Stage 3 school. Base cost is 710 XP plus selected Skill Field costs.'],
    deferredRules: [],
  },
  {
    id: SOLARIS_INTERNSHIP_ID,
    displayName: 'Solaris Internship',
    stage: 3,
    kind: 'higher-education',
    stage3School: stage3SchoolClassification(SOLARIS_INTERNSHIP_ID),
    source: source(82, 'stage-3-solaris-internship'),
    costXp: 700,
    prerequisites: [
      { id: 'solaris-internship.residence', kind: 'residence', location: 'Solaris VII', description: 'Resident of Solaris VII' },
      { id: 'solaris-internship.connections', kind: 'trait-minimum', traitId: 'trait.connections', minimum: 2, description: 'Connections +2 TP or higher' },
    ],
    skillFieldSelection: {
      offers: [
        { fieldId: COMMUNICATIONS_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: MANAGER_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: TECHNICIAN_MILITARY_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: CAVALRY_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: JOURNALIST_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: MECHWARRIOR_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: PILOT_BATTLE_ARMOR_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: POLITICIAN_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: TECHNICIAN_MECH_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
      ],
      exactlyBasic: 1,
      minimumAdvanced: 1,
      maximumTotal: 3,
    },
    awards: [
      fixed('solaris-internship.attribute.cha', 150, attribute('CHA')),
      fixed('solaris-internship.attribute.edg', 50, attribute('EDG')),
      { id: 'solaris-internship.attribute.other', kind: 'flexible-xp', xpPerGrant: 50, count: 1, allowedTargetTypes: ['attribute'], excludedTargetIds: ['CHA', 'EDG'] },
      fixed('solaris-internship.trait.connections', 100, trait('trait.connections', 'Connections')),
      fixed('solaris-internship.trait.enemy', -50, trait('trait.enemy', 'Enemy')),
      fixed('solaris-internship.trait.reputation', 100, trait('trait.reputation', 'Reputation')),
      { id: 'solaris-internship.trait.equipped-or-vehicle', kind: 'flexible-xp', xpPerGrant: 100, count: 1, allowedTargetTypes: ['trait'], allowedTargetIds: ['trait.equipped', 'trait.vehicle'] },
      fixed('solaris-internship.skill.acting', 25, skill('skill.acting', 'Acting')),
      fixed('solaris-internship.skill.solaris-games', 30, skill('skill.interest', 'Interest/Solaris Games', 'Solaris Games')),
      fixed('solaris-internship.skill.perception', 20, skill('skill.perception', 'Perception')),
      { id: 'solaris-internship.skill.streetwise', kind: 'affiliation-skill-choice', xp: 25, skillId: 'skill.streetwise', displayName: 'Streetwise/Any', description: 'Choose the applicable governed affiliation-context Streetwise subskill.' },
      { id: 'solaris-internship.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 100, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Civilian Stage 3 school. Base cost is 700 XP plus selected Skill Field costs.', 'Solaris Cavalry and MechWarrior waive only their Basic Training Field prerequisite for this acquisition. Solaris-trained Pilot/Battle Armor waives only its Infantry Field prerequisite.'],
    deferredRules: [],
  },
  {
    id: POLICE_ACADEMY_ID,
    displayName: 'Police Academy',
    stage: 3,
    kind: 'higher-education',
    stage3School: stage3SchoolClassification(POLICE_ACADEMY_ID),
    source: source(82, 'stage-3-police-academy'),
    costXp: 680,
    prerequisites: [],
    skillFieldSelection: {
      offers: [
        { fieldId: POLICE_OFFICER_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 0.5 },
        { fieldId: DETECTIVE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: INTELLIGENCE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: TECHNICIAN_MILITARY_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: TECHNICIAN_AEROSPACE_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: TECHNICIAN_VEHICLE_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: ANALYSIS_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: COMMUNICATIONS_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: COVERT_OPERATIONS_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: POLICE_TACTICAL_OFFICER_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: SPECIAL_FORCES_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
      ],
      exactlyBasic: 1,
      minimumAdvanced: 1,
      maximumTotal: 3,
    },
    awards: [
      fixed('police-academy.attribute.rfl', 100, attribute('RFL')),
      fixed('police-academy.attribute.wil', 100, attribute('WIL')),
      fixed('police-academy.trait.connections', 50, trait('trait.connections', 'Connections')),
      fixed('police-academy.trait.rank', 100, trait('trait.rank', 'Rank')),
      fixed('police-academy.trait.reputation', 100, trait('trait.reputation', 'Reputation')),
      fixed('police-academy.skill.computers', 15, skill('skill.computers', 'Computers')),
      { id: 'police-academy.skill.driving', kind: 'any-skill-choice', xp: 20, skillId: 'skill.driving', displayName: 'Driving/Any', count: 1 },
      { id: 'police-academy.skill.protocol-affiliation', kind: 'affiliation-bound-skill', xp: 25, skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' },
      { id: 'police-academy.skill.streetwise-affiliation', kind: 'affiliation-bound-skill', xp: 30, skillId: 'skill.streetwise', displayName: 'Streetwise/Affiliation' },
      { id: 'police-academy.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 140, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Intelligence/Police Stage 3 school. Base cost is 680 XP plus selected Skill Field costs.'],
    deferredRules: ['Source-listed reference-only Fields remain deferred.'],
  },
  {
    id: INTELLIGENCE_OPERATIVE_TRAINING_ID,
    displayName: 'Intelligence Operative Training',
    stage: 3,
    kind: 'higher-education',
    stage3School: stage3SchoolClassification(INTELLIGENCE_OPERATIVE_TRAINING_ID),
    source: source(83, 'stage-3-intelligence-operative-training'),
    costXp: 760,
    prerequisites: [
      { id: 'intelligence-operative.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
      { id: 'intelligence-operative.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 5, description: 'WIL 5+' },
      { id: 'intelligence-operative.connections', kind: 'trait-minimum', traitId: 'trait.connections', minimum: 2, description: 'Connections +2 TP or higher' },
    ],
    skillFieldSelection: {
      offers: [
        { fieldId: BASIC_TRAINING_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: DETECTIVE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: INTELLIGENCE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: POLICE_OFFICER_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: SCOUT_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: ANALYSIS_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: COVERT_OPERATIONS_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: POLICE_TACTICAL_OFFICER_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: SPECIAL_FORCES_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
      ],
      exactlyBasic: 1,
      minimumAdvanced: 1,
      maximumTotal: 3,
    },
    awards: [
      fixed('intelligence-operative.attribute.int', 100, attribute('INT')),
      fixed('intelligence-operative.attribute.wil', 150, attribute('WIL')),
      { id: 'intelligence-operative.attribute.any', kind: 'flexible-xp', xpPerGrant: 50, count: 1, allowedTargetTypes: ['attribute'] },
      fixed('intelligence-operative.trait.alternate-id', 50, trait('trait.alternate-id', 'Alternate ID')),
      fixed('intelligence-operative.trait.connections', 200, trait('trait.connections', 'Connections')),
      fixed('intelligence-operative.trait.in-for-life', -300, trait('trait.in-for-life', 'In For Life')),
      fixed('intelligence-operative.trait.rank', 250, trait('trait.rank', 'Rank')),
      fixed('intelligence-operative.trait.wealth', 50, trait('trait.wealth', 'Wealth')),
      fixed('intelligence-operative.skill.acting', 20, skill('skill.acting', 'Acting')),
      fixed('intelligence-operative.skill.computers', 20, skill('skill.computers', 'Computers')),
      { id: 'intelligence-operative.skill.protocol-affiliation', kind: 'affiliation-bound-skill', xp: 20, skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' },
      { id: 'intelligence-operative.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 150, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Intelligence/Police Stage 3 school. Base cost is 760 XP plus selected Skill Field costs.'],
    deferredRules: ['Source-listed reference-only Fields remain deferred.'],
  },
  {
    id: MILITARY_ACADEMY_ID,
    displayName: 'Military Academy',
    stage: 3,
    kind: 'higher-education',
    stage3School: stage3SchoolClassification(MILITARY_ACADEMY_ID),
    source: source(83, 'stage-3-military-academy'),
    costXp: 830,
    prerequisites: [],
    conditionalPriorModuleAwards: {
      absentModuleIds: ['stage2.preparatory-school', 'stage2.military-school'],
      description: 'Applies when the character did not take Preparatory School or Military School in Stage 2.',
      awards: [
        fixed('military-academy.entry.wil', 100, attribute('WIL')),
        fixed('military-academy.entry.edg', -100, attribute('EDG')),
        fixed('military-academy.entry.connections', 200, trait('trait.connections', 'Connections')),
        fixed('military-academy.entry.reputation', -100, trait('trait.reputation', 'Reputation')),
        fixed('military-academy.entry.wealth', -100, trait('trait.wealth', 'Wealth')),
      ],
    },
    skillFieldSelection: {
      offers: [
        { fieldId: 'field.basic-training', category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: BASIC_TRAINING_NAVAL_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: 'field.infantry', category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: CAVALRY_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: 'field.mechwarrior', category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: MARINE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: SHIPS_CREW_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: SCOUT_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: ANALYSIS_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: SCIENTIST_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: PILOT_DROPSHIP_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: PILOT_AEROSPACE_COMBAT_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: PILOT_AIRCRAFT_COMBAT_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: DOCTOR_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: MILITARY_SCIENTIST_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: SPECIAL_FORCES_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: PILOT_BATTLE_ARMOR_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: PILOT_JUMPSHIP_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: PILOT_WARSHIP_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: INFANTRY_ANTI_MECH_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
      ],
      exactlyBasic: 1,
      minimumAdvanced: 1,
      maximumTotal: 3,
      referenceOnlyOffers: [],
    },
    awards: [
      fixed('military-academy.attribute.str', 50, attribute('STR')),
      fixed('military-academy.attribute.bod', 100, attribute('BOD')),
      fixed('military-academy.attribute.rfl', 125, attribute('RFL')),
      fixed('military-academy.attribute.wil', 100, attribute('WIL')),
      fixed('military-academy.trait.equipped', 100, trait('trait.equipped', 'Equipped')),
      fixed('military-academy.trait.rank', 200, trait('trait.rank', 'Rank')),
      fixed('military-academy.skill.interest-history', 15, skill('skill.interest', 'Interest/Military History', 'Military History')),
      fixed('military-academy.skill.leadership', 10, skill('skill.leadership', 'Leadership')),
      { id: 'military-academy.skill.protocol-affiliation', kind: 'affiliation-bound-skill', xp: 15, skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' },
      fixed('military-academy.skill.swimming', 15, skill('skill.swimming', 'Swimming')),
      { id: 'military-academy.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 100, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Military Stage 3 school. Base cost is 830 XP plus selected Skill Field costs.'],
    deferredRules: ['Reference-only Fields remain deferred.'],
  },
  {
    id: MILITARY_ENLISTMENT_ID,
    displayName: 'Military Enlistment',
    stage: 3,
    kind: 'higher-education',
    stage3School: stage3SchoolClassification(MILITARY_ENLISTMENT_ID),
    source: source(83, 'stage-3-military-enlistment'),
    costXp: 720,
    prerequisites: [],
    skillFieldSelection: {
      offers: [
        { fieldId: 'field.basic-training', category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 0.5 },
        { fieldId: BASIC_TRAINING_NAVAL_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 0.5 },
        { fieldId: 'field.infantry', category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: CAVALRY_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: MARINE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: SHIPS_CREW_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: TECHNICIAN_MILITARY_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: SCOUT_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: MEDICAL_ASSISTANT_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: POLICE_OFFICER_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: DETECTIVE_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: POLICE_TACTICAL_OFFICER_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: TECHNICIAN_AEROSPACE_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: TECHNICIAN_MECH_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: TECHNICIAN_VEHICLE_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: SPECIAL_FORCES_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: INFANTRY_ANTI_MECH_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
      ],
      exactlyBasic: 1,
      minimumAdvanced: 1,
      maximumTotal: 3,
      referenceOnlyOffers: [],
    },
    awards: [
      fixed('military-enlistment.attribute.str', 125, attribute('STR')),
      fixed('military-enlistment.attribute.bod', 125, attribute('BOD')),
      fixed('military-enlistment.attribute.rfl', 100, attribute('RFL')),
      fixed('military-enlistment.attribute.wil', 100, attribute('WIL')),
      fixed('military-enlistment.attribute.cha', -100, attribute('CHA')),
      fixed('military-enlistment.trait.equipped', 50, trait('trait.equipped', 'Equipped')),
      fixed('military-enlistment.trait.rank', 100, trait('trait.rank', 'Rank')),
      fixed('military-enlistment.skill.swimming', 20, skill('skill.swimming', 'Swimming')),
      { id: 'military-enlistment.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 200, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Military Stage 3 school. Base cost is 720 XP plus selected Skill Field costs.'],
    deferredRules: ['Reference-only Fields remain deferred.'],
  },
  {
    id: FAMILY_TRAINING_ID,
    displayName: 'Family Training',
    stage: 3,
    kind: 'higher-education',
    stage3School: stage3SchoolClassification(FAMILY_TRAINING_ID),
    source: source(83, 'stage-3-family-training'),
    costXp: 570,
    prerequisites: [{
      id: 'family-training.entry',
      kind: 'any-of',
      description: 'Preparatory School or Military School as a Stage 2 module, or Connections +1 TP or higher',
      options: [
        { id: 'family-training.prior-stage2-school', kind: 'module-history', moduleIds: ['stage2.preparatory-school', 'stage2.military-school'], description: 'Preparatory School or Military School as a Stage 2 module' },
        { id: 'family-training.connections', kind: 'trait-minimum', traitId: 'trait.connections', minimum: 1, description: 'Connections +1 TP or higher' },
      ],
    }],
    skillFieldSelection: {
      offers: [
        { fieldId: BASIC_TRAINING_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 0.5 },
        { fieldId: BASIC_TRAINING_NAVAL_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 0.5 },
        { fieldId: CAVALRY_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: INFANTRY_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: MARINE_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: 'field.mechwarrior', category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: SCOUT_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: SHIPS_CREW_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: PILOT_BATTLE_ARMOR_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: PILOT_DROPSHIP_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: PILOT_AEROSPACE_COMBAT_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: PILOT_AIRCRAFT_COMBAT_FIELD_ID, category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1.5 },
        { fieldId: PILOT_JUMPSHIP_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
        { fieldId: INFANTRY_ANTI_MECH_FIELD_ID, category: 'special', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
      ],
      exactlyBasic: 1,
      minimumAdvanced: 1,
      maximumTotal: 3,
      referenceOnlyOffers: [],
    },
    awards: [
      fixed('family-training.attribute.str', 75, attribute('STR')),
      fixed('family-training.attribute.bod', 75, attribute('BOD')),
      fixed('family-training.attribute.rfl', 50, attribute('RFL')),
      fixed('family-training.attribute.wil', 50, attribute('WIL')),
      fixed('family-training.trait.equipped', 50, trait('trait.equipped', 'Equipped')),
      fixed('family-training.trait.rank', 100, trait('trait.rank', 'Rank')),
      { id: 'family-training.skill.driving', kind: 'any-skill-choice', xp: 15, skillId: 'skill.driving', displayName: 'Driving/Any', count: 1 },
      fixed('family-training.skill.homeworld-history', 20, skill('skill.interest', 'Interest/Homeworld History', 'Homeworld History')),
      { id: 'family-training.skill.protocol-affiliation', kind: 'affiliation-bound-skill', xp: 15, skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' },
      { id: 'family-training.skill.survival', kind: 'any-skill-choice', xp: 20, skillId: 'skill.survival', displayName: 'Survival/Any', count: 1 },
      { id: 'family-training.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 100, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Military Stage 3 school. Base cost is 570 XP plus selected Skill Field costs. Homeworld History resolves from the explicitly recorded character homeworld.'],
    deferredRules: ['Source-listed reference-only Fields remain deferred.'],
  },
  {
    id: OFFICER_TRAINING_SCHOOL_ID,
    displayName: 'Officer Candidate School',
    stage: 3,
    kind: 'higher-education',
    stage3School: stage3SchoolClassification(OFFICER_TRAINING_SCHOOL_ID),
    source: source(83, 'stage-3-officer-candidate-school'),
    costXp: 550,
    prerequisites: [],
    skillFieldSelection: {
      offers: [
        { fieldId: OFFICER_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
      ],
      exactlyBasic: 1,
      minimumAdvanced: 0,
      maximumTotal: 1,
    },
    awards: [
      fixed('officer-candidate-school.attribute.cha', 100, attribute('CHA')),
      fixed('officer-candidate-school.attribute.edg', -200, attribute('EDG')),
      fixed('officer-candidate-school.trait.connections', 50, trait('trait.connections', 'Connections')),
      fixed('officer-candidate-school.trait.equipped', 50, trait('trait.equipped', 'Equipped')),
      fixed('officer-candidate-school.trait.rank', 250, trait('trait.rank', 'Rank')),
      fixed('officer-candidate-school.trait.reputation', 50, trait('trait.reputation', 'Reputation')),
      fixed('officer-candidate-school.trait.wealth', 100, trait('trait.wealth', 'Wealth')),
      fixed('officer-candidate-school.skill.leadership', 10, skill('skill.leadership', 'Leadership')),
      { id: 'officer-candidate-school.skill.protocol-affiliation', kind: 'affiliation-bound-skill', xp: 25, skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' },
      { id: 'officer-candidate-school.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 115, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: [
      'Secondary Stage 3 school available only after qualifying Intelligence/Police or Military schooling with at least one Basic and one Advanced Field.',
      'Officer Candidate School provides the Officer Field and access to officer-grade ranks without consuming a normal Stage 3 family.',
    ],
    deferredRules: [],
  },
  {
    id: COMSTAR_WOB_SERVICE_ID,
    displayName: 'ComStar/Word of Blake Service',
    stage: 4,
    kind: 'real-life',
    source: source(85, 'stage-4-comstar-word-of-blake-service'),
    costXp: 900,
    chronologyYears: 5,
    repeatPolicy: {
      sameModuleRepeat: 'allowed', repeatCost: 'full-module-cost',
      repeatAwards: { skills: 'repeat', flexibleXp: 'repeat', attributes: 'first-occurrence-only', traits: 'first-occurrence-only' },
    },
    prerequisites: [
      { id: 'service.order', kind: 'any-of', description: 'ComStar or Word of Blake affiliation', options: [
        { id: 'service.order.comstar', kind: 'affiliation', affiliationId: 'affiliation.comstar', description: 'ComStar affiliation' },
        { id: 'service.order.wob', kind: 'affiliation', affiliationId: 'affiliation.word-of-blake', description: 'Word of Blake affiliation' },
      ] },
      ...[
        ['trait.lost-limb', 'Lost Limb'], ['trait.poor-hearing', 'Poor Hearing'], ['trait.poor-vision', 'Poor Vision'], ['trait.tds', 'TDS'],
      ].map(([traitId, name]) => ({ id: `service.${traitId}`, kind: 'trait-level-maximum' as const, traitId, maximumMagnitude: 1, description: `${name} may not exceed its lowest possible level` })),
    ],
    awards: [
      fixed('service.shared.attribute.dex', 50, attribute('DEX')),
      fixed('service.shared.attribute.int', 50, attribute('INT')),
      fixed('service.shared.trait.combat-sense', 75, trait('trait.combat-sense', 'Combat Sense')),
      fixed('service.shared.trait.in-for-life', -100, trait('trait.in-for-life', 'In For Life')),
      fixed('service.shared.trait.tech-empathy', 35, trait('trait.tech-empathy', 'Tech Empathy')),
      { id: 'service.shared.trait.choice', kind: 'flexible-xp', xpPerGrant: 100, count: 1, allowedTargetTypes: ['trait'], allowedTargetIds: ['trait.equipped', 'trait.vehicle', 'trait.wealth'] },
      fixed('service.shared.skill.administration', 40, skill('skill.administration', 'Administration')),
      fixed('service.shared.skill.communications-hpg', 55, skill('skill.communications', 'Communications/HPG', 'HPG')),
      { id: 'service.shared.skill.communications-any', kind: 'any-skill-choice', xp: 35, skillId: 'skill.communications', displayName: 'Communications/Any', count: 1 },
      fixed('service.shared.skill.computers', 35, skill('skill.computers', 'Computers')),
      { id: 'service.shared.skill.language-any', kind: 'any-skill-choice', xp: 25, skillId: 'skill.language', displayName: 'Language/Any', count: 1 },
      fixed('service.shared.skill.martial-arts', 45, skill('skill.martial-arts', 'Martial Arts')),
      fixed('service.shared.skill.protocol-comstar', 35, skill('skill.protocol', 'Protocol/ComStar', 'ComStar')),
      fixed('service.shared.skill.protocol-wob', 35, skill('skill.protocol', 'Protocol/Word of Blake', 'Word of Blake')),
      { id: 'service.shared.skill.protocol-any', kind: 'any-skill-choice', xp: 20, skillId: 'skill.protocol', displayName: 'Protocol/Any', count: 1 },
      fixed('service.comstar.attribute.wil', 25, attribute('WIL')),
      fixed('service.comstar.attribute.edg', -25, attribute('EDG')),
      fixed('service.comstar.trait.equipped', 80, trait('trait.equipped', 'Equipped')),
      fixed('service.comstar.trait.rank', 80, trait('trait.rank', 'Rank')),
      fixed('service.comstar.trait.compulsion-wob', -50, trait('trait.compulsion', 'Compulsion/Hatred of Word of Blake', { compulsion: 'Hatred of Word of Blake' })),
      fixed('service.comstar.skill.communications-hpg', 15, skill('skill.communications', 'Communications/HPG', 'HPG')),
      fixed('service.comstar.skill.leadership', 20, skill('skill.leadership', 'Leadership')),
      fixed('service.comstar.skill.negotiation', 15, skill('skill.negotiation', 'Negotiation')),
      { id: 'service.comstar.skill.technician-any', kind: 'any-skill-choice', xp: 15, skillId: 'skill.technician', displayName: 'Technician/Any', count: 1 },
      fixed('service.comstar.skill.training', 15, skill('skill.training', 'Training')),
      fixed('service.wob.attribute.int', 25, attribute('INT')),
      fixed('service.wob.attribute.cha', -25, attribute('CHA')),
      fixed('service.wob.trait.equipped', 70, trait('trait.equipped', 'Equipped')),
      fixed('service.wob.trait.rank', 70, trait('trait.rank', 'Rank')),
      fixed('service.wob.trait.compulsion-comstar', -75, trait('trait.compulsion', 'Compulsion/Hatred of ComStar', { compulsion: 'Hatred of ComStar' })),
      fixed('service.wob.trait.compulsion-clans', -100, trait('trait.compulsion', 'Compulsion/Hatred of Clans', { compulsion: 'Hatred of Clans' })),
      { id: 'service.wob.skill.communications-any', kind: 'any-skill-choice', xp: 50, skillId: 'skill.communications', displayName: 'Communications/Any', count: 1 },
      fixed('service.wob.skill.computers', 35, skill('skill.computers', 'Computers')),
      fixed('service.wob.skill.cryptography', 25, skill('skill.cryptography', 'Cryptography')),
      fixed('service.wob.skill.interest-blake', 50, skill('skill.interest', 'Interest/Writings of Jerome Blake', 'Writings of Jerome Blake')),
      fixed('service.wob.skill.interrogation', 40, skill('skill.interrogation', 'Interrogation')),
      fixed('service.wob.skill.perception', 25, skill('skill.perception', 'Perception')),
      { id: 'service.branch.skills.any-four', kind: 'modeled-skill-choice', xp: 40, count: 4, displayName: 'Any four Skills', distinct: true },
      { id: 'service.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 50, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Requires committed ComStar or Word of Blake affiliation.', 'Alternative intelligence, police, and military service modules remain outside this bounded slice.'],
    deferredRules: [],
  },
  {
    id: TRAVEL_ID,
    displayName: 'Travel',
    stage: 4,
    kind: 'real-life',
    source: source(91, 'stage-4-travel'),
    costXp: 700,
    chronologyYears: 6,
    repeatPolicy: { sameModuleRepeat: 'allowed', repeatCost: 'full-module-cost', repeatAwards: { skills: 'repeat', flexibleXp: 'repeat', attributes: 'first-occurrence-only', traits: 'first-occurrence-only' } },
    prerequisites: [
      { id: 'travel.tds', kind: 'trait-absent', traitId: 'trait.tds', description: 'Cannot have Transit Disorientation Syndrome.' },
      { id: 'travel.resources', kind: 'any-of', description: 'Extra Income or Wealth at +2 TP or higher', options: [
        { id: 'travel.extra-income', kind: 'trait-minimum', traitId: 'trait.extra-income', minimum: 2, description: 'Extra Income +2 or higher' },
        { id: 'travel.wealth', kind: 'trait-minimum', traitId: 'trait.wealth', minimum: 2, description: 'Wealth +2 or higher' },
      ] },
    ],
    awards: [
      fixed('travel.attribute.int', 45, attribute('INT')), fixed('travel.attribute.edg', 45, attribute('EDG')),
      { id: 'travel.skill.art-any', kind: 'any-skill-choice', xp: 35, skillId: 'skill.art', displayName: 'Art/Any', count: 1 }, fixed('travel.skill.art-cooking', 30, skill('skill.art', 'Art/Cooking', 'Cooking')), fixed('travel.skill.climbing', 35, skill('skill.climbing', 'Climbing')),
      { id: 'travel.skill.driving-any', kind: 'any-skill-choice', xp: 50, skillId: 'skill.driving', displayName: 'Driving/Any', count: 1 },
      { id: 'travel.skill.interest-1', kind: 'any-skill-choice', xp: 75, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 }, { id: 'travel.skill.interest-2', kind: 'any-skill-choice', xp: 45, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 }, { id: 'travel.skill.interest-3', kind: 'any-skill-choice', xp: 20, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 },
      { id: 'travel.skill.language-affiliation', kind: 'affiliation-bound-skill', xp: 50, skillId: 'skill.language', displayName: 'Language/Affiliation' }, { id: 'travel.skill.language-any', kind: 'any-skill-choice', xp: 35, skillId: 'skill.language', displayName: 'Language/Any', count: 1 }, { id: 'travel.skill.survival-any', kind: 'any-skill-choice', xp: 25, skillId: 'skill.survival', displayName: 'Survival/Any', count: 1 }, fixed('travel.skill.swimming', 50, skill('skill.swimming', 'Swimming')), fixed('travel.skill.zero-g', 50, skill('skill.zero-g-operations', 'Zero-G Operations')),
      { id: 'travel.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 110, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Stage 4 Real Life module; adds six years.'], deferredRules: [],
  },
  {
    id: AGITATOR_ID,
    displayName: 'Agitator',
    stage: 4,
    kind: 'real-life',
    source: sourceWithoutPage('stage-4-agitator'),
    costXp: 900,
    chronologyYears: 4,
    repeatPolicy: {
      sameModuleRepeat: 'deferred',
      repeatCost: 'full-module-cost',
      repeatAwards: {
        skills: 'repeat',
        flexibleXp: 'repeat',
        attributes: 'first-occurrence-only',
        traits: 'first-occurrence-only',
      },
    },
    prerequisites: [],
    awards: [
      fixed('agitator.attribute.wil', 75, attribute('WIL')),
      fixed('agitator.trait.bloodmark', -50, trait('trait.bloodmark', 'Bloodmark')),
      fixed('agitator.trait.gregarious', 80, trait('trait.gregarious', 'Gregarious')),
      fixed('agitator.trait.toughness', 80, trait('trait.toughness', 'Toughness')),
      fixed('agitator.trait.reputation', -150, trait('trait.reputation', 'Reputation')),
      fixed('agitator.skill.acting', 50, skill('skill.acting', 'Acting')),
      fixed('agitator.skill.disguise', 75, skill('skill.disguise', 'Disguise')),
      { id: 'agitator.skill.driving', kind: 'any-skill-choice', xp: 65, skillId: 'skill.driving', displayName: 'Driving/Any', count: 1 },
      fixed('agitator.skill.leadership', 60, skill('skill.leadership', 'Leadership')),
      fixed('agitator.skill.negotiation', 80, skill('skill.negotiation', 'Negotiation')),
      fixed('agitator.skill.perception', 70, skill('skill.perception', 'Perception')),
      { id: 'agitator.skill.prestidigitation', kind: 'any-skill-choice', xp: 100, skillId: 'skill.prestidigitation', displayName: 'Prestidigitation/Any', count: 1 },
      fixed('agitator.skill.small-arms', 75, skill('skill.small-arms', 'Small Arms')),
      { id: 'agitator.skill.streetwise-affiliation', kind: 'affiliation-bound-skill', xp: 75, skillId: 'skill.streetwise', displayName: 'Streetwise/Affiliation' },
      fixed('agitator.skill.tactics-infantry', 40, skill('skill.tactics', 'Tactics/Infantry', 'Infantry')),
      fixed('agitator.skill.training', 50, skill('skill.training', 'Training')),
      { id: 'agitator.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 125, allowedTargetTypes: ['attribute', 'trait', 'skill'], maxXpPerTarget: { attribute: 50 } },
    ],
    notes: ['Stage 4 Real Life module. Adds four years to character chronology.'],
    deferredRules: ['Repeated Stage 4 execution and multiple Stage 4 modules are not supported in Alpha Slice 9.'],
  },
  {
    id: TRUEBORN_CRECHE_ID, displayName: 'Trueborn Crèche', stage: 1, kind: 'early-childhood', source: source(76, 'stage-1-trueborn-creche'), costXp: 300, chronologyYears: 10,
    prerequisites: [clanAffiliation('creche.affiliation'), trueborn('creche.trueborn'), { id: 'creche.phenotype', kind: 'any-of', options: [phenotype('creche.phenotype.aerospace', 'phenotype.aerospace'), phenotype('creche.phenotype.elemental', 'phenotype.elemental'), phenotype('creche.phenotype.mechwarrior', 'phenotype.mechwarrior')], description: 'Aerospace, Elemental, or MechWarrior Phenotype' }],
    awards: [fixed('creche.attribute.str', 100, attribute('STR')), fixed('creche.attribute.bod', 125, attribute('BOD')), fixed('creche.attribute.rfl', 125, attribute('RFL')), fixed('creche.attribute.wil', 100, attribute('WIL')), fixed('creche.attribute.cha', -75, attribute('CHA')), fixed('creche.trait.compulsion', -100, trait('trait.compulsion', 'Compulsion/Clan Honor', { compulsion: 'Clan Honor' })), fixed('creche.trait.phenotype', 0, trait('trait.phenotype', 'Phenotype')), fixed('creche.trait.slow-learner', -300, trait('trait.slow-learner', 'Slow Learner')), fixed('creche.trait.trueborn', 200, trait('trait.trueborn', 'Trueborn')), fixed('creche.skill.interest-clan-remembrance', 10, skill('skill.interest', 'Interest/Clan Remembrance', 'Clan Remembrance')), fixed('creche.skill.martial-arts', 10, skill('skill.martial-arts', 'Martial Arts')), fixed('creche.skill.melee-weapons', 5, skill('skill.melee-weapons', 'Melee Weapons')), fixed('creche.skill.protocol-clan', 10, skill('skill.protocol', 'Protocol/Clan', 'Clan')), fixed('creche.skill.small-arms', 5, skill('skill.small-arms', 'Small Arms')), fixed('creche.skill.swimming', 10, skill('skill.swimming', 'Swimming')), { id: 'creche.flexible', kind: 'flexible-xp', xpPerGrant: 15, count: 5, allowedTargetTypes: ['attribute', 'trait', 'skill'] }],
    notes: ['Trueborn Clan childhood module; choose Aerospace, Elemental, or MechWarrior Phenotype.'], deferredRules: ['Clan creation remains disabled; branch-specific source restrictions are enforced only through internal prerequisites.'],
  },
  {
    id: CLAN_APPRENTICESHIP_ID, displayName: 'Clan Apprenticeship', stage: 2, kind: 'late-childhood', source: source(77, 'stage-2-clan-apprenticeship'), costXp: 500, chronologyYears: 16,
    prerequisites: [clanAffiliation('apprenticeship.affiliation'), attributeMinimum('apprenticeship.bod', 'BOD', 4), attributeMinimum('apprenticeship.cha', 'CHA', 4)],
    skillFieldSelection: { offers: [{ fieldId: CLAN_BASIC_TRAINING_FIELD_ID, category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 }, { fieldId: CLAN_AEROSPACE_WARRIOR_FIELD_ID, category: 'advanced', costXpPerSkill: 40, awardedXpPerSkill: 50, chronologyYears: 2 }, { fieldId: CLAN_ELEMENTAL_FIELD_ID, category: 'advanced', costXpPerSkill: 40, awardedXpPerSkill: 50, chronologyYears: 2 }, { fieldId: CLAN_MECHWARRIOR_FIELD_ID, category: 'advanced', costXpPerSkill: 40, awardedXpPerSkill: 50, chronologyYears: 2 }], exactlyBasic: 1, minimumAdvanced: 0, maximumTotal: 2, referenceOnlyOffers: [{ displayName: 'Clan Cavalry', category: 'advanced', chronologyYears: 2, reason: 'Cavalry alternatives are not mechanically representable.' }, { displayName: 'Infantry', category: 'advanced', chronologyYears: 2, reason: 'Clan-specific Infantry branch remains outside this slice.' }] },
    awards: [fixed('apprenticeship.attribute.bod', 50, attribute('BOD')), fixed('apprenticeship.attribute.wil', 50, attribute('WIL')), fixed('apprenticeship.attribute.cha', -30, attribute('CHA')), fixed('apprenticeship.trait.compulsion', -30, trait('trait.compulsion', 'Compulsion/Clan Honor', { compulsion: 'Clan Honor' })), fixed('apprenticeship.trait.rank', 100, trait('trait.rank', 'Rank')), fixed('apprenticeship.trait.reputation', -40, trait('trait.reputation', 'Reputation')), fixed('apprenticeship.skill.career-soldier', 50, skill('skill.career', 'Career/Soldier', 'Soldier')), fixed('apprenticeship.skill.interest-clan-remembrance', 20, skill('skill.interest', 'Interest/Clan Remembrance', 'Clan Remembrance')), fixed('apprenticeship.skill.negotiation', 50, skill('skill.negotiation', 'Negotiation')), { id: 'apprenticeship.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 200, allowedTargetTypes: ['attribute', 'trait', 'skill'] }],
    notes: ['On completion, Clan warriors proceed to Stage 4 in the source sequence.'], deferredRules: ['Technician/Any and unsupported branch-specific Fields remain unavailable.'],
  },
  {
    id: TRUEBORN_SIBKO_ID, displayName: 'Trueborn Sibko', stage: 2, kind: 'late-childhood', source: source(79, 'stage-2-trueborn-sibko'), costXp: 1600, chronologyYears: 16,
    prerequisites: [clanAffiliation('sibko.affiliation'), { id: 'sibko.caste', kind: 'clan-caste', casteId: 'warrior', description: 'Warrior caste' }, trueborn('sibko.trueborn'), { id: 'sibko.phenotype', kind: 'any-of', options: [phenotype('sibko.phenotype.aerospace', 'phenotype.aerospace'), phenotype('sibko.phenotype.elemental', 'phenotype.elemental'), phenotype('sibko.phenotype.mechwarrior', 'phenotype.mechwarrior')], description: 'Aerospace, Elemental, or MechWarrior Phenotype' }, attributeMinimum('sibko.bod', 'BOD', 3), attributeMinimum('sibko.dex', 'DEX', 4), attributeMinimum('sibko.rfl', 'RFL', 3), attributeMinimum('sibko.wil', 'WIL', 3), { id: 'sibko.creche', kind: 'module-history', moduleIds: [TRUEBORN_CRECHE_ID], description: 'Trueborn Crèche history' }],
    skillFieldSelection: { offers: [{ fieldId: CLAN_AEROSPACE_WARRIOR_FIELD_ID, category: 'advanced', costXpPerSkill: 40, awardedXpPerSkill: 50, chronologyYears: 2 }, { fieldId: CLAN_ELEMENTAL_FIELD_ID, category: 'advanced', costXpPerSkill: 40, awardedXpPerSkill: 50, chronologyYears: 2 }, { fieldId: CLAN_MECHWARRIOR_FIELD_ID, category: 'advanced', costXpPerSkill: 40, awardedXpPerSkill: 50, chronologyYears: 2 }], exactlyBasic: 0, minimumAdvanced: 0, maximumTotal: 1 },
    awards: [fixed('sibko.attribute.bod', 40, attribute('BOD')), fixed('sibko.attribute.dex', 60, attribute('DEX')), fixed('sibko.attribute.rfl', 50, attribute('RFL')), fixed('sibko.attribute.wil', 20, attribute('WIL')), fixed('sibko.attribute.cha', -30, attribute('CHA')), fixed('sibko.trait.compulsion', -50, trait('trait.compulsion', 'Compulsion/Clan Honor', { compulsion: 'Clan Honor' })), fixed('sibko.trait.rank', 200, trait('trait.rank', 'Rank')), fixed('sibko.skill.career-soldier', 80, skill('skill.career', 'Career/Soldier', 'Soldier')), fixed('sibko.skill.interest-clan-remembrance', 50, skill('skill.interest', 'Interest/Clan Remembrance', 'Clan Remembrance')), fixed('sibko.skill.negotiation', 50, skill('skill.negotiation', 'Negotiation')), { id: 'sibko.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 50, allowedTargetTypes: ['attribute', 'trait', 'skill'] }],
    notes: ['Trueborn warriors identify a supported branch before advancing.'], deferredRules: ['Cavalry, ProtoMech, advanced Elemental, and Technician/Any-dependent branches remain deferred.'],
  },
  {
    id: CLAN_CIVILIAN_JOB_ID, displayName: 'Civilian Job', stage: 4, kind: 'real-life', source: source(84, 'stage-4-civilian-job'), costXp: 600, chronologyYears: 6,
    prerequisites: [clanAffiliation('civilian-job.affiliation'), { id: 'civilian-job.non-warrior-caste', kind: 'path', description: 'Clan non-warrior caste other than Scientist or Dark Caste' }],
    repeatPolicy: { sameModuleRepeat: 'allowed', repeatCost: 'full-module-cost', repeatAwards: { skills: 'repeat', flexibleXp: 'repeat', attributes: 'first-occurrence-only', traits: 'first-occurrence-only' } },
    awards: [
      fixed('civilian-job.skill.administration', 75, skill('skill.administration', 'Administration')),
      fixed('civilian-job.skill.career-non-military', 40, skill('skill.career', 'Career/Non-Military', 'Non-Military')),
      fixed('civilian-job.skill.computers', 40, skill('skill.computers', 'Computers')),
      { id: 'civilian-job.skill.driving-any', kind: 'any-skill-choice', xp: 60, skillId: 'skill.driving', displayName: 'Driving/Any', count: 1 },
      { id: 'civilian-job.skill.interest-any-1', kind: 'any-skill-choice', xp: 50, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 },
      { id: 'civilian-job.skill.interest-any-2', kind: 'any-skill-choice', xp: 50, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 },
      fixed('civilian-job.skill.leadership', 40, skill('skill.leadership', 'Leadership')),
      fixed('civilian-job.skill.negotiation', 30, skill('skill.negotiation', 'Negotiation')),
      fixed('civilian-job.skill.protocol-affiliation', 50, skill('skill.protocol', 'Protocol/Affiliation', 'Affiliation')),
      { id: 'civilian-job.skill.career-field', kind: 'multi-skill-choice', xp: 20, skillId: 'skill.any', displayName: 'Any four Skills in chosen career Field', count: 4 },
      { id: 'civilian-job.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 85, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Clan characters of any non-warrior caste except Scientist and Dark Caste may take this module.'], deferredRules: ['Career Field destinations remain governed by the existing Field catalog.'],
  },
  {
    id: CLAN_WATCH_OPERATIVE_ID, displayName: 'Clan Watch Operative', stage: 4, kind: 'real-life', source: source(84, 'stage-4-clan-watch-operative'), costXp: 1200, chronologyYears: 3,
    prerequisites: [clanAffiliation('watch.affiliation'), { id: 'watch.caste', kind: 'path', description: 'Warrior, Scientist, or Technician caste' }],
    repeatPolicy: { sameModuleRepeat: 'deferred', repeatCost: 'full-module-cost', repeatAwards: { skills: 'repeat', flexibleXp: 'repeat', attributes: 'first-occurrence-only', traits: 'first-occurrence-only' } },
    awards: [
      fixed('watch.attribute.int', 70, attribute('INT')), fixed('watch.attribute.rfl', 50, attribute('RFL')), fixed('watch.attribute.cha', -75, attribute('CHA')),
      fixed('watch.trait.connections', 100, trait('trait.connections', 'Connections')), fixed('watch.trait.dark-secret', -50, trait('trait.dark-secret', 'Dark Secret')), fixed('watch.trait.in-for-life', -100, trait('trait.in-for-life', 'In For Life')), fixed('watch.trait.reputation', -50, trait('trait.reputation', 'Reputation')),
      fixed('watch.skill.acting', 30, skill('skill.acting', 'Acting')), fixed('watch.skill.computers', 75, skill('skill.computers', 'Computers')), fixed('watch.skill.cryptography', 50, skill('skill.cryptography', 'Cryptography')), fixed('watch.skill.demolitions', 40, skill('skill.demolitions', 'Demolitions')), fixed('watch.skill.martial-arts', 75, skill('skill.martial-arts', 'Martial Arts')), fixed('watch.skill.perception', 75, skill('skill.perception', 'Perception')), fixed('watch.skill.protocol-affiliation', 50, skill('skill.protocol', 'Protocol/Affiliation', 'Affiliation')), fixed('watch.skill.small-arms', 80, skill('skill.small-arms', 'Small Arms')), fixed('watch.skill.stealth', 50, skill('skill.stealth', 'Stealth')), fixed('watch.skill.streetwise-affiliation', 50, skill('skill.streetwise', 'Streetwise/Affiliation', 'Affiliation')), { id: 'watch.skill.tracking-any', kind: 'any-skill-choice', xp: 80, skillId: 'skill.tracking', displayName: 'Tracking/Any', count: 1 },
      { id: 'watch.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 175, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Homeworld and Invader Clan branch awards are represented by the governed companion package.'], deferredRules: ['Branch-specific awards require an explicit affiliation-context choice.'],
  },
  {
    id: CLAN_SCIENTIST_CASTE_SERVICE_ID, displayName: 'Scientist Caste Service', stage: 4, kind: 'real-life', source: source(90, 'stage-4-scientist-caste-service'), costXp: 1200, chronologyYears: 4,
    prerequisites: [clanAffiliation('scientist-service.affiliation'), { id: 'scientist-service.caste', kind: 'clan-caste', casteId: 'scientist', description: 'Scientist caste' }],
    repeatPolicy: { sameModuleRepeat: 'allowed', repeatCost: 'full-module-cost', repeatAwards: { skills: 'repeat', flexibleXp: 'repeat', attributes: 'first-occurrence-only', traits: 'first-occurrence-only' } },
    awards: [fixed('scientist-service.attribute.int', 75, attribute('INT')), fixed('scientist-service.attribute.wil', 50, attribute('WIL')), fixed('scientist-service.attribute.bod', -75, attribute('BOD')), { id: 'scientist-service.trait-pair', kind: 'choice-package', description: 'Choose one source-defined Trait pair.', options: [[trait('trait.fast-learner', 'Fast Learner', { pairedWith: 'trait.combat-paralysis' }), trait('trait.combat-paralysis', 'Combat Paralysis')]] }, fixed('scientist-service.skill.acting', 50, skill('skill.acting', 'Acting')), fixed('scientist-service.skill.administration', 75, skill('skill.administration', 'Administration')), fixed('scientist-service.skill.career-scientist', 100, skill('skill.career', 'Career/Scientist', 'Scientist')), fixed('scientist-service.skill.computers', 70, skill('skill.computers', 'Computers')), fixed('scientist-service.skill.cryptography', 50, skill('skill.cryptography', 'Cryptography')), fixed('scientist-service.skill.interest-clan-genetics', 85, skill('skill.interest', 'Interest/Clan Genetics', 'Clan Genetics')), fixed('scientist-service.skill.investigation', 95, skill('skill.investigation', 'Investigation')), { id: 'scientist-service.skill.language-any', kind: 'language-choice', xp: 45, choicesFrom: 'any-language', description: 'Language/Any' }, fixed('scientist-service.skill.leadership', 35, skill('skill.leadership', 'Leadership')), { id: 'scientist-service.skill.medtech-any', kind: 'any-skill-choice', xp: 65, skillId: 'skill.medtech', displayName: 'MedTech/Any', count: 1 }, fixed('scientist-service.skill.perception', 85, skill('skill.perception', 'Perception')), fixed('scientist-service.skill.protocol-affiliation', 65, skill('skill.protocol', 'Protocol/Affiliation', 'Affiliation')), fixed('scientist-service.skill.protocol-clan', 35, skill('skill.protocol', 'Protocol/Any Clan', 'Clan')), { id: 'scientist-service.skill.science-any', kind: 'any-skill-choice', xp: 85, skillId: 'skill.science', displayName: 'Science/Any', count: 1 }, fixed('scientist-service.skill.training', 85, skill('skill.training', 'Training')), { id: 'scientist-service.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 50, allowedTargetTypes: ['attribute', 'trait', 'skill'] }],
    notes: ['The source requires one of two Trait pairs; the governed choice package must resolve before commitment.'], deferredRules: ['Natural Aptitude/Any Interest or Science Skill branch remains deferred until its concrete governed destination domain is available.'],
  },
]

export const DRACONIS_COMBINE_CATALOG_AWARDS = LIFE_MODULE_CATALOG.find((entry) => entry.id === DRACONIS_COMBINE_ID)?.awards ?? []
export const DRACONIS_SUB_AFFILIATION_CATALOG_AWARDS: Readonly<Record<string, LifeModuleAward[]>> = Object.fromEntries(
  LIFE_MODULE_CATALOG
    .filter((entry) => entry.id.startsWith(`${DRACONIS_COMBINE_ID}.`))
    .map((entry) => [entry.id, entry.awards]),
)

/** Source-backed package definitions are internal only; Clan player creation remains disabled. */
export const CONDITIONAL_LIFE_MODULE_PACKAGE_CATALOG: readonly ConditionalLifeModulePackageDefinition[] = [
  { id: CLAN_WATCH_OPERATIVE_BRANCH_PACKAGE_ID, displayName: 'Clan Watch Operative branch', source: source(84, 'stage-4-clan-watch-operative-branch'), eligibility: [clanAffiliation('watch-branch.affiliation')], choices: [
    { id: 'branch.homeworld-clan', displayName: 'Homeworld Clan', awards: [fixed('watch.homeworld.career-soldier', 60, skill('skill.career', 'Career/Soldier', 'Soldier')), fixed('watch.homeworld.interrogation', 50, skill('skill.interrogation', 'Interrogation')), fixed('watch.homeworld.investigation', 50, skill('skill.investigation', 'Investigation')), fixed('watch.homeworld.melee-weapons', 40, skill('skill.melee-weapons', 'Melee Weapons')), fixed('watch.homeworld.protocol-clan', 75, skill('skill.protocol', 'Protocol/Any Clan', 'Clan')), fixed('watch.homeworld.security-systems', 35, skill('skill.security-systems', 'Security Systems/Any', 'Any')), fixed('watch.homeworld.streetwise-homeworld', 50, skill('skill.streetwise', 'Streetwise/Any Homeworld Clan', 'Any Homeworld Clan')), fixed('watch.homeworld.survival', 25, skill('skill.survival', 'Survival/Any', 'Any')), fixed('watch.homeworld.technician', 40, skill('skill.technician', 'Technician/Any', 'Any'))], unsupportedReasons: ['Technician/Any and some open-subject domains remain deferred by the existing concrete Skill catalog.'] },
    { id: 'branch.invader-clan', displayName: 'Invader Clan', awards: [fixed('watch.invader.equipped', 50, trait('trait.equipped', 'Equipped')), fixed('watch.invader.dark-secret', -50, trait('trait.dark-secret', 'Dark Secret')), fixed('watch.invader.computers', 50, skill('skill.computers', 'Computers')), fixed('watch.invader.disguise', 35, skill('skill.disguise', 'Disguise')), fixed('watch.invader.interrogation', 75, skill('skill.interrogation', 'Interrogation')), fixed('watch.invader.investigation', 75, skill('skill.investigation', 'Investigation')), fixed('watch.invader.negotiation', 40, skill('skill.negotiation', 'Negotiation')), fixed('watch.invader.perception', 50, skill('skill.perception', 'Perception')), fixed('watch.invader.streetwise', 50, skill('skill.streetwise', 'Streetwise/Any Invader Clan or Inner Sphere', 'Any Invader Clan or Inner Sphere')), fixed('watch.invader.survival', 50, skill('skill.survival', 'Survival/Any', 'Any'))] },
  ] },
  { id: CLAN_SCIENTIST_CASTE_SERVICE_TRAIT_PACKAGE_ID, displayName: 'Scientist Caste Service Trait pair', source: source(90, 'stage-4-scientist-caste-service-traits'), eligibility: [clanAffiliation('scientist-service-trait.affiliation')], choices: [
    { id: 'traits.fast-learner-combat-paralysis', displayName: 'Fast Learner and Combat Paralysis', awards: [fixed('scientist-service.trait.fast-learner', 75, trait('trait.fast-learner', 'Fast Learner')), fixed('scientist-service.trait.combat-paralysis', -75, trait('trait.combat-paralysis', 'Combat Paralysis'))] },
    { id: 'traits.natural-aptitude-dark-secret', displayName: 'Natural Aptitude and Dark Secret', awards: [fixed('scientist-service.trait.dark-secret', -75, trait('trait.dark-secret', 'Dark Secret'))], unsupportedReasons: ['Natural Aptitude requires a supported concrete Interest or Science destination.'] },
  ] },
  { id: 'package.clan-apprenticeship-branch', displayName: 'Clan Apprenticeship branch', source: source(77, 'stage-2-clan-apprenticeship-branch'), eligibility: [clanAffiliation('package.affiliation')], choices: [
    { id: 'branch.aerospace', displayName: 'Aerospace', awards: [fixed('branch.aerospace.vehicle', 100, trait('trait.vehicle', 'Vehicle')), clanFieldGrant('apprenticeship.aerospace-field', CLAN_AEROSPACE_WARRIOR_FIELD_ID, 200, 50, 'advanced')], unsupportedReasons: ['Concrete Pilot Field follow-on choices remain outside this slice.'] },
    { id: 'branch.elemental', displayName: 'Elemental', awards: [fixed('branch.elemental.vehicle', 100, trait('trait.vehicle', 'Vehicle')), clanFieldGrant('apprenticeship.elemental-field', CLAN_ELEMENTAL_FIELD_ID, 280, 50, 'advanced')] },
    { id: 'branch.mechwarrior', displayName: 'MechWarrior', awards: [fixed('branch.mechwarrior.vehicle', 100, trait('trait.vehicle', 'Vehicle')), clanFieldGrant('apprenticeship.mechwarrior-field', CLAN_MECHWARRIOR_FIELD_ID, 240, 50, 'advanced')] },
  ] },
  { id: 'package.trueborn-sibko-branch', displayName: 'Trueborn Sibko branch', source: source(79, 'stage-2-trueborn-sibko-branch'), eligibility: [clanAffiliation('package.affiliation'), trueborn('package.trueborn')], choices: [
    { id: 'branch.aerospace', displayName: 'Aerospace', awards: [fixed('sibko.aerospace.vehicle', 100, trait('trait.vehicle', 'Vehicle')), clanFieldGrant('sibko.aerospace-field', CLAN_AEROSPACE_WARRIOR_FIELD_ID, 200, 50, 'advanced')] },
    { id: 'branch.elemental', displayName: 'Elemental', awards: [fixed('sibko.elemental.vehicle', 100, trait('trait.vehicle', 'Vehicle')), clanFieldGrant('sibko.elemental-field', CLAN_ELEMENTAL_FIELD_ID, 280, 50, 'advanced')] },
    { id: 'branch.mechwarrior', displayName: 'MechWarrior', awards: [fixed('sibko.mechwarrior.vehicle', 100, trait('trait.vehicle', 'Vehicle')), clanFieldGrant('sibko.mechwarrior-field', CLAN_MECHWARRIOR_FIELD_ID, 240, 50, 'advanced')] },
  ] },
]

export function getLifeModule(moduleId: string): LifeModuleDefinition {
  const module = LIFE_MODULE_CATALOG.find((entry) => entry.id === moduleId)
  if (!module) throw new Error(`Unknown Life Module ID: ${moduleId}`)
  return module
}

export function validateLifeModuleCatalog(catalog: readonly LifeModuleDefinition[] = LIFE_MODULE_CATALOG): LifeModuleCatalogValidationIssue[] {
  const issues: LifeModuleCatalogValidationIssue[] = []
  const ids = new Set<string>()
  for (const module of catalog) {
    if (!module.id || ids.has(module.id)) issues.push({ moduleId: module.id, message: `Duplicate or missing module ID: ${module.id || '(missing)'}` })
    ids.add(module.id)
    if (!module.displayName || !Number.isInteger(module.costXp) || module.costXp < 0 || !module.source.sourceId) {
      issues.push({ moduleId: module.id, message: 'Module name, non-negative whole cost, and source are required.' })
    }
    if (![0, 1, 2, 3, 4].includes(module.stage)) issues.push({ moduleId: module.id, message: 'Module stage is invalid.' })
    const canonicalStage3School = stage3SchoolClassification(module.id)
    if (module.stage === 3 && (!module.stage3School || JSON.stringify(module.stage3School) !== JSON.stringify(canonicalStage3School))) {
      issues.push({ moduleId: module.id, message: 'Stage 3 school requires its canonical stable-ID family classification.' })
    }
    if (module.stage !== 3 && module.stage3School) issues.push({ moduleId: module.id, message: 'Only Stage 3 schools may carry school-family classification.' })
    if (module.awards.length === 0) issues.push({ moduleId: module.id, message: 'At least one structured award is required.' })
    if (module.skillFieldSelection) {
      const fieldIds = new Set<string>()
      for (const offer of module.skillFieldSelection.offers) {
        if (!offer.fieldId || fieldIds.has(offer.fieldId) || !Number.isInteger(offer.costXpPerSkill) || offer.costXpPerSkill <= 0 || !Number.isInteger(offer.awardedXpPerSkill) || offer.awardedXpPerSkill <= 0 || !Number.isInteger(offer.chronologyYears * 2) || offer.chronologyYears <= 0) {
          issues.push({ moduleId: module.id, message: `Malformed or duplicate Skill Field offer: ${offer.fieldId || '(missing)'}` })
        }
        fieldIds.add(offer.fieldId)
      }
      const policy = module.skillFieldSelection
      const secondary = module.stage3School?.classification === 'secondary'
      if ((module.stage === 3 && policy.exactlyBasic !== 1) || (module.stage === 3 && policy.minimumAdvanced < (secondary ? 0 : 1)) || policy.maximumTotal < policy.exactlyBasic + policy.minimumAdvanced) {
        issues.push({ moduleId: module.id, message: 'Skill Field selection constraints are malformed.' })
      }
    }
    if (module.repeatPolicy && (
      !['allowed', 'deferred'].includes(module.repeatPolicy.sameModuleRepeat) ||
      module.repeatPolicy.repeatCost !== 'full-module-cost' ||
      module.repeatPolicy.repeatAwards.skills !== 'repeat' ||
      module.repeatPolicy.repeatAwards.flexibleXp !== 'repeat' ||
      module.repeatPolicy.repeatAwards.attributes !== 'first-occurrence-only' ||
      module.repeatPolicy.repeatAwards.traits !== 'first-occurrence-only'
    )) issues.push({ moduleId: module.id, message: 'Repeat policy metadata is malformed.' })
    const awardIds = new Set<string>()
    for (const award of module.awards) {
      const xp = award.kind === 'flexible-xp' ? (award.allocationMode === 'pool' ? award.totalXp : award.xpPerGrant) : 'xp' in award ? award.xp : 0
      if (!award.id || awardIds.has(award.id) || !Number.isFinite(xp)) issues.push({ moduleId: module.id, message: `Malformed or duplicate award: ${award.id || '(missing)'}` })
      awardIds.add(award.id)
      if (award.kind === 'fixed') {
        const destinationId = award.destination.type === 'attribute'
          ? award.destination.attributeId
          : award.destination.type === 'trait'
            ? award.destination.traitId
            : award.destination.address.skillId
        if (!destinationId) issues.push({ moduleId: module.id, message: `Fixed award ${award.id} has no destination ID.` })
      }
      if ((award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice' || award.kind === 'modeled-skill-choice' || (award.kind === 'flexible-xp' && award.allocationMode !== 'pool')) && (!Number.isInteger(award.count) || award.count <= 0)) {
        issues.push({ moduleId: module.id, message: `Choice award ${award.id} requires a positive whole grant count.` })
      }
      if (award.kind === 'flexible-xp' && award.allowedTargetTypes.length === 0) issues.push({ moduleId: module.id, message: `Flexible award ${award.id} requires allowed target types.` })
      if (award.kind === 'flexible-xp' && award.allocationMode === 'pool' && (!Number.isInteger(award.totalXp) || award.totalXp <= 0 || Object.values(award.maxXpPerTarget ?? {}).some((cap) => !Number.isInteger(cap) || cap! <= 0))) {
        issues.push({ moduleId: module.id, message: `Flexible pool ${award.id} requires a positive total and valid per-target caps.` })
      }
    }
  }
  return issues
}
