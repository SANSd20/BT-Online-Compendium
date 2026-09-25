import type { CharacterDefinition, CreationMethod } from '../domain/character/model'
import { APP_VERSION } from '../appMetadata'
import { getCoreArchetype } from '../domain/archetypes/coreArchetypes'
import { getLifeModule } from '../domain/lifeModules/catalog'
import { XP_COST_TABLE_SOURCE } from '../domain/pointBuy/catalog'
import { calculateArchetypeAdjustmentNetXp, evaluateSharedXpAccounting } from '../domain/pointBuy/calculations'
import { validateCharacter } from '../validation/validateCharacter'
import {
  CHARACTER_FILE_FORMAT,
  CHARACTER_SCHEMA_VERSION,
  type SavedCharacterEnvelope,
} from './schema'

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
  if (character.creation.method === 'archetype' && calculateArchetypeAdjustmentNetXp(character) !== 0) {
    throw new Error('Unbalanced Controlled Archetype Adjustments cannot be saved or exported.')
  }
  if (character.creation.method === 'archetype') {
    const validation = validateCharacter(character)
    if (!validation.valid) {
      throw new Error(`Invalid Archetype foundation cannot be saved or exported: ${validation.issues.filter((item) => item.severity === 'error').map((item) => item.message).join(' ')}`)
    }
  }
  const envelope: SavedCharacterEnvelope = {
    format: CHARACTER_FILE_FORMAT,
    schemaVersion: CHARACTER_SCHEMA_VERSION,
    exportedAt,
    application: { name: 'BT Online Compendium', version: APP_VERSION },
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
  migrateAlphaArchetypeState(parsed.character)
  migrateAlphaLifeModuleState(parsed.character)
  const validation = validateCharacter(parsed.character)
  if (!validation.valid) {
    throw new Error(`Character file failed validation: ${validation.issues.map((item) => item.message).join(' ')}`)
  }
  return parsed.character
}

function migrateAlphaArchetypeState(character: CharacterDefinition): void {
  const state = character.creation.archetype
  if (!state) return
  const version = (state as { version?: number }).version
  if (version === 2) return

  let definition
  try { definition = getCoreArchetype(state.archetypeId) } catch { return }
  const evaluatedAllocation = evaluateSharedXpAccounting(character)
  const foundationProvenanceId = character.provenance.find((entry) => (
    entry.source?.sourceId === state.source.sourceId && entry.source?.page === state.source.page
  ))?.id ?? ''

  Object.assign(state, {
    version: 2,
    kind: 'source-backed-preset',
    foundationProvenanceId,
    accounting: {
      model: 'shared-point-buy',
      costTableSource: { ...XP_COST_TABLE_SOURCE },
      publishedXpTotal: definition.publishedXpTotal,
      evaluatedAllocation,
      differenceFromPublishedXp: evaluatedAllocation.totalXp - definition.publishedXpTotal,
    },
    adjustmentLedger: [],
    customizationStatus: 'original-package',
  })
}

function migrateAlphaLifeModuleState(character: CharacterDefinition): void {
  const state = character.creation.lifeModules
  if (!state) return
  state.awardResolutionVersion ??= 0
  state.resolvedAwards ??= []
  state.selectedSkillFields ??= []
  state.stopState ??= 'not-eligible'
  state.choiceGrantRequirements ??= state.pendingAwards.map((pending) => ({
    moduleId: pending.moduleId,
    awardId: pending.awardId,
    requiredGrants: pending.remainingGrants,
  }))
  state.pendingAwards.forEach((pending) => {
    let award
    try { award = getLifeModule(pending.moduleId).awards.find((entry) => entry.id === pending.awardId) } catch { return }
    if (!award) return
    pending.allocationMode ??= award.kind === 'flexible-xp' && award.allocationMode === 'pool' ? 'pool' : 'fixed-grants'
    if (award.kind === 'language-choice') {
      pending.choiceSource ??= award.choicesFrom
      pending.requiredSkillId ??= 'skill.language'
    }
    if (award.kind === 'affiliation-skill-choice' || award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice') pending.requiredSkillId ??= award.skillId
  })
  character.lifeModuleHistory.forEach((entry) => {
    let definition
    try { definition = getLifeModule(entry.moduleId) } catch { return }
    entry.chronologyYears ??= definition.chronologyYears
    entry.repeatPolicy ??= definition.repeatPolicy ? structuredClone(definition.repeatPolicy) : undefined
  })
}
