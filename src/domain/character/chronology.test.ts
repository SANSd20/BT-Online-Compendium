import { describe, expect, it } from 'vitest'
import { DEFAULT_CAMPAIGN_REFERENCE_YEAR, deriveBirthDateRange, evaluateDurationEligibility, fixedDobProfile, progressionDerivedProfile } from './chronology'

describe('G1h-A chronology foundation', () => {
  it('preserves fixed DOB mode without inventing a range', () => {
    expect(deriveBirthDateRange(fixedDobProfile('3000-01-02', '3025-01-02'))).toBeUndefined()
  })
  it('derives a bounded date range only when a campaign date is supplied', () => {
    const range = deriveBirthDateRange(progressionDerivedProfile(18, '3025-01-02'))
    expect(range?.latest).toBe('3007-01-02')
    expect(range?.earliest).toBe('3006-01-03')
  })
  it('uses the approved year-only reference without inventing a date', () => {
    expect(progressionDerivedProfile(18).campaignReferenceYear).toBe(DEFAULT_CAMPAIGN_REFERENCE_YEAR)
    expect(progressionDerivedProfile(18).campaignReferencePrecision).toBe('year')
    expect(evaluateDurationEligibility(progressionDerivedProfile(18), 4, 3)).toMatchObject({ eligible: false, ambiguous: true })
  })
  it.each([
    [3, 1, false, false], [3, 2, false, false], [4, 1.9, false, false], [4, 2, true, true], [4, 3, true, true], [4, 4, true, false], [4, 5, true, false],
  ] as const)('applies duration rule stage=%i available=%f', (stage, available, eligible, partial) => {
    expect(evaluateDurationEligibility(progressionDerivedProfile(18), 4, stage, available)).toMatchObject({ eligible, partial, ambiguous: false })
  })
})
