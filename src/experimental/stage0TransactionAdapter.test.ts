import { describe, expect, it } from 'vitest'
import { FREE_WORLDS_LEAGUE_ID } from '../domain/lifeModules/affiliations'
import { createLifeModuleCharacter } from '../engine/lifeModuleEngine'
import { applyUniversalStage0 } from './dataDrivenStage0'
import { choiceStateFromArdExport } from './ardExportAdapter'
import { selectChoice } from './choiceEditing'
import { areFwlHistoryAuthority, buildAreStage0Transaction, commitAreStage0Transaction } from './stage0TransactionAdapter'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'

const parent = 'affiliation.fwl.parent'

describe('ARE Stage 0 shared transaction adapter', () => {
  it('commits a fully resolved generated parent context through shared infrastructure', () => {
    let choices = choiceStateFromArdExport(parent)
    choices = selectChoice(choices, `${parent}.secondary-language`, { type: 'skill', skillId: 'skill.language', subject: 'Greek' })
    choices = selectChoice(choices, `${parent}.art-any`, { type: 'skill', skillId: 'skill.art', subject: 'Painting' })
    const character = applyUniversalStage0(createLifeModuleCharacter('ARE parent'), FREE_WORLDS_LEAGUE_ID, 'English')
    const transaction = buildAreStage0Transaction({ character, recordId: FREE_WORLDS_LEAGUE_ID, choiceState: choices })
    expect(transaction.status).toBe('validated')
    const committed = commitAreStage0Transaction({ character, recordId: FREE_WORLDS_LEAGUE_ID, choiceState: choices })
    expect(committed.lifeModuleHistory.at(-1)?.moduleId).toBe(FREE_WORLDS_LEAGUE_ID)
    expect(committed.lifeModuleHistory.at(-1)?.provenanceIds).toHaveLength(1)
    expect(committed.creation.lifeModules?.pendingAwards).toEqual([])
    expect(committed.skills.some((entry) => entry.address.skillId === 'skill.art' && entry.address.parameter?.value === 'Painting')).toBe(true)
    expect(committed.xp.creation.remaining).toBe(4150)
  })

  it('rejects unresolved choices without mutating or committing the base character', () => {
    const character = applyUniversalStage0(createLifeModuleCharacter('ARE incomplete'), FREE_WORLDS_LEAGUE_ID, 'English')
    expect(() => buildAreStage0Transaction({ character, recordId: FREE_WORLDS_LEAGUE_ID, choiceState: choiceStateFromArdExport(parent) })).toThrow('choices are incomplete')
    expect(character.lifeModuleHistory).toHaveLength(1)
    expect(character.creation.lifeModules?.phase).toBe('stage-0-affiliation')
  })

  it.each([
    ['stage0.free-worlds-league.duchy-andurien', 'affiliation.fwl.duchy-of-andurien'],
    ['stage0.free-worlds-league.duchy-oriente', 'affiliation.fwl.duchy-of-oriente'],
    ['stage0.free-worlds-league.marik-commonwealth', 'affiliation.fwl.marik-commonwealth'],
    ['stage0.free-worlds-league.principality-regulus', 'affiliation.fwl.principality-of-regulus'],
  ])('commits generated fixed-award context %s', (recordId, rawRecordId) => {
    const character = applyUniversalStage0(createLifeModuleCharacter(recordId), FREE_WORLDS_LEAGUE_ID, 'English')
    const choices = choiceStateFromArdExport(rawRecordId)
    const committed = commitAreStage0Transaction({ character, recordId, choiceState: choices })
    expect(committed.lifeModuleHistory.at(-1)?.moduleId).toBe(recordId)
    expect(committed.creation.lifeModules?.phase).toBe('stage-1-selection')
    expect(committed.creation.lifeModules?.pendingAwards).toEqual([])
  })

  it('commits Other FWL Worlds only after all generated choices resolve', () => {
    const recordId = 'stage0.free-worlds-league.other-worlds'
    const rawRecordId = 'affiliation.fwl.other-fwl-worlds'
    let choices = choiceStateFromArdExport(rawRecordId)
    choices = selectChoice(choices, `${rawRecordId}.language-any`, { type: 'skill', skillId: 'skill.language', subject: 'Greek' })
    choices = selectChoice(choices, `${rawRecordId}.skill-any/1`, { type: 'skill', skillId: 'skill.art', subject: 'Painting' })
    choices = selectChoice(choices, `${rawRecordId}.skill-any/2`, { type: 'skill', skillId: 'skill.interest', subject: 'History' })
    choices = selectChoice(choices, `${rawRecordId}.trait-any`, { type: 'trait', traitId: 'trait.pain-resistance', subject: 'Pain Resistance' })
    choices = selectChoice(choices, `${rawRecordId}.flexible`, { type: 'attribute', attributeId: 'STR' })
    const character = applyUniversalStage0(createLifeModuleCharacter('Other FWL Worlds'), FREE_WORLDS_LEAGUE_ID, 'English')
    const committed = commitAreStage0Transaction({ character, recordId, choiceState: choices })
    expect(committed.lifeModuleHistory.at(-1)?.moduleId).toBe(recordId)
    expect(committed.creation.lifeModules?.pendingAwards).toEqual([])
    expect(committed.skills.some((entry) => entry.address.skillId === 'skill.art')).toBe(true)
    expect(committed.traits.some((entry) => entry.traitId === 'trait.pain-resistance')).toBe(true)
  })

  it('round-trips a committed ARE character through the existing JSON codec with trusted ARE authority', () => {
    let choices = choiceStateFromArdExport(parent)
    choices = selectChoice(choices, `${parent}.secondary-language`, { type: 'skill', skillId: 'skill.language', subject: 'Greek' })
    choices = selectChoice(choices, `${parent}.art-any`, { type: 'skill', skillId: 'skill.art', subject: 'Painting' })
    const character = applyUniversalStage0(createLifeModuleCharacter('ARE persistence'), FREE_WORLDS_LEAGUE_ID, 'English')
    const committed = commitAreStage0Transaction({ character, recordId: FREE_WORLDS_LEAGUE_ID, choiceState: choices })
    const restored = decodeCharacter(encodeCharacter(committed, '2026-10-26T00:00:00.000Z'), { lifeModuleHistoryAuthority: areFwlHistoryAuthority() })
    expect(restored).toEqual(committed)
  })

  it.each([
    ['stage0.free-worlds-league.duchy-andurien', 'affiliation.fwl.duchy-of-andurien'],
    ['stage0.free-worlds-league.duchy-oriente', 'affiliation.fwl.duchy-of-oriente'],
    ['stage0.free-worlds-league.marik-commonwealth', 'affiliation.fwl.marik-commonwealth'],
    ['stage0.free-worlds-league.principality-regulus', 'affiliation.fwl.principality-of-regulus'],
  ])('round-trips generated fixed context %s', (recordId, rawRecordId) => {
    const character = applyUniversalStage0(createLifeModuleCharacter(recordId), FREE_WORLDS_LEAGUE_ID, 'English')
    const committed = commitAreStage0Transaction({ character, recordId, choiceState: choiceStateFromArdExport(rawRecordId) })
    const restored = decodeCharacter(encodeCharacter(committed, '2026-10-26T00:00:00.000Z'), { lifeModuleHistoryAuthority: areFwlHistoryAuthority() })
    expect(restored).toEqual(committed)
    expect(restored.lifeModuleHistory.at(-1)?.moduleId).toBe(recordId)
  })

  it.each([
    ['attribute', { type: 'attribute', attributeId: 'STR' }],
    ['trait', { type: 'trait', traitId: 'trait.pain-resistance', subject: 'Pain Resistance' }],
    ['language skill', { type: 'skill', skillId: 'skill.language', subject: 'Russian' }],
  ] as const)('round-trips Other FWL Worlds with a flexible %s destination', (_label, flexibleDestination) => {
    const recordId = 'stage0.free-worlds-league.other-worlds'
    const rawRecordId = 'affiliation.fwl.other-fwl-worlds'
    let choices = choiceStateFromArdExport(rawRecordId)
    choices = selectChoice(choices, `${rawRecordId}.language-any`, { type: 'skill', skillId: 'skill.language', subject: 'Greek' })
    choices = selectChoice(choices, `${rawRecordId}.skill-any/1`, { type: 'skill', skillId: 'skill.art', subject: 'Painting' })
    choices = selectChoice(choices, `${rawRecordId}.skill-any/2`, { type: 'skill', skillId: 'skill.interest', subject: 'History' })
    choices = selectChoice(choices, `${rawRecordId}.trait-any`, { type: 'trait', traitId: 'trait.pain-resistance', subject: 'Pain Resistance' })
    choices = selectChoice(choices, `${rawRecordId}.flexible`, flexibleDestination)
    const character = applyUniversalStage0(createLifeModuleCharacter('Other FWL persistence'), FREE_WORLDS_LEAGUE_ID, 'English')
    const committed = commitAreStage0Transaction({ character, recordId, choiceState: choices })
    const restored = decodeCharacter(encodeCharacter(committed, '2026-10-26T00:00:00.000Z'), { lifeModuleHistoryAuthority: areFwlHistoryAuthority() })
    expect(restored).toEqual(committed)
    expect(restored.lifeModuleHistory.at(-1)?.moduleId).toBe(recordId)
    expect(restored.creation.lifeModules?.pendingAwards).toEqual([])
    expect(restored.skills.filter((entry) => entry.address.skillId === 'skill.art' || entry.address.skillId === 'skill.interest')).toHaveLength(2)
  })

})
