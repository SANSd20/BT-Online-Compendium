import type { SourceCitation } from '../rules/model'
import type { LifeModuleAward, LifeModuleCatalogValidationIssue, LifeModuleDefinition, LifeModuleDestination } from './model'
import { CAPELLAN_COMMONALITY_CONTEXT, CAPELLAN_COMMONALITY_ID, COMSTAR_ORDER_ID, FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT, FEDERATED_SUNS_CRUCIS_MARCH_ID, UNIVERSAL_LIFE_MODULE_CONTEXT, UNIVERSAL_STAGE_0_ID, WORD_OF_BLAKE_ORDER_ID } from './affiliations'
import { ANALYSIS_FIELD_ID, ANTHROPOLOGIST_FIELD_ID, ARCHAEOLOGIST_FIELD_ID, BASIC_TRAINING_FIELD_ID, BASIC_TRAINING_NAVAL_FIELD_ID, CARTOGRAPHER_FIELD_ID, CAVALRY_FIELD_ID, COMMUNICATIONS_FIELD_ID, COVERT_OPERATIONS_FIELD_ID, DETECTIVE_FIELD_ID, DOCTOR_FIELD_ID, ENGINEER_FIELD_ID, GENERAL_STUDIES_FIELD_ID, INFANTRY_FIELD_ID, INTELLIGENCE_FIELD_ID, JOURNALIST_FIELD_ID, LAWYER_FIELD_ID, MANAGER_FIELD_ID, MARINE_FIELD_ID, MECHWARRIOR_FIELD_ID, MEDICAL_ASSISTANT_FIELD_ID, MERCHANT_FIELD_ID, MERCHANT_MARINE_FIELD_ID, MILITARY_SCIENTIST_FIELD_ID, OFFICER_FIELD_ID, PLANETARY_SURVEYOR_FIELD_ID, PILOT_AIRCRAFT_CIVILIAN_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID, PILOT_DROPSHIP_FIELD_ID, PILOT_JUMPSHIP_FIELD_ID, PILOT_WARSHIP_FIELD_ID, POLICE_OFFICER_FIELD_ID, POLICE_TACTICAL_OFFICER_FIELD_ID, POLITICIAN_FIELD_ID, SCIENTIST_FIELD_ID, SCOUT_FIELD_ID, SHIPS_CREW_FIELD_ID, SPECIAL_FORCES_FIELD_ID, TECHNICIAN_AEROSPACE_FIELD_ID, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_MECH_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID } from '../skillFields/catalog'
import { OFFICER_TRAINING_SCHOOL_ID, stage3SchoolClassification } from './stage3Schooling'
import { INFANTRY_ANTI_MECH_FIELD_ID } from '../skillFields/catalog'
import { PILOT_AEROSPACE_CIVILIAN_FIELD_ID, PILOT_AEROSPACE_COMBAT_FIELD_ID, PILOT_AIRCRAFT_COMBAT_FIELD_ID } from '../skillFields/catalog'
import { HPG_TECHNICIAN_FIELD_ID } from '../skillFields/catalog'

export { CAPELLAN_COMMONALITY_ID, COMSTAR_ORDER_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID, UNIVERSAL_STAGE_0_ID, WORD_OF_BLAKE_ORDER_ID } from './affiliations'
export { OFFICER_TRAINING_SCHOOL_ID } from './stage3Schooling'

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

export const BLUE_COLLAR_ID = 'stage1.blue-collar'
export const BACK_WOODS_ID = 'stage1.back-woods'
export const STAGE_2_BACK_WOODS_ID = 'stage2.back-woods'
export const STAGE_2_HIGH_SCHOOL_ID = 'stage2.high-school'
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

export const LIFE_MODULE_CATALOG: readonly LifeModuleDefinition[] = [
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
      if (policy.exactlyBasic !== 1 || policy.minimumAdvanced < (secondary ? 0 : 1) || policy.maximumTotal < policy.exactlyBasic + policy.minimumAdvanced) {
        issues.push({ moduleId: module.id, message: 'Skill Field selection constraints are malformed.' })
      }
    }
    if (module.repeatPolicy && (
      module.repeatPolicy.sameModuleRepeat !== 'deferred' ||
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
