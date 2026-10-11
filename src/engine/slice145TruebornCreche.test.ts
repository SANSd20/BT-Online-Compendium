import { describe, expect, it } from 'vitest'
import { clanBirthOriginState, clanCasteState, clanIdentityState } from '../domain/character/clanIdentity'
import { buildLifeModuleTransaction, createLifeModuleCharacter, validateLifeModuleTransaction } from './lifeModuleEngine'

function fixture() {
  const character = createLifeModuleCharacter('Slice 145 disposable', 5000)
  character.clanIdentity = clanIdentityState()
  character.clanBirthOrigin = clanBirthOriginState('trueborn')
  character.phenotypeId = 'phenotype.mechwarrior'
  character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'final', provenanceId: 'slice145-test' })
  return character
}

const choices = [
  { type: 'attribute', targetId: 'DEX', displayName: 'DEX' },
  { type: 'attribute', targetId: 'INT', displayName: 'INT' },
  { type: 'trait', targetId: 'trait.fit', displayName: 'Fit' },
  { type: 'skill', targetId: 'skill.perception', displayName: 'Perception' },
  { type: 'skill', targetId: 'skill.tactics', displayName: 'Tactics/Land', parameter: { kind: 'subskill', value: 'Land' } },
] as const

describe('Slice 145 Trueborn Crèche', () => {
  it('commits exact awards, five choices, chronology, and canonical history atomically', () => {
    const transaction = buildLifeModuleTransaction(fixture(), [{ kind: 'grant-clan-package', awardId: 'stage0.homeworld-clan', packageId: 'homeworld-clan' }, { kind: 'grant-trueborn-creche', choices: [...choices] }])
    expect(transaction.errors).toEqual([])
    const validated = validateLifeModuleTransaction(transaction)
    expect(validated.errors).toEqual([])
    expect(transaction.prospectiveState?.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: 'stage1.trueborn-creche', costXp: 300, chronologyYears: 10 })
    expect(transaction.prospectiveState?.xp.creation.remaining).toBe(3800)
    expect(transaction.prospectiveState?.provenance.at(-1)?.source?.page).toBe(76)
    expect(transaction.prospectiveState?.attributes.find((entry) => entry.attributeId === 'BOD')?.accumulatedXp).toBe(225)
    expect(transaction.prospectiveState?.creation.lifeModules?.resolvedAwards.filter((entry) => entry.moduleId === 'stage1.trueborn-creche' && entry.awardId === 'creche.flexible')).toHaveLength(5)
    expect(transaction.prospectiveState?.creation.lifeModules?.choiceGrantRequirements).toContainEqual(expect.objectContaining({ moduleId: 'stage1.trueborn-creche', awardId: 'creche.flexible', requiredGrants: 5 }))
  })

  it('rejects Freeborn or fabricated Stage 0 history without mutation', () => {
    const character = fixture()
    character.clanBirthOrigin = clanBirthOriginState('freeborn')
    const transaction = buildLifeModuleTransaction(character, [{ kind: 'grant-clan-package', awardId: 'stage0.homeworld-clan', packageId: 'homeworld-clan' }, { kind: 'grant-trueborn-creche', choices: [...choices] }])
    expect(transaction.status).toBe('failed')
    expect(transaction.prospectiveState).toBeNull()
    expect(character.lifeModuleHistory).toHaveLength(1)
  })

  it('preserves source-legal Attribute totals and records outstanding Sibko prerequisites', () => {
    const character = fixture()
    character.clanCaste = clanCasteState('warrior')
    const creche = buildLifeModuleTransaction(character, [
      { kind: 'grant-clan-package', awardId: 'stage0.homeworld-clan', packageId: 'homeworld-clan' },
      { kind: 'grant-clan-package', awardId: 'stage0.mechwarrior', packageId: 'mechwarrior' },
      { kind: 'grant-trueborn-creche', choices: [...choices] },
    ])
    expect(validateLifeModuleTransaction(creche).errors).toEqual([])
    const committed = creche.prospectiveState!
    expect(committed.attributes.find((entry) => entry.attributeId === 'BOD')?.accumulatedXp).toBe(225)
    const sibko = buildLifeModuleTransaction(committed, [{ kind: 'grant-trueborn-sibko-mechwarrior' }])
    expect(sibko.errors).toEqual([])
    expect(sibko.prospectiveState?.lifeModuleHistory.at(-1)?.moduleId).toBe('stage2.trueborn-sibko')
    expect(sibko.prospectiveState?.creation.lifeModules?.prerequisiteIssues.filter((entry) => entry.moduleId === 'stage2.trueborn-sibko' && entry.status === 'outstanding').map((entry) => entry.prerequisiteId)).toEqual(['sibko.bod', 'sibko.dex', 'sibko.wil'])
  })
})
