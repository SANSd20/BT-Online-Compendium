import type { CharacterDefinition } from '../domain/character/model'
import type { ValidationIssue } from '../validation/model'
import type { NormalizedExport } from './canonicalAreNormalization'

export function canonicalAreHistoryAuthority(normalized: NormalizedExport, packageId: string): (character: CharacterDefinition) => ValidationIssue[] {
  const selected = normalized.packages.find((entry) => entry.identity === packageId)
  if (!selected) throw new Error(`Unknown trusted canonical package: ${packageId}`)
  const allowed = new Set([packageId, ...normalized.packages.filter((entry) => entry.parentId === packageId).map((entry) => entry.identity)])
  return (character) => {
    const issues: ValidationIssue[] = []
    const history = character.lifeModuleHistory.filter((entry) => allowed.has(entry.moduleId))
    const entry = history.at(-1)
    if (!entry) return [{ id: 'are.history.package.required', path: 'lifeModuleHistory', message: 'Trusted canonical package history is missing.', severity: 'error', kind: 'hard-requirement', gmOverrideAllowed: false }]
    if (entry.source.sourceId !== selected.exportIdentity.digest || entry.source.ruleId !== entry.moduleId) issues.push({ id: 'are.history.trust.invalid', path: 'lifeModuleHistory', message: 'Canonical package trust metadata does not match the selected ARD export.', severity: 'error', kind: 'hard-requirement', gmOverrideAllowed: false })
    if (!entry.provenanceIds.length || entry.provenanceIds.some((id) => !character.provenance.some((item) => item.id === id))) issues.push({ id: 'are.history.provenance.invalid', path: 'lifeModuleHistory', message: 'Canonical package provenance is incomplete.', severity: 'error', kind: 'hard-requirement', gmOverrideAllowed: false })
    if (character.creation.lifeModules?.phase !== 'stage-1-selection' || character.creation.lifeModules.currentStage !== 1) issues.push({ id: 'are.history.stage.invalid', path: 'creation.lifeModules', message: 'Canonical Stage 0 history did not advance to Stage 1.', severity: 'error', kind: 'hard-requirement', gmOverrideAllowed: false })
    return issues
  }
}
