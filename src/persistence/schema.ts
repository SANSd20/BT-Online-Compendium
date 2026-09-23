import type { CharacterDefinition } from '../domain/character/model'

export const CHARACTER_FILE_FORMAT = 'bt-online-compendium.character' as const
export const CHARACTER_SCHEMA_VERSION = 1 as const

export interface SavedCharacterEnvelope {
  format: typeof CHARACTER_FILE_FORMAT
  schemaVersion: typeof CHARACTER_SCHEMA_VERSION
  exportedAt: string
  application: {
    name: 'BT Online Compendium'
    version: string
  }
  character: CharacterDefinition
}

