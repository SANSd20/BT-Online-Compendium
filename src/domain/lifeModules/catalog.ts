import type { SourceCitation } from '../rules/model'
import type { LifeModuleAward, LifeModuleCatalogValidationIssue, LifeModuleDefinition, LifeModuleDestination } from './model'

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

export const UNIVERSAL_STAGE_0_ID = 'stage0.universal-fixed-xp'
export const CAPELLAN_COMMONALITY_ID = 'stage0.capellan-confederation.capellan-commonality'
export const BLUE_COLLAR_ID = 'stage1.blue-collar'
export const BACK_WOODS_ID = 'stage1.back-woods'
export const STAGE_2_BACK_WOODS_ID = 'stage2.back-woods'
export const STAGE_2_HIGH_SCHOOL_ID = 'stage2.high-school'
export const TECHNICAL_COLLEGE_ID = 'stage3.technical-college'
export const AGITATOR_ID = 'stage4.agitator'

export const LIFE_MODULE_CATALOG: readonly LifeModuleDefinition[] = [
  {
    id: UNIVERSAL_STAGE_0_ID,
    displayName: 'Universal Fixed Experience Points',
    stage: 0,
    kind: 'universal',
    source: source(62, 'stage-0-universal-fixed-experience-points'),
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
    source: source(64, 'capellan-confederation-capellan-commonality'),
    costXp: 150,
    primaryLanguage: 'Mandarin Chinese',
    secondaryLanguages: ['Russian', 'Cantonese', 'Vietnamese', 'English'],
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
      { id: 'back-woods.language.affiliation', kind: 'language-choice', xp: -5, choicesFrom: 'affiliation-languages', description: 'Apply to the concrete Language/Affiliation selection.' },
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
      { id: 'stage2.back-woods.skill.protocol-affiliation', kind: 'affiliation-skill-choice', xp: -15, skillId: 'skill.protocol', displayName: 'Protocol/Affiliation', description: 'Apply to the concrete affiliation Protocol subskill.' },
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
      { id: 'high-school.language-affiliation', kind: 'language-choice', xp: 10, choicesFrom: 'affiliation-languages', description: 'Apply to a concrete Language/Affiliation selection.' },
      { id: 'high-school.streetwise-affiliation', kind: 'affiliation-skill-choice', xp: 20, skillId: 'skill.streetwise', displayName: 'Streetwise/Affiliation', description: 'Apply to the concrete affiliation Streetwise subskill.' },
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
    source: sourceWithoutPage('stage-3-technical-college'),
    costXp: 600,
    prerequisites: [],
    skillFieldSelection: {
      offers: [
        { fieldId: 'field.technician-civilian', category: 'basic', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 1 },
        { fieldId: 'field.technician-vehicle', category: 'advanced', costXpPerSkill: 24, awardedXpPerSkill: 30, chronologyYears: 2 },
      ],
      exactlyBasic: 1,
      minimumAdvanced: 1,
      maximumTotal: 3,
    },
    awards: [
      fixed('technical-college.attribute.dex', 100, attribute('DEX')),
      fixed('technical-college.attribute.int', 100, attribute('INT')),
      fixed('technical-college.trait.equipped', 150, trait('trait.equipped', 'Equipped')),
      fixed('technical-college.skill.computers', 20, skill('skill.computers', 'Computers')),
      { id: 'technical-college.interest', kind: 'any-skill-choice', xp: 30, skillId: 'skill.interest', displayName: 'Interest/Any', count: 1 },
      { id: 'technical-college.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 200, allowedTargetTypes: ['attribute', 'trait', 'skill'] },
    ],
    notes: ['Civilian Stage 3 school. Base cost is 600 XP plus selected Skill Field costs.'],
    deferredRules: ['Repeated Stage 3 schooling is not supported in Alpha Slice 9.'],
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
      { id: 'agitator.skill.streetwise-affiliation', kind: 'affiliation-skill-choice', xp: 75, skillId: 'skill.streetwise', displayName: 'Streetwise/Affiliation', description: 'Apply to the concrete affiliation Streetwise subskill.' },
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
    if (module.awards.length === 0) issues.push({ moduleId: module.id, message: 'At least one structured award is required.' })
    if (module.skillFieldSelection) {
      const fieldIds = new Set<string>()
      for (const offer of module.skillFieldSelection.offers) {
        if (!offer.fieldId || fieldIds.has(offer.fieldId) || !Number.isInteger(offer.costXpPerSkill) || offer.costXpPerSkill <= 0 || !Number.isInteger(offer.awardedXpPerSkill) || offer.awardedXpPerSkill <= 0 || !Number.isInteger(offer.chronologyYears) || offer.chronologyYears <= 0) {
          issues.push({ moduleId: module.id, message: `Malformed or duplicate Skill Field offer: ${offer.fieldId || '(missing)'}` })
        }
        fieldIds.add(offer.fieldId)
      }
      const policy = module.skillFieldSelection
      if (policy.exactlyBasic !== 1 || policy.minimumAdvanced < 1 || policy.maximumTotal < policy.exactlyBasic + policy.minimumAdvanced) {
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
      if ((award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice' || (award.kind === 'flexible-xp' && award.allocationMode !== 'pool')) && (!Number.isInteger(award.count) || award.count <= 0)) {
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
