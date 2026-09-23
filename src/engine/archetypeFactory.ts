import { calculateArchetypeXp, getCoreArchetype } from '../domain/archetypes/coreArchetypes'
import type { CharacterDefinition, XpAward } from '../domain/character/model'
import { createCharacterDraft, type CharacterFactoryDependencies } from './characterFactory'

export function createCharacterFromArchetype(
  archetypeId: string,
  displayName: string,
  dependencies?: CharacterFactoryDependencies,
): CharacterDefinition {
  const archetype = getCoreArchetype(archetypeId)
  const character = createCharacterDraft('archetype', displayName, dependencies)
  const primaryIdentityId = character.identities.primaryIdentityId
  const publishedProvenanceId = dependencies?.id() ?? defaultId()

  const award = (xp: number): XpAward => ({
    id: dependencies?.id() ?? defaultId(),
    xp,
    provenanceId: publishedProvenanceId,
  })

  character.creation.status = 'ready-for-final-validation'
  character.creation.resolvedChoiceIds = [archetype.id]
  character.creation.archetype = {
    archetypeId: archetype.id,
    displayName: archetype.displayName,
    source: { ...archetype.source },
    notes: archetype.notes.map((note) => ({ ...note })),
  }
  character.xp.creation = {
    starting: archetype.publishedXpTotal,
    remaining: 0,
    allocated: calculateArchetypeXp(archetype),
  }
  character.phenotypeId = archetype.phenotypeId
  character.cBills = archetype.cBills
  character.provenance.push({
    id: publishedProvenanceId,
    kind: 'published',
    description: `Core archetype package: ${archetype.displayName}`,
    source: { ...archetype.source },
  })
  character.attributes = archetype.attributes.map((entry) => ({
    attributeId: entry.attributeId,
    accumulatedXp: entry.xp,
    purchasedLevel: entry.purchasedLevel,
    phenotypeModifier: entry.phenotypeModifier,
    sourceAwards: [award(entry.xp)],
  }))
  character.traits = archetype.traits.map((entry) => ({
    traitId: entry.traitId,
    displayName: entry.displayName,
    accumulatedXp: entry.xp,
    attainedTp: entry.tp,
    active: true,
    ...(entry.identityBound ? { identityId: primaryIdentityId } : {}),
    parameters: { ...entry.parameters },
    sourceAwards: [award(entry.xp)],
  }))
  character.skills = archetype.skills.map((entry) => ({
    address: {
      ...entry.address,
      ...(entry.address.parameter ? { parameter: { ...entry.address.parameter } } : {}),
    },
    accumulatedXp: entry.xp,
    displayName: entry.displayName,
    level: entry.level,
    ...(entry.specialty ? { specialty: entry.specialty } : {}),
    ...(entry.notes ? { notes: [...entry.notes] } : {}),
    sourceAwards: [award(entry.xp)],
  }))
  character.inventory = archetype.equipment.map((entry) => ({
    id: dependencies?.id() ?? defaultId(),
    catalogItemId: entry.catalogItemId,
    displayName: entry.displayName,
    quantity: entry.quantity,
    ownership: entry.ownership,
    ...(entry.publishedOwnershipLabel
      ? { publishedOwnershipLabel: entry.publishedOwnershipLabel }
      : {}),
    publishedCostCBills: entry.costCBills,
    ...(entry.additionalCostCBills !== undefined
      ? { publishedAdditionalCostCBills: entry.additionalCostCBills }
      : {}),
    publishedWeightKg: entry.publishedWeightKg,
    rulesPages: [...entry.rulesPages],
    source: { ...archetype.source },
    ...(entry.notes ? { notes: [...entry.notes] } : {}),
    carried: null,
    provenanceId: publishedProvenanceId,
  }))

  return character
}

function defaultId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `archetype-${Date.now()}-${Math.random()}`
}
