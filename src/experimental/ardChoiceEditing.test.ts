import { describe, expect, it } from 'vitest'
import { choiceStateFromArdExport } from './ardExportAdapter'
import { clearChoice, reconcileChoices, replaceChoice, selectChoice } from './choiceEditing'
import artifact from './generated/fwl-export.json'

const record = 'affiliation.fwl.other-fwl-worlds'

describe('generated ARD choice editing', () => {
  it('recognizes all six generated FWL contexts without inventing choices', () => {
    const contexts = artifact.records.map((entry) => entry.id)
    expect(contexts).toHaveLength(6)
    for (const context of contexts) expect(choiceStateFromArdExport(context).grants).toBeDefined()
    const other = artifact.records.find((entry) => entry.id === record)!
    expect(other.choices.map((choice) => choice.id)).toEqual(['language-any', 'skill-any', 'trait-any', 'flexible'])
    const flexible = other.awards.find((award) => award.kind === 'flexible')
    expect(flexible && 'targetTypes' in flexible ? flexible.targetTypes : undefined).toEqual(['attribute', 'trait', 'language-skill'])
    expect(other.choices.find((choice) => choice.id === 'trait-any')).toMatchObject({ kind: 'trait', domain: 'trait-any', required: true })
  })

  it('drives Other FWL language, repeated Skills, and flexible choices', () => {
    let state = choiceStateFromArdExport(record)
    expect(state.grants.map((grant) => grant.occurrenceId)).toEqual([
      `${record}.language-any`, `${record}.skill-any/1`, `${record}.skill-any/2`, `${record}.trait-any`, `${record}.flexible`,
    ])
    state = selectChoice(state, `${record}.language-any`, { type: 'skill', skillId: 'skill.language', subject: 'Greek' })
    state = selectChoice(state, `${record}.skill-any/1`, { skillId: 'skill.art', subject: 'Painting' })
    state = selectChoice(state, `${record}.skill-any/2`, { skillId: 'skill.interest', subject: 'History' })
    state = selectChoice(state, `${record}.trait-any`, { type: 'trait', traitId: 'trait.pain-resistance' })
    state = selectChoice(state, `${record}.flexible`, { type: 'attribute', attributeId: 'INT' })
    expect(reconcileChoices(state).pendingOccurrenceIds).toEqual([])
    expect(reconcileChoices(state).totalXp).toBe(100)
    state = clearChoice(state, `${record}.skill-any/1`)
    expect(reconcileChoices(state).pendingOccurrenceIds).toEqual([`${record}.skill-any/1`])
    state = replaceChoice(state, `${record}.skill-any/2`, { skillId: 'skill.art', subject: 'Sculpture' })
    expect(reconcileChoices(state).resolved.find((entry) => entry.occurrenceId.endsWith('/2'))).toMatchObject({ subject: 'Sculpture' })
  })

  it('supports flexible Attribute, Trait, and Language Skill destinations while rejecting generic Skills', () => {
    const flexible = `${record}.flexible`
    let state = selectChoice(choiceStateFromArdExport(record), flexible, { type: 'attribute', attributeId: 'CHA' })
    state = replaceChoice(state, flexible, { type: 'trait', traitId: 'trait.wealth' })
    state = replaceChoice(state, flexible, { type: 'skill', skillId: 'skill.language', subject: 'French' })
    expect(reconcileChoices(state).resolved[0]).toMatchObject({ occurrenceId: flexible, xp: 25, provenanceId: `${record}:flexible/1` })
    expect(() => replaceChoice(state, flexible, { type: 'skill', skillId: 'skill.art', subject: 'Painting' })).toThrow()
    expect(reconcileChoices(state).resolved[0]).toMatchObject({ skillId: 'skill.language', subject: 'French' })
  })

  it('requires and preserves the governed Trait choice through clear and replacement', () => {
    const occurrence = `${record}.trait-any`
    let state = selectChoice(choiceStateFromArdExport(record), occurrence, { type: 'trait', traitId: 'trait.gregarious' })
    expect(reconcileChoices(state).totalXp).toBe(35)
    state = clearChoice(state, occurrence)
    expect(reconcileChoices(state).pendingOccurrenceIds).toContain(occurrence)
    state = replaceChoice(state, occurrence, { type: 'trait', traitId: 'trait.reputation' })
    expect(reconcileChoices(state).resolved[0]).toMatchObject({ traitId: 'trait.reputation', xp: 35 })
    expect(() => replaceChoice(state, occurrence, { type: 'attribute', attributeId: 'INT' })).toThrow()
  })

  it('rejects invalid generated-package edits without mutating prior selections', () => {
    const occurrence = `${record}.skill-any/1`
    const state = selectChoice(choiceStateFromArdExport(record), occurrence, { skillId: 'skill.art', subject: 'Painting' })
    expect(() => replaceChoice(state, occurrence, { skillId: 'skill.medtech', subject: 'Bad' })).toThrow()
    expect(reconcileChoices(state).resolved).toHaveLength(1)
  })
})
