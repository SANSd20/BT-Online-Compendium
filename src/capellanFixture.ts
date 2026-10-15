import type { CharacterDefinition } from './domain/character/model'
import { CAPELLAN_COMMONALITY_ID, SIAN_COMMONALITY_ID } from './domain/lifeModules/catalog'
import { applyStage0Affiliation, createLifeModuleCharacter } from './engine/lifeModuleEngine'

export function createSianCitizenCharacter(name: string, startingXp = 5000): CharacterDefinition {
  return applyStage0Affiliation(
    createLifeModuleCharacter(name, startingXp),
    CAPELLAN_COMMONALITY_ID,
    'Mandarin Chinese',
    'Russian',
    undefined,
    undefined,
    'no',
    undefined,
    undefined,
    undefined,
    SIAN_COMMONALITY_ID,
  )
}

/** Test-only adapter for fixtures that already model a Capellan Stage 0 path. */
export function asCapellanCitizen(character: CharacterDefinition): CharacterDefinition {
  if (character.traits.some((entry) => entry.traitId === 'trait.citizenship' && entry.active && entry.accumulatedXp >= 50)) return character
  const source = createSianCitizenCharacter(`${character.displayName} Citizenship Fixture`)
  const citizenship = source.traits.find((entry) => entry.traitId === 'trait.citizenship')
  if (!citizenship) throw new Error('Sian Citizenship fixture is missing its source-backed award.')
  const provenanceIds = new Set(character.provenance.map((entry) => entry.id))
  for (const provenance of source.provenance) {
    if (citizenship.sourceAwards.some((award) => award.provenanceId === provenance.id) && !provenanceIds.has(provenance.id)) character.provenance.push(structuredClone(provenance))
  }
  character.traits.push(structuredClone(citizenship))
  return character
}
