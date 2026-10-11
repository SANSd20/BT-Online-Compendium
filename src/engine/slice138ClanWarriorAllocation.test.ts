import { describe, expect, it } from 'vitest'
import { buildLifeModuleTransaction, createLifeModuleCharacter } from './lifeModuleEngine'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'

describe('Alpha Slice 138 Clan Warrior Field Skill allocation', () => {
  const source = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 85, ruleId: 'clan-warrior-washout' }

  it('requires exactly three concrete Skills at exactly 25 XP each', () => {
    const character = createLifeModuleCharacter('allocation')
    const transaction = buildLifeModuleTransaction(character, [{
      kind: 'allocate-clan-warrior-field-xp', awardId: 'stage4.washout.clan-warrior-fields', moduleId: 'clan-warrior-washout', source,
      selections: [
        { fieldId: 'field.clan-mechwarrior', destination: { type: 'skill', targetId: 'skill.gunnery', displayName: "Gunnery/'Mech", parameter: { kind: 'subskill', value: "'Mech" } } },
        { fieldId: 'field.clan-mechwarrior', destination: { type: 'skill', targetId: 'skill.leadership', displayName: 'Leadership' } },
      ],
    }])
    expect(transaction.status).toBe('failed')
    expect(transaction.prospectiveState).toBeNull()
  })

  it('rejects duplicate destinations and reference-only Fields atomically', () => {
    const character = createLifeModuleCharacter('allocation')
    const destination = { type: 'skill' as const, targetId: 'skill.gunnery', displayName: "Gunnery/'Mech", parameter: { kind: 'subskill', value: "'Mech" } }
    const transaction = buildLifeModuleTransaction(character, [{
      kind: 'allocate-clan-warrior-field-xp', awardId: 'award', moduleId: 'module', source,
      selections: [{ fieldId: 'field.clan-cavalry', destination }, { fieldId: 'field.clan-mechwarrior', destination }, { fieldId: 'field.clan-mechwarrior', destination }],
    }])
    expect(transaction.status).toBe('failed')
    expect(transaction.baseState).toEqual(character)
    expect(transaction.prospectiveState).toBeNull()
  })

  it('preserves the durable allocation ledger through portable JSON', () => {
    const character = createLifeModuleCharacter('allocation')
    character.creation.lifeModules!.clanWarriorFieldSkillAllocations = [{
      id: 'allocation-1', awardId: 'award', moduleId: 'module', fieldId: 'field.clan-mechwarrior',
      destination: { type: 'skill', targetId: 'skill.leadership', displayName: 'Leadership' }, xp: 25,
      provenanceId: 'provenance-1', source, allocatedAt: '3071-01-01T00:00:00.000Z',
    }]
    expect(decodeCharacter(encodeCharacter(character)).creation.lifeModules?.clanWarriorFieldSkillAllocations).toEqual(character.creation.lifeModules?.clanWarriorFieldSkillAllocations)
  })
})
