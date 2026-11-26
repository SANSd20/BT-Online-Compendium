import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { FREE_WORLDS_LEAGUE_ID } from '../domain/lifeModules/affiliations'
import { createLifeModuleCharacter, applyUniversalStage0 } from '../engine/lifeModuleEngine'
import { encodeCharacter, decodeCharacter } from '../persistence/characterCodec'
import { normalizeCanonicalExport } from './canonicalAreNormalization'
import { buildCanonicalAreTransaction, choiceStateForCanonicalPackage } from './canonicalAreTransaction'
import { canonicalAreHistoryAuthority } from './canonicalArePersistence'
import { selectChoice } from './choiceEditing'

const raw = JSON.parse(readFileSync('C:/Users/boill/Documents/ChatGPT/AToW Codex/AToW-Reference-Data/exports/free-worlds-league-export.json', 'utf8'))
const normalized = normalizeCanonicalExport(raw, 'c83652c36cb5078aaadc072dea5f57dcad1fd563')

describe('generic canonical ARE trusted persistence', () => {
  it('round-trips a committed canonical package through the existing character format', () => {
    const packageId = 'affiliation.free-worlds-league'
    let choices = choiceStateForCanonicalPackage(normalized, packageId)
    choices = selectChoice(choices, choices.grants[0].occurrenceId, { type: 'skill', skillId: 'skill.language', subject: 'Greek' })
    choices = selectChoice(choices, choices.grants[1].occurrenceId, { skillId: 'skill.art', subject: 'Painting' })
    const character = applyUniversalStage0(createLifeModuleCharacter('trusted persistence'), FREE_WORLDS_LEAGUE_ID, 'English')
    const tx = buildCanonicalAreTransaction({ character, normalized, packageId, choices })
    expect(tx.prospectiveState).not.toBeNull()
    const restored = decodeCharacter(encodeCharacter(tx.prospectiveState!, '2026-11-07T00:00:00.000Z'), { lifeModuleHistoryAuthority: canonicalAreHistoryAuthority(normalized, packageId) })
    expect(restored).toEqual(tx.prospectiveState)
  })

  it('rejects forged canonical trust metadata without mutating the source character', () => {
    const packageId = 'affiliation.free-worlds-league'
    let choices = choiceStateForCanonicalPackage(normalized, packageId)
    choices = selectChoice(choices, choices.grants[0].occurrenceId, { type: 'skill', skillId: 'skill.language', subject: 'Greek' })
    choices = selectChoice(choices, choices.grants[1].occurrenceId, { skillId: 'skill.art', subject: 'Painting' })
    const character = applyUniversalStage0(createLifeModuleCharacter('forged trust'), FREE_WORLDS_LEAGUE_ID, 'English')
    const tx = buildCanonicalAreTransaction({ character, normalized, packageId, choices })
    const forged = structuredClone(tx.prospectiveState!)
    forged.lifeModuleHistory.at(-1)!.source.sourceId = 'forged-digest'
    expect(() => decodeCharacter(encodeCharacter(forged, '2026-11-07T00:00:00.000Z'), { lifeModuleHistoryAuthority: canonicalAreHistoryAuthority(normalized, packageId) })).toThrow('Canonical package trust metadata')
    expect(character.lifeModuleHistory).toHaveLength(1)
  })

})
