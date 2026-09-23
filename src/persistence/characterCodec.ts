import type { CharacterDefinition, CreationMethod } from '../domain/character/model'
import { validateCharacter } from '../validation/validateCharacter'
import {
  CHARACTER_FILE_FORMAT,
  CHARACTER_SCHEMA_VERSION,
  type SavedCharacterEnvelope,
} from './schema'

const APPLICATION_VERSION = '0.1.0-beta.4'
const CREATION_METHODS: CreationMethod[] = ['archetype', 'point-buy', 'life-modules']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assertEnvelope(value: unknown): asserts value is SavedCharacterEnvelope {
  if (!isRecord(value)) throw new Error('Character file must contain a JSON object.')
  if (value.format !== CHARACTER_FILE_FORMAT) throw new Error('Unsupported character file format.')
  if (value.schemaVersion !== CHARACTER_SCHEMA_VERSION) throw new Error('Unsupported character schema version.')
  if (!isRecord(value.character)) throw new Error('Character file is missing character data.')

  const character = value.character
  if (typeof character.id !== 'string' || typeof character.displayName !== 'string') {
    throw new Error('Character identity data is invalid.')
  }
  if (!isRecord(character.creation) || !CREATION_METHODS.includes(character.creation.method as CreationMethod)) {
    throw new Error('Character creation method is invalid.')
  }
  if (!isRecord(character.creation.rulesSnapshot) || !Array.isArray(character.creation.rulesSnapshot.sources)) {
    throw new Error('Character rules snapshot is invalid.')
  }
  if (!isRecord(character.xp) || !isRecord(character.xp.creation)) {
    throw new Error('Character XP state is invalid.')
  }
  if (!Array.isArray(character.skills) || !Array.isArray(character.traits) || !Array.isArray(character.attributes)) {
    throw new Error('Character ledger data is invalid.')
  }
  if (!isRecord(character.identities) || !Array.isArray(character.identities.entries)) {
    throw new Error('Character identity collection is invalid.')
  }
  if (
    !Array.isArray(character.affiliations) ||
    !Array.isArray(character.lifeModuleHistory) ||
    !Array.isArray(character.chronology) ||
    !Array.isArray(character.inventory) ||
    !Array.isArray(character.vehicles) ||
    !Array.isArray(character.provenance) ||
    typeof character.phenotypeId !== 'string' ||
    typeof character.cBills !== 'number'
  ) {
    throw new Error('Character definition is incomplete.')
  }
}

export function encodeCharacter(character: CharacterDefinition, exportedAt = new Date().toISOString()): string {
  const envelope: SavedCharacterEnvelope = {
    format: CHARACTER_FILE_FORMAT,
    schemaVersion: CHARACTER_SCHEMA_VERSION,
    exportedAt,
    application: { name: 'BT Online Compendium', version: APPLICATION_VERSION },
    character,
  }
  return JSON.stringify(envelope, null, 2)
}

export function decodeCharacter(json: string): CharacterDefinition {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('Character file is not valid JSON.')
  }

  assertEnvelope(parsed)
  const validation = validateCharacter(parsed.character)
  if (!validation.valid) {
    throw new Error(`Character file failed validation: ${validation.issues.map((item) => item.message).join(' ')}`)
  }
  return parsed.character
}
