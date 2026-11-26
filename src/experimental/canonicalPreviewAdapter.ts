import type { CharacterDefinition, PendingLifeModuleAward } from '../domain/character/model'
import { applyModule } from '../engine/lifeModuleEngine'
import { reconcileChoices, type ChoiceState } from './choiceEditing'
import { canonicalLifeModuleDestination, choiceStateForCanonicalPackage } from './canonicalAreTransaction'
import type { NormalizedExport, NormalizedPackage } from './canonicalAreNormalization'

export type CanonicalPreviewResult = {
  status: 'preview' | 'incomplete' | 'failed'
  character: CharacterDefinition | null
  packageId: string
  pendingOccurrenceIds: string[]
  resolvedOccurrenceIds: string[]
  fixedAwardXp: number
  selectedAwardXp: number
  provenance: string[]
  errors: string[]
}

function packageFor(value: NormalizedExport, packageId: string): NormalizedPackage {
  const selected = value.packages.find((entry) => entry.identity === packageId)
  if (!selected) throw new Error(`Unknown trusted canonical package: ${packageId}`)
  return selected
}

function inherited(value: NormalizedExport, selected: NormalizedPackage): NormalizedPackage[] {
  return selected.parentId ? [...inherited(value, packageFor(value, selected.parentId)), selected] : [selected]
}

function expectedChoiceState(value: NormalizedExport, packageId: string): ChoiceState {
  return choiceStateForCanonicalPackage(value, packageId)
}

function choiceKind(grant: ChoiceState['grants'][number]): PendingLifeModuleAward['kind'] {
  if (grant.allowedDestinationTypes?.length === 1 && grant.allowedDestinationTypes[0] === 'skill') return 'any-skill-choice'
  if (grant.allowedDestinationTypes?.includes('attribute') || grant.allowedDestinationTypes?.includes('trait')) return 'flexible-xp'
  return 'modeled-skill-choice'
}

function pendingAward(grant: ChoiceState['grants'][number], moduleId: string, source: { sourceId: string; edition: string; page: number; ruleId: string }): PendingLifeModuleAward {
  const flexible = choiceKind(grant) === 'flexible-xp'
  return {
    id: `${moduleId}/canonical-choice/${grant.occurrenceId}`,
    moduleId,
    provenanceId: grant.provenanceId,
    awardId: grant.occurrenceId,
    kind: choiceKind(grant),
    description: `Resolve canonical choice ${grant.occurrenceId}.`,
    xpPerGrant: flexible ? 0 : grant.xp,
    remainingGrants: 1,
    ...(flexible ? { allocationMode: 'fixed-grants' as const } : {}),
    ...(flexible ? { remainingXp: grant.xp } : {}),
    allowedTargetTypes: [...(grant.allowedDestinationTypes ?? ['skill'])],
    ...(grant.allowedSkillIds ? { allowedDestinationKeys: [...grant.allowedSkillIds] } : {}),
    source,
  }
}

function trustedChoiceState(input: ChoiceState, expected: ChoiceState): void {
  const canonical = (value: ChoiceState['grants'][number]) => JSON.stringify({ occurrenceId: value.occurrenceId, domain: value.domain, xp: value.xp, provenanceId: value.provenanceId, allowedSkillIds: value.allowedSkillIds ?? null, allowedDestinationTypes: value.allowedDestinationTypes ?? null, allowedAttributeIds: value.allowedAttributeIds ?? null, allowedTraitIds: value.allowedTraitIds ?? null })
  const actual = new Map(input.grants.map((entry) => [entry.occurrenceId, canonical(entry)]))
  const required = new Map(expected.grants.map((entry) => [entry.occurrenceId, canonical(entry)]))
  if (actual.size !== required.size || [...required].some(([id, value]) => actual.get(id) !== value)) throw new Error('Canonical ChoiceState does not match the trusted package.')
}

export function previewCanonicalAre(input: { character: CharacterDefinition; normalized: NormalizedExport; packageId: string; choices: ChoiceState }): CanonicalPreviewResult {
  try {
    const selected = packageFor(input.normalized, input.packageId)
    const packages = inherited(input.normalized, selected)
    const expected = expectedChoiceState(input.normalized, input.packageId)
    trustedChoiceState(input.choices, expected)
    const reconciled = reconcileChoices(input.choices)
    const source = { sourceId: selected.exportIdentity.digest, edition: 'ARD canonical export', page: 0, ruleId: input.packageId }
    if (input.character.creation.lifeModules?.phase !== 'stage-0-affiliation') throw new Error('Canonical preview requires Stage 0 affiliation phase.')
    const fixedAwardXp = packages.reduce((sum, pkg) => sum + pkg.awards.reduce((total, award) => total + award.xp, 0), 0)
    const awards = packages.flatMap((pkg) => pkg.awards).map((award) => ({ id: award.occurrenceId, kind: 'fixed' as const, xp: award.xp, destination: canonicalLifeModuleDestination(award.destination) }))
    const chosenAwards = reconciled.resolved.map((entry) => ({ id: entry.occurrenceId, kind: 'fixed' as const, xp: entry.xp, destination: canonicalLifeModuleDestination(entry) }))
    const preview = applyModule(structuredClone(input.character), { id: input.packageId, displayName: selected.displayName, stage: 0, kind: 'affiliation', source, costXp: selected.costXp, prerequisites: [], awards: [...awards, ...chosenAwards], notes: ['Experimental generic canonical ARE preview.'], deferredRules: [] }, {})
    const state = preview.creation.lifeModules!
    state.pendingAwards.push(...expected.grants.filter((grant) => !reconciled.resolved.some((entry) => entry.occurrenceId === grant.occurrenceId)).map((grant) => pendingAward(grant, input.packageId, source)))
    state.phase = 'stage-0-affiliation'
    state.currentStage = 0
    return { status: reconciled.pendingOccurrenceIds.length ? 'incomplete' : 'preview', character: preview, packageId: input.packageId, pendingOccurrenceIds: reconciled.pendingOccurrenceIds, resolvedOccurrenceIds: reconciled.resolved.map((entry) => entry.occurrenceId), fixedAwardXp, selectedAwardXp: reconciled.totalXp, provenance: packages.flatMap((pkg) => pkg.provenance.map((entry) => entry.claimId)), errors: [] }
  } catch (error) {
    return { status: 'failed', character: null, packageId: input.packageId, pendingOccurrenceIds: [], resolvedOccurrenceIds: [], fixedAwardXp: 0, selectedAwardXp: 0, provenance: [], errors: [error instanceof Error ? error.message : 'Canonical preview failed.'] }
  }
}
