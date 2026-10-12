import { describe, expect, it } from 'vitest'
import { clanBirthOriginState, clanCasteState, clanIdentityState } from '../domain/character/clanIdentity'
import { encodeCharacter, decodeCharacter } from '../persistence/characterCodec'
import { CLAN_STAGE4_ELIGIBILITY_RULES, evaluateClanStage4Eligibility } from '../domain/lifeModules/clanStage4Eligibility'
import { applyUniversalStage0, buildLifeModuleTransaction, commitLifeModuleTransaction, createLifeModuleCharacter, resolvePendingLifeModuleAward, validateLifeModuleTransaction } from './lifeModuleEngine'
import { allocateFinalReviewXp, applyAllLifeModuleOptimizations, enterLifeModuleFinalReview } from './lifeModuleFinalReview'

const crecheChoices = [
  { type: 'attribute', targetId: 'BOD', displayName: 'BOD' },
  { type: 'attribute', targetId: 'DEX', displayName: 'DEX' },
  { type: 'attribute', targetId: 'RFL', displayName: 'RFL' },
  { type: 'attribute', targetId: 'WIL', displayName: 'WIL' },
  { type: 'trait', targetId: 'trait.fit', displayName: 'Fit' },
] as const

function representative() {
  let character = createLifeModuleCharacter('Slice 160 disposable', 5000)
  character.clanIdentity = clanIdentityState()
  character.clanCaste = clanCasteState('warrior')
  character.clanBirthOrigin = clanBirthOriginState('trueborn')
  character.phenotypeId = 'phenotype.mechwarrior'
  character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'final', provenanceId: 'slice160-test' })
  character = applyUniversalStage0(character, 'stage0.clan.homeworld-clan', 'Mandarin Chinese')
  const commit = (operations: Parameters<typeof buildLifeModuleTransaction>[1]) => {
    const transaction = buildLifeModuleTransaction(character, operations)
    validateLifeModuleTransaction(transaction)
    expect(transaction.errors).toEqual([])
    character = commitLifeModuleTransaction(transaction)
  }
  commit([
    { kind: 'grant-clan-package', awardId: 'stage0.homeworld-clan', packageId: 'homeworld-clan' },
    { kind: 'grant-clan-package', awardId: 'stage0.mechwarrior', packageId: 'mechwarrior' },
    { kind: 'grant-trueborn-creche', choices: [...crecheChoices] },
  ])
  commit([{ kind: 'grant-trueborn-sibko-mechwarrior' }])
  let pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'sibko.flexible')!
  character = resolvePendingLifeModuleAward(character, pending.id, { type: 'attribute', targetId: 'BOD', displayName: 'BOD' }, 50)
  commit([{
    kind: 'grant-clan-watch-operative',
    branch: 'homeworld-clan',
    choices: { 'watch.tracking': 'Wilderness', 'homeworld.security-systems': 'Security', 'homeworld.streetwise': 'Clan Wolf', 'homeworld.survival': 'Wilderness', 'homeworld.technician': 'Vehicle' },
  }])
  pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'watch.flexible')!
  character = resolvePendingLifeModuleAward(character, pending.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 175)
  return character
}

describe('Alpha Slice 160 Clan finalization boundary', () => {
  it('reevaluates the canonical Watch caste path and preserves non-eligible castes', () => {
    const character = representative()
    const prerequisite = character.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'watch.caste')
    expect(prerequisite?.status).toBe('satisfied')
    const rule = CLAN_STAGE4_ELIGIBILITY_RULES.find((entry) => entry.moduleId === 'stage4.clan-watch-operative')!
    for (const caste of ['warrior', 'scientist', 'technician'] as const) {
      character.clanCaste = clanCasteState(caste)
      expect(evaluateClanStage4Eligibility(character, rule).status).toBe('ELIGIBLE')
    }
    for (const caste of ['merchant', 'laborer'] as const) {
      character.clanCaste = clanCasteState(caste)
      expect(evaluateClanStage4Eligibility(character, rule).status).toBe('INELIGIBLE')
    }
    character.clanCaste = undefined
    expect(evaluateClanStage4Eligibility(character, rule).status).toBe('INELIGIBLE')
  })

  it('spends exactly 400 XP on DEX/WIL and preserves the Clan readiness blocker', () => {
    let character = applyAllLifeModuleOptimizations(enterLifeModuleFinalReview(representative()))
    character = allocateFinalReviewXp(character, { type: 'attribute', targetId: 'DEX', displayName: 'DEX' }, 200)
    character = allocateFinalReviewXp(character, { type: 'attribute', targetId: 'WIL', displayName: 'WIL' }, 200)
    expect(character.creation.lifeModules!.finalReview!.allocationPool.remaining).toBe(1216)
    expect(character.creation.lifeModules!.prerequisiteIssues.filter((entry) => entry.status === 'outstanding').map((entry) => entry.prerequisiteId)).not.toEqual(expect.arrayContaining(['sibko.dex', 'clan-mechwarrior.wil', 'watch.caste']))
    expect(character.creation.lifeModules!.finalReview!.readiness).toBe('review-required')
  })

  it('round-trips a structurally valid internal Clan record without enabling public readiness', () => {
    const character = representative()
    const encoded = encodeCharacter(character, '2026-10-11T00:00:00.000Z')
    expect(() => decodeCharacter(encoded)).toThrow()
    const restored = decodeCharacter(encoded, { allowInternalClanRecord: true })
    expect(restored.clanCaste?.id).toBe('warrior')
    expect(restored.lifeModuleHistory.map((entry) => entry.moduleId)).toEqual(character.lifeModuleHistory.map((entry) => entry.moduleId))
    expect(restored.chronology).toEqual(character.chronology)
    expect(restored.provenance.length).toBe(character.provenance.length)
    const malformed = JSON.parse(encodeCharacter(character))
    malformed.character.clanCaste.id = 'invalid-caste'
    expect(() => decodeCharacter(JSON.stringify(malformed), { allowInternalClanRecord: true })).toThrow('Clan caste foundation is malformed')
  })
})
