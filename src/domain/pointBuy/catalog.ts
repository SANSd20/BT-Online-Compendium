import type { SourceCitation } from '../rules/model'

export interface PointBuySkillDefinition {
  id: string
  displayName: string
  parameter?: { kind: 'subskill'; label: string; required: true }
  sourcePage?: number
  linkedAttributes?: readonly string[]
  specialties?: 'source-described' | 'unsupported'
}

export interface PointBuyTraitDefinition {
  id: string
  displayName: string
  allowedTp: readonly number[]
  identityBound: boolean
  parameter?: { key: string; label: string; required: true }
  sourcePage?: number
  category?: 'positive' | 'negative' | 'flexible' | 'neutral'
  multiple?: boolean
  vehicle?: boolean
}

export const POINT_BUY_RULES_SOURCE: SourceCitation = {
  sourceId: 'atow-core-corrected-third',
  edition: 'Corrected Third Printing',
  page: 51,
  ruleId: 'point-buy-character-creation',
}

export const XP_COST_TABLE_SOURCE: SourceCitation = {
  sourceId: 'atow-core-corrected-third',
  edition: 'Corrected Third Printing',
  page: 60,
  ruleId: 'experience-point-costs-table',
}

export const POINT_BUY_ATTRIBUTE_MAXIMUMS: Readonly<Record<string, number>> = {
  STR: 8,
  BOD: 8,
  DEX: 8,
  RFL: 8,
  INT: 8,
  WIL: 8,
  CHA: 9,
  EDG: 9,
}

export const STANDARD_SKILL_XP_COSTS = [20, 30, 50, 80, 120, 170, 230, 300, 380, 470, 570] as const

export const POINT_BUY_SKILLS: readonly PointBuySkillDefinition[] = [
  { id: 'skill.acrobatics', displayName: 'Acrobatics', sourcePage: 141 },
  { id: 'skill.acting', displayName: 'Acting', sourcePage: 142 },
  { id: 'skill.administration', displayName: 'Administration', sourcePage: 143 },
  { id: 'skill.appraisal', displayName: 'Appraisal', sourcePage: 143 },
  { id: 'skill.art', displayName: 'Art', sourcePage: 144 },
  { id: 'skill.artillery', displayName: 'Artillery', sourcePage: 144 },
  { id: 'skill.climbing', displayName: 'Climbing', sourcePage: 144 },
  { id: 'skill.computers', displayName: 'Computers', sourcePage: 145 },
  { id: 'skill.cryptography', displayName: 'Cryptography', sourcePage: 145 },
  { id: 'skill.demolitions', displayName: 'Demolitions', sourcePage: 146 },
  { id: 'skill.disguise', displayName: 'Disguise', sourcePage: 146 },
  { id: 'skill.escape-artist', displayName: 'Escape Artist', sourcePage: 147 },
  { id: 'skill.forgery', displayName: 'Forgery', sourcePage: 147 },
  { id: 'skill.interrogation', displayName: 'Interrogation', sourcePage: 148 },
  { id: 'skill.investigation', displayName: 'Investigation', sourcePage: 148 },
  { id: 'skill.leadership', displayName: 'Leadership', sourcePage: 148 },
  { id: 'skill.martial-arts', displayName: 'Martial Arts', sourcePage: 149 },
  { id: 'skill.melee-weapons', displayName: 'Melee Weapons', sourcePage: 149 },
  { id: 'skill.negotiation', displayName: 'Negotiation', sourcePage: 150 },
  { id: 'skill.perception', displayName: 'Perception', sourcePage: 151 },
  { id: 'skill.prestidigitation', displayName: 'Prestidigitation', sourcePage: 152 },
  { id: 'skill.running', displayName: 'Running', sourcePage: 153 },
  { id: 'skill.science', displayName: 'Science', sourcePage: 153 },
  { id: 'skill.small-arms', displayName: 'Small Arms', sourcePage: 153 },
  { id: 'skill.stealth', displayName: 'Stealth', sourcePage: 154 },
  { id: 'skill.strategy', displayName: 'Strategy', sourcePage: 154 },
  { id: 'skill.surgery', displayName: 'Surgery', sourcePage: 154 },
  { id: 'skill.survival', displayName: 'Survival', sourcePage: 156 },
  { id: 'skill.swimming', displayName: 'Swimming', sourcePage: 156 },
  { id: 'skill.tactics', displayName: 'Tactics', sourcePage: 156 },
  { id: 'skill.training', displayName: 'Training', sourcePage: 159 },
  { id: 'skill.zero-g-operations', displayName: 'Zero-G Operations', sourcePage: 159 },
  { id: 'skill.language', displayName: 'Language', parameter: { kind: 'subskill', label: 'Language', required: true }, sourcePage: 148 },
  { id: 'skill.technician', displayName: 'Technician', parameter: { kind: 'subskill', label: 'Technician field', required: true }, sourcePage: 157 },
]

