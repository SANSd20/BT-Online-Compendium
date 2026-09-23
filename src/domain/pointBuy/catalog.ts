import type { SourceCitation } from '../rules/model'

export interface PointBuySkillDefinition {
  id: string
  displayName: string
  parameter?: { kind: 'subskill'; label: string; required: true }
}

export interface PointBuyTraitDefinition {
  id: string
  displayName: string
  allowedTp: readonly number[]
  identityBound: boolean
  parameter?: { key: string; label: string; required: true }
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
  { id: 'skill.perception', displayName: 'Perception' },
  { id: 'skill.language', displayName: 'Language', parameter: { kind: 'subskill', label: 'Language', required: true } },
  { id: 'skill.martial-arts', displayName: 'Martial Arts' },
  { id: 'skill.small-arms', displayName: 'Small Arms' },
  { id: 'skill.technician', displayName: 'Technician', parameter: { kind: 'subskill', label: 'Technician field', required: true } },
]

export const POINT_BUY_TRAITS: readonly PointBuyTraitDefinition[] = [
  { id: 'trait.ambidextrous', displayName: 'Ambidextrous', allowedTp: [2], identityBound: false },
  { id: 'trait.patient', displayName: 'Patient', allowedTp: [1], identityBound: false },
  { id: 'trait.unattractive', displayName: 'Unattractive', allowedTp: [-1], identityBound: true },
  { id: 'trait.reputation', displayName: 'Reputation', allowedTp: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], identityBound: true, parameter: { key: 'scope', label: 'Reputation scope or reason', required: true } },
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
