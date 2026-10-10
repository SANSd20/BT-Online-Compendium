import { describe, expect, it } from 'vitest'
import { createCharacterDraft } from '../../engine/characterFactory'
import { attributeLegality } from './attributeLegality'
import { getPhenotypeDefinition } from './phenotypes'

describe('source-backed phenotype and Attribute legality', () => {
  it('preserves the corrected-printing phenotype table', () => {
    expect(getPhenotypeDefinition('phenotype.normal-human')?.maximums).toEqual({ STR: 8, BOD: 8, DEX: 8, RFL: 8, INT: 8, WIL: 8, CHA: 9, EDG: 9 })
    expect(getPhenotypeDefinition('phenotype.elemental')?.modifiers).toEqual({ STR: 2, BOD: 1, DEX: -1 })
    expect(getPhenotypeDefinition('phenotype.aerospace')?.maximums.DEX).toBe(9)
  })

  it('separates XP score, phenotype modifier, and Exceptional Attribute maximum', () => {
    const character = createCharacterDraft('life-modules', 'Phenotype test', { now: () => '2026-01-01', id: (() => { let n = 0; return () => `id-${++n}` })() })
    character.phenotypeId = 'phenotype.elemental'
    character.attributes = [{ attributeId: 'STR', accumulatedXp: 800, purchasedLevel: 8, phenotypeModifier: 0, sourceAwards: [] }]
    expect(attributeLegality(character, 'STR')).toMatchObject({ baseScore: 8, phenotypeModifier: 2, effectiveScore: 10, phenotypeMaximum: 9, effectiveMaximum: 9, legal: false })
    character.traits.push({ traitId: 'trait.exceptional-attribute', displayName: 'Exceptional Attribute/STR', accumulatedXp: 200, attainedTp: 2, active: true, parameters: { attribute: 'STR' }, sourceAwards: [] })
    expect(attributeLegality(character, 'STR')).toMatchObject({ effectiveMaximum: 10, legal: true })
  })
})
