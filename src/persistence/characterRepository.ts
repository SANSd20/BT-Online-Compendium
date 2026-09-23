import type { CharacterDefinition } from '../domain/character/model'
import { decodeCharacter, encodeCharacter } from './characterCodec'

export interface CharacterRepository {
  list(): CharacterDefinition[]
  get(id: string): CharacterDefinition | null
  save(character: CharacterDefinition): void
  delete(id: string): void
}

export interface StorageLike {
  readonly length: number
  key(index: number): string | null
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

const KEY_PREFIX = 'bt-online-compendium:character:'

export class LocalStorageCharacterRepository implements CharacterRepository {
  private readonly storage: StorageLike

  constructor(storage: StorageLike) {
    this.storage = storage
  }

  list(): CharacterDefinition[] {
    const characters: CharacterDefinition[] = []
    for (let index = 0; index < this.storage.length; index += 1) {
      const key = this.storage.key(index)
      if (!key?.startsWith(KEY_PREFIX)) continue
      const serialized = this.storage.getItem(key)
      if (!serialized) continue
      try {
        characters.push(decodeCharacter(serialized))
      } catch {
        // Preserve but ignore unreadable entries so one damaged save cannot block the local library.
      }
    }
    return characters.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
  }

  get(id: string): CharacterDefinition | null {
    const serialized = this.storage.getItem(`${KEY_PREFIX}${id}`)
    return serialized ? decodeCharacter(serialized) : null
  }

  save(character: CharacterDefinition): void {
    this.storage.setItem(`${KEY_PREFIX}${character.id}`, encodeCharacter(character))
  }

  delete(id: string): void {
    this.storage.removeItem(`${KEY_PREFIX}${id}`)
  }
}
