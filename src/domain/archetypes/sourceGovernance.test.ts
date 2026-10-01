import { describe, expect, it } from 'vitest'
import { decodeCharacter, encodeCharacter } from '../../persistence/characterCodec'
import { createCharacterFromArchetype } from '../../engine/archetypeFactory'
import { CORE_ARCHETYPES, getCoreArchetype } from './coreArchetypes'

describe('Alpha Slice 28 archetype source governance', () => {
  it('preserves governing Tanker package Attribute XP instead of back-sheet values', () => {
    const tanker = getCoreArchetype('archetype.core.tanker')
    expect(tanker.attributes.map((entry) => entry.xp)).toEqual([400, 500, 500, 600, 400, 400, 400, 300])
  })

  it('preserves Elemental active values without modeling conflicting Attribute Links', () => {
    const elemental = getCoreArchetype('archetype.core.elemental')
    expect(elemental.attributes.map((entry) => [entry.attributeId, entry.purchasedLevel, entry.xp, entry.phenotypeModifier])).toEqual([
      ['STR', 7, 700, 2], ['BOD', 6, 600, 1], ['DEX', 4, 400, -1], ['RFL', 5, 500, 0],
      ['INT', 3, 300, 0], ['WIL', 4, 400, 0], ['CHA', 2, 200, 0], ['EDG', 3, 300, 0],
    ])
    expect(elemental.attributes.every((entry) => !('attributeLink' in entry))).toBe(true)
  })

  it('preserves Scout Equipped at the printed 2 TP and 300 XP', () => {
    const equipped = getCoreArchetype('archetype.core.scout').traits.find((entry) => entry.traitId === 'trait.equipped')
    expect(equipped).toMatchObject({ displayName: 'Equipped', tp: 2, xp: 300 })
  })

  it('keeps RFL internal, introduces no REF Attribute, and preserves capitalization identities', () => {
    expect(CORE_ARCHETYPES.flatMap((entry) => entry.attributes).some((entry) => entry.attributeId === 'REF')).toBe(false)
    expect(CORE_ARCHETYPES.every((entry) => entry.attributes.some((attribute) => attribute.attributeId === 'RFL'))).toBe(true)
    expect(getCoreArchetype('archetype.core.faceman')).toMatchObject({ displayName: 'Faceman' })
    expect(getCoreArchetype('archetype.core.battlefield-tech')).toMatchObject({ displayName: 'Battlefield Tech' })
  })

  it.each(['archetype.core.tanker', 'archetype.core.elemental', 'archetype.core.scout', 'archetype.core.faceman', 'archetype.core.battlefield-tech'])('round-trips governed %s active data unchanged', (archetypeId) => {
    const character = createCharacterFromArchetype(archetypeId, 'Governance Audit')
    expect(decodeCharacter(encodeCharacter(character))).toEqual(character)
  })
})
