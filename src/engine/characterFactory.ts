import type { CharacterDefinition, CreationMethod } from '../domain/character/model'
import { createRulesSnapshot } from '../domain/rules/catalog'

export interface CharacterFactoryDependencies {
  now: () => string
  id: () => string
}

function defaultId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `character-${Date.now()}-${Math.random()}`
}

const defaultDependencies: CharacterFactoryDependencies = {
  now: () => new Date().toISOString(),
  id: defaultId,
}

export function createCharacterDraft(
  method: CreationMethod,
  displayName: string,
  dependencies: CharacterFactoryDependencies = defaultDependencies,
): CharacterDefinition {
  const now = dependencies.now()
  const characterId = dependencies.id()
  const primaryIdentityId = dependencies.id()
  const provenanceId = dependencies.id()

  return {
    id: characterId,
    displayName: displayName.trim(),
    createdAt: now,
    updatedAt: now,
    creation: {
      method,
      status: 'draft',
      rulesSnapshot: createRulesSnapshot(now),
      resolvedChoiceIds: [],
      gmExceptions: [],
    },
    xp: {
      creation: { starting: 0, remaining: 0, allocated: 0 },
      earnedGameplayUnspent: 0,
    },
    attributes: [],
    traits: [],
    skills: [],
    identities: {
      primaryIdentityId,
      entries: [{ id: primaryIdentityId, name: displayName.trim() || 'Primary identity', kind: 'primary' }],
    },
    affiliations: [],
    phenotypeId: 'phenotype.normal-human',
    lifeModuleHistory: [],
    chronology: [],
    inventory: [],
    cBills: 0,
    vehicles: [],
    provenance: [
      {
        id: provenanceId,
        kind: 'player-choice',
        description: `Created ${method} draft`,
      },
    ],
  }
}

