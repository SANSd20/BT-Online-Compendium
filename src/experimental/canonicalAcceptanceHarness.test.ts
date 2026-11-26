import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createLifeModuleCharacter, applyUniversalStage0 } from '../engine/lifeModuleEngine'
import { encodeCharacter, decodeCharacter } from '../persistence/characterCodec'
import { selectChoice, type ChoiceState } from './choiceEditing'
import { normalizeCanonicalExport, type NormalizedExport } from './canonicalAreNormalization'
import { buildCanonicalAreTransaction, choiceStateForCanonicalPackage } from './canonicalAreTransaction'
import { canonicalAreHistoryAuthority } from './canonicalArePersistence'
import { previewStage0Affiliation } from '../ui/components/stage0PreviewModel'
import { CAPELLAN_COMMONALITY_ID, FREE_WORLDS_LEAGUE_ID, FWL_MARIK_COMMONWEALTH_ID, FWL_REGULUS_ID, SIAN_COMMONALITY_ID, VICTORIA_COMMONALITY_ID } from '../domain/lifeModules/affiliations'

const ARD_REVISION = 'c83652c36cb5078aaadc072dea5f57dcad1fd563'
const ARD_ROOT = 'C:/Users/boill/Documents/ChatGPT/AToW Codex/AToW-Reference-Data'
const FWL_DIGEST = '417f2ed690a021e85348a8733f51bb5d5ee047d47c1fae0707e7eb1f209ef229'
const CAPELLAN_DIGEST = '8f0f0cd84d3b5f4f1a81724b615a67d0d2a5a90a456010073c76e27ab0c17cb7'

const fwl = normalizeCanonicalExport(JSON.parse(readFileSync(`${ARD_ROOT}/exports/free-worlds-league-export.json`, 'utf8')), ARD_REVISION)
const capellan = normalizeCanonicalExport(JSON.parse(readFileSync(`${ARD_ROOT}/exports/capellan-confederation-export.json`, 'utf8')), ARD_REVISION)

const previewContexts = [FREE_WORLDS_LEAGUE_ID, FWL_MARIK_COMMONWEALTH_ID, FWL_REGULUS_ID, CAPELLAN_COMMONALITY_ID, SIAN_COMMONALITY_ID, VICTORIA_COMMONALITY_ID]

function previewFor(character: ReturnType<typeof isolatedCharacter>, context: string) {
  const fwl = context.startsWith('stage0.free-worlds-league')
  return previewStage0Affiliation(character, context, fwl ? 'English' : 'Mandarin Chinese', fwl ? 'Spanish' : 'Russian', '', fwl ? 'History' : '', 'no', '', '', '', context === FREE_WORLDS_LEAGUE_ID || context === CAPELLAN_COMMONALITY_ID ? 'no' : context, '', 'Pain Resistance', 'Melee Weapons', fwl ? {} : { language: 'English', protocol: 'FedSuns' })
}

type Context = { family: 'FWL' | 'Capellan'; normalized: NormalizedExport; packageId: string }
const contexts: Context[] = [
  ...fwl.packages.map((entry) => ({ family: 'FWL' as const, normalized: fwl, packageId: entry.identity })),
  ...capellan.packages.map((entry) => ({ family: 'Capellan' as const, normalized: capellan, packageId: entry.identity })),
]

function isolatedCharacter(label: string) {
  return applyUniversalStage0(createLifeModuleCharacter(label), FREE_WORLDS_LEAGUE_ID, 'English')
}

function selectionFor(grant: ChoiceState['grants'][number], index: number) {
  if (grant.allowedDestinationTypes?.includes('attribute')) return { type: 'attribute' as const, attributeId: 'WIL' }
  if (grant.allowedDestinationTypes?.includes('trait')) return { type: 'trait' as const, traitId: 'trait.pain-resistance', subject: 'Pain Resistance' }
  if (grant.allowedSkillIds?.includes('skill.language')) return { type: 'skill' as const, skillId: 'skill.language', subject: `Test Language ${index}` }
  return { type: 'skill' as const, skillId: 'skill.interest', subject: `Test Subject ${index}` }
}

function resolvedChoices(normalized: NormalizedExport, packageId: string): ChoiceState {
  let choices = choiceStateForCanonicalPackage(normalized, packageId)
  choices.grants.forEach((grant, index) => { choices = selectChoice(choices, grant.occurrenceId, selectionFor(grant, index)) })
  return choices
}

