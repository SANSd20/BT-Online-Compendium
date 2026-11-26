import { describe, expect, it } from 'vitest'
import { parseCampaignYear } from './campaignYear'

describe('Campaign Year input', () => {
  it('accepts explicit safe whole numbers without applying an invented range', () => {
    expect(parseCampaignYear('3059')).toBe(3059)
    expect(parseCampaignYear('0')).toBe(0)
    expect(parseCampaignYear('-1')).toBe(-1)
  })

  it('rejects empty, fractional, malformed, and unsafe values', () => {
    expect(parseCampaignYear('')).toBeNull()
    expect(parseCampaignYear('  ')).toBeNull()
    expect(parseCampaignYear('3059.5')).toBeNull()
    expect(parseCampaignYear('30x9')).toBeNull()
    expect(parseCampaignYear('9007199254740992')).toBeNull()
  })
})
