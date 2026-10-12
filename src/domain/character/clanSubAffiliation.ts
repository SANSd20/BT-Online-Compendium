import type { SourceCitation } from '../rules/model'
import { HOMEWORLD_CLAN_IDS, type HomeworldClanId, isHomeworldClanId } from './clanIdentity'
import { HOMEWORLD_CLAN_PACKAGES } from './clanPackages'
import { resolveClanDestination } from './clanDestinations'

export const CLAN_SUB_AFFILIATION_PACKAGE_PREFIX = 'stage0.clan-sub-affiliation.' as const
export type ClanSubAffiliationPackageId = `${typeof CLAN_SUB_AFFILIATION_PACKAGE_PREFIX}${HomeworldClanId}`
export type ClanChoiceDraftStatus = 'incomplete' | 'ready' | 'invalid'

export interface ClanChoiceDraft {
  id: string
  packageId: ClanSubAffiliationPackageId
  choiceId: string
  requiredCount: number
  selectedDestinations: readonly string[]
  status: ClanChoiceDraftStatus
  source: SourceCitation
}

export interface ClanSubAffiliationDraftState {
  version: 1
  clanId: HomeworldClanId
  category: 'homeworld-clan'
  packageId: ClanSubAffiliationPackageId
  choices: readonly ClanChoiceDraft[]
  status: ClanChoiceDraftStatus
  source: SourceCitation
}

export function clanSubAffiliationPackageId(clanId: HomeworldClanId): ClanSubAffiliationPackageId {
  return `${CLAN_SUB_AFFILIATION_PACKAGE_PREFIX}${clanId}`
}

export function isClanSubAffiliationPackageId(value: unknown): value is ClanSubAffiliationPackageId {
  return typeof value === 'string' && value.startsWith(CLAN_SUB_AFFILIATION_PACKAGE_PREFIX) && isHomeworldClanId(value.slice(CLAN_SUB_AFFILIATION_PACKAGE_PREFIX.length))
}

export function createClanSubAffiliationDraft(clanId: HomeworldClanId): ClanSubAffiliationDraftState {
  const pkg = HOMEWORLD_CLAN_PACKAGES.find((entry) => entry.identity.id === clanId)
  if (!pkg) throw new Error(`Unknown Homeworld Clan identity: ${clanId}`)
  return { version: 1, clanId, category: 'homeworld-clan', packageId: clanSubAffiliationPackageId(clanId), choices: [], status: pkg.choices.length === 0 ? 'ready' : 'incomplete', source: { ...pkg.identity.source, ruleId: 'homeworld-clan-sub-affiliation-choice-state' } }
}

export function replaceClanSubAffiliationDraft(draft: ClanSubAffiliationDraftState | undefined, clanId: HomeworldClanId): ClanSubAffiliationDraftState {
  if (!draft || draft.clanId !== clanId) return createClanSubAffiliationDraft(clanId)
  return structuredClone(draft)
}

export function validateClanSubAffiliationDraft(draft: ClanSubAffiliationDraftState | undefined): string[] {
  if (!draft) return []
  const issues: string[] = []
  const pkg = HOMEWORLD_CLAN_PACKAGES.find((entry) => entry.identity.id === draft.clanId)
  if (!pkg || draft.category !== 'homeworld-clan' || draft.packageId !== clanSubAffiliationPackageId(draft.clanId)) return ['Specific Clan draft identity or package relationship is invalid.']
  const seen = new Set<string>()
  for (const choice of draft.choices) {
    if (seen.has(choice.choiceId)) issues.push(`Duplicate Clan choice: ${choice.choiceId}`)
    seen.add(choice.choiceId)
    const definition = pkg.choices.find((entry) => entry.id === choice.choiceId)
    if (!definition || choice.packageId !== draft.packageId || choice.requiredCount !== definition.requiredCount || choice.selectedDestinations.length !== definition.requiredCount || choice.selectedDestinations.some((destination) => !definition.allowedSubjects.includes(destination))) issues.push(`Invalid or incomplete Clan choice: ${choice.choiceId}`)
    if (!choice.source.sourceId) issues.push(`Clan choice provenance is missing: ${choice.choiceId}`)
  }
  for (const definition of pkg.choices) if (!draft.choices.some((choice) => choice.choiceId === definition.id)) issues.push(`Required Clan choice is unresolved: ${definition.id}`)
  if (draft.status === 'ready' && issues.length > 0) issues.push('Clan draft cannot be ready while required choices are unresolved.')
  return issues
}

export function resolveClanChoiceDestination(clanId: HomeworldClanId, choiceId: string, destination: string): string {
  const pkg = HOMEWORLD_CLAN_PACKAGES.find((entry) => entry.identity.id === clanId)
  const choice = pkg?.choices.find((entry) => entry.id === choiceId)
  if (!choice || !choice.allowedSubjects.includes(destination)) throw new Error(`Unsupported or invalid Clan choice destination: ${destination}`)
  const resolved = resolveClanDestination(destination)
  if (resolved.status === 'UNSUPPORTED_DESTINATION' || resolved.status === 'SOURCE_AMBIGUITY') throw new Error(`Unsupported or invalid Clan choice destination: ${destination}`)
  return destination
}

export const SUPPORTED_CLAN_SUB_AFFILIATION_IDS = HOMEWORLD_CLAN_IDS
