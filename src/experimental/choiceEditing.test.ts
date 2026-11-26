import { describe, expect, it } from 'vitest'
import { clearChoice, reconcileChoices, replaceChoice, selectChoice, type ChoiceState } from './choiceEditing'

const initial: ChoiceState = { grants: [
  { occurrenceId: 'synthetic.skills/1', domain: 'synthetic-skill', xp: 10, provenanceId: 'p1', allowedSkillIds: ['skill.art', 'skill.interest'] },
  { occurrenceId: 'synthetic.skills/2', domain: 'synthetic-skill', xp: 10, provenanceId: 'p2', allowedSkillIds: ['skill.art', 'skill.interest'] },
  { occurrenceId: 'synthetic.skills/3', domain: 'synthetic-skill', xp: 10, provenanceId: 'p3', allowedSkillIds: ['skill.art', 'skill.interest'] },
], selections: [] }
const art = (subject: string) => ({ skillId: 'skill.art', subject })
const destinations: ChoiceState = { grants: [
  { occurrenceId: 'synthetic.attribute', domain: 'attribute', xp: 25, provenanceId: 'attribute-source', allowedDestinationTypes: ['attribute'], allowedAttributeIds: ['INT', 'WIL'] },
  { occurrenceId: 'synthetic.trait', domain: 'trait', xp: 35, provenanceId: 'trait-source', allowedDestinationTypes: ['trait'], allowedTraitIds: ['trait.wealth'] },
  { occurrenceId: 'synthetic.language', domain: 'language', xp: 20, provenanceId: 'language-source', allowedDestinationTypes: ['skill'], allowedSkillIds: ['skill.language'] },
], selections: [] }

describe('ARE generic choice editing', () => {
  it('selects, clears, replaces, and reconciles independently', () => {
    let state = selectChoice(initial, 'synthetic.skills/1', art('Painting'))
    state = selectChoice(state, 'synthetic.skills/2', art('Sculpture'))
    expect(reconcileChoices(state).pendingOccurrenceIds).toEqual(['synthetic.skills/3'])
    state = replaceChoice(state, 'synthetic.skills/1', { skillId: 'skill.interest', subject: 'History' })
    expect(reconcileChoices(state).resolved).toEqual(expect.arrayContaining([expect.objectContaining({ subject: 'History' }), expect.objectContaining({ subject: 'Sculpture' })]))
    state = clearChoice(state, 'synthetic.skills/2')
    expect(reconcileChoices(state).pendingOccurrenceIds).toEqual(['synthetic.skills/2', 'synthetic.skills/3'])
    expect(reconcileChoices(state).totalXp).toBe(10)
  })

  it('is order-independent and preserves identical destinations, XP, and provenance', () => {
    const forward = selectChoice(selectChoice(initial, 'synthetic.skills/1', art('Painting')), 'synthetic.skills/2', art('Painting'))
    const reverse = selectChoice(selectChoice(initial, 'synthetic.skills/2', art('Painting')), 'synthetic.skills/1', art('Painting'))
    expect(reconcileChoices(forward)).toEqual(reconcileChoices(reverse))
    expect(reconcileChoices(forward).resolved.map((entry) => entry.provenanceId)).toEqual(['p1', 'p2'])
    expect(reconcileChoices(forward).totalXp).toBe(20)
  })

  it('rejects invalid edits atomically', () => {
    const valid = selectChoice(initial, 'synthetic.skills/1', art('Painting'))
    expect(() => selectChoice(valid, 'synthetic.skills/1', { skillId: 'skill.negotiation', subject: 'Bad' })).toThrow()
    expect(reconcileChoices(valid).resolved).toHaveLength(1)
    expect(() => clearChoice(valid, 'missing')).toThrow()
  })

  it('edits Attribute, Trait, and restricted Language Skill destinations generically', () => {
    let state = selectChoice(destinations, 'synthetic.attribute', { type: 'attribute', attributeId: 'INT' })
    state = selectChoice(state, 'synthetic.trait', { type: 'trait', traitId: 'trait.wealth' })
    state = selectChoice(state, 'synthetic.language', { type: 'skill', skillId: 'skill.language', subject: 'French' })
    expect(reconcileChoices(state).totalXp).toBe(80)
    state = replaceChoice(state, 'synthetic.attribute', { type: 'attribute', attributeId: 'WIL' })
    state = replaceChoice(state, 'synthetic.trait', { type: 'trait', traitId: 'trait.wealth', subject: 'earned' })
    expect(reconcileChoices(state).resolved.map((entry) => entry.provenanceId)).toEqual(['attribute-source', 'language-source', 'trait-source'])
    expect(() => replaceChoice(state, 'synthetic.language', { type: 'skill', skillId: 'skill.art', subject: 'Painting' })).toThrow()
    expect(reconcileChoices(state).resolved).toHaveLength(3)
  })

  it('rejects wrong destination types and preserves prior valid state atomically', () => {
    const valid = selectChoice(destinations, 'synthetic.attribute', { type: 'attribute', attributeId: 'INT' })
    expect(() => replaceChoice(valid, 'synthetic.attribute', { type: 'trait', traitId: 'trait.wealth' })).toThrow()
    expect(reconcileChoices(valid).resolved[0]).toMatchObject({ type: 'attribute', attributeId: 'INT', xp: 25, provenanceId: 'attribute-source' })
    expect(() => selectChoice(valid, 'missing', { type: 'attribute', attributeId: 'INT' })).toThrow()
  })
})
