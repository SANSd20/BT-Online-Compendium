import type { CharacterDefinition, ResolvedLifeModuleDestination } from '../domain/character/model'
import type { LifeModuleAward, LifeModuleDefinition, LifeModuleDestination } from '../domain/lifeModules/model'
import { applyModule } from '../engine/lifeModuleEngine'
import { dataDrivenRecordsFromArdExport } from './ardExportAdapter'
import type { ArdFwlExport } from './ardExportAdapter'
import artifact from './generated/fwl-export.json'
import { reconcileChoices, type ChoiceDestination, type ChoiceState } from './choiceEditing'
import type { ValidationIssue } from '../validation/model'

const ardRecordIds: Record<string, string> = {
  'affiliation.fwl.parent': 'affiliation.fwl.parent',
  'affiliation.fwl.duchy-of-andurien': 'affiliation.fwl.duchy-of-andurien',
  'affiliation.fwl.duchy-of-oriente': 'affiliation.fwl.duchy-of-oriente',
  'affiliation.fwl.marik-commonwealth': 'affiliation.fwl.marik-commonwealth',
  'affiliation.fwl.other-fwl-worlds': 'affiliation.fwl.other-fwl-worlds',
  'affiliation.fwl.principality-of-regulus': 'affiliation.fwl.principality-of-regulus',
  'stage0.free-worlds-league': 'affiliation.fwl.parent',
  'stage0.free-worlds-league.duchy-andurien': 'affiliation.fwl.duchy-of-andurien',
  'stage0.free-worlds-league.duchy-oriente': 'affiliation.fwl.duchy-of-oriente',
  'stage0.free-worlds-league.marik-commonwealth': 'affiliation.fwl.marik-commonwealth',
  'stage0.free-worlds-league.other-worlds': 'affiliation.fwl.other-fwl-worlds',
  'stage0.free-worlds-league.principality-regulus': 'affiliation.fwl.principality-of-regulus',
}

export type AreStage0TransactionInput = {
  character: CharacterDefinition
  recordId: string
  choiceState: ChoiceState
  exportValue?: ArdFwlExport
}

export type AreStage0Transaction = {
  readonly baseState: CharacterDefinition
  readonly recordId: string
  readonly sourcePackageId: string
  readonly resolvedAwards: ReadonlyArray<{ occurrenceId: string; xp: number; provenanceId: string } & ChoiceDestination>
  readonly errors: readonly string[]
  readonly status: 'validated' | 'failed'
  readonly prospectiveState: CharacterDefinition | null
}

function fixedAwards(recordId: string, exportValue?: ArdFwlExport): LifeModuleAward[] {
  const records = dataDrivenRecordsFromArdExport(exportValue)
  const parent = records.find((entry) => entry.id === 'stage0.free-worlds-league')
  const selected = records.find((entry) => entry.id === recordId)
  if (!selected) throw new Error(`Unknown ARE Stage 0 context: ${recordId}`)
  const inherited = selected.id === parent?.id ? [] : parent?.awards ?? []
  return [...inherited, ...selected.awards].filter((award) => award.kind === 'fixed')
}

function lifeDestination(value: ChoiceDestination): LifeModuleDestination {
  if ('type' in value && value.type === 'attribute') return { type: 'attribute', attributeId: value.attributeId }
  if ('type' in value && value.type === 'trait') return { type: 'trait', traitId: value.traitId, displayName: value.subject ?? value.traitId }
  const skill = 'type' in value ? value : { type: 'skill' as const, ...value }
  const labels: Record<string, string> = { 'skill.language': 'Language', 'skill.art': 'Art', 'skill.interest': 'Interest', 'skill.protocol': 'Protocol' }
  return { type: 'skill', address: { skillId: skill.skillId, parameter: { kind: 'subskill', value: skill.subject } }, displayName: `${labels[skill.skillId] ?? skill.skillId}/${skill.subject}` }
}

function canonicalChoiceAwardId(recordId: string, id: string): string {
  if (recordId === 'affiliation.fwl.parent') return id.endsWith('secondary-language') ? 'fwl.language.secondary' : 'fwl.skill.art'
  const suffix = id.split('.').at(-1)
  if (recordId === 'affiliation.fwl.other-fwl-worlds') return suffix === 'language-any' ? 'other-fwl.language' : suffix === 'skill-any' ? 'other-fwl.skills' : suffix === 'trait-any' ? 'other-fwl.trait' : 'other-fwl.flexible'
  return id
}

function buildModule(recordId: string, state: ChoiceState, exportValue?: ArdFwlExport): LifeModuleDefinition {
  const resolved = reconcileChoices(state)
  if (resolved.pendingOccurrenceIds.length > 0) throw new Error(`ARE Stage 0 choices are incomplete: ${resolved.pendingOccurrenceIds.join(', ')}`)
  const awards: LifeModuleAward[] = [...fixedAwards(recordId, exportValue)]
  const rawRecord = (exportValue ?? artifact).records.find((entry) => entry.id === ardRecordIds[recordId])
  return {
    id: recordId,
    displayName: `ARE Stage 0 ${recordId}`,
    stage: 0,
    kind: 'affiliation',
    source: { sourceId: 'atow-ard-fwl-export', edition: 'ARD generated FWL export', page: Number(rawRecord?.source.printedPage ?? 66), ruleId: rawRecord?.source.path ?? `are.${recordId}` },
    costXp: recordId === 'affiliation.fwl.parent' ? 150 : 0,
    prerequisites: [],
    awards,
    notes: ['Experimental ARE transaction adapter; production ALE remains active.'],
    deferredRules: [],
  }
}

