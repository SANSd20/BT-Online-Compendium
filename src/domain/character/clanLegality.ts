import type { CharacterDefinition } from './model'
import type { SourceCitation } from '../rules/model'
import { isHomeworldClanId } from './clanIdentity'
import { HOMEWORLD_CLAN_PACKAGES } from './clanPackages'
import { resolveClanDestination } from './clanDestinations'
import { getPhenotypeDefinition } from './phenotypes'

export type ClanLegalityStatus = 'ELIGIBLE' | 'INELIGIBLE' | 'UNRESOLVED_REQUIRED_CHOICE' | 'UNSUPPORTED_DEPENDENCY'
export interface ClanLegalityFinding { id: string; status: ClanLegalityStatus; reason: string; source: SourceCitation; context?: Record<string, string | number | boolean> }

const SOURCE = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 70, ruleId: 'homeworld-clan-legality' }
const OPPOSING_TRAITS: Readonly<Record<string, string>> = { 'Combat Sense': 'Combat Paralysis', 'Combat Paralysis': 'Combat Sense', 'Fast Learner': 'Slow Learner', 'Slow Learner': 'Fast Learner', Fit: 'Handicap', Handicap: 'Fit', Patient: 'Impatient', Impatient: 'Patient', Introvert: 'Gregarious', Gregarious: 'Introvert' }

function hasTrait(character: CharacterDefinition, subject: string): boolean {
  return character.traits.some((entry) => entry.displayName === subject || entry.displayName?.endsWith(`/${subject}`) === true || entry.traitId === subject)
}

export function evaluateClanDestinationLegality(character: CharacterDefinition, destination: string): ClanLegalityFinding {
  const resolved = resolveClanDestination(destination)
  if (resolved.status === 'UNSUPPORTED_DESTINATION' || resolved.status === 'SOURCE_AMBIGUITY') return { id: 'destination.unsupported', status: 'UNSUPPORTED_DEPENDENCY', reason: resolved.reason ?? 'Destination is not source-resolvable.', source: SOURCE }
  const opposing = resolved.family === 'trait' ? OPPOSING_TRAITS[destination] : undefined
  if (opposing && hasTrait(character, opposing)) return { id: 'trait.opposition', status: 'INELIGIBLE', reason: `${destination} conflicts with existing ${opposing}.`, source: SOURCE, context: { opposing } }
  if (resolved.family === 'language' && character.skills.some((entry) => entry.address.skillId === 'skill.language' && entry.address.parameter?.value === resolved.subject)) return { id: 'language.duplicate', status: 'INELIGIBLE', reason: `Language/${resolved.subject} is already present as a concrete Skill.`, source: SOURCE }
  return { id: `destination.${resolved.canonicalId}`, status: 'ELIGIBLE', reason: 'Destination is concrete and has no detected opposition or duplicate.', source: SOURCE }
}

export function evaluateHomeworldClanLegality(character: CharacterDefinition, clanId: string): ClanLegalityFinding[] {
  if (!isHomeworldClanId(clanId)) return [{ id: 'clan.identity.invalid', status: 'INELIGIBLE', reason: 'Specific Clan identity is invalid.', source: SOURCE }]
  const findings: ClanLegalityFinding[] = []
  if (!character.clanIdentity || character.clanIdentity.id !== 'affiliation.clan') findings.push({ id: 'clan.identity.required', status: 'INELIGIBLE', reason: 'Canonical Clan affiliation is required.', source: SOURCE })
  const phenotype = getPhenotypeDefinition(character.phenotypeId)
  if (!phenotype) findings.push({ id: 'phenotype.required', status: 'UNRESOLVED_REQUIRED_CHOICE', reason: 'A concrete Phenotype is required.', source: { ...SOURCE, page: 121, ruleId: 'clan-phenotype-requirement' } })
  else if (!phenotype.clanOnly) findings.push({ id: 'phenotype.invalid', status: 'INELIGIBLE', reason: 'The selected Phenotype is not a Clan Phenotype.', source: { ...SOURCE, page: 121, ruleId: 'clan-phenotype-requirement' } })
  if (!character.clanCaste) findings.push({ id: 'caste.required', status: 'UNRESOLVED_REQUIRED_CHOICE', reason: 'Canonical Clan caste context is required.', source: { ...SOURCE, page: 71, ruleId: 'clan-caste-requirement' } })
  if (!character.clanCareerContext) findings.push({ id: 'service-era.unsupported', status: 'UNSUPPORTED_DEPENDENCY', reason: 'The source service-era condition is preserved, but no canonical service-era context exists in the character model.', source: { ...SOURCE, ruleId: 'service-era-condition' } })
  const pkg = HOMEWORLD_CLAN_PACKAGES.find((entry) => entry.identity.id === clanId)!
  const draft = character.clanSubAffiliationDraft
  for (const choice of pkg.choices) {
    const selected = draft?.choices.find((entry) => entry.choiceId === choice.id)
    if (!selected) findings.push({ id: `choice.${choice.id}.required`, status: 'UNRESOLVED_REQUIRED_CHOICE', reason: `Required governed choice ${choice.id} is unresolved.`, source: choice.source })
    else for (const destination of selected.selectedDestinations) findings.push(evaluateClanDestinationLegality(character, destination))
  }
  return findings
}
