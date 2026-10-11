import { describe, expect, it } from 'vitest'
import { createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { createPointBuyCharacter, setPointBuySkill } from '../../engine/pointBuyEngine'
import { createCharacterFromArchetype } from '../../engine/archetypeFactory'
import { enterFinalTouches, markReadyForEquipmentReview } from '../../engine/finalTouchesEngine'
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

  it('keeps Point Buy method legality distinct from Life Module Final Review', () => {
    let character = createPointBuyCharacter('Point Buy readiness', 860)
    expect(evaluateCharacterReadiness(character).blockers.some((item) => item.id === 'life-modules.incomplete')).toBe(false)
    expect(evaluateCharacterReadiness(character).blockers.some((item) => item.id === 'final-touches.required')).toBe(true)
    character = setPointBuySkill(character, 'skill.perception', 0)
    character = setPointBuySkill(character, 'skill.language', 0, 'English')
    character = setPointBuySkill(character, 'skill.language', 0, 'Spanish')
    character = enterFinalTouches(character)
    character = markReadyForEquipmentReview(character)
    expect(evaluateCharacterReadiness(character).status).toBe('ready-for-play')
  })

  it('allows a valid Archetype foundation to use the shared Final Touches readiness path', () => {
    let character = createCharacterFromArchetype('archetype.core.mechwarrior', 'Archetype readiness')
    expect(evaluateCharacterReadiness(character).blockers.some((item) => item.id === 'life-modules.incomplete')).toBe(false)
    character = enterFinalTouches(character)
    character = markReadyForEquipmentReview(character)
    expect(evaluateCharacterReadiness(character).status).toBe('ready-for-play')
  })

  it('does not treat unsupported record-sheet automation as a legality blocker', () => {
    const character = createCharacterFromArchetype('archetype.core.scout', 'Record sheet advisory')
    const evaluation = evaluateCharacterReadiness(markReadyForEquipmentReview(enterFinalTouches(character)))
    expect(evaluation.blockers.some((item) => item.area === 'record-sheet')).toBe(false)
    expect(evaluation.advisories.some((item) => item.id === 'record-sheet.tn-complexity')).toBe(true)
  })
})
