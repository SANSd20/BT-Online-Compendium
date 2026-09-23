import { describe, expect, it } from 'vitest'
import { createCharacterDraft } from '../engine/characterFactory'
import { validateCharacter } from './validateCharacter'

function character() {
  let id = 0
  return createCharacterDraft('point-buy', 'Validator', {
    now: () => '3025-01-01T00:00:00.000Z',
    id: () => `id-${++id}`,
  })
}

describe('validateCharacter', () => {
  it('accepts a foundation draft', () => {
    expect(validateCharacter(character()).valid).toBe(true)
  })

  it('reports invalid identity references without applying a blanket override', () => {
    const source = character()
    source.traits.push({
      traitId: 'trait.wealth',
      accumulatedXp: 0,
      attainedTp: null,
      active: false,
      identityId: 'missing-identity',
      parameters: {},
      sourceAwards: [],
    })
    const result = validateCharacter(source)
    expect(result.valid).toBe(false)
    expect(result.issues[0]).toMatchObject({
      id: 'trait.identity.reference',
      gmOverrideAllowed: false,
    })
  })
})
