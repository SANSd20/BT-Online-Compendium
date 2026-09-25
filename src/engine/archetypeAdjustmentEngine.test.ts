import { describe, expect, it } from 'vitest'
import { getCoreArchetype } from '../domain/archetypes/coreArchetypes'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { validateCharacter } from '../validation/validateCharacter'
import {
  archetypeSkillTargetId,
  getArchetypeAdjustmentBalance,
  removeArchetypeAdjustment,
  setArchetypeAttributeAdjustment,
  setArchetypeSkillAdjustment,
} from './archetypeAdjustmentEngine'
import { createCharacterFromArchetype } from './archetypeFactory'

function dependencies() {
  let id = 0
  return { now: () => '3071-01-01T00:00:00.000Z', id: () => `adjustment-${++id}` }
}

describe('Controlled Archetype Adjustments', () => {
  it('accepts balanced Attribute adjustments while preserving the source package', () => {
    const sourceBefore = structuredClone(getCoreArchetype('archetype.core.mechwarrior'))
    const deps = dependencies()
    let character = createCharacterFromArchetype('archetype.core.mechwarrior', 'Balanced Attributes')
    character = setArchetypeAttributeAdjustment(character, 'STR', 5, 'Shift physical emphasis', deps)
    expect(getArchetypeAdjustmentBalance(character)).toMatchObject({ netXp: 100, balanced: false })
    expect(validateCharacter(character).issues.some((entry) => entry.id === 'archetype.adjustments.unbalanced')).toBe(true)

    character = setArchetypeAttributeAdjustment(character, 'BOD', 4, undefined, deps)
    expect(getArchetypeAdjustmentBalance(character)).toEqual({ positiveXp: 100, negativeXp: -100, netXp: 0, balanced: true })
    expect(validateCharacter(character).valid).toBe(true)
    expect(character.creation.archetype?.customizationStatus).toBe('controlled-adjustments')
    expect(character.creation.archetype?.adjustmentLedger).toHaveLength(2)
    expect(getCoreArchetype('archetype.core.mechwarrior')).toEqual(sourceBefore)
  })

  it('accepts balanced existing-Skill adjustments and rejects an unbalanced draft', () => {
    const definition = getCoreArchetype('archetype.core.mechwarrior')
    const art = definition.skills.find((entry) => entry.address.skillId === 'skill.art')!
    const computers = definition.skills.find((entry) => entry.address.skillId === 'skill.computers')!
    const deps = dependencies()
    let character = createCharacterFromArchetype(definition.id, 'Balanced Skills')
    character = setArchetypeSkillAdjustment(character, archetypeSkillTargetId(art.address), 1, undefined, deps)
    expect(getArchetypeAdjustmentBalance(character).netXp).toBe(10)
    expect(character.creation.status).toBe('draft')
    expect(validateCharacter(character).valid).toBe(false)
    expect(() => encodeCharacter(character)).toThrow('Unbalanced Controlled Archetype Adjustments')

    character = setArchetypeSkillAdjustment(character, archetypeSkillTargetId(computers.address), 0, undefined, deps)
    expect(getArchetypeAdjustmentBalance(character).balanced).toBe(true)
    expect(validateCharacter(character).valid).toBe(true)
    expect(character.skills.find((entry) => entry.address.skillId === 'skill.art')?.level).toBe(1)
    expect(character.skills.find((entry) => entry.address.skillId === 'skill.computers')?.level).toBe(0)
  })

  it('removes adjustments reversibly and round-trips a balanced ledger', () => {
    const deps = dependencies()
    let character = createCharacterFromArchetype('archetype.core.mechwarrior', 'Round Trip')
    character = setArchetypeAttributeAdjustment(character, 'STR', 5, undefined, deps)
    character = setArchetypeAttributeAdjustment(character, 'BOD', 4, undefined, deps)
    const restored = decodeCharacter(encodeCharacter(character, '3071-01-02T00:00:00.000Z'))
    expect(restored).toEqual(character)

    const firstId = restored.creation.archetype!.adjustmentLedger[0].id
    const secondId = restored.creation.archetype!.adjustmentLedger[1].id
    let reverted = removeArchetypeAdjustment(restored, firstId)
    expect(getArchetypeAdjustmentBalance(reverted).netXp).toBe(-100)
    reverted = removeArchetypeAdjustment(reverted, secondId)
    expect(reverted.creation.archetype?.adjustmentLedger).toEqual([])
    expect(reverted.creation.archetype?.customizationStatus).toBe('original-package')
    expect(reverted.attributes.find((entry) => entry.attributeId === 'STR')).toMatchObject({ purchasedLevel: 4, accumulatedXp: 400 })
    expect(reverted.attributes.find((entry) => entry.attributeId === 'BOD')).toMatchObject({ purchasedLevel: 5, accumulatedXp: 500 })
    expect(validateCharacter(reverted).valid).toBe(true)
  })
})
