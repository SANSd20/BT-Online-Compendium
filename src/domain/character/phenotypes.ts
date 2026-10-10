import type { CharacterDefinition } from './model'

export interface PhenotypeDefinition {
  id: string
  displayName: string
  modifiers: Readonly<Record<string, number>>
  maximums: Readonly<Record<string, number>>
  bonusTraitIds: readonly string[]
  clanOnly: boolean
}

export const PHENOTYPE_DEFINITIONS: readonly PhenotypeDefinition[] = [
  { id: 'phenotype.normal-human', displayName: 'Normal Human', modifiers: {}, maximums: { STR: 8, BOD: 8, DEX: 8, RFL: 8, INT: 8, WIL: 8, CHA: 9, EDG: 9 }, bonusTraitIds: [], clanOnly: false },
  { id: 'phenotype.aerospace', displayName: 'Aerospace', modifiers: { STR: -1, BOD: -1, DEX: 2, RFL: 2 }, maximums: { STR: 7, BOD: 7, DEX: 9, RFL: 9, INT: 9, WIL: 8, CHA: 8, EDG: 8 }, bonusTraitIds: ['trait.g-tolerance', 'trait.glass-jaw', 'trait.field-aptitude.clan-fighter-pilot'], clanOnly: true },
  { id: 'phenotype.elemental', displayName: 'Elemental', modifiers: { STR: 2, BOD: 1, DEX: -1 }, maximums: { STR: 9, BOD: 9, DEX: 7, RFL: 8, INT: 8, WIL: 9, CHA: 8, EDG: 8 }, bonusTraitIds: ['trait.toughness', 'trait.field-aptitude.elemental'], clanOnly: true },
  { id: 'phenotype.mechwarrior', displayName: 'MechWarrior', modifiers: { DEX: 1, RFL: 1 }, maximums: { STR: 8, BOD: 8, DEX: 9, RFL: 9, INT: 8, WIL: 8, CHA: 9, EDG: 8 }, bonusTraitIds: ['trait.field-aptitude.clan-mechwarrior'], clanOnly: true },
]

export const NORMAL_HUMAN_PHENOTYPE_ID = 'phenotype.normal-human'

export function getPhenotypeDefinition(id: string): PhenotypeDefinition | undefined {
  return PHENOTYPE_DEFINITIONS.find((entry) => entry.id === id)
}

export function phenotypeForCharacter(character: Pick<CharacterDefinition, 'phenotypeId'>): PhenotypeDefinition {
  return getPhenotypeDefinition(character.phenotypeId) ?? PHENOTYPE_DEFINITIONS[0]
}
