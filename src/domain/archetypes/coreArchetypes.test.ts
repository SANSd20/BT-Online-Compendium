import { describe, expect, it } from 'vitest'
import {
  CORE_ARCHETYPES,
  calculateArchetypeXp,
  getCoreArchetype,
  validateArchetypeCatalog,
} from './coreArchetypes'

const expectedNames = [
  'MechWarrior',
  'Tanker',
  'Aerospace Pilot',
  'Elemental',
  'Scout',
  'Faceman',
  'Renegade Warrior',
  'Battlefield Tech',
]

describe('Core archetype catalog', () => {
  it('contains the eight corrected-printing Core archetypes', () => {
    expect(CORE_ARCHETYPES.map((archetype) => archetype.displayName)).toEqual(expectedNames)
    expect(CORE_ARCHETYPES.map((archetype) => archetype.source.page)).toEqual([52, 53, 54, 55, 56, 57, 58, 59])
  })

  it('contains structurally valid 4,500-XP packages', () => {
    expect(validateArchetypeCatalog(CORE_ARCHETYPES)).toEqual([])
    const listedTotals = [4500, 4900, 4480, 4200, 4500, 5030, 5000, 4900]
    CORE_ARCHETYPES.forEach((archetype, index) => {
      expect(archetype.attributes).toHaveLength(8)
      expect(archetype.publishedXpTotal).toBe(4500)
      expect(calculateArchetypeXp(archetype)).toBe(listedTotals[index])
      expect(archetype.source.sourceId).toBe('atow-core-corrected-third')
    })
  })

  it('rejects duplicate IDs and malformed packages', () => {
    const duplicate = { ...CORE_ARCHETYPES[1], id: CORE_ARCHETYPES[0].id }
    const malformed = { ...CORE_ARCHETYPES[2], id: 'archetype.test.malformed', attributes: [] }
    const issues = validateArchetypeCatalog([CORE_ARCHETYPES[0], duplicate, malformed])
    expect(issues.some((entry) => entry.message.includes('Duplicate archetype ID'))).toBe(true)
    expect(issues.some((entry) => entry.message === 'All eight Attributes are required.')).toBe(true)
  })

  it('rejects an unknown archetype request', () => {
    expect(() => getCoreArchetype('archetype.core.unknown')).toThrow('Unknown Core archetype ID')
  })
})
