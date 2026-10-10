import { describe, expect, it } from 'vitest'
import { createCharacterDraft } from '../../engine/characterFactory'
import { deriveCharacterRecordSheet } from './recordSheet'

describe('deterministic character record-sheet derivation', () => {
  it('derives source-backed Attributes, combat capacity, movement, and unsupported TN/C explicitly', () => {
    const character = createCharacterDraft('life-modules', 'Record sheet test')
    character.attributes = ['STR', 'BOD', 'RFL', 'DEX', 'INT', 'WIL', 'CHA', 'EDG'].map((attributeId) => ({ attributeId, accumulatedXp: 400, purchasedLevel: 4, phenotypeModifier: 0, sourceAwards: [] }))
    character.skills = [
      { address: { skillId: 'skill.running' }, displayName: 'Running', accumulatedXp: 20, level: 0, sourceAwards: [] },
      { address: { skillId: 'skill.martial-arts' }, displayName: 'Martial Arts', accumulatedXp: 20, level: 0, specialty: 'Grappling', sourceAwards: [] },
    ]
    const sheet = deriveCharacterRecordSheet(character)
    expect(sheet.attributes.find((entry) => entry.attributeId === 'STR')).toMatchObject({ score: { value: 4 }, linkModifier: { value: 0 }, legal: true })
    expect(sheet.combat.standardDamage.value).toBe(8)
    expect(sheet.combat.fatigueDamage.value).toBe(8)
    expect(sheet.combat.movement).toMatchObject({ walk: { value: 8 }, run: { value: 18 }, sprint: { value: 36 }, crawl: { value: 2 } })
    expect(sheet.skills.find((entry) => entry.displayName === 'Martial Arts')).toMatchObject({ specialty: 'Grappling', level: { value: 0 }, tnComplexity: { status: 'unsupported' } })
  })

  it('does not mutate character state and classifies active equipment metadata as inert', () => {
    const character = createCharacterDraft('life-modules', 'Equipment record test')
    const before = structuredClone(character)
    const sheet = deriveCharacterRecordSheet(character)
    expect(character).toEqual(before)
    expect(sheet.equipment).toHaveLength(0)
    expect(sheet.outstanding).toContain('Final Touches equipment state is not initialized.')
  })
})
