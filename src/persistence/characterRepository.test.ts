import { describe, expect, it } from 'vitest'
import { createPointBuyCharacter } from '../engine/pointBuyEngine'
import { BLUE_COLLAR_ID, STAGE_2_HIGH_SCHOOL_ID } from '../domain/lifeModules/catalog'
import { applyAgitator, applyCapellanCommonality, applyStage1Module, applyStage2Module, applyTechnicalCollege, applyUniversalStage0, continueToStage2, continueToStage3, continueToStage4, createLifeModuleCharacter, resolvePendingLifeModuleAward } from '../engine/lifeModuleEngine'
import { LocalStorageCharacterRepository, type StorageLike } from './characterRepository'

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>()
  get length() { return this.values.size }
  key(index: number) { return [...this.values.keys()][index] ?? null }
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  removeItem(key: string) { this.values.delete(key) }
}

describe('LocalStorageCharacterRepository', () => {
  it('saves, lists, loads, and deletes a character', () => {
    let id = 0
    const source = createPointBuyCharacter('Local Pilot', 5000, {
      now: () => '3025-01-01T00:00:00.000Z',
      id: () => `id-${++id}`,
    })
    const repository = new LocalStorageCharacterRepository(new MemoryStorage())

    repository.save(source)
    expect(repository.list()).toEqual([source])
    expect(repository.get(source.id)).toEqual(source)

    repository.delete(source.id)
    expect(repository.get(source.id)).toBeNull()
  })

  it('does not let one unreadable save block the local library', () => {
    const storage = new MemoryStorage()
    storage.setItem('bt-online-compendium:character:broken', '{not json')
    const repository = new LocalStorageCharacterRepository(storage)
    expect(repository.list()).toEqual([])
  })

  it('preserves resolved and unresolved Life Module awards in local storage', () => {
    let character = createLifeModuleCharacter('Local Module Character')
    character = applyUniversalStage0(character, 'Mandarin Chinese')
    character = applyCapellanCommonality(character, 'Russian')
    character = applyStage1Module(character, BLUE_COLLAR_ID)
    const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'blue-collar.interests')!
    character = resolvePendingLifeModuleAward(character, pending.id, {
      type: 'skill', targetId: 'skill.interest', displayName: 'Interest/History', parameter: { kind: 'subskill', value: 'History' },
    })
    const repository = new LocalStorageCharacterRepository(new MemoryStorage())
    repository.save(character)
    expect(repository.get(character.id)).toEqual(character)
    expect(repository.get(character.id)?.creation.lifeModules?.pendingAwards.find((entry) => entry.awardId === 'blue-collar.interests')?.remainingGrants).toBe(1)
  })

  it('preserves Stage 3 school and Skill Field state in local storage', () => {
    let character = createLifeModuleCharacter('Local Technical Student')
    character = applyUniversalStage0(character, 'Mandarin Chinese')
    character = applyCapellanCommonality(character, 'Russian')
    character = applyStage1Module(character, BLUE_COLLAR_ID)
    character = resolveAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French')
    character = resolveAward(character, 'blue-collar.career', 'skill.career', 'Career/Technician', 'Technician')
    character = resolveAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History')
    character = resolveAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/Science', 'Science')
    for (const attribute of ['STR', 'BOD', 'DEX', 'RFL']) character = resolveAward(character, 'blue-collar.flexible', attribute, attribute)
    character = applyStage2Module(continueToStage2(character), STAGE_2_HIGH_SCHOOL_ID)
    character = resolveAward(character, 'high-school.interest-40', 'skill.interest', 'Interest/Physics', 'Physics')
    character = resolveAward(character, 'high-school.interest-35', 'skill.interest', 'Interest/Art', 'Art')
    character = resolveAward(character, 'high-school.language-affiliation', 'skill.language', 'Language/English', 'English')
    character = resolveAward(character, 'high-school.streetwise-affiliation', 'skill.streetwise', 'Streetwise/Capellan', 'Capellan')
    const stage2Flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')!
    character = resolvePendingLifeModuleAward(character, stage2Flexible.id, { type: 'attribute', targetId: 'DEX', displayName: 'DEX' }, 185)
    character = applyTechnicalCollege(continueToStage3(character))

    const repository = new LocalStorageCharacterRepository(new MemoryStorage())
    repository.save(character)
    const restored = repository.get(character.id)
    expect(restored).toEqual(character)
    expect(restored?.creation.lifeModules?.selectedSkillFields).toHaveLength(2)
    expect(restored?.chronology.at(-1)?.date).toBe('age:19')
  })

  it('preserves Stage 4 module, repeat policy, chronology, and pending awards in local storage', () => {
    let character = createLifeModuleCharacter('Local Agitator')
    character = applyUniversalStage0(character, 'Mandarin Chinese')
    character = applyCapellanCommonality(character, 'Russian')
    character = applyStage1Module(character, BLUE_COLLAR_ID)
    character = resolveAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French')
    character = resolveAward(character, 'blue-collar.career', 'skill.career', 'Career/Technician', 'Technician')
    character = resolveAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History')
    character = resolveAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/Science', 'Science')
    for (const attribute of ['STR', 'BOD', 'DEX', 'RFL']) character = resolveAward(character, 'blue-collar.flexible', attribute, attribute)
    character = applyStage2Module(continueToStage2(character), STAGE_2_HIGH_SCHOOL_ID)
    character = resolveAward(character, 'high-school.interest-40', 'skill.interest', 'Interest/Physics', 'Physics')
    character = resolveAward(character, 'high-school.interest-35', 'skill.interest', 'Interest/Art', 'Art')
    character = resolveAward(character, 'high-school.language-affiliation', 'skill.language', 'Language/English', 'English')
    character = resolveAward(character, 'high-school.streetwise-affiliation', 'skill.streetwise', 'Streetwise/Capellan', 'Capellan')
    let flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')!
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'DEX', displayName: 'DEX' }, 185)
    character = applyTechnicalCollege(continueToStage3(character))
    character = resolveAward(character, 'technical-college.interest', 'skill.interest', 'Interest/Engineering', 'Engineering')
    flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'technical-college.flexible')!
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 150)
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'trait', targetId: 'trait.patient', displayName: 'Patient' }, 50)
    character = applyAgitator(continueToStage4(character))

    const repository = new LocalStorageCharacterRepository(new MemoryStorage())
    repository.save(character)
    const restored = repository.get(character.id)
    expect(restored).toEqual(character)
    expect(restored?.lifeModuleHistory.at(-1)?.repeatPolicy?.sameModuleRepeat).toBe('deferred')
    expect(restored?.chronology.at(-1)?.date).toBe('age:23')
    expect(restored?.creation.lifeModules?.pendingAwards.find((entry) => entry.awardId === 'agitator.flexible')?.remainingXp).toBe(125)
  })
})

function resolveAward(character: ReturnType<typeof createLifeModuleCharacter>, awardId: string, targetId: string, displayName: string, parameter?: string) {
  const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === awardId)!
  return resolvePendingLifeModuleAward(character, pending.id, {
    type: pending.allowedTargetTypes[0],
    targetId,
    displayName,
    ...(parameter ? { parameter: { kind: 'subskill', value: parameter } } : {}),
  })
}
