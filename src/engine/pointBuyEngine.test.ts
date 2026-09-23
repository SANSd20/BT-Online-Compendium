import { describe, expect, it } from 'vitest'
import { standardSkillXpCost } from '../domain/pointBuy/catalog'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { validateCharacter } from '../validation/validateCharacter'
import {
  createPointBuyCharacter,
  setPointBuyAttribute,
  setPointBuySkill,
  setPointBuyTrait,
} from './pointBuyEngine'

function dependencies() {
  let id = 0
  return {
    now: () => '3071-01-01T00:00:00.000Z',
    id: () => `id-${++id}`,
  }
}

describe('Point Buy v0.1', () => {
  it('creates a sourced 5,000-XP Normal Human draft with minimum Attributes', () => {
    const character = createPointBuyCharacter('Point Buyer', 5000, dependencies())

    expect(character.creation.method).toBe('point-buy')
    expect(character.creation.pointBuy).toMatchObject({
      startingAllotment: 'standard',
      source: { page: 51 },
      costTableSource: { page: 60 },
    })
    expect(character.attributes).toHaveLength(8)
    expect(character.attributes.every((entry) => entry.purchasedLevel === 1 && entry.accumulatedXp === 100)).toBe(true)
    expect(character.xp.creation).toEqual({ starting: 5000, allocated: 800, remaining: 4200 })
    expect(character.cBills).toBe(1000)
    expect(validateCharacter(character).valid).toBe(true)
  })

  it('updates Attribute allocation and remaining XP', () => {
    const source = createPointBuyCharacter('Attributes', 5000, dependencies())
    const character = setPointBuyAttribute(source, 'STR', 5)
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')).toMatchObject({ purchasedLevel: 5, accumulatedXp: 500 })
    expect(character.xp.creation).toEqual({ starting: 5000, allocated: 1200, remaining: 3800 })
  })

  it('keeps untrained absence distinct from trained Level +0 for Skills and subskills', () => {
    const source = createPointBuyCharacter('Skills', 5000, dependencies())
    expect(source.skills.find((entry) => entry.address.skillId === 'skill.language')).toBeUndefined()
    expect(standardSkillXpCost(null)).toBe(0)
    expect(standardSkillXpCost(0)).toBe(20)

    const trained = setPointBuySkill(source, 'skill.language', 0, 'English')
    expect(trained.skills[0]).toMatchObject({
      address: { skillId: 'skill.language', parameter: { kind: 'subskill', value: 'English' } },
      level: 0,
      accumulatedXp: 20,
    })
    const untrained = setPointBuySkill(trained, 'skill.language', null, 'English')
    expect(untrained.skills[0]).toMatchObject({ level: null, accumulatedXp: 0 })
  })

  it('uses cumulative standard Skill costs', () => {
    const source = createPointBuyCharacter('Skill Levels', 5000, dependencies())
    const character = setPointBuySkill(source, 'skill.perception', 3)
    expect(character.skills[0]).toMatchObject({ level: 3, accumulatedXp: 80 })
    expect(character.xp.creation).toEqual({ starting: 5000, allocated: 880, remaining: 4120 })
  })

  it('preserves Trait XP, attained TP, identity scope, and negative-XP credit', () => {
    let character = createPointBuyCharacter('Traits', 5000, dependencies())
    character = setPointBuyTrait(character, 'trait.ambidextrous', 2)
    character = setPointBuyTrait(character, 'trait.unattractive', -1)

    expect(character.traits[0]).toMatchObject({ accumulatedXp: 200, attainedTp: 2, active: true })
    expect(character.traits[1]).toMatchObject({ accumulatedXp: -100, attainedTp: -1, active: true, identityId: character.identities.primaryIdentityId })
    expect(character.xp.creation).toEqual({ starting: 5000, allocated: 900, remaining: 4100 })
  })

  it('enforces the 10-percent negative-Trait XP ceiling', () => {
    const source = createPointBuyCharacter('Negative Limit', 5000, dependencies())
    const atLimit = setPointBuyTrait(source, 'trait.reputation', -5, 'Infamous deserter')
    expect(() => setPointBuyTrait(atLimit, 'trait.unattractive', -1)).toThrow('at most 500 XP')
  })

  it('rejects overspending instead of creating negative remaining XP', () => {
    const source = createPointBuyCharacter('Budget', 800, dependencies())
    expect(() => setPointBuyAttribute(source, 'STR', 2)).toThrow('overspend')
  })

  it('rejects invalid starting XP', () => {
    expect(() => createPointBuyCharacter('Too Small', 799, dependencies())).toThrow('800 XP minimum')
    expect(() => createPointBuyCharacter('Fractional', 5000.5, dependencies())).toThrow('whole number')
  })

  it('round-trips through the portable character format with provenance intact', () => {
    let character = createPointBuyCharacter('Portable', 5000, dependencies())
    character = setPointBuySkill(character, 'skill.language', 0, 'English')
    character = setPointBuyTrait(character, 'trait.patient', 1)
    const restored = decodeCharacter(encodeCharacter(character, '3071-01-02T00:00:00.000Z'))

    expect(restored).toEqual(character)
    expect(restored.attributes.every((entry) => entry.sourceAwards.length === 1)).toBe(true)
    expect(restored.provenance.some((entry) => entry.source?.ruleId === 'experience-point-costs-table')).toBe(true)
  })

  it('reports malformed Point Buy ledgers', () => {
    const character = createPointBuyCharacter('Malformed', 5000, dependencies())
    character.attributes[0].accumulatedXp = 99
    const result = validateCharacter(character)
    expect(result.valid).toBe(false)
    expect(result.issues.some((entry) => entry.id === 'point-buy.attribute.valid')).toBe(true)
    expect(result.issues.some((entry) => entry.id === 'point-buy.xp.balance')).toBe(true)
  })

  it('reports malformed Skill, Trait, and provenance data', () => {
    let character = createPointBuyCharacter('Malformed Entries', 5000, dependencies())
    character = setPointBuySkill(character, 'skill.language', 0, 'English')
    character = setPointBuyTrait(character, 'trait.patient', 1)
    character.skills[0].address.parameter!.value = ''
    character.traits[0].accumulatedXp = 99
    character.creation.pointBuy!.rulesProvenanceId = 'missing'

    const result = validateCharacter(character)
    expect(result.valid).toBe(false)
    expect(result.issues.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'point-buy.skill.address.valid',
      'point-buy.trait.valid',
      'point-buy.provenance.reference',
    ]))
  })
})
