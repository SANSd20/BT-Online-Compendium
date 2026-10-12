import { describe, expect, it } from 'vitest'
import { clanBirthOriginState, clanCasteState, clanIdentityState } from '../domain/character/clanIdentity'
import { deriveTraitPoints } from '../domain/lifeModules/finalReview'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { applyUniversalStage0, buildLifeModuleTransaction, commitLifeModuleTransaction, createLifeModuleCharacter, resolvePendingLifeModuleAward, validateLifeModuleTransaction } from './lifeModuleEngine'
import { applyAllLifeModuleOptimizations, enterLifeModuleFinalReview } from './lifeModuleFinalReview'

const choices = [
  { type: 'attribute', targetId: 'BOD', displayName: 'BOD' },
  { type: 'attribute', targetId: 'DEX', displayName: 'DEX' },
  { type: 'attribute', targetId: 'RFL', displayName: 'RFL' },
  { type: 'attribute', targetId: 'WIL', displayName: 'WIL' },
  { type: 'trait', targetId: 'trait.fit', displayName: 'Fit' },
] as const

function pathway(clanId: 'blood-spirit' | 'ice-hellion') {
  let character = createLifeModuleCharacter(`B9 ${clanId}`, 5000)
  character.clanIdentity = clanIdentityState(); character.clanCaste = clanCasteState('warrior'); character.clanBirthOrigin = clanBirthOriginState('trueborn'); character.phenotypeId = 'phenotype.mechwarrior'
  character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'final', provenanceId: 'b9-test' })
  character = applyUniversalStage0(character, 'stage0.clan.homeworld-clan', 'Mandarin Chinese')
  const commit = (operations: Parameters<typeof buildLifeModuleTransaction>[1]) => { const transaction = buildLifeModuleTransaction(character, operations); validateLifeModuleTransaction(transaction); expect(transaction.errors).toEqual([]); character = commitLifeModuleTransaction(transaction) }
  commit([{ kind: 'grant-clan-package', awardId: 'stage0.homeworld-clan', packageId: 'homeworld-clan' }, { kind: 'grant-homeworld-clan-package', clanId }, { kind: 'grant-clan-package', awardId: 'stage0.mechwarrior', packageId: 'mechwarrior' }, { kind: 'grant-trueborn-creche', choices: [...choices] }])
  commit([{ kind: 'grant-trueborn-sibko-mechwarrior' }])
  const sibko = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'sibko.flexible')!
  character = resolvePendingLifeModuleAward(character, sibko.id, { type: 'attribute', targetId: 'BOD', displayName: 'BOD' }, 150)
  commit([{ kind: 'grant-clan-watch-operative', branch: 'homeworld-clan', choices: { 'watch.tracking': 'Wilderness', 'homeworld.security-systems': 'Security', 'homeworld.streetwise': 'Clan Wolf', 'homeworld.survival': 'Wilderness', 'homeworld.technician': 'Vehicle' } }])
  const watch = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'watch.flexible')!
  return resolvePendingLifeModuleAward(character, watch.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 175)
}

describe('Alpha Slice 165-B9 signed specific-Clan Trait persistence', () => {
  it('keeps negative Trait optimization directed toward zero', () => expect(deriveTraitPoints(-150)).toBe(-1))

  it.each(['blood-spirit', 'ice-hellion'] as const)('round-trips the %s pathway after Optimization', (clanId) => {
    const reviewed = applyAllLifeModuleOptimizations(enterLifeModuleFinalReview(pathway(clanId)))
    const restored = decodeCharacter(encodeCharacter(reviewed), { allowInternalClanRecord: true })
    expect(restored.clanSubAffiliationId).toBe(clanId)
    expect(restored.lifeModuleHistory.at(-1)?.moduleId).toBe('stage4.clan-watch-operative')
    expect(restored.chronology).toContainEqual(expect.objectContaining({ date: 'age:19' }))
    expect(restored.creation.lifeModules?.finalReview?.readiness).toBe('review-required')
    expect(restored.traits).toEqual(reviewed.traits)
  })
})