export const POINT_BUY_TRAITS: readonly PointBuyTraitDefinition[] = [
  { id: 'trait.ambidextrous', displayName: 'Ambidextrous', allowedTp: [2], identityBound: false, sourcePage: 108, category: 'positive' },
  { id: 'trait.animal-antipathy', displayName: 'Animal Antipathy', allowedTp: [-1], identityBound: false, sourcePage: 110, category: 'negative' },
  { id: 'trait.animal-empathy', displayName: 'Animal Empathy', allowedTp: [1], identityBound: false, sourcePage: 110, category: 'positive' },
  { id: 'trait.attractive', displayName: 'Attractive', allowedTp: [2], identityBound: false, sourcePage: 110, category: 'positive' },
  { id: 'trait.combat-paralysis', displayName: 'Combat Paralysis', allowedTp: [-4], identityBound: false, sourcePage: 112, category: 'negative' },
  { id: 'trait.combat-sense', displayName: 'Combat Sense', allowedTp: [4], identityBound: false, sourcePage: 112, category: 'positive' },
  { id: 'trait.fast-learner', displayName: 'Fast Learner', allowedTp: [3], identityBound: false, sourcePage: 117, category: 'positive' },
  { id: 'trait.fit', displayName: 'Fit', allowedTp: [2], identityBound: false, sourcePage: 117, category: 'positive' },
  { id: 'trait.g-tolerance', displayName: 'G-Tolerance', allowedTp: [1], identityBound: false, sourcePage: 118, category: 'positive' },
  { id: 'trait.glass-jaw', displayName: 'Glass Jaw', allowedTp: [-3], identityBound: false, sourcePage: 118, category: 'negative' },
  { id: 'trait.good-hearing', displayName: 'Good Hearing', allowedTp: [1], identityBound: false, sourcePage: 118, category: 'positive' },
  { id: 'trait.good-vision', displayName: 'Good Vision', allowedTp: [1], identityBound: false, sourcePage: 118, category: 'positive' },
  { id: 'trait.gregarious', displayName: 'Gregarious', allowedTp: [1], identityBound: false, sourcePage: 118, category: 'positive' },
  { id: 'trait.gremlins', displayName: 'Gremlins', allowedTp: [-3], identityBound: false, sourcePage: 118, category: 'negative' },
  { id: 'trait.illiterate', displayName: 'Illiterate', allowedTp: [-1], identityBound: false, sourcePage: 119, category: 'negative' },
  { id: 'trait.impatient', displayName: 'Impatient', allowedTp: [-1], identityBound: false, sourcePage: 119, category: 'negative' },
  { id: 'trait.introvert', displayName: 'Introvert', allowedTp: [-1], identityBound: false, sourcePage: 121, category: 'negative' },
  { id: 'trait.lost-limb', displayName: 'Lost Limb', allowedTp: [-5, -4, -3, -2, -1], identityBound: false, sourcePage: 121, category: 'negative' },
  { id: 'trait.pain-resistance', displayName: 'Pain Resistance', allowedTp: [3], identityBound: false, sourcePage: 121, category: 'positive' },
  { id: 'trait.patient', displayName: 'Patient', allowedTp: [1], identityBound: false, sourcePage: 121, category: 'positive' },
  { id: 'trait.poison-resistance', displayName: 'Poison Resistance', allowedTp: [2], identityBound: false, sourcePage: 122, category: 'positive' },
  { id: 'trait.poor-hearing', displayName: 'Poor Hearing', allowedTp: [-5, -4, -3, -2, -1], identityBound: false, sourcePage: 122, category: 'negative' },
  { id: 'trait.poor-vision', displayName: 'Poor Vision', allowedTp: [-9, -8, -7, -6, -5, -4, -3, -2], identityBound: false, sourcePage: 122, category: 'negative' },
  { id: 'trait.reputation', displayName: 'Reputation', allowedTp: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], identityBound: true, parameter: { key: 'scope', label: 'Reputation scope or reason', required: true }, sourcePage: 124, category: 'flexible', multiple: true },
  { id: 'trait.sixth-sense', displayName: 'Sixth Sense', allowedTp: [4], identityBound: false, sourcePage: 125, category: 'positive' },
  { id: 'trait.slow-learner', displayName: 'Slow Learner', allowedTp: [-3], identityBound: false, sourcePage: 125, category: 'negative' },
  { id: 'trait.tech-empathy', displayName: 'Tech Empathy', allowedTp: [3], identityBound: false, sourcePage: 125, category: 'positive' },
  { id: 'trait.toughness', displayName: 'Toughness', allowedTp: [3], identityBound: false, sourcePage: 127, category: 'positive' },
  { id: 'trait.unlucky', displayName: 'Unlucky', allowedTp: [-10, -9, -8, -7, -6, -5, -4, -3, -2], identityBound: false, sourcePage: 128, category: 'negative' },
  { id: 'trait.unattractive', displayName: 'Unattractive', allowedTp: [-1], identityBound: true, sourcePage: 128, category: 'negative' },
  { id: 'trait.exceptional-attribute', displayName: 'Exceptional Attribute', allowedTp: [2], identityBound: false, parameter: { key: 'attribute', label: 'Attribute', required: true }, sourcePage: 116, category: 'positive', multiple: true },
  { id: 'trait.phenotype', displayName: 'Phenotype', allowedTp: [0], identityBound: false, sourcePage: 121, category: 'neutral' },
]

export function standardSkillXpCost(level: number | null): number {
  if (level === null) return 0
  if (!Number.isInteger(level) || level < 0 || level >= STANDARD_SKILL_XP_COSTS.length) {
    throw new RangeError('Point Buy Skill level must be null or an integer from 0 through 10.')
  }
  return STANDARD_SKILL_XP_COSTS[level]
}

export function getPointBuySkill(skillId: string): PointBuySkillDefinition {
  const definition = POINT_BUY_SKILLS.find((entry) => entry.id === skillId)
  if (!definition) throw new Error(`Unknown Point Buy Skill ID: ${skillId}`)
  return definition
}

export function getPointBuyTrait(traitId: string): PointBuyTraitDefinition {
  const definition = POINT_BUY_TRAITS.find((entry) => entry.id === traitId)
  if (!definition) throw new Error(`Unknown Point Buy Trait ID: ${traitId}`)
  return definition
}
