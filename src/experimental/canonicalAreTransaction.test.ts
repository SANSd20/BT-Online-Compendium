import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { FREE_WORLDS_LEAGUE_ID } from '../domain/lifeModules/affiliations'
import { createLifeModuleCharacter, applyUniversalStage0 } from '../engine/lifeModuleEngine'
import { normalizeCanonicalExport } from './canonicalAreNormalization'
import { buildCanonicalAreTransaction, choiceStateForCanonicalPackage } from './canonicalAreTransaction'
import { selectChoice } from './choiceEditing'

const raw = JSON.parse(readFileSync('C:/Users/boill/Documents/ChatGPT/AToW Codex/AToW-Reference-Data/exports/free-worlds-league-export.json', 'utf8'))
const normalized = normalizeCanonicalExport(raw, 'c83652c36cb5078aaadc072dea5f57dcad1fd563')
const capellanRaw = JSON.parse(readFileSync('C:/Users/boill/Documents/ChatGPT/AToW Codex/AToW-Reference-Data/exports/capellan-confederation-export.json', 'utf8'))
const capellan = normalizeCanonicalExport(capellanRaw, 'c83652c36cb5078aaadc072dea5f57dcad1fd563')

function resolveAll(normalizedExport: typeof normalized, packageId: string) {
  let choices = choiceStateForCanonicalPackage(normalizedExport, packageId)
  for (const grant of choices.grants) {
    const destination = grant.domain.includes('trait')
      ? { type: 'trait' as const, traitId: 'trait.pain-resistance', subject: 'Pain Resistance' }
      : grant.domain.includes('language')
        ? { type: 'skill' as const, skillId: 'skill.language', subject: 'Greek' }
        : { skillId: 'skill.art', subject: 'Painting' }
    choices = selectChoice(choices, grant.occurrenceId, destination)
  }
  return choices
}

describe('generic canonical ARE transaction boundary', () => {
  it('initializes and commits a canonical parent without a faction dispatch branch', () => {
    const packageId = 'affiliation.free-worlds-league'
    let choices = choiceStateForCanonicalPackage(normalized, packageId)
    choices = selectChoice(choices, choices.grants[0].occurrenceId, { type: 'skill', skillId: 'skill.language', subject: 'Greek' })
    choices = selectChoice(choices, choices.grants[1].occurrenceId, { skillId: 'skill.art', subject: 'Painting' })
    const character = applyUniversalStage0(createLifeModuleCharacter('canonical ARE'), FREE_WORLDS_LEAGUE_ID, 'English')
    const transaction = buildCanonicalAreTransaction({ character, normalized, packageId, choices })
    expect(transaction.status).toBe('validated')
    expect(transaction.selectedAwardXp).toBe(25)
    expect(transaction.prospectiveState?.creation.lifeModules?.phase).toBe('stage-1-selection')
    expect(transaction.prospectiveState?.lifeModuleHistory.at(-1)?.moduleId).toBe(packageId)
  })

  it('rejects incomplete canonical choices without mutating the base character', () => {
    const character = applyUniversalStage0(createLifeModuleCharacter('canonical ARE incomplete'), FREE_WORLDS_LEAGUE_ID, 'English')
    const transaction = buildCanonicalAreTransaction({ character, normalized, packageId: 'affiliation.free-worlds-league', choices: choiceStateForCanonicalPackage(normalized, 'affiliation.free-worlds-league') })
    expect(transaction.status).toBe('failed')
    expect(transaction.prospectiveState).toBeNull()
    expect(character.creation.lifeModules?.phase).toBe('stage-0-affiliation')
  })

  it('commits every FWL and Capellan canonical context through the same transaction function', () => {
    const matrix = [...normalized.packages.map((entry) => [normalized, entry.identity] as const), ...capellan.packages.map((entry) => [capellan, entry.identity] as const)]
    for (const [source, packageId] of matrix) {
      const character = applyUniversalStage0(createLifeModuleCharacter(packageId), FREE_WORLDS_LEAGUE_ID, 'English')
      const transaction = buildCanonicalAreTransaction({ character, normalized: source, packageId, choices: resolveAll(source, packageId) })
      expect(transaction.status, packageId).toBe('validated')
      expect(transaction.prospectiveState?.creation.lifeModules?.phase, packageId).toBe('stage-1-selection')
      expect(transaction.provenance.length, packageId).toBeGreaterThan(0)
    }
  })
})
