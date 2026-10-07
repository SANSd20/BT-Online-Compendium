import type { CharacterDefinition, CreationMethod } from '../domain/character/model'
import { APP_PUBLIC_TITLE, APP_VERSION } from '../appMetadata'
import { getCoreArchetype } from '../domain/archetypes/coreArchetypes'
import { CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID, getLifeModule, UNIVERSAL_STAGE_0_ID } from '../domain/lifeModules/catalog'
import { STANDARD_SKILL_XP_COSTS, XP_COST_TABLE_SOURCE } from '../domain/pointBuy/catalog'
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
    application: { name: APP_PUBLIC_TITLE, version: APP_VERSION },
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
  migrateDrivingAliases(parsed.character)
  const validation = validateCharacter(parsed.character)
  if (!validation.valid) {
    throw new Error(`Character file failed validation: ${validation.issues.map((item) => item.message).join(' ')}`)
  }
  return parsed.character
}

const DRIVING_ALIASES: Record<string, string> = {
  Ground: 'Ground Vehicles',
  'Ground Car': 'Ground Vehicles',
  'Ground Vehicle': 'Ground Vehicles',
}

function canonicalDrivingSubject(value: string): string {
  return DRIVING_ALIASES[value] ?? value
}

function migrateDrivingAliases(character: CharacterDefinition): void {
  const canonicalizeDestination = (destination: { targetId: string; displayName: string; parameter?: { value: string } }) => {
    if (destination.targetId !== 'skill.driving' || !destination.parameter) return
    const value = canonicalDrivingSubject(destination.parameter.value)
    destination.parameter.value = value
    destination.displayName = `Driving/${value}`
  }
  const merged = new Map<string, CharacterDefinition['skills'][number]>()
  for (const entry of character.skills) {
    if (entry.address.skillId === 'skill.driving' && entry.address.parameter) {
      entry.address.parameter.value = canonicalDrivingSubject(entry.address.parameter.value)
      entry.displayName = `Driving/${entry.address.parameter.value}`
    }
    const key = `${entry.address.skillId}/${entry.address.parameter?.kind ?? ''}/${entry.address.parameter?.value.toLowerCase() ?? ''}`
    const existing = merged.get(key)
    if (!existing) merged.set(key, entry)
    else {
      existing.accumulatedXp += entry.accumulatedXp
      existing.sourceAwards.push(...entry.sourceAwards)
      existing.level = existing.accumulatedXp < STANDARD_SKILL_XP_COSTS[0]
        ? null
        : STANDARD_SKILL_XP_COSTS.reduce((level, threshold, index) => existing.accumulatedXp >= threshold ? index : level, 0)
    }
  }
  character.skills = [...merged.values()]
  const state = character.creation.lifeModules
  state?.resolvedAwards.forEach((entry) => canonicalizeDestination(entry.destination))
  state?.selectedSkillFields.forEach((field) => {
    field.variableSkillChoices?.forEach((choice) => canonicalizeDestination(choice.destination))
    field.prerequisiteSkillChoices?.forEach((choice) => canonicalizeDestination(choice.destination))
  })
  state?.pendingAwards.forEach((pending) => {
    pending.allowedDestinationKeys = pending.allowedDestinationKeys?.map((key) => key.replace(/^skill\.driving\/(?:Ground|Ground Car|Ground Vehicle)(?=\/|$)/, 'skill.driving/Ground Vehicles'))
  })
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
  if (state.pendingAwards.length === 0 && state.phase.endsWith('-prerequisite-review')) {
    const migratedStop = state.currentStage === 4 ? 'alpha-stage-4-stop'
      : state.currentStage === 3 ? 'alpha-stage-3-stop'
        : state.currentStage === 2 ? 'alpha-stage-2-stop'
          : 'alpha-partial-stop'
    state.phase = migratedStop
    state.stopState = migratedStop
  }
  if (
    !state.stage0AffiliationContext &&
    state.selectedModuleIds.includes(UNIVERSAL_STAGE_0_ID) &&
    state.affiliationLanguage
  ) {
    state.stage0AffiliationContext = CAPELLAN_COMMONALITY_ID
  }
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
  migrateCrucisArtResolution(character)
}

function migrateCrucisArtResolution(character: CharacterDefinition): void {
  const state = character.creation.lifeModules
  if (!state?.selectedModuleIds.includes(FEDERATED_SUNS_CRUCIS_MARCH_ID)) return
  if (state.resolvedAwards.some((entry) => entry.moduleId === FEDERATED_SUNS_CRUCIS_MARCH_ID && entry.awardId === 'crucis.skill.art')) return
  const art = character.skills.find((entry) => entry.address.skillId === 'skill.art' && entry.address.parameter?.value === 'Painting')
  const history = character.lifeModuleHistory.find((entry) => entry.moduleId === FEDERATED_SUNS_CRUCIS_MARCH_ID)
  const provenanceId = history?.provenanceIds[0]
  if (!art || !provenanceId || !art.sourceAwards.some((award) => award.provenanceId === provenanceId && award.xp === 10)) return
  const source = getLifeModule(FEDERATED_SUNS_CRUCIS_MARCH_ID).source
  if (!state.choiceGrantRequirements.some((entry) => entry.moduleId === FEDERATED_SUNS_CRUCIS_MARCH_ID && entry.awardId === 'crucis.skill.art')) {
    state.choiceGrantRequirements.push({ moduleId: FEDERATED_SUNS_CRUCIS_MARCH_ID, awardId: 'crucis.skill.art', requiredGrants: 1 })
  }
  state.resolvedAwards.push({
    id: `migrated-crucis-art-${provenanceId}`,
    moduleId: FEDERATED_SUNS_CRUCIS_MARCH_ID,
    awardId: 'crucis.skill.art',
    kind: 'any-skill-choice',
    xp: 10,
    destination: { type: 'skill', targetId: 'skill.art', displayName: 'Art/Painting', parameter: { kind: 'subskill', value: 'Painting' } },
    provenanceId,
    resolvedAt: history?.selectedAt ?? character.updatedAt,
    source: { ...source },
  })
  const choiceId = `${FEDERATED_SUNS_CRUCIS_MARCH_ID}/crucis.skill.art/skill/skill.art/subskill/painting/{}`
  if (!character.creation.resolvedChoiceIds.includes(choiceId)) character.creation.resolvedChoiceIds.push(choiceId)
}
