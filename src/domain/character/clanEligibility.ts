import type { CharacterDefinition } from './model'
import { getPhenotypeDefinition } from './phenotypes'
import { isHomeworldClanId, type HomeworldClanId } from './clanIdentity'
import { HOMEWORLD_CLAN_PACKAGES } from './clanPackages'
import { validateClanSubAffiliationDraft } from './clanSubAffiliation'

export type ClanEligibilityStatus = 'ELIGIBLE' | 'INELIGIBLE' | 'UNRESOLVED_REQUIRED_CHOICE' | 'UNSUPPORTED_DEPENDENCY'
export interface ClanEligibilityResult { status: ClanEligibilityStatus; clanId: HomeworldClanId; reasons: string[]; source: { sourceId: string; edition: string; page: number; ruleId: string } }

const OPPOSING_TRAITS: Readonly<Record<string, string>> = {
  'Combat Sense': 'Combat Paralysis', 'Combat Paralysis': 'Combat Sense', 'Fast Learner': 'Slow Learner', 'Slow Learner': 'Fast Learner',
  Fit: 'Handicap', Handicap: 'Fit', Patient: 'Impatient', Impatient: 'Patient', Introvert: 'Gregarious', Gregarious: 'Introvert',
}

function hasTrait(character: CharacterDefinition, displayName: string): boolean {
  return character.traits.some((entry) => entry.displayName === displayName || entry.displayName?.endsWith(`/${displayName}`) === true)
}

export function evaluateHomeworldClanEligibility(character: CharacterDefinition, clanId: string = character.clanSubAffiliationDraft?.clanId ?? ''): ClanEligibilityResult {
  const source = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 70, ruleId: 'homeworld-clan-eligibility' }
  const reasons: string[] = []
  if (!isHomeworldClanId(clanId)) return { status: 'INELIGIBLE', clanId: 'blood-spirit', reasons: ['Specific Clan identity is missing or invalid.'], source }
  if (!character.clanIdentity || character.clanIdentity.id !== 'affiliation.clan') reasons.push('Canonical Clan affiliation is required.')
  const phenotype = getPhenotypeDefinition(character.phenotypeId)
  if (!phenotype) reasons.push('Phenotype is missing or unknown.')
  else if (!phenotype.clanOnly) reasons.push('A source-defined Clan Phenotype is required.')
  const pkg = HOMEWORLD_CLAN_PACKAGES.find((entry) => entry.identity.id === clanId)!
  const draftIssues = validateClanSubAffiliationDraft(character.clanSubAffiliationDraft)
  const unresolved = pkg.choices.length > 0 && draftIssues.some((issue) => issue.startsWith('Required Clan choice'))
  if (draftIssues.some((issue) => !issue.startsWith('Required Clan choice'))) reasons.push(...draftIssues.filter((issue) => !issue.startsWith('Required Clan choice')))
  for (const choice of character.clanSubAffiliationDraft?.choices ?? []) {
    for (const destination of choice.selectedDestinations) {
      const opposing = OPPOSING_TRAITS[destination]
      if (opposing && hasTrait(character, opposing)) reasons.push(`Trait choice ${destination} conflicts with existing ${opposing}.`)
    }
  }
  if (reasons.length > 0) return { status: 'INELIGIBLE', clanId, reasons, source }
  if (unresolved) return { status: 'UNRESOLVED_REQUIRED_CHOICE', clanId, reasons: ['One or more required specific-Clan choices are unresolved.'], source }
  return { status: 'ELIGIBLE', clanId, reasons: [], source }
}
