import { describe, expect, it } from 'vitest'
import { POINT_BUY_TRAITS } from './catalog'

describe('Point Buy Trait catalog', () => {
  it('keeps the Slice 112 governed count and canonical identities unique', () => {
    expect(POINT_BUY_TRAITS).toHaveLength(32)
    expect(new Set(POINT_BUY_TRAITS.map((entry) => entry.id)).size).toBe(POINT_BUY_TRAITS.length)
    expect(POINT_BUY_TRAITS.find((entry) => entry.id === 'trait.reputation')).toMatchObject({ sourcePage: 124, category: 'flexible', multiple: true })
  })

  it('uses only source-defined TP levels for promoted variable Traits', () => {
    expect(POINT_BUY_TRAITS.find((entry) => entry.id === 'trait.poor-vision')?.allowedTp).toEqual([-9, -8, -7, -6, -5, -4, -3, -2])
    expect(POINT_BUY_TRAITS.find((entry) => entry.id === 'trait.unlucky')?.allowedTp).toEqual([-10, -9, -8, -7, -6, -5, -4, -3, -2])
  })
})
