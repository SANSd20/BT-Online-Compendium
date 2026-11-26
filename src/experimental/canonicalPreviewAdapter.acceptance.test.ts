import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { applyUniversalStage0, createLifeModuleCharacter } from '../engine/lifeModuleEngine'
import { FREE_WORLDS_LEAGUE_ID } from '../domain/lifeModules/catalog'
import { normalizeCanonicalExport, type NormalizedExport, type NormalizedPackage } from './canonicalAreNormalization'
import { choiceStateForCanonicalPackage } from './canonicalAreTransaction'
import { clearChoice, replaceChoice, selectChoice } from './choiceEditing'
import { previewCanonicalAre } from './canonicalPreviewAdapter'

const ARD_ROOT = 'C:/Users/boill/Documents/ChatGPT/AToW Codex/AToW-Reference-Data'
const REVISION = 'c83652c36cb5078aaadc072dea5f57dcad1fd563'
const fwl = normalizeCanonicalExport(JSON.parse(readFileSync(`${ARD_ROOT}/exports/free-worlds-league-export.json`, 'utf8')), REVISION)
const capellan = normalizeCanonicalExport(JSON.parse(readFileSync(`${ARD_ROOT}/exports/capellan-confederation-export.json`, 'utf8')), REVISION)
const otherFwl = 'affiliation.free-worlds-league.other-fwl-worlds'
const fwlParent = 'affiliation.free-worlds-league'
const capellanParent = 'affiliation.capellan-confederation'
const fwlChildren = fwl.packages.filter((entry) => entry.parentId).map((entry) => entry.identity)
const capellanChildren = capellan.packages.filter((entry) => entry.parentId).map((entry) => entry.identity)

function draft(label: string) { return applyUniversalStage0(createLifeModuleCharacter(label), FREE_WORLDS_LEAGUE_ID, 'English') }

function destinationFor(grant: ReturnType<typeof choiceStateForCanonicalPackage>['grants'][number], index: number) {
  if (grant.allowedDestinationTypes?.includes('attribute') && grant.domain.includes('flexible')) return { type: 'attribute' as const, attributeId: index % 2 ? 'EDG' : 'CHA' }
  if (grant.allowedDestinationTypes?.includes('trait')) return { type: 'trait' as const, traitId: 'trait.gregarious' }
  if (grant.allowedSkillIds?.includes('skill.language') || grant.domain.includes('language')) return { type: 'skill' as const, skillId: 'skill.language', subject: index % 2 ? 'Spanish' : 'Russian' }
  return { type: 'skill' as const, skillId: 'skill.interest', subject: index % 2 ? 'History' : 'Chess' }
}

function stateFor(normalized: NormalizedExport, packageId: string, complete = true) {
  let state = choiceStateForCanonicalPackage(normalized, packageId)
  if (!complete) return state
  state.grants.forEach((grant, index) => { state = selectChoice(state, grant.occurrenceId, destinationFor(grant, index)) })
  return state
}

function preview(normalized: NormalizedExport, packageId: string, complete = true, label = packageId) {
  return previewCanonicalAre({ character: draft(label), normalized, packageId, choices: stateFor(normalized, packageId, complete) })
}

