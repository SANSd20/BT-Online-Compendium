import { describe, expect, it } from 'vitest'
import { clanBirthOriginState, clanCasteState, clanIdentityState } from '../domain/character/clanIdentity'
import { applyUniversalStage0, buildLifeModuleTransaction, commitLifeModuleTransaction, createLifeModuleCharacter, resolvePendingLifeModuleAward, validateLifeModuleTransaction } from './lifeModuleEngine'

const crecheChoices = [{ type: 'attribute', targetId: 'BOD', displayName: 'BOD' }, { type: 'attribute', targetId: 'DEX', displayName: 'DEX' }, { type: 'attribute', targetId: 'RFL', displayName: 'RFL' }, { type: 'attribute', targetId: 'WIL', displayName: 'WIL' }, { type: 'trait', targetId: 'trait.fit', displayName: 'Fit' }] as const

function pathway(clanId: 'blood-spirit' | 'ice-hellion') {
  let character = createLifeModuleCharacter(`B8 ${clanId}`, 5000)
  character.clanIdentity = clanIdentityState()
  character.clanCaste = clanCasteState('warrior')
  character.clanBirthOrigin = clanBirthOriginState('trueborn')
  character.phenotypeId = 'phenotype.mechwarrior'
  character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'final', provenanceId: 'b8-fixture' })
  character = applyUniversalStage0(character, 'stage0.clan.homeworld-clan', 'Mandarin Chinese')
  const commit = (operations: Parameters<typeof buildLifeModuleTransaction>[1]) => {
    const transaction = buildLifeModuleTransaction(character, operations)
    validateLifeModuleTransaction(transaction)
    expect(transaction.errors).toEqual([])
    character = commitLifeModuleTransaction(transaction)
  }
  commit([
    { kind: 'grant-clan-package', awardId: 'stage0.homeworld-clan', packageId: 'homeworld-clan' },
    { kind: 'grant-homeworld-clan-package', clanId },
    { kind: 'grant-clan-package', awardId: 'stage0.mechwarrior', packageId: 'mechwarrior' },
    { kind: 'grant-trueborn-creche', choices: [...crecheChoices] },
  ])
  return character
}

describe('Alpha Slice 165-B8 specific-Clan history progression boundary', () => {
  it.each(['blood-spirit', 'ice-hellion'] as const)('continues %s through Crèche without catalog lookup failure', (clanId) => {
    const character = pathway(clanId)
    expect(character.clanSubAffiliationId).toBe(clanId)
    expect(character.clanPackageHistory).toHaveLength(1)
    expect(character.lifeModuleHistory.at(-1)?.moduleId).toBe('stage1.trueborn-creche')
    expect(character.creation.lifeModules?.selectedModuleIds).toContain(`stage0.clan-sub-affiliation.${clanId}`)
  })

  it('continues the repaired boundary through Sibko and Watch smoke validation', () => {
    let character = pathway('blood-spirit')
    const commit = (operations: Parameters<typeof buildLifeModuleTransaction>[1]) => { const transaction = buildLifeModuleTransaction(character, operations); validateLifeModuleTransaction(transaction); expect(transaction.errors).toEqual([]); character = commitLifeModuleTransaction(transaction) }
    commit([{ kind: 'grant-trueborn-sibko-mechwarrior' }])
    const sibko = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'sibko.flexible')!
    character = resolvePendingLifeModuleAward(character, sibko.id, { type: 'attribute', targetId: 'BOD', displayName: 'BOD' }, 150)
    commit([{ kind: 'grant-clan-watch-operative', branch: 'homeworld-clan', choices: { 'watch.tracking': 'Wilderness', 'homeworld.security-systems': 'Security', 'homeworld.streetwise': 'Clan Wolf', 'homeworld.survival': 'Wilderness', 'homeworld.technician': 'Vehicle' } }])
    expect(character.lifeModuleHistory.at(-1)?.moduleId).toBe('stage4.clan-watch-operative')
    expect(character.chronology).toContainEqual(expect.objectContaining({ date: 'age:19' }))
  })
})
