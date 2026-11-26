import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createLifeModuleCharacter, applyUniversalStage0 } from '../engine/lifeModuleEngine'
import { FREE_WORLDS_LEAGUE_ID } from '../domain/lifeModules/catalog'
import { normalizeCanonicalExport } from './canonicalAreNormalization'
import { choiceStateForCanonicalPackage } from './canonicalAreTransaction'
import { clearChoice, replaceChoice, selectChoice } from './choiceEditing'
import { previewCanonicalAre } from './canonicalPreviewAdapter'

const revision = 'c83652c36cb5078aaadc072dea5f57dcad1fd563'
const artifact = JSON.parse(readFileSync('C:/Users/boill/Documents/ChatGPT/AToW Codex/AToW-Reference-Data/exports/free-worlds-league-export.json', 'utf8'))
const normalized = normalizeCanonicalExport(artifact, revision)
const other = 'affiliation.free-worlds-league.other-fwl-worlds'

function base() { return applyUniversalStage0(createLifeModuleCharacter('canonical preview'), FREE_WORLDS_LEAGUE_ID, 'English') }

function complete() {
  let state = choiceStateForCanonicalPackage(normalized, other)
  for (const grant of state.grants) state = selectChoice(state, grant.occurrenceId, grant.domain.includes('language') ? { type: 'skill', skillId: 'skill.language', subject: 'Spanish' } : grant.domain.includes('trait') ? { type: 'trait', traitId: 'trait.gregarious' } : grant.domain.includes('flexible') ? { type: 'attribute', attributeId: 'CHA' } : { type: 'skill', skillId: 'skill.interest', subject: grant.occurrenceId.endsWith('/1') ? 'Chess' : 'History' })
  return state
}

describe('generic canonical preview adapter', () => {
  it('represents incomplete choices without applying unearned choice XP', () => {
    const result = previewCanonicalAre({ character: base(), normalized, packageId: other, choices: choiceStateForCanonicalPackage(normalized, other) })
    expect(result.status).toBe('incomplete')
    expect(result.pendingOccurrenceIds.length).toBeGreaterThan(0)
    expect(result.selectedAwardXp).toBe(0)
    expect(result.character?.creation.lifeModules?.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining(result.pendingOccurrenceIds))
  })

  it('preserves typed destinations, subjects, XP, and provenance for a complete preview', () => {
    const result = previewCanonicalAre({ character: base(), normalized, packageId: other, choices: complete() })
    expect(result.status).toBe('preview')
    expect(result.pendingOccurrenceIds).toHaveLength(0)
    expect(result.selectedAwardXp).toBe(125)
    expect(result.character?.lifeModuleHistory.at(-1)?.provenanceIds.length).toBeGreaterThan(0)
    expect(result.character?.skills.some((entry) => entry.address.skillId === 'skill.language' && entry.address.parameter?.value === 'Spanish')).toBe(true)
    expect(result.character?.skills.some((entry) => entry.address.skillId === 'skill.interest' && entry.address.parameter?.value === 'History')).toBe(true)
  })

  it('supports clearing and replacing one canonical occurrence without affecting siblings', () => {
    const initial = complete()
    const first = initial.selections.find((entry) => entry.occurrenceId.includes('choice.other.skill.1'))!
    const cleared = clearChoice(initial, first.occurrenceId)
    expect(cleared.selections).toHaveLength(initial.selections.length - 1)
    const replaced = replaceChoice(cleared, first.occurrenceId, { type: 'skill', skillId: 'skill.interest', subject: 'Sailing' })
    expect(replaced.selections).toHaveLength(initial.selections.length)
    expect(replaced.selections.find((entry) => entry.occurrenceId === first.occurrenceId)).toMatchObject({ subject: 'Sailing' })
    expect(replaced.selections.filter((entry) => entry.occurrenceId !== first.occurrenceId)).toEqual(initial.selections.filter((entry) => entry.occurrenceId !== first.occurrenceId))
  })
})
