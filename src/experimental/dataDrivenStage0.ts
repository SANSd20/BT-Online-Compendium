import type { CharacterDefinition, ResolvedLifeModuleDestination } from '../domain/character/model'
import type { LifeModuleAward, LifeModuleDefinition, LifeModuleDestination } from '../domain/lifeModules/model'
import { FREE_WORLDS_LEAGUE_ID, FWL_ANDURIEN_ID, FWL_MARIK_COMMONWEALTH_ID, FWL_ORIENTE_ID, FWL_OTHER_WORLDS_ID, FWL_REGULUS_ID, FREE_WORLDS_LEAGUE_CONTEXT } from '../domain/lifeModules/affiliations'
import { LIFE_MODULE_RULES_SOURCE } from '../domain/lifeModules/catalog'
import { applyModule, applyUniversalStage0, resolvePendingLifeModuleAward } from '../engine/lifeModuleEngine'
import { dataDrivenRecordsFromArdExport } from './ardExportAdapter'

/**
 * Experimental consumer-side proof of concept. The source repository's legacy
 * Stage 0 records are normalized here without routing the production UI through
 * them. This deliberately stops at the FWL pilot boundary.
 */
export type DataDrivenStage0Choice = {
  language: string
  art?: string
  skillChoices?: Array<{ skillId: string; subject: string; displayName?: string }>
  traitId?: string
  skillOne?: string
  skillTwo?: string
  flexibleTargetType?: 'attribute' | 'trait' | 'skill'
  flexibleTargetId?: string
  flexibleXp?: number
}

export type DataDrivenRecord = {
  id: string
  displayName: string
  sourceRuleId: string
  costXp: number
  awards: LifeModuleAward[]
}

export function expandRepeatedModeledAwards(awards: readonly LifeModuleAward[]): LifeModuleAward[] {
  const deduplicated = [...new Map(awards.map((award) => [award.id, award])).values()]
  return deduplicated.flatMap((award) => award.kind === 'modeled-skill-choice' && award.count > 1
    ? Array.from({ length: award.count }, (_, index) => ({ ...award, id: `${award.id}/${index + 1}`, count: 1 }))
    : [award])
}

const skill = (skillId: string, subject: string | undefined, displayName: string): LifeModuleDestination => ({
  type: 'skill', address: { skillId, ...(subject ? { parameter: { kind: 'subskill' as const, value: subject } } : {}) }, displayName,
})
const trait = (traitId: string, displayName = traitId): LifeModuleDestination => ({ type: 'trait', traitId, displayName })
const attribute = (attributeId: string): LifeModuleDestination => ({ type: 'attribute', attributeId })

const fixedSkill = (id: string, xp: number, skillId: string, subject: string | undefined, displayName: string): LifeModuleAward => ({ id, kind: 'fixed', xp, destination: skill(skillId, subject, displayName) })

