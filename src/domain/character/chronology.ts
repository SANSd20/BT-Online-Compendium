import type { CharacterDefinition, ChronologyProfile } from './model'

export const DEFAULT_CAMPAIGN_REFERENCE_YEAR = 3076
export type DurationStage = 3 | 4
export interface DurationEligibility {
  eligible: boolean
  partial: boolean
  ambiguous: boolean
  availableYears?: number
  reason: string
}

export function fixedDobProfile(fixedDob: string, campaignReferenceDate?: string): ChronologyProfile {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fixedDob)) throw new Error('Fixed DOB must use YYYY-MM-DD.')
  return { version: 1, mode: 'fixed-dob', fixedDob, ...(campaignReferenceDate ? { campaignReferenceDate, campaignReferencePrecision: 'date' } : { campaignReferenceYear: DEFAULT_CAMPAIGN_REFERENCE_YEAR, campaignReferencePrecision: 'year' }) }
}

export function progressionDerivedProfile(ageYears: number, campaignReferenceDate?: string): ChronologyProfile {
  if (!Number.isFinite(ageYears) || ageYears < 0) throw new Error('Derived age must be a finite non-negative number.')
  return { version: 1, mode: 'progression-derived', derivedAgeYears: ageYears, ...(campaignReferenceDate ? { campaignReferenceDate, campaignReferencePrecision: 'date' } : { campaignReferenceYear: DEFAULT_CAMPAIGN_REFERENCE_YEAR, campaignReferencePrecision: 'year' }) }
}

export function evaluateDurationEligibility(profile: ChronologyProfile | undefined, normalDurationYears: number, stage: DurationStage, availableYears?: number): DurationEligibility {
  if (!profile) return { eligible: true, partial: false, ambiguous: false, reason: 'No campaign deadline is configured; preserve legacy progression behavior.' }
  if (availableYears !== undefined) {
    const partial = availableYears < normalDurationYears
    const eligible = stage === 3 ? !partial : availableYears >= normalDurationYears / 2
    return { eligible, partial: eligible && stage === 4 && partial, ambiguous: false, availableYears, reason: eligible ? (partial ? 'Stage 4 is eligible at the inclusive 50% threshold and ends further Stage 4 progression.' : 'Sufficient duration is available.') : `Stage ${stage} requires ${stage === 3 ? 'the full' : 'at least half the'} normal duration.` }
  }
  if (profile.campaignReferencePrecision === 'year' || profile.campaignReferenceYear !== undefined) return { eligible: false, partial: false, ambiguous: true, reason: 'Campaign reference has year-only precision; exact module availability cannot be determined without a calendar date or explicit available duration.' }
  return { eligible: true, partial: false, ambiguous: false, reason: 'Exact campaign date is available.' }
}

export function deriveBirthDateRange(profile: ChronologyProfile): { earliest: string; latest: string } | undefined {
  if (profile.mode !== 'progression-derived' || !profile.campaignReferenceDate || profile.derivedAgeYears === undefined) return undefined
  const reference = new Date(`${profile.campaignReferenceDate}T00:00:00Z`)
  if (Number.isNaN(reference.valueOf())) throw new Error('Campaign reference date must be an ISO date.')
  const wholeYears = Math.floor(profile.derivedAgeYears)
  const fractionDays = Math.round((profile.derivedAgeYears - wholeYears) * 365)
  const latest = new Date(reference)
  latest.setUTCFullYear(latest.getUTCFullYear() - wholeYears)
  latest.setUTCDate(latest.getUTCDate() - fractionDays)
  const earliest = new Date(latest)
  earliest.setUTCDate(earliest.getUTCDate() - 364)
  return { earliest: earliest.toISOString().slice(0, 10), latest: latest.toISOString().slice(0, 10) }
}

export function withDerivedBirthDateRange(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  if (next.chronologyProfile) next.chronologyProfile.birthDateRange = deriveBirthDateRange(next.chronologyProfile)
  return next
}
