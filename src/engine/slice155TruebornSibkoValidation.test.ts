import { describe, expect, it } from 'vitest'
import { clanBirthOriginState, clanCasteState, clanIdentityState } from '../domain/character/clanIdentity'
import { applyUniversalStage0, buildLifeModuleTransaction, commitLifeModuleTransaction, createLifeModuleCharacter, validateLifeModuleTransaction } from './lifeModuleEngine'

const crecheChoices = [
  { type: 'attribute', targetId: 'BOD', displayName: 'BOD' },
  { type: 'attribute', targetId: 'DEX', displayName: 'DEX' },
  { type: 'attribute', targetId: 'RFL', displayName: 'RFL' },
  { type: 'attribute', targetId: 'WIL', displayName: 'WIL' },
  { type: 'trait', targetId: 'trait.fit', displayName: 'Fit' },
] as const

function realPathToCreche() {
  let character = createLifeModuleCharacter('Slice 155 disposable', 5000)
  character.clanIdentity = clanIdentityState()
  character.clanCaste = clanCasteState('warrior')
  character.clanBirthOrigin = clanBirthOriginState('trueborn')
  character.phenotypeId = 'phenotype.mechwarrior'
  character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'final', provenanceId: 'slice155-test' })
  character = applyUniversalStage0(character, 'stage0.clan.homeworld-clan', 'Mandarin Chinese')
  const transaction = buildLifeModuleTransaction(character, [
    { kind: 'grant-clan-package', awardId: 'stage0.homeworld-clan', packageId: 'homeworld-clan' },
    { kind: 'grant-clan-package', awardId: 'stage0.mechwarrior', packageId: 'mechwarrior' },
    { kind: 'grant-trueborn-creche', choices: [...crecheChoices] },
  ])
  validateLifeModuleTransaction(transaction)
  expect(transaction.errors).toEqual([])
  return commitLifeModuleTransaction(transaction)
}

describe('Alpha Slice 155 Trueborn Sibko Field validation', () => {
  it('commits the real Stage 0 → Crèche → Sibko path with a Stage 2 Field', () => {
    const transaction = buildLifeModuleTransaction(realPathToCreche(), [{ kind: 'grant-trueborn-sibko-mechwarrior' }])
    validateLifeModuleTransaction(transaction)
    expect(transaction.errors).toEqual([])
    const committed = commitLifeModuleTransaction(transaction)
    expect(committed.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: 'stage2.trueborn-sibko', stage: 2, baseCostXp: 1600, fieldCostXp: 384, chronologyYears: 16 })
    expect(committed.creation.lifeModules?.selectedSkillFields.at(-1)).toMatchObject({ schoolModuleId: 'stage2.trueborn-sibko', fieldId: 'field.clan-mechwarrior', purchaseCostXp: 384, xpPerSkill: 80, chronologyYears: 0 })
    expect(committed.creation.lifeModules?.pendingAwards.at(-1)).toMatchObject({ awardId: 'sibko.flexible', remainingXp: 150 })
    expect(committed.creation.lifeModules?.prerequisiteIssues.filter((entry) => entry.status === 'outstanding').map((entry) => entry.prerequisiteId)).toEqual(['sibko.bod', 'sibko.dex', 'clan-mechwarrior.bod', 'clan-mechwarrior.wil'])
  })

  it('rejects an invalid later operation without mutating prior committed history', () => {
    const base = realPathToCreche()
    const transaction = buildLifeModuleTransaction(base, [{ kind: 'grant-trueborn-sibko-mechwarrior' }, { kind: 'grant-trueborn-sibko-mechwarrior' }])
    expect(transaction.status).toBe('failed')
    expect(transaction.prospectiveState).toBeNull()
    expect(base.lifeModuleHistory.map((entry) => entry.moduleId)).toEqual(['stage0.universal-fixed-xp', 'stage0.clan-package.homeworld-clan', 'stage0.clan-package.mechwarrior', 'stage1.trueborn-creche'])
  })
})
