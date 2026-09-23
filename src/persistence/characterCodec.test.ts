import { describe, expect, it } from 'vitest'
import { createCharacterDraft } from '../engine/characterFactory'
import { decodeCharacter, encodeCharacter } from './characterCodec'

function character() {
  let id = 0
  return createCharacterDraft('point-buy', 'Test Pilot', {
    now: () => '3025-01-01T00:00:00.000Z',
    id: () => `id-${++id}`,
  })
}

describe('character codec', () => {
  it('round-trips a versioned character envelope', () => {
    const source = character()
    const restored = decodeCharacter(encodeCharacter(source, '3025-01-02T00:00:00.000Z'))
    expect(restored).toEqual(source)
  })

  it('preserves the distinction between untrained and level zero', () => {
    const source = character()
    source.skills = [
      { address: { skillId: 'skill.climbing' }, accumulatedXp: 0, level: null, sourceAwards: [] },
      { address: { skillId: 'skill.swimming' }, accumulatedXp: 20, level: 0, sourceAwards: [] },
    ]
    const restored = decodeCharacter(encodeCharacter(source))
    expect(restored.skills.map((skill) => skill.level)).toEqual([null, 0])
  })

  it('rejects an unrelated JSON document', () => {
    expect(() => decodeCharacter('{"hello":"world"}')).toThrow('Unsupported character file format')
  })
})
