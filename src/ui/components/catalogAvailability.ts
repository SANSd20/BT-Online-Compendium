export type CatalogAvailabilityState = 'available' | 'ineligible' | 'unsupported'
export type UnsupportedVisibilityPolicy = 'public-alpha' | 'production'

export interface CatalogAvailability {
  state: CatalogAvailabilityState
  reason?: string
}

export function catalogAvailability(state: CatalogAvailabilityState, reason?: string): CatalogAvailability {
  return { state, ...(reason ? { reason } : {}) }
}

export function showCatalogEntry(availability: CatalogAvailability, policy: UnsupportedVisibilityPolicy = 'public-alpha'): boolean {
  return availability.state !== 'unsupported' || policy === 'public-alpha'
}

export function catalogAvailabilityLabel(availability: CatalogAvailability): string {
  if (availability.state === 'available') return 'Available'
  if (availability.state === 'unsupported') return 'Unavailable · Not yet supported in this Public Alpha'
  return `Unavailable · ${availability.reason ?? 'Current prerequisites are not satisfied.'}`
}
