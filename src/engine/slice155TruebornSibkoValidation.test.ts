import { describe, expect, it } from 'vitest'
import { clanBirthOriginState, clanCasteState, clanIdentityState } from '../domain/character/clanIdentity'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { applyUniversalStage0, buildLifeModuleTransaction, commitLifeModuleTransaction, createLifeModuleCharacter, resolvePendingLifeModuleAward, validateLifeModuleTransaction } from './lifeModuleEngine'

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
    expect(committed.creation.lifeModules?.pendingAwards.at(-1)).toMatchObject({ awardId: 'sibko.flexible', remainingXp: 50 })
    expect(committed.creation.lifeModules?.prerequisiteIssues.filter((entry) => entry.status === 'outstanding').map((entry) => entry.prerequisiteId)).toEqual(['sibko.bod', 'sibko.dex', 'clan-mechwarrior.bod', 'clan-mechwarrior.wil'])
  })

  it('commits the real Homeworld Clan Watch Operative branch with canonical grants and chronology', () => {
    const sibkoTransaction = buildLifeModuleTransaction(realPathToCreche(), [{ kind: 'grant-trueborn-sibko-mechwarrior' }])
    validateLifeModuleTransaction(sibkoTransaction)
    expect(sibkoTransaction.errors).toEqual([])
    const sibko = commitLifeModuleTransaction(sibkoTransaction)
    const sibkoAward = sibko.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'sibko.flexible')!
    const resolvedSibko = resolvePendingLifeModuleAward(sibko, sibkoAward.id, { type: 'attribute', targetId: 'BOD', displayName: 'BOD' }, 50)
    const transaction = buildLifeModuleTransaction(resolvedSibko, [{
      kind: 'grant-clan-watch-operative',
      branch: 'homeworld-clan',
      choices: {
        'watch.tracking': 'Wilderness',
        'homeworld.security-systems': 'Security',
        'homeworld.streetwise': 'Clan Wolf',
        'homeworld.survival': 'Wilderness',
        'homeworld.technician': 'Vehicle',
      },
    }])
    validateLifeModuleTransaction(transaction)
    expect(transaction.errors).toEqual([])
    const committed = commitLifeModuleTransaction(transaction)
    expect(committed.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: 'stage4.clan-watch-operative', costXp: 1200, chronologyYears: 3 })
    expect(committed.chronology).toContainEqual(expect.objectContaining({ eventId: 'stage4.clan-watch-operative.complete', date: 'age:19' }))
    expect(committed.creation.lifeModules?.pendingAwards.at(-1)).toMatchObject({ awardId: 'watch.flexible', remainingXp: 175 })
    expect(committed.skills).toContainEqual(expect.objectContaining({ address: expect.objectContaining({ skillId: 'skill.tracking', parameter: { kind: 'subskill', value: 'Wilderness' } }), sourceAwards: expect.arrayContaining([expect.objectContaining({ xp: 80 })]) }))
  })

  it('rejects an invalid later operation without mutating prior committed history', () => {
    const base = realPathToCreche()
    const transaction = buildLifeModuleTransaction(base, [{ kind: 'grant-trueborn-sibko-mechwarrior' }, { kind: 'grant-trueborn-sibko-mechwarrior' }])
    expect(transaction.status).toBe('failed')
    expect(transaction.prospectiveState).toBeNull()
    expect(base.lifeModuleHistory.map((entry) => entry.moduleId)).toEqual(['stage0.universal-fixed-xp', 'stage0.clan-package.homeworld-clan', 'stage0.clan-package.mechwarrior', 'stage1.trueborn-creche'])
  })

  it('grants one source-defined 50-XP pool, rejects over-allocation atomically, and persists its resolution', () => {
    const transaction = buildLifeModuleTransaction(realPathToCreche(), [{ kind: 'grant-trueborn-sibko-mechwarrior' }])
    validateLifeModuleTransaction(transaction)
    const committed = commitLifeModuleTransaction(transaction)
    const pending = committed.creation.lifeModules!.pendingAwards.filter((entry) => entry.awardId === 'sibko.flexible')
    expect(pending).toHaveLength(1)
    expect(pending[0]).toMatchObject({ moduleId: 'stage2.trueborn-sibko', remainingXp: 50, allocationMode: 'pool', source: { sourceId: 'atow-core-corrected-third', page: 79 } })
    expect(committed.creation.lifeModules!.choiceGrantRequirements.filter((entry) => entry.awardId === 'sibko.flexible')).toEqual([
      expect.objectContaining({ requiredXp: 50, allocationMode: 'pool' }),
    ])

    const before = structuredClone(committed)
    expect(() => resolvePendingLifeModuleAward(committed, pending[0]!.id, { type: 'attribute', targetId: 'BOD', displayName: 'BOD' }, 51)).toThrow('exceeds the remaining award XP')
    expect(committed).toEqual(before)

    const bodBefore = committed.attributes.find((entry) => entry.attributeId === 'BOD')!.accumulatedXp
    const resolved = resolvePendingLifeModuleAward(committed, pending[0]!.id, { type: 'attribute', targetId: 'BOD', displayName: 'BOD' }, 50)
    expect(resolved.attributes.find((entry) => entry.attributeId === 'BOD')!.accumulatedXp).toBe(bodBefore + 50)
    expect(resolved.creation.lifeModules!.pendingAwards.some((entry) => entry.awardId === 'sibko.flexible')).toBe(false)
    expect(resolved.creation.lifeModules!.resolvedAwards.filter((entry) => entry.awardId === 'sibko.flexible')).toEqual([
      expect.objectContaining({ xp: 50, provenanceId: pending[0]!.provenanceId }),
    ])

    const restored = decodeCharacter(encodeCharacter(resolved), { allowInternalClanRecord: true })
    expect(restored.creation.lifeModules!.resolvedAwards.filter((entry) => entry.awardId === 'sibko.flexible')).toEqual(
      resolved.creation.lifeModules!.resolvedAwards.filter((entry) => entry.awardId === 'sibko.flexible'),
    )
    expect(restored.attributes.find((entry) => entry.attributeId === 'BOD')!.accumulatedXp).toBe(bodBefore + 50)
  })
})
