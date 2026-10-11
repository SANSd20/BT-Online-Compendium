import type { CharacterDefinition, ProvenanceRecord, StasisCheckOutcome, StasisHistoryEvent } from './model'
import type { SourceCitation } from '../rules/model'

export const STASIS_SOURCE: SourceCitation = { sourceId: 'Handbook - Major Periphery States', edition: 'original', page: 185, ruleId: 'stasis-tube' }
const yearDays = 365

export function stasisBiologicalAgeDays(durationYears: number): number { return Math.max(0, durationYears) }
export function deriveStasisChronologicalYears(character: CharacterDefinition): number { return (character.stasisHistory ?? []).filter((e) => e.survivalStatus !== 'fatal').reduce((sum, e) => sum + e.durationYears, 0) }
export function deriveStasisBiologicalAgeYears(character: CharacterDefinition): number { return (character.stasisHistory ?? []).reduce((sum, e) => sum + e.biologicalAgeDays / yearDays, 0) }
export function deriveStasisAttributeLosses(character: CharacterDefinition): { BOD: number; INT: number } { return (character.stasisHistory ?? []).reduce((a, e) => ({ BOD: a.BOD + e.attributeLosses.BOD, INT: a.INT + e.attributeLosses.INT }), { BOD: 0, INT: 0 }) }

export function createFreezingCheckOutcome(id: string, kind: 'freezing-brain' | 'freezing-body', outcome: 'success' | 'failure', bodBefore: number, intBefore: number): StasisCheckOutcome {
  return { id, kind, modifier: -2, outcome, bodBefore, intBefore, bodLoss: kind === 'freezing-body' && outcome === 'failure' ? bodBefore : 0, intLoss: kind === 'freezing-brain' && outcome === 'failure' ? intBefore : 0, fatal: outcome === 'failure' }
}

export function createAnnualCheckOutcome(id: string, outcome: 'success' | 'failure', bodBefore: number, intBefore: number): StasisCheckOutcome {
  const fatal = outcome === 'failure' && (bodBefore <= 1 || intBefore <= 1)
  return { id, kind: 'annual', modifier: -1, outcome, bodBefore, intBefore, bodLoss: outcome === 'failure' ? 1 : 0, intLoss: outcome === 'failure' ? 1 : 0, fatal }
}

export function createPowerInterruptionOutcome(id: string, outcome: 'success' | 'failure', bodBefore: number, intBefore: number, medtechMoS?: number): StasisCheckOutcome {
  const medtechEligible = outcome === 'failure' && medtechMoS !== undefined && medtechMoS >= 4
  return { id, kind: 'power-interruption', modifier: -3, outcome, bodBefore, intBefore, bodLoss: outcome === 'failure' ? 1 : 0, intLoss: 0, fatal: outcome === 'failure' && !medtechEligible, medtechEligible, medtechMoS, intervention: outcome === 'success' ? 'none' : medtechEligible ? 'prevented-death' : 'failed' }
}

export function addStasisEvent(character: CharacterDefinition, event: StasisHistoryEvent): CharacterDefinition {
  const history = character.stasisHistory ?? []
  if (event.durationYears <= 0 || !Number.isFinite(event.durationYears)) throw new Error('Stasis duration must be positive.')
  if (history.some((existing) => event.startYear < existing.startYear + existing.durationYears && existing.startYear < event.startYear + event.durationYears)) throw new Error('Stasis intervals may not overlap.')
  const next = structuredClone(event)
  const provenance = character.provenance.some((entry) => entry.id === next.provenanceId)
    ? character.provenance
    : [...character.provenance, { id: next.provenanceId, kind: 'player-choice', description: 'Stasis Tube history event', source: next.source } satisfies ProvenanceRecord]
  return { ...character, provenance, stasisHistory: [...history, next].sort((a, b) => a.startYear - b.startYear), updatedAt: new Date().toISOString() }
}

export function createStasisEvent(id: string, startYear: number, durationYears: number, provenanceId: string, freezing: { brain: StasisCheckOutcome; body: StasisCheckOutcome }, annualChecks: StasisCheckOutcome[] = [], powerInterruptions: StasisCheckOutcome[] = [], thawStatus: StasisHistoryEvent['thawStatus'] = 'thawed'): StasisHistoryEvent {
  const checks = [freezing.brain, freezing.body, ...annualChecks, ...powerInterruptions]
  const losses = checks.reduce((a, c) => ({ BOD: a.BOD + c.bodLoss, INT: a.INT + c.intLoss }), { BOD: 0, INT: 0 })
  const fatal = checks.some((c) => c.fatal)
  const unresolvedConditions = checks.filter((c) => c.outcome === 'success' && c.kind !== 'freezing-brain' && c.kind !== 'freezing-body').length < Math.floor(durationYears) ? ['Every completed stasis year requires a recorded annual check.'] : []
  return { id, source: { ...STASIS_SOURCE }, provenanceId, startYear, durationYears, biologicalAgeDays: stasisBiologicalAgeDays(durationYears), freezing, annualChecks, powerInterruptions, thawStatus, attributeLosses: losses, survivalStatus: fatal ? 'fatal' : unresolvedConditions.length ? 'unresolved' : 'survived', unresolvedConditions, notes: ['Secondary post-thaw effects remain discretionary and require adjudication.'] }
}
