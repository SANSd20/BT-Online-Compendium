import type { CharacterDefinition } from '../domain/character/model'
import { applyModule } from '../engine/lifeModuleEngine'
import { reconcileChoices, type ChoiceDestination, type ChoiceState } from './choiceEditing'
import type { NormalizedExport, NormalizedPackage } from './canonicalAreNormalization'

export type CanonicalAreTransaction = {
  packageId: string
  choiceState: ChoiceState
  fixedAwardXp: number
  selectedAwardXp: number
  provenance: string[]
  stage: 0
  prospectiveState: CharacterDefinition | null
  errors: string[]
  status: 'validated' | 'failed'
}

function packageFor(value: NormalizedExport, packageId: string): NormalizedPackage {
  const selected = value.packages.find((entry) => entry.identity === packageId)
  if (!selected) throw new Error(`Unknown canonical ARE package: ${packageId}`)
  return selected
}

function inherited(value: NormalizedExport, selected: NormalizedPackage): NormalizedPackage[] {
  return selected.parentId ? [...inherited(value, packageFor(value, selected.parentId)), selected] : [selected]
}

function grantState(packages: NormalizedPackage[]): ChoiceState {
  const grants = packages.flatMap((pkg) => pkg.choices.map((choice) => ({
    occurrenceId: choice.occurrenceId,
    domain: choice.domainId,
    xp: choice.award?.xp ?? 0,
    provenanceId: choice.award?.claimRefs[0] ?? `${pkg.identity}:${choice.occurrenceId}`,
    allowedDestinationTypes: choice.domainId.includes('flexible') ? ['attribute' as const, 'trait' as const, 'skill' as const] : choice.domainId.includes('attribute') ? ['attribute' as const] : choice.domainId.includes('trait') ? ['trait' as const] : ['skill' as const],
    allowedSkillIds: choice.domainId.includes('language') || choice.domainId.includes('flexible') ? ['skill.language'] : undefined,
  })))
  return { grants, selections: [] }
}

export function choiceStateForCanonicalPackage(value: NormalizedExport, packageId: string): ChoiceState {
  return grantState(inherited(value, packageFor(value, packageId)))
}

export function canonicalLifeModuleDestination(value: ChoiceDestination | NormalizedPackage['awards'][number]['destination']) {
  if ('type' in value && value.type === 'attribute') return { type: 'attribute' as const, attributeId: value.attributeId }
  if ('type' in value && value.type === 'trait') return { type: 'trait' as const, traitId: value.traitId, displayName: value.subject ?? value.traitId, parameters: traitParameters(value.traitId, value.subject) }
  const skill = 'type' in value ? value : { type: 'skill' as const, ...value }
  return { type: 'skill' as const, address: { skillId: skill.skillId, ...(skill.subject ? { parameter: { kind: 'subskill' as const, value: skill.subject } } : {}) }, displayName: skill.subject ? `${skill.skillId}/${skill.subject}` : skill.skillId }
}

function traitParameters(traitId: string, subject?: string): Record<string, string> {
  if (!subject) return {}
  if (traitId === 'trait.exceptional-attribute') return { attribute: subject }
  if (traitId === 'trait.compulsion') return { compulsion: subject }
  return { subject }
}

export function buildCanonicalAreTransaction(input: { character: CharacterDefinition; normalized: NormalizedExport; packageId: string; choices: ChoiceState }): CanonicalAreTransaction {
  const selected = packageFor(input.normalized, input.packageId)
  const packages = inherited(input.normalized, selected)
  const expected = grantState(packages)
  const resolved = reconcileChoices(input.choices)
  const errors: string[] = []
  if (resolved.pendingOccurrenceIds.length) errors.push(`ARE choices are incomplete: ${resolved.pendingOccurrenceIds.join(', ')}`)
  if (input.choices.grants.map((grant) => grant.occurrenceId).sort().join('|') !== expected.grants.map((grant) => grant.occurrenceId).sort().join('|')) errors.push('ARE choices do not match the selected canonical package.')
  if (input.character.creation.lifeModules?.phase !== 'stage-0-affiliation') errors.push('ARE transaction requires Stage 0 affiliation phase.')
  const fixedAwardXp = packages.reduce((sum, pkg) => sum + pkg.awards.reduce((total, award) => total + award.xp, 0), 0)
  const selectedAwardXp = resolved.totalXp
  if (errors.length) return { packageId: input.packageId, choiceState: input.choices, fixedAwardXp, selectedAwardXp, provenance: packages.flatMap((pkg) => pkg.provenance.map((entry) => entry.claimId)), stage: 0, prospectiveState: null, errors, status: 'failed' }
  const prospective = structuredClone(input.character)
  const normalizedAwards = packages.flatMap((pkg) => pkg.awards).map((award) => ({ id: award.occurrenceId, kind: 'fixed' as const, xp: award.xp, destination: canonicalLifeModuleDestination(award.destination) }))
  const choiceAwards = resolved.resolved.map((entry) => ({ id: entry.occurrenceId, kind: 'fixed' as const, xp: entry.xp, destination: canonicalLifeModuleDestination(entry) }))
  const committed = applyModule(prospective, { id: input.packageId, displayName: selected.displayName, stage: 0, kind: 'affiliation', source: { sourceId: selected.exportIdentity.digest, edition: 'ARD canonical export', page: 0, ruleId: input.packageId }, costXp: selected.costXp, prerequisites: [], awards: [...normalizedAwards, ...choiceAwards], notes: ['Experimental generic canonical ARE transaction.'], deferredRules: [] }, {})
  committed.creation.lifeModules!.phase = 'stage-1-selection'
  committed.creation.lifeModules!.currentStage = 1
  return { packageId: input.packageId, choiceState: input.choices, fixedAwardXp, selectedAwardXp, provenance: packages.flatMap((pkg) => pkg.provenance.map((entry) => entry.claimId)), stage: 0, prospectiveState: committed, errors: [], status: 'validated' }
}

export function commitCanonicalAreTransaction(input: Parameters<typeof buildCanonicalAreTransaction>[0]): CharacterDefinition {
  const tx = buildCanonicalAreTransaction(input)
  if (tx.status !== 'validated' || !tx.prospectiveState) throw new Error(tx.errors.join('; '))
  return tx.prospectiveState
}
