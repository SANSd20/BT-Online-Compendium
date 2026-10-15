import { describe, expect, it } from 'vitest'
import { createLifeModuleCharacter, buildLifeModuleTransaction } from './lifeModuleEngine'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { progressionDerivedProfile, fixedDobProfile } from '../domain/character/chronology'

describe('G1h-A chronology operations', () => {
  it('applies SET_AGE absolutely, then ADD_YEARS relatively and in order', () => {
    const base = createLifeModuleCharacter('Chronology')
    const tx = buildLifeModuleTransaction(base, [
      { kind: 'set-age', ageYears: 18, sourceRelationId: 'relation.capellan.stage-2-civilian-job-substitution', source: { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 64 } },
      { kind: 'add-years', years: 3 },
    ])
    expect(tx.errors).toEqual([])
    expect(tx.prospectiveState?.chronology.slice(-2).map((entry) => [entry.operation, entry.ageBefore, entry.ageAfter])).toEqual([['SET_AGE', 0, 18], ['ADD_YEARS', 18, 21]])
  })

  it('rejects invalid ages and unauthorized relation references', () => {
    const base = createLifeModuleCharacter('Invalid')
    expect(buildLifeModuleTransaction(base, [{ kind: 'set-age', ageYears: -1 }]).status).toBe('failed')
    expect(buildLifeModuleTransaction(base, [{ kind: 'set-age', ageYears: 18, sourceRelationId: 'not-authorized' }]).status).toBe('failed')
  })

  it('round-trips fixed and progression-derived profiles without duplicate effects', () => {
    const character = createLifeModuleCharacter('Persisted')
    character.chronologyProfile = progressionDerivedProfile(18)
    const restored = decodeCharacter(encodeCharacter(character))
    expect(restored.chronologyProfile).toEqual(character.chronologyProfile)
    restored.chronologyProfile = fixedDobProfile('3000-01-02')
    expect(decodeCharacter(encodeCharacter(restored)).chronologyProfile?.fixedDob).toBe('3000-01-02')
    expect(restored.chronology).toEqual(character.chronology)
  })
})
