import { describe, expect, it } from 'vitest'
import { createCharacterDraft } from '../../engine/characterFactory'
import { addStasisEvent, createAnnualCheckOutcome, createPowerInterruptionOutcome, createStasisEvent, deriveStasisAttributeLosses, deriveStasisBiologicalAgeYears } from './stasis'

const check = (id: string, kind: 'freezing-brain' | 'freezing-body' | 'annual' | 'power-interruption', outcome: 'success' | 'failure', modifier: number, bodLoss = 0, intLoss = 0, fatal = false) => ({ id, kind, outcome, modifier, bodBefore: 5, intBefore: 5, bodLoss, intLoss, fatal })
function event(id: string, startYear: number, durationYears = 1) { return createStasisEvent(id, startYear, durationYears, 'test-provenance', { brain: check(`${id}-brain`, 'freezing-brain', 'success', -2), body: check(`${id}-body`, 'freezing-body', 'success', -2) }, Array.from({ length: durationYears }, (_, i) => check(`${id}-annual-${i}`, 'annual', 'success', -1)), [], 'thawed') }

describe('Stasis Tube history', () => {
  it('keeps chronological and biological time distinct with fractional precision', () => {
    const character = createCharacterDraft('life-modules', 'Stasis')
    expect(deriveStasisBiologicalAgeYears(addStasisEvent(character, event('s1', 30, 2)))).toBeCloseTo(2 / 365)
  })
  it('rejects overlapping intervals and accumulates separate events', () => {
    const character = addStasisEvent(createCharacterDraft('life-modules', 'Stasis'), event('s1', 30, 2))
    expect(() => addStasisEvent(character, event('overlap', 31, 1))).toThrow('overlap')
    const result = addStasisEvent(character, event('s2', 40, 1))
    expect(result.stasisHistory).toHaveLength(2)
  })
  it('records cumulative annual losses and fatal freezing outcomes', () => {
    const failed = createStasisEvent('fatal', 30, 1, 'test', { brain: check('brain', 'freezing-brain', 'failure', -2, 0, 1, true), body: check('body', 'freezing-body', 'success', -2) })
    expect(failed.survivalStatus).toBe('fatal')
    const damaged = createStasisEvent('damaged', 30, 2, 'test', { brain: check('brain', 'freezing-brain', 'success', -2), body: check('body', 'freezing-body', 'success', -2) }, [check('a1', 'annual', 'failure', -1, 1, 1), check('a2', 'annual', 'failure', -1, 1, 1)])
    const character = addStasisEvent(createCharacterDraft('life-modules', 'Stasis'), damaged)
    expect(deriveStasisAttributeLosses(character)).toEqual({ BOD: 2, INT: 2 })
  })
  it('records annual failure damage and power interruption MedTech intervention', () => {
    const annual = createAnnualCheckOutcome('annual', 'failure', 5, 5)
    expect(annual).toMatchObject({ modifier: -1, bodLoss: 1, intLoss: 1, fatal: false })
    const saved = createPowerInterruptionOutcome('power-saved', 'failure', 5, 5, 4)
    expect(saved).toMatchObject({ modifier: -3, bodLoss: 1, fatal: false, intervention: 'prevented-death' })
    const fatal = createPowerInterruptionOutcome('power-fatal', 'failure', 5, 5, 3)
    expect(fatal).toMatchObject({ bodLoss: 1, fatal: true, intervention: 'failed' })
  })
})
