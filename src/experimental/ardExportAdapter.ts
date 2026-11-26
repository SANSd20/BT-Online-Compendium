import artifact from './generated/fwl-export.json'
import type { LifeModuleAward, LifeModuleDestination } from '../domain/lifeModules/model'
import { FREE_WORLDS_LEAGUE_ID, FWL_ANDURIEN_ID, FWL_MARIK_COMMONWEALTH_ID, FWL_ORIENTE_ID, FWL_OTHER_WORLDS_ID, FWL_REGULUS_ID } from '../domain/lifeModules/affiliations'
import type { DataDrivenStage0Choice } from './dataDrivenStage0'
import type { ChoiceGrant, ChoiceState } from './choiceEditing'

export const EXPECTED_ARD_REVISION = 'c83652c36cb5078aaadc072dea5f57dcad1fd563'
export const EXPECTED_ARD_DIGEST = 'e48a2b5859fbf2bca453a901908a7c2102a38d5bfa05d5a90d06c0d09f6f51e9'

type ExportRecord = typeof artifact.records[number]
export type ArdFwlExport = typeof artifact

export function validateArdFwlExport(value: ArdFwlExport = artifact): void {
  if (value.exportFormatVersion !== '0.1.0' || value.canonicalSchemaVersion !== '0.4a') throw new Error('Unsupported ARD FWL export version.')
  if (value.referenceRepository.revision !== EXPECTED_ARD_REVISION) throw new Error('Unexpected ARD reference revision.')
  if (value.contentDigest !== EXPECTED_ARD_DIGEST) throw new Error('ARD FWL export digest mismatch.')
  if (value.records.length !== 6 || value.records.slice(1).some((record) => record.parentId !== value.records[0]?.id)) throw new Error('ARD FWL export context or parent relationship is incomplete.')
}

const skill = (id: string, subject: string | undefined, displayName: string): LifeModuleDestination => ({ type: 'skill', address: { skillId: id, ...(subject ? { parameter: { kind: 'subskill' as const, value: subject } } : {}) }, displayName })
const convertAward = (award: ExportRecord['awards'][number], record: ExportRecord): LifeModuleAward => {
  if (award.kind === 'attribute') return { id: award.target === 'ANY' ? 'other.attribute.any' : `${record.id}.${award.kind}.${award.target}`, kind: 'fixed', xp: award.xp, destination: { type: 'attribute', attributeId: award.target === 'ANY' ? 'INT' : award.target! } }
  if (award.kind === 'trait') return { id: `${record.id}.${award.kind}.${award.target}`, kind: 'fixed', xp: award.xp, destination: { type: 'trait', traitId: `trait.${award.target!.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, displayName: award.target! } }
  if (award.kind === 'skill') {
    const [name, subject] = award.target!.split('/')
    if (subject === 'Any' || award.target === 'skill.any') return { id: record.id === 'affiliation.fwl.parent' ? 'fwl.skill.art' : 'other-fwl.skills', kind: 'modeled-skill-choice', xp: award.xp, count: 'count' in award ? award.count ?? 1 : 1, displayName: award.target!, distinct: true }
    return { id: `${record.id}.${award.kind}.${award.target}`, kind: 'fixed', xp: award.xp, destination: skill(`skill.${name!.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, subject, award.target!) }
  }
  if (award.kind === 'flexible') return { id: record.id === 'affiliation.fwl.other-fwl-worlds' ? 'other-fwl.flexible' : `${record.id}.flexible`, kind: 'flexible-xp', allocationMode: 'pool', totalXp: award.xp, allowedTargetTypes: ['attribute', 'trait', 'skill'] }
  if (record.id === 'affiliation.fwl.other-fwl-worlds') return { id: 'other-fwl.skills', kind: 'modeled-skill-choice', xp: award.xp, displayName: 'Choose two other Skills', count: 2, distinct: true }
  return { id: `${record.id}.choice.${award.target ?? 'skill'}`, kind: 'any-skill-choice', xp: award.xp, skillId: 'skill.any', displayName: award.target ?? 'Skill/Any', count: 'count' in award ? award.count ?? 1 : 1 }
}

export function dataDrivenRecordsFromArdExport(value: ArdFwlExport = artifact) {
  validateArdFwlExport(value)
  const ids: Record<string, string> = {
    'affiliation.fwl.parent': FREE_WORLDS_LEAGUE_ID,
    'affiliation.fwl.duchy-of-andurien': FWL_ANDURIEN_ID,
    'affiliation.fwl.duchy-of-oriente': FWL_ORIENTE_ID,
    'affiliation.fwl.marik-commonwealth': FWL_MARIK_COMMONWEALTH_ID,
    'affiliation.fwl.other-fwl-worlds': FWL_OTHER_WORLDS_ID,
    'affiliation.fwl.principality-of-regulus': FWL_REGULUS_ID,
  }
  return value.records.map((record) => {
    const languageAwards = record.choices.filter((choice) => choice.kind === 'language').map((choice) => ({
      id: record.id === 'affiliation.fwl.parent' ? 'fwl.skill.language-secondary' : record.id === 'affiliation.fwl.other-fwl-worlds' ? 'other-fwl.language' : `${record.id}.${choice.id}`,
      kind: 'language-choice' as const,
      xp: choice.id === 'secondary-language' ? 15 : 20,
      choicesFrom: 'fwl-languages' as const,
      description: choice.id,
    }))
    return {
      id: ids[record.id] ?? record.id,
      displayName: record.displayName,
      sourceRuleId: record.source.path,
      costXp: record.id.endsWith('.parent') ? 150 : 0,
      awards: [...record.awards.filter((award) => !(award.kind === 'choice' && award.target === 'trait.any')).map((award) => convertAward(award, record)), ...languageAwards],
    }
  })
}

export function exportedChoiceSummary(value: ArdFwlExport = artifact): DataDrivenStage0Choice { validateArdFwlExport(value); return { language: 'Greek', art: 'Painting' } }

export function choiceStateFromArdExport(recordId: string, value: ArdFwlExport = artifact): ChoiceState {
  validateArdFwlExport(value)
  const record = value.records.find((entry) => entry.id === recordId)
  if (!record) throw new Error(`Unknown ARD FWL record: ${recordId}`)
  const grants: ChoiceGrant[] = []
  for (const choice of record.choices) {
    if (choice.kind === 'skill-subject' && record.awards.some((award) => award.kind === 'choice' && award.target === 'skill.any')) continue
    const count = 'count' in choice ? choice.count ?? 1 : 1
    for (let index = 1; index <= count; index += 1) {
      const occurrenceId = count > 1 ? `${record.id}.${choice.id}/${index}` : `${record.id}.${choice.id}`
      const flexible = choice.id === 'flexible'
      const trait = choice.kind === 'trait'
      const skillIds = choice.kind === 'language' ? ['skill.language'] : flexible ? ['skill.language'] : ['skill.art', 'skill.interest', 'skill.protocol', 'skill.negotiation']
      grants.push({
        occurrenceId,
        domain: choice.domain,
        xp: trait ? 35 : choice.kind === 'language' ? 20 : flexible ? 25 : 10,
        provenanceId: `${record.id}:${choice.id}/${index}`,
        allowedSkillIds: skillIds,
        allowedDestinationTypes: trait ? ['trait'] : flexible ? ['attribute', 'trait', 'skill'] : ['skill'],
        allowedAttributeIds: flexible ? ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG'] : undefined,
        allowedTraitIds: trait || flexible ? ['trait.pain-resistance', 'trait.wealth', 'trait.reputation', 'trait.gregarious'] : undefined,
      })
    }
  }
  return { grants, selections: [] }
}