function awardFingerprint(character: ReturnType<typeof isolatedCharacter>) {
  return {
    attributes: character.attributes.map((entry) => [entry.attributeId, entry.accumulatedXp, entry.sourceAwards.map((award) => [award.id, award.xp])]),
    traits: character.traits.map((entry) => [entry.traitId, entry.parameters, entry.accumulatedXp, entry.sourceAwards.map((award) => [award.id, award.xp])]),
    skills: character.skills.map((entry) => [entry.address, entry.accumulatedXp, entry.sourceAwards.map((award) => [award.id, award.xp])]),
    history: character.lifeModuleHistory.map((entry) => [entry.moduleId, entry.stage, entry.source.sourceId, entry.source.ruleId]),
  }
}

function expectedAwardFingerprint(normalized: NormalizedExport, packageId: string, choices: ChoiceState) {
  const selected = normalized.packages.find((entry) => entry.identity === packageId)!
  const inherited = selected.parentId ? [...normalized.packages.filter((entry) => entry.identity === selected.parentId), selected] : [selected]
  return { fixedXp: inherited.reduce((sum, entry) => sum + entry.awards.reduce((total, award) => total + award.xp, 0), 0), choiceXp: choices.selections.reduce((sum, selection) => sum + (choices.grants.find((grant) => grant.occurrenceId === selection.occurrenceId)?.xp ?? 0), 0), package: selected.identity }
}

