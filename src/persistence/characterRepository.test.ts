import { describe, expect, it } from 'vitest'
import { createPointBuyCharacter } from '../engine/pointBuyEngine'
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
})
