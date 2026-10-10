import { describe, expect, it } from 'vitest'
import { deriveAging, deriveCharacterAge } from './aging'
import { createCharacterDraft } from '../../engine/characterFactory'

function characterAt(age: number) {
  const character = createCharacterDraft('life-modules', 'Aging test')
  character.attributes = ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG'].map((attributeId) => ({ attributeId, accumulatedXp: 300, purchasedLevel: 3, phenotypeModifier: 0, sourceAwards: [] }))
  character.chronology = [{ date: `age:${age}`, eventId: 'test.age', provenanceId: 'test' }]
  return character
}

describe('aging derivation', () => {
  it('uses committed chronology and has no effects below age 25', () => {
    const character = characterAt(24)
    expect(deriveCharacterAge(character)).toBe(24)
    expect(deriveAging(character).brackets).toHaveLength(0)
  })

  it('applies each published bracket once and leaves EDG unchanged', () => {
    const result = deriveAging(characterAt(101))
    expect(result.attributeXpAdjustments).toEqual({ STR: -600, BOD: -750, DEX: -600, RFL: -475, INT: -300, WIL: -225, CHA: -500 })
    expect(result.attributeXpAdjustments.EDG).toBeUndefined()
    expect(result.brackets.map((entry) => entry.age)).toEqual([25, 31, 41, 51, 61, 71, 81, 91, 101])
  })

  it('reports the published table boundary as unsupported beyond age 101', () => {
    expect(deriveAging(characterAt(102)).unsupported).toHaveLength(1)
  })
})
