import { describe, expect, it } from 'vitest'
import { evaluateCampaignYearEligibility } from './campaignEligibility'

describe('generic campaign-year eligibility', () => {
  it('distinguishes eligible, ineligible, and missing Campaign Year', () => {
    expect(evaluateCampaignYearEligibility(3059, { minimumCampaignYear: 3050 }).status).toBe('eligible')
    expect(evaluateCampaignYearEligibility(3049, { minimumCampaignYear: 3050 }).status).toBe('ineligible')
    expect(evaluateCampaignYearEligibility(undefined, { minimumCampaignYear: 3050 }).status).toBe('unresolved')
  })

  it('does not substitute Campaign Year for Birth Year', () => {
    expect(evaluateCampaignYearEligibility(3059, { requiresBirthYear: true })).toEqual({ status: 'unresolved', reason: 'Birth Year is required for this eligibility rule.' })
  })
})
