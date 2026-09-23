import { describe, expect, it } from 'vitest'
import { createPointBuyCharacter } from '../engine/pointBuyEngine'
import { BLUE_COLLAR_ID } from '../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, createLifeModuleCharacter, resolvePendingLifeModuleAward } from '../engine/lifeModuleEngine'
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
})
