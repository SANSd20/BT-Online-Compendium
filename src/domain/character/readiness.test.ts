import { describe, expect, it } from 'vitest'
import { createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { evaluateCharacterReadiness, finalizeCharacterSnapshot } from './readiness'

describe('character readiness', () => {
  it('reports incomplete creation as a blocker and never trusts a cached state', () => {
    const character = createLifeModuleCharacter('Readiness draft')
    const evaluation = evaluateCharacterReadiness(character)
    expect(evaluation.status).toBe('incomplete')
    expect(evaluation.blockers.some((item) => item.id === 'life-modules.incomplete')).toBe(true)
    expect(() => finalizeCharacterSnapshot(character)).toThrow('not ready for play')
  })

  it('preserves old saves without snapshots as editable characters', () => {
    const character = createLifeModuleCharacter('Legacy draft')
    const legacy = structuredClone(character)
    delete legacy.finalizedSnapshots
    expect(evaluateCharacterReadiness(legacy).status).toBe('incomplete')
    expect(legacy.finalizedSnapshots).toBeUndefined()
  })
})
