export type CampaignYearEligibility =
  | { status: 'eligible'; reason: string }
  | { status: 'ineligible'; reason: string }
  | { status: 'unresolved'; reason: string }

export interface CampaignYearRule {
  minimumCampaignYear?: number
  maximumCampaignYear?: number
  requiresBirthYear?: boolean
}

export function evaluateCampaignYearEligibility(campaignYear: number | undefined, rule: CampaignYearRule): CampaignYearEligibility {
  if (rule.requiresBirthYear) return { status: 'unresolved', reason: 'Birth Year is required for this eligibility rule.' }
  if (campaignYear === undefined) return { status: 'unresolved', reason: 'Campaign Year is required for this eligibility rule.' }
  if (rule.minimumCampaignYear !== undefined && campaignYear < rule.minimumCampaignYear) return { status: 'ineligible', reason: `Requires Campaign Year ${rule.minimumCampaignYear} or later.` }
  if (rule.maximumCampaignYear !== undefined && campaignYear > rule.maximumCampaignYear) return { status: 'ineligible', reason: `Requires Campaign Year ${rule.maximumCampaignYear} or earlier.` }
  return { status: 'eligible', reason: 'Campaign Year satisfies the published eligibility rule.' }
}
