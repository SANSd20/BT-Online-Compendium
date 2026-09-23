import { describe, expect, it } from 'vitest'
import { createCharacterDraft } from '../engine/characterFactory'
import { BLUE_COLLAR_ID } from '../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, createLifeModuleCharacter } from '../engine/lifeModuleEngine'
import { decodeCharacter, encodeCharacter } from './characterCodec'

function character() {
  let id = 0
  return createCharacterDraft('life-modules', 'Test Pilot', {
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

  it('rejects a missing creation method', () => {
    const envelope = JSON.parse(encodeCharacter(character()))
    delete envelope.character.creation.method
    expect(() => decodeCharacter(JSON.stringify(envelope))).toThrow('Character creation method is invalid')
  })

  it('migrates Alpha Slice 4 pending-award saves without losing unresolved grants', () => {
    let source = createLifeModuleCharacter('Older Alpha Draft')
    source = applyUniversalStage0(source, 'Mandarin Chinese')
    source = applyCapellanCommonality(source, 'Russian')
    source = applyStage1Module(source, BLUE_COLLAR_ID)
    const envelope = JSON.parse(encodeCharacter(source))
    delete envelope.character.creation.lifeModules.resolvedAwards
    delete envelope.character.creation.lifeModules.choiceGrantRequirements
    delete envelope.character.creation.lifeModules.stopState
    delete envelope.character.creation.lifeModules.awardResolutionVersion
    delete envelope.character.creation.lifeModules.selectedSkillFields
    envelope.character.creation.lifeModules.pendingAwards.forEach((entry: Record<string, unknown>) => {
      delete entry.choiceSource
      delete entry.requiredSkillId
    })
    const restored = decodeCharacter(JSON.stringify(envelope))
    expect(restored.creation.lifeModules?.resolvedAwards).toEqual([])
    expect(restored.creation.lifeModules?.awardResolutionVersion).toBe(0)
    expect(restored.creation.lifeModules?.stopState).toBe('not-eligible')
    expect(restored.creation.lifeModules?.pendingAwards.find((entry) => entry.awardId === 'blue-collar.career')?.requiredSkillId).toBe('skill.career')
    expect(restored.creation.lifeModules?.choiceGrantRequirements).toHaveLength(4)
    expect(restored.creation.lifeModules?.selectedSkillFields).toEqual([])
  })
})
