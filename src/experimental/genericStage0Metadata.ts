import artifact from './generated/fwl-export.json'
import { choiceStateFromArdExport } from './ardExportAdapter'
import type { ChoiceGrant, ChoiceState } from './choiceEditing'

export type GenericStage0Control = { id: string; label: string; type: 'language' | 'trait' | 'skill' | 'flexible'; domain: string; required: boolean; xp: number; provenanceId: string; allowedDestinationTypes: readonly string[]; allowedSkillIds: readonly string[]; allowedAttributeIds: readonly string[]; allowedTraitIds: readonly string[] }
export type GenericStage0Package = { id: string; parentId?: string; label: string; sourcePath: string; fixedAwards: readonly { kind: string; target?: string; xp: number }[]; controls: readonly GenericStage0Control[] }

function controlType(grant: ChoiceGrant): GenericStage0Control['type'] {
  if (grant.allowedDestinationTypes?.length === 1 && grant.allowedDestinationTypes[0] === 'trait') return 'trait'
  if (grant.allowedDestinationTypes?.includes('attribute')) return 'flexible'
  if (grant.allowedSkillIds?.includes('skill.language')) return 'language'
  return 'skill'
}

export function genericStage0Packages(value = artifact): GenericStage0Package[] {
  return value.records.map((record) => {
    const state = choiceStateFromArdExport(record.id, value)
    return { id: record.id, parentId: record.parentId, label: record.displayName, sourcePath: record.source.path, fixedAwards: record.awards.filter((award) => award.kind !== 'choice').map((award) => ({ kind: award.kind, target: award.target, xp: award.xp })), controls: state.grants.map((grant) => ({ id: grant.occurrenceId, label: `${grant.domain}${grant.occurrenceId.includes('/') ? ` (${grant.occurrenceId.split('/').at(-1)})` : ''}`, type: controlType(grant), domain: grant.domain, required: true, xp: grant.xp, provenanceId: grant.provenanceId, allowedDestinationTypes: grant.allowedDestinationTypes ?? [], allowedSkillIds: grant.allowedSkillIds ?? [], allowedAttributeIds: grant.allowedAttributeIds ?? [], allowedTraitIds: grant.allowedTraitIds ?? [] })) }
  })
}

export function genericStage0ChoiceState(recordId: string, value = artifact): ChoiceState { return choiceStateFromArdExport(recordId, value) }