export function buildAreStage0Transaction(input: AreStage0TransactionInput): AreStage0Transaction {
  const module = buildModule(input.recordId, input.choiceState, input.exportValue)
  const exportData = input.exportValue ?? artifact
  const record = exportData.records.find((entry) => entry.id === ardRecordIds[input.recordId])
  const resolved = reconcileChoices(input.choiceState).resolved
  const errors: string[] = []
  if (!record) errors.push(`Unknown ARD package: ${input.recordId}`)
  if (input.character.creation.lifeModules?.phase !== 'stage-0-affiliation') errors.push('ARE Stage 0 transaction requires the stage-0-affiliation phase.')
  if (!input.character.creation.lifeModules?.stage0AffiliationContext) errors.push('ARE Stage 0 transaction requires an explicit affiliation context.')
  if (resolved.some((entry, index) => resolved.findIndex((candidate) => candidate.occurrenceId === entry.occurrenceId) !== index)) errors.push('ARE choice occurrences must be unique.')
  if (resolved.some((entry) => !entry.provenanceId)) errors.push('ARE resolved awards require source provenance.')
  if (errors.length > 0) return { baseState: structuredClone(input.character), recordId: input.recordId, sourcePackageId: record?.source.path ?? input.recordId, resolvedAwards: resolved, errors, status: 'failed', prospectiveState: null }
  const prospective = applyModule(input.character, { ...module, awards: [...module.awards, ...resolved.map((entry) => ({ id: canonicalChoiceAwardId(input.recordId, entry.occurrenceId.replace(/\/\d+$/, '')), kind: 'fixed' as const, xp: entry.xp, destination: lifeDestination(entry) }))] }, {})
  const state = prospective.creation.lifeModules!
  state.stage0SubAffiliation = input.recordId === 'affiliation.fwl.parent' ? 'no' : input.recordId
  state.phase = 'stage-1-selection'
  state.currentStage = 1
  return { baseState: structuredClone(input.character), recordId: input.recordId, sourcePackageId: record!.source.path, resolvedAwards: resolved, errors: [], status: 'validated', prospectiveState: prospective }
}

export function commitAreStage0Transaction(input: AreStage0TransactionInput): CharacterDefinition {
  const transaction = buildAreStage0Transaction(input)
  if (transaction.status !== 'validated' || !transaction.prospectiveState) throw new Error(transaction.errors.join('; ') || 'ARE Stage 0 transaction is not valid.')
  return structuredClone(transaction.prospectiveState)
}

export function areFwlHistoryAuthority(exportValue: ArdFwlExport = artifact): (character: CharacterDefinition) => ValidationIssue[] {
  const records = dataDrivenRecordsFromArdExport(exportValue)
  const allowed = new Map(records.map((record) => [record.id, record]))
  return (character) => {
    const issues: ValidationIssue[] = []
    const state = character.creation.lifeModules
    const history = character.lifeModuleHistory
    const affiliation = history.find((entry) => allowed.has(entry.moduleId))
    if (!affiliation) return [{ id: 'are.history.affiliation.required', path: 'lifeModuleHistory', message: 'ARE history must contain a generated ARD FWL affiliation.', severity: 'error', kind: 'hard-requirement', gmOverrideAllowed: false }]
    const record = allowed.get(affiliation.moduleId)!
    if (affiliation.source.sourceId !== 'atow-ard-fwl-export' || affiliation.source.ruleId !== record.sourceRuleId) issues.push({ id: 'are.history.source.invalid', path: 'lifeModuleHistory', message: 'ARE history source provenance does not match the trusted ARD package.', severity: 'error', kind: 'hard-requirement', gmOverrideAllowed: false })
    if (affiliation.provenanceIds.length === 0 || affiliation.provenanceIds.some((id) => !character.provenance.some((entry) => entry.id === id))) issues.push({ id: 'are.history.provenance.invalid', path: 'lifeModuleHistory', message: 'ARE history provenance is incomplete.', severity: 'error', kind: 'hard-requirement', gmOverrideAllowed: false })
    if (!state?.selectedModuleIds.includes(affiliation.moduleId)) issues.push({ id: 'are.history.selection.invalid', path: 'creation.lifeModules.selectedModuleIds', message: 'ARE history affiliation is not represented in selected module state.', severity: 'error', kind: 'hard-requirement', gmOverrideAllowed: false })
    if (state?.phase !== 'stage-1-selection' || state.currentStage !== 1) issues.push({ id: 'are.history.stage.invalid', path: 'creation.lifeModules', message: 'ARE Stage 0 history must advance to Stage 1.', severity: 'error', kind: 'hard-requirement', gmOverrideAllowed: false })
    return issues
  }
}

export function resolvedChoiceDestination(value: ChoiceDestination): ResolvedLifeModuleDestination {
  if ('type' in value && value.type === 'attribute') return { type: 'attribute', targetId: value.attributeId, displayName: value.attributeId }
  if ('type' in value && value.type === 'trait') return { type: 'trait', targetId: value.traitId, displayName: value.subject ?? value.traitId }
  const skill = 'type' in value ? value : { type: 'skill' as const, ...value }
  const labels: Record<string, string> = { 'skill.language': 'Language', 'skill.art': 'Art', 'skill.interest': 'Interest', 'skill.protocol': 'Protocol', 'skill.negotiation': 'Negotiation' }
  return { type: 'skill', targetId: skill.skillId, parameter: { kind: 'subskill', value: skill.subject }, displayName: `${labels[skill.skillId] ?? skill.skillId}/${skill.subject}` }
}
