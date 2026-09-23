import { describe, expect, it } from 'vitest'
import type { CreationMethod } from '../domain/character/model'
import { createCharacterDraft } from './characterFactory'

const methods: CreationMethod[] = ['archetype', 'point-buy', 'life-modules']

describe('createCharacterDraft', () => {
  it.each(methods)('uses the shared character model for %s', (method) => {
    let id = 0
    const character = createCharacterDraft(method, '  Morgan Kell  ', {
      now: () => '3025-01-01T00:00:00.000Z',
      id: () => `id-${++id}`,
    })

    expect(character.creation.method).toBe(method)
    expect(character.displayName).toBe('Morgan Kell')
    expect(character.xp).toEqual({
      creation: { starting: 0, remaining: 0, allocated: 0 },
      earnedGameplayUnspent: 0,
    })
    expect(character.identities.entries).toHaveLength(1)
    expect(character.creation.rulesSnapshot.sources).toHaveLength(3)
    expect(character.creation.gmExceptions).toEqual([])
  })
})

