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
    if (!module.displayName || !Number.isInteger(module.costXp) || module.costXp < 0 || !module.source.sourceId || !module.source.page) {
      issues.push({ moduleId: module.id, message: 'Module name, non-negative whole cost, and source are required.' })
    }
    if (![0, 1, 2, 3, 4].includes(module.stage)) issues.push({ moduleId: module.id, message: 'Module stage is invalid.' })
    if (module.awards.length === 0) issues.push({ moduleId: module.id, message: 'At least one structured award is required.' })
    const awardIds = new Set<string>()
    for (const award of module.awards) {
      const xp = award.kind === 'flexible-xp' ? award.xpPerGrant : 'xp' in award ? award.xp : 0
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
      if ((award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice' || award.kind === 'flexible-xp') && (!Number.isInteger(award.count) || award.count <= 0)) {
        issues.push({ moduleId: module.id, message: `Choice award ${award.id} requires a positive whole grant count.` })
      }
      if (award.kind === 'flexible-xp' && award.allowedTargetTypes.length === 0) issues.push({ moduleId: module.id, message: `Flexible award ${award.id} requires allowed target types.` })
    }
  }
  return issues
}
