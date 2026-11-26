export function parseCampaignYear(value: string): number | null {
  const normalized = value.trim()
  if (!/^[+-]?\d+$/.test(normalized)) return null
  const year = Number(normalized)
  return Number.isSafeInteger(year) ? year : null
}