describe('durable generic canonical ARE acceptance harness', () => {
  it('isolates nested fixture state and recognizes the reconciled export authorities', () => {
    expect(fwl.metadata.digest).toBe(FWL_DIGEST)
    expect(capellan.metadata.digest).toBe(CAPELLAN_DIGEST)
    const first = isolatedCharacter('canonical-isolation-a')
    const second = isolatedCharacter('canonical-isolation-b')
    first.attributes[0]!.accumulatedXp += 25
    first.lifeModuleHistory.push({ ...first.lifeModuleHistory[0]!, moduleId: 'synthetic-only' })
    expect(second.attributes[0]!.accumulatedXp).toBe(100)
    expect(second.lifeModuleHistory).toHaveLength(1)
    expect(first.traits).not.toBe(second.traits)
    expect(first.skills).not.toBe(second.skills)
    expect(first.provenance).not.toBe(second.provenance)
  })

  it.each(contexts)('$family $packageId commits and trusted-round-trips independently', ({ normalized, packageId }) => {
    const character = isolatedCharacter(`canonical-${packageId}`)
    const choices = resolvedChoices(normalized, packageId)
    const expected = expectedAwardFingerprint(normalized, packageId, choices)
    const transaction = buildCanonicalAreTransaction({ character, normalized, packageId, choices })
    expect(transaction.status).toBe('validated')
    expect(transaction.prospectiveState).not.toBeNull()
    expect(transaction.selectedAwardXp).toBe(expected.choiceXp)
    const committed = transaction.prospectiveState!
    expect(committed.lifeModuleHistory.at(-1)?.moduleId).toBe(packageId)
    expect(committed.creation.lifeModules?.phase).toBe('stage-1-selection')
    expect(committed.lifeModuleHistory.at(-1)?.source.sourceId).toBe(normalized.metadata.digest)
    const restored = decodeCharacter(encodeCharacter(committed, '2026-11-08T00:00:00.000Z'), { lifeModuleHistoryAuthority: canonicalAreHistoryAuthority(normalized, packageId) })
    expect(restored).toEqual(committed)
    expect(awardFingerprint(restored)).toEqual(awardFingerprint(committed))
  })

  it.each(contexts)('$family $packageId replays every trusted fixed and selected award independently', ({ normalized, packageId }) => {
    const choices = resolvedChoices(normalized, packageId)
    const base = isolatedCharacter(`replay-${packageId}`)
    const baseXp = [...base.attributes, ...base.traits, ...base.skills].reduce((sum, entry) => sum + entry.sourceAwards.reduce((total, award) => total + award.xp, 0), 0)
    const transaction = buildCanonicalAreTransaction({ character: base, normalized, packageId, choices })
    expect(transaction.status).toBe('validated')
    const committed = transaction.prospectiveState!
    const selected = normalized.packages.find((entry) => entry.identity === packageId)!
    const inherited = selected.parentId ? [...normalized.packages.filter((entry) => entry.identity === selected.parentId), selected] : [selected]
    const expectedXp = inherited.flatMap((entry) => entry.awards).reduce((sum, award) => sum + award.xp, 0) + choices.selections.reduce((sum, selection) => sum + (choices.grants.find((grant) => grant.occurrenceId === selection.occurrenceId)?.xp ?? 0), 0)
    const actualXp = [...committed.attributes, ...committed.traits, ...committed.skills].reduce((sum, entry) => sum + entry.sourceAwards.reduce((total, award) => total + award.xp, 0), 0)
    expect(actualXp - baseXp).toBe(expectedXp)
    expect(committed.provenance.some((entry) => entry.source?.sourceId === normalized.metadata.digest)).toBe(true)
    expect(committed.lifeModuleHistory.at(-1)?.source).toMatchObject({ sourceId: normalized.metadata.digest })
    expect(committed.creation.lifeModules?.moduleXp.spent).toBeGreaterThanOrEqual(0)
  })

  it('retains all three Capellan governed restriction records as authoritative metadata', () => {
    const ids = capellan.restrictions.map((record) => String(record.id)).sort()
    expect(ids).toEqual([
      'relation.capellan.stage-2-civilian-job-substitution',
      'restriction.scope.capellan-stage-2-military',
      'restriction.scope.capellan-stage-3',
    ])
    expect(capellan.restrictions.every((record) => Array.isArray(record.claims))).toBe(true)
    expect(capellan.restrictions.every((record) => ids.includes(String(record.id)) && (record.claims as Array<Record<string, unknown>>).length > 0)).toBe(true)
  })

  it('keeps cross-family transactions isolated and failed switching atomic', () => {
    const base = isolatedCharacter('cross-family-base')
    const fwlId = fwl.packages[0]!.identity
    const capellanId = capellan.packages.find((entry) => choiceStateForCanonicalPackage(capellan, entry.identity).grants.length > 0)!.identity
    const fwlTx = buildCanonicalAreTransaction({ character: base, normalized: fwl, packageId: fwlId, choices: resolvedChoices(fwl, fwlId) })
    const capellanTx = buildCanonicalAreTransaction({ character: base, normalized: capellan, packageId: capellanId, choices: resolvedChoices(capellan, capellanId) })
    expect(fwlTx.status).toBe('validated')
    expect(capellanTx.status).toBe('validated')
    expect(base.lifeModuleHistory.at(-1)?.moduleId).toBe('stage0.universal-fixed-xp')
    const unresolved = buildCanonicalAreTransaction({ character: base, normalized: capellan, packageId: capellanId, choices: { grants: choiceStateForCanonicalPackage(capellan, capellanId).grants, selections: [] } })
    expect(unresolved.status).toBe('failed')
    expect(base.lifeModuleHistory).toHaveLength(1)
  })

  it('reconciles the supported cross-family preview matrix without mutating the committed fixture', () => {
    const transitions = previewContexts.flatMap((from) => previewContexts.map((to) => ({ from, to }))).filter(({ from, to }) => from !== to)
    for (const { from, to } of transitions) {
      const base = createLifeModuleCharacter(`preview-${from}-${to}`)
      const original = JSON.stringify(base)
      const first = previewFor(base, from)
      const second = previewFor(base, to)
      expect(first, `${from} preview`).not.toBeNull()
      expect(second, `${to} preview`).not.toBeNull()
      expect(base.lifeModuleHistory).toHaveLength(1)
      expect(JSON.stringify(base)).toBe(original)
      const pendingIds = second?.creation.lifeModules?.pendingAwards.map((award) => award.id) ?? []
      expect(new Set(pendingIds).size).toBe(pendingIds.length)
    }
  })

  it('rejects unresolved choices atomically and does not mutate the base fixture', () => {
    const character = isolatedCharacter('canonical-unresolved')
    const packageId = fwl.packages[0]!.identity
    const choices = { grants: [...choiceStateForCanonicalPackage(fwl, packageId).grants], selections: [] }
    const transaction = buildCanonicalAreTransaction({ character, normalized: fwl, packageId, choices })
    expect(transaction.status).toBe('failed')
    expect(transaction.errors.join('; ')).toContain('choices are incomplete')
    expect(character.lifeModuleHistory).toHaveLength(1)
    expect(character.creation.lifeModules?.phase).toBe('stage-0-affiliation')
  })
})