// Source inputs: AToW-Reference-Data legacy-data/Stage 0 - Affiliation/56 ...
// and legacy-data/Stage 0 - Sub-Affiliation/56 ... (printed p. 56).
export const LEGACY_FREE_WORLDS_LEAGUE_DATA: readonly DataDrivenRecord[] = [
  {
    id: FREE_WORLDS_LEAGUE_ID, displayName: 'Free Worlds League / House Marik', sourceRuleId: 'free-worlds-league', costXp: 150,
    awards: [{ id: 'fwl.skill.language-secondary', kind: 'language-choice', xp: 15, choicesFrom: 'fwl-languages', description: 'Choose one listed secondary language.' }, { id: 'fwl.skill.art', kind: 'any-skill-choice', xp: 10, skillId: 'skill.art', displayName: 'Art/Any', count: 1 }],
  },
  { id: FWL_ANDURIEN_ID, displayName: 'Duchy of Andurien', sourceRuleId: 'free-worlds-league-duchy-of-andurien', costXp: 0, awards: [{ id: 'andurien.attribute.wil', kind: 'fixed', xp: 50, destination: attribute('WIL') }, { id: 'andurien.trait.combat-sense', kind: 'fixed', xp: 215, destination: trait('trait.combat-sense', 'Combat Sense') }, { id: 'andurien.trait.hatred-capellan', kind: 'fixed', xp: -100, destination: { type: 'trait', traitId: 'trait.compulsion', displayName: 'Compulsion/Hatred of Capellan Confederation', parameters: { subject: 'Capellan Confederation' } } }, { id: 'andurien.trait.atrean', kind: 'fixed', xp: -50, destination: { type: 'trait', traitId: 'trait.compulsion', displayName: 'Compulsion/Atrean Opponent', parameters: { subject: 'Atrean Opponent' } } }, { id: 'andurien.trait.reputation', kind: 'fixed', xp: -30, destination: trait('trait.reputation', 'Reputation') }, fixedSkill('andurien.skill.negotiation', 15, 'skill.negotiation', undefined, 'Negotiation'), fixedSkill('andurien.skill.perception', 10, 'skill.perception', undefined, 'Perception'), fixedSkill('andurien.skill.protocol', 15, 'skill.protocol', 'Free Worlds League', 'Protocol/Free Worlds League')] },
  { id: FWL_ORIENTE_ID, displayName: 'Duchy of Oriente', sourceRuleId: 'free-worlds-league-duchy-of-oriente', costXp: 0, awards: [{ id: 'oriente.trait.reputation', kind: 'fixed', xp: 100, destination: trait('trait.reputation', 'Reputation') }, fixedSkill('oriente.skill.appraisal', 5, 'skill.appraisal', undefined, 'Appraisal'), fixedSkill('oriente.skill.negotiation', 15, 'skill.negotiation', undefined, 'Negotiation'), { id: 'oriente.skill.technician', kind: 'any-skill-choice', xp: 5, skillId: 'skill.technician', displayName: 'Technician/Any', count: 1 }] },
  { id: FWL_MARIK_COMMONWEALTH_ID, displayName: 'Marik Commonwealth', sourceRuleId: 'free-worlds-league-marik-commonwealth', costXp: 0, awards: [{ id: 'marik.trait.wealth', kind: 'fixed', xp: 100, destination: trait('trait.wealth', 'Wealth') }, { id: 'marik.trait.equipped', kind: 'fixed', xp: 100, destination: trait('trait.equipped', 'Equipped') }, { id: 'marik.trait.reputation', kind: 'fixed', xp: -100, destination: trait('trait.reputation', 'Reputation') }, fixedSkill('marik.skill.appraisal', 5, 'skill.appraisal', undefined, 'Appraisal'), fixedSkill('marik.skill.negotiation', 10, 'skill.negotiation', undefined, 'Negotiation'), fixedSkill('marik.skill.protocol', 10, 'skill.protocol', 'Free Worlds League', 'Protocol/Free Worlds League')] },
  { id: FWL_REGULUS_ID, displayName: 'Principality of Regulus', sourceRuleId: 'free-worlds-league-principality-of-regulus', costXp: 0, awards: [{ id: 'regulus.attribute.wil', kind: 'fixed', xp: 75, destination: attribute('WIL') }, { id: 'regulus.trait.gregarious', kind: 'fixed', xp: 75, destination: trait('trait.gregarious', 'Gregarious') }, { id: 'regulus.trait.atrean', kind: 'fixed', xp: -50, destination: { type: 'trait', traitId: 'trait.compulsion', displayName: 'Compulsion/Atrean Opponent', parameters: { subject: 'Atrean Opponent' } } }, { id: 'regulus.trait.reputation', kind: 'fixed', xp: -50, destination: trait('trait.reputation', 'Reputation') }, fixedSkill('regulus.skill.interest', 20, 'skill.interest', 'Regulan History', 'Interest/Regulan History'), fixedSkill('regulus.skill.negotiation', 25, 'skill.negotiation', undefined, 'Negotiation'), fixedSkill('regulus.skill.perception', 15, 'skill.perception', undefined, 'Perception'), fixedSkill('regulus.skill.protocol', 15, 'skill.protocol', 'Free Worlds League', 'Protocol/Free Worlds League')] },
  { id: FWL_OTHER_WORLDS_ID, displayName: 'Other FWL Worlds', sourceRuleId: 'free-worlds-league-other-worlds', costXp: 0, awards: [{ id: 'other-fwl.appraisal', kind: 'fixed', xp: 15, destination: skill('skill.appraisal', undefined, 'Appraisal') }, { id: 'other-fwl.protocol', kind: 'fixed', xp: 10, destination: skill('skill.protocol', 'Free Worlds League', 'Protocol/Free Worlds League') }, { id: 'other-fwl.language', kind: 'language-choice', xp: 20, choicesFrom: 'fwl-languages', description: 'Choose one Language/Any.' }, { id: 'other-fwl.flexible', kind: 'flexible-xp', allocationMode: 'pool', totalXp: 25, allowedTargetTypes: ['attribute', 'trait', 'skill'] }, { id: 'other-fwl.trait', kind: 'flexible-xp', xpPerGrant: 35, count: 1, allowedTargetTypes: ['trait'] }, { id: 'other-fwl.skills', kind: 'modeled-skill-choice', xp: 10, count: 2, displayName: 'Choose two other Skills', distinct: true }] },
]

/** The generated ARD export is the operative ARE catalog. */
export const FREE_WORLDS_LEAGUE_DATA: readonly DataDrivenRecord[] = dataDrivenRecordsFromArdExport()

