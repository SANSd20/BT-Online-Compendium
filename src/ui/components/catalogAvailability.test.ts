import { describe, expect, it } from 'vitest'
import { catalogAvailability, catalogAvailabilityLabel, showCatalogEntry } from './catalogAvailability'

describe('catalog availability presentation policy', () => {
  it('keeps available, ineligible, and unsupported distinct', () => {
    expect(catalogAvailabilityLabel(catalogAvailability('available'))).toBe('Available')
    expect(catalogAvailabilityLabel(catalogAvailability('ineligible', 'Requires ComStar'))).toContain('Requires ComStar')
    expect(catalogAvailabilityLabel(catalogAvailability('unsupported'))).toContain('Not yet supported')
  })
  it('shows unsupported entries in Public Alpha but can hide them in production', () => {
    const unsupported = catalogAvailability('unsupported')
    expect(showCatalogEntry(unsupported, 'public-alpha')).toBe(true)
    expect(showCatalogEntry(unsupported, 'production')).toBe(false)
  })
})
