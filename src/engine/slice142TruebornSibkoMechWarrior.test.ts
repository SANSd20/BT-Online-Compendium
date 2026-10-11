import { describe, expect, it } from 'vitest'
import { buildLifeModuleTransaction } from './lifeModuleEngine'
import { createLifeModuleCharacter } from './lifeModuleEngine'
import { clanCasteState, clanIdentityState, clanBirthOriginState } from '../domain/character/clanIdentity'

function fixture() {
  const character = createLifeModuleCharacter('Slice 142 disposable', 5000)
  character.clanIdentity = clanIdentityState()
  character.clanCaste = clanCasteState('warrior')
  character.clanBirthOrigin = clanBirthOriginState('trueborn')
  character.phenotypeId = 'phenotype.mechwarrior'
  for (const attributeId of ['BOD', 'DEX', 'RFL', 'WIL'] as const) {
    const entry = character.attributes.find((candidate) => candidate.attributeId === attributeId)
    if (entry) entry.accumulatedXp = attributeId === 'DEX' ? 400 : 300
  }
  character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'final', provenanceId: 'slice142-test' })
  character.lifeModuleHistory.push({ moduleId: 'stage1.trueborn-creche', displayName: 'Trueborn Crèche', stage: 1, costXp: 300, chronologyYears: 10, selectedAt: new Date().toISOString(), provenanceIds: [], source: { sourceId: 'slice142-test', edition: 'test' }, notes: [] })
  return character
}

describe('Slice 142 Trueborn Sibko MechWarrior branch', () => {
  it('commits the source-defined branch atomically with the included Field', () => {
    const character = fixture()
    const transaction = buildLifeModuleTransaction(character, [{ kind: 'grant-trueborn-sibko-mechwarrior' }])
    expect(transaction.errors).toEqual([])
    expect(transaction.prospectiveState?.lifeModuleHistory.at(-1)?.moduleId).toBe('stage2.trueborn-sibko')
    expect(transaction.prospectiveState?.lifeModuleHistory.at(-1)?.fieldCostXp).toBe(384)
    expect(transaction.prospectiveState?.creation.lifeModules?.selectedSkillFields.at(-1)).toMatchObject({ fieldId: 'field.clan-mechwarrior', xpPerSkill: 80, purchaseCostXp: 384, chronologyYears: 0 })
    expect(transaction.prospectiveState?.creation.lifeModules?.pendingAwards.at(-1)).toMatchObject({ remainingXp: 50, kind: 'flexible-xp' })
    expect(transaction.prospectiveState?.xp.creation.remaining).toBe(2166)
  })

  it('rejects the branch atomically when Warrior caste is absent', () => {
    const character = fixture()
    character.clanCaste = clanCasteState('scientist')
    const transaction = buildLifeModuleTransaction(character, [{ kind: 'grant-trueborn-sibko-mechwarrior' }])
    expect(transaction.status).toBe('failed')
    expect(transaction.prospectiveState).toBeNull()
    expect(character.lifeModuleHistory).toHaveLength(2)
  })
})