export function applyDataDrivenStage0Package(character: CharacterDefinition, contextId: string, choices: DataDrivenStage0Choice, records: readonly DataDrivenRecord[] = FREE_WORLDS_LEAGUE_DATA): CharacterDefinition {
  const record = records.find((entry) => entry.id === contextId)
  if (!record) throw new Error(`No data-driven Stage 0 record exists for ${contextId}.`)
  const language = choices.language.trim()
  if (!language) throw new Error('A data-driven Stage 0 language choice is required.')
  const parent = records.find((entry) => entry.id === FREE_WORLDS_LEAGUE_ID)!
  const selected = record.id === FREE_WORLDS_LEAGUE_ID ? parent : record
  const normalizedAwards = record.id === FREE_WORLDS_LEAGUE_ID ? parent.awards : [...parent.awards, ...selected.awards]
  const expandedAwards = expandRepeatedModeledAwards(normalizedAwards)
  const awards = expandedAwards.map((award): LifeModuleAward => {
    if (award.id === 'fwl.skill.language-secondary') return { id: award.id, kind: 'fixed', xp: 15, destination: skill('skill.language', language, `Language/${language}`) }
    if (award.id === 'other-fwl.language') return { id: award.id, kind: 'fixed', xp: 20, destination: skill('skill.language', choices.language, `Language/${choices.language}`) }
    if (award.id === 'fwl.skill.art') return { id: award.id, kind: 'fixed', xp: 10, destination: skill('skill.art', choices.art ?? 'Painting', `Art/${choices.art ?? 'Painting'}`) }
    if (award.id === 'other.attribute.any') return { id: award.id, kind: 'fixed', xp: choices.flexibleTargetType === 'attribute' ? choices.flexibleXp ?? 35 : 35, destination: attribute(choices.flexibleTargetId ?? 'INT') }
    return award
  })
  const module: LifeModuleDefinition = { id: selected.id, displayName: selected.displayName, stage: 0, kind: 'affiliation', source: { ...LIFE_MODULE_RULES_SOURCE, ruleId: record.sourceRuleId }, costXp: selected.costXp + (record.id === FREE_WORLDS_LEAGUE_ID ? 150 : 0), prerequisites: [], awards, notes: ['Experimental data-driven Stage 0 proof of concept.'], deferredRules: [] }
  let next = applyModule(character, module, {})
  const repeatedSkillAward = expandedAwards.find((award) => award.kind === 'modeled-skill-choice' && award.id.endsWith('/1'))
  if (repeatedSkillAward) {
    const resolve = (idPrefix: string, destination: ResolvedLifeModuleDestination, xp?: number) => { const pending = next.creation.lifeModules?.pendingAwards.find((entry) => entry.awardId === idPrefix || entry.awardId.startsWith(`${idPrefix}/`)); if (!pending) return; next = resolvePendingLifeModuleAward(next, pending.id, destination, xp) }
    const skillChoices = choices.skillChoices ?? [
      { skillId: 'skill.art', subject: choices.skillOne?.split('|')[1] ?? 'Painting', displayName: `Art/${choices.skillOne?.split('|')[1] ?? 'Painting'}` },
      { skillId: 'skill.protocol', subject: choices.skillTwo?.split('|')[1] ?? 'Free Worlds League', displayName: `Protocol/${choices.skillTwo?.split('|')[1] ?? 'Free Worlds League'}` },
    ]
    for (const choice of skillChoices) resolve(repeatedSkillAward.id.slice(0, -2), { type: 'skill', targetId: choice.skillId, parameter: { kind: 'subskill', value: choice.subject }, displayName: choice.displayName ?? `${choice.skillId}/${choice.subject}` })
    const flexible = expandedAwards.find((award) => award.kind === 'flexible-xp' && award.allocationMode === 'pool')
    if (flexible) resolve(flexible.id, choices.flexibleTargetType === 'skill' ? { type: 'skill', targetId: 'skill.protocol', displayName: choices.flexibleTargetId ?? 'Skill' } : { type: choices.flexibleTargetType === 'trait' ? 'trait' : 'attribute', targetId: choices.flexibleTargetId ?? 'INT', displayName: choices.flexibleTargetId ?? 'INT' }, choices.flexibleXp ?? 25)
  }
  const provenanceId = next.lifeModuleHistory.at(-1)?.provenanceIds[0]
  if (!provenanceId) throw new Error('Data-driven Stage 0 provenance was not recorded.')
  next.affiliations.push({ affiliationId: FREE_WORLDS_LEAGUE_CONTEXT.affiliationId, role: 'birth', provenanceId }, { affiliationId: FREE_WORLDS_LEAGUE_CONTEXT.affiliationId, role: 'final', provenanceId })
  next.creation.lifeModules!.stage0SubAffiliation = record.id === FREE_WORLDS_LEAGUE_ID ? 'no' : record.id
  next.creation.lifeModules!.phase = 'stage-1-selection'; next.creation.lifeModules!.currentStage = 1
  return next
}

export { applyUniversalStage0 }