describe('Audit-10 canonical preview adapter acceptance', () => {
  it.each([
    ['FWL parent → Capellan parent', fwl, fwlParent, capellan, capellanParent],
    ['Capellan parent → FWL parent', capellan, capellanParent, fwl, fwlParent],
    ['FWL child → Capellan child', fwl, fwlChildren[0], capellan, capellanChildren[0]],
    ['Capellan child → FWL child', capellan, capellanChildren[0], fwl, fwlChildren[0]],
    ['FWL parent → FWL child', fwl, fwlParent, fwl, fwlChildren[0]],
    ['FWL child → FWL parent', fwl, fwlChildren[0], fwl, fwlParent],
    ['Capellan parent → Capellan child', capellan, capellanParent, capellan, capellanChildren[0]],
    ['Capellan child → Capellan parent', capellan, capellanChildren[0], capellan, capellanParent],
    ['FWL child → different FWL child', fwl, fwlChildren[0], fwl, fwlChildren[1]],
    ['Capellan child → different Capellan child', capellan, capellanChildren[0], capellan, capellanChildren[1]],
  ])('%s recalculates from a fresh legal draft', (_label, firstExport, firstId, secondExport, secondId) => {
    const baseState = draft('transition')
    const before = JSON.stringify(baseState)
    const first = previewCanonicalAre({ character: baseState, normalized: firstExport, packageId: firstId, choices: stateFor(firstExport, firstId, true) })
    const second = previewCanonicalAre({ character: baseState, normalized: secondExport, packageId: secondId, choices: stateFor(secondExport, secondId, true) })
    expect(first.status).toBe('preview')
    expect(second.status).toBe('preview')
    expect(JSON.stringify(baseState)).toBe(before)
    expect(new Set(second.resolvedOccurrenceIds).size).toBe(second.resolvedOccurrenceIds.length)
    expect(second.provenance.length).toBeGreaterThan(0)
  })

  it('handles choice-heavy and choice-light repeated transitions deterministically', () => {
    const initial = draft('repeated')
    const first = previewCanonicalAre({ character: initial, normalized: fwl, packageId: otherFwl, choices: stateFor(fwl, otherFwl, true) })
    const second = previewCanonicalAre({ character: initial, normalized: fwl, packageId: fwlParent, choices: stateFor(fwl, fwlParent, true) })
    const third = previewCanonicalAre({ character: initial, normalized: fwl, packageId: otherFwl, choices: stateFor(fwl, otherFwl, true) })
    expect(first.status).toBe('preview')
    expect(second.status).toBe('preview')
    expect(third.status).toBe('preview')
    expect(third.selectedAwardXp).toBe(first.selectedAwardXp)
    expect(third.resolvedOccurrenceIds).toEqual(first.resolvedOccurrenceIds)
    expect(initial.lifeModuleHistory).toHaveLength(1)
  })

  it('keeps unresolved choice-heavy transitions incomplete and recalculates after clearing', () => {
    const unresolved = preview(fwl, otherFwl, false, 'unresolved')
    expect(unresolved.status).toBe('incomplete')
    expect(unresolved.pendingOccurrenceIds.length).toBeGreaterThan(0)
    expect(unresolved.selectedAwardXp).toBe(0)
    let choices = stateFor(fwl, otherFwl, true)
    const occurrence = choices.selections[0].occurrenceId
    choices = clearChoice(choices, occurrence)
    const afterClear = previewCanonicalAre({ character: draft('clear'), normalized: fwl, packageId: otherFwl, choices })
    expect(afterClear.status).toBe('incomplete')
    expect(afterClear.pendingOccurrenceIds).toContain(occurrence)
    choices = replaceChoice(choices, occurrence, destinationFor(choices.grants.find((grant) => grant.occurrenceId === occurrence)!, 0))
    const afterReplace = previewCanonicalAre({ character: draft('replace'), normalized: fwl, packageId: otherFwl, choices })
    expect(afterReplace.status).toBe('preview')
  })

  it('accepts an unfamiliar synthetic family using only generic canonical contracts', () => {
    const source = fwl.packages.find((entry) => entry.identity === otherFwl)!
    const syntheticId = 'affiliation.synthetic.audit-10'
    const syntheticPackage: NormalizedPackage = { ...source, identity: syntheticId, parentId: undefined }
    const synthetic: NormalizedExport = { ...fwl, packages: [syntheticPackage] }
    const incomplete = preview(synthetic, syntheticId, false, 'synthetic-incomplete')
    const complete = preview(synthetic, syntheticId, true, 'synthetic-complete')
    expect(incomplete.status).toBe('incomplete')
    expect(complete.status).toBe('preview')
    expect(complete.pendingOccurrenceIds).toHaveLength(0)
    expect(complete.provenance).toContain(source.provenance[0].claimId)
    expect(new Set(complete.resolvedOccurrenceIds).size).toBe(complete.resolvedOccurrenceIds.length)
  })

  it('rejects untrusted grant metadata and package identity without mutating the draft', () => {
    const choices = stateFor(fwl, otherFwl, true)
    const forged = { ...choices, grants: choices.grants.map((grant, index) => index === 0 ? { ...grant, xp: grant.xp + 1 } : grant) }
    const unknown = previewCanonicalAre({ character: draft('trust'), normalized: fwl, packageId: 'affiliation.synthetic.unknown', choices })
    const tampered = previewCanonicalAre({ character: draft('trust'), normalized: fwl, packageId: otherFwl, choices: forged })
    expect(unknown.status).toBe('failed')
    expect(tampered.status).toBe('failed')
    expect(draft('trust').lifeModuleHistory).toHaveLength(1)
  })
})
